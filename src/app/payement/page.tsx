"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type PaymentMethod = "paypal" | "mobile_money" | "bank";

const paymentMethodFields: Record<
  PaymentMethod,
  { label: string; placeholder: string; type?: string }[]
> = {
  paypal: [{ label: "Email PayPal", placeholder: "exemple@paypal.com", type: "email" }],
  mobile_money: [{ label: "Numéro Mobile Money", placeholder: "229 99 999 999" }],
  bank: [{ label: "Référence bancaire", placeholder: "IBAN ou numéro", type: "text" }],
};

export default function PayementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupération des query params
  const amountParam = searchParams.get("amount");
  const currencyParam = searchParams.get("currency");
  const redirect_url = searchParams.get("redirect_url")?.trim() || "";

  const amount = amountParam ? Number(amountParam) : null;
  const currency = currencyParam || "XOF";

  // États
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<null | any>(null);

  // Reset formValues à chaque changement de méthode
  useEffect(() => {
    const fields = paymentMethodFields[paymentMethod];
    const initVals: Record<string, string> = {};
    fields.forEach(({ label }) => (initVals[label] = ""));
    setFormValues(initVals);
  }, [paymentMethod]);

  const handleChange = (label: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [label]: value }));
  };

  const validateForm = (): boolean => {
    const fields = paymentMethodFields[paymentMethod];
    for (const { label } of fields) {
      if (!formValues[label] || formValues[label].trim() === "") {
        setError(`Le champ "${label}" est requis.`);
        return false;
      }
    }
    if (!amount || amount <= 0) {
      setError("Montant invalide.");
      return false;
    }
    if (!redirect_url) {
      setError("Le paramètre redirect_url est manquant ou invalide.");
      return false;
    }
    if (!redirect_url.startsWith("/")) {
      setError("L'URL de redirection doit être un chemin relatif commençant par '/'.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const payload = {
      payment_method: paymentMethod,
      payment_contact: formValues[paymentMethodFields[paymentMethod][0].label],
      amount: amount.toString(),
      currency,
    };

    console.log("Payload envoyé au backend :", payload);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/payements/simulate-payment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erreur backend :", data);
        throw new Error(data.message || "Erreur lors de la simulation");
      }

      // Extraire les données du sous-objet 'data'
      const paymentData = data.data;

      // Vérification des données renvoyées par le backend
      if (
        !paymentData ||
        !paymentData.payment_id ||
        !paymentData.status ||
        !paymentData.amount ||
        !paymentData.currency ||
        !paymentData.payment_method
      ) {
        console.error("Données incomplètes :", data);
        throw new Error("Réponse du backend incomplète");
      }

      console.log("Réponse backend OK :", paymentData);
      setPaymentSuccessData(paymentData);
      setLoading(false);
      // Pas de redirection automatique ici, attendre le clic sur "OK"
    } catch (err: any) {
      console.error("Erreur front ou réseau :", err);
      setError(err.message || "Erreur inconnue");
      setLoading(false);
    }
  };

  if (amount === null) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <p className="text-red-600 font-semibold">Montant invalide ou manquant dans l'URL.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-10 animate-fadeIn">
        <h1 className="text-2xl font-semibold mb-6 text-center text-indigo-700">Simuler un paiement</h1>

        {/* Montant et devise non modifiables */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Montant</label>
          <input
            type="number"
            value={amount}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-200 cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Devise</label>
          <input
            type="text"
            value={currency}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Choix méthode de paiement */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Méthode de paiement</label>
          <div className="flex gap-4">
            {(Object.keys(paymentMethodFields) as PaymentMethod[]).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                  paymentMethod === method
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-200"
                }`}
              >
                {method === "paypal"
                  ? "PayPal"
                  : method === "mobile_money"
                  ? "Mobile Money"
                  : "Virement bancaire"}
              </button>
            ))}
          </div>
        </div>

        {/* Champs dynamiques selon méthode */}
        <div className="mb-6 space-y-4">
          {paymentMethodFields[paymentMethod].map(({ label, placeholder, type }, idx) => (
            <div key={idx}>
              <label className="block font-medium mb-1">{label}</label>
              <input
                type={type || "text"}
                placeholder={placeholder}
                value={formValues[label] || ""}
                onChange={(e) => handleChange(label, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Traitement..." : "Payer maintenant"}
        </button>

        {paymentSuccessData && (
          <div className="bg-green-100 border border-green-400 p-6 rounded mt-6 text-center shadow">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Paiement simulé avec succès !</h2>
            <p><strong>Référence :</strong> {paymentSuccessData.payment_id}</p>
            <p><strong>Montant :</strong> {paymentSuccessData.amount} {paymentSuccessData.currency}</p>
            <p><strong>Méthode :</strong> {paymentSuccessData.payment_method}</p>
            <button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              onClick={() => {
                const cleanRedirectUrl = redirect_url.trim().replace(/^\/+/, "/");
                const redirectUrl = `${cleanRedirectUrl}?payment_id=${encodeURIComponent(
                  paymentSuccessData.payment_id
                )}&status=${encodeURIComponent(paymentSuccessData.status)}&amount=${encodeURIComponent(
                  paymentSuccessData.amount
                )}&currency=${encodeURIComponent(
                  paymentSuccessData.currency
                )}&payment_method=${encodeURIComponent(paymentSuccessData.payment_method)}`;
                console.log("URL de redirection depuis modal :", redirectUrl);
                router.push(redirectUrl);
              }}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
