"use client";

export default function SortSelect({ current, category, q }) {
  function handleChange(e) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (e.target.value) params.set("sort", e.target.value);
    window.location.href = `/products?${params.toString()}`;
  }

  return (
    <form className="text-sm">
      <label htmlFor="sort" className="sr-only">
        Sort by
      </label>
      <select
        id="sort"
        name="sort"
        defaultValue={current || ""}
        onChange={handleChange}
        className="rounded-md border border-border bg-white px-3 py-1.5 text-ink"
      >
        <option value="">Sabse relevant</option>
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </form>
  );
}
