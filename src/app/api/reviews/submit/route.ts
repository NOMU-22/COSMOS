import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Review } from "@/types";

export async function POST(request: Request) {
  try {
    const { authorName, rating, comment, gamePlayed } = await request.json();

    if (!authorName || !rating || !comment) {
      return NextResponse.json(
        { error: "Author name, rating (1-5), and feedback comment are required" },
        { status: 400 }
      );
    }

    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      authorName,
      rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
      comment,
      gamePlayed: gamePlayed || null,
      isVerified: true,
      status: "APPROVED", // Auto-approved or managed in Admin Reviews CMS
      createdAt: new Date().toISOString(),
    };

    await db.insert("reviews", newReview);

    return NextResponse.json({
      success: true,
      message: "Thank you! Your review has been submitted.",
      review: newReview,
    });
  } catch (error: any) {
    console.error("Review Submit Error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
