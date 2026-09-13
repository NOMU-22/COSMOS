import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Booking, User } from "@/types";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
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
      offerCode,
      specialRequests,
    } = body;

    if (!zoneId || !bookingDate || !startTime || !durationHours) {
      return NextResponse.json(
        { error: "Missing required booking details (zone, date, time, duration)" },
        { status: 400 }
      );
    }

    const zone = db.findOne("gaming_zones", (z) => z.id === zoneId);
    if (!zone) {
      return NextResponse.json({ error: "Invalid gaming zone" }, { status: 404 });
    }

    const startH = parseInt(startTime.split(":")[0], 10);
    const endH = startH + parseInt(durationHours, 10);
    const endTimeStr = endH.toString().padStart(2, "0") + ":00";

    // 1. Check real station availability
    const stations = db.findMany(
      "stations",
      (s) => s.zoneId === zoneId && s.status === "AVAILABLE"
    );

    const existingBookings = db.findMany(
      "bookings",
      (b) =>
        b.bookingDate === bookingDate &&
        b.zoneId === zoneId &&
        b.bookingStatus !== "CANCELLED"
    );

    const availableStations = stations.filter((station) => {
      const hasConflict = existingBookings.some((b) => {
        if (b.stationId === station.id) {
          const bStart = parseInt(b.startTime.split(":")[0], 10);
          const bEnd = parseInt(b.endTime.split(":")[0], 10);
          return startH < bEnd && endH > bStart;
        }
        return false;
      });
      return !hasConflict;
    });

    const neededStations = parseInt(playersCount || "1", 10);
    if (availableStations.length < neededStations) {
      return NextResponse.json(
        {
          error: `Sorry, this slot only has ${availableStations.length} station(s) available. Please choose another time.`,
        },
        { status: 409 }
      );
    }

    const assignedStation = availableStations[0];

    // 2. Pricing and Discounts calculation
    const subtotal = zone.hourlyRate * parseInt(durationHours, 10) * neededStations;
    let discountAmount = 0;
    let validOffer = null;

    if (offerCode) {
      const offer = db.findOne(
        "offers",
        (o) =>
          o.code.toUpperCase() === offerCode.toUpperCase() &&
          o.status === "PUBLISHED" &&
          new Date(o.endDate) >= new Date()
      );

      if (offer) {
        if (!offer.applicableZone || offer.applicableZone === zoneId) {
          if (!offer.minDurationHours || parseInt(durationHours, 10) >= offer.minDurationHours) {
            validOffer = offer;
            if (offer.discountType === "PERCENTAGE") {
              discountAmount = Math.round((subtotal * offer.discountValue) / 100);
            } else {
              discountAmount = Math.min(offer.discountValue, subtotal);
            }
          }
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount);

    // 3. User identification
    let userId = user?.id;
    if (!userId) {
      // Find or create customer
      const existingUser = db.findOne(
        "users",
        (u) =>
          (customerPhone && u.phone === customerPhone) ||
          (customerEmail && u.email === customerEmail)
      );

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const newUser: User = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: customerName || "Cosmos Guest",
          phone: customerPhone || null,
          email: customerEmail || null,
          passwordHash: null,
          role: "CUSTOMER",
          isEmailVerified: Boolean(customerEmail),
          isPhoneVerified: Boolean(customerPhone),
          cosmosXp: 50,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.insert("users", newUser);
        userId = newUser.id;
      }
    }

    // 4. Generate unique reference e.g. CGM-2026-8742
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `CGM-${new Date().getFullYear()}-${randomSuffix}`;

    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      bookingRef,
      userId,
      customerName: customerName || user?.name || "Gamer",
      customerPhone: customerPhone || user?.phone || "",
      customerEmail: customerEmail || user?.email || "",
      zoneId,
      zoneName: zone.name,
      stationId: assignedStation.id,
      stationNumber: assignedStation.stationNumber,
      bookingDate,
      startTime: startTime.padStart(5, "0"),
      endTime: endTimeStr,
      durationHours: parseInt(durationHours, 10),
      playersCount: neededStations,
      subtotal,
      discountAmount,
      totalAmount,
      appliedOfferCode: validOffer ? validOffer.code : null,
      paymentMethod: paymentMethod || "UPI",
      paymentStatus: paymentMethod === "PAY_AT_VENUE" ? "PENDING" : "COMPLETED",
      bookingStatus: "CONFIRMED",
      specialRequests: specialRequests || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.insert("bookings", newBooking);

    // Award loyalty XP: 50 XP per hour
    const earnedXp = parseInt(durationHours, 10) * 50;
    const currentUser = db.findOne("users", (u) => u.id === userId);
    if (currentUser) {
      db.update("users", userId, { cosmosXp: (currentUser.cosmosXp || 0) + earnedXp });
    }

    return NextResponse.json({
      success: true,
      booking: newBooking,
      earnedXp,
      message: "Slot booked successfully!",
    });
  } catch (error: any) {
    console.error("Booking Creation Error:", error);
    return NextResponse.json({ error: "Failed to finalize booking" }, { status: 500 });
  }
}
