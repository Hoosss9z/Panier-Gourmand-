// src/pages/Checkout.jsx
import React, { useMemo } from "react";
import { useCart } from "../context/CartContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ShieldCheck, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatPrice = (x) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(x);

/* -------- Helpers "commande" (localStorage) -------- */
const ORDERS_KEY = "pg_orders";
function addOrderLocal(order) {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  } catch {}
}
function makeOrderFromCart(cartItems, total) {
  // cartItems peut être [{product, qty}] ou [{id,name,price,qty}]
  const items = cartItems.map((it) => {
    const p = it.product ?? it;
    const qty = it.qty ?? it.quantity ?? 1;
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      qty,
    };
  });
  return { items, total };
}

export default function Checkout() {
  // si clear() n’existe pas dans ton contexte, il vaut undefined (pas bloquant)
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const shipping = 0;
  const grandTotal = useMemo(() => total + shipping, [total, shipping]);

  // liste “plate” pour l’affichage résumé (tolérant aux 2 formats)
  const flatItems = useMemo(
    () =>
      items.map((it) => {
        const p = it.product ?? it;
        const qty = it.qty ?? it.quantity ?? 1;
        return { id: p.id, name: p.name, price: p.price, qty };
      }),
    [items]
  );

  if (!items.length) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
        <button
          onClick={() => navigate("/produits")}
          className="rounded-xl border px-4 py-2 hover:bg-neutral-50"
        >
          Voir les produits
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 grid lg:grid-cols-3 gap-8">
      <section className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Paiement</h1>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={18} />
            <p>Payer avec PayPal</p>
          </div>

          <PayPalScriptProvider
            options={{
              "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
              currency: "EUR",
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(_, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: grandTotal.toFixed(2),
                        currency_code: "EUR",
                      },
                      // (facultatif) description : "Panier Gourmand",
                    },
                  ],
                });
              }}
              onApprove={(_, actions) =>
                actions.order.capture().then(() => {
                  // 1) Créer une “commande” locale
                  const { items: orderItems, total: orderTotal } = makeOrderFromCart(items, grandTotal);
                  const order = {
                    id: crypto.randomUUID(),
                    createdAt: Date.now(),
                    status: "reçu",
                    items: orderItems,
                    total: orderTotal,
                    eta: Date.now() + 1000 * 60 * 60 * 24, // estimation J+1
                  };
                  addOrderLocal(order);

                  // 2) Vider le panier si clear() dispo
                  try { clear?.(); } catch {}

                  // 3) Rediriger vers le suivi ou la page succès
                  try {
                    // si tu as une page de suivi
                    return navigate(`/commande/${order.id}`);
                  } catch {
                    return navigate("/checkout/success");
                  }
                })
              }
              onCancel={() => navigate("/checkout/cancel")}
              onError={() => alert("Le paiement PayPal a échoué.")}
            />
          </PayPalScriptProvider>

          <p className="flex items-center gap-2 text-xs text-neutral-500 mt-2">
            <ShieldCheck size={14} /> Paiement sécurisé par PayPal.
          </p>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Résumé</h2>
          <ul className="space-y-3">
            {flatItems.map((it) => (
              <li key={`${it.id}-${it.name}`} className="flex justify-between text-sm">
                <span className="truncate">
                  {it.name} × {it.qty}
                </span>
                <span>{formatPrice(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <hr className="my-4" />
          <div className="flex justify-between text-sm">
            <span>Sous-total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Livraison</span>
            <span>{shipping ? formatPrice(shipping) : "Offerte"}</span>
          </div>
          <div className="flex justify-between mt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            <ShieldCheck className="inline -mt-0.5 mr-1" size={14} />
            Paiements sécurisés. Livraison 24–48h en PACA.
          </p>
        </div>
      </aside>
    </main>
  );
}
