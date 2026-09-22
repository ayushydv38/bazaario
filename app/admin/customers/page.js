import { createClient } from "@/lib/supabase/server";

export default async function AdminCustomersPage() {
  const supabase = createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, phone, created_at")
    .order("created_at", { ascending: false });

  const { data: orders } = await supabase.from("orders").select("user_id");
  const orderCounts = {};
  (orders || []).forEach((o) => {
    orderCounts[o.user_id] = (orderCounts[o.user_id] || 0) + 1;
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Customers</h1>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs text-ink/60">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Registered</th>
              <th className="p-3">Orders</th>
            </tr>
          </thead>
          <tbody>
            {(profiles || []).map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3 text-ink">{p.full_name || "—"}</td>
                <td className="p-3 text-ink/70">{p.phone || "—"}</td>
                <td className="p-3 text-ink/70">
                  {new Date(p.created_at).toLocaleDateString("en-IN")}
                </td>
                <td className="p-3 text-ink/70">{orderCounts[p.id] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
