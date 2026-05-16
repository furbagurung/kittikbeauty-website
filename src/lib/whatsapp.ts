const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "9779810162527";

export function createWhatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buyNowMessage(productName: string) {
  return `Hi, I want to buy ${productName}.`;
}

export function askProductMessage(productName: string) {
  return `Hi, I want to ask about ${productName}.`;
}
