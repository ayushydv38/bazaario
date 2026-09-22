import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import {
  getCategories,
  getFeaturedProducts,
  getNewArrivals,
} from "@/lib/supabase/queries";

const faqs = [
  {
    q: "Delivery mein kitna time lagta hai?",
    a: "Zyada tar orders 3-7 din mein deliver ho jaate hain, aapke pincode ke hisaab se.",
  },
  {
    q: "Payment ke options kya hain?",
    a: "Abhi Cash on Delivery aur Manual UPI (QR scan karke) available hai.",
  },
  {
    q: "Return kaise karoon?",
    a: "Order delivery ke 7 din ke andar 'My Orders' se return request kar sakte hain.",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  const newArrivals = await getNewArrivals();
  const categories = await getCategories();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-saffron-light/20 to-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-14 sm:py-20">
          <p className="text-sm font-medium text-teal">Naye arrivals har hafte</p>
          <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-5xl">
            Har cheez, ek jagah.
          </h1>
          <p className="max-w-md text-ink/70">
            Fashion se lekar electronics tak — asli products, sahi daam, seedha
            aapke ghar tak.
          </p>
          <Link
            href="/products"
            className="mt-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-cream hover:bg-teal-dark"
          >
            Shopping shuru karein
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 font-display text-xl font-bold text-ink">Categories</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-white p-3 text-center hover:border-teal"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-teal">
                <span className="font-display text-sm">{cat.name[0]}</span>
              </div>
              <span className="text-xs font-medium text-ink">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <ProductGrid products={featured} title="Best Sellers" />
      <ProductGrid products={newArrivals} title="New Arrivals" />

      {/* Why choose us */}
      <section className="border-y border-border bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3">
          <div>
            <p className="font-display font-bold text-ink">Cash on Delivery</p>
            <p className="mt-1 text-sm text-ink/60">Pay karein jab saaman mile.</p>
          </div>
          <div>
            <p className="font-display font-bold text-ink">Easy Returns</p>
            <p className="mt-1 text-sm text-ink/60">7 din ke andar return karein.</p>
          </div>
          <div>
            <p className="font-display font-bold text-ink">Verified Reviews</p>
            <p className="mt-1 text-sm text-ink/60">Sirf asli kharidaaron ki reviews.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="mb-4 font-display text-xl font-bold text-ink">FAQ</h2>
        <div className="divide-y divide-border rounded-lg border border-border bg-white">
          {faqs.map((item) => (
            <details key={item.q} className="group p-4">
              <summary className="cursor-pointer list-none text-sm font-medium text-ink">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-ink/70">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
