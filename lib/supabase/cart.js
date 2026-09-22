// All cart data lives in Supabase (carts + cart_items tables) — not
// localStorage. This means a customer's cart is the same whether they
// open the site on their phone, laptop, or any other device, as long
// as they're logged in.

async function getOrCreateCartId(supabase, userId) {
  const { data: existing } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (error) throw error;
  return created.id;
}

export async function getCartItems(supabase, userId) {
  const cartId = await getOrCreateCartId(supabase, userId);
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, quantity, product_id, products(id, name, price, mrp, stock)")
    .eq("cart_id", cartId);

  if (error) throw error;

  return (data || [])
    .filter((row) => row.products)
    .map((row) => ({
      cartItemId: row.id,
      qty: row.quantity,
      product: row.products,
    }));
}

export async function addToCart(supabase, userId, productId, qty = 1) {
  const cartId = await getOrCreateCartId(supabase, userId);

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + qty })
      .eq("id", existing.id);
  } else {
    await supabase.from("cart_items").insert({
      cart_id: cartId,
      product_id: productId,
      quantity: qty,
    });
  }
}

export async function updateCartItemQty(supabase, cartItemId, qty) {
  await supabase.from("cart_items").update({ quantity: qty }).eq("id", cartItemId);
}

export async function removeCartItem(supabase, cartItemId) {
  await supabase.from("cart_items").delete().eq("id", cartItemId);
}

export async function clearCart(supabase, userId) {
  const cartId = await getOrCreateCartId(supabase, userId);
  await supabase.from("cart_items").delete().eq("cart_id", cartId);
}

export async function isInCart(supabase, userId, productId) {
  const cartId = await getOrCreateCartId(supabase, userId);
  const { data } = await supabase
    .from("cart_items")
    .select("id")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();
  return !!data;
}
