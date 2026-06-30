import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import SkeletonCard from './SkeletonCard'

const PAGE_SIZE = 12

export default function ProductGrid({ items, loading, error, onRetry, view, setView, setActiveCat, clearSearch }) {
  const [limit, setLimit] = useState(PAGE_SIZE)

  // Reset visible count when the underlying list changes
  useEffect(() => { setLimit(PAGE_SIZE) }, [items])

  const heading = view === 'packages' ? 'CCTV Kits' : view === 'products' ? 'Components' : 'Featured Products'
  const visible = items.slice(0, limit)

  function tab(v) { clearSearch?.(); setView(v); setActiveCat(null) }

  return (
    <main className="catalogue">
      <div className="cat-head">
        <h2>{heading}</h2>
        <div className="cat-tabs">
          <button className={view === 'all' ? 'active' : ''} onClick={() => tab('all')}>All</button>
          <button className={view === 'packages' ? 'active' : ''} onClick={() => tab('packages')}>Kits</button>
          <button className={view === 'products' ? 'active' : ''} onClick={() => tab('products')}>Components</button>
        </div>
      </div>

      {loading && (
        <div className="pgrid">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && !loading && (
        <div className="state error">{error}<button className="retry" onClick={onRetry}>Try again</button></div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="state">No products found.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="pgrid">
            {visible.map(item => <ProductCard key={item._type + item.id} item={item} />)}
          </div>
          {limit < items.length && (
            <div className="loadmore-wrap">
              <button className="loadmore" onClick={() => setLimit(l => l + PAGE_SIZE)}>Load more</button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
