"use client";

import React from "react";

export default function SocialLoginButtons() {
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google"; // adapter à ta route d'auth social
  };

  const handleFacebookLogin = () => {
    window.location.href = "/api/auth/facebook"; // adapter à ta route d'auth social
  };

  return (
    <div className="max-w-md mx-auto mt-6 flex justify-center gap-4">
      <button
        onClick={handleGoogleLogin}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        aria-label="Se connecter avec Google"
      >
        Google
      </button>

      <button
        onClick={handleFacebookLogin}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        aria-label="Se connecter avec Facebook"
      >
        Facebook
      </button>
    </div>
  );
}
