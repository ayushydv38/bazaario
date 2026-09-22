import { createClient } from "@/lib/supabase/server";

// Shapes every row the same way the UI components expect:
// { id, name, category, price, mrp, rating, reviewCount, stock, image, description, tag }
function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.categories?.slug || null,
    price: Number(row.price),
    mrp: Number(row.mrp),
    rating: Number(row.avg_rating) || 0,
    reviewCount: row.review_count || 0,
    stock: row.stock,
    image: row.product_images?.[0]?.image_url || null,
    description: row.description,
    sku: row.sku,
  };
}

const PRODUCT_SELECT =
  "*, categories(slug, name), product_images(image_url, sort_order)";

export async function getCategories() {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
}

export async function getAllProducts() {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return (data || []).map(mapProduct);
}

export async function getProductById(id) {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .single();
  return data ? mapProduct(data) : null;
}

export async function getProductsByCategory(categorySlug) {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("categories.slug", categorySlug);
  return (data || []).filter((p) => p.categories?.slug === categorySlug).map(mapProduct);
}

export async function getFeaturedProducts() {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("avg_rating", { ascending: false })
    .limit(4);
  return (data || []).map(mapProduct);
}

export async function getNewArrivals() {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4);
  return (data || []).map(mapProduct);
}

export async function searchProducts(query) {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  return (data || []).map(mapProduct);
}

export async function getApprovedReviews(productId) {
  const supabase = createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, comment, created_at, profiles(full_name)")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  return data || [];
}
