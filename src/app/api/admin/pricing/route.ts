import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PricingTier } from "@/types";

export async function GET() {
  try {
    const pricing = db.findMany("pricing_tiers");
    return NextResponse.json({ pricing });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch pricing" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await request.json();
    const { title, zoneType, durationHours, price, originalPrice, tag, features, isFeatured, isActive } = body;

    const newTier: PricingTier = {
      id: `price-${Date.now()}`,
      title,
      zoneType,
      durationHours: parseInt(durationHours || "1", 10),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      tag: tag || null,
      features: typeof features === "string" ? features : JSON.stringify(features || []),
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== false,
    };

    db.insert("pricing_tiers", newTier);
    return NextResponse.json({ success: true, pricingTier: newTier });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create pricing tier" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    if (updates.features && typeof updates.features !== "string") {
      updates.features = JSON.stringify(updates.features);
    }

    const updated = db.update("pricing_tiers", id, updates);
    return NextResponse.json({ success: true, pricingTier: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update pricing tier" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    db.delete("pricing_tiers", id);
    return NextResponse.json({ success: true, message: "Pricing tier deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete pricing tier" }, { status: 500 });
  }
}
