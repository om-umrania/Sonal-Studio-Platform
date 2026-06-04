import { GALLERY_ITEMS } from "@/data/gallery";

const headers = [
  "id",
  "title",
  "description",
  "link",
  "image_link",
  "price",
  "availability",
  "condition",
  "brand",
  "google_product_category",
  "product_type",
  "gender",
  "age_group",
  "color",
  "size"
];

function getProductPrice(category: string): string {
  switch (category) {
    case "Lehengas":
      return "14999.00 INR";
    case "Blouses":
      return "2999.00 INR";
    case "Gowns":
      return "8999.00 INR";
    case "Fashion":
      return "4999.00 INR";
    case "Pooja Thalis":
      return "1499.00 INR";
    case "Kalash Decor":
      return "999.00 INR";
    case "Festive Decor":
      return "1999.00 INR";
    case "Wedding Essentials":
      return "2499.00 INR";
    default:
      return "2999.00 INR";
  }
}

function getGoogleProductCategory(category: string): string {
  switch (category) {
    case "Lehengas":
    case "Blouses":
    case "Gowns":
    case "Fashion":
      return "Clothing & Accessories > Clothing"; // Google Category
    default:
      return "Home & Garden > Decor"; // Google Category
  }
}

function getProductColor(title: string): string {
  const lowercaseTitle = title.toLowerCase();
  if (lowercaseTitle.includes("red")) return "Red";
  if (lowercaseTitle.includes("pink")) return "Pink";
  if (lowercaseTitle.includes("gold")) return "Gold";
  if (lowercaseTitle.includes("blue")) return "Blue";
  if (lowercaseTitle.includes("yellow")) return "Yellow";
  if (lowercaseTitle.includes("mirror") || lowercaseTitle.includes("colourful")) return "Multi-color";
  return "Gold"; // default elegant color
}

export async function GET() {
  const domain = "https://sonal-studio-platform.vercel.app";

  const rows = GALLERY_ITEMS.map((item) => {
    const isApparel = ["Lehengas", "Blouses", "Gowns", "Fashion"].includes(item.category);

    const fields = [
      item.id,
      item.title,
      item.description,
      `${domain}/gallery?id=${item.id}`,
      `${domain}${item.image}`,
      getProductPrice(item.category),
      "in_stock",
      "new",
      "Sonal Studio",
      getGoogleProductCategory(item.category),
      item.category,
      isApparel ? "female" : "",
      isApparel ? "adult" : "",
      isApparel ? getProductColor(item.title) : "",
      isApparel ? "Custom" : ""
    ];

    // Escape double quotes and wrap in double quotes to prevent CSV syntax issues
    return fields
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(",");
  });

  const csvContent = [
    headers.join(","),
    ...rows
  ].join("\n");

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "inline; filename=products.csv",
    },
  });
}
