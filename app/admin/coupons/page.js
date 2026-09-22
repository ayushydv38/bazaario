"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const emptyForm = {
  code: "",
  discount_type: "percentage",
  discount_value: "",
  min_order_amount: "0",
  max_discount: "",
  expiry_date: "",
  usage_limit: "",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await supabase.from("coupons").insert({
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_amount: Number(form.min_order_amount || 0),
      max_discount: form.max_discount ? Number(form.max_discount) : null,
      expiry_date: form.expiry_date || null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
    });
    setForm(emptyForm);
    setShowForm(false);
    load();
  }

  async function toggleActive(coupon) {
    await supabase.from("coupons").update({ is_active: !coupon.is_active }).eq("id", coupon.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Coupons</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-cream">
            + Naya Coupon
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg border border-border bg-white p-4">
          <Field label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} required />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/70">Discount type</span>
            <select
              value={form.discount_type}
              onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed (₹)</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Discount value" type="number" value={form.discount_value} onChange={(v) => setForm({ ...form, discount_value: v })} required />
            <Field label="Max discount (₹, optional)" type="number" value={form.max_discount} onChange={(v) => setForm({ ...form, max_discount: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Min order amount (₹)" type="number" value={form.min_order_amount} onChange={(v) => setForm({ ...form, min_order_amount: v })} />
            <Field label="Usage limit (optional)" type="number" value={form.usage_limit} onChange={(v) => setForm({ ...form, usage_limit: v })} />
          </div>
          <Field label="Expiry date (optional)" type="date" value={form.expiry_date} onChange={(v) => setForm({ ...form, expiry_date: v })} />
          <div className="flex gap-3">
            <button type="submit" className="rounded-full bg-teal px-5 py-2 text-sm font-semibold text-cream">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-border px-5 py-2 text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs text-ink/60">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Used</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="p-3 font-medium text-ink">{c.code}</td>
                <td className="p-3 text-ink/70">
                  {c.discount_type === "percentage" ? `${c.discount_value}%` : `₹${c.discount_value}`}
                </td>
                <td className="p-3 text-ink/70">{c.times_used}{c.usage_limit ? ` / ${c.usage_limit}` : ""}</td>
                <td className="p-3 text-ink/70">
                  {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleActive(c)}
                    className={`rounded-full px-2 py-0.5 text-xs ${c.is_active ? "bg-teal/20 text-teal" : "bg-ink/10 text-ink/50"}`}
                  >
                    {c.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink/70">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-md border border-border px-3 py-2 text-sm"
      />
    </label>
  );
}
