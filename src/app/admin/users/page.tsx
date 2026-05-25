import React from 'react';
import { getUsers } from '@/lib/db/seedReader';

export default function AdminUsersPage(){
  const users = getUsers();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administración — Usuarios</h1>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left">
            <th className="p-2">Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="text-sm text-blue-600">Activar/Suspender</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
