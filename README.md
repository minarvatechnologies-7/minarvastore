# Minarva Store

CCTV & security e-commerce store (React + Vite + Supabase). Targets Kerala, India (INR, Paytm/COD).

## Setup
1. `npm install`
2. Copy `.env.example` to `.env`, add your Supabase URL + anon key.
3. In Supabase SQL Editor, run `supabase_schema.sql` (first time), then `supabase_migration.sql`.
4. `npm run dev`

## Deploy (Vercel)
1. Push source to GitHub.
2. Import to Vercel. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars.
3. `vercel.json` handles SPA routing (so /checkout etc. work on refresh).

## Structure
- `src/components/` — Header, Hero, ProductCard, CartDrawer, etc.
- `src/pages/` — Home, ProductDetail, Checkout, About, Contact
- `src/context/CartContext.jsx` — cart + localStorage + stock checks
- `src/lib/` — money helpers, catalogue data hook

## TODO before launch
- Replace PHONE in `src/components/Header.jsx` with real India number
- Replace WA_NUMBER in `src/components/WhatsAppButton.jsx`
- Integrate Paytm live payment (checkout currently saves order + COD shipping logic)
- Integrate Shiprocket for live shipping rates (currently flat ₹99)
- Build the admin panel to add real products + images
