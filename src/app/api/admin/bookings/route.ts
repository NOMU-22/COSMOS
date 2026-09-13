import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Booking } from "@/types";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const zoneId = searchParams.get("zoneId");

    let bookings = db.findMany("bookings");

    if (date) {
      bookings = bookings.filter((b) => b.bookingDate === date);
    }
    if (status) {
      bookings = bookings.filter((b) => b.bookingStatus === status);
    }
    if (zoneId) {
      bookings = bookings.filter((b) => b.zoneId === zoneId);
    }

    return NextResponse.json({
      bookings: bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    });
  } catch (error: any) {
    console.error("Admin Bookings Error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      zoneId,
      bookingDate,
      startTime,
      durationHours,
      playersCount,
      paymentMethod,
      paymentStatus,
      bookingStatus,
      totalAmount,
      specialRequests,
    } = body;

    const zone = db.findOne("gaming_zones", (z) => z.id === zoneId);
    if (!zone) {
      return NextResponse.json({ error: "Invalid gaming zone" }, { status: 400 });
    }

    const startH = parseInt(startTime.split(":")[0], 10);
    const endH = startH + parseInt(durationHours || "1", 10);
    const endTimeStr = endH.toString().padStart(2, "0") + ":00";

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `CGM-WALK-${randomSuffix}`;

    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      bookingRef,
      userId: user.id,
      customerName: customerName || "Walk-in Gamer",
      customerPhone: customerPhone || "",
      customerEmail: customerEmail || "",
      zoneId,
      zoneName: zone.name,
      stationId: null,
      stationNumber: 1,
      bookingDate,
      startTime: startTime.padStart(5, "0"),
      endTime: endTimeStr,
      durationHours: parseInt(durationHours, 10),
      playersCount: parseInt(playersCount || "1", 10),
      subtotal: totalAmount || zone.hourlyRate * parseInt(durationHours, 10),
      discountAmount: 0,
      totalAmount: totalAmount || zone.hourlyRate * parseInt(durationHours, 10),
      appliedOfferCode: null,
      paymentMethod: paymentMethod || "UPI",
      paymentStatus: paymentStatus || "COMPLETED",
      bookingStatus: bookingStatus || "CONFIRMED",
      specialRequests: specialRequests || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.insert("bookings", newBooking);

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    console.error("Admin Create Booking Error:", error);
    return NextResponse.json({ error: "Failed to create manual booking" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const updated = db.update("bookings", id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    console.error("Admin Update Booking Error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
