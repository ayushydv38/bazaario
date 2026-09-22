import LegalPage from "@/components/LegalPage";

export default function CancellationPolicyPage() {
  return (
    <LegalPage title="Cancellation Policy">
      <p className="rounded-md bg-saffron/10 p-3 text-xs text-saffron">
        Note: Apne asli cancellation rules ke hisaab se edit karein:
        app/legal/cancellation-policy/page.js
      </p>
      <p>Order "Shipped" hone se pehle tak, aap use "Mere Orders" mein jaakar
        cancel kar sakte hain. Ek baar order ship ho jaaye, uske baad cancel
        nahi ho sakta — aap delivery ke baad return kar sakte hain.</p>
    </LegalPage>
  );
}
