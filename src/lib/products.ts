export type Product = {
  id: number | string; // Allow both number and string IDs for Shopify compatibility
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[]; // Optional gallery images; falls back to single image
  badges?: string[];
  tags?: string[];
  // Shopify-specific fields
  handle?: string;
  description?: string;
  variants?: Array<{
    id: string;
    title: string;
    price: number;
    availableForSale: boolean;
    image: string;
  }>;
};

import img1 from "../../aryk img/WhatsApp Image 2025-08-19 at 20.33.55_f82027bb.jpg";
import img2 from "../../aryk img/WhatsApp Image 2025-08-19 at 20.33.54_8b831021.jpg";
import img3 from "../../aryk img/WhatsApp Image 2025-08-19 at 20.33.53_e5916e0a.jpg";
import img4 from "../../aryk img/WhatsApp Image 2025-08-19 at 20.33.53_9ec97964.jpg";
import img5 from "../../aryk img/WhatsApp Image 2025-08-19 at 20.33.53_21ccdee9.jpg";
import img6 from "../../aryk img/WhatsApp Image 2025-08-19 at 20.33.52_9cb19fa4.jpg";

export const products: Product[] = [
  {
    id: 1,
    name: "Ashwagandha Bounce",
    category: "MOISTURISER",
    price: 2700,
    rating: 4.8,
    reviewCount: 1367,
    image: img1,
    badges: ["BESTSELLER", "IN A MINI"],
  },
  {
    id: 2,
    name: "Sandalnut Bloom",
    category: "MOISTURISER",
    price: 2700,
    rating: 4.6,
    reviewCount: 61,
    image: img2,
    badges: ["BESTSELLER"],
  },
  {
    id: 3,
    name: "Gotu Kola",
    category: "TONER SERUM",
    price: 2400,
    rating: 4.7,
    reviewCount: 892,
    image: img3,
    badges: ["BESTSELLER"],
  },
  {
    id: 4,
    name: "Turmeric Brightening",
    category: "FACE MASK",
    price: 1800,
    rating: 4.9,
    reviewCount: 2134,
    image: img4,
    badges: ["BESTSELLER"],
  },
  {
    id: 5,
    name: "Rose Quartz Glow",
    category: "FACE OIL",
    price: 3200,
    rating: 4.5,
    reviewCount: 456,
    image: img5,
  },
  {
    id: 6,
    name: "Vitamin C Serum",
    category: "SERUM",
    price: 2900,
    rating: 4.8,
    reviewCount: 789,
    image: img6,
    badges: ["NEW"],
  },
  {
    id: 7,
    name: "Neem & Tea Tree",
    category: "CLEANSER",
    price: 1600,
    rating: 4.6,
    reviewCount: 523,
    image: img1,
    badges: ["BESTSELLER"],
  },
  {
    id: 8,
    name: "Aloe Vera Gel",
    category: "MOISTURISER",
    price: 1200,
    rating: 4.4,
    reviewCount: 234,
    image: img2,
  },
  {
    id: 9,
    name: "Hyaluronic Acid",
    category: "SERUM",
    price: 2200,
    rating: 4.7,
    reviewCount: 678,
    image: img3,
    badges: ["HYDRATING"],
  },
  {
    id: 10,
    name: "Charcoal Detox",
    category: "FACE MASK",
    price: 1400,
    rating: 4.5,
    reviewCount: 345,
    image: img4,
  },
  {
    id: 11,
    name: "Jojoba Oil",
    category: "FACE OIL",
    price: 1800,
    rating: 4.3,
    reviewCount: 189,
    image: img5,
  },
  {
    id: 12,
    name: "Retinol Complex",
    category: "SERUM",
    price: 3500,
    rating: 4.9,
    reviewCount: 456,
    image: img6,
    badges: ["ANTI-AGING"],
  },
  {
    id: 13,
    name: "Green Tea Toner",
    category: "TONER",
    price: 1100,
    rating: 4.4,
    reviewCount: 267,
    image: img1,
  },
  {
    id: 14,
    name: "Shea Butter",
    category: "MOISTURISER",
    price: 2000,
    rating: 4.6,
    reviewCount: 398,
    image: img2,
    badges: ["NATURAL"],
  },
  {
    id: 15,
    name: "Peptide Boost",
    category: "SERUM",
    price: 3800,
    rating: 4.8,
    reviewCount: 234,
    image: img3,
    badges: ["PREMIUM"],
  },
  {
    id: 16,
    name: "Clay Purifying",
    category: "FACE MASK",
    price: 1600,
    rating: 4.5,
    reviewCount: 189,
    image: img4,
  },
];


