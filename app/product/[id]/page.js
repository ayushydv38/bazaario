import { notFound } from "next/navigation";
import { getProductById, getApprovedReviews } from "@/lib/supabase/queries";
import AddToCartButtons from "@/components/AddToCartButtons";
import ReviewSection from "@/components/ReviewSection";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }) {
  const product = await getProductById(params.id);
  if (!product) return notFound();

  const reviews = await getApprovedReviews(product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="aspect-square rounded-lg border border-border bg-white flex items-center justify-center">
          <span className="font-display text-ink/30">{product.name}</span>
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{product.name}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-ink/60">
            <span>★ {product.rating || "Naya"}</span>
            <span>({product.reviewCount} reviews)</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-ink">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-ink/40 line-through">₹{product.mrp}</span>
                <span className="text-sm font-semibold text-saffron">{discount}% off</span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-ink/70">{product.description}</p>

          <p className="mt-3 text-sm">
            {product.stock > 0 ? (
              <span className="font-medium text-teal">In stock ({product.stock} available)</span>
            ) : (
              <span className="font-medium text-red-600">Out of stock</span>
            )}
          </p>

          <AddToCartButtons product={product} />

          <div className="mt-8 rounded-lg border border-border bg-white p-4 text-sm text-ink/70">
            <p className="font-medium text-ink">Delivery</p>
            <p className="mt-1">Apna pincode daalein delivery estimate ke liye.</p>
            <input
              type="text"
              placeholder="Pincode"
              className="mt-2 w-32 rounded-md border border-border px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      <ReviewSection productId={product.id} reviews={reviews} />
    </div>
  );
}
