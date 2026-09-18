import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = (await db
      .findMany(
        "bookings",
        (b) =>
          b.userId === user.id ||
          (user.phone ? b.customerPhone === user.phone : false) ||
          (user.email ? b.customerEmail === user.email : false)
      ))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentHourStr = now.getHours().toString().padStart(2, "0") + ":00";

    const upcoming = bookings.filter((b) => {
      if (b.bookingStatus === "CANCELLED") return false;
      if (b.bookingDate > todayStr) return true;
      if (b.bookingDate === todayStr && b.endTime >= currentHourStr) return true;
      return false;
    });

    const past = bookings.filter((b) => {
      if (b.bookingStatus === "CANCELLED") return true;
      if (b.bookingDate < todayStr) return true;
      if (b.bookingDate === todayStr && b.endTime < currentHourStr) return true;
      return false;
    });

    return NextResponse.json({
      bookings,
      upcoming,
      past,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cosmosXp: user.cosmosXp,
      },
    });
  } catch (error: any) {
    console.error("My Bookings Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
