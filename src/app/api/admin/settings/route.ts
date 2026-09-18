import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await db.findOne("business_settings", () => true);
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const updates = await request.json();
    const settings = await db.findOne("business_settings", () => true);

    if (!settings) {
      const newSettings = await db.insert("business_settings", {
        id: "settings-1",
        ...updates,
      });
      return NextResponse.json({ success: true, settings: newSettings });
    }

    const updated = await db.update("business_settings", settings.id, updates);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("Update Settings Error:", error);
    return NextResponse.json({ error: "Failed to update business settings" }, { status: 500 });
  }
}
