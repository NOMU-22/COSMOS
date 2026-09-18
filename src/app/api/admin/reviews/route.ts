import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const reviews = await db.findMany("reviews");
    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id, status } = await request.json();
    if (!id || !status) return NextResponse.json({ error: "ID and status required" }, { status: 400 });

    const updated = await db.update("reviews", id, { status });
    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update review status" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete("reviews", id);
    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
