import React from 'react';
import Link from 'next/link';
import { getProducts, getSystemConfig } from '@/lib/db/seedReader';
import LowStockAlert from '@/components/LowStockAlert/LowStockAlert';
import SeedModeBanner from '@/components/SeedModeBanner/SeedModeBanner';

export default function InventoryPage(){
  const products = getProducts();
  const config = getSystemConfig();

  const low = products.filter(p => p.is_active && p.current_stock <= config.low_stock_threshold).map(p => p.name);

  return (
    <main className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Inventario</h1>
          <p className="text-sm text-slate-600">Revisa tu catálogo y controla el stock antes de abrir la dulcería.</p>
        </div>
        <Link
          href="/inventory/new"
          className="inline-flex items-center justify-center rounded-2xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700"
        >
          Agregar producto
        </Link>
      </div>
      <SeedModeBanner />
      <LowStockAlert items={low} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.filter(p => p.is_active).map(prod => (
          <article key={prod.id} className="p-4 border rounded-md shadow-sm">
            <h2 className="font-semibold">{prod.name}</h2>
            <p className="text-sm text-gray-600">Precio: ${prod.price.toLocaleString('es-CO')}</p>
            <p className="text-sm">Stock: {prod.current_stock}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
