import { NextResponse } from "next/server";
import db from "@/lib/db";
import { generateOtp } from "@/lib/auth";
import { VerificationOtp } from "@/types";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.trim().length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

    const newOtp: VerificationOtp = {
      id: `otp-${Date.now()}`,
      identifier: cleanPhone,
      otpCode,
      type: "PHONE_LOGIN",
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    await db.insert("verification_otps", newOtp);

    // In production, send via SMS gateway. Return preview OTP in development for instant tester convenience.
    console.log(`[COSMOS OTP] Sent OTP ${otpCode} to ${cleanPhone}`);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${cleanPhone}`,
      devOtp: otpCode, // Provided for instant demo and automated testing
    });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
