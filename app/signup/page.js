"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    setCheckEmail(true);
  }

  if (checkEmail) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <h1 className="font-display text-xl font-bold text-ink">Email check karein</h1>
        <p className="mt-2 text-sm text-ink/70">
          Humne {email} par ek confirmation link bheja hai. Link par click karke
          apna account activate karein, fir login karein.
        </p>
        <Link href="/login" className="mt-4 inline-block text-sm font-medium text-teal">
          Login page par jaayein
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="font-display text-2xl font-bold text-ink">Account banayein</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Naam" type="text" value={fullName} onChange={setFullName} required />
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          minLength={6}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-teal px-6 py-3 text-sm font-semibold text-cream hover:bg-teal-dark disabled:opacity-60"
        >
          {loading ? "Banaya ja raha hai..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-ink/70">
        Pehle se account hai?{" "}
        <Link href="/login" className="font-medium text-teal">
          Login karein
        </Link>
      </p>
    </div>
  );
}

function Field({ label, type, value, onChange, required, minLength }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink focus:border-teal"
      />
    </label>
  );
}
