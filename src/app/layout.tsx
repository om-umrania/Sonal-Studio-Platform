import type { Metadata } from "next";
import { Italiana, Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const italiana = Italiana({
  weight: "400",
  variable: "--font-italiana",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sonal Studio — Celebration Styling & Wedding Consultation",
    template: "%s | Sonal Studio",
  },
  description:
    "Sonal Studio is a Nagpur-based creative studio for celebration styling, wedding consultation, custom fashion, festive decor and handcrafted ritual essentials.",
  keywords: [
    "Sonal Studio Nagpur",
    "celebration styling Nagpur",
    "wedding consultation Nagpur",
    "custom blouse Nagpur",
    "custom lehenga Nagpur",
    "pooja thali handmade Nagpur",
    "kalash decor Nagpur",
    "wedding essentials Nagpur",
    "festive decor Nagpur",
  ],
  openGraph: {
    siteName: "Sonal Studio",
    locale: "en_IN",
    type: "website",
  },
  verification: {
    google: "YsSLyMg2AiRQVXe0mqTfp5JKGDM-Z9MhwWwcWGFV1D8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${italiana.variable} ${cormorant.variable} ${manrope.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
