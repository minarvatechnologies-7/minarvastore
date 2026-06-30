import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../lib/money'

export const PHONE = '+91 70000 00000' // TODO: replace with India contact number

export default function Header({ categories, activeCat, setActiveCat, search, setSearch }) {
  const { count, total, setDrawerOpen } = useCart()
  const navigate = useNavigate()

  function onSearch() {
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">MINARVA<span>.</span></Link>

        <div className="searchbox">
          <select
            className="search-cat"
            value={activeCat ?? ''}
            onChange={e => setActiveCat(e.target.value || null)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
          <input
            className="search-input"
            placeholder="Search products here..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
            aria-label="Search products"
          />
          <button className="search-btn" onClick={onSearch}>Search</button>
        </div>

        <div className="header-help">
          <div className="help-icon" aria-hidden="true">☎</div>
          <div className="help-text"><span>Need Help?</span><b>{PHONE}</b></div>
        </div>

        <button className="header-cart" onClick={() => setDrawerOpen(true)} aria-label={`Cart, ${count} items`}>
          <span className="hc-icon">🛒<span className="hc-count">{count}</span></span>
          <span className="hc-text"><span>Cart</span><b>{formatMoney(total)}</b></span>
        </button>
      </div>
    </header>
  )
}
