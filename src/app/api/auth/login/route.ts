import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/Phone and password are required" },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const user = await db.findOne(
      "users",
      (u) =>
        (u.email?.toLowerCase() === cleanIdentifier) ||
        (u.phone?.replace(/[^0-9]/g, "") === cleanIdentifier.replace(/[^0-9]/g, ""))
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. Please check your email or phone." },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "This account was created with Phone OTP. Please log in using Phone OTP." },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email/phone or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      role: user.role,
      name: user.name,
      phone: user.phone,
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        cosmosXp: user.cosmosXp,
      },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
  }
}
