import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import { PHONE } from '../components/Header'

export default function About({ data }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  return (
    <>
      <Header categories={data.categories} activeCat={null} setActiveCat={() => navigate('/')} search={search} setSearch={setSearch} />
      <div className="page">
        <Link to="/" className="pdp-back">← Back to store</Link>
        <h1>About Minarva</h1>
        <p>Minarva is the online CCTV and security store from Minarva Technologies. We supply ready-to-install CCTV kits, cameras, and components, shipped across Kerala with cash on delivery and doorstep delivery.</p>
        <p>Our kits come with everything you need — cameras, recorder, storage, cables, and a setup guide — so you can secure your home or shop without the guesswork.</p>
        <p className="page-contact">Questions? Call {PHONE} or email sevenseassecuritysystems@gmail.com.</p>
      </div>
    </>
  )
}
