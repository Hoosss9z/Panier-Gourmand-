import React, { createContext, useContext, useMemo, useState } from 'react'
const CartCtx = createContext(null)
export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const add = (product) => setItems(prev => {
    const f = prev.find(it => it.product.id === product.id)
    return f ? prev.map(it => it.product.id === product.id ? { ...it, qty: it.qty + 1 } : it) : [...prev, { product, qty: 1 }]
  })
  const changeQty = (id, qty) => setItems(prev => prev.map(it => it.product.id === id ? { ...it, qty } : it))
  const remove = (id) => setItems(prev => prev.filter(it => it.product.id !== id))
  const total = useMemo(() => items.reduce((a, it) => a + it.product.price * it.qty, 0), [items])
  const count = useMemo(() => items.reduce((a, it) => a + it.qty, 0), [items])
  const clear = () => setItems([])
  return <CartCtx.Provider value={{ items, add, changeQty, remove, clear, total, count }}>{children}</CartCtx.Provider>
}
export const useCart = () => useContext(CartCtx)
