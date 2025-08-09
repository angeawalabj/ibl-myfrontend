"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import HeaderNav from "./HeaderNav";
import HeaderIcons from "./HeaderIcons";
import MobileMenu from "./MobileMenu";
import HeaderSearch from "./HeaderSearch";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-bg border-b border-border sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          MultiPlateforme
        </Link>

        {/* Barre de recherche (optionnelle) */}
        <div className="hidden lg:block flex-1 mx-6">
          <HeaderSearch />
        </div>

        {/* Navigation desktop */}
        <div className="hidden md:flex gap-6 items-center">
          <HeaderNav />
          <HeaderIcons />
        </div>

        {/* Bouton menu mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-700"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu mobile affiché dynamiquement */}
      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </header>
  );
}
