import LegalPage from "@/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p className="rounded-md bg-saffron/10 p-3 text-xs text-saffron">
        Note: Ye template hai — apne business ke hisaab se edit karein:
        app/legal/terms/page.js
      </p>
      <p>Bazaario website use karke, aap in terms se sehmat hote hain.</p>
      <h2 className="font-medium text-ink">Orders</h2>
      <p>Order place karne ke baad, hum ise confirm karenge. Stock availability
        ke hisaab se order cancel bhi ho sakta hai — us case mein aapko
        pehle inform kiya jayega.</p>
      <h2 className="font-medium text-ink">Pricing</h2>
      <p>Saare prices INR mein hain. Hum bina notice ke prices badal sakte hain,
        lekin already placed order par ye lagu nahi hoga.</p>
      <h2 className="font-medium text-ink">Account</h2>
      <p>Apne account ki jaankari (password, OTP) kisi se share na karein.
        Kisi bhi galat activity ki zimmedari account holder ki hogi.</p>
    </LegalPage>
  );
}
