import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../lib/money'

export default function CartDrawer() {
  const { cart, total, drawerOpen, setDrawerOpen, changeQty, removeItem } = useCart()
  const navigate = useNavigate()
  const closeRef = useRef(null)
  const drawerRef = useRef(null)

  // Esc to close + scroll lock + focus close button (BUG #11)
  useEffect(() => {
    if (!drawerOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKey(e) {
      if (e.key === 'Escape') { setDrawerOpen(false); return }
      if (e.key === 'Tab') {
        // simple focus trap
        const focusables = drawerRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [drawerOpen, setDrawerOpen])

  if (!drawerOpen) return null

  function checkout() {
    setDrawerOpen(false)
    navigate('/checkout')
  }

  return (
    <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
      <aside className="drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-label="Shopping cart"
        onClick={e => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>Your Cart</h2>
          <button className="x" ref={closeRef} onClick={() => setDrawerOpen(false)} aria-label="Close cart">×</button>
        </div>

        {cart.length === 0 ? (
          <div className="drawer-empty">
            Your cart is empty. Add a kit or component to get started.
            <button className="continue-btn" onClick={() => setDrawerOpen(false)}>Continue shopping</button>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {cart.map(c => (
                <div className="drawer-item" key={c.key}>
                  <div className="di-thumb">{c.image ? <img src={c.image} alt="" /> : (c.type === 'package' ? '📦' : '📷')}</div>
                  <div className="di-info">
                    <span className="di-name">{c.name}</span>
                    <span className="di-price">{formatMoney(c.price)}</span>
                    <button className="di-remove" onClick={() => removeItem(c.key)}>Remove</button>
                  </div>
                  <div className="qty">
                    <button onClick={() => changeQty(c.key, -1)} aria-label="Decrease quantity">−</button>
                    <span>{c.qty}</span>
                    <button onClick={() => changeQty(c.key, +1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="sub-row"><span>Subtotal</span><span>{formatMoney(total)}</span></div>
              <p className="ship-note">Shipping calculated at checkout. COD available — shipping paid in advance.</p>
              <button className="checkout-btn" onClick={checkout}>Proceed to Checkout</button>
              <button className="continue-btn" onClick={() => setDrawerOpen(false)}>Continue shopping</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
