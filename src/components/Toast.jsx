import { useEffect } from 'react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 2200)
    return () => clearTimeout(t)
  }, [toast, onClose])

  if (!toast) return null
  return (
    <div className={'toast toast-' + toast.type} role="status" aria-live="polite">
      <span className="toast-ic">{toast.type === 'error' ? '!' : '✓'}</span>
      {toast.message}
    </div>
  )
}
