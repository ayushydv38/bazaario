"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getCartItems, clearCart } from "@/lib/supabase/cart";

export default function CheckoutPage() {
  const [user, setUser] = useState(undefined);
  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentReference, setPaymentReference] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponCode = searchParams.get("coupon");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login?next=/checkout");
        return;
      }
      setUser(data.user);

      const cartItems = await getCartItems(supabase, data.user.id);
      if (cartItems.length === 0) {
        router.push("/cart");
        return;
      }
      setItems(cartItems);

      const { data: addr } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", data.user.id)
        .order("is_default", { ascending: false });
      setAddresses(addr || []);
      if (addr && addr.length > 0) setSelectedAddress(addr[0].id);

      if (couponCode) {
        const { data: c } = await supabase
          .from("coupons")
          .select("*")
          .eq("code", couponCode)
          .eq("is_active", true)
          .maybeSingle();
        if (c) setCoupon(c);
      }
    });
  }, []);

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

  async function placeOrder() {
    setError("");
    if (!selectedAddress) return setError("Pehle delivery address chunein.");
    if (paymentMethod === "manual_upi" && !paymentReference.trim())
      return setError("UPI payment reference number daalein.");

    setPlacing(true);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        address_id: selectedAddress,
        status: "pending",
        payment_method: paymentMethod,
        payment_status: "pending",
        payment_reference: paymentMethod === "manual_upi" ? paymentReference.trim() : null,
        subtotal,
        discount,
        shipping_charge: shipping,
        total,
        coupon_code: coupon?.code || null,
      })
      .select()
      .single();

    if (orderError) {
      setPlacing(false);
      return setError(orderError.message);
    }

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.product.id,
      product_name: i.product.name,
      price: i.product.price,
      quantity: i.qty,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      setPlacing(false);
      return setError(itemsError.message);
    }

    if (coupon) {
      await supabase.from("coupons").update({ times_used: coupon.times_used + 1 }).eq("id", coupon.id);
    }

    await clearCart(supabase, user.id);
    window.dispatchEvent(new Event("cart-updated"));

    setPlacing(false);
    router.push(`/order/${order.id}`);
  }

  if (user === undefined) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink">Checkout</h1>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-ink">Delivery Address</h2>
          <Link href="/account/addresses" className="text-sm text-teal">+ Naya address</Link>
        </div>
        {addresses.length === 0 ? (
          <p className="mt-2 text-sm text-ink/60">
            Koi address save nahi hai.{" "}
            <Link href="/account/addresses" className="font-medium text-teal">Address add karein</Link>
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                  selectedAddress === addr.id ? "border-teal bg-teal/5" : "border-border bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                  className="mt-1"
                />
                <span className="text-sm text-ink">
                  <strong>{addr.full_name}</strong> — {addr.phone}
                  <br />
                  {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6">
        <h2 className="font-medium text-ink">Items</h2>
        <div className="mt-2 space-y-1 rounded-lg border border-border bg-white p-3 text-sm">
          {items.map((i) => (
            <div key={i.cartItemId} className="flex justify-between text-ink/70">
              <span>{i.product.name} × {i.qty}</span>
              <span>₹{i.product.price * i.qty}</span>
            </div>
          ))}
          <div className="mt-2 border-t border-border pt-2">
            <Row label="Subtotal" value={subtotal} />
            {discount > 0 && <Row label="Discount" value={-discount} />}
            <Row label="Shipping" value={shipping} note={shipping === 0 ? "Free" : null} />
            <div className="mt-1 flex justify-between font-semibold text-ink">
              <span>Total</span><span>₹{total}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-medium text-ink">Payment Method</h2>
        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2 rounded-lg border border-border bg-white p-3 text-sm">
            <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-border bg-white p-3 text-sm">
            <input type="radio" name="payment" checked={paymentMethod === "manual_upi"} onChange={() => setPaymentMethod("manual_upi")} />
            Manual UPI (QR scan karke)
          </label>
          {paymentMethod === "manual_upi" && (
            <div className="rounded-lg border border-border bg-white p-3 text-sm">
              <p className="text-ink/70">UPI ID: <strong>bazaario@upi</strong></p>
              <p className="mt-1 text-ink/60">Payment karne ke baad, transaction reference number yahan daalein:</p>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="UPI transaction ref"
                className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>
      </section>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        onClick={placeOrder}
        disabled={placing || addresses.length === 0}
        className="mt-6 w-full rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {placing ? "Order place ho raha hai..." : "Place Order"}
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
