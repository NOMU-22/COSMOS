import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { EventRegistration } from "@/types";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const { eventId, playerName, playerPhone, playerEmail, gamerTag } = await request.json();

    if (!eventId || !playerName || !playerPhone) {
      return NextResponse.json(
        { error: "Event ID, Player Name, and Phone Number are required" },
        { status: 400 }
      );
    }

    const event = db.findOne("events", (e) => e.id === eventId);
    if (!event) {
      return NextResponse.json({ error: "Tournament/Event not found" }, { status: 404 });
    }

    if (event.currentParticipants >= event.maxParticipants) {
      return NextResponse.json(
        { error: "This tournament is currently at maximum capacity." },
        { status: 400 }
      );
    }

    // Check duplicate phone
    const existing = db.findOne(
      "event_registrations",
      (r) => r.eventId === eventId && r.playerPhone === playerPhone
    );
    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this tournament!" },
        { status: 400 }
      );
    }

    const registration: EventRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      eventId,
      userId: user?.id || null,
      playerName,
      playerPhone,
      playerEmail: playerEmail || null,
      gamerTag: gamerTag || null,
      paymentStatus: event.entryFee > 0 ? "PAID" : "FREE",
      createdAt: new Date().toISOString(),
    };

    db.insert("event_registrations", registration);
    db.update("events", eventId, {
      currentParticipants: event.currentParticipants + 1,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully registered for ${event.title}!`,
      registration,
    });
  } catch (error: any) {
    console.error("Event Registration Error:", error);
    return NextResponse.json({ error: "Failed to register for event" }, { status: 500 });
  }
}
