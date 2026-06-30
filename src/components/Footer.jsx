import { Link } from 'react-router-dom'
import { PHONE } from './Header'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="foot-inner">
        <div className="foot-col foot-about">
          <div className="logo">MINARVA<span>.</span></div>
          <p>CCTV &amp; Security Store by Minarva Technologies. CCTV kits, cameras, and components shipped across Kerala.</p>
          <p className="foot-contact">☎ {PHONE}<br/>✉ sevenseassecuritysystems@gmail.com</p>
        </div>
        <div className="foot-col">
          <h4>Shop</h4>
          <Link to="/">CCTV Kits</Link>
          <Link to="/">Cameras</Link>
          <Link to="/">DVR / NVR</Link>
          <Link to="/">Accessories</Link>
        </div>
        <div className="foot-col">
          <h4>Help</h4>
          <Link to="/contact">Contact Us</Link>
          <Link to="/contact">Shipping</Link>
          <Link to="/contact">Returns</Link>
          <Link to="/contact">Warranty</Link>
        </div>
        <div className="foot-col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Order Tracking</Link>
          <Link to="/about">Privacy Policy</Link>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 Minarva Technologies · minarva.store</span>
        <span className="pay">VISA · Mastercard · UPI · Paytm</span>
      </div>
    </footer>
  )
}
