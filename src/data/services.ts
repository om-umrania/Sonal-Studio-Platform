import { whatsappLink } from "@/lib/whatsapp";

export type Service = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  shortDescription: string;
  includes: string[];
  occasions: string[];
  image: string;
  whatsappMessage: string;
  boundary?: string;
};

export const SERVICES: Service[] = [
  {
    id: "celebration-styling",
    title: "Celebration Styling",
    shortTitle: "Celebration Styling",
    description:
      "Thoughtful visual coordination for weddings, festivals, poojas, and family functions — bringing together outfits, decor, colour themes, and handmade details into a cohesive, personal celebration.",
    shortDescription:
      "Visual coordination across outfits, decor, and handmade details for your celebration.",
    includes: [
      "Colour and theme suggestions",
      "Family function styling ideas",
      "Festive setup coordination",
      "Outfit and accessory direction",
      "Handmade detail planning",
      "Visual mood and coordination guidance",
    ],
    occasions: ["Weddings", "Mehndi", "Haldi", "Diwali", "Navratri", "Poojas", "Family functions"],
    image: "/images/photo-2024-04-19-14-57-43.jpg",
    whatsappMessage: whatsappLink(
      "Hi Sonal Studio! I'd like to discuss celebration styling for my event. Can we connect?"
    ),
  },
  {
    id: "wedding-consultation",
    title: "Wedding Consultation",
    shortTitle: "Wedding Consultation",
    description:
      "Personalised guidance to help families plan and prepare the beautiful details that make a wedding feel meaningful — from ceremony-wise outfit suggestions to ritual item checklists and decor ideas.",
    shortDescription:
      "Guidance on outfits, ritual items, decor, and ceremony-wise preparation for your wedding.",
    includes: [
      "Ceremony-wise preparation discussion",
      "Outfit and accessory suggestions",
      "Ritual item checklist guidance",
      "Decor and gifting ideas",
      "Handmade and customisation direction",
      "Coordination suggestions for family looks",
    ],
    occasions: ["Engagement", "Mehendi", "Haldi", "Wedding ceremony", "Reception", "Post-wedding functions"],
    image: "/images/photo-2025-01-13-10-39-06.jpg",
    whatsappMessage: whatsappLink(
      "Hi Sonal Studio! I'd like to discuss wedding consultation for my upcoming wedding. Can we connect?"
    ),
    boundary:
      "This is creative consultation and styling guidance, not full event management unless discussed separately.",
  },
  {
    id: "custom-fashion",
    title: "Custom Fashion",
    shortTitle: "Custom Fashion",
    description:
      "Custom-made outfits crafted with care — from bridal blouses with detailed embroidery to lehengas, gowns, anarkali suits and occasion wear. Every piece is made to fit your style, occasion, and measurements.",
    shortDescription:
      "Custom blouses, lehengas, gowns, and occasion wear crafted to your exact requirements.",
    includes: [
      "Custom blouses (bridal, festive, casual)",
      "Lehengas and skirts",
      "Gowns and party wear",
      "Anarkali suits",
      "Sharara sets",
      "Embroidery, lace, mirror work, and borders",
      "Sleeve and neckline customisation",
    ],
    occasions: ["Weddings", "Engagements", "Festivals", "Parties", "Family functions", "Casual occasions"],
    image: "/images/photo-2022-10-13-18-16-31.jpg",
    whatsappMessage: whatsappLink(
      "Hi Sonal Studio! I'm interested in a custom outfit. Can we discuss the details?"
    ),
  },
  {
    id: "wedding-ritual-essentials",
    title: "Wedding & Ritual Essentials",
    shortTitle: "Wedding Essentials",
    description:
      "Beautifully handcrafted pooja thalis, kalash decor, ritual trays, and wedding kits that add warmth and tradition to every ceremony. Each piece is made with care and attention to cultural detail.",
    shortDescription:
      "Handcrafted pooja thalis, kalash decor, ritual trays, and wedding kits for meaningful ceremonies.",
    includes: [
      "Decorated pooja thalis",
      "Kalash and matki decor",
      "Ritual trays and arrangements",
      "Wedding welcome kits",
      "Handmade ceremonial accessories",
      "Festive gifting items",
      "Custom ritual setups on request",
    ],
    occasions: ["Poojas", "Mehendi", "Haldi", "Wedding ceremony", "Griha pravesh", "Festivals", "Engagements"],
    image: "/images/photo-2026-02-22-12-24-45.jpg",
    whatsappMessage: whatsappLink(
      "Hi Sonal Studio! I'm interested in handcrafted wedding essentials — pooja thalis, kalash decor, or ritual items. Can we discuss?"
    ),
  },
];
