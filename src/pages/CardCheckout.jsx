// src/pages/CardCheckout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addOrder, markOrderSync } from "../utils/orderStore";
import { useCart } from "../context/CartContext";

export default function CardCheckout() {
  const navigate = useNavigate();
  const { clear } = useCart();
  const [orderDraft, setOrderDraft] = useState(null);

  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem("pg_order_draft"));
      if (!draft) return navigate("/checkout");
      setOrderDraft(draft);
    } catch {
      navigate("/checkout");
    }
  }, [navigate]);

  const amount = useMemo(() => (orderDraft?.totals?.total ?? 0).toFixed(2), [orderDraft]);
  if (!orderDraft) return null;

  const PAYMENT_LINK = "https://buy.stripe.com/test_XXXXXXXX"; // TODO: remplace par ton lien

  async function finalizeAfterManual() {
    const newId = addOrder({ ...orderDraft, syncStatus: "pending", payment: { provider: "card" } });
    try {
      const res = await fetch("https://formspree.io/f/xzzjjgwe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...orderDraft, payment: { provider: "card", link: PAYMENT_LINK } }),
      });
      if (!res.ok) throw new Error("Échec de l’envoi Formspree");
      markOrderSync(newId, "synced");
      clear();
      localStorage.removeItem("pg_order_draft");
      navigate(`/commande/${newId}`);
    } catch (err) {
      markOrderSync(newId, "pending");
      localStorage.removeItem("pg_order_draft");
      navigate(`/commande/${newId}`);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Paiement par carte</h1>
      <p className="mb-4">Montant : <strong>{amount} €</strong></p>
      <a className="inline-block rounded-xl bg-black text-white px-4 py-2" href={PAYMENT_LINK} target="_blank" rel="noreferrer">
        Payer maintenant
      </a>
      <p className="text-sm text-neutral-500 mt-3">Une fois le paiement effectué, cliquez ci-dessous.</p>
      <div className="mt-6">
        <button className="rounded-xl border px-4 py-2" onClick={finalizeAfterManual}>
          J’ai payé
        </button>
      </div>
    </div>
  );
}
