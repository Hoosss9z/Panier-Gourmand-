import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <CheckCircle2 size={56} className="text-emerald-600 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Merci ! Paiement confirmé ✅</h1>
      <p className="text-neutral-600 mb-6">
        Vous recevrez un email de confirmation. Nous préparons votre commande.
      </p>
      <Link to="/produits" className="rounded-xl border px-4 py-2 hover:bg-neutral-50">
        Continuer les achats
      </Link>
    </main>
  );
}
