import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header, { PHONE } from '../components/Header'
import { supabase } from '../supabaseClient'

export default function Contact({ data }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState(null)
  const [msg, setMsg] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function submit() {
    if (!form.name.trim() || !/^[0-9]{10}$/.test(form.phone.trim())) {
      setStatus('err'); setMsg('Enter your name and a valid 10-digit phone.')
      return
    }
    setStatus('loading'); setMsg('')
    try {
      const { error } = await supabase.from('enquiries').insert({
        name: form.name.trim(), phone: form.phone.trim(), message: form.message.trim() || null,
      })
      if (error) throw error
      setStatus('ok'); setMsg('Thanks — we will call you back soon.')
      setForm({ name: '', phone: '', message: '' })
    } catch {
      setStatus('err'); setMsg('Could not send right now. Please call us instead.')
    }
  }

  return (
    <>
      <Header categories={data.categories} activeCat={null} setActiveCat={() => navigate('/')} search={search} setSearch={setSearch} />
      <div className="page">
        <Link to="/" className="pdp-back">← Back to store</Link>
        <h1>Contact us</h1>
        <p className="page-contact">Call {PHONE} or email sevenseassecuritysystems@gmail.com. Or leave a message:</p>
        <div className="contact-form">
          <div className="field"><label>Name</label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
          <div className="field"><label>Phone (10-digit)</label><input value={form.phone} onChange={e => set('phone', e.target.value)} inputMode="numeric" /></div>
          <div className="field"><label>Message</label><textarea rows={4} value={form.message} onChange={e => set('message', e.target.value)} /></div>
          {msg && <p className={status === 'err' ? 'nl-msg nl-err' : 'nl-msg nl-ok'}>{msg}</p>}
          <button className="checkout-btn" onClick={submit} disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending...' : 'Send message'}
          </button>
        </div>
      </div>
    </>
  )
}
