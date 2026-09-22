"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { addToCart as addToCartDB } from "@/lib/supabase/cart";

export default function AddToCartButtons({ product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [user, setUser] = useState(undefined); // undefined = still checking
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user || null);
      if (data.user) {
        const { data: row } = await supabase
          .from("wishlists")
          .select("id")
          .eq("user_id", data.user.id)
          .eq("product_id", product.id)
          .maybeSingle();
        setInWishlist(!!row);
      }
    });
  }, [product.id]);

  async function addToCart() {
    if (!user) {
      router.push(`/login?next=/product/${product.id}`);
      return;
    }
    const supabase = createClient();
    await addToCartDB(supabase, user.id, product.id, qty);
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  async function buyNow() {
    if (!user) {
      router.push(`/login?next=/product/${product.id}`);
      return;
    }
    const supabase = createClient();
    await addToCartDB(supabase, user.id, product.id, qty);
    window.dispatchEvent(new Event("cart-updated"));
    router.push("/cart");
  }

  async function toggleWishlist() {
    if (!user) {
      router.push(`/login?next=/product/${product.id}`);
      return;
    }
    const supabase = createClient();
    if (inWishlist) {
      await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);
      setInWishlist(false);
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, product_id: product.id });
      setInWishlist(true);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-ink/70">Quantity</span>
        <div className="flex items-center rounded-md border border-border">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-1 text-ink hover:bg-cream"
            aria-label="Quantity kam karein"
          >
            −
          </button>
          <span className="px-4 text-sm text-ink">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="px-3 py-1 text-ink hover:bg-cream"
            aria-label="Quantity badhayein"
          >
            +
          </button>
        </div>
      </div>

      {user === null && (
        <p className="text-xs text-ink/50">
          Cart aur wishlist aapke account se jude hote hain — pehle login karna hoga.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addToCart}
          disabled={product.stock === 0}
          className="flex-1 rounded-full border border-teal px-6 py-3 text-sm font-semibold text-teal hover:bg-teal hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
        >
          {added ? "Cart mein daal diya ✓" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={buyNow}
          disabled={product.stock === 0}
          className="flex-1 rounded-full bg-saffron px-6 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
        >
          Buy Now
        </button>
        <button
          type="button"
          onClick={toggleWishlist}
          className="rounded-full border border-border px-4 py-3 text-sm font-medium text-ink hover:border-teal"
        >
          {inWishlist ? "♥ Wishlisted" : "♡ Wishlist"}
        </button>
      </div>
    </div>
  );
}
