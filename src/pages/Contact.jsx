// src/pages/Contact.jsx
import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  Instagram,
  Ghost, // remplace Snapchat par Ghost
} from "lucide-react";


export default function Contact() {
  const [status, setStatus] = useState({ sent: false, error: null, loading: false });

    function handleSubmit(e) {
      e.preventDefault();
      setStatus({ sent: false, error: null, loading: true });
    
      const formData = new FormData(e.target);
    
      fetch("https://formspree.io/f/xzzjjgwe", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(async (res) => {
          if (res.ok) {
            setStatus({ sent: true, error: null, loading: false });
            e.target.reset();
          } else {
            const data = await res.json().catch(() => ({}));
            setStatus({
              sent: false,
              error: data?.errors?.[0]?.message || "Erreur d’envoi.",
              loading: false,
            });
          }
        })
        .catch(() =>
          setStatus({ sent: false, error: "Erreur de connexion.", loading: false })
        );
    }


  return (
    <main>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-emerald-50/80" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900">
            Contactez-nous
          </h1>
          <p className="mt-3 text-neutral-700 max-w-2xl">
            Une question, une commande spéciale ou un partenariat ? Écrivez-nous, on vous répond rapidement.
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-16 grid lg:grid-cols-3 gap-8">
        {/* Infos */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Nos coordonnées</h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5" size={18} />
                <span>07 43 50 24 99</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5" size={18} />
                <span>paniergourmand13@gmail.com</span>
              </li>

              <li className="flex items-start gap-2">
                <Instagram className="mt-0.5 text-emerald-600" size={18} />
                <a
                  href="https://www.instagram.com/panier_gourmand13"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-700 hover:underline"
                >
                  panier_gourmand13
                </a>
              </li>

              <li className="flex items-start gap-2">
                <Ghost className="mt-0.5 text-emerald-600" size={18} />
                <a
                  href="https://www.snapchat.com/add/panier2gourmand"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-700 hover:underline"
                >
                  panier2gourmand
                </a>
              </li>

              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5" size={18} />
                <span>12 rue des Lavandes, 13100 Aix-en-Provence</span>
              </li>
            </ul>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Horaires</h3>
              <ul className="text-sm text-neutral-700 space-y-1">
                <li className="flex items-center gap-2"><Clock size={16} /> Lun–Ven : 9h-18h</li>
                <li className="flex items-center gap-2"><Clock size={16} /> Sam : 9h-13h</li>
              </ul>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* Carte (change l’adresse si besoin) */}
            <iframe
              title="Carte"
              className="w-full h-64"
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps?q=12%20rue%20des%20Lavandes%2013100%20Aix-en-Provence&output=embed"
            />
          </div>
        </aside>

        {/* Formulaire */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Écrivez-nous</h2>

            {status.sent && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">
                Merci, votre message a bien été envoyé. Nous revenons vers vous très vite.
              </div>
            )}
            {status.error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-800">
                Oups, une erreur est survenue. Réessayez plus tard.
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-600">Prénom</label>
                <input
                  name="firstName"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-neutral-600">Nom</label>
                <input
                  name="lastName"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-neutral-600">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="vous@exemple.fr"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-neutral-600">Téléphone (facultatif)</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+33 6 00 00 00 00"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-neutral-600">Objet</label>
                <input
                  name="subject"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-neutral-600">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Votre demande…"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="inline-flex items-start gap-2 text-sm text-neutral-700">
                  <input type="checkbox" required className="mt-1" />
                  <span>
                    J’accepte que mes données soient utilisées pour être recontacté(e).
                    <br />
                    <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
                      <ShieldCheck size={14} /> Nous ne partageons jamais vos données.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-white font-medium hover:bg-emerald-700 disabled:opacity-60"
            >
              <Send size={18} />
              {status.loading ? "Envoi…" : "Envoyer le message"}
            </button>

            <p className="mt-2 text-xs text-neutral-500">
              En envoyant ce formulaire, vous acceptez notre politique de confidentialité.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
