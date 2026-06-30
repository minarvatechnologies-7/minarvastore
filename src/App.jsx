import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

const RUPEE = (n) => '₹' + Number(n).toLocaleString('en-IN')
const PHONE = '+968 7186 0220'

export default function App() {
  const [categories, setCategories] = useState([])
  const [packages, setPackages] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [view, setView] = useState('all')
  const [activeCat, setActiveCat] = useState(null)
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true); setError(null)
    try {
      const [catRes, pkgRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('packages').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }),
      ])
      if (catRes.error) throw catRes.error
      if (pkgRes.error) throw pkgRes.error
      if (prodRes.error) throw prodRes.error
      setCategories(catRes.data || [])
      setPackages(pkgRes.data || [])
      setProducts(prodRes.data || [])
    } catch (e) {
      setError(e.message || 'Could not load the catalogue.')
    } finally { setLoading(false) }
  }

  const items = useMemo(() => {
    let list = []
    if (view === 'all' || view === 'packages') list = list.concat(packages.map(p => ({ ...p, _type: 'package' })))
    if (view === 'all' || view === 'products') list = list.concat(products.map(p => ({ ...p, _type: 'product' })))
    if (activeCat) list = list.filter(i => i.category_id === activeCat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(i => i.name.toLowerCase().includes(q))
    }
    return list
  }, [view, activeCat, search, packages, products])

  function addToCart(item) {
    setCart(prev => {
      const key = item._type + ':' + item.id
      const existing = prev.find(c => c.key === key)
      if (existing) return prev.map(c => c.key === key ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { key, type: item._type, id: item.id, name: item.name, price: Number(item.price), image: item.images?.[0] || null, qty: 1 }]
    })
    setCartOpen(true)
  }
  function changeQty(key, delta) {
    setCart(prev => prev.map(c => c.key === key ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0))
  }

  const cartCount = cart.reduce((s, c) => s + c.qty, 0)
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const navCats = categories.filter(c => c.type === 'product')

  return (
    <div className="app">
      {/* promo bar */}
      <div className="promobar">
        <div className="promo-left">
          <a href="#">Contact</a><a href="#">About Us</a><a href="#">FAQs</a>
        </div>
        <div className="promo-mid">Free delivery across Kerala on CCTV kits · COD available</div>
        <div className="promo-right">India · ₹ INR</div>
      </div>

      {/* header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">MINARVA<span>.</span></div>
          <div className="searchbox">
            <select className="search-cat" value={activeCat || ''} onChange={e => setActiveCat(e.target.value ? Number(e.target.value) : null)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input className="search-input" placeholder="Search products here..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="search-btn">Search</button>
          </div>
          <div className="header-help">
            <div className="help-icon">☎</div>
            <div className="help-text"><span>Need Help?</span><b>{PHONE}</b></div>
          </div>
          <button className="header-cart" onClick={() => setCartOpen(true)}>
            <span className="hc-icon">🛒<span className="hc-count">{cartCount}</span></span>
            <span className="hc-text"><span>Cart</span><b>{RUPEE(cartTotal)}</b></span>
          </button>
        </div>
      </header>

      {/* nav */}
      <nav className="mainnav">
        <div className="nav-inner">
          <button className={view === 'all' ? 'nav-link active' : 'nav-link'} onClick={() => { setView('all'); setActiveCat(null) }}>All Products</button>
          <button className={view === 'packages' ? 'nav-link active' : 'nav-link'} onClick={() => { setView('packages'); setActiveCat(null) }}>
            CCTV Kits <span className="nav-badge">Sale</span>
          </button>
          <button className={view === 'products' ? 'nav-link active' : 'nav-link'} onClick={() => { setView('products'); setActiveCat(null) }}>Components</button>
          {navCats.slice(0, 4).map(c => (
            <button key={c.id} className={activeCat === c.id ? 'nav-link active' : 'nav-link'} onClick={() => { setView('all'); setActiveCat(c.id) }}>{c.name}</button>
          ))}
        </div>
      </nav>

      {/* hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-badge">Best Sellers</span>
            <h1 className="hero-title">Complete CCTV Kits<br/>for your home &amp; shop</h1>
            <p className="hero-sub">Ready to install. Shipped across Kerala.</p>
            <p className="hero-price">From {RUPEE(8999)} <s>{RUPEE(12999)}</s></p>
            <button className="hero-btn" onClick={() => { setView('packages'); setActiveCat(null); window.scrollTo({ top: 600, behavior: 'smooth' }) }}>Shop Now</button>
          </div>
          <div className="hero-art"><span>📹</span></div>
        </div>
      </section>

      {/* feature strip */}
      <div className="featstrip">
        <div className="feat"><span className="feat-ic">🚚</span><div><b>Free Delivery</b><small>On all CCTV kits in Kerala</small></div></div>
        <div className="feat"><span className="feat-ic">🔁</span><div><b>Easy Returns</b><small>7-day replacement</small></div></div>
        <div className="feat"><span className="feat-ic">🎧</span><div><b>Support</b><small>{PHONE}</small></div></div>
        <div className="feat"><span className="feat-ic">🛡️</span><div><b>Warranty</b><small>1 year on all products</small></div></div>
      </div>

      {/* products */}
      <main className="catalogue">
        <div className="cat-head">
          <h2>{view === 'packages' ? 'CCTV Kits' : view === 'products' ? 'Components' : 'Featured Products'}</h2>
          <div className="cat-tabs">
            <button className={view === 'all' ? 'active' : ''} onClick={() => { setView('all'); setActiveCat(null) }}>All</button>
            <button className={view === 'packages' ? 'active' : ''} onClick={() => { setView('packages'); setActiveCat(null) }}>Kits</button>
            <button className={view === 'products' ? 'active' : ''} onClick={() => { setView('products'); setActiveCat(null) }}>Components</button>
          </div>
        </div>

        {loading && <div className="state">Loading products...</div>}
        {error && <div className="state error">{error}<button className="retry" onClick={loadData}>Try again</button></div>}
        {!loading && !error && items.length === 0 && <div className="state">No products found.</div>}
        {!loading && !error && items.length > 0 && (
          <div className="pgrid">{items.map(item => <ProductCard key={item._type + item.id} item={item} onAdd={addToCart} />)}</div>
        )}
      </main>

      {/* newsletter */}
      <section className="newsletter">
        <div className="nl-inner">
          <div className="nl-text"><span className="nl-ic">✉</span><div><b>Get the best CCTV deals</b><small>Sign up for offers and new arrivals.</small></div></div>
          <div className="nl-form">
            <input placeholder="Your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="footer">
        <div className="foot-inner">
          <div className="foot-col foot-about">
            <div className="logo">MINARVA<span>.</span></div>
            <p>CCTV &amp; Security Store by Minarva Technologies. CCTV kits, cameras, and components shipped across Kerala.</p>
            <p className="foot-contact">☎ {PHONE}<br/>✉ sevenseassecuritysystems@gmail.com</p>
          </div>
          <div className="foot-col">
            <h4>Shop</h4>
            <a href="#">CCTV Kits</a><a href="#">Cameras</a><a href="#">DVR / NVR</a><a href="#">Accessories</a>
          </div>
          <div className="foot-col">
            <h4>Help</h4>
            <a href="#">Contact Us</a><a href="#">Shipping</a><a href="#">Returns</a><a href="#">Warranty</a>
          </div>
          <div className="foot-col">
            <h4>Company</h4>
            <a href="#">About Us</a><a href="#">Order Tracking</a><a href="#">Privacy Policy</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Minarva Technologies · minarva.store</span>
          <span className="pay">VISA · Mastercard · UPI · Paytm</span>
        </div>
      </footer>

      {cartOpen && <CartDrawer cart={cart} total={cartTotal} onClose={() => setCartOpen(false)} onQty={changeQty} />}
    </div>
  )
}

function ProductCard({ item, onAdd }) {
  const img = item.images?.[0]
  const isPackage = item._type === 'package'
  const discount = item.mrp && item.mrp > item.price ? Math.round((1 - item.price / item.mrp) * 100) : null
  const out = item.stock_status === 'out_of_stock'

  return (
    <article className="pcard">
      <div className="pcard-media">
        {discount && <span className="pc-badge">-{discount}%</span>}
        {item.featured && <span className="pc-new">New</span>}
        {img ? <img src={img} alt={item.name} loading="lazy" /> : <div className="pc-ph">{isPackage ? '📦' : '📷'}</div>}
      </div>
      <div className="pcard-body">
        <div className="pc-rating">★★★★★ <span>(5)</span></div>
        <h3 className="pc-title">{item.name}</h3>
        {isPackage && (
          <p className="pc-specs">
            {[item.camera_count != null ? item.camera_count + ' cameras' : null, item.dvr_type, item.storage].filter(Boolean).join(' · ')}
          </p>
        )}
        {!isPackage && item.brand && <p className="pc-specs">{item.brand}</p>}
        <div className="pc-price">
          {item.mrp && item.mrp > item.price && <s>{RUPEE(item.mrp)}</s>}
          <b>{RUPEE(item.price)}</b>
        </div>
        <button className="pc-add" disabled={out} onClick={() => onAdd(item)}>{out ? 'Out of stock' : 'Add To Cart'}</button>
      </div>
    </article>
  )
}

function CartDrawer({ cart, total, onClose, onQty }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-head"><h2>Your Cart</h2><button className="x" onClick={onClose} aria-label="Close">×</button></div>
        {cart.length === 0 ? (
          <div className="drawer-empty">Your cart is empty. Add a kit or component to get started.</div>
        ) : (
          <>
            <div className="drawer-items">
              {cart.map(c => (
                <div className="drawer-item" key={c.key}>
                  <div className="di-thumb">{c.image ? <img src={c.image} alt="" /> : (c.type === 'package' ? '📦' : '📷')}</div>
                  <div className="di-info"><span className="di-name">{c.name}</span><span className="di-price">{RUPEE(c.price)}</span></div>
                  <div className="qty"><button onClick={() => onQty(c.key, -1)}>−</button><span>{c.qty}</span><button onClick={() => onQty(c.key, +1)}>+</button></div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="sub-row"><span>Subtotal</span><span>{RUPEE(total)}</span></div>
              <p className="ship-note">Shipping calculated at checkout. COD available — shipping paid in advance.</p>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
