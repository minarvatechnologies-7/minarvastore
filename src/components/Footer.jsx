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
          <Link to="/faq">FAQs</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/faq">Shipping & Returns</Link>
          <Link to="/faq">Warranty</Link>
        </div>
        <div className="foot-col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Order Tracking</Link>
          <Link to="/about">Privacy Policy</Link>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 Minarva Technologies · minarvastore.vercel.app</span>
        <span className="pay">VISA · Mastercard · UPI · Paytm · COD</span>
      </div>
    </footer>
  )
}
