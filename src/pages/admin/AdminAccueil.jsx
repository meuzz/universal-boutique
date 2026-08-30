import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient.js";

export default function AdminAccueil() {
  const navigate = useNavigate();

  async function seDeconnecter() {
    await supabase.auth.signOut();
    navigate("/admin/connexion");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-medium">Administration</h1>
        <button onClick={seDeconnecter} className="text-sm text-red-500 underline">
          Se déconnecter
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          to="/admin/produits"
          className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >
          <p className="font-medium mb-1">Produits</p>
          <p className="text-sm text-gray-500">Ajouter, modifier, supprimer vos produits.</p>
        </Link>
        <Link
          to="/admin/categories"
          className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >
          <p className="font-medium mb-1">Catégories</p>
          <p className="text-sm text-gray-500">Gérer vos catégories de produits.</p>
        </Link>
        <Link
          to="/admin/commandes"
          className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >
          <p className="font-medium mb-1">Commandes</p>
          <p className="text-sm text-gray-500">Voir et suivre les commandes reçues.</p>
        </Link>
      </div>
    </div>
  );
}
