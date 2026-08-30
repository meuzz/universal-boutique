import { Link } from "react-router-dom";

export default function Confirmation() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-5 text-3xl">
        ✓
      </div>
      <h1 className="text-2xl font-heading font-medium mb-3">
        Votre commande a été reçue
      </h1>
      <p className="text-gray-500 mb-8">
        Merci pour votre confiance ! Nous vous contacterons rapidement pour confirmer
        la livraison. Si la fenêtre WhatsApp ne s'est pas ouverte automatiquement,
        vous pouvez nous écrire directement.
      </p>
      <Link
        to="/catalogue"
        className="inline-block bg-primary text-white px-6 py-3 rounded-md font-medium"
      >
        Continuer mes achats
      </Link>
    </div>
  );
}
