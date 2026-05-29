"use client";

import { useEffect, useState } from 'react';

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'empleado';
  isActive: boolean;
  mustChangePassword: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('No se pudieron cargar los usuarios.');
        const data = await res.json();
        setUsers(data.users ?? []);
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : 'Error desconocido';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  async function toggleUserStatus(id: string, active: boolean) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: active }),
      });
      if (!res.ok) throw new Error('No se pudo actualizar el usuario.');
      const data = await res.json();
      setUsers((current) => current.map((user) => (user.id === id ? data.user : user)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Error desconocido');
    }
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-pink-200 bg-white/90 p-6 shadow-lg shadow-pink-200/50">
        <h1 className="text-3xl font-bold text-slate-950">Administración — Usuarios</h1>
        <p className="text-slate-600">Desde aquí el administrador puede activar o suspender usuarios sin afectar las ventas existentes.</p>
      </div>

      {error ? (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div>Cargando usuarios…</div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white/90 shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Rol</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-700">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3">{user.isActive ? 'Activo' : 'Suspendido'}</td>
                  <td className="px-4 py-3">
                    <button
                      className="rounded-2xl bg-fuchsia-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-700"
                      onClick={() => toggleUserStatus(user.id, !user.isActive)}
                    >
                      {user.isActive ? 'Suspender' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
