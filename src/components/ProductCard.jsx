import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatMoney, toNum, discountPct } from '../lib/money'

export default function ProductCard({ item }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const img = item.images?.[0]
  const isPackage = item._type === 'package'
  const discount = discountPct(item.price, item.mrp)
  const out = item.stock_status === 'out_of_stock' || (item.stock != null && toNum(item.stock) <= 0)
  const href = `/${isPackage ? 'kits' : 'products'}/${item.id}`

  function go() { navigate(href) }
  function onAdd(e) {
    e.stopPropagation()
    addToCart(item)
  }

  return (
    <article className="pcard" onClick={go} role="link" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && go()}>
      <div className="pcard-media">
        {discount && <span className="pc-badge">-{discount}%</span>}
        {item.featured && <span className="pc-new">New</span>}
        {img ? <img src={img} alt={item.name} loading="lazy" /> : <div className="pc-ph">{isPackage ? '📦' : '📷'}</div>}
      </div>
      <div className="pcard-body">
        <div className="pc-rating" aria-label="Rated 5 out of 5">★★★★★ <span>(5)</span></div>
        <h3 className="pc-title">{item.name}</h3>
        {isPackage && (
          <p className="pc-specs">
            {[item.camera_count != null ? item.camera_count + ' cameras' : null, item.dvr_type, item.storage].filter(Boolean).join(' · ')}
          </p>
        )}
        {!isPackage && item.brand && <p className="pc-specs">{item.brand}</p>}
        <div className="pc-price">
          {discount && <s>{formatMoney(item.mrp)}</s>}
          <b>{formatMoney(item.price)}</b>
        </div>
        <button className="pc-add" disabled={out} onClick={onAdd}>{out ? 'Out of stock' : 'Add To Cart'}</button>
      </div>
    </article>
  )
}
