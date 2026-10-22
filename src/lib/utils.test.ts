import test from "node:test";
import assert from "node:assert/strict";
import { formatPaise, cn, generateOrderReference } from "./utils";
import { RegisterSchema, AddressSchema } from "./validation";
import { hashPassword, verifyPassword } from "./auth";
import { verifyRazorpayPaymentSignature } from "./razorpay";

test("formatPaise: correctly formats integer paise into Indian Rupees", () => {
  assert.equal(formatPaise(49900), "₹499");
  assert.equal(formatPaise(149900), "₹1,499");
  assert.equal(formatPaise(9900), "₹99");
  assert.equal(formatPaise(0), "₹0");
  assert.equal(formatPaise(49950, true), "₹499.50");
});

test("cn: merges class names and resolves Tailwind conflicts correctly", () => {
  const result = cn("p-4 text-red-500", "p-6", { "bg-white": true, "hidden": false });
  assert.ok(result.includes("p-6"));
  assert.ok(!result.includes("p-4"));
  assert.ok(result.includes("bg-white"));
});

test("generateOrderReference: produces valid Rootkind order reference format", () => {
  const ref = generateOrderReference();
  const year = new Date().getFullYear();
  assert.match(ref, new RegExp(`^RK-${year}-\\d{4}$`));
});

test("validation: RegisterSchema enforces email and password constraints", () => {
  const valid = RegisterSchema.safeParse({
    name: "Aarav Sharma",
    email: "aarav@example.com",
    password: "Password123!",
  });
  assert.equal(valid.success, true);

  const invalid = RegisterSchema.safeParse({
    name: "A",
    email: "not-an-email",
    password: "short",
  });
  assert.equal(invalid.success, false);
});

test("validation: AddressSchema requires valid 6-digit Indian PIN code", () => {
  const valid = AddressSchema.safeParse({
    recipientName: "Priya Nair",
    phone: "9876543210",
    street: "123 Palm Grove Avenue",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560034",
  });
  assert.equal(valid.success, true);

  const invalid = AddressSchema.safeParse({
    recipientName: "Priya Nair",
    phone: "9876543210",
    street: "123 Palm Grove Avenue",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "56003", // Only 5 digits
  });
  assert.equal(invalid.success, false);
});

test("auth: hashPassword and verifyPassword function reliably", async () => {
  const plain = "MySecretGarden2026!";
  const hash = await hashPassword(plain);
  assert.notEqual(plain, hash);

  const isMatch = await verifyPassword(plain, hash);
  assert.equal(isMatch, true);

  const isWrong = await verifyPassword("WrongPassword", hash);
  assert.equal(isWrong, false);
});

test("razorpay: mock signature bypass succeeds for test mode orders", () => {
  const isMockValid = verifyRazorpayPaymentSignature({
    razorpay_order_id: "order_mock_12345",
    razorpay_payment_id: "pay_mock_98765",
    razorpay_signature: "mock_signature_valid",
  });
  assert.equal(isMockValid, true);
});
