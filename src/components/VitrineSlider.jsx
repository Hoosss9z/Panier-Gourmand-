// src/components/VitrineSlider.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ALL_PRODUCTS } from "../data/products";

/**
 * props:
 * - category: "fruits" | "legumes" | "provencal"
 * - title, subtitle, speed (ms)
 */
export default function VitrineSlider({
  category = "fruits",
  title,
  subtitle = "Découvrez nos saveurs de saison.",
  speed = 3000,
}) {
  // Liste filtrée + mémoïsée (évite des recalculs)
  const showcase = useMemo(
    () => ALL_PRODUCTS.filter((p) => p.category === category),
    [category]
  );

  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  // 🔁 Auto défilement robuste
  useEffect(() => {
    if (!showcase.length) return;
    // si la catégorie change et que l'index est hors limite → reset à 0
    if (index >= showcase.length) setIndex(0);

    timer.current && clearInterval(timer.current);
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % showcase.length),
      Math.max(1500, speed)
    );

    return () => timer.current && clearInterval(timer.current);
  }, [showcase.length, index, speed]);

  // Rien à afficher pour cette catégorie
  if (!showcase.length) {
    return (
      <div className="rounded-3xl border bg-white/60 p-6 text-sm text-neutral-600">
        Aucun visuel pour cette catégorie.
      </div>
    );
  }

  const current = showcase[Math.min(index, showcase.length - 1)];

  return (
    <div className="relative rounded-3xl overflow-hidden border bg-white/60 backdrop-blur shadow-sm">
      <div className="relative aspect-[16/9] md:aspect-[16/7]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.4 }}
            className="relative h-full w-full"
          >
            {/* Image (avec couleur de fond si l'image tarde) */}
            <img
              src={current.img}
              alt={current.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover bg-neutral-200"
              onError={(e) => {
                // si l'image échoue, on met un fond neutre pour garder la hauteur
                e.currentTarget.style.objectFit = "contain";
                e.currentTarget.style.background = "#f3f4f6";
              }}
            />

            {/* voile gradient pour la lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />

            {/* TAGS : en haut-gauche (loin des flèches) */}
            <div className="absolute top-4 left-5 z-20 flex flex-wrap gap-2">
              {current.tags?.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs md:text-sm bg-white/30 backdrop-blur border border-white/40 text-white shadow"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Titre + sous-titre : en bas */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-7">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow">
                {title || current.name}
              </h3>
              <p className="mt-1 text-white/90 text-sm md:text-base">{subtitle}</p>
            </div>

            {/* Flèches : centrées et bien écartées du bord */}
            <button
              onClick={() =>
                setIndex((i) => (i - 1 + showcase.length) % showcase.length)
              }
              className="absolute left-5 md:left-7 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/95 hover:bg-white shadow-lg border"
              aria-label="Précédent"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % showcase.length)}
              className="absolute right-5 md:right-7 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/95 hover:bg-white shadow-lg border"
              aria-label="Suivant"
            >
              <ChevronRight />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {showcase.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-6 rounded-full ${
                    i === index ? "bg-white" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
