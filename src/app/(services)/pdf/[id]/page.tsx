"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePdfApi } from "../hooks/usePdfApi";
import PdfViewer from "../components/PdfViewer";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default function PdfReadPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();

  // token de type string ou undefined
  const [token, setToken] = useState<string | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [tokenExpiryTimer, setTokenExpiryTimer] = useState<NodeJS.Timeout | null>(null);

  const {
    documentMeta,
    fetchDocumentMeta,
    progress,
    fetchProgress,
    reportProgress,
    requestReadToken,
    error,
    setError,
  } = usePdfApi(id, token);

  // Charger métadonnées + progression au montage
  useEffect(() => {
    fetchDocumentMeta();
    fetchProgress();
  }, [fetchDocumentMeta, fetchProgress]);

  // Demander token lecture quand doc chargé + gérer expiration token
  useEffect(() => {
    if (!documentMeta) return;

    setLoadingToken(true);
    requestReadToken()
      .then((res) => {
        setToken(res.token);
        const url = `${process.env.NEXT_PUBLIC_API_BASE}/pdf/download/${res.token}/`;
        setFileUrl(url);

        // Calculer durée avant expiration
        const expiresAt = new Date(res.expires_at).getTime();
        const now = Date.now();
        const msLeft = expiresAt - now;

        if (msLeft <= 0) {
          setError("Le token d'accès a déjà expiré.");
          setToken(undefined);
          setFileUrl(null);
          return;
        }

        // Nettoyer ancien timer s’il existe
        if (tokenExpiryTimer) clearTimeout(tokenExpiryTimer);

        // Définir un timer pour alerter à l'expiration du token
        const timer = setTimeout(() => {
          alert("Votre session de lecture a expiré. Veuillez recharger la page pour continuer.");
          setToken(undefined);
          setFileUrl(null);
        }, msLeft);

        setTokenExpiryTimer(timer);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingToken(false));

    // Nettoyage timer si le composant est démonté ou documentMeta change
    return () => {
      if (tokenExpiryTimer) clearTimeout(tokenExpiryTimer);
    };
  }, [documentMeta, requestReadToken, setError]);

  // Handler changement page -> rapporter progression
  const handlePageChange = useCallback(
    (page: number) => {
      if (!token) {
        setError("Le token d'accès est expiré. La progression ne peut pas être sauvegardée.");
        return;
      }
      reportProgress(page);
    },
    [reportProgress, token, setError]
  );

  if (error)
    return (
      <div className="max-w-4xl mx-auto p-4">
        <ErrorMessage message={error} />
        <button
          onClick={() => {
            setError(null);
            router.refresh();
          }}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Réessayer
        </button>
      </div>
    );

  if (!documentMeta || loadingToken || !fileUrl)
    return (
      <div className="max-w-4xl mx-auto p-4 text-center text-gray-600">
        <Loading />
        <p>Chargement du document ou attente d'un token valide...</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{documentMeta.title}</h1>
      <p className="mb-4">{documentMeta.description}</p>

      <PdfViewer fileUrl={fileUrl} initialPage={progress} onPageChange={handlePageChange} />

      <div className="mt-6">
        <Link href={`/pdf/${id}/download`} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Télécharger ce document
        </Link>
      </div>
    </div>
  );
}
