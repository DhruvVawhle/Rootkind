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

    // Safely extract request body to handle empty, malformed, or aborted client streams
    let body: any = {};
    try {
      const text = await req.text();
      if (text && text.trim().length > 0) {
        body = JSON.parse(text);
      }
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const parsed = UpdateCartItemSchema.safeParse({ itemId: id, ...body });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid cart item parameters" },
        { status: 400 }
      );
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
  } catch (error: any) {
    if (error?.name === "AbortError" || error?.code === "ECONNRESET") {
      return new NextResponse(null, { status: 499 });
    }
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
  } catch (error: any) {
    if (error?.name === "AbortError" || error?.code === "ECONNRESET") {
      return new NextResponse(null, { status: 499 });
    }
    console.error("[DELETE /api/cart/items/[id] error]:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
