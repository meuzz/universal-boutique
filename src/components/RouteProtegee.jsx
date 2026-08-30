import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";

export default function RouteProtegee({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: ecouteur } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => ecouteur.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <p className="text-center text-gray-400 py-16">Vérification de la connexion...</p>;
  }

  if (!session) {
    return <Navigate to="/admin/connexion" replace />;
  }

  return children;
}
