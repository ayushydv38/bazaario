"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const emptyForm = {
  name: "",
  description: "",
  category_id: "",
  price: "",
  mrp: "",
  stock: "",
  sku: "",
  image_url: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase
        .from("products")
        .select("*, categories(name), product_images(image_url)")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setProducts(p || []);
    setCategories(c || []);
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      slug: slugify(form.name) + "-" + Date.now().toString(36),
      description: form.description,
      category_id: form.category_id || null,
      price: Number(form.price),
      mrp: Number(form.mrp),
      stock: Number(form.stock),
      sku: form.sku,
    };

    if (editingId) {
      delete payload.slug; // keep original slug on edit
      const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId);
      if (updateError) return setError(updateError.message);
    } else {
      const { data: newProduct, error: insertError } = await supabase
        .from("products")
        .insert(payload)
        .select()
        .single();
      if (insertError) return setError(insertError.message);

      if (form.image_url) {
        await supabase.from("product_images").insert({
          product_id: newProduct.id,
          image_url: form.image_url,
          sort_order: 0,
        });
      }
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    load();
  }

  async function toggleActive(product) {
    await supabase.from("products").update({ is_active: !product.is_active }).eq("id", product.id);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Ye product delete karna hai?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  }

  function startEdit(p) {
    setForm({
      name: p.name,
      description: p.description || "",
      category_id: p.category_id || "",
      price: p.price,
      mrp: p.mrp,
      stock: p.stock,
      sku: p.sku || "",
      image_url: "",
    });
    setEditingId(p.id);
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Products</h1>
        {!showForm && (
          <button
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(true);
            }}
            className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-cream"
          >
            + Naya Product
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg border border-border bg-white p-4">
          <Field label="Product naam" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/70">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/70">Category</span>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="">— Chunein —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Price (₹)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required />
            <Field label="MRP (₹)" type="number" value={form.mrp} onChange={(v) => setForm({ ...form, mrp: v })} required />
            <Field label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} required />
          </div>
          <Field label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
          {!editingId && (
            <Field label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="rounded-full bg-teal px-5 py-2 text-sm font-semibold text-cream">
              Save
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-border px-5 py-2 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs text-ink/60">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3 text-ink">{p.name}</td>
                <td className="p-3 text-ink/70">{p.categories?.name || "—"}</td>
                <td className="p-3 text-ink/70">₹{p.price}</td>
                <td className="p-3 text-ink/70">{p.stock}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      p.is_active ? "bg-teal/20 text-teal" : "bg-ink/10 text-ink/50"
                    }`}
                  >
                    {p.is_active ? "Active" : "Disabled"}
                  </button>
                </td>
                <td className="p-3 space-x-2 text-xs">
                  <button onClick={() => startEdit(p)} className="text-teal">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
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
