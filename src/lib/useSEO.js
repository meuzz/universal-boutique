import { useEffect } from "react";

const NOM_SITE = "Universal Boutique";

export function useSEO({ titre, description }) {
  useEffect(() => {
    document.title = titre ? `${titre} — ${NOM_SITE}` : NOM_SITE;

    let balise = document.querySelector('meta[name="description"]');
    if (!balise) {
      balise = document.createElement("meta");
      balise.setAttribute("name", "description");
      document.head.appendChild(balise);
    }
    if (description) {
      balise.setAttribute("content", description);
    }
  }, [titre, description]);
}
