import Link from "next/link";

const columns = [
  {
    title: "Bazaario",
    links: [
      { href: "/about", label: "Why Choose Us" },
      { href: "/contact", label: "Contact Us" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/legal/privacy-policy", label: "Privacy Policy" },
      { href: "/legal/terms", label: "Terms & Conditions" },
      { href: "/legal/shipping-policy", label: "Shipping Policy" },
      { href: "/legal/returns-refunds", label: "Return & Refund Policy" },
      { href: "/legal/cancellation-policy", label: "Cancellation Policy" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account/orders", label: "My Orders" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/login", label: "Login / Signup" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-teal text-cream">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-display text-lg font-bold">Bazaario</p>
          <p className="mt-2 text-sm text-cream/70">
            Har cheez, ek jagah — seedha aapke ghar tak.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-saffron-light">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/80 hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-cream/10 px-4 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} Bazaario. Cash on Delivery aur Manual UPI available hai.
      </div>
    </footer>
  );
}
