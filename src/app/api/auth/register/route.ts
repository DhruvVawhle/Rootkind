import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/lib/validation";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { getGuestCartToken, mergeGuestCartIntoUserCart } from "@/lib/cart";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, email, password, phone } = parsed.data;

    // Check if email already registered
    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone: phone || null,
        role: "CUSTOMER",
      },
    });

    // Set secure HTTP-only session cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Merge any existing guest cart
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
    console.error("[Register Error]:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
