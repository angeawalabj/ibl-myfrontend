// src/app/sante/layout.tsx
import type { ReactNode } from "react";
import SanteSubHeader from "@/components/layout/subheaders/SanteSubHeader";

export default function SanteLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SanteSubHeader />
      <div className="p-4">{children}</div>
    </div>
  );
}
