import SubHeader from "@/components/layout/SubHeader";

const bibliothequeLinks = [
  { href: "/bibliotheque", label: "Accueil" },
  { href: "/bibliotheque/abonnement", label: "Abonnement" },
  { href: "/bibliotheque/mes-livres", label: "Mes Livres" },
  { href: "/bibliotheque/categorie", label: "Catégories" },
  { href: "/bibliotheque/achat", label: "Acheter" },
  { href: "/bibliotheque/lecture", label: "Lire en ligne" },
];

export default function BibliothequeSubHeader() {
  return <SubHeader links={bibliothequeLinks} activeColorClass="blue" />;
}
