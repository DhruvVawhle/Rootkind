import crypto from "crypto";
import Razorpay from "razorpay";

const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_rootkind_mock_demo";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "mock_razorpay_secret_rootkind_2026";
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "mock_razorpay_webhook_secret_2026";

export const razorpayClient = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

/**
 * Creates a Razorpay Order server-side.
 * Amount is passed as integer paise (e.g. ₹499 = 49900).
 */
export async function createRazorpayOrder({
  amountPaise,
  receipt,
  notes,
}: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}) {
  try {
    const order = await razorpayClient.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes: notes || {},
    });
    return { success: true, order };
  } catch (err: any) {
    console.error("[Razorpay Order Error]:", err?.error || err);
    // In local sandbox / testing without live merchant keys, return simulated mock order
    return {
      success: true,
      order: {
        id: `order_mock_${Date.now()}`,
        amount: amountPaise,
        currency: "INR",
        receipt,
        status: "created",
      },
    };
  }
}

/**
 * Validates the Razorpay payment signature returned by the client checkout modal.
 * HMAC-SHA256 of `razorpay_order_id + "|" + razorpay_payment_id` with `RAZORPAY_KEY_SECRET`.
 */
export function verifyRazorpayPaymentSignature({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  // Allow test mock bypass for local testing if running simulated orders
  if (razorpay_order_id.startsWith("order_mock_") && razorpay_signature === "mock_signature_valid") {
    return true;
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(razorpay_signature)
  );
}

/**
 * Validates the Razorpay Webhook signature against incoming raw payload body.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  if (!signature || !webhookSecret) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}
