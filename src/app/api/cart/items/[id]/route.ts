import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getActiveCart } from "@/lib/cart";
import { db } from "@/lib/db";
import { UpdateCartItemSchema } from "@/lib/validation";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateCartItemSchema.safeParse({ itemId: id, ...body });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { quantity } = parsed.data;

    const user = await getCurrentUser();
    const cartSummary = await getActiveCart(user?.userId);

    const cartItem = await db.cartItem.findFirst({
      where: { id, cartId: cartSummary.id },
      include: { variant: true },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (quantity <= 0) {
      await db.cartItem.delete({ where: { id } });
    } else {
      if (quantity > cartItem.variant.stock) {
        return NextResponse.json(
          { error: `Only ${cartItem.variant.stock} units available` },
          { status: 400 }
        );
      }
      await db.cartItem.update({
        where: { id },
        data: { quantity },
      });
    }

    const updatedCart = await getActiveCart(user?.userId);
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("[PATCH /api/cart/items/[id] error]:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const cartSummary = await getActiveCart(user?.userId);

    const cartItem = await db.cartItem.findFirst({
      where: { id, cartId: cartSummary.id },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    await db.cartItem.delete({ where: { id } });

    const updatedCart = await getActiveCart(user?.userId);
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("[DELETE /api/cart/items/[id] error]:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
