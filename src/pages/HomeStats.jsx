import { Truck, ShieldCheck, Sprout, Star } from "lucide-react";

export default function HomeStats() {
  const items = [
    { icon: Truck, title: "Livraison 24–48h", text: "Locale & soignée" },
    { icon: Sprout, title: "100% de saison", text: "Producteurs engagés" },
    { icon: ShieldCheck, title: "Certifié Bio", text: "Traçabilité claire" },
    { icon: Star, title: "Note 4.8/5", text: "+1 200 avis" },
  ];
  return (
    <section className="bg-white/60 backdrop-blur border-y">
      <div className="mx-auto max-w-7xl px-4 py-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 border">
              <Icon size={18} className="text-emerald-700" />
            </span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-neutral-600">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
