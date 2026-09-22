import LegalPage from "@/components/LegalPage";

export default function ReturnsRefundsPage() {
  return (
    <LegalPage title="Return & Refund Policy">
      <p className="rounded-md bg-saffron/10 p-3 text-xs text-saffron">
        Note: Apni asli return window/conditions ke hisaab se edit karein:
        app/legal/returns-refunds/page.js
      </p>
      <h2 className="font-medium text-ink">Return Window</h2>
      <p>Delivery ke 7 din ke andar aap product return kar sakte hain, agar wo
        original condition mein ho aur packaging ke saath ho.</p>
      <h2 className="font-medium text-ink">Refund</h2>
      <p>Return approve hone ke baad, refund process shuru hoga. COD orders ke
        liye refund bank transfer/UPI se kiya jayega — iske liye aapka bank
        detail maanga ja sakta hai.</p>
      <h2 className="font-medium text-ink">Non-returnable items</h2>
      <p>Kuch categories (jaise personal care items agar khola gaya ho) return
        eligible nahi ho sakti — product page par ye zikar hoga.</p>
    </LegalPage>
  );
}
