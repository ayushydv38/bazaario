import Link from "next/link";
import SearchBar from "./SearchBar";
import CartBadge from "./CartBadge";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-teal">
            Bazaario
          </Link>
          <nav className="flex items-center gap-4 sm:hidden">
            <CartBadge />
            <Link href="/account" aria-label="Account" className="text-ink">
              <UserIcon />
            </Link>
          </nav>
        </div>

        <SearchBar />

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/products" className="text-sm font-medium text-ink hover:text-teal">
            Products
          </Link>
          <Link href="/wishlist" className="text-sm font-medium text-ink hover:text-teal">
            Wishlist
          </Link>
          <CartBadge />
          <Link href="/account" aria-label="Account" className="text-ink hover:text-teal">
            <UserIcon />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
