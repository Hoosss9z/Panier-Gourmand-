# Terroir Bio de Provence — Site vitrine (React + Vite + Tailwind)

Un starter prêt à l'emploi pour vendre des **fruits & légumes** et des **épicerie fine**.

## 🚀 Installation
1. Assurez-vous d'avoir **Node.js 18+** installé.
2. Dans un terminal :
   ```bash
   npm install
   npm run dev
   ```
   Le site démarre en local (http://localhost:5173).

## 🧰 Scripts
- `npm run dev` — lance le serveur de dev Vite
- `npm run build` — build de production
- `npm run preview` — prévisualisation du build

## 🎨 UI & Tech
- **React 18**, **Vite 5**
- **TailwindCSS 3** (config incluse)
- **Framer Motion** pour les animations
- **lucide-react** pour les icônes

## 🧩 Où modifier ?
- **Contenu / Produits** : modifiez `ALL_PRODUCTS` dans `src/App.jsx` (nom, prix, images, tags…).
- **Couleurs / styles** : personnalisez Tailwind via `tailwind.config.js` et les classes dans les composants.
- **Coordonnées** (téléphone, email, adresse) : section *Contact* dans `src/App.jsx`.

## 🛒 Vers un vrai e-commerce
Ce starter inclut un panier côté client. Pour des paiements réels : Stripe/Checkout, gestion de stock (Sanity/Strapi), authentification, etc.

## 📄 Licence
Usage libre pour votre boutique.

## Nouvelle structure (multipage)
- Accueil (`/`) : vitrine en défilé (sans prix)
- Produits (`/produits`) : catalogue + filtres + ajout au panier
- Le panier s'ouvre automatiquement lors de l'ajout
