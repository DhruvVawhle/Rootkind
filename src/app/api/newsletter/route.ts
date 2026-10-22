import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const NewsletterSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export async function POST(req: NextRequest) {
  try {
    let email = "";
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      email = body.email;
    } else {
      const formData = await req.formData();
      email = (formData.get("email") as string) || "";
    }

    const parsed = NewsletterSchema.safeParse({ email });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    // In a real application, record in database or email provider
    console.log(`[Newsletter Subscribed]: ${parsed.data.email} at ${new Date().toISOString()}`);

    // If submitted via standard form POST, redirect back with query param
    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(new URL("/?subscribed=true", req.url));
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for joining the Rootkind Growing Club!",
    });
  } catch (err) {
    console.error("[Newsletter Error]:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
