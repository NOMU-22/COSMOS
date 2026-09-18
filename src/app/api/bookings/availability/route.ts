import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date"); // YYYY-MM-DD
    const zoneId = searchParams.get("zoneId");
    const durationHours = parseInt(searchParams.get("duration") || "1", 10);
    const playersCount = parseInt(searchParams.get("players") || "1", 10);

    if (!date || !zoneId) {
      return NextResponse.json(
        { error: "Date and Zone are required" },
        { status: 400 }
      );
    }

    const zone = await db.findOne("gaming_zones", (z) => z.id === zoneId);
    if (!zone) {
      return NextResponse.json({ error: "Invalid gaming zone" }, { status: 404 });
    }

    // Get all stations for this zone
    const stations = await db.findMany(
      "stations",
      (s) => s.zoneId === zoneId && s.status === "AVAILABLE"
    );

    // Get existing confirmed bookings for this date and zone
    const existingBookings = await db.findMany(
      "bookings",
      (b) =>
        b.bookingDate === date &&
        b.zoneId === zoneId &&
        b.bookingStatus !== "CANCELLED"
    );

    // Operational hours: 11:00 to 23:00 (11 AM to 11 PM)
    const openHour = 11;
    const closeHour = 23;
    const slots = [];

    for (let hour = openHour; hour <= closeHour - durationHours; hour++) {
      const startHourStr = hour.toString().padStart(2, "0") + ":00";
      const endHour = hour + durationHours;
      const endHourStr = endHour.toString().padStart(2, "0") + ":00";

      // Check each station's availability during [startHourStr, endHourStr]
      const availableStations = stations.filter((station) => {
        const hasConflict = existingBookings.some((b) => {
          // Check if same station is booked and intervals overlap
          if (b.stationId === station.id) {
            const bStart = parseInt(b.startTime.split(":")[0], 10);
            const bEnd = parseInt(b.endTime.split(":")[0], 10);
            return hour < bEnd && endHour > bStart;
          }
          return false;
        });
        return !hasConflict;
      });

      const isAvailable = availableStations.length >= playersCount;

      slots.push({
        startTime: startHourStr,
        endTime: endHourStr,
        availableStationsCount: availableStations.length,
        totalStationsCount: stations.length,
        isAvailable,
        availableStationIds: availableStations.map((s) => s.id),
      });
    }

    return NextResponse.json({
      date,
      zoneId,
      zoneName: zone.name,
      durationHours,
      slots,
    });
  } catch (error: any) {
    console.error("Availability calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate slot availability" },
      { status: 500 }
    );
  }
}
