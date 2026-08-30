import { useSEO } from "../lib/useSEO.js";

export default function APropos() {
  useSEO({
    titre: "À propos",
    description: "Universal Boutique est une boutique généraliste en ligne au Sénégal, proposant électronique, maison, mode, auto, moto, beauté, solaire et plus.",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-heading font-medium mb-4">À propos de Universal Boutique</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        Universal Boutique est une boutique généraliste en ligne pensée pour le Sénégal.
        Nous proposons une large gamme de produits — électronique, maison et cuisine,
        accessoires auto et moto, beauté, mode, solaire et énergie, outils, produits pour
        bébé et articles du quotidien — pour vous simplifier la vie, le tout à portée de main.
      </p>
      <p className="text-gray-600 leading-relaxed">
        Nos commandes sont simples : parcourez le catalogue, ajoutez vos produits au panier,
        renseignez vos informations, et confirmez votre commande. Nous vous contactons ensuite
        rapidement par WhatsApp pour organiser la livraison.
      </p>
    </div>
  );
}
