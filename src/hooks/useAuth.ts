import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    accountNotActivated,
    setUser,
    setTokens,
    logout,
    setLoading,
    setError,
    setAccountNotActivated,
  } = useAuthStore();

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setAccountNotActivated(false);

    try {
      const res = await api.post("/users/login/", { email, password });

      if (res.data.detail === "2FA required.") {
        router.push("/twofa/verify");
        setLoading(false);
        return;
      }

      if (res.data.detail === "Compte non activé." || res.data.detail === "Le compte est déjà activé.") {
        setAccountNotActivated(true);
        setLoading(false);
        return;
      }

      // Assuming the backend returns user data and tokens
      const { access, refresh, user: userData } = res.data;
      setTokens(access, refresh);
      setUser({
        id: userData.id || "unknown", // Provide a fallback if id is missing
        username: userData.username || email.split("@")[0], // Fallback to email prefix
        email,
      });
      setLoading(false);
      router.push("/");
    } catch (e: any) {
      setError(e.response?.data?.detail || "Erreur lors de la connexion");
      setLoading(false);
    }
  };

  // Logout
  const doLogout = () => {
    logout();
    router.push("/login");
  };

  // Resend activation email
  const resendActivationEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/users/activation/request/", { email });
      setLoading(false);
      return res.data.detail;
    } catch (e: any) {
      setError(e.response?.data?.detail || "Erreur lors de l'envoi de l'email");
      setLoading(false);
      throw e;
    }
  };

  // Verify 2FA
  const verifyTwoFA = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/users/2fa/verify/", { token });
      // Assuming the backend returns { access: string, refresh: string, user?: User }
      const { access, refresh, user: userData } = res.data;
      setTokens(access, refresh);
      if (userData) {
        setUser({
          id: userData.id || "unknown",
          username: userData.username || "unknown",
          email: userData.email || "unknown",
        });
      }
      setLoading(false);
      router.push("/"); // Redirect to home or another page after successful 2FA
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
      setLoading(false);
      throw e;
    }
  };

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    accountNotActivated,
    login,
    doLogout,
    resendActivationEmail,
    verifyTwoFA,
  };
}