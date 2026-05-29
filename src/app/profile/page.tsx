"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserProfile = {
  name: string;
  email: string;
  role: 'admin' | 'empleado';
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
        if (!res.ok) {
          router.replace('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleLogout() {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? 'No se pudo cerrar sesión.');
      }
      router.replace('/login');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Error desconocido');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="p-6">
      <div className="rounded-3xl border border-pink-200 bg-white/90 p-6 shadow-lg shadow-pink-200/50">
        <h1 className="text-3xl font-bold text-slate-950 mb-3">Perfil</h1>
        {loading ? (
          <p>Cargando perfil…</p>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : user ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Nombre</p>
              <p className="text-lg font-semibold text-slate-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-lg font-semibold text-slate-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Rol</p>
              <p className="text-lg font-semibold capitalize text-slate-900">{user.role}</p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-2xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-fuchsia-400"
            >
              {busy ? 'Cerrando sesión…' : 'Cerrar sesión'}
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
