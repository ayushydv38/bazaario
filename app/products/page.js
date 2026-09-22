import ProductGrid from "@/components/ProductGrid";
import SortSelect from "@/components/SortSelect";
import {
  getCategories,
  getAllProducts,
  getProductsByCategory,
  searchProducts,
} from "@/lib/supabase/queries";

export default async function ProductsPage({ searchParams }) {
  const { category, q, sort } = searchParams || {};
  const categories = await getCategories();

  let products;
  let heading = "Sabhi Products";

  if (q) {
    products = await searchProducts(q);
    heading = `"${q}" ke liye results`;
  } else if (category) {
    products = await getProductsByCategory(category);
    const cat = categories.find((c) => c.slug === category);
    heading = cat ? cat.name : heading;
  } else {
    products = await getAllProducts();
  }

  if (sort === "price-low") {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    products = [...products].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-bold text-ink">{heading}</h1>
        <SortSelect current={sort} category={category} q={q} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              category === cat.slug
                ? "border-teal bg-teal text-cream"
                : "border-border bg-white text-ink hover:border-teal"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
