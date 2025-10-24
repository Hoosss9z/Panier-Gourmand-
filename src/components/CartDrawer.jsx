import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ open, onClose }) {
  const { items, total, changeQty, remove } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!items.length) return;       // sécurité
    onClose?.();                     // ferme le tiroir si fourni
    navigate("/checkout");           // redirection vers la page de paiement
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 250 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Panier"
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg">Votre panier</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-50"
              aria-label="Fermer"
            >
              <X />
            </button>
          </div>

          {/* Liste d'articles */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {items.length === 0 ? (
              <p className="text-neutral-500">Votre panier est vide.</p>
            ) : (
              items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 items-start">
                  <img
                    src={product.img}
                    alt=""
                    className="w-20 h-20 object-cover rounded-xl border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate">{product.name}</p>
                      <button
                        onClick={() => remove(product.id)}
                        className="p-1 rounded-md hover:bg-neutral-50"
                        aria-label="Retirer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-neutral-500">
                      {product.price.toFixed(2)} {product.unit}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            changeQty(product.id, Math.max(1, qty - 1))
                          }
                          className="p-1 rounded-lg border hover:bg-neutral-50"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center">{qty}</span>
                        <button
                          onClick={() => changeQty(product.id, qty + 1)}
                          className="p-1 rounded-lg border hover:bg-neutral-50"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="font-semibold">
                        {(product.price * qty).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <span className="text-neutral-600">Total</span>
              <span className="font-semibold text-lg">{total.toFixed(2)} €</span>
            </div>

            <button
              type="button"                         // évite un submit si jamais
              onClick={handleCheckout}
              disabled={!items.length}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-white font-medium
                ${items.length
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-emerald-600/60 cursor-not-allowed"}`}
            >
              <CheckCircle2 />
              Passer la commande
            </button>

            <p className="mt-2 text-xs text-neutral-500">
              Paiements sécurisés. Livraison 24–48h en PACA.
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
