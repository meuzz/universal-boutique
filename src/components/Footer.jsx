import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="font-heading font-semibold text-lg mb-2">
            Universal <span className="text-accent">Boutique</span>
          </p>
          <p className="text-gray-300">
            Votre boutique généraliste au Sénégal : électronique, maison, mode,
            auto, moto, beauté et plus encore.
          </p>
        </div>
        <div>
          <p className="font-medium mb-2">Liens utiles</p>
          <ul className="space-y-1.5 text-gray-300">
            <li><Link to="/catalogue" className="hover:text-white">Catalogue</Link></li>
            <li><Link to="/a-propos" className="hover:text-white">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-medium mb-2">Catégories</p>
          <ul className="space-y-1.5 text-gray-300">
            <li><Link to="/catalogue?categorie=electronique-high-tech" className="hover:text-white">Électronique</Link></li>
            <li><Link to="/catalogue?categorie=maison-cuisine" className="hover:text-white">Maison & Cuisine</Link></li>
            <li><Link to="/catalogue?categorie=solaire-energie" className="hover:text-white">Solaire & Énergie</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-medium mb-2">Contact</p>
          <p className="text-gray-300">WhatsApp : +221 77 232 33 09</p>
          <p className="text-gray-300 mt-1">Dakar, Sénégal</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-4 border-t border-white/10">
        © {new Date().getFullYear()} Universal Boutique. Tous droits réservés.
      </div>
    </footer>
  );
}
