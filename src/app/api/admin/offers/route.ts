import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Offer } from "@/types";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const offers = db.findMany("offers");
    return NextResponse.json({ offers });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { title, code, description, discountType, discountValue, applicableZone, minDurationHours, startDate, endDate, terms, status, bannerUrl } = body;

    if (!title || !code || !discountValue) {
      return NextResponse.json({ error: "Title, coupon code, and discount value are required" }, { status: 400 });
    }

    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      title,
      code: code.toUpperCase().trim(),
      description: description || "",
      discountType: discountType || "PERCENTAGE",
      discountValue: parseFloat(discountValue),
      applicableZone: applicableZone || null,
      minDurationHours: parseInt(minDurationHours || "1", 10),
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: endDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      terms: terms || null,
      status: status || "PUBLISHED",
      bannerUrl: bannerUrl || null,
    };

    db.insert("offers", newOffer);
    return NextResponse.json({ success: true, offer: newOffer });
  } catch (error: any) {
    console.error("Create Offer Error:", error);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });

    const updated = db.update("offers", id, updates);
    return NextResponse.json({ success: true, offer: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Offer ID required" }, { status: 400 });

    db.delete("offers", id);
    return NextResponse.json({ success: true, message: "Offer deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}
