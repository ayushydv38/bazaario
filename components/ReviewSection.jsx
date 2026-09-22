"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ReviewSection({ productId, reviews }) {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: insertError } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSubmitted(true);
  }

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="font-display text-xl font-bold text-ink">Reviews</h2>

      <div className="mt-4 space-y-4">
        {reviews.length === 0 && (
          <p className="text-sm text-ink/60">Abhi koi review nahi hai — sabse pehle aap likhein.</p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-lg border border-border bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">
                {r.profiles?.full_name || "Customer"}
              </span>
              <span className="text-sm text-saffron">{"★".repeat(r.rating)}</span>
            </div>
            {r.comment && <p className="mt-1 text-sm text-ink/70">{r.comment}</p>}
            <p className="mt-1 text-xs text-ink/40">
              {new Date(r.created_at).toLocaleDateString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-white p-4">
        {!user ? (
          <p className="text-sm text-ink/60">
            Review likhne ke liye pehle{" "}
            <a href="/login" className="font-medium text-teal">
              login
            </a>{" "}
            karein.
          </p>
        ) : submitted ? (
          <p className="text-sm text-teal">
            Review submit ho gaya — admin approve karne ke baad yahan dikhega.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm font-medium text-ink">Apna review likhein</p>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rounded-md border border-border px-3 py-1.5 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star
                </option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Product ke baare mein bataiye..."
              rows={3}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-teal px-5 py-2 text-sm font-semibold text-cream hover:bg-teal-dark disabled:opacity-60"
            >
              {loading ? "Submit ho raha hai..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
