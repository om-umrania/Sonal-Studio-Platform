import { WA } from "@/lib/whatsapp";

export type GalleryCategory =
  | "All"
  | "Fashion"
  | "Blouses"
  | "Lehengas"
  | "Gowns"
  | "Wedding Essentials"
  | "Pooja Thalis"
  | "Kalash Decor"
  | "Festive Decor"
  | "Styling Ideas";

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  occasion: string[];
  description: string;
  image: string;
  alternateImages?: string[];
  tags: string[];
  whatsappMessage: string;
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "bridal-blouse-gold-embroidery",
    title: "Bridal Blouse with Gold Embroidery",
    category: "Blouses",
    occasion: ["Wedding", "Engagement"],
    description:
      "A rich bridal blouse featuring hand-embroidered gold detailing, crafted to complement a traditional lehenga or saree.",
    image: "/images/photo-2022-10-13-18-16-31.jpg",
    tags: ["Bridal", "Gold", "Embroidery", "Custom"],
    whatsappMessage: WA.galleryInquiry("Bridal Blouse with Gold Embroidery"),
  },
  {
    id: "festive-blouse-mirror-work",
    title: "Festive Blouse with Mirror Work",
    category: "Blouses",
    occasion: ["Festivals", "Family functions"],
    description:
      "A vibrant festive blouse with intricate mirror work and colourful thread detailing — perfect for Navratri, Diwali, or any special occasion.",
    image: "/images/photo-2022-10-13-18-18-40.jpg",
    tags: ["Festive", "Mirror work", "Colourful", "Custom"],
    whatsappMessage: WA.galleryInquiry("Festive Blouse with Mirror Work"),
  },
  {
    id: "lehenga-bridal-edit",
    title: "Bridal Lehenga Styling",
    category: "Lehengas",
    occasion: ["Wedding", "Engagement", "Reception"],
    description:
      "A beautifully crafted lehenga ensemble with coordinated dupatta and blouse — designed for the modern Indian bride.",
    image: "/images/photo-2024-04-19-14-57-43.jpg",
    tags: ["Bridal", "Lehenga", "Custom", "Wedding"],
    whatsappMessage: WA.galleryInquiry("Bridal Lehenga Styling"),
  },
  {
    id: "pooja-thali-handmade",
    title: "Handcrafted Pooja Thali",
    category: "Pooja Thalis",
    occasion: ["Pooja", "Wedding ceremony", "Griha Pravesh"],
    description:
      "A decorated pooja thali handcrafted with flowers, diyas, kumkum, and traditional elements — ready for any ceremony.",
    image: "/images/photo-2026-02-22-12-24-45.jpg",
    tags: ["Handmade", "Pooja", "Ritual", "Ceremony"],
    whatsappMessage: WA.galleryInquiry("Handcrafted Pooja Thali"),
  },
  {
    id: "kalash-decor",
    title: "Decorated Kalash Set",
    category: "Kalash Decor",
    occasion: ["Pooja", "Wedding ceremony", "Mehendi", "Haldi"],
    description:
      "Beautifully decorated kalash with flower work, mango leaves, and traditional embellishments — a centrepiece for any ceremony.",
    image: "/images/photo-2026-02-22-17-39-01.jpg",
    tags: ["Kalash", "Handmade", "Ceremony", "Decor"],
    whatsappMessage: WA.galleryInquiry("Decorated Kalash Set"),
  },
  {
    id: "party-wear-gown",
    title: "Contemporary Party Wear Gown",
    category: "Gowns",
    occasion: ["Reception", "Engagement", "Parties"],
    description:
      "A contemporary Indian gown blending traditional fabric with modern silhouette — ideal for reception, engagement, or special evenings.",
    image: "/images/photo-2025-01-13-10-39-06.jpg",
    tags: ["Gown", "Party wear", "Modern", "Custom"],
    whatsappMessage: WA.galleryInquiry("Contemporary Party Wear Gown"),
  },
  {
    id: "festive-outfit-navratri",
    title: "Festive Navratri Outfit",
    category: "Fashion",
    occasion: ["Navratri", "Festivals", "Garba"],
    description:
      "A vibrant festive outfit designed for Navratri — with colourful embroidery, flared silhouette, and festive detailing.",
    image: "/images/photo-2023-08-27-19-09-32.jpg",
    tags: ["Navratri", "Festive", "Colourful", "Custom"],
    whatsappMessage: WA.galleryInquiry("Festive Navratri Outfit"),
  },
  {
    id: "anarkali-festive",
    title: "Festive Anarkali Suit",
    category: "Fashion",
    occasion: ["Festivals", "Family functions", "Weddings"],
    description:
      "A flowing anarkali suit with rich fabric and border detailing — elegant for weddings, family functions, and festivals.",
    image: "/images/photo-2024-12-28-15-55-11.jpg",
    tags: ["Anarkali", "Festive", "Elegant", "Custom"],
    whatsappMessage: WA.galleryInquiry("Festive Anarkali Suit"),
  },
  {
    id: "wedding-essentials-kit",
    title: "Bridal Welcome Kit",
    category: "Wedding Essentials",
    occasion: ["Wedding ceremony", "Mehendi"],
    description:
      "A curated handmade welcome kit for the bride — featuring decorated items, ritual accessories, and personalised elements.",
    image: "/images/photo-2024-04-18-14-33-01.jpg",
    tags: ["Bridal", "Handmade", "Kit", "Wedding"],
    whatsappMessage: WA.galleryInquiry("Bridal Welcome Kit"),
  },
  {
    id: "festive-decor-arrangement",
    title: "Festive Decor Arrangement",
    category: "Festive Decor",
    occasion: ["Diwali", "Navratri", "Pooja", "Festivals"],
    description:
      "A handmade festive decor arrangement with diyas, flowers, and traditional elements — perfect for home ceremonies and celebrations.",
    image: "/images/photo-2024-05-26-23-59-34.jpg",
    tags: ["Decor", "Festive", "Handmade", "Diwali"],
    whatsappMessage: WA.galleryInquiry("Festive Decor Arrangement"),
  },
  {
    id: "sharara-set-occasion",
    title: "Occasion Sharara Set",
    category: "Fashion",
    occasion: ["Mehendi", "Engagement", "Family functions"],
    description:
      "A delicately embroidered sharara set with matching blouse — ideal for mehendi, engagement, or any special family occasion.",
    image: "/images/photo-2023-10-11-23-23-58.jpg",
    tags: ["Sharara", "Embroidery", "Occasion", "Custom"],
    whatsappMessage: WA.galleryInquiry("Occasion Sharara Set"),
  },
  {
    id: "celebration-styling-haldi",
    title: "Haldi Celebration Styling",
    category: "Styling Ideas",
    occasion: ["Haldi", "Pre-wedding", "Mehendi"],
    description:
      "A cohesive celebration styling concept for a haldi ceremony — combining yellow tones, floral decor, and handmade details.",
    image: "/images/photo-2024-01-25-15-47-05.jpg",
    tags: ["Haldi", "Styling", "Celebration", "Yellow"],
    whatsappMessage: WA.galleryInquiry("Haldi Celebration Styling"),
  },
];

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "All",
  "Fashion",
  "Blouses",
  "Lehengas",
  "Gowns",
  "Wedding Essentials",
  "Pooja Thalis",
  "Kalash Decor",
  "Festive Decor",
  "Styling Ideas",
];
