export default function MainNav({ categories, view, setView, activeCat, setActiveCat, clearSearch }) {
  const navCats = categories.filter(c => c.type === 'product')

  function pick(fn) {
    clearSearch?.()
    fn()
  }

  return (
    <nav className="mainnav">
      <div className="nav-inner">
        <button className={view === 'all' ? 'nav-link active' : 'nav-link'}
          onClick={() => pick(() => { setView('all'); setActiveCat(null) })}>All Products</button>
        <button className={view === 'packages' ? 'nav-link active' : 'nav-link'}
          onClick={() => pick(() => { setView('packages'); setActiveCat(null) })}>
          CCTV Kits <span className="nav-badge">Sale</span>
        </button>
        <button className={view === 'products' ? 'nav-link active' : 'nav-link'}
          onClick={() => pick(() => { setView('products'); setActiveCat(null) })}>Components</button>
        {navCats.slice(0, 4).map(c => (
          <button key={c.id}
            className={String(activeCat) === String(c.id) ? 'nav-link active' : 'nav-link'}
            onClick={() => pick(() => { setView('all'); setActiveCat(String(c.id)) })}>{c.name}</button>
        ))}
      </div>
    </nav>
  )
}
