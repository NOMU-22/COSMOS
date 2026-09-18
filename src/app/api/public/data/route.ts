import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const zones = (await db
      .findMany("gaming_zones", (z) => z.isActive))
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const pricing = await db
      .findMany("pricing_tiers", (p) => p.isActive);

    const offers = (await db
      .findMany("offers", (o) => o.status === "PUBLISHED"))
      .filter((o) => new Date(o.endDate) >= new Date(new Date().setHours(0, 0, 0, 0)));

    const events = (await db
      .findMany("events", (e) => e.status !== "DRAFT"))
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

    const games = await db
      .findMany("games", (g) => g.isActive);

    const reviews = await db
      .findMany("reviews", (r) => r.status === "APPROVED");

    const gallery = (await db
      .findMany("gallery_images", (g) => g.isPublished))
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const settings = await db.findOne("business_settings", () => true);

    return NextResponse.json({
      zones,
      pricing,
      offers,
      events,
      games,
      reviews,
      gallery,
      settings: settings || null,
    });
  } catch (error: any) {
    console.error("Public Data Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
