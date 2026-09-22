import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/ProductGrid";

export default async function WishlistPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("wishlists")
    .select(
      "product_id, products(id, name, price, mrp, stock, avg_rating, review_count, product_images(image_url, sort_order))"
    )
    .eq("user_id", user.id);

  const products = (data || [])
    .filter((row) => row.products)
    .map((row) => ({
      id: row.products.id,
      name: row.products.name,
      price: Number(row.products.price),
      mrp: Number(row.products.mrp),
      stock: row.products.stock,
      rating: Number(row.products.avg_rating) || 0,
      reviewCount: row.products.review_count || 0,
      image: row.products.product_images?.[0]?.image_url || null,
    }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-ink">Meri Wishlist</h1>
      <div className="mt-4">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
