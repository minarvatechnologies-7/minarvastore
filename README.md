# Minarva Store

CCTV & security e-commerce storefront for Kerala (React + Vite + Supabase).

**Live:** https://minarvastore.vercel.app/

## Stack
- React 18 + Vite 5
- React Router 6
- Supabase (catalogue, orders, enquiries, newsletter)

## Setup
```bash
npm install
cp .env.example .env   # already filled for this project
npm run dev
```

### Supabase
1. Project: `vrstwzxnsztxwvsbzhfd`
2. Run `supabase_schema.sql` then `supabase_migration.sql` in SQL Editor (first time)
3. Optionally run `supabase_seed_extra.sql` for more sample products

### Deploy (Vercel)
- Connected to this GitHub repo
- Set env (optional if fallbacks used):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- `vercel.json` SPA rewrites are included

## Structure
- `src/pages/` — Home, ProductDetail, Checkout, About, Contact, FAQ
- `src/components/` — Header, Hero, ProductCard, CartDrawer, etc.
- `src/context/CartContext.jsx` — cart + localStorage
- `src/lib/useCatalogue.js` — live catalogue from Supabase

## Before launch checklist
- [ ] Replace phone in `Header.jsx` and `WhatsAppButton.jsx`
- [ ] Add real product images (Supabase Storage or CDN URLs in `images` array)
- [ ] Run extra seed / add products via SQL or admin
- [ ] Paytm / UPI live payment (checkout currently records COD + shipping logic)
- [ ] Shiprocket for live rates (flat ₹99 for now)
