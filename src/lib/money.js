// Currency helpers — store targets India (INR).
export const CURRENCY = { code: 'INR', symbol: '₹', locale: 'en-IN' }

export function formatMoney(n) {
  const num = Number(n) || 0
  return CURRENCY.symbol + num.toLocaleString(CURRENCY.locale)
}

// Safe numeric coercion (fixes BUG #10 — string mrp/price comparisons)
export function toNum(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export function discountPct(price, mrp) {
  const p = toNum(price), m = toNum(mrp)
  if (m > p && m > 0) return Math.round((1 - p / m) * 100)
  return null
}
