import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        cosmosXp: user.cosmosXp,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Auth Me Error:", error);
    return NextResponse.json({ user: null });
  }
}
