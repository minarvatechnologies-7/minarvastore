import { PHONE } from './Header'

export default function FeatureStrip() {
  return (
    <div className="featstrip">
      <div className="feat"><span className="feat-ic" aria-hidden="true">🚚</span><div><b>Free Delivery</b><small>On all CCTV kits in Kerala</small></div></div>
      <div className="feat"><span className="feat-ic" aria-hidden="true">🔁</span><div><b>Easy Returns</b><small>7-day replacement</small></div></div>
      <div className="feat"><span className="feat-ic" aria-hidden="true">🎧</span><div><b>Support</b><small>{PHONE}</small></div></div>
      <div className="feat"><span className="feat-ic" aria-hidden="true">🛡️</span><div><b>Warranty</b><small>1 year on all products</small></div></div>
    </div>
  )
}
