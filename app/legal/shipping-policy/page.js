import LegalPage from "@/components/LegalPage";

export default function ShippingPolicyPage() {
  return (
    <LegalPage title="Shipping Policy">
      <p className="rounded-md bg-saffron/10 p-3 text-xs text-saffron">
        Note: Apne asli delivery timelines/charges ke hisaab se edit karein:
        app/legal/shipping-policy/page.js
      </p>
      <h2 className="font-medium text-ink">Delivery Time</h2>
      <p>Order confirm hone ke baad, zyada tar orders 3-7 business din mein
        deliver ho jaate hain, aapke pincode ke hisaab se.</p>
      <h2 className="font-medium text-ink">Shipping Charges</h2>
      <p>₹499 se zyada ke order par shipping free hai. Usse kam order par ₹49
        shipping charge lagta hai.</p>
      <h2 className="font-medium text-ink">Tracking</h2>
      <p>Order ship hone ke baad, aap "Mere Orders" section mein tracking
        number dekh sakte hain.</p>
    </LegalPage>
  );
}
