import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import { useSEO } from "../lib/useSEO.js";

const NUMERO_WHATSAPP = "221772323309";

export default function ProduitDetail() {
  const { slug } = useParams();
  const [produit, setProduit] = useState(null);
  const [photoActive, setPhotoActive] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useSEO({
    titre: produit?.nom || "Produit",
    description: produit?.description || "Découvrez ce produit sur Universal Boutique, livré au Sénégal.",
  });

  useEffect(() => {
    async function chargerProduit() {
      setChargement(true);
      setErreur(null);
      const { data, error } = await supabase
        .from("produits")
        .select("*, categories(nom, slug)")
        .eq("slug", slug)
        .eq("actif", true)
        .single();

      if (error) setErreur("Produit introuvable.");
      else setProduit(data);
      setChargement(false);
    }
    chargerProduit();
  }, [slug]);

  function ajouterAuPanier() {
    const panier = JSON.parse(localStorage.getItem("panier") || "[]");
    const existant = panier.find((item) => item.id === produit.id);
    if (existant) {
      existant.quantite += quantite;
    } else {
      panier.push({
        id: produit.id,
        nom: produit.nom,
        slug: produit.slug,
        prix: produit.prix_promo || produit.prix,
        quantite,
      });
    }
    localStorage.setItem("panier", JSON.stringify(panier));
    alert("Produit ajouté au panier.");
  }

  function commanderSurWhatsApp() {
    const prix = produit.prix_promo || produit.prix;
    const texte = `Bonjour, je souhaite commander : ${produit.nom} (quantité : ${quantite}) - ${(prix * quantite).toLocaleString()} FCFA`;
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texte)}`, "_blank");
  }

  if (chargement) {
    return <p className="text-center text-gray-400 py-16">Chargement du produit...</p>;
  }

  if (erreur || !produit) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-3">{erreur || "Produit introuvable."}</p>
        <Link to="/catalogue" className="text-primary underline text-sm">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const photos = produit.photos && produit.photos.length > 0 ? produit.photos : null;
  const enStock = produit.stock > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <div className="bg-gray-50 rounded-xl h-72 md:h-96 flex items-center justify-center text-6xl overflow-hidden">
          {photos ? (
            <img src={photos[photoActive]} alt={`${produit.nom} — Universal Boutique`} className="w-full h-full object-cover" />
          ) : (
            "🛍️"
          )}
        </div>
        {photos && photos.length > 1 && (
          <div className="flex gap-2 mt-3">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setPhotoActive(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  i === photoActive ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {produit.categories && (
          <Link
            to={`/catalogue?categorie=${produit.categories.slug}`}
            className="text-xs text-accent font-medium uppercase"
          >
            {produit.categories.nom}
          </Link>
        )}
        <h1 className="text-2xl font-heading font-semibold mt-1 mb-3">{produit.nom}</h1>

        <div className="flex items-center gap-3 mb-4">
          {produit.prix_promo ? (
            <>
              <span className="text-2xl font-semibold text-primary">
                {produit.prix_promo.toLocaleString()} FCFA
              </span>
              <span className="text-gray-400 line-through">
                {produit.prix.toLocaleString()} FCFA
              </span>
            </>
          ) : (
            <span className="text-2xl font-semibold text-primary">
              {produit.prix.toLocaleString()} FCFA
            </span>
          )}
        </div>

        <p className={`text-sm font-medium mb-4 ${enStock ? "text-success" : "text-red-500"}`}>
          {enStock ? "En stock" : "Rupture de stock"}
        </p>

        {produit.description && (
          <p className="text-gray-600 text-sm mb-4">{produit.description}</p>
        )}

        {produit.caracteristiques && (
          <div className="mb-6">
            <p className="font-medium text-sm mb-1">Caractéristiques</p>
            <p className="text-gray-600 text-sm whitespace-pre-line">{produit.caracteristiques}</p>
          </div>
        )}

        {enStock && (
          <div className="flex items-center gap-3 mb-5">
            <label className="text-sm text-gray-600">Quantité</label>
            <div className="flex items-center border border-gray-200 rounded-md">
              <button
                onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-gray-600"
              >
                −
              </button>
              <span className="px-3 text-sm">{quantite}</span>
              <button
                onClick={() => setQuantite((q) => Math.min(produit.stock, q + 1))}
                className="px-3 py-1 text-gray-600"
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={ajouterAuPanier}
            disabled={!enStock}
            className="flex-1 bg-primary text-white py-3 rounded-md font-medium disabled:opacity-40"
          >
            Ajouter au panier
          </button>
          <button
            onClick={commanderSurWhatsApp}
            disabled={!enStock}
            className="flex-1 bg-success text-white py-3 rounded-md font-medium disabled:opacity-40"
          >
            Commander sur WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
