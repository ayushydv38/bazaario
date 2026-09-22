"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const STATUSES = [
  "pending", "confirmed", "processing", "packed", "shipped",
  "out_for_delivery", "delivered", "cancelled",
  "return_requested", "returned", "refund_processing", "refunded",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("orders")
      .select("*, profiles(full_name), addresses(city, phone)")
      .order("created_at", { ascending: false });
    setOrders(data || []);
  }

  async function updateOrder(id, changes) {
    await supabase.from("orders").update(changes).eq("id", id);
    load();
  }

  const filtered = orders.filter((o) =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Orders</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Order ID ya customer naam se search karein"
        className="mt-3 w-full max-w-sm rounded-md border border-border px-3 py-2 text-sm"
      />

      <div className="mt-4 space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="rounded-lg border border-border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-ink">
                  #{order.id.slice(0, 8)} — {order.profiles?.full_name || "Customer"}
                </p>
                <p className="text-xs text-ink/60">
                  {order.addresses?.city} · {order.addresses?.phone} · ₹{order.total} ·{" "}
                  {order.payment_method === "cod" ? "COD" : "UPI"} ({order.payment_status})
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={order.status}
                  onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                  className="rounded-md border border-border px-2 py-1 text-xs"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {order.payment_method !== "cod" && (
                  <select
                    value={order.payment_status}
                    onChange={(e) => updateOrder(order.id, { payment_status: e.target.value })}
                    className="rounded-md border border-border px-2 py-1 text-xs"
                  >
                    <option value="pending">payment pending</option>
                    <option value="paid">payment verified</option>
                    <option value="failed">payment failed</option>
                  </select>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                defaultValue={order.tracking_number || ""}
                placeholder="Tracking number"
                onBlur={(e) => updateOrder(order.id, { tracking_number: e.target.value })}
                className="w-48 rounded-md border border-border px-2 py-1 text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
