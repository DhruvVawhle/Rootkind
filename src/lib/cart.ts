import { cookies } from "next/headers";
import { db } from "./db";
import { siteConfig } from "@/config/site";
import crypto from "crypto";

const GUEST_CART_COOKIE = "rootkind_guest_cart";

export async function getGuestCartToken(): Promise<string> {
  const cookieStore = await cookies();
  let token = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (!token) {
    token = crypto.randomUUID();
    cookieStore.set(GUEST_CART_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
  }
  return token;
}

export async function getActiveCart(userId?: string) {
  if (userId) {
    let cart = await db.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });
    }
    return calculateCartSummary(cart);
  }

  // Guest Cart
  const guestToken = await getGuestCartToken();
  let cart = await db.cart.findUnique({
    where: { guestToken },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: { guestToken },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  return calculateCartSummary(cart);
}

export function calculateCartSummary(cart: any) {
  let subtotalPaise = 0;
  let itemCount = 0;

  const formattedItems = cart.items.map((item: any) => {
    const unitPricePaise = item.variant.pricePaise;
    const itemTotalPaise = unitPricePaise * item.quantity;
    subtotalPaise += itemTotalPaise;
    itemCount += item.quantity;

    return {
      id: item.id,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPricePaise,
      itemTotalPaise,
      variantTitle: item.variant.title,
      sku: item.variant.sku,
      stock: item.variant.stock,
      weightGrams: item.variant.weightGrams,
      productName: item.variant.product.name,
      productSlug: item.variant.product.slug,
      productImage: item.variant.product.images[0] || "/images/placeholder.jpg",
    };
  });

  const shippingPaise =
    subtotalPaise === 0 || subtotalPaise >= siteConfig.freeShippingThresholdPaise
      ? 0
      : siteConfig.standardShippingFeePaise;

  const totalPaise = subtotalPaise + shippingPaise;

  return {
    id: cart.id,
    items: formattedItems,
    itemCount,
    subtotalPaise,
    shippingPaise,
    discountPaise: 0,
    totalPaise,
    isFreeShippingEligible: subtotalPaise >= siteConfig.freeShippingThresholdPaise,
    freeShippingThresholdPaise: siteConfig.freeShippingThresholdPaise,
    amountNeededForFreeShippingPaise: Math.max(
      0,
      siteConfig.freeShippingThresholdPaise - subtotalPaise
    ),
  };
}

export async function mergeGuestCartIntoUserCart(guestToken: string, userId: string) {
  const guestCart = await db.cart.findUnique({
    where: { guestToken },
    include: { items: true },
  });

  if (!guestCart || guestCart.items.length === 0) return;

  let userCart = await db.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  if (!userCart) {
    userCart = await db.cart.create({
      data: { userId },
      include: { items: true },
    });
  }

  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find((i) => i.variantId === guestItem.variantId);
    if (existing) {
      await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + guestItem.quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: userCart.id,
          variantId: guestItem.variantId,
          quantity: guestItem.quantity,
        },
      });
    }
  }

  // Remove guest cart after successful merge
  await db.cart.delete({ where: { id: guestCart.id } });
}
