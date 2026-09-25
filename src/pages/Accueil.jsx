import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import { useSEO } from "../lib/useSEO.js";

const EMOJIS = {
  "electronique-high-tech": "ðŸ“±",
  "maison-cuisine": "ðŸ³",
  "accessoires-auto": "ðŸš—",
  "accessoires-moto": "ðŸï¸",
  "beaute-soins": "ðŸ’„",
  "mode-accessoires": "ðŸ‘—",
  "solaire-energie": "â˜€ï¸",
  "outils-bricolage": "ðŸ› ï¸",
  "bebe-enfants": "ðŸ¼",
  "vie-quotidienne": "ðŸ§´",
  promotions: "ðŸ·ï¸",
  nouveautes: "âœ¨",
};

const AVANTAGES = [
  { titre: "Livraison au SÃ©nÃ©gal", texte: "Livraison rapide Ã  Dakar et dans les autres rÃ©gions." },
  { titre: "Paiement Ã  la livraison", texte: "Payez en espÃ¨ces ou par mobile money Ã  la rÃ©ception." },
  { titre: "Support WhatsApp", texte: "Une question ? Ã‰crivez-nous directement sur WhatsApp." },
  { titre: "Large choix", texte: "Des produits pour toute la maison et le quotidien." },
];

const TEMOIGNAGES = [
  { nom: "Awa D.", ville: "Dakar", texte: "Commande reÃ§ue rapidement, produit conforme Ã  la description." },
  { nom: "Moussa S.", ville: "ThiÃ¨s", texte: "TrÃ¨s bon service, rÃ©ponse rapide sur WhatsApp." },
  { nom: "Fatou N.", ville: "Rufisque", texte: "Prix corrects et livraison sans problÃ¨me." },
];

function formatPrix(v) {
  return Number(v).toLocaleString("fr-FR") + " FCFA";
}

// Carte produit avec photo (mÃªme style que le catalogue)
function CarteProduit({ p }) {
  const photo = Array.isArray(p.photos) && p.photos.length > 0 ? p.photos[0] : null;
  return (
    <Link
      to={`/produit/${p.slug}`}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
    >
      <div className="bg-gray-50 h-40 flex items-center justify-center text-3xl relative">
        {photo ? (
          <img src={photo} alt={p.nom} loading="lazy" className="w-full h-full object-contain p-2" />
        ) : (
          <span>ðŸ›ï¸</span>
        )}
        {p.est_nouveau && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded">
            Nouveau
          </span>
        )}
        {p.est_promo && (
          <span className="absolute top-2 right-2 bg-success text-white text-xs px-2 py-0.5 rounded">
            Promo
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-700 truncate">{p.nom}</p>
        {p.prix_promo ? (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-accent font-medium text-sm">{formatPrix(p.prix_promo)}</span>
            <span className="text-gray-400 text-xs line-through">{formatPrix(p.prix)}</span>
          </div>
        ) : (
          <p className="text-accent font-medium text-sm mt-1">{formatPrix(p.prix)}</p>
        )}
      </div>
    </Link>
  );
}

function GrilleProduits({ produits, messageVide, sombre = false }) {
  if (produits.length === 0) {
    return (
      <p className={`text-center ${sombre ? "text-gray-200" : "text-gray-500"}`}>{messageVide}</p>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {produits.map((p) => (
        <CarteProduit key={p.id} p={p} />
      ))}
    </div>
  );
}

export default function Accueil() {
  useSEO({
    titre: "Boutique gÃ©nÃ©raliste au SÃ©nÃ©gal",
    description: "Universal Boutique : Ã©lectronique, maison, mode, auto, moto, beautÃ©, solaire et plus. Livraison au SÃ©nÃ©gal, commande facile par WhatsApp.",
  });

  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    async function chargerCategories() {
      // On exclut Promotions et NouveautÃ©s de la grille de catÃ©gories :
      // elles sont dÃ©jÃ  mises en avant plus bas sur la page.
      const { data, error } = await supabase
        .from("categories")
        .select("nom, slug, image, ordre")
        .not("slug", "in", '("promotions","nouveautes")')
        .order("ordre", { ascending: true });

      if (error) {
        setErreur(error.message);
      } else {
        setCategories(data);
      }
      setChargement(false);
    }

    async function chargerProduits() {
      const { data } = await supabase
        .from("produits")
        .select("id, nom, slug, prix, prix_promo, photos, est_nouveau, est_populaire, est_promo, created_at")
        .eq("actif", true)
        .order("created_at", { ascending: false });
      if (data) setProduits(data);
    }

    chargerCategories();
    chargerProduits();
  }, []);

  const populaires = produits.filter((p) => p.est_populaire).slice(0, 8);
  const nouveautes = produits.filter((p) => p.est_nouveau).slice(0, 8);
  const promotions = produits.filter((p) => p.est_promo || p.prix_promo).slice(0, 8);

  return (
    <div>
      {/* BanniÃ¨re avec le logo en fond */}
      <section
        className="relative bg-primary text-white overflow-hidden"
        style={{
          backgroundImage: "url('/fond-accueil.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
        }}
      >
        {/* Voile sombre sur tÃ©lÃ©phone pour que le texte reste lisible */}
        <div className="absolute inset-0 bg-primary/70 md:bg-transparent"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-28 text-center md:text-left">
          <div className="md:max-w-xl">
            <h1 className="font-heading text-3xl md:text-5xl font-semibold mb-4">
              Universal Boutique
            </h1>
            <p className="text-lg text-gray-200 mb-6">
              Ã‰lectronique, maison, mode, auto, moto, beautÃ©, solaire et bien plus â€”
              tout ce dont vous avez besoin, livrÃ© au SÃ©nÃ©gal.
            </p>
            <Link
              to="/catalogue"
              className="inline-block bg-accent px-6 py-3 rounded-md font-medium hover:bg-accent-dark transition"
            >
              Commander maintenant
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-heading font-medium mb-6 text-center">
          Nos catÃ©gories
        </h2>

        {chargement && (
          <p className="text-center text-gray-400">Chargement des catÃ©gories...</p>
        )}

        {erreur && (
          <p className="text-center text-red-500">
            Impossible de charger les catÃ©gories : {erreur}
          </p>
        )}

        {!chargement && !erreur && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalogue?categorie=${cat.slug}`}
                className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className="text-3xl mb-2">{EMOJIS[cat.slug] || "ðŸ›ï¸"}</div>
                <div className="text-sm font-medium text-gray-700">{cat.nom}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-heading font-medium mb-6 text-center">
            Produits populaires
          </h2>
          <GrilleProduits
            produits={populaires}
            messageVide="Les produits populaires s'afficheront ici bientÃ´t."
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-heading font-medium mb-6 text-center">
          NouveautÃ©s
        </h2>
        <GrilleProduits
          produits={nouveautes}
          messageVide="Les nouveaux produits apparaÃ®tront ici bientÃ´t."
        />
        <div className="text-center mt-8">
          <Link to="/catalogue" className="text-accent font-medium hover:underline">
            Voir tout le catalogue â†’
          </Link>
        </div>
      </section>

      <section className="bg-primary-dark py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-heading font-medium mb-6 text-white text-center">
            Nos promotions
          </h2>
          <GrilleProduits
            produits={promotions}
            messageVide="Nos prochaines promotions seront affichÃ©es ici."
            sombre
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-heading font-medium mb-8 text-center">
          Pourquoi choisir Universal Boutique ?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {AVANTAGES.map((a) => (
            <div key={a.titre} className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3 font-heading font-semibold">
                âœ“
              </div>
              <p className="font-medium text-sm mb-1">{a.titre}</p>
              <p className="text-xs text-gray-500">{a.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-heading font-medium mb-8 text-center">
            Ce que disent nos clients
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TEMOIGNAGES.map((t) => (
              <div key={t.nom} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600 italic mb-3">Â« {t.texte} Â»</p>
                <p className="text-sm font-medium">{t.nom} â€” <span className="text-gray-400 font-normal">{t.ville}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
