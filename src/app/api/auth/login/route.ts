import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { LoginSchema } from "@/lib/validation";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { getGuestCartToken, mergeGuestCartIntoUserCart } from "@/lib/cart";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password combination." },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password combination." },
        { status: 401 }
      );
    }

    // Set secure HTTP-only session cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Merge guest cart
    try {
      const guestToken = await getGuestCartToken();
      if (guestToken) {
        await mergeGuestCartIntoUserCart(guestToken, user.id);
      }
    } catch (e) {
      console.warn("Guest cart merge notice:", e);
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("[Login Error]:", error);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
