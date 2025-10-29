import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Menu, X, Package } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import paniergImg from "../assets/panierg.jpg";

export default function Navbar({ onOpenCart }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const desktopLink = ({ isActive }) =>
    `px-4 py-2 rounded-full transition-all border ${
      isActive
        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
        : "bg-white text-neutral-800 border-neutral-200 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700"
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center">
          <div className="relative">
            <img
              src={paniergImg}
              alt="Panier Gourmand"
              className="h-12 w-12 md:h-16 md:w-16 object-cover rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
            />
            <div className="pointer-events-none absolute inset-0 rounded-full bg-black/15 blur-lg"></div>
          </div>
          <span className="hidden sm:block ml-3 font-semibold text-neutral-900">
            Panier Gourmand
          </span>
        </Link>

        {/* Liens desktop */}
        <nav className="hidden md:flex items-center gap-10 text-base font-medium">
          <NavLink to="/" className={desktopLink}>
            Accueil
          </NavLink>
          <NavLink to="/produits" className={desktopLink}>
            Produits
          </NavLink>
          <NavLink to="/contact" className={desktopLink}>
            Contact
          </NavLink>
          <NavLink to="/checkout" className={desktopLink}>
            Commander
          </NavLink>
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-2">
          {/* Raccourci “Commande” en desktop (même style que Panier) */}
          <Link
            to="/commande"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border px-3 py-2 bg-white hover:bg-neutral-50"
            aria-label="Voir mes commandes"
          >
            <Package size={18} />
            <span className="hidden sm:inline">Commande</span>
          </Link>

          {/* Panier */}
          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 rounded-xl border px-3 py-2 bg-white hover:bg-neutral-50"
            aria-label="Ouvrir le panier"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Panier</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center text-xs bg-emerald-600 text-white rounded-full h-5 min-w-[20px] px-1">
                {count}
              </span>
            )}
          </button>

          {/* Burger (mobile uniquement) */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border bg-white hover:bg-neutral-50"
            aria-label="Ouvrir le menu"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Menu Mobile avec fond transparent + slide animé */}
      <AnimatePresence>
        {open && (
          <>
            {/* fond sombre flouté */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            {/* tiroir latéral */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-72 max-w-[80%]
                         bg-white/30 backdrop-blur-xl border-l border-white/40
                         shadow-[0_0_20px_rgba(0,0,0,0.2)]
                         p-4 flex flex-col gap-3 z-50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-800">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fermer le menu"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/40 bg-white/50 hover:bg-white/70"
                >
                  <X />
                </button>
              </div>

              <NavLink
                to="/"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/40 hover:bg-white/60 text-neutral-900"
              >
                Accueil
              </NavLink>
              <NavLink
                to="/produits"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/40 hover:bg-white/60 text-neutral-900"
              >
                Produits
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/40 hover:bg-white/60 text-neutral-900"
              >
                Contact
              </NavLink>
              {/* Ajout Commande dans le tiroir mobile */}
              <NavLink
                to="/commande"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/40 hover:bg-white/60 text-neutral-900"
              >
                Commande
              </NavLink>
              <NavLink
                to="/checkout"
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 rounded-xl border border-white/40 bg-white/40 hover:bg-white/60 text-neutral-900"
              >
                Commander
              </NavLink>

              <hr className="my-3 border-white/50" />

              <button
                onClick={() => {
                  setOpen(false);
                  onOpenCart?.();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-3 hover:bg-emerald-700"
              >
                <ShoppingCart size={18} /> Ouvrir le panier
              </button>

              <p className="mt-auto text-xs text-white/80">
                © {new Date().getFullYear()} Panier Gourmand
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
