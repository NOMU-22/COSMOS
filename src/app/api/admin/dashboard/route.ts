import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const allBookings = await db.findMany("bookings");
    const allCustomers = await db.findMany("users", (u) => u.role === "CUSTOMER");
    const activeOffers = await db.findMany("offers", (o) => o.status === "PUBLISHED");
    const upcomingEvents = await db.findMany("events", (e) => e.status !== "DRAFT");

    const todayBookings = allBookings.filter((b) => b.bookingDate === todayStr && b.bookingStatus !== "CANCELLED");
    const upcomingBookings = allBookings.filter((b) => b.bookingDate >= todayStr && b.bookingStatus !== "CANCELLED");
    
    const totalRevenue = allBookings
      .filter((b) => b.paymentStatus === "COMPLETED")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const todayRevenue = todayBookings
      .filter((b) => b.paymentStatus === "COMPLETED")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    return NextResponse.json({
      metrics: {
        totalRevenue,
        todayRevenue,
        totalBookings: allBookings.length,
        todayBookingsCount: todayBookings.length,
        upcomingBookingsCount: upcomingBookings.length,
        totalCustomers: allCustomers.length,
        activeOffersCount: activeOffers.length,
        upcomingEventsCount: upcomingEvents.length,
      },
      recentBookings: allBookings.slice(-8).reverse(),
      upcomingEvents,
      activeOffers,
    });
  } catch (error: any) {
    console.error("Admin Dashboard Error:", error);
    return NextResponse.json({ error: "Failed to fetch admin metrics" }, { status: 500 });
  }
}
