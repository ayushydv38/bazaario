import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  return_requested: "Return Requested",
  returned: "Returned",
  refund_processing: "Refund Processing",
  refunded: "Refunded",
};

export default async function OrderDetailPage({ params }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select("*, addresses(*), order_items(*)")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!order) return notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-lg border border-teal bg-teal/5 p-4 text-center">
        <p className="font-display text-lg font-bold text-teal">Order place ho gaya! 🎉</p>
        <p className="mt-1 text-sm text-ink/70">Order number: {order.id.slice(0, 8)}</p>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink/60">Status</p>
          <span className="rounded-full bg-saffron/20 px-3 py-1 text-xs font-semibold text-saffron">
            {STATUS_LABELS[order.status] || order.status}
          </span>
        </div>
        {order.tracking_number && (
          <p className="mt-2 text-sm text-ink/70">Tracking: {order.tracking_number}</p>
        )}
        <p className="mt-2 text-sm text-ink/70">
          Payment: {order.payment_method === "cod" ? "Cash on Delivery" : "Manual UPI"} (
          {order.payment_status})
        </p>
      </div>

      {order.addresses && (
        <div className="mt-4 rounded-lg border border-border bg-white p-4 text-sm">
          <p className="font-medium text-ink">Delivery Address</p>
          <p className="mt-1 text-ink/70">
            {order.addresses.full_name}, {order.addresses.address_line},{" "}
            {order.addresses.city}, {order.addresses.state} - {order.addresses.pincode}
          </p>
        </div>
      )}

      <div className="mt-4 rounded-lg border border-border bg-white p-4 text-sm">
        <p className="font-medium text-ink">Items</p>
        <div className="mt-2 space-y-1">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between text-ink/70">
              <span>{item.product_name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 space-y-1 border-t border-border pt-2 text-ink/70">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between"><span>Discount</span><span>-₹{order.discount}</span></div>
          )}
          <div className="flex justify-between"><span>Shipping</span><span>₹{order.shipping_charge}</span></div>
          <div className="flex justify-between font-semibold text-ink"><span>Total</span><span>₹{order.total}</span></div>
        </div>
      </div>

      <Link href="/account/orders" className="mt-6 inline-block text-sm font-medium text-teal">
        Mere saare orders dekhein →
      </Link>
    </div>
  );
}
