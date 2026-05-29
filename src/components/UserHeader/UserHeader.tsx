"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
  role: "admin" | "empleado";
};

export default function UserHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        if (mounted) setUser(data.user ?? null);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? 'No se pudo cerrar sesión');
      }
      router.replace('/login');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return null;

  return (
    <header className="w-full border-b border-slate-100 bg-white/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <a href="/" className="text-lg font-semibold text-slate-900">SweetStock</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-700">
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-slate-500">{user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                disabled={busy}
                className="rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {busy ? 'Cerrando…' : 'Cerrar sesión'}
              </button>
            </div>
          ) : (
            <div>
              <a href="/login" className="rounded-md bg-fuchsia-600 px-3 py-2 text-sm font-medium text-white">Iniciar sesión</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
