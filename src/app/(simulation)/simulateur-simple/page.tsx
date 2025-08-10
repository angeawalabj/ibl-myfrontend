"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function SimulateurSimplePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
  const returnedAmount = searchParams.get("amount");
  const returnedCurrency = searchParams.get("currency");
  const paymentMethod = searchParams.get("payment_method");

  const [amount, setAmount] = useState<number>(5000);
  const [currency, setCurrency] = useState<string>("XOF");
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const hasProcessedParams = useRef(false); // Pour éviter les re-rendus multiples

  useEffect(() => {
    console.log("Paramètres reçus :", { paymentId, status, returnedAmount, returnedCurrency, paymentMethod });
    console.log("Condition du modal :", {
      isStatusSimulated: status === "simulated",
      hasPaymentId: !!paymentId,
      hasAmount: !!returnedAmount,
      hasCurrency: !!returnedCurrency,
      hasPaymentMethod: !!paymentMethod,
      showModal,
    });

    // Traiter les paramètres uniquement si pas déjà fait
    if (!hasProcessedParams.current && status === "simulated" && paymentId && returnedAmount && returnedCurrency && paymentMethod) {
      console.log("Modal doit s'afficher : showModal défini à true");
      setShowModal(true);
      hasProcessedParams.current = true; // Marquer comme traité
    } else if (!hasProcessedParams.current && status === "simulated") {
      console.log("Erreur : Données de paiement incomplètes");
      setError("Données de paiement incomplètes.");
      hasProcessedParams.current = true;
    } else {
      console.log("Aucun statut 'simulated' détecté ou paramètres déjà traités");
    }
  }, [status, paymentId, returnedAmount, returnedCurrency, paymentMethod]);

  useEffect(() => {
    if (showModal) {
      console.log("Rendu du modal : showModal est true");
    }
  }, [showModal]);

  const handleSubmit = () => {
    if (!amount || amount <= 0) {
      setError("Le montant doit être supérieur à 0.");
      return;
    }
    setError(null);
    setShowModal(false); // Réinitialiser showModal avant redirection
    hasProcessedParams.current = false; // Réinitialiser pour la prochaine redirection

    const redirectUrl = "/simulateur-simple";
    const url = `/payement?amount=${encodeURIComponent(amount)}&currency=${encodeURIComponent(
      currency
    )}&redirect_url=${encodeURIComponent(redirectUrl)}`;
    console.log("URL de redirection vers PayementPage :", url);
    router.push(url);
  };

  const handleCloseModal = () => {
    console.log("Fermeture du modal");
    setShowModal(false);
    hasProcessedParams.current = false; // Réinitialiser pour permettre un nouvel affichage
    router.replace("/simulateur-simple");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 relative">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-green-700 mb-4">🎉 Paiement simulé avec succès !</h2>
            <p><strong>Référence :</strong> {paymentId}</p>
            <p><strong>Montant :</strong> {returnedAmount} {returnedCurrency}</p>
            <p><strong>Méthode :</strong> {paymentMethod}</p>
            <button
              onClick={handleCloseModal}
              className="mt-6 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {!showModal && (
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
          <h1 className="text-xl font-bold mb-4 text-center text-indigo-700">Simulateur rapide</h1>
          <label className="block mb-2 font-medium">Montant</label>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <label className="block mb-2 font-medium">Devise</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          >
            <option value="XOF">XOF</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 transition"
          >
            Aller au paiement
          </button>
        </div>
      )}
    </main>
  );
}
