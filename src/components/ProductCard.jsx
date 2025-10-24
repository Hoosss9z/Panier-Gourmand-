import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
function Badge({ children }) { return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-neutral-700 bg-white/60 backdrop-blur border-neutral-200">{children}</span> }
export default function ProductCard({ product, onAdd }) {
  const { add } = useCart()
  const handle = () => { add(product); onAdd && onAdd() }
  return (
    <motion.div layout className="group rounded-2xl border overflow-hidden bg-white shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={product.img} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 left-3 flex gap-2">{product.tags.map(t => <Badge key={t}>{t}</Badge>)}</div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-neutral-900 leading-tight">{product.name}</h3>
          <div className="flex items-center gap-1 text-sm" title={`${product.rating} / 5`}><Star size={16} /><span>{product.rating}</span></div>
        </div>
        <div className="text-emerald-700 font-semibold">{product.price.toFixed(2)} {product.unit}</div>
        <button onClick={handle} className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700 transition"><ShoppingCart size={18} /> Ajouter au panier</button>
      </div>
    </motion.div>
  )
}
