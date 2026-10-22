import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getActiveCart, calculateCartSummary } from "@/lib/cart";
import { db } from "@/lib/db";
import { AddToCartSchema } from "@/lib/validation";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const cartSummary = await getActiveCart(user?.userId);
    return NextResponse.json(cartSummary);
  } catch (error) {
    console.error("[GET /api/cart error]:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AddToCartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { variantId, quantity } = parsed.data;

    // Verify variant and stock
    const variant = await db.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      return NextResponse.json({ error: "Product variant not found" }, { status: 404 });
    }

    if (variant.stock < quantity) {
      return NextResponse.json(
        { error: `Only ${variant.stock} units currently in stock` },
        { status: 400 }
      );
    }

    const user = await getCurrentUser();
    const cartSummary = await getActiveCart(user?.userId);

    // Upsert cart item
    const existingItem = await db.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cartSummary.id,
          variantId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > variant.stock) {
        return NextResponse.json(
          { error: `Cannot add more. Max stock available: ${variant.stock}` },
          { status: 400 }
        );
      }
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cartSummary.id,
          variantId,
          quantity,
        },
      });
    }

    const updatedCart = await getActiveCart(user?.userId);
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("[POST /api/cart error]:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}
