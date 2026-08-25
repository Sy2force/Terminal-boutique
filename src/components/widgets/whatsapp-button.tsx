import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-70 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-gold hover:shadow-gold transition-all duration-500 hover:scale-105"
      aria-label="Nous contacter sur WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
    </a>
  );
}
