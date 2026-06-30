import { useNavigate } from 'react-router-dom'
import { formatMoney } from '../lib/money'
import heroImg from '../assets/hero.png'

export default function Hero({ onShopKits }) {
  const navigate = useNavigate()

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-text">
          <span className="hero-badge">Featured Deals</span>
          <h1 className="hero-title">Complete CCTV Kits<br/>for your home &amp; shop</h1>
          <p className="hero-sub">Ready to install. Shipped across Kerala. Free installation guide.</p>
          <p className="hero-price">From {formatMoney(8999)} <s>{formatMoney(12999)}</s></p>
          <button className="hero-btn" onClick={() => { onShopKits?.(); navigate('/') }}>Shop Now</button>
          <ul className="hero-trust">
            <li>★★★★★ 4.8 / 5</li>
            <li>1000+ Kerala homes protected</li>
            <li>1 year warranty</li>
          </ul>
        </div>
        <div className="hero-art">
          <img src={heroImg} alt="CCTV camera kit" />
        </div>
      </div>
    </section>
  )
}
