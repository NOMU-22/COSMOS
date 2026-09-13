import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { User } from "@/types";

export async function POST(request: Request) {
  try {
    const { phone, otp, name } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP code are required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const cleanOtp = otp.trim();

    // Find valid OTP record
    const otpRecord = db.findOne(
      "verification_otps",
      (o) =>
        o.identifier === cleanPhone &&
        o.otpCode === cleanOtp &&
        new Date(o.expiresAt) > new Date()
    );

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please try again." },
        { status: 400 }
      );
    }

    // Delete used OTP
    db.delete("verification_otps", otpRecord.id);

    // Check if user already exists
    let user = db.findOne("users", (u) => u.phone === cleanPhone);

    if (!user) {
      // Auto register user if new
      user = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: name || `Gamer ${cleanPhone.slice(-4)}`,
        email: null,
        phone: cleanPhone,
        passwordHash: null,
        role: "CUSTOMER",
        isEmailVerified: false,
        isPhoneVerified: true,
        cosmosXp: 100, // Welcome XP
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.insert("users", user);
    } else {
      // Mark phone as verified if not already
      if (!user.isPhoneVerified) {
        db.update("users", user.id, { isPhoneVerified: true });
        user.isPhoneVerified = true;
      }
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
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
