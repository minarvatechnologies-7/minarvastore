import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header, { PHONE } from '../components/Header'

const FAQS = [
  {
    q: 'Do you deliver across Kerala?',
    a: 'Yes. We ship CCTV kits and components across Kerala. Free delivery on CCTV kits; other items may include a small shipping charge shown at checkout.',
  },
  {
    q: 'Is Cash on Delivery (COD) available?',
    a: 'Yes. For COD orders you pay the shipping charge online in advance; the product amount is collected when the order is delivered.',
  },
  {
    q: 'Do kits include installation?',
    a: 'Kits are ready to install and include a free installation guide. Professional installation can be arranged in major cities — contact us after ordering.',
  },
  {
    q: 'What is the warranty?',
    a: 'Most products carry a 1-year manufacturer warranty against defects. Keep your invoice for warranty claims.',
  },
  {
    q: 'Can I return a product?',
    a: 'Unused items in original packaging can be replaced within 7 days if there is a manufacturing defect or shipping damage. Contact us within 48 hours of delivery for damage claims.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Typically 2–5 working days depending on your district. You will receive tracking details on WhatsApp or SMS after dispatch.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'COD (with advance shipping) and online payment via Paytm / UPI (rolling out). Contact us if you prefer bank transfer for bulk orders.',
  },
  {
    q: 'Can I buy only cameras or only a DVR?',
    a: 'Yes. Shop under Components for individual cameras, DVR/NVR units, hard disks, cables, and accessories — or choose complete kits for best value.',
  },
]

export default function FAQ({ data }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(0)

  return (
    <>
      <Header
        categories={data.categories}
        activeCat={null}
        setActiveCat={() => navigate('/')}
        search={search}
        setSearch={setSearch}
      />
      <div className="page faq-page">
        <Link to="/" className="pdp-back">← Back to store</Link>
        <h1>Frequently asked questions</h1>
        <p className="page-contact">Still need help? Call {PHONE} or message us on WhatsApp.</p>
        <div className="faq-list">
          {FAQS.map((item, i) => (
            <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button
                className="faq-q"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <span className="faq-icon">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <div className="faq-a">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
