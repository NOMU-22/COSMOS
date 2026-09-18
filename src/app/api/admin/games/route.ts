import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Game } from "@/types";

export async function GET() {
  try {
    const games = await db.findMany("games");
    return NextResponse.json({ games });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const contentType = request.headers.get('content-type') || '';
    let newGame: Game;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const title = form.get('title') as string;
      const genre = form.get('genre') as string;
      const zoneType = (form.get('zoneType') as string) || 'ALL';
      const isPopular = (form.get('isPopular') as string) === 'true';
      const description = form.get('description') as string;
      const coverFile = form.get('coverFile') as any;

      // Save uploaded file if present
      let coverUrl = '';
      if (coverFile && coverFile.size > 0) {
        const { promises: fs } = await import('fs');
        const path = await import('path');
        const arrayBuffer = await (coverFile as File).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const ext = path.extname((coverFile as File).name);
        const filename = `game-${Date.now()}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'games');
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, filename), buffer);
        coverUrl = `/uploads/games/${filename}`;
      } else {
        coverUrl = (form.get('coverUrl') as string) || '';
      }

      newGame = {
        id: `game-${Date.now()}`,
        title,
        genre,
        zoneType,
        coverUrl,
        isPopular,
        isActive: true,
        description: description || undefined,
      };
    } else {
      const body = await request.json();
      const { title, genre, zoneType, coverUrl, isPopular, description } = body;
      newGame = {
        id: `game-${Date.now()}`,
        title,
        genre,
        zoneType: zoneType || "ALL",
        coverUrl: coverUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
        isPopular: Boolean(isPopular),
        isActive: true,
        description: description || undefined,
      };
    }

    await db.insert("games", newGame);
    return NextResponse.json({ success: true, game: newGame });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add game" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const contentType = request.headers.get('content-type') || '';
    let updates: Partial<Game> = {};
    let id: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      id = form.get('id') as string;
      if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
      const title = form.get('title') as string;
      const genre = form.get('genre') as string;
      const zoneType = (form.get('zoneType') as string) || 'ALL';
      const isPopular = (form.get('isPopular') as string) === 'true';
      const description = form.get('description') as string;

      updates = { title, genre, zoneType, isPopular, description };

      const coverFile = form.get('coverFile') as any;
      if (coverFile && coverFile.size > 0) {
        const { promises: fs } = await import('fs');
        const path = await import('path');
        const arrayBuffer = await (coverFile as File).arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const ext = path.extname((coverFile as File).name);
        const filename = `game-${Date.now()}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'games');
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, filename), buffer);
        updates.coverUrl = `/uploads/games/${filename}`;
      } else {
        const coverUrl = form.get('coverUrl') as string;
        if (coverUrl) updates.coverUrl = coverUrl;
      }
    } else {
      const body = await request.json();
      const { id: bodyId, ...rest } = body;
      id = bodyId;
      updates = rest;
    }

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const updated = await db.update("games", id, updates);
    return NextResponse.json({ success: true, game: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete("games", id);
    return NextResponse.json({ success: true, message: "Game deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
  }
}
