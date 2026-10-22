import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getActiveCart } from "@/lib/cart";
import { db } from "@/lib/db";
import { generateOrderReference } from "@/lib/utils";
import { createRazorpayOrder } from "@/lib/razorpay";
import { CheckoutSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { customerName, customerEmail, customerPhone, shippingAddress, notes, saveAddress } = parsed.data;

    const user = await getCurrentUser();

    // If user is logged in and requested address save, persist address to account
    if (user?.userId && saveAddress) {
      try {
        const existing = await db.address.findFirst({
          where: {
            userId: user.userId,
            street: shippingAddress.street,
            postalCode: shippingAddress.postalCode,
          },
        });

        if (!existing) {
          const count = await db.address.count({ where: { userId: user.userId } });
          await db.address.create({
            data: {
              userId: user.userId,
              recipientName: shippingAddress.recipientName,
              phone: shippingAddress.phone,
              street: shippingAddress.street,
              apartment: shippingAddress.apartment || null,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postalCode: shippingAddress.postalCode,
              country: shippingAddress.country || "India",
              isDefault: count === 0,
            },
          });
        }
      } catch (addrErr) {
        console.warn("[Address Save Notice]:", addrErr);
      }
    }

    const cartSummary = await getActiveCart(user?.userId);

    if (!cartSummary || cartSummary.items.length === 0) {
      return NextResponse.json({ error: "Your basket is empty." }, { status: 400 });
    }

    const orderReference = generateOrderReference();

    // Run atomic transaction: Validate stock, reserve inventory, create Order & OrderItems
    const result = await db.$transaction(async (tx) => {
      // 1. Check stock for every item
      for (const item of cartSummary.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant || variant.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${item.productName}". Available: ${variant?.stock || 0}`
          );
        }

        // Decrement stock (concurrency-safe reservation)
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });

        // Record adjustment log
        await tx.inventoryAdjustment.create({
          data: {
            variantId: item.variantId,
            action: "RESERVATION",
            quantityChange: -item.quantity,
            previousStock: variant.stock,
            newStock: variant.stock - item.quantity,
            reason: `Order reservation for ${orderReference}`,
            referenceId: orderReference,
          },
        });
      }

      // 2. Create Order record with immutable snapshots
      const order = await tx.order.create({
        data: {
          orderReference,
          userId: user?.userId || null,
          customerName,
          customerEmail,
          customerPhone,
          orderStatus: "PENDING",
          paymentStatus: "PENDING",
          fulfillmentStatus: "UNFULFILLED",
          subtotalPaise: cartSummary.subtotalPaise,
          shippingPaise: cartSummary.shippingPaise,
          discountPaise: 0,
          totalPaise: cartSummary.totalPaise,
          currency: "INR",
          shippingAddressSnapshot: shippingAddress,
          notes: notes || null,
          items: {
            create: cartSummary.items.map((item: any) => ({
              variantId: item.variantId,
              sku: item.sku,
              productTitle: item.productName,
              variantTitle: item.variantTitle,
              unitPricePaise: item.unitPricePaise,
              quantity: item.quantity,
              totalPaise: item.itemTotalPaise,
            })),
          },
        },
      });

      return order;
    });

    // 3. Create Razorpay Order
    const razorpayRes = await createRazorpayOrder({
      amountPaise: result.totalPaise,
      receipt: result.orderReference,
      notes: {
        orderId: result.id,
        customerEmail,
      },
    });

    const razorpayOrderId = razorpayRes.order.id;

    // 4. Create Payment record in DB linked to order
    await db.payment.create({
      data: {
        orderId: result.id,
        razorpayOrderId,
        amountPaise: result.totalPaise,
        currency: "INR",
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: result.id,
      orderReference: result.orderReference,
      amountPaise: result.totalPaise,
      razorpayOrderId,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_rootkind_seed_key",
    });
  } catch (err: any) {
    console.error("[Create Order Error]:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process order reservation." },
      { status: 400 }
    );
  }
}
