import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import { useSEO } from "../lib/useSEO.js";

// Icones dessinees en SVG (pas d'emoji) : elles s'affichent pareil sur tous les telephones
const ICONES = {
  "electronique-high-tech": ["M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z", "M11 18h2"],
  "maison-cuisine": ["M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"],
  "accessoires-auto": ["M3 13l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5v4h-2", "M5 17H3v-4h18", "M9 17h6", "M7 15a2 2 0 1 0 0 4a2 2 0 1 0 0-4z", "M17 15a2 2 0 1 0 0 4a2 2 0 1 0 0-4z"],
  "accessoires-moto": ["M5 13.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z", "M19 13.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z", "M5 17l4-6h6l4 6", "M14 6h3l2 5", "M9 11l-1-3H6"],
  "beaute-soins": ["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z", "M19 16v4", "M17 18h4"],
  "mode-accessoires": ["M20.4 5.6L16 3a4 4 0 0 1-8 0L3.6 5.6a1 1 0 0 0-.5 1.2l1.1 3.4a1 1 0 0 0 1.2.6L7 10.4V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9.6l1.6.4a1 1 0 0 0 1.2-.6l1.1-3.4a1 1 0 0 0-.5-1.2z"],
  "solaire-energie": ["M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z", "M12 2v2", "M12 20v2", "M4.9 4.9l1.4 1.4", "M17.7 17.7l1.4 1.4", "M2 12h2", "M20 12h2", "M4.9 19.1l1.4-1.4", "M17.7 6.3l1.4-1.4"],
  "outils-bricolage": ["M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"],
  "bebe-enfants": ["M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"],
  "vie-quotidienne": ["M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z", "M3 6h18", "M16 10a4 4 0 0 1-8 0"],
};
const ICONE_DEFAUT = ICONES["vie-quotidienne"];

function Icone({ chemins, className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {chemins.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

const AVANTAGES = [
  { titre: "Livraison au S\u00e9n\u00e9gal", texte: "Livraison rapide \u00e0 Dakar et dans les autres r\u00e9gions." },
  { titre: "Paiement \u00e0 la livraison", texte: "Payez en esp\u00e8ces ou par mobile money \u00e0 la r\u00e9ception." },
  { titre: "Support WhatsApp", texte: "Une question ? \u00c9crivez-nous directement sur WhatsApp." },
  { titre: "Large choix", texte: "Des produits pour toute la maison et le quotidien." },
];

const TEMOIGNAGES = [
  { nom: "Awa D.", ville: "Dakar", texte: "Commande re\u00e7ue rapidement, produit conforme \u00e0 la description." },
  { nom: "Moussa S.", ville: "Thi\u00e8s", texte: "Tr\u00e8s bon service, r\u00e9ponse rapide sur WhatsApp." },
  { nom: "Fatou N.", ville: "Rufisque", texte: "Prix corrects et livraison sans probl\u00e8me." },
];

const TXT = {
  sousTitre: "\u00c9lectronique, maison, mode, auto, moto, beaut\u00e9, solaire et bien plus \u2014 tout ce dont vous avez besoin, livr\u00e9 au S\u00e9n\u00e9gal.",
  categories: "Nos cat\u00e9gories",
  chargementCat: "Chargement des cat\u00e9gories...",
  erreurCat: "Impossible de charger les cat\u00e9gories : ",
  populaires: "Produits populaires",
  videPopulaires: "Les produits populaires s'afficheront ici bient\u00f4t.",
  nouveautes: "Nouveaut\u00e9s",
  videNouveautes: "Les nouveaux produits appara\u00eetront ici bient\u00f4t.",
  voirTout: "Voir tout le catalogue \u2192",
  promotions: "Nos promotions",
  videPromos: "Nos prochaines promotions seront affich\u00e9es ici.",
  pourquoi: "Pourquoi choisir Universal Boutique ?",
  avis: "Ce que disent nos clients",
  tiret: " \u2014 ",
  guilOuv: "\u00ab ",
  guilFer: " \u00bb",
};

function formatPrix(v) {
  return Number(v).toLocaleString("fr-FR") + " FCFA";
}

function CarteProduit({ p }) {
  const photo = Array.isArray(p.photos) && p.photos.length > 0 ? p.photos[0] : null;
  return (
    <Link
      to={`/produit/${p.slug}`}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
    >
      <div className="bg-gray-50 h-40 flex items-center justify-center relative text-gray-300">
        {photo ? (
          <img src={photo} alt={p.nom} loading="lazy" className="w-full h-full object-contain p-2" />
        ) : (
          <Icone chemins={ICONE_DEFAUT} className="w-10 h-10" />
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
    titre: "Boutique g\u00e9n\u00e9raliste au S\u00e9n\u00e9gal",
    description: "Universal Boutique : \u00e9lectronique, maison, mode, auto, moto, beaut\u00e9, solaire et plus. Livraison au S\u00e9n\u00e9gal, commande facile par WhatsApp.",
  });

  const [categories, setCategories] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    async function chargerCategories() {
      // Promotions et Nouveautes sont exclues de la grille : elles ont leur propre section
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
      {/* Banniere avec le logo en fond */}
      <section
        className="relative bg-primary text-white overflow-hidden"
        style={{
          backgroundImage: "url('/fond-accueil.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
        }}
      >
        {/* Voile sombre sur telephone pour garder le texte lisible */}
        <div className="absolute inset-0 bg-primary/70 md:bg-transparent"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-28 text-center md:text-left">
          <div className="md:max-w-xl">
            <h1 className="font-heading text-3xl md:text-5xl font-semibold mb-4">
              Universal Boutique
            </h1>
            <p className="text-lg text-gray-200 mb-6">{TXT.sousTitre}</p>
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
        <h2 className="text-2xl font-heading font-medium mb-6 text-center">{TXT.categories}</h2>

        {chargement && <p className="text-center text-gray-400">{TXT.chargementCat}</p>}

        {erreur && (
          <p className="text-center text-red-500">
            {TXT.erreurCat}
            {erreur}
          </p>
        )}

        {!chargement && !erreur && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalogue?categorie=${cat.slug}`}
                className="group bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3 group-hover:bg-accent group-hover:text-white transition">
                  <Icone chemins={ICONES[cat.slug] || ICONE_DEFAUT} />
                </div>
                <div className="text-sm font-medium text-gray-700">{cat.nom}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-heading font-medium mb-6 text-center">{TXT.populaires}</h2>
          <GrilleProduits produits={populaires} messageVide={TXT.videPopulaires} />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-heading font-medium mb-6 text-center">{TXT.nouveautes}</h2>
        <GrilleProduits produits={nouveautes} messageVide={TXT.videNouveautes} />
        <div className="text-center mt-8">
          <Link to="/catalogue" className="text-accent font-medium hover:underline">
            {TXT.voirTout}
          </Link>
        </div>
      </section>

      <section className="bg-primary-dark py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-heading font-medium mb-6 text-white text-center">{TXT.promotions}</h2>
          <GrilleProduits produits={promotions} messageVide={TXT.videPromos} sombre />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-heading font-medium mb-8 text-center">{TXT.pourquoi}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {AVANTAGES.map((a) => (
            <div key={a.titre} className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
                <Icone chemins={["M20 6L9 17l-5-5"]} className="w-6 h-6" />
              </div>
              <p className="font-medium text-sm mb-1">{a.titre}</p>
              <p className="text-xs text-gray-500">{a.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-heading font-medium mb-8 text-center">{TXT.avis}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TEMOIGNAGES.map((t) => (
              <div key={t.nom} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600 italic mb-3">
                  {TXT.guilOuv}
                  {t.texte}
                  {TXT.guilFer}
                </p>
                <p className="text-sm font-medium">
                  {t.nom}
                  {TXT.tiret}
                  <span className="text-gray-400 font-normal">{t.ville}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
