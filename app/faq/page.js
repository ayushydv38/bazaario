const faqs = [
  { q: "Delivery mein kitna time lagta hai?", a: "Zyada tar orders 3-7 din mein deliver ho jaate hain." },
  { q: "Payment ke options kya hain?", a: "Cash on Delivery aur Manual UPI available hai." },
  { q: "Return kaise karoon?", a: "Delivery ke 7 din ke andar 'Mere Orders' se return request kar sakte hain." },
  { q: "Order cancel kaise karoon?", a: "Order ship hone se pehle 'Mere Orders' mein jaakar cancel kar sakte hain." },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">FAQ</h1>
      <div className="mt-4 divide-y divide-border rounded-lg border border-border bg-white">
        {faqs.map((item) => (
          <details key={item.q} className="p-4">
            <summary className="cursor-pointer text-sm font-medium text-ink">{item.q}</summary>
            <p className="mt-2 text-sm text-ink/70">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
