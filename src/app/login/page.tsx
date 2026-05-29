"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    async function verifySession() {
      try {
        const response = await fetch("/api/auth/me", { credentials: 'same-origin' });
        if (response.ok) {
          router.replace("/");
          return;
        }
      } catch {
        // ignore network errors until user submits the form
      }
      setSessionChecked(true);
    }
    verifySession();
  }, [router]);

  const emailError = useMemo(() => {
    if (!email) return "El correo es obligatorio.";
    if (!isValidEmail(email)) return "Introduce un correo válido.";
    return null;
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return "La contraseña es obligatoria.";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    return null;
  }, [password]);

  const canSubmit = !busy && !emailError && !passwordError;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "No se pudo iniciar sesión.");
        return;
      }

      router.replace("/");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Error desconocido al iniciar sesión."
      );
    } finally {
      setBusy(false);
    }
  }

  if (!sessionChecked) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-200 via-fuchsia-200 to-violet-200 flex items-center justify-center px-4 py-8">
        <p className="rounded-3xl border border-white/20 bg-white/90 p-8 text-center text-slate-700 shadow-2xl shadow-fuchsia-500/10">
          Verificando sesión…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-200 via-fuchsia-200 to-violet-200 flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-white/20 bg-white/90 p-8 shadow-2xl shadow-fuchsia-500/10 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-pink-500 text-3xl text-white shadow-xl shadow-pink-500/30">
            🍬
          </div>
          <h1 className="text-3xl font-bold text-slate-950">Accede a SweetStock</h1>
          <p className="mt-2 text-sm text-slate-600">
            Ingresa tus credenciales para ver el inventario y la configuración.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Correo electrónico</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              aria-invalid={Boolean(emailError)}
              aria-describedby="login-email-error"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
              placeholder="usuario@dominio.com"
              required
            />
            {emailError ? (
              <p id="login-email-error" className="mt-2 text-sm text-red-600">
                {emailError}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Contraseña</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                aria-invalid={Boolean(passwordError)}
                aria-describedby="login-password-error"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-32 text-slate-900 outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
                placeholder="Escribe tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 mr-2 flex items-center rounded-2xl px-3 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {passwordError ? (
              <p id="login-password-error" className="mt-2 text-sm text-red-600">
                {passwordError}
              </p>
            ) : null}
          </label>

          {error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-fuchsia-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-fuchsia-400"
          >
            {busy ? "Validando…" : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Credenciales de prueba</p>
          <p className="mt-1">Correo: <span className="font-mono">admin@sweetstock.com</span></p>
          <p>Contraseña: <span className="font-mono">admin123</span></p>
        </div>
      </section>
    </main>
  );
}
