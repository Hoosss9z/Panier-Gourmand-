// Importation des images
import jusImg from '../assets/jus.jpg'
import noixImg from '../assets/noixx.jpg'
import oeufImg from '../assets/oeuf.jpg'
import oignonImg from '../assets/oignon.jpg'
import oliveImg from '../assets/olive.jpg'
import panier1Img from '../assets/panier1.jpg'
import panier2Img from '../assets/panier2.jpg'
import panier3Img from '../assets/panier3.jpg'
import panier4Img from '../assets/panier4.jpg'
import panier5Img from '../assets/panier5.jpg'
import panier6Img from '../assets/panier6.jpg'
import pommeImg from '../assets/pomme.jpg'
import raisinImg from '../assets/raisin.jpg'
import tomatesImg from '../assets/tomates-.jpg'
import tomates1Img from '../assets/tomates.jpg'

export const CATEGORIES = [
  { id: 'fruits', label: 'Fruits' },
  { id: 'legumes', label: 'Légumes' },
  { id: 'provencal', label: 'Epicerie Fine' },
]

export const ALL_PRODUCTS = [
  { id: 'jus-pomme', name: 'Jus de Pomme', price: 3.9, unit: '€/kg', category: 'provencal', tags: ['Local'], rating: 4.8, img: jusImg },
  { id: 'noix-fromage', name: 'Noix', price: 4.2, unit: '€/kg', category: 'provencal', tags: ['Bio'], rating: 4.7, img: noixImg },
  { id: 'oeuf', name: 'Oeuf Frais', price: 6.5, unit: '€/barquette', category: 'provencal', tags: ['IGP'], rating: 4.9, img: oeufImg },
  { id: 'oignon', name: 'Sac d\'Oignon', price: 5.6, unit: '€/kg', category: 'legumes', tags: ['provencal'], rating: 4.9, img: oignonImg },
  { id: 'olive', name: 'Pot d\'Olive', price: 3.5, unit: '€/kg', category: 'provencal', tags: ['Local'], rating: 4.6, img: oliveImg },
  { id: 'panier1', name: 'Panier Mix', price: 4.1, unit: '€/kg', category: 'fruits', tags: ['Bio'], rating: 4.5, img: panier1Img },
  { id: 'panier2', name: "Panier de Fruits", price: 14.9, unit: '€/50cl', category: 'fruits', tags: ['Première pression'], rating: 5.0, img: panier2Img },
  { id: 'panier3', name: 'Panier de Légumes', price: 6.9, unit: '€/pot', category: 'legumes', tags: ['Artisanal'], rating: 4.8, img: panier3Img },
  { id: 'panier4', name: 'Panier de provencal', price: 3.2, unit: '€/sachet', category: 'fruits', tags: ['IGP'], rating: 4.7, img: panier4Img },
  { id: 'panier5', name: 'Panier Tropical', price: 12.5, unit: '€/boîte', category: 'fruits', tags: ['Gourmand'], rating: 4.9, img: panier5Img },
  { id: "panier6", name: "Panier Rare", price: 7.9, unit: "€/250g", category: "legumes", tags: ["Artisanal"], rating: 4.9, img: panier6Img },
  { id: "pomme", name: "Sac de Pomme de terre", price: 5.5, unit: "€/sachet", category: "legumes", tags: ["Gourmand"], rating: 4.7, img: pommeImg },
  { id: "raisin", name: "Raisin Fromage", price: 3.1, unit: "€/500g", category: "fruits", tags: ["Bio"], rating: 4.6, img: raisinImg },
  { id: 'Tomates', name: 'Tomates Burata', price: 3.9, unit: '€/kg', category: 'fruits', tags: ['Local'], rating: 4.8, img: tomatesImg },
  { id: 'tomates1', name: 'Tomates Burata B', price: 4.2, unit: '€/kg', category: 'fruits', tags: ['Bio'], rating: 4.7, img: tomates1Img },
  { id: 'figues-de-provence', name: 'Figues de Provence', price: 6.5, unit: '€/barquette', category: 'fruits', tags: ['IGP'], rating: 4.9, img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1200&auto=format&fit=crop' },
]
