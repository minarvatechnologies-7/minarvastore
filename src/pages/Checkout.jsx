import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useCart } from '../context/CartContext'
import { supabase } from '../supabaseClient'
import { formatMoney } from '../lib/money'

const FLAT_SHIPPING = 99 // flat shipping charge (₹) — adjust per Shiprocket later

export default function Checkout({ data }) {
  const { categories } = data
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address1: '', address2: '', city: '', pincode: '',
  })
  const [payment, setPayment] = useState('cod') // 'cod' | 'paytm'
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null) // order_no
  const [err, setErr] = useState('')
  const [search, setSearch] = useState('')

  const shipping = FLAT_SHIPPING
  const grandTotal = total + shipping
  // COD: customer pays shipping in advance online; rest on delivery
  const payOnline = payment === 'paytm' ? grandTotal : shipping
  const dueOnDelivery = payment === 'paytm' ? 0 : total

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function validate() {
    if (!form.name.trim()) return 'Enter your name.'
    if (!/^[0-9]{10}$/.test(form.phone.trim())) return 'Enter a valid 10-digit phone number.'
    if (!form.address1.trim()) return 'Enter your address.'
    if (!form.city.trim()) return 'Enter your city.'
    if (!/^[0-9]{6}$/.test(form.pincode.trim())) return 'Enter a valid 6-digit pincode.'
    return null
  }

  async function placeOrder() {
    const v = validate()
    if (v) { setErr(v); return }
    if (cart.length === 0) { setErr('Your cart is empty.'); return }
    setErr(''); setSubmitting(true)

    const orderNo = 'MNV-' + Date.now().toString().slice(-8)
    try {
      const { data: orderRow, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_no: orderNo,
          customer_name: form.name.trim(),
          customer_phone: form.phone.trim(),
          customer_email: form.email.trim() || null,
          address_line1: form.address1.trim(),
          address_line2: form.address2.trim() || null,
          city: form.city.trim(),
          state: 'Kerala',
          pincode: form.pincode.trim(),
          items_total: total,
          shipping_charge: shipping,
          grand_total: grandTotal,
          payment_method: payment,
          amount_paid_online: payOnline,
          amount_due_on_delivery: dueOnDelivery,
          payment_status: 'pending',
          order_status: 'new',
        })
        .select()
        .single()
      if (orderErr) throw orderErr

      const lineItems = cart.map(c => ({
        order_id: orderRow.id,
        item_type: c.type,
        item_id: c.id,
        item_name: c.name,
        unit_price: c.price,
        quantity: c.qty,
        line_total: c.price * c.qty,
      }))
      const { error: liErr } = await supabase.from('order_items').insert(lineItems)
      if (liErr) throw liErr

      clearCart()
      setDone(orderNo)
      // NOTE: Paytm live payment integration is a later step.
    } catch (e) {
      setErr('Could not place the order. Please try again. ' + (e.message || ''))
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <>
        <Header categories={categories} activeCat={null} setActiveCat={() => navigate('/')} search={search} setSearch={setSearch} />
        <div className="checkout-done">
          <div className="cd-tick">✓</div>
          <h1>Order placed</h1>
          <p>Your order number is <b>{done}</b>. We'll call you on {form.phone} to confirm.</p>
          {payment === 'cod'
            ? <p className="cd-note">You paid {formatMoney(shipping)} shipping online. {formatMoney(total)} is due on delivery.</p>
            : <p className="cd-note">Online payment of {formatMoney(grandTotal)} pending — Paytm integration coming soon.</p>}
          <Link to="/" className="hero-btn">Continue shopping</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Header categories={categories} activeCat={null} setActiveCat={() => navigate('/')} search={search} setSearch={setSearch} />
      <div className="checkout">
        <Link to="/" className="pdp-back">← Back to store</Link>
        <h1>Checkout</h1>

        {cart.length === 0 ? (
          <div className="state">Your cart is empty. <Link to="/">Browse products</Link></div>
        ) : (
          <div className="checkout-grid">
            <div className="checkout-form">
              <h3>Delivery details</h3>
              <div className="field"><label>Full name</label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
              <div className="field-row">
                <div className="field"><label>Phone (10-digit)</label><input value={form.phone} onChange={e => set('phone', e.target.value)} inputMode="numeric" /></div>
                <div className="field"><label>Email (optional)</label><input value={form.email} onChange={e => set('email', e.target.value)} type="email" /></div>
              </div>
              <div className="field"><label>Address line 1</label><input value={form.address1} onChange={e => set('address1', e.target.value)} /></div>
              <div className="field"><label>Address line 2 (optional)</label><input value={form.address2} onChange={e => set('address2', e.target.value)} /></div>
              <div className="field-row">
                <div className="field"><label>City</label><input value={form.city} onChange={e => set('city', e.target.value)} /></div>
                <div className="field"><label>Pincode</label><input value={form.pincode} onChange={e => set('pincode', e.target.value)} inputMode="numeric" /></div>
              </div>

              <h3>Payment</h3>
              <label className={'pay-opt ' + (payment === 'cod' ? 'sel' : '')}>
                <input type="radio" name="pay" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                <div><b>Cash on Delivery</b><small>Pay {formatMoney(shipping)} shipping now, rest on delivery</small></div>
              </label>
              <label className={'pay-opt ' + (payment === 'paytm' ? 'sel' : '')}>
                <input type="radio" name="pay" checked={payment === 'paytm'} onChange={() => setPayment('paytm')} />
                <div><b>Pay online (Paytm)</b><small>Pay full amount now — coming soon</small></div>
              </label>

              {err && <p className="checkout-err">{err}</p>}
              <button className="checkout-btn place" onClick={placeOrder} disabled={submitting}>
                {submitting ? 'Placing order...' : 'Place order'}
              </button>
            </div>

            <aside className="checkout-summary">
              <h3>Order summary</h3>
              {cart.map(c => (
                <div className="cs-line" key={c.key}>
                  <span>{c.name} × {c.qty}</span>
                  <span>{formatMoney(c.price * c.qty)}</span>
                </div>
              ))}
              <div className="cs-line"><span>Subtotal</span><span>{formatMoney(total)}</span></div>
              <div className="cs-line"><span>Shipping</span><span>{formatMoney(shipping)}</span></div>
              <div className="cs-line cs-total"><span>Total</span><span>{formatMoney(grandTotal)}</span></div>
              <div className="cs-pay-now">
                <span>Pay now</span><b>{formatMoney(payOnline)}</b>
              </div>
              {payment === 'cod' && <p className="cs-note">{formatMoney(dueOnDelivery)} due on delivery</p>}
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
