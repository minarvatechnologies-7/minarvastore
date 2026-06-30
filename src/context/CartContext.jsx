import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toNum } from '../lib/money'

const CartContext = createContext(null)
const STORAGE_KEY = 'minarva_cart_v1'

// Read initial cart from localStorage (BUG #3) with SSR guard
function readStored() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children, onToast }) {
  const [cart, setCart] = useState(readStored)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Persist on change (BUG #3)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch { /* storage full / unavailable — ignore */ }
  }, [cart])

  // Resolve available stock for an item; null means "no limit set"
  const stockOf = (item) => {
    const s = item.stock ?? item.stock_qty ?? item.quantity
    return s == null ? null : toNum(s)
  }

  const addToCart = useCallback((item, opts = {}) => {
    const key = item._type + ':' + item.id
    const limit = item.stock == null ? null : toNum(item.stock)
    let blocked = false
    setCart(prev => {
      const existing = prev.find(c => c.key === key)
      const current = existing ? existing.qty : 0
      if (limit != null && current + 1 > limit) { blocked = true; return prev }
      if (existing) return prev.map(c => c.key === key ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, {
        key, type: item._type, id: item.id, name: item.name,
        price: toNum(item.price), image: item.images?.[0] || null,
        qty: 1, stock: limit,
      }]
    })
    if (blocked) onToast?.('Reached available stock limit', 'error')
    else {
      onToast?.('Added to cart', 'success')
      if (opts.openDrawer) setDrawerOpen(true)
    }
  }, [onToast])

  const changeQty = useCallback((key, delta) => {
    setCart(prev => prev
      .map(c => {
        if (c.key !== key) return c
        const next = c.qty + delta
        if (c.stock != null && next > c.stock) { onToast?.('Reached available stock limit', 'error'); return c }
        return { ...c, qty: next }
      })
      .filter(c => c.qty > 0))
  }, [onToast])

  const removeItem = useCallback((key) => {
    setCart(prev => prev.filter(c => c.key !== key))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const count = cart.reduce((s, c) => s + c.qty, 0)
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0)

  const value = {
    cart, count, total, drawerOpen, setDrawerOpen,
    addToCart, changeQty, removeItem, clearCart, stockOf,
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
