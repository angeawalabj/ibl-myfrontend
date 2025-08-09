"use client";
import { useState } from "react";
import Link from "next/link";

export default function ServiceDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="text-sm font-medium text-text">Explorer</button>
      {open && (
        <div className="absolute top-full left-0 bg-white border border-border shadow-md p-2 rounded-md z-10">
          <Link href="/services/assurances" className="block px-4 py-2 hover:bg-gray-100">Assurances</Link>
          <Link href="/services/transport" className="block px-4 py-2 hover:bg-gray-100">Transport</Link>
          <Link href="/services/hotels" className="block px-4 py-2 hover:bg-gray-100">Hôtels</Link>
          {/* Ajouter d'autres services ici */}
        </div>
      )}
    </div>
  );
}
