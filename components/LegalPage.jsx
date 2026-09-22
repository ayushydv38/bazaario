export default function LegalPage({ title, children }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink/70">{children}</div>
    </div>
  );
}
