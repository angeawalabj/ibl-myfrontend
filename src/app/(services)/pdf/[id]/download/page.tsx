"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePdfApi } from "../../hooks/usePdfApi";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

interface DownloadPageProps {
  params: { id: string };
}

export default function PdfDownloadPage({ params }: DownloadPageProps) {
  const { id } = params;
  const router = useRouter();

  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    documentMeta,
    fetchDocumentMeta,
    error: apiError,
    setError: setApiError,
    requestDownloadToken,
  } = usePdfApi(id);

  useEffect(() => {
    fetchDocumentMeta();
  }, [fetchDocumentMeta]);

  const handleRequestDownloadToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestDownloadToken();
      setDownloadToken(res.token);
      setExpiresAt(res.expires_at);
    } catch (e: any) {
      setError(e.message || "Erreur lors de la génération du token de téléchargement");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!downloadToken) return;
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/pdf/download/${downloadToken}/`;
    window.open(url, "_blank");
  };

  if (error || apiError)
    return (
      <div className="max-w-4xl mx-auto p-4">
        <ErrorMessage message={error || apiError || ""} />
        <button
          onClick={() => {
            setError(null);
            setApiError(null);
            router.refresh();
          }}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Réessayer
        </button>
      </div>
    );

  if (!documentMeta)
    return (
      <div className="max-w-4xl mx-auto p-4 text-center text-gray-600">
        <Loading />
        <p>Chargement des informations du document...</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Télécharger : {documentMeta.title}</h1>
      <p className="mb-6">{documentMeta.description}</p>

      {!downloadToken ? (
        <button
          onClick={handleRequestDownloadToken}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Génération du lien..." : "Obtenir le lien de téléchargement"}
        </button>
      ) : (
        <div>
          <p className="mb-4 text-green-700">Lien valide jusqu’au : {new Date(expiresAt!).toLocaleString()}</p>
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Télécharger maintenant
          </button>
        </div>
      )}
    </div>
  );
}
