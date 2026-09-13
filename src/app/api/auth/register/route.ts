import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hashPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { User } from "@/types";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name and at least Email or Phone are required" },
        { status: 400 }
      );
    }

    if (email) {
      const existingEmail = db.findOne("users", (u) => u.email === email.toLowerCase());
      if (existingEmail) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 400 }
        );
      }
    }

    if (phone) {
      const existingPhone = db.findOne("users", (u) => u.phone === phone);
      if (existingPhone) {
        return NextResponse.json(
          { error: "An account with this phone number already exists" },
          { status: 400 }
        );
      }
    }

    const passwordHash = password ? await hashPassword(password) : null;
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name,
      email: email ? email.toLowerCase() : null,
      phone: phone || null,
      passwordHash,
      role: "CUSTOMER",
      isEmailVerified: Boolean(email),
      isPhoneVerified: Boolean(phone),
      cosmosXp: 100, // Welcome bonus XP
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.insert("users", newUser);

    const token = await createSessionToken({
      userId: newUser.id,
      role: newUser.role,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        cosmosXp: newUser.cosmosXp,
      },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Failed to register account" }, { status: 500 });
  }
}
