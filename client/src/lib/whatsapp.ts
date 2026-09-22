export const WHATSAPP_PHONE = "5511944558043";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function whatsappInterest(model: string) {
  return whatsappLink(`Olá! Tenho interesse no ${model} e gostaria de mais informações.`);
}

export function whatsappQuote() {
  return whatsappLink("Olá! Gostaria de fazer um orçamento.");
}
