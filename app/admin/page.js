import { createClient } from "@/lib/supabase/server";

async function count(supabase, table, filters = {}) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value);
  }
  const { count: c } = await query;
  return c || 0;
}

export default async function AdminDashboard() {
  const supabase = createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    todayOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalCustomers,
    totalProducts,
  ] = await Promise.all([
    count(supabase, "orders"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString())
      .then((r) => r.count || 0),
    count(supabase, "orders", { status: "pending" }),
    count(supabase, "orders", { status: "delivered" }),
    count(supabase, "orders", { status: "cancelled" }),
    count(supabase, "profiles"),
    count(supabase, "products"),
  ]);

  const { data: salesData } = await supabase.from("orders").select("total");
  const totalSales = (salesData || []).reduce((sum, o) => sum + Number(o.total), 0);

  const { data: lowStock } = await supabase
    .from("products")
    .select("id, name, stock")
    .lt("stock", 10)
    .order("stock");

  const stats = [
    { label: "Total Orders", value: totalOrders },
    { label: "Today's Orders", value: todayOrders },
    { label: "Total Sales", value: `₹${totalSales}` },
    { label: "Pending Orders", value: pendingOrders },
    { label: "Delivered Orders", value: deliveredOrders },
    { label: "Cancelled Orders", value: cancelledOrders },
    { label: "Total Customers", value: totalCustomers },
    { label: "Total Products", value: totalProducts },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs text-ink/60">{s.label}</p>
            <p className="mt-1 font-display text-xl font-bold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      {lowStock && lowStock.length > 0 && (
        <div className="mt-6 rounded-lg border border-saffron bg-saffron/10 p-4">
          <p className="text-sm font-medium text-ink">Low-stock Products</p>
          <ul className="mt-2 space-y-1 text-sm text-ink/70">
            {lowStock.map((p) => (
              <li key={p.id}>{p.name} — {p.stock} left</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
