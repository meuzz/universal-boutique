import { useSEO } from "../lib/useSEO.js";

const NUMERO_WHATSAPP = "221772323309";

export default function Contact() {
  useSEO({
    titre: "Contact",
    description: "Contactez Universal Boutique par WhatsApp ou téléphone pour toute question sur nos produits ou vos commandes.",
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-heading font-medium mb-4">Contactez-nous</h1>
      <p className="text-gray-600 mb-6">
        Une question sur un produit, une commande ou une livraison ?
        Écrivez-nous directement sur WhatsApp, nous répondons rapidement.
      </p>
      <a
        href={`https://wa.me/${NUMERO_WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-success text-white px-6 py-3 rounded-md font-medium"
      >
        Discuter sur WhatsApp
      </a>
      <p className="text-gray-500 text-sm mt-6">Téléphone : +221 77 232 33 09</p>
    </div>
  );
}
