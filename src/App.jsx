import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from "./pages/Contact";
import { CartProvider } from './context/CartContext'

import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Orders from "./pages/Orders";
import PayPalCheckout from "./pages/PayPalCheckout";
import CardCheckout from "./pages/CardCheckout";





export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar onOpenCart={()=>setCartOpen(true)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produits" element={<Products onAddToCart={()=>setCartOpen(true)} />} />
          <Route path="/contact" element={<Contact />} />   {/* ← ajout */}

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<PaymentSuccess />} />
          <Route path="/checkout/cancel" element={<PaymentCancel />} />

          <Route path="/commande" element={<Orders />} />
          <Route path="/commande/:orderId" element={<Orders />} />
          <Route path="/checkout/paypal" element={<PayPalCheckout />} />
          <Route path="/checkout/card" element={<CardCheckout />} />
        </Routes>
          <footer className="border-t bg-white/60 backdrop-blur-sm py-6">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-600">
              {/* Copyright */}
              <p>
                © {new Date().getFullYear()} <span className="font-semibold text-neutral-800">Panier Gourmand</span> — Tous droits réservés.
              </p>
            
              {/* Liens */}
              <div className="flex items-center gap-6">
                <a
                  href="/contact"
                  className="px-4 py-1.5 rounded-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition"
                >
                  Contact
                </a>
                <a
                  href="/mentions-legales"
                  className="text-neutral-600 hover:text-emerald-700 transition"
                >
                  Mentions légales
                </a>
              </div>
            </div>
          </footer>

        <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} />
      </CartProvider>
    </BrowserRouter>
  )
}
