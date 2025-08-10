"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/common/Button";

export default function ActivationNotice() {
  const { resendActivationEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const handleResend = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      if (!email) {
        setError("Veuillez entrer votre email.");
        setLoading(false);
        return;
      }
      const message = await resendActivationEmail(email);
      setSuccess(message);
    } catch (e: any) {
      setError(e.message || "Erreur lors de l’envoi de l’email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 mr-2"
      />
      <Button onClick={handleResend} disabled={loading}>
        {loading ? "Envoi..." : "Renvoyer email d’activation"}
      </Button>

      {success && <p className="mt-2 text-green-600">{success}</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
