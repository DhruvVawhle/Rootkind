import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { PaymentVerifySchema } from "@/lib/validation";
import { getCurrentUser } from "@/lib/auth";
import { getActiveCart } from "@/lib/cart";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PaymentVerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

    // 1. Fetch Order and Payment record from database
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // 2. Cryptographic signature check
    const isValidSignature = verifyRazorpayPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValidSignature) {
      // Record payment failure
      await db.payment.updateMany({
        where: { orderId: order.id, razorpayOrderId: razorpay_order_id },
        data: {
          status: "FAILED",
          failureReason: "HMAC signature mismatch",
        },
      });

      return NextResponse.json(
        { error: "Payment verification failed: cryptographic signature invalid." },
        { status: 400 }
      );
    }

    // 3. Update Order and Payment state atomically
    await db.$transaction([
      db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          orderStatus: "CONFIRMED",
        },
      }),
      db.payment.updateMany({
        where: { orderId: order.id, razorpayOrderId: razorpay_order_id },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "PAID",
        },
      }),
    ]);

    // 4. Clear the active cart after confirmed payment
    try {
      const user = await getCurrentUser();
      const cart = await getActiveCart(user?.userId);
      if (cart?.id) {
        await db.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }
    } catch (e) {
      console.warn("Cart clearing note:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and order confirmed.",
      orderReference: order.orderReference,
      orderId: order.id,
    });
  } catch (error) {
    console.error("[Payment Verification Error]:", error);
    return NextResponse.json(
      { error: "Internal payment verification error." },
      { status: 500 }
    );
  }
}
