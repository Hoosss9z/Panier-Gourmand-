import React, { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, ALL_PRODUCTS } from '../data/products'
import { Filter, Search } from 'lucide-react'
import { motion } from 'framer-motion'
export default function Products({ onAddToCart }) {
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('')
  const tags = useMemo(() => Array.from(new Set(ALL_PRODUCTS.flatMap(p => p.tags))), [])

  const products = useMemo(() => {
    let list = ALL_PRODUCTS
    if (activeCat !== 'all') list = list.filter(p => p.category === activeCat)
    if (query.trim()) { const q = query.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(q)) }
    if (tag) list = list.filter(p => p.tags.includes(tag))
    return list
  }, [activeCat, query, tag])

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3"><Filter size={18} /><h1 className="text-2xl md:text-3xl font-bold">Tous nos produits</h1></div>
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={()=>setActiveCat('all')} className={`px-3 py-1.5 rounded-full text-sm border ${activeCat==='all'?'bg-emerald-600 text-white border-emerald-600':'bg-white/70 border-neutral-200 hover:bg-neutral-50'}`}>Tout</button>
            {CATEGORIES.map(c => (<button key={c.id} onClick={()=>setActiveCat(c.id)} className={`px-3 py-1.5 rounded-full text-sm border ${activeCat===c.id?'bg-emerald-600 text-white border-emerald-600':'bg-white/70 border-neutral-200 hover:bg-neutral-50'}`}>{c.label}</button>))}
          </div>
        </div>
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un produit…" className="w-full rounded-xl border pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        <div>
          <select value={tag} onChange={e=>setTag(e.target.value)} className="w-full rounded-xl border px-3 py-2.5 bg-white">
            <option value="">Tous les tags</option>
            {tags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (<ProductCard key={p.id} product={p} onAdd={onAddToCart} />))}
      </motion.div>
    </section>
  )
}
