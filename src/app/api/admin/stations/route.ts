import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Station } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zoneId = searchParams.get("zoneId");
    let stations = await db.findMany("stations");
    if (zoneId) {
      stations = stations.filter((s) => s.zoneId === zoneId);
    }
    return NextResponse.json({ stations });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const body = await request.json();
    const { zoneId, stationNumber, name, status } = body;
    if (!zoneId || !stationNumber) {
      return NextResponse.json({ error: "zoneId and stationNumber are required" }, { status: 400 });
    }
    const newStation: Station = {
      id: `station-${zoneId}-${stationNumber}`,
      zoneId,
      stationNumber: Number(stationNumber),
      name: name || `Station ${stationNumber}`,
      status: status || "AVAILABLE",
    };
    await db.insert("stations", newStation);
    return NextResponse.json({ success: true, station: newStation });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create station" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const updated = await db.update("stations", id, updates);
    return NextResponse.json({ success: true, station: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update station" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete("stations", id);
    return NextResponse.json({ success: true, message: "Station deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete station" }, { status: 500 });
  }
}
