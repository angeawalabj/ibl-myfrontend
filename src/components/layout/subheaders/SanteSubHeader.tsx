import SubHeader from "@/components/layout/SubHeader";

const santeLinks = [
  { href: "/sante", label: "Accueil" },
  { href: "/sante/medecins", label: "Médecins" },
  { href: "/sante/pharmacies", label: "Pharmacies" },
  { href: "/sante/rdv", label: "Prendre RDV" },
  { href: "/sante/produits", label: "Produits de santé" },
  { href: "/sante/ordonnances", label: "Mes ordonnances" },
];

export default function SanteSubHeader() {
  return <SubHeader links={santeLinks} activeColorClass="green" />;
}
