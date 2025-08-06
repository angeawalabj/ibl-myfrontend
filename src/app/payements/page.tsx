"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

type PaymentMethod = "paypal" | "mobile_money" | "credit_card"

interface PaymentData {
  payment_method: PaymentMethod
  payment_contact: string
  amount: number
  currency: string
}

const paymentMethodFields: Record<
  PaymentMethod,
  { label: string; placeholder: string; type?: string }[]
> = {
  paypal: [{ label: "Email PayPal", placeholder: "exemple@paypal.com", type: "email" }],
  mobile_money: [{ label: "Numéro Mobile Money", placeholder: "229 99 999 999" }],
  credit_card: [
    { label: "Numéro de carte", placeholder: "1234 5678 9012 3456", type: "text" },
    { label: "Date d'expiration", placeholder: "MM/AA", type: "text" },
    { label: "CVV", placeholder: "123", type: "password" },
  ],
}

export default function PaiementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect_url = searchParams.get("redirect_url") || ""

  // Form state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal")
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [amount, setAmount] = useState<number>(5000)
  const [currency, setCurrency] = useState<string>("XOF")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update form values when payment method changes (reset)
  useEffect(() => {
    const fields = paymentMethodFields[paymentMethod]
    const initVals: Record<string, string> = {}
    fields.forEach(({ label }) => (initVals[label] = ""))
    setFormValues(initVals)
  }, [paymentMethod])

  const handleChange = (label: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [label]: value }))
  }

  const validateForm = (): boolean => {
    const fields = paymentMethodFields[paymentMethod]
    for (const { label } of fields) {
      if (!formValues[label] || formValues[label].trim() === "") {
        setError(`Le champ "${label}" est requis.`)
        return false
      }
    }
    if (!amount || amount <= 0) {
      setError("Le montant doit être supérieur à 0.")
      return false
    }
    if (!redirect_url) {
      setError("Le paramètre redirect_url est manquant.")
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      const payload = {
        payment_method: paymentMethod,
        payment_contact: formValues[paymentMethodFields[paymentMethod][0].label],
        amount,
        currency,
      }
      const res = await fetch("/api/payements/simulate-payment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Erreur lors de la simulation")
      }

      const data = await res.json()
      const paymentId = data.data.payment_id
      const status = data.data.status

      // Redirection vers l'URL fournie avec query params
      const url = new URL(redirect_url)
      url.searchParams.set("payment_id", paymentId)
      url.searchParams.set("status", status)

      window.location.href = url.toString()
    } catch (err: any) {
      setError(err.message || "Erreur inconnue")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-10 animate-fadeIn">
        <h1 className="text-2xl font-semibold mb-6 text-center text-indigo-700">Simuler un paiement</h1>

        {/* Montant et devise */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Montant</label>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-6">
          <label className="block font-medium mb-1">Devise</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="XOF">XOF</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        {/* Choix méthode paiement */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Méthode de paiement</label>
          <div className="flex gap-4">
            {(["paypal", "mobile_money", "credit_card"] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors duration-300
                  ${
                    paymentMethod === method
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-indigo-200"
                  }`}
              >
                {method === "paypal"
                  ? "PayPal"
                  : method === "mobile_money"
                  ? "Mobile Money"
                  : "Carte bancaire"}
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
      </div>
    </main>
  )
}
