"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("reviews")
      .select("*, products(name), profiles(full_name)")
      .order("created_at", { ascending: false });
    setReviews(data || []);
  }

  async function setApproved(id, value) {
    await supabase.from("reviews").update({ is_approved: value }).eq("id", id);
    load();
  }

  async function remove(id) {
    if (!confirm("Ye review delete karna hai?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Reviews</h1>
      <div className="mt-4 space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">
                {r.products?.name} — {r.profiles?.full_name || "Customer"}
              </p>
              <span className="text-sm text-saffron">{"★".repeat(r.rating)}</span>
            </div>
            {r.comment && <p className="mt-1 text-sm text-ink/70">{r.comment}</p>}
            <div className="mt-2 flex gap-3 text-xs">
              {!r.is_approved ? (
                <button onClick={() => setApproved(r.id, true)} className="text-teal">Approve</button>
              ) : (
                <button onClick={() => setApproved(r.id, false)} className="text-ink/60">Unapprove</button>
              )}
              <button onClick={() => remove(r.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-ink/60">Koi review nahi hai.</p>}
      </div>
    </div>
  );
}
