import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { useCart } from '../context/CartContext'
import { formatMoney, toNum, discountPct } from '../lib/money'
import ProductCard from '../components/ProductCard'

export default function ProductDetail({ data, kind }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { categories, packages, products } = data
  const [imgIdx, setImgIdx] = useState(0)
  const [search, setSearch] = useState('')

  const isPackage = kind === 'package'
  const source = isPackage ? packages : products
  const raw = source.find(p => String(p.id) === String(id))

  if (!raw) {
    return (
      <>
        <Header categories={categories} activeCat={null} setActiveCat={() => {}} search={search} setSearch={setSearch} />
        <div className="state">Product not found. <Link to="/">Back to store</Link></div>
      </>
    )
  }

  const item = { ...raw, _type: kind }
  const images = item.images?.length ? item.images : []
  const discount = discountPct(item.price, item.mrp)
  const out = item.stock_status === 'out_of_stock' || (item.stock != null && toNum(item.stock) <= 0)

  const related = source
    .filter(p => String(p.id) !== String(id) && p.category_id === item.category_id)
    .slice(0, 4)
    .map(p => ({ ...p, _type: kind }))

  return (
    <>
      <Header categories={categories} activeCat={null} setActiveCat={() => navigate('/')} search={search} setSearch={setSearch} />
      <div className="pdp">
        <Link to="/" className="pdp-back">← Back to store</Link>
        <div className="pdp-main">
          <div className="pdp-gallery">
            <div className="pdp-hero-img">
              {images.length ? <img src={images[imgIdx]} alt={item.name} /> : <div className="pc-ph">{isPackage ? '📦' : '📷'}</div>}
            </div>
            {images.length > 1 && (
              <div className="pdp-thumbs">
                {images.map((src, i) => (
                  <button key={i} className={i === imgIdx ? 'active' : ''} onClick={() => setImgIdx(i)}>
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="pdp-info">
            <h1>{item.name}</h1>
            <div className="pc-rating">★★★★★ <span>(5 reviews)</span></div>
            <div className="pdp-price">
              <b>{formatMoney(item.price)}</b>
              {discount && <><s>{formatMoney(item.mrp)}</s><span className="pdp-off">-{discount}%</span></>}
            </div>
            {item.description && <p className="pdp-desc">{item.description}</p>}

            {isPackage && (
              <ul className="pdp-specs">
                {item.camera_count != null && <li><span>Cameras</span><b>{item.camera_count}</b></li>}
                {item.dvr_type && <li><span>Recorder</span><b>{item.dvr_type}</b></li>}
                {item.storage && <li><span>Storage</span><b>{item.storage}</b></li>}
                {item.cable_length && <li><span>Cable</span><b>{item.cable_length}</b></li>}
              </ul>
            )}
            {!isPackage && item.specs && typeof item.specs === 'object' && (
              <ul className="pdp-specs">
                {Object.entries(item.specs).map(([k, v]) => (
                  <li key={k}><span>{k}</span><b>{String(v)}</b></li>
                ))}
              </ul>
            )}

            <button className="pdp-add" disabled={out} onClick={() => addToCart(item, { openDrawer: true })}>
              {out ? 'Out of stock' : 'Add To Cart'}
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <section className="pdp-related">
            <h2>Related products</h2>
            <div className="pgrid">{related.map(r => <ProductCard key={r.id} item={r} />)}</div>
          </section>
        )}
      </div>
    </>
  )
}
