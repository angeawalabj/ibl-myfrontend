// services/api.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "react-hot-toast"; // Optionnel: pour afficher des erreurs utilisateurs

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15s timeout
});

// Intercepteur pour ajouter token auth (ex: JWT stocké en localStorage ou cookie)
api.interceptors.request.use(
  (config) => {
    // Exemple récupération token dans localStorage (adapter selon ta gestion auth)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      // On crée un type pour data (partiel)
      type ErrorResponseData = {
        detail?: string;
      };

      const data = error.response.data as ErrorResponseData;

      // Gestion d'erreurs communes
      if (status === 401) {
        toast.error("Session expirée, veuillez vous reconnecter.");
      } else if (status === 403) {
        toast.error("Accès refusé.");
      } else if (status >= 500) {
        toast.error("Erreur serveur, veuillez réessayer plus tard.");
      } else if (data.detail) {
        toast.error(data.detail);
      } else {
        toast.error("Une erreur inconnue est survenue.");
      }
    } else if (error.request) {
      toast.error("Impossible de contacter le serveur.");
    } else {
      toast.error("Erreur lors de la requête.");
    }

    return Promise.reject(error);
  }
);


export default api;
