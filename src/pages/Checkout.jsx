// src/pages/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
// Pas besoin d'ajouter/markOrder ici: on le fait sur les pages de paiement
// import { addOrder, markOrderSync } from "../utils/orderStore";

const FR_PHONE = /^(?:\+33|0)[1-9]\d{8}$/;
const FR_ZIP = /^\d{5}$/;

function normalizePhone(input) {
  const digits = String(input || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10 && digits.startsWith("0")) return digits; // 0XXXXXXXXX
  if (digits.startsWith("33")) return "+" + digits;                  // 33XXXXXXXXX -> +33...
  if (digits.length === 9) return "0" + digits;                       // 9 chiffres -> on préfixe 0
  return "+" + digits;                                                // fallback
}

function computeCartTotals(items, shippingMethod = "standard") {
  const subtotal = items.reduce(
    (s, it) => s + (it.price || 0) * (it.quantity || it.qty || 1),
    0
  );

  let shipping = 0;
  if (shippingMethod === "standard") {
    // Gratuit à partir de 25 €, sinon 1.99 €
    shipping = subtotal >= 25 ? 0 : 1.99;
  } else if (shippingMethod === "express") {
    // Toujours 3.99 €, jamais gratuit
    shipping = 3.99;
  } else {
    shipping = 1.99;
  }

  return {
    subtotal: +subtotal.toFixed(2),
    shipping: +shipping.toFixed(2),
    total: +(subtotal + shipping).toFixed(2),
  };
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, count } = useCart();

  // On mappe le contexte panier -> structure "plane" pour l'envoi
  const cartItems = useMemo(
    () =>
      items.map(({ product, qty }) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
      })),
    [items]
  );

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    zip: "",
    city: "",
    country: "France",
    shippingMethod: "standard",          // "standard" | "express"
    paymentMethod: "paypal",             // "paypal" | "card"
    deliveryNotes: "",
    billingDifferent: false,
    billing: {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      zip: "",
      city: "",
      country: "France",
    },
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ sending: false, ok: false, error: null });

  // Recharger d'éventuelles infos client
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pg_customerInfo"));
      if (saved) setForm((f) => ({ ...f, ...saved }));
    } catch {}
  }, []);

  const totals = useMemo(
    () => computeCartTotals(cartItems, form.shippingMethod),
    [cartItems, form.shippingMethod]
  );

  const update = (k, v) =>
    setForm((f) => {
      const next = { ...f, [k]: v };
      localStorage.setItem("pg_customerInfo", JSON.stringify(next));
      return next;
    });

  const updateBilling = (k, v) =>
    setForm((f) => {
      const next = { ...f, billing: { ...f.billing, [k]: v } };
      localStorage.setItem("pg_customerInfo", JSON.stringify(next));
      return next;
    });

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Prénom requis";
    if (!form.lastName.trim()) e.lastName = "Nom requis";
    if (!form.email.trim()) e.email = "Email requis";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email invalide";

    const normalizedPhone = normalizePhone(form.phone);
    if (!normalizedPhone) e.phone = "Téléphone requis";
    if (normalizedPhone && !FR_PHONE.test(normalizedPhone)) e.phone = "Téléphone français invalide";

    if (!form.address1.trim()) e.address1 = "Adresse requise";
    if (!form.zip.trim() || !FR_ZIP.test(form.zip)) e.zip = "Code postal invalide";
    if (!form.city.trim()) e.city = "Ville requise";
    if (!form.acceptTerms) e.acceptTerms = "Vous devez accepter les CGV";

    if (form.billingDifferent) {
      const b = form.billing;
      if (!b.firstName.trim()) e.billingFirstName = "Prénom facturation requis";
      if (!b.lastName.trim()) e.billingLastName = "Nom facturation requis";
      if (!b.address1.trim()) e.billingAddress1 = "Adresse facturation requise";
      if (!b.zip.trim() || !FR_ZIP.test(b.zip)) e.billingZip = "CP facturation invalide";
      if (!b.city.trim()) e.billingCity = "Ville facturation requise";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildOrderPayload() {
    return {
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: normalizePhone(form.phone),
      },
      shippingAddress: {
        address1: form.address1,
        address2: form.address2 || null,
        zip: form.zip,
        city: form.city,
        country: form.country,
        notes: form.deliveryNotes || null,
        method: form.shippingMethod,
      },
      billingAddress: form.billingDifferent
        ? {
            firstName: form.billing.firstName,
            lastName: form.billing.lastName,
            address1: form.billing.address1,
            address2: form.billing.address2 || null,
            zip: form.billing.zip,
            city: form.billing.city,
            country: form.billing.country,
          }
        : "same-as-shipping",
      cart: cartItems.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
      totals,
      consent: { termsAccepted: form.acceptTerms, newsletter: false },
      placedAt: new Date().toISOString(),
      source: "checkout-page",
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setStatus({ sending: true, ok: false, error: null });

    // 1) Construire et stocker le brouillon pour la page de paiement
    const order = buildOrderPayload();
    localStorage.setItem("pg_order_draft", JSON.stringify(order));

    // 2) Rediriger vers la page de paiement choisie
    if (form.paymentMethod === "paypal") {
      navigate("/checkout/paypal");
    } else {
      navigate("/checkout/card");
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Finaliser votre commande</h1>

      <form className="grid gap-4 max-w-2xl" onSubmit={handleSubmit} noValidate>
        <h2 className="text-xl font-semibold">Coordonnées</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Prénom" value={form.firstName} onChange={(v) => update("firstName", v)} error={errors.firstName} />
          <Field label="Nom" value={form.lastName} onChange={(v) => update("lastName", v)} error={errors.lastName} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} error={errors.email} />
          <Field label="Téléphone" placeholder="+33..." value={form.phone} onChange={(v) => update("phone", v)} error={errors.phone} />
        </div>

        <h2 className="text-xl font-semibold mt-4">Adresse de livraison</h2>
        <Field label="Adresse (ligne 1)" value={form.address1} onChange={(v) => update("address1", v)} error={errors.address1} />
        <Field label="Adresse (ligne 2)" value={form.address2} onChange={(v) => update("address2", v)} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Code postal" value={form.zip} onChange={(v) => update("zip", v)} error={errors.zip} />
          <Field label="Ville" value={form.city} onChange={(v) => update("city", v)} error={errors.city} />
          <Field label="Pays" value={form.country} onChange={(v) => update("country", v)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Mode de livraison"
            value={form.shippingMethod}
            onChange={(v) => update("shippingMethod", v)}
            options={[
              { value: "standard", label: "Standard (2–4 j)" },
              { value: "express", label: "Express (1–2 j)" },
            ]}
          />
          <Field label="Instructions de livraison (optionnel)" value={form.deliveryNotes} onChange={(v) => update("deliveryNotes", v)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Mode de paiement"
            value={form.paymentMethod}
            onChange={(v) => update("paymentMethod", v)}
            options={[
              { value: "paypal", label: "PayPal" },
              { value: "card", label: "Carte bancaire" },
            ]}
          />
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.billingDifferent} onChange={(e) => update("billingDifferent", e.target.checked)} />
          Adresse de facturation différente
        </label>

        {form.billingDifferent && (
          <div className="border rounded-xl p-4 grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Prénom (fact.)" value={form.billing.firstName} onChange={(v) => updateBilling("firstName", v)} error={errors.billingFirstName} />
              <Field label="Nom (fact.)" value={form.billing.lastName} onChange={(v) => updateBilling("lastName", v)} error={errors.billingLastName} />
            </div>
            <Field label="Adresse (fact.) ligne 1" value={form.billing.address1} onChange={(v) => updateBilling("address1", v)} error={errors.billingAddress1} />
            <Field label="Adresse (fact.) ligne 2" value={form.billing.address2} onChange={(v) => updateBilling("address2", v)} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Code postal (fact.)" value={form.billing.zip} onChange={(v) => updateBilling("zip", v)} error={errors.billingZip} />
              <Field label="Ville (fact.)" value={form.billing.city} onChange={(v) => updateBilling("city", v)} error={errors.billingCity} />
              <Field label="Pays (fact.)" value={form.billing.country} onChange={(v) => updateBilling("country", v)} />
            </div>
          </div>
        )}

        <div className="text-sm bg-gray-50 rounded-xl p-4">
          <div>Panier: {count} article(s) — Sous-total: {totals.subtotal.toFixed(2)} €</div>
          <div>Livraison ({form.shippingMethod}): {totals.shipping.toFixed(2)} €</div>
          <div className="font-semibold">Total: {totals.total.toFixed(2)} €</div>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.acceptTerms} onChange={(e) => update("acceptTerms", e.target.checked)} />
          J’ai lu et j’accepte les CGV
        </label>
        {errors.acceptTerms && <p className="text-red-600 text-sm">{errors.acceptTerms}</p>}

        <button className="px-4 py-2 rounded-xl bg-black text-white" disabled={status.sending}>
          {status.sending ? "Envoi..." : "Valider la commande"}
        </button>
        {status.ok && <p className="text-green-700 text-sm mt-2">Commande envoyée ✅</p>}
        {status.error && <p className="text-red-700 text-sm mt-2">Erreur: {status.error}</p>}
      </form>
    </div>
  );
}  // 👈 Fermeture du composant (était manquante)

function Field({ label, value, onChange, type = "text", placeholder, error }) {
  const isOptional = ["Adresse (ligne 2)", "Instructions de livraison (optionnel)"].includes(label);
  return (
    <div className="grid gap-1">
      <label className="text-sm">{label}</label>
      <input
        className={`border rounded-xl p-2 ${error ? "border-red-500" : "border-gray-300"}`}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required={!isOptional}
      />
      {error && <span className="text-red-600 text-xs">{error}</span>}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="grid gap-1">
      <label className="text-sm">{label}</label>
      <select
        className="border rounded-xl p-2 border-gray-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
