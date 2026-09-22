import ProductCard from "./ProductCard";

export default function ProductGrid({ products, title }) {
  if (!products || products.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-ink/60">
        Koi product nahi mila.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      {title && (
        <h2 className="mb-4 font-display text-xl font-bold text-ink">{title}</h2>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
