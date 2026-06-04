const WHATSAPP_NUMBER = "918237722348";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA = {
  general: whatsappLink(
    "Hi Sonal Studio! I'd like to know more about your work and services."
  ),
  customFashion: whatsappLink(
    "Hi Sonal Studio! I'm interested in a custom outfit. Can we discuss the details?"
  ),
  weddingEssentials: whatsappLink(
    "Hi Sonal Studio! I'm interested in wedding essentials — pooja thalis, kalash decor, or ritual items. Can we discuss?"
  ),
  consultation: whatsappLink(
    "Hi Sonal Studio! I'd like to discuss celebration styling and wedding consultation for my occasion."
  ),
  celebrationStyling: whatsappLink(
    "Hi Sonal Studio! I'd like to discuss celebration styling for my event. Can we connect?"
  ),
  galleryInquiry: (itemTitle: string) =>
    whatsappLink(
      `Hi Sonal Studio! I liked this piece — "${itemTitle}". Can we discuss something similar for my occasion?`
    ),
};
