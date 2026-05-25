import React from 'react';
import { getProducts, getUsers, getSystemConfig } from '@/lib/db/seedReader';

export default function DbSetupPage(){
  const users = getUsers();
  const products = getProducts();
  const config = getSystemConfig();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin — DB Setup</h1>
      <p>Aplicará 4 migrations y cargará: 1 usuario admin, la configuración inicial (umbral 5 unidades) y 3 productos demo.</p>

      <section className="mt-6">
        <h2 className="font-semibold">Usuarios</h2>
        <pre className="bg-gray-50 p-3 rounded mt-2">{JSON.stringify(users, null, 2)}</pre>
      </section>

      <section className="mt-4">
        <h2 className="font-semibold">System Config</h2>
        <pre className="bg-gray-50 p-3 rounded mt-2">{JSON.stringify(config, null, 2)}</pre>
      </section>

      <section className="mt-4">
        <h2 className="font-semibold">Productos demo</h2>
        <pre className="bg-gray-50 p-3 rounded mt-2">{JSON.stringify(products, null, 2)}</pre>
      </section>
    </main>
  );
}
