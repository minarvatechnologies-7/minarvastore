const WA_NUMBER = '917000000000' // TODO: replace with India WhatsApp business number

export default function WhatsAppButton() {
  const msg = encodeURIComponent('Hi Minarva, I have a question about your CCTV products.')
  return (
    <a
      className="wa-fab"
      href={`https://wa.me/${WA_NUMBER}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <span>WhatsApp</span>
    </a>
  )
}
