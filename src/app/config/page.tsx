import React from 'react';
import { getSystemConfig, getProducts } from '@/lib/db/seedReader';

export default function ConfigPage(){
  const config = getSystemConfig();
  const products = getProducts();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>
      <p>Umbral actual: <strong>{config.low_stock_threshold}</strong> unidades</p>

      <div className="mt-4">
        <label className="block">Probar umbral (preview):</label>
        <input defaultValue={config.low_stock_threshold} className="mt-2 p-2 border rounded" />
        <p className="mt-2 text-sm text-gray-600">Productos que quedarían en alerta con este umbral: {products.filter(p => p.current_stock <= config.low_stock_threshold).length}</p>
      </div>
    </main>
  );
}
