# Bazaario — Poori Website (₹0 Cost)

Ye poori working e-commerce website hai — koi demo nahi, sab kuch asli
database se connected hai:

- Homepage, Categories, Product listing, Search, Filters, Sort
- Product detail page — Add to Cart, Buy Now, Wishlist, Reviews
- Cart, Coupons, Checkout, Address management
- Real orders (database mein save hote hain, stock automatically kam hota hai)
- Order tracking (status: Pending → Confirmed → ... → Delivered)
- Login / Signup / Logout / Forgot Password (Supabase Authentication)
- Admin Panel: Dashboard, Products, Orders, Customers, Reviews, Coupons
- Legal pages (Privacy Policy, Terms, Shipping, Returns, Cancellation)
- Cash on Delivery + Manual UPI payment
- Mobile-first design

---

## Live Database — Kya localStorage mein hai, kya nahi

**Kuch bhi ab localStorage (sirf aapke phone/browser) mein save nahi hota.**
Cart, Wishlist, Orders, Products, Reviews, Addresses — sab **Supabase
database** mein hain. Matlab aap kisi bhi phone/laptop se login karein,
aapka cart aur poora data wahi milega — live, sabke liye same backend.

Ismein ek badlav hai: **Cart aur Wishlist use karne ke liye ab login
zaroori hai** (pehle guest bhi cart use kar sakte the, jo device tak
limited rehta tha — ab wo hata diya gaya hai taaki sab kuch backend se
jude).

---

## Step 1 — Apne computer par chalayein

1. Node.js install karein (free): https://nodejs.org (LTS version)
2. Is `bazaario` folder ko kahin rakh dein, terminal us folder mein kholein
3. `npm install`
4. `npm run dev`
5. Browser mein: http://localhost:3000

---

## Step 2 — Supabase (database) setup karein

1. https://supabase.com par free account banayein → "New Project"
2. Left menu mein **SQL Editor** kholein
3. `supabase/schema.sql` ka poora content copy-paste karke **Run** karein
4. Fir `supabase/02_phase3.sql` ka content copy-paste karke **Run** karein
   (ye real sample products/categories daal dega, aur stock/rating ke
   automatic rules set kar dega)
5. **Project Settings → API** se **Project URL** aur **anon public key**
   copy karein
6. `.env.local.example` file ka naam badal kar `.env.local` karein, usmein
   ye dono values daal dein
7. `npm run dev` phir se chalayein

### Khud ko Admin banana

Signup karke apna account banayein. Fir Supabase → **SQL Editor** mein ye
chalayein (apna email daal kar):

```sql
update profiles set is_admin = true
where id = (select id from auth.users where email = 'aapka-email@example.com');
```

Ab login karke `/admin` par jaayein — dashboard, products, orders sab
manage kar sakte hain.

---

## Step 3 — Free mein internet par live karna

1. Is poore `bazaario` folder ko **GitHub** par upload karein
   (GitHub website se "Add file → Upload files" se bhi ho jaata hai)
2. **Netlify** (https://netlify.com) ya **Cloudflare Pages** par
   "Import from GitHub" se apna repo connect karein
3. Site settings → **Environment variables** mein wahi do Supabase values
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) add karein
4. Deploy/Redeploy — kuch minute mein free live link mil jayega

---

## Abhi kya baaki hai (jab business badhe tab)

- Real payment gateway (Razorpay/Cashfree) — RBI-authorized, KYC ke saath
- Courier/shipping API se automatic tracking
- Email/SMS/WhatsApp notifications
- Product variants UI (size/colour) — database table ready hai, UI baad mein
- GST invoice automation

In sabke liye architecture already ready hai — website ko dobara banane ki
zaroorat nahi padegi.

---

## Kisi bhi cheez mein dikkat ho to

Bata dijiyega — page, feature, ya error, jo bhi ho, main dekh kar theek
kar dunga.
