import { useState, useMemo } from 'react'
import Header from '../components/Header'
import MainNav from '../components/MainNav'
import Hero from '../components/Hero'
import FeatureStrip from '../components/FeatureStrip'
import ProductGrid from '../components/ProductGrid'

export default function Home({ data }) {
  const { categories, packages, products, loading, error, reload } = data
  const [view, setView] = useState('all')
  const [activeCat, setActiveCat] = useState(null) // string id or null
  const [search, setSearch] = useState('')

  const clearSearch = () => setSearch('')

  const items = useMemo(() => {
    let list = []
    if (view === 'all' || view === 'packages') list = list.concat(packages.map(p => ({ ...p, _type: 'package' })))
    if (view === 'all' || view === 'products') list = list.concat(products.map(p => ({ ...p, _type: 'product' })))
    // type-consistent comparison (BUG #2 made safe)
    if (activeCat) list = list.filter(i => String(i.category_id) === String(activeCat))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(i => i.name.toLowerCase().includes(q))
    }
    return list
  }, [view, activeCat, search, packages, products])

  function shopKits() { clearSearch(); setView('packages'); setActiveCat(null) }

  return (
    <>
      <Header
        categories={categories}
        activeCat={activeCat}
        setActiveCat={(v) => { clearSearch(); setActiveCat(v) }}
        search={search}
        setSearch={setSearch}
      />
      <MainNav
        categories={categories}
        view={view} setView={setView}
        activeCat={activeCat} setActiveCat={setActiveCat}
        clearSearch={clearSearch}
      />
      <Hero onShopKits={shopKits} />
      <FeatureStrip />
      <ProductGrid
        items={items}
        loading={loading}
        error={error}
        onRetry={reload}
        view={view} setView={setView}
        setActiveCat={setActiveCat}
        clearSearch={clearSearch}
      />
    </>
  )
}
