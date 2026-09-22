"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCartItems, updateCartItemQty, removeCartItem } from "@/lib/supabase/cart";

export default function CartPage() {
  const [user, setUser] = useState(undefined);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login?next=/cart");
        return;
      }
      setUser(data.user);
      loadCart(data.user.id);
    });
  }, []);

  async function loadCart(userId) {
    setLoading(true);
    const cartItems = await getCartItems(supabase, userId);
    setItems(cartItems);
    setLoading(false);
  }

  async function updateQty(cartItemId, qty) {
    if (qty < 1) return;
    await updateCartItemQty(supabase, cartItemId, qty);
    setItems((prev) => prev.map((i) => (i.cartItemId === cartItemId ? { ...i, qty } : i)));
    window.dispatchEvent(new Event("cart-updated"));
  }

  async function removeItem(cartItemId) {
    await removeCartItem(supabase, cartItemId);
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    window.dispatchEvent(new Event("cart-updated"));
  }

  async function applyCoupon() {
    setCouponError("");
    if (!couponCode.trim()) return;

    const { data } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.trim().toUpperCase())
      .eq("is_active", true)
      .maybeSingle();

    if (!data) return setCouponError("Coupon valid nahi hai.");
    if (data.expiry_date && new Date(data.expiry_date) < new Date())
      return setCouponError("Coupon expire ho chuka hai.");
    if (data.usage_limit && data.times_used >= data.usage_limit)
      return setCouponError("Coupon ki limit khatam ho gayi hai.");
    if (subtotal < data.min_order_amount)
      return setCouponError(`Minimum order ₹${data.min_order_amount} hona chahiye.`);

    setCoupon(data);
  }

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  let discount = 0;
  if (coupon) {
    discount =
      coupon.discount_type === "percentage"
        ? Math.round((subtotal * coupon.discount_value) / 100)
        : coupon.discount_value;
    if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
  }
  const shipping = subtotal > 0 && subtotal < 499 ? 49 : 0;
  const total = Math.max(0, subtotal - discount) + shipping;

  if (user === undefined || loading) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-ink/70">Aapka cart khaali hai.</p>
        <Link href="/products" className="mt-4 inline-block font-medium text-teal">
          Shopping shuru karein →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink">Aapka Cart</h1>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.cartItemId} className="flex items-center gap-4 rounded-lg border border-border bg-white p-3">
            <div className="h-16 w-16 flex-shrink-0 rounded bg-cream" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{item.product.name}</p>
              <p className="text-sm text-ink/60">₹{item.product.price}</p>
              <div className="mt-1 flex items-center gap-2">
                <button onClick={() => updateQty(item.cartItemId, item.qty - 1)} className="rounded border border-border px-2 text-sm">−</button>
                <span className="text-sm">{item.qty}</span>
                <button onClick={() => updateQty(item.cartItemId, item.qty + 1)} className="rounded border border-border px-2 text-sm">+</button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">₹{item.product.price * item.qty}</p>
              <button onClick={() => removeItem(item.cartItemId)} className="mt-2 text-xs text-red-600">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Coupon code"
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
        />
        <button onClick={applyCoupon} className="rounded-md border border-teal px-4 py-2 text-sm font-medium text-teal">Apply</button>
      </div>
      {couponError && <p className="mt-1 text-sm text-red-600">{couponError}</p>}
      {coupon && <p className="mt-1 text-sm text-teal">Coupon "{coupon.code}" apply ho gaya!</p>}

      <div className="mt-6 space-y-1 rounded-lg border border-border bg-white p-4 text-sm">
        <Row label="Subtotal" value={subtotal} />
        {discount > 0 && <Row label="Discount" value={-discount} />}
        <Row label="Shipping" value={shipping} note={shipping === 0 ? "Free" : null} />
        <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold text-ink">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        onClick={() => router.push(`/checkout${coupon ? `?coupon=${coupon.code}` : ""}`)}
        className="mt-4 w-full rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

function Row({ label, value, note }) {
  return (
    <div className="flex justify-between text-ink/70">
      <span>{label}</span>
      <span>{note || `₹${value}`}</span>
    </div>
  );
}
