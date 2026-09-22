"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    async function refresh() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setCount(0);
        return;
      }
      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cart) {
        setCount(0);
        return;
      }
      const { data: items } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("cart_id", cart.id);
      setCount((items || []).reduce((sum, i) => sum + i.quantity, 0));
    }

    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  return (
    <Link href="/cart" aria-label="Cart" className="relative text-ink hover:text-teal">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-saffron text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
