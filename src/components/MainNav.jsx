export default function MainNav({ categories, view, setView, activeCat, setActiveCat, clearSearch }) {
  const packageCats = (categories || []).filter(c => c.type === 'package')
  const productCats = (categories || []).filter(c => c.type === 'product')

  function pick(fn) {
    clearSearch?.()
    fn()
  }

  return (
    <nav className="mainnav" aria-label="Product categories">
      <div className="nav-inner">
        <button
          type="button"
          className={view === 'all' && !activeCat ? 'nav-link active' : 'nav-link'}
          onClick={() => pick(() => { setView('all'); setActiveCat(null) })}
        >
          All Products
        </button>
        <button
          type="button"
          className={view === 'packages' && !activeCat ? 'nav-link active' : 'nav-link'}
          onClick={() => pick(() => { setView('packages'); setActiveCat(null) })}
        >
          CCTV Kits <span className="nav-badge">Sale</span>
        </button>
        <button
          type="button"
          className={view === 'products' && !activeCat ? 'nav-link active' : 'nav-link'}
          onClick={() => pick(() => { setView('products'); setActiveCat(null) })}
        >
          Components
        </button>
        {productCats.map(c => (
          <button
            key={c.id}
            type="button"
            className={String(activeCat) === String(c.id) ? 'nav-link active' : 'nav-link'}
            onClick={() => pick(() => { setView('all'); setActiveCat(String(c.id)) })}
          >
            {c.name}
          </button>
        ))}
        {packageCats.length > 0 && productCats.length === 0 && packageCats.map(c => (
          <button
            key={c.id}
            type="button"
            className={String(activeCat) === String(c.id) ? 'nav-link active' : 'nav-link'}
            onClick={() => pick(() => { setView('packages'); setActiveCat(String(c.id)) })}
          >
            {c.name}
          </button>
        ))}
      </div>
    </nav>
  )
}
