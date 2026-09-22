import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function OrdersListPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total, payment_method, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Mere Orders</h1>

      {(!orders || orders.length === 0) && (
        <p className="mt-4 text-sm text-ink/60">Abhi koi order nahi hai.</p>
      )}

      <div className="mt-4 space-y-3">
        {orders?.map((order) => (
          <Link
            key={order.id}
            href={`/order/${order.id}`}
            className="block rounded-lg border border-border bg-white p-4 hover:border-teal"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">
                Order #{order.id.slice(0, 8)}
              </span>
              <span className="rounded-full bg-saffron/20 px-3 py-1 text-xs font-semibold text-saffron">
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink/60">
              {new Date(order.created_at).toLocaleDateString("en-IN")} · ₹{order.total} ·{" "}
              {order.payment_method === "cod" ? "COD" : "UPI"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
