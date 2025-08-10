"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import TwoFAForm from "@/components/auth/TwoFAForm";

export default function TwoFAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const { verifyTwoFA, loading, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (token: string) => {
    setError(null);
    try {
      await verifyTwoFA(token);
      router.push(nextUrl); // Redirige vers la page demandée ou la page d'accueil
    } catch (e: any) {
      setError(e.message || "Erreur lors de la vérification 2FA.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-4">
      <h1 className="text-2xl font-bold mb-6">Authentification à deux facteurs (2FA)</h1>
      <TwoFAForm onSubmit={handleSubmit} loading={loading} error={error || authError} />
    </main>
  );
}
