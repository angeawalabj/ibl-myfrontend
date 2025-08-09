import Link from "next/link";
import ServiceDropdown from "./ServiceDropdown";

export default function HeaderNav() {
  return (
    <nav className="flex gap-4 text-sm text-text font-medium">
      <Link href="/ecommerce">E-commerce</Link>
      <Link href="/bibliotheque">Bibliothèque</Link>
      <Link href="/sante">Santé</Link>
      <ServiceDropdown />
      <Link href="/formations">Formations</Link>
    </nav>
  );
}
