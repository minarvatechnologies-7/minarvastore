import { useState } from 'react'
import { supabase } from '../supabaseClient'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // 'ok' | 'err' | 'loading'
  const [msg, setMsg] = useState('')

  async function submit() {
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('err'); setMsg('Enter a valid email address.')
      return
    }
    setStatus('loading'); setMsg('')
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email: email.trim().toLowerCase() })
      if (error) {
        // 23505 = unique violation (already subscribed)
        if (error.code === '23505') { setStatus('ok'); setMsg('You are already subscribed.') }
        else throw error
      } else {
        setStatus('ok'); setMsg('Subscribed. Watch your inbox for deals.')
        setEmail('')
      }
    } catch {
      setStatus('err'); setMsg('Could not subscribe right now. Try again later.')
    }
  }

  return (
    <section className="newsletter">
      <div className="nl-inner">
        <div className="nl-text">
          <span className="nl-ic" aria-hidden="true">✉</span>
          <div><b>Get the best CCTV deals</b><small>Sign up for offers and new arrivals.</small></div>
        </div>
        <div className="nl-form-wrap">
          <div className="nl-form">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              aria-label="Email address"
            />
            <button onClick={submit} disabled={status === 'loading'}>
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </div>
          {msg && <p className={'nl-msg ' + (status === 'err' ? 'nl-err' : 'nl-ok')}>{msg}</p>}
        </div>
      </div>
    </section>
  )
}
