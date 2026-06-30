import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabaseReady } from './supabaseClient'
import { CartProvider } from './context/CartContext'
import { useCatalogue } from './lib/useCatalogue'
import SetupScreen from './components/SetupScreen'
import PromoBar from './components/PromoBar'
import CartDrawer from './components/CartDrawer'
import Newsletter from './components/Newsletter'
import TrustStrip from './components/TrustStrip'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Toast from './components/Toast'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Contact from './pages/Contact'
import './App.css'

export default function App() {
  // If Supabase isn't configured, show a friendly setup screen (BUG #13)
  if (!supabaseReady) return <SetupScreen />

  return <Shell />
}

function Shell() {
  const data = useCatalogue()
  const [toast, setToast] = useState(null)
  const showToast = useCallback((message, type = 'success') => setToast({ message, type, t: Date.now() }), [])

  return (
    <CartProvider onToast={showToast}>
      <div className="app">
        <PromoBar />
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/kits/:id" element={<ProductDetail data={data} kind="package" />} />
          <Route path="/products/:id" element={<ProductDetail data={data} kind="product" />} />
          <Route path="/checkout" element={<Checkout data={data} />} />
          <Route path="/about" element={<About data={data} />} />
          <Route path="/contact" element={<Contact data={data} />} />
          <Route path="*" element={<Home data={data} />} />
        </Routes>
        <Newsletter />
        <TrustStrip />
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </CartProvider>
  )
}
