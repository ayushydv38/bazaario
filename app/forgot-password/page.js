"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <h1 className="font-display text-xl font-bold text-ink">Email bhej diya</h1>
        <p className="mt-2 text-sm text-ink/70">
          Agar {email} se koi account bana hai, to usmein ek password reset link
          bhej diya gaya hai.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-ink">Password reset karein</h1>
      <p className="mt-1 text-sm text-ink/60">
        Apna email daalein, hum aapko reset link bhej denge.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-teal"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-teal px-6 py-3 text-sm font-semibold text-cream hover:bg-teal-dark disabled:opacity-60"
        >
          {loading ? "Bhej rahe hain..." : "Reset link bhejein"}
        </button>
      </form>
    </div>
  );
}
