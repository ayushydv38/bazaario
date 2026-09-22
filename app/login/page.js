"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      setError(
        loginError.message === "Invalid login credentials"
          ? "Email ya password galat hai."
          : loginError.message
      );
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-ink">Login karein</h1>
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
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading ? "Login ho raha hai..." : "Login"}
        </button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-teal">
          Password bhool gaye?
        </Link>
        <Link href="/signup" className="font-medium text-teal">
          Naya account banayein
        </Link>
      </div>
    </div>
  );
}
