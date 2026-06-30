import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export function useCatalogue() {
  const [categories, setCategories] = useState([])
  const [packages, setPackages] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey(k => k + 1), [])

  useEffect(() => {
    let active = true // BUG #6: guard against setState after unmount
    setLoading(true); setError(null)

    ;(async () => {
      try {
        const [catRes, pkgRes, prodRes] = await Promise.all([
          supabase.from('categories').select('*').eq('is_active', true).order('sort_order'), // BUG #8
          supabase.from('packages').select('*').eq('is_active', true).order('created_at', { ascending: false }),
          supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        ])
        if (catRes.error) throw catRes.error
        if (pkgRes.error) throw pkgRes.error
        if (prodRes.error) throw prodRes.error
        if (!active) return
        setCategories(catRes.data || [])
        setPackages(pkgRes.data || [])
        setProducts(prodRes.data || [])
      } catch (e) {
        if (active) setError(e.message || 'Could not load the catalogue.')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => { active = false }
  }, [reloadKey])

  return { categories, packages, products, loading, error, reload }
}
