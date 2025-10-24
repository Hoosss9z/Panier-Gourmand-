import React from "react";
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Paiement annulé</h1>
      <p className="text-neutral-600 mb-6">Vous pouvez réessayer quand vous voulez.</p>
      <Link to="/checkout" className="rounded-xl border px-4 py-2 hover:bg-neutral-50">
        Retour au paiement
      </Link>
    </main>
  );
}
