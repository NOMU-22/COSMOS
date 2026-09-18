import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await db.findOne("bookings", (b) => b.id === bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify ownership or admin role
    if (booking.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db.update("bookings", bookingId, {
      bookingStatus: "CANCELLED",
      paymentStatus: booking.paymentStatus === "COMPLETED" ? "REFUNDED" : "FAILED",
    });

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
      booking: updated,
    });
  } catch (error: any) {
    console.error("Booking Cancel Error:", error);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}
