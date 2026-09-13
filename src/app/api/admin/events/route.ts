import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { EventTournament } from "@/types";

export async function GET() {
  try {
    const events = db.findMany("events");
    const registrations = db.findMany("event_registrations");
    return NextResponse.json({ events, registrations });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await request.json();
    const { title, game, category, eventDate, startTime, endTime, entryFee, prizePool, maxParticipants, format, rules, bannerUrl, status } = body;

    const newEvent: EventTournament = {
      id: `event-${Date.now()}`,
      title,
      game,
      category: category || "TOURNAMENT",
      eventDate: eventDate || new Date().toISOString().split("T")[0],
      startTime: startTime || "14:00",
      endTime: endTime || null,
      entryFee: parseFloat(entryFee || "0"),
      prizePool: prizePool || null,
      maxParticipants: parseInt(maxParticipants || "32", 10),
      currentParticipants: 0,
      format: format || "PS5 | 1v1 | Knockout",
      rules: rules || null,
      bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      status: status || "REGISTRATION_OPEN",
    };

    db.insert("events", newEvent);
    return NextResponse.json({ success: true, event: newEvent });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = db.update("events", id, updates);
    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    db.delete("events", id);
    const regs = db.findMany("event_registrations", (r) => r.eventId === id);
    for (const r of regs) {
      db.delete("event_registrations", r.id);
    }

    return NextResponse.json({ success: true, message: "Event and registrations deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
