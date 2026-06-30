import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

const RUPEE = (n) => '₹' + Number(n).toLocaleString('en-IN')

export default function App() {
  const [categories, setCategories] = useState([])
  const [packages, setPackages] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [view, setView] = useState('all')
  const [activeCat, setActiveCat] = useState(null)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    setError(null)
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
    } finally {
      setLoading(false)
    }
  }

  const items = useMemo(() => {
    let list = []
    if (view === 'all' || view === 'packages') list = list.concat(packages.map(p => ({ ...p, _type: 'package' })))
    if (view === 'all' || view === 'products') list = list.concat(products.map(p => ({ ...p, _type: 'product' })))
    if (activeCat) list = list.filter(i => i.category_id === activeCat)
    return list
  }, [view, activeCat, packages, products])

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

  const visibleCats = useMemo(() => {
    if (view === 'packages') return categories.filter(c => c.type === 'package')
    if (view === 'products') return categories.filter(c => c.type === 'product')
    return categories
  }, [view, categories])

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">▣</span>
          <div className="brand-text">
            <span className="brand-name">MINARVA</span>
            <span className="brand-sub">CCTV &amp; Security Store</span>
          </div>
        </div>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          Cart{cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </header>

      <section className="hero">
        <p className="hero-eyebrow">Kerala · Doorstep delivery · COD available</p>
        <h1 className="hero-title">See everything.<br/>Protect what matters.</h1>
        <p className="hero-desc">Ready-to-install CCTV kits and components, shipped across Kerala. Pick a complete kit or build your own setup.</p>
      </section>

      <nav className="filters">
        <div className="view-tabs">
          <button className={view === 'all' ? 'active' : ''} onClick={() => { setView('all'); setActiveCat(null) }}>All</button>
          <button className={view === 'packages' ? 'active' : ''} onClick={() => { setView('packages'); setActiveCat(null) }}>Kits</button>
          <button className={view === 'products' ? 'active' : ''} onClick={() => { setView('products'); setActiveCat(null) }}>Components</button>
        </div>
        <div className="cat-chips">
          <button className={!activeCat ? 'chip active' : 'chip'} onClick={() => setActiveCat(null)}>All categories</button>
          {visibleCats.map(c => (
            <button key={c.id} className={activeCat === c.id ? 'chip active' : 'chip'} onClick={() => setActiveCat(c.id)}>{c.name}</button>
          ))}
        </div>
      </nav>

      <main className="grid-wrap">
        {loading && <div className="state">Loading the catalogue…</div>}
        {error && (<div className="state error">{error}<button className="retry" onClick={loadData}>Try again</button></div>)}
        {!loading && !error && items.length === 0 && (<div className="state">No items here yet. Add some from the admin panel.</div>)}
        {!loading && !error && items.length > 0 && (
          <div className="grid">{items.map(item => (<ItemCard key={item._type + item.id} item={item} onAdd={addToCart} />))}</div>
        )}
      </main>

      <footer className="footer">
        <div className="foot-brand">MINARVA</div>
        <p>Minarva Technologies · minarva.store</p>
        <p className="foot-fine">Sold &amp; shipped by Minarva Technologies</p>
      </footer>

      {cartOpen && (<CartDrawer cart={cart} total={cartTotal} onClose={() => setCartOpen(false)} onQty={changeQty} />)}
    </div>
  )
}

function ItemCard({ item, onAdd }) {
  const img = item.images?.[0]
  const isPackage = item._type === 'package'
  const discount = item.mrp && item.mrp > item.price ? Math.round((1 - item.price / item.mrp) * 100) : null
  const out = item.stock_status === 'out_of_stock'

  return (
    <article className="card">
      <div className="card-media">
        {img ? <img src={img} alt={item.name} loading="lazy" /> : <div className="ph"><span>{isPackage ? '▣' : '○'}</span></div>}
        <span className={isPackage ? 'tag tag-kit' : 'tag tag-part'}>{isPackage ? 'KIT' : 'COMPONENT'}</span>
        {discount && <span className="tag tag-off">-{discount}%</span>}
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.name}</h3>
        {isPackage && (
          <ul className="specs">
            {item.camera_count != null && <li><b>{item.camera_count}</b> cameras</li>}
            {item.dvr_type && <li>{item.dvr_type}</li>}
            {item.storage && <li>{item.storage}</li>}
            {item.cable_length && <li>{item.cable_length} cable</li>}
          </ul>
        )}
        {!isPackage && item.brand && <p className="brand-line">{item.brand}</p>}
        <div className="price-row">
          <span className="price">{RUPEE(item.price)}</span>
          {item.mrp && item.mrp > item.price && <span className="mrp">{RUPEE(item.mrp)}</span>}
        </div>
        <button className="add-btn" disabled={out} onClick={() => onAdd(item)}>{out ? 'Out of stock' : 'Add to cart'}</button>
      </div>
    </article>
  )
}

function CartDrawer({ cart, total, onClose, onQty }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>Your cart</h2>
          <button className="x" onClick={onClose} aria-label="Close">×</button>
        </div>
        {cart.length === 0 ? (
          <div className="drawer-empty">Your cart is empty. Add a kit or component to get started.</div>
        ) : (
          <>
            <div className="drawer-items">
              {cart.map(c => (
                <div className="drawer-item" key={c.key}>
                  <div className="di-thumb">{c.image ? <img src={c.image} alt="" /> : (c.type === 'package' ? '▣' : '○')}</div>
                  <div className="di-info">
                    <span className="di-name">{c.name}</span>
                    <span className="di-price">{RUPEE(c.price)}</span>
                  </div>
                  <div className="qty">
                    <button onClick={() => onQty(c.key, -1)}>−</button>
                    <span>{c.qty}</span>
                    <button onClick={() => onQty(c.key, +1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="sub-row"><span>Subtotal</span><span>{RUPEE(total)}</span></div>
              <p className="ship-note">Shipping calculated at checkout. COD available — shipping paid in advance.</p>
              <button className="checkout-btn">Proceed to checkout</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
