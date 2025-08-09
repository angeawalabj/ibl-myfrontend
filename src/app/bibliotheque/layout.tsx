// src/app/bibliotheque/layout.tsx
import type { ReactNode } from "react";
import BibliothequeSubHeader from "@/components/layout/subheaders/BibliothequeSubHeader";

export default function BibliothequeLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <BibliothequeSubHeader />
      <div className="p-4">{children}</div>
    </div>
  );
}
