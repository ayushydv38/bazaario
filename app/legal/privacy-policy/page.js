import LegalPage from "@/components/LegalPage";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="rounded-md bg-saffron/10 p-3 text-xs text-saffron">
        Note: Ye ek template hai — apne asli business practices ke hisaab se ise
        edit karein is file mein: app/legal/privacy-policy/page.js
      </p>
      <p>Bazaario aapki privacy ka sammaan karta hai. Ye policy batati hai ki hum
        aapki jaankari kaise collect, use aur protect karte hain.</p>
      <h2 className="font-medium text-ink">Hum kya jaankari collect karte hain</h2>
      <p>Naam, email, phone number, delivery address, aur order history — jab aap
        account banate hain ya order place karte hain.</p>
      <h2 className="font-medium text-ink">Hum ye jaankari kaise use karte hain</h2>
      <p>Order process karne, delivery ke liye, customer support dene, aur account
        manage karne ke liye. Hum aapki jaankari kisi teesre paksh ko bina zaroorat
        ke nahi bechte.</p>
      <h2 className="font-medium text-ink">Data Security</h2>
      <p>Aapka data Supabase ke secure database mein store hota hai, jisme
        Row Level Security laagu hai — matlab sirf aap khud apna data dekh sakte
        hain.</p>
      <h2 className="font-medium text-ink">Contact</h2>
      <p>Kisi bhi sawaal ke liye Contact Us page se sampark karein.</p>
    </LegalPage>
  );
}
