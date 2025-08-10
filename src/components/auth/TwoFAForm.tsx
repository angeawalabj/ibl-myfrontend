"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/common/Button";

interface TwoFAFormProps {
  onSubmit: (token: string) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

interface FormInputs {
  token: string;
}

export default function TwoFAForm({ onSubmit, loading, error }: TwoFAFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  return (
    <form
      onSubmit={handleSubmit(data => onSubmit(data.token))}
      className="max-w-sm w-full space-y-4"
    >
      <input
        {...register("token", {
          required: "Veuillez saisir le code 2FA",
          minLength: { value: 6, message: "Le code doit contenir 6 chiffres" },
          maxLength: { value: 6, message: "Le code doit contenir 6 chiffres" },
        })}
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="Entrez le code 2FA"
        className="w-full border border-gray-300 rounded px-3 py-2 text-center text-lg font-mono tracking-widest"
      />
      {errors.token && <p className="text-red-600">{errors.token.message}</p>}

      {error && <p className="text-red-600">{error}</p>}

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Vérification..." : "Valider"}
      </Button>
    </form>
  );
}
