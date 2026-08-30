// Remplace ce numéro par le tien, au format international sans le "+"
const NUMERO_WHATSAPP = "221772323309";

export default function BoutonWhatsApp({ message }) {
  const texte = message || "Bonjour Universal Boutique, j'ai une question.";
  const lien = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texte)}`;

  return (
    <a
      href={lien}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 bg-success text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
      aria-label="Contacter sur WhatsApp"
    >
      💬
    </a>
  );
}
