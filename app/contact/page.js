export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">Contact Us</h1>
      <div className="mt-4 space-y-2 text-sm text-ink/70">
        <p className="rounded-md bg-saffron/10 p-3 text-xs text-saffron">
          Note: Apna asli support email/phone yahan daalein: app/contact/page.js
        </p>
        <p>Email: support@bazaario.example</p>
        <p>WhatsApp: +91-XXXXXXXXXX</p>
        <p>Support hours: Mon–Sat, 10am – 7pm</p>
      </div>
    </div>
  );
}
