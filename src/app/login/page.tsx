import React from "react";
import { getSystemConfig } from "@/lib/db/seedReader";

export default function LoginPage() {
  const config = getSystemConfig();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 to-purple-100 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md border-t-4 border-pink-300 p-6">
        <div className="flex items-center gap-4 mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <circle cx="12" cy="12" r="10" fill="#FFE6F0" />
            <path d="M8 12c1-2 6-2 7 0 0 0-2 3-3 3s-4-3-4-3z" fill="#FF69B4" />
          </svg>
          <h1 className="text-2xl font-extrabold">SweetStock 🍬</h1>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Accede con la cuenta admin del seed para inicializar el sistema.
        </p>

        <form className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Correo</span>
            <input name="email" type="email" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Contraseña</span>
            <input name="password" type="password" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
          </label>

          <button className="w-full bg-pink-500 text-white py-2 rounded-md font-semibold">Iniciar sesión</button>
        </form>

        <p className="mt-4 text-xs text-gray-500">Umbral actual de stock: {config.low_stock_threshold} unidades</p>
      </div>
    </main>
  );
}
