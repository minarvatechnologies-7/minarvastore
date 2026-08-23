import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import SkeletonCard from './SkeletonCard'

const PAGE_SIZE = 12

export default function ProductGrid({ items, loading, error, onRetry, view, setView, setActiveCat, clearSearch }) {
  const [limit, setLimit] = useState(PAGE_SIZE)

  useEffect(() => { setLimit(PAGE_SIZE) }, [items])

  const heading =
    view === 'packages' ? 'CCTV Kits' :
    view === 'products' ? 'Components' :
    'Featured Products'
  const visible = items.slice(0, limit)

  function tab(v) {
    clearSearch?.()
    setView(v)
    setActiveCat(null)
  }

  return (
    <main className="catalogue">
      <div className="cat-head">
        <h2>{heading}</h2>
        <div className="cat-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={view === 'all'} className={view === 'all' ? 'active' : ''} onClick={() => tab('all')}>All</button>
          <button type="button" role="tab" aria-selected={view === 'packages'} className={view === 'packages' ? 'active' : ''} onClick={() => tab('packages')}>Kits</button>
          <button type="button" role="tab" aria-selected={view === 'products'} className={view === 'products' ? 'active' : ''} onClick={() => tab('products')}>Components</button>
        </div>
      </div>

      {loading && (
        <div className="pgrid" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && !loading && (
        <div className="state error">
          <p>{error}</p>
          <button type="button" className="retry" onClick={onRetry}>Try again</button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="pgrid-empty">
          <h3>No products in this view yet</h3>
          <p>Try another category, or check back soon — new kits are added regularly.</p>
          <button type="button" onClick={() => tab('all')}>Show all products</button>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <p className="cat-count">{items.length} item{items.length === 1 ? '' : 's'}</p>
          <div className="pgrid">
            {visible.map(item => (
              <ProductCard key={item._type + ':' + item.id} item={item} />
            ))}
          </div>
          {limit < items.length && (
            <div className="loadmore-wrap">
              <button type="button" className="loadmore" onClick={() => setLimit(l => l + PAGE_SIZE)}>
                Load more ({items.length - limit} left)
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
