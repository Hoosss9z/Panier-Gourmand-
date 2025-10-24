// src/pages/PayPalCheckout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { addOrder, markOrderSync } from "../utils/orderStore";
import { useCart } from "../context/CartContext";

function InnerPayPal({ orderDraft }) {
  const navigate = useNavigate();
  const { clear } = useCart();
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

  const amount = useMemo(
    () => (orderDraft?.totals?.total ?? 0).toFixed(2),
    [orderDraft]
  );

  if (isPending) {
    return <div className="text-sm text-neutral-500">Chargement du module de paiement…</div>;
  }
  if (isRejected) {
    return (
      <div className="text-red-600">
        Échec du chargement du SDK PayPal. Désactive un bloqueur (Adblock/Brave) et recharge la page.
      </div>
    );
  }
  if (!isResolved) return null;

  return (
    <PayPalButtons
      style={{ layout: "vertical" }}
      fundingSource={undefined} // laisse PayPal choisir (carte ou PayPal)
      createOrder={(_, actions) =>
        actions.order.create({
          purchase_units: [{ amount: { value: amount } }],
        })
      }
      onApprove={async (_, actions) => {
        const details = await actions.order.capture();

        const newId = addOrder({ ...orderDraft, syncStatus: "pending" });
        try {
          const res = await fetch("https://formspree.io/f/xzzjjgwe", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ ...orderDraft, payment: { provider: "paypal", details } }),
          });
          if (!res.ok) throw new Error("Échec de l’envoi Formspree");
          markOrderSync(newId, "synced");
          clear();
        } catch {
          markOrderSync(newId, "pending");
        } finally {
          localStorage.removeItem("pg_order_draft");
          navigate(`/commande/${newId}`);
        }
      }}
      onCancel={() => navigate("/checkout/cancel")}
      onError={(err) => {
        console.error(err);
        navigate("/checkout/cancel");
      }}
    />
  );
}

export default function PayPalCheckout() {
  const navigate = useNavigate();
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

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  if (!clientId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-2">Paiement PayPal</h1>
        <p className="text-red-600">
          Client ID PayPal manquant. Ajoute <code>VITE_PAYPAL_CLIENT_ID</code> dans <code>.env.local</code>, puis relance le serveur.
        </p>
      </div>
    );
  }

  if (!orderDraft) return null;

  console.log("🔍 PayPal client ID =", import.meta.env.VITE_PAYPAL_CLIENT_ID);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Paiement PayPal</h1>
      <p className="mb-6">Montant : <strong>{amount} €</strong></p>

      <PayPalScriptProvider
        options={{
          "client-id": clientId,
          currency: "EUR",
          components: "buttons",
          intent: "CAPTURE",
        }}
      >
        <InnerPayPal orderDraft={orderDraft} />
      </PayPalScriptProvider>
    </div>
  );
}
