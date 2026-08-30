import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import BoutonWhatsApp from "./components/BoutonWhatsApp.jsx";
import RouteProtegee from "./components/RouteProtegee.jsx";

import Accueil from "./pages/Accueil.jsx";
import Catalogue from "./pages/Catalogue.jsx";
import ProduitDetail from "./pages/ProduitDetail.jsx";
import Panier from "./pages/Panier.jsx";
import Commande from "./pages/Commande.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import APropos from "./pages/APropos.jsx";
import Contact from "./pages/Contact.jsx";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminAccueil from "./pages/admin/AdminAccueil.jsx";
import AdminProduits from "./pages/admin/AdminProduits.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminCommandes from "./pages/admin/AdminCommandes.jsx";

export default function App() {
  const location = useLocation();
  const estAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col font-body">
      {!estAdmin && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/produit/:slug" element={<ProduitDetail />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/commande" element={<Commande />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/admin/connexion" element={<AdminLogin />} />
          <Route path="/admin" element={<RouteProtegee><AdminAccueil /></RouteProtegee>} />
          <Route path="/admin/produits" element={<RouteProtegee><AdminProduits /></RouteProtegee>} />
          <Route path="/admin/categories" element={<RouteProtegee><AdminCategories /></RouteProtegee>} />
          <Route path="/admin/commandes" element={<RouteProtegee><AdminCommandes /></RouteProtegee>} />
        </Routes>
      </main>
      {!estAdmin && <Footer />}
      {!estAdmin && <BoutonWhatsApp />}
    </div>
  );
}
