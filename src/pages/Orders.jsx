// src/pages/Orders.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getOrders, getOrder, updateOrder, nextStatus } from "../utils/orderStore";
import { Package, Truck, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

const statusLabel = {
  "reçu": { icon: Clock, color: "text-neutral-700", dot: "bg-neutral-400" },
  "en préparation": { icon: Package, color: "text-amber-700", dot: "bg-amber-500" },
  "expédié": { icon: Truck, color: "text-sky-700", dot: "bg-sky-500" },
  "en livraison": { icon: Truck, color: "text-emerald-700", dot: "bg-emerald-500" },
  "livré": { icon: CheckCircle2, color: "text-emerald-700", dot: "bg-emerald-600" },
};

function StatusBadge({ status }) {
  const S = statusLabel[status] || statusLabel["reçu"];
  const Icon = S.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full border ${S.color} border-black/10 bg-white`}>
      <span className={`h-2 w-2 rounded-full ${S.dot}`} />
      <Icon size={16} /> {status}
    </span>
  );
}

export default function Orders() {
  const { orderId } = useParams(); // /commande/:orderId
  const navigate = useNavigate();
  const [orders, setOrders] = useState(() => getOrders());
  const [selected, setSelected] = useState(() => orderId || orders[0]?.id || null);

  // “temps réel” : poll toutes les 10s (remplace par fetch / SSE si API dispo)
  useEffect(() => {
    const t = setInterval(() => setOrders(getOrders()), 10000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (orderId) setSelected(orderId);
  }, [orderId]);

  const current = useMemo(() => (selected ? getOrder(selected) : null), [orders, selected]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 grid lg:grid-cols-3 gap-8">
      <section className="lg:col-span-1">
        <h1 className="text-2xl font-bold mb-4">Mes commandes</h1>
        <div className="rounded-2xl border bg-white p-4 shadow-sm divide-y">
          {orders.length === 0 && (
            <div>
              <p className="text-neutral-500">Aucune commande pour le moment.</p>
              <p className="text-neutral-400 text-sm mt-2">Pour remplir cette page, ajoutez des produits au panier et passez une commande via la page <b>Commander</b>.</p>
            </div>
          )}
          {orders.map(o => (
            <button
              key={o.id}
              onClick={() => { setSelected(o.id); navigate(`/commande/${o.id}`); }}
              className={`w-full text-left py-3 flex items-center justify-between ${selected === o.id ? "bg-emerald-50 rounded-xl px-3" : ""}`}
            >
              <div>
                <div className="font-medium">Commande #{o.id.slice(-6)}</div>
                <div className="text-xs text-neutral-500">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <StatusBadge status={o.status} />
            </button>
          ))}
        </div>
      </section>

      <section className="lg:col-span-2">
        {!current ? (
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-neutral-600">Sélectionnez une commande à gauche.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Commande #{current.id.slice(-6)}</h2>
                <StatusBadge status={current.status} />
              </div>
              <p className="text-sm text-neutral-600 mt-1">
                Passée le {new Date(current.createdAt).toLocaleString()}
              </p>
              {current.eta && (
                <p className="mt-2 text-sm">
                  Estimée : <b>{new Date(current.eta).toLocaleString()}</b>
                </p>
              )}
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Détails</h3>
              <ul className="space-y-2">
                {current.items.map((it, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="truncate">{it.name} × {it.qty}</span>
                    <span>{(it.price * it.qty).toFixed(2)} €</span>
                  </li>
                ))}
              </ul>
              <hr className="my-4" />
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold">{current.total.toFixed(2)} €</span>
              </div>
            </div>

            {/* bouton admin/simulation : passer au statut suivant */}
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <button
                onClick={() => {
                  const next = nextStatus(current.status);
                  updateOrder(current.id, { status: next, updatedAt: Date.now() });
                  setOrders(getOrders());
                }}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-neutral-50"
              >
                Mettre à jour le statut <ArrowRight size={16} />
              </button>
              <p className="text-xs text-neutral-500 mt-2">
                (Pour test : simule l’update “reçu → en préparation → expédié → en livraison → livré”)
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
