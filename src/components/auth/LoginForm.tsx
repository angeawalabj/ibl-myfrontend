"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/common/Button";
import ActivationNotice from "./ActivationNotice";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const { login, loading, error, accountNotActivated } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormInputs) => {
    setServerError(null);
    try {
      await login(data.email, data.password);
    } catch (e: any) {
      setServerError(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-6 p-4">
      <div>
        <label htmlFor="email" className="block font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email", { required: "Email requis" })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block font-medium mb-1">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Mot de passe requis" })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {serverError && <p className="text-red-600">{serverError}</p>}

      {accountNotActivated && (
        <p className="text-yellow-700">
          Votre compte n’est pas encore activé. Vérifiez vos emails ou{" "}
          <ActivationNotice />
        </p>
      )}

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
