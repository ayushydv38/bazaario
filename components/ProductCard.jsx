import Link from "next/link";

export default function ProductCard({ product }) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-cream">
        <div className="flex h-full w-full items-center justify-center text-ink/30">
          <span className="font-display text-sm">{product.name}</span>
        </div>
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded bg-saffron px-2 py-0.5 text-xs font-semibold text-white">
            {discount}% off
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-medium text-ink">{product.name}</p>
        <div className="flex items-center gap-1 text-xs text-ink/60">
          <span>★ {product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-base font-bold text-ink">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-ink/40 line-through">₹{product.mrp}</span>
          )}
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <span className="text-xs font-medium text-saffron">Sirf {product.stock} bache hain</span>
        )}
        {product.stock === 0 && (
          <span className="text-xs font-medium text-ink/50">Stock khatam</span>
        )}
      </div>
    </Link>
  );
}
