// products.js — Central Product Data for Scentify
// Used by product-detail.html to dynamically render any product via ?id=

const products = {

  "sultan-e-ameer": {
    id: "sultan-e-ameer",
    name: "Sultan E Ameer",
    tagline: "Attar Oil · Addition To Arabia",
    subtitle: "Concentrated Perfume · 16ml",
    price: 2199,
    oldPrice: 2500,
    rating: 4.5,
    reviews: 124,
    images: [
      "../../Images/Products/sultan-e-ameer/1.webp",
      "../../Images/Products/sultan-e-ameer/2.webp",
      "../../Images/Products/sultan-e-ameer/3.png",
      "../../Images/Products/sultan-e-ameer/4.png"
    ],
    description: "Sultan E Ameer opens with Floral-Woody accords, layered over subtle undertones of Musk and Citrus — creating an enchanting, long-lasting scent worthy of its name.",
    notes: {
      top: "Bergamot",
      middle: "Jasmine, Rose",
      base: "Sandalwood, Amber, Oakmoss, Musk"
    },
    specifications: [
      "Product Type: Concentrated Perfume / Attar Oil",
      "Volume: 16ml",
      "Application: Roll-on or Dab",
      "Longevity: Up to 8–10 hours",
      "Ideal For: Men and Women (Unisex)",
      "Packaging: Luxury Velvet Box & Glass Bottle"
    ],
    category: "attar-oil",
    scent_family: ["woody", "floral", "musky"],
    occasion: ["evening", "special"],
    intensity: "8+",
    ideal_for: "unisex"
  },

  "black-silver-platinum": {
    id: "black-silver-platinum",
    name: "Black & Silver Platinum",
    tagline: "Attar Oil · Upgrading Our Best Fragrance",
    subtitle: "Concentrated Perfume · 12ml",
    price: 1499,
    oldPrice: 1799,
    rating: 3.5,
    reviews: 78,
    images: [
      "../../Images/Products/black-silver-platinum/1.webp"
    ],
    description: "Black & Silver Platinum blends sharp metallic freshness with a warm musky base — a modern, versatile attar for everyday luxury.",
    notes: {
      top: "Bergamot, Cardamom",
      middle: "Lavender, Geranium",
      base: "Musk, Amber, Cedarwood"
    },
    specifications: [
      "Product Type: Concentrated Perfume / Attar Oil",
      "Volume: 12ml",
      "Application: Roll-on or Dab",
      "Longevity: Up to 6–8 hours",
      "Ideal For: Men",
      "Packaging: Luxury Box & Glass Bottle"
    ],
    category: "attar-oil",
    scent_family: ["musky", "citrus"],
    occasion: ["daily", "evening"],
    intensity: "4-6",
    ideal_for: "male"
  },

  "black-silver-oudh": {
    id: "black-silver-oudh",
    name: "Black & Silver Oudh",
    tagline: "Attar Oil · King of the Series",
    subtitle: "Concentrated Perfume · 12ml",
    price: 1899,
    oldPrice: 2199,
    rating: 5,
    reviews: 56,
    images: [
      "../../Images/Products/black-silver-oudh/1.webp"
    ],
    description: "Black & Silver Oudh is bold and mysterious, layering deep oud wood with smoky incense for a rich, long-lasting evening fragrance.",
    notes: {
      top: "Saffron, Black Pepper",
      middle: "Oud Wood, Rose",
      base: "Amber, Musk, Incense"
    },
    specifications: [
      "Product Type: Concentrated Perfume / Attar Oil",
      "Volume: 12ml",
      "Application: Roll-on or Dab",
      "Longevity: Up to 8–10 hours",
      "Ideal For: Men",
      "Packaging: Luxury Box & Glass Bottle"
    ],
    category: "attar-oil",
    scent_family: ["woody", "musky"],
    occasion: ["evening", "special"],
    intensity: "8+",
    ideal_for: "male"
  },

  "white-oudh": {
    id: "white-oudh",
    name: "White Oudh",
    tagline: "Attar Oil · Classy Men's Fragrance",
    subtitle: "Concentrated Oil · Dense Heavy Fragrance",
    price: 999,
    oldPrice: 1199,
    rating: 5,
    reviews: 89,
    images: [
      "../../Images/Products/white-oudh/1.webp"
    ],
    description: "White Oudh delivers a dense, heavy scent profile with creamy sandalwood and soft musk — a classy fragrance for men who like to stand out.",
    notes: {
      top: "Citrus, Green Notes",
      middle: "White Flowers, Sandalwood",
      base: "Musk, Woody Amber"
    },
    specifications: [
      "Product Type: Concentrated Oil",
      "Volume: 12ml",
      "Application: Roll-on or Dab",
      "Longevity: Up to 6–8 hours",
      "Ideal For: Men",
      "Packaging: Standard Box & Glass Bottle"
    ],
    category: "attar-oil",
    scent_family: ["woody", "musky", "citrus"],
    occasion: ["daily"],
    intensity: "4-6",
    ideal_for: "male"
  },

  "ameer-oudh": {
    id: "ameer-oudh",
    name: "Ameer Al Oud",
    tagline: "Perfume Attar Oil",
    subtitle: "Concentrated Perfume · 12ml",
    price: 936,
    oldPrice: 1100,
    rating: 4.5,
    reviews: 63,
    images: [
      "../../Images/Products/ameer-oudh/1.webp"
    ],
    description: "Ameer Al Oud combines warm oud accords with a touch of sweetness, making it a versatile daily-wear attar for both men and women.",
    notes: {
      top: "Orange Blossom",
      middle: "Oud, Rose",
      base: "Musk, Vanilla"
    },
    specifications: [
      "Product Type: Concentrated Perfume / Attar Oil",
      "Volume: 12ml",
      "Application: Roll-on or Dab",
      "Longevity: Up to 6–8 hours",
      "Ideal For: Unisex",
      "Packaging: Standard Box & Glass Bottle"
    ],
    category: "attar-oil",
    scent_family: ["floral", "woody"],
    occasion: ["daily", "evening"],
    intensity: "4-6",
    ideal_for: "unisex"
  },

  "black-n-gold": {
    id: "black-n-gold",
    name: "Black N Gold",
    tagline: "Premium Attar · Smell Like a Sultan",
    subtitle: "Concentrated Perfume · 12ml",
    price: 2500,
    oldPrice: 2800,
    rating: 5,
    reviews: 119,
    images: [
      "../../Images/Products/black-n-gold/1.webp"
    ],
    description: "Black N Gold is a rich, regal fragrance built around deep amber and warm spice — designed for those who wear luxury boldly.",
    notes: {
      top: "Saffron, Cinnamon",
      middle: "Amber, Oud",
      base: "Musk, Sandalwood"
    },
    specifications: [
      "Product Type: Concentrated Perfume / Attar Oil",
      "Volume: 12ml",
      "Application: Roll-on or Dab",
      "Longevity: Up to 8–10 hours",
      "Ideal For: Men",
      "Packaging: Luxury Velvet Box & Glass Bottle"
    ],
    category: "attar-oil",
    scent_family: ["musky", "woody"],
    occasion: ["special", "evening"],
    intensity: "8+",
    ideal_for: "male"
  },

  "mysterious-oudh": {
    id: "mysterious-oudh",
    name: "Mysterious Oudh",
    tagline: "Premium Attar · Rich Masculine Scent",
    subtitle: "Concentrated Perfume · 12ml",
    price: 1600,
    oldPrice: 1900,
    rating: 5,
    reviews: 95,
    images: [
      "../../Images/Products/mysterious-oudh/1.webp"
    ],
    description: "Mysterious Oudh is a dark, smoky fragrance combining aged oud with deep patchouli — an intense scent for confident personalities.",
    notes: {
      top: "Black Pepper, Bergamot",
      middle: "Oud, Patchouli",
      base: "Musk, Leather"
    },
    specifications: [
      "Product Type: Concentrated Perfume / Attar Oil",
      "Volume: 12ml",
      "Application: Roll-on or Dab",
      "Longevity: Up to 8–10 hours",
      "Ideal For: Men",
      "Packaging: Luxury Box & Glass Bottle"
    ],
    category: "attar-oil",
    scent_family: ["woody", "musky"],
    occasion: ["evening", "special"],
    intensity: "8+",
    ideal_for: "male"
  }

};

// Helper: get related products (excludes current, same category, max 4)
function getRelatedProducts(currentId, count = 4) {
  const current = products[currentId];
  if (!current) return [];

  const others = Object.values(products).filter(p => p.id !== currentId);

  const sameCategory = others.filter(p => p.category === current.category);
  const different = others.filter(p => p.category !== current.category);

  const pool = [...sameCategory, ...different];

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}