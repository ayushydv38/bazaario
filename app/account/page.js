import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function AccountPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Mera Account</h1>
        <LogoutButton />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-white p-5">
        <p className="text-sm text-ink/60">Naam</p>
        <p className="text-ink">{profile?.full_name || "—"}</p>
        <p className="mt-3 text-sm text-ink/60">Email</p>
        <p className="text-ink">{user.email}</p>
        <p className="mt-3 text-sm text-ink/60">Phone</p>
        <p className="text-ink">{profile?.phone || "—"}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AccountLink href="/account/orders" label="Mere Orders" />
        <AccountLink href="/account/addresses" label="Saved Addresses" />
        <AccountLink href="/wishlist" label="Wishlist" />
        <AccountLink href="/account/reviews" label="Meri Reviews" />
      </div>
    </div>
  );
}

function AccountLink({ href, label }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-border bg-white p-4 text-sm font-medium text-ink hover:border-teal"
    >
      {label} →
    </Link>
  );
}
