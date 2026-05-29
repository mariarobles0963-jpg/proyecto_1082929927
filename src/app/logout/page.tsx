"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Cerrando sesión…");

  useEffect(() => {
    async function logout() {
      try {
        const response = await fetch("/api/auth/logout", { method: "POST" });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data?.error ?? "No se pudo cerrar sesión.");
        }
      } catch {
        // Ignorar, siempre redirigimos a login
      } finally {
        router.replace("/login");
      }
    }
    logout();
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-fuchsia-200 to-violet-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/90 p-8 shadow-2xl shadow-fuchsia-500/10 backdrop-blur-xl text-center">
        <p className="text-lg font-semibold text-slate-900">{status}</p>
        <p className="mt-3 text-sm text-slate-600">Será redirigido a la pantalla de acceso en unos instantes.</p>
      </div>
    </main>
  );
}
