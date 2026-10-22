import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const AddressSchema = z.object({
  recipientName: z.string().min(2, "Recipient name is required"),
  phone: z.string().min(10, "Please provide a valid 10-digit phone number"),
  street: z.string().min(5, "Street address is required"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit Indian PIN code"),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
  isBilling: z.boolean().default(false),
});

export const AddToCartSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
});

export const UpdateCartItemSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
});

export const CheckoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  sameAsShipping: z.boolean().default(true),
  promoCode: z.string().optional(),
  saveAddress: z.boolean().optional(),
  notes: z.string().optional(),
});

export const PaymentVerifySchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  razorpay_order_id: z.string().min(1, "Razorpay Order ID is required"),
  razorpay_payment_id: z.string().min(1, "Razorpay Payment ID is required"),
  razorpay_signature: z.string().min(1, "Razorpay Signature is required"),
});

export const InventoryAdjustmentSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantityChange: z.number().int(),
  reason: z.string().min(3, "Reason is required"),
  action: z.enum([
    "RESTOCK",
    "RESERVATION",
    "SALE",
    "CANCELLATION_RELEASE",
    "DAMAGED_WRITE_OFF",
    "MANUAL_CORRECTION",
  ]),
});
