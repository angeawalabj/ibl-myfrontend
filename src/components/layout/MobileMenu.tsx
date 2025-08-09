"use client";

import Link from "next/link";

export default function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="md:hidden mt-2 space-y-2 px-4 pb-4 bg-white shadow-sm border-t animate-slide-down">
      <Link href="/ecommerce" onClick={onClose} className="block text-sm font-medium text-gray-700">E-commerce</Link>
      <Link href="/bibliotheque" onClick={onClose} className="block text-sm font-medium text-gray-700">Bibliothèque</Link>
      <Link href="/sante" onClick={onClose} className="block text-sm font-medium text-gray-700">Santé</Link>
      <Link href="/services" onClick={onClose} className="block text-sm font-medium text-gray-700">Services</Link>
      <Link href="/formations" onClick={onClose} className="block text-sm font-medium text-gray-700">Formations</Link>
    </div>
  );
}
