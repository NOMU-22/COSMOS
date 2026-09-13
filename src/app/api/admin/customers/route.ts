import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";

    const customers = db.findMany("users", (u) => u.role === "CUSTOMER");
    const allBookings = db.findMany("bookings");

    const enrichedCustomers = customers.map((cust) => {
      const custBookings = allBookings.filter(
        (b) =>
          b.userId === cust.id ||
          (cust.phone && b.customerPhone === cust.phone) ||
          (cust.email && b.customerEmail === cust.email)
      );

      const totalSpent = custBookings
        .filter((b) => b.paymentStatus === "COMPLETED")
        .reduce((sum, b) => sum + b.totalAmount, 0);

      const upcoming = custBookings.filter(
        (b) => b.bookingStatus === "CONFIRMED" && b.bookingDate >= new Date().toISOString().split("T")[0]
      );
      const cancelled = custBookings.filter((b) => b.bookingStatus === "CANCELLED");

      return {
        id: cust.id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        isEmailVerified: cust.isEmailVerified,
        isPhoneVerified: cust.isPhoneVerified,
        cosmosXp: cust.cosmosXp,
        totalBookings: custBookings.length,
        totalSpent,
        upcomingCount: upcoming.length,
        cancelledCount: cancelled.length,
        createdAt: cust.createdAt,
        bookings: custBookings,
      };
    });

    const filtered = search
      ? enrichedCustomers.filter(
          (c) =>
            c.name.toLowerCase().includes(search) ||
            (c.email && c.email.toLowerCase().includes(search)) ||
            (c.phone && c.phone.includes(search))
        )
      : enrichedCustomers;

    return NextResponse.json({
      customers: filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    });
  } catch (error: any) {
    console.error("Admin Customers Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
