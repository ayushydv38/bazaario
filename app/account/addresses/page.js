"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const emptyForm = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
};

export default function AddressesPage() {
  const [user, setUser] = useState(undefined); // undefined = still checking
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      loadAddresses(data.user.id);
    });
  }, []);

  async function loadAddresses(userId) {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false });
    setAddresses(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await supabase.from("addresses").update(form).eq("id", editingId);
    } else {
      await supabase.from("addresses").insert({ ...form, user_id: user.id });
    }
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    loadAddresses(user.id);
  }

  async function handleDelete(id) {
    await supabase.from("addresses").delete().eq("id", id);
    loadAddresses(user.id);
  }

  async function handleSetDefault(id) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    loadAddresses(user.id);
  }

  function startEdit(addr) {
    setForm({
      full_name: addr.full_name,
      phone: addr.phone,
      address_line: addr.address_line,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark || "",
    });
    setEditingId(addr.id);
    setShowForm(true);
  }

  if (user === undefined) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Saved Addresses</h1>
        {!showForm && (
          <button
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(true);
            }}
            className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-cream hover:bg-teal-dark"
          >
            + Naya Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg border border-border bg-white p-4">
          <Field label="Poora naam" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
          <Field label="Address" value={form.address_line} onChange={(v) => setForm({ ...form, address_line: v })} required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
            <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Pincode" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} required />
            <Field label="Landmark (optional)" value={form.landmark} onChange={(v) => setForm({ ...form, landmark: v })} />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-full bg-teal px-5 py-2 text-sm font-semibold text-cream hover:bg-teal-dark">
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-border px-5 py-2 text-sm text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 space-y-3">
        {addresses.length === 0 && !showForm && (
          <p className="text-sm text-ink/60">Koi address save nahi hai.</p>
        )}
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-lg border border-border bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-ink">
                  {addr.full_name} {addr.is_default && <span className="text-xs text-teal">(Default)</span>}
                </p>
                <p className="text-sm text-ink/70">{addr.phone}</p>
                <p className="mt-1 text-sm text-ink/70">
                  {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}
                  {addr.landmark && ` (${addr.landmark})`}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 text-xs">
                <button onClick={() => startEdit(addr)} className="text-teal">Edit</button>
                <button onClick={() => handleDelete(addr.id)} className="text-red-600">Delete</button>
                {!addr.is_default && (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-ink/60">
                    Default banayein
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink/70">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-md border border-border px-3 py-2 text-sm text-ink focus:border-teal"
      />
    </label>
  );
}
