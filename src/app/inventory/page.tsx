import React from 'react';
import { getProducts, getSystemConfig } from '@/lib/db/seedReader';
import LowStockAlert from '@/components/LowStockAlert/LowStockAlert';

export default function InventoryPage(){
  const products = getProducts();
  const config = getSystemConfig();

  const low = products.filter(p => p.is_active && p.current_stock <= config.low_stock_threshold).map(p => p.name);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>
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
