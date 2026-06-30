import { Link } from 'react-router-dom'

export default function PromoBar() {
  return (
    <div className="promobar">
      <div className="promo-left">
        <Link to="/contact">Contact</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">FAQs</Link>
      </div>
      <div className="promo-mid">Free delivery across Kerala on CCTV kits · COD available</div>
      <div className="promo-right">India · ₹ INR</div>
    </div>
  )
}
