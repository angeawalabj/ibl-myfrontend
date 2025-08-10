import { create } from "zustand";

// Define a specific type for the user
interface User {
  id: string;
  username: string;
  email: string;
  // Add other user properties as needed
}

// Define the AuthState interface with explicit types
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  accountNotActivated: boolean;
  setUser: (user: User | null) => void;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAccountNotActivated: (val: boolean) => void;
}

// Create the store with typed set function
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  accountNotActivated: false,

  setUser: (user) => set({ user }),
  setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      accountNotActivated: false,
      error: null,
    }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setAccountNotActivated: (val) => set({ accountNotActivated: val }),
}));