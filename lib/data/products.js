// This file holds placeholder data so the UI has something real to render.
// In Phase 2, these functions will be swapped for Supabase database queries —
// the rest of the app won't need to change because it only calls these functions.

export const categories = [
  { id: "fashion", name: "Fashion", image: "/categories/fashion.jpg" },
  { id: "electronics", name: "Electronics", image: "/categories/electronics.jpg" },
  { id: "home", name: "Home & Living", image: "/categories/home.jpg" },
  { id: "beauty", name: "Beauty & Personal Care", image: "/categories/beauty.jpg" },
  { id: "grocery", name: "Grocery", image: "/categories/grocery.jpg" },
  { id: "toys", name: "Toys & Kids", image: "/categories/toys.jpg" },
];

export const products = [
  {
    id: "p1",
    name: "Cotton Handloom Kurta",
    category: "fashion",
    price: 899,
    mrp: 1299,
    rating: 4.4,
    reviewCount: 128,
    stock: 24,
    image: "/products/kurta.jpg",
    description: "Breathable handloom cotton kurta, perfect for daily wear.",
    tag: "bestseller",
  },
  {
    id: "p2",
    name: "Wireless Earbuds Pro",
    category: "electronics",
    price: 1499,
    mrp: 2499,
    rating: 4.1,
    reviewCount: 342,
    stock: 51,
    image: "/products/earbuds.jpg",
    description: "40-hour battery life with active noise cancellation.",
    tag: "new",
  },
  {
    id: "p3",
    name: "Ceramic Dinner Set (12 pcs)",
    category: "home",
    price: 1199,
    mrp: 1799,
    rating: 4.6,
    reviewCount: 87,
    stock: 15,
    image: "/products/dinnerset.jpg",
    description: "Microwave-safe ceramic dinner set for everyday dining.",
    tag: "bestseller",
  },
  {
    id: "p4",
    name: "Herbal Face Wash",
    category: "beauty",
    price: 249,
    mrp: 349,
    rating: 4.3,
    reviewCount: 210,
    stock: 96,
    image: "/products/facewash.jpg",
    description: "Neem and tulsi based face wash for daily use.",
    tag: "offer",
  },
  {
    id: "p5",
    name: "Assorted Dry Fruits Box",
    category: "grocery",
    price: 699,
    mrp: 899,
    rating: 4.5,
    reviewCount: 64,
    stock: 40,
    image: "/products/dryfruits.jpg",
    description: "Premium almonds, cashews and raisins — 500g box.",
    tag: "new",
  },
  {
    id: "p6",
    name: "Wooden Building Blocks",
    category: "toys",
    price: 599,
    mrp: 799,
    rating: 4.7,
    reviewCount: 53,
    stock: 30,
    image: "/products/blocks.jpg",
    description: "Non-toxic wooden blocks set for ages 3+.",
    tag: "bestseller",
  },
];

export function getAllProducts() {
  return products;
}

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getProductsByCategory(categoryId) {
  return products.filter((p) => p.category === categoryId);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.tag === "bestseller");
}

export function getNewArrivals() {
  return products.filter((p) => p.tag === "new");
}

export function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
