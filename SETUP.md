# Minarva Store — Setup (Step 1)

## What's built so far
- Product catalogue page (packages/kits + individual products/components)
- Category filter + view tabs (All / Kits / Components)
- Add to cart + cart drawer with quantity controls
- Surveillance midnight/cyan theme, mobile responsive

## Setup steps

### 1. Supabase
1. Create a NEW Supabase project (separate from Sevenseas ERP) at supabase.com
2. Open SQL Editor → paste contents of `supabase_schema.sql` → Run
3. Project Settings → API → copy the Project URL and anon public key

### 2. Connect the app
1. Copy `.env.example` to `.env`
2. Paste your Supabase URL and anon key into `.env`

### 3. Run locally
    npm install
    npm run dev

### 4. Deploy (same as your ERP workflow)
1. npm run build
2. zip the dist folder
3. Upload to GitHub repo root
4. Vercel auto-deploy
5. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables
6. Ctrl+Shift+R to hard refresh

## Coming next (after you confirm Step 1 works)
- Step 2: Checkout page (address, pincode, payment method)
- Step 3: Paytm payment + COD-with-advance-shipping logic
- Step 4: Shiprocket integration (shipping rate by pincode + order push)
- Step 5: Admin panel (add/edit packages & products, manage orders)
