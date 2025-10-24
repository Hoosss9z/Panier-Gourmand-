import React from "react";
import VitrineSlider from "../components/VitrineSlider";
import { ShieldCheck, Truck } from "lucide-react";



export default function Home() {
  return (
    <>
      {/* HERO avec slider Fruits & Légumes (à droite) */}
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop"
            alt="Lavande"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-emerald-50/80" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-neutral-900">
              Fruits & légumes, saveurs <span className="text-emerald-700">provençales</span>
            </h1>
            <p className="mt-4 text-neutral-700 text-lg">
              Bienvenue dans notre boutique : découvrez un aperçu de nos produits frais et locaux.
            </p>
            <p className="mt-4 text-neutral-700">
              Nous sélectionnons chaque semaine des variétés de saison, cueillies à maturité
              auprès de producteurs engagés. Traçabilité, fraîcheur et juste prix — c’est notre
              promesse.
            </p>
            <div className="mt-6 flex items-center gap-6 text-sm text-neutral-700">
              <div className="flex items-center gap-2"><Truck size={18} /> Livraison locale</div>
              <div className="flex items-center gap-2"><ShieldCheck size={18} /> Certifié Bio</div>
            </div>
          </div>

          {/* 1er slider : fruits & légumes */}
          <div className="bg-white/70 backdrop-blur border rounded-3xl p-4 md:p-6 shadow-sm">
            <VitrineSlider
              category="legumes" // ou "fruits" — à toi de choisir
              title="Sélection fraîche de la semaine"
              subtitle="Fruits & légumes de saison issus de l’agriculture biologique."
              speed={3500}
            />
          </div>
        </div>
      </section>

      {/* BLOC TEXTE sous le 1er slider */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border bg-white/70 backdrop-blur p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold">Pourquoi nous choisir ?</h2>
          <div className="mt-3 grid md:grid-cols-3 gap-6 text-neutral-700">
            <p>
              <strong>Ultra-frais :</strong> préparation des commandes le jour même et
              livraison en 24–48h sur la région.
            </p>
            <p>
              <strong>Local & transparent :</strong> producteurs partenaires, respect des saisons,
              origine précisée pour chaque référence.
            </p>
            <p>
              <strong>Gourmand & responsable :</strong> recettes, conseils anti-gaspillage,
              et emballages raisonnés.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION PROVENCE : slider à GAUCHE + texte à droite */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* 2e slider : Produits provençaux à GAUCHE */}
          <div className="order-1 md:order-none">
            <div className="bg-white/70 backdrop-blur border rounded-3xl p-4 md:p-6 shadow-sm">
              <VitrineSlider
                category="provencal"
                title="Saveurs de Provence"
                subtitle="Miel de lavande, huiles AOP, tapenades, herbes & douceurs."
                speed={3200}
              />
            </div>
          </div>

          {/* Texte à DROITE */}
          <div className="order-2 md:order-none">
            <h2 className="text-2xl md:text-3xl font-bold">Produits d’épicerie provençale</h2>
            <p className="mt-3 text-neutral-700">
              Complétez votre panier frais avec des produits d’exception : huile d’olive AOP,
              <em> miel de lavande</em>, tapenade artisanale, herbes de Provence IGP, calissons…
              Des classiques de la région pour sublimer vos plats du quotidien.
            </p>
            <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-neutral-700">
              <li>• Huiles d’olive AOP & premières pressions</li>
              <li>• Miels de fleurs & de lavande</li>
              <li>• Tapenades & condiments artisanaux</li>
              <li>• Herbes de Provence IGP, navettes & douceurs</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
