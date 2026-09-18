import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { GamingZone, Station } from "@/types";

export async function GET() {
  try {
    const zones = await db.findMany("gaming_zones");
    const stations = await db.findMany("stations");
    return NextResponse.json({ zones, stations });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch zones" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await request.json();
    const { name, slug, description, specs, hourlyRate, imageUrl, totalStations, popularGames, displayOrder } = body;

    const newZone: GamingZone = {
      id: `zone-${Date.now()}`,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      description: description || "",
      specs: specs || "",
      hourlyRate: parseFloat(hourlyRate || "150"),
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      totalStations: parseInt(totalStations || "4", 10),
      popularGames: popularGames || "",
      isActive: true,
      displayOrder: parseInt(displayOrder || "0", 10),
    };

    await db.insert("gaming_zones", newZone);

    // Create stations
    for (let i = 1; i <= newZone.totalStations; i++) {
      const station: Station = {
        id: `station-${newZone.slug}-${i}`,
        zoneId: newZone.id,
        stationNumber: i,
        name: `${newZone.name} Station #${i.toString().padStart(2, "0")}`,
        status: "AVAILABLE",
      };
      await db.insert("stations", station);
    }

    return NextResponse.json({ success: true, zone: newZone });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create gaming zone" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await db.update("gaming_zones", id, updates);
    return NextResponse.json({ success: true, zone: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update gaming zone" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete("gaming_zones", id);
    // Delete associated stations
    const stations = await db.findMany("stations", (s) => s.zoneId === id);
    for (const s of stations) {
      await db.delete("stations", s.id);
    }

    return NextResponse.json({ success: true, message: "Zone and stations deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete zone" }, { status: 500 });
  }
}
