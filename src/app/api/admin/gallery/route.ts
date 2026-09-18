import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { GalleryImage } from "@/types";

export async function GET() {
  try {
    const gallery = await db.findMany("gallery_images");
    return NextResponse.json({ gallery });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await request.json();
    const { title, imageUrl, category, displayOrder, isPublished } = body;

    const newImage: GalleryImage = {
      id: `gal-${Date.now()}`,
      title,
      imageUrl,
      category: category || "ARENA",
      displayOrder: parseInt(displayOrder || "0", 10),
      isPublished: isPublished !== false,
    };

    await db.insert("gallery_images", newImage);
    return NextResponse.json({ success: true, image: newImage });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add image" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await db.update("gallery_images", id, updates);
    return NextResponse.json({ success: true, image: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete("gallery_images", id);
    return NextResponse.json({ success: true, message: "Image deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
