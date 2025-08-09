import { useState, useCallback } from "react";

export function usePdfApi(id: string, token?: string) {
  const [documentMeta, setDocumentMeta] = useState<any>(null);
  const [progress, setProgress] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Charger les métadonnées du document
  const fetchDocumentMeta = useCallback(async () => {
    try {
      const res = await fetch(`/api/pdf/${id}/`);
      if (!res.ok) throw new Error("Erreur chargement document");
      const data = await res.json();
      setDocumentMeta(data);
    } catch (e: any) {
      setError(e.message);
    }
  }, [id]);

  // Récupérer la progression
  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch(`/api/pdf/${id}/progress/`);
      if (!res.ok) throw new Error("Erreur récupération progression");
      const data = await res.json();
      setProgress(data.page ?? 1);
    } catch (e: any) {
      setError(e.message);
    }
  }, [id]);

  // Reporter la progression au serveur
  const reportProgress = useCallback(
    async (page: number) => {
      try {
        const res = await fetch(`/api/pdf/${id}/progress/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page }),
        });
        if (!res.ok) throw new Error("Erreur sauvegarde progression");
        setProgress(page);
      } catch (e: any) {
        setError(e.message);
      }
    },
    [id]
  );

  // Demander token de lecture
  const requestReadToken = useCallback(async () => {
    try {
      const res = await fetch(`/api/pdf/${id}/read-url/`, { method: "POST" });
      if (!res.ok) throw new Error("Erreur génération token lecture");
      return await res.json(); // { token: string }
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  }, [id]);

  // **À ajouter : demander token téléchargement**
  const requestDownloadToken = useCallback(async () => {
    try {
      const res = await fetch(`/api/pdf/${id}/download-token/`, { method: "POST" });
      if (!res.ok) throw new Error("Erreur génération token téléchargement");
      return await res.json(); // { token: string, expires_at: string }
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  }, [id]);

  return {
    documentMeta,
    fetchDocumentMeta,
    progress,
    fetchProgress,
    reportProgress,
    requestReadToken,
    requestDownloadToken, // <--- ici on expose la fonction
    error,
    setError,
  };
}
