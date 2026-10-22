import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    // 1. Cryptographic HMAC-SHA256 signature verification
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("[Razorpay Webhook]: Invalid HMAC signature detected.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || `evt_${Date.now()}_${Math.random()}`;
    const eventType = payload.event;

    // 2. Webhook Event Deduplication to guarantee idempotency
    const existingEvent = await db.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent) {
      console.log(`[Razorpay Webhook]: Event ${eventId} already processed (idempotent duplicate).`);
      return NextResponse.json({ status: "ok", duplicate: true });
    }

    // Record event
    await db.webhookEvent.create({
      data: {
        eventId,
        eventType,
        payload,
      },
    });

    // 3. Handle Events
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const razorpayPaymentId = paymentEntity?.id;

      if (razorpayOrderId) {
        // Find associated order
        const paymentRecord = await db.payment.findFirst({
          where: { razorpayOrderId },
          include: { order: true },
        });

        if (paymentRecord && paymentRecord.order.paymentStatus !== "PAID") {
          await db.$transaction([
            db.order.update({
              where: { id: paymentRecord.orderId },
              data: {
                paymentStatus: "PAID",
                orderStatus: "CONFIRMED",
              },
            }),
            db.payment.update({
              where: { id: paymentRecord.id },
              data: {
                razorpayPaymentId: razorpayPaymentId || paymentRecord.razorpayPaymentId,
                status: "PAID",
              },
            }),
          ]);
          console.log(`[Razorpay Webhook]: Order ${paymentRecord.order.orderReference} marked PAID.`);
        }
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;

      if (razorpayOrderId) {
        await db.payment.updateMany({
          where: { razorpayOrderId },
          data: {
            status: "FAILED",
            failureReason: paymentEntity?.error_description || "Payment failed via gateway",
          },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[Razorpay Webhook Error]:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
