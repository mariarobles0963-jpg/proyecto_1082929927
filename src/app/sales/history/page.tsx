"use client";

import { useEffect, useMemo, useState } from 'react';

type SaleRecord = {
  id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total: number;
  sold_by: string;
  sold_at: string;
};

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSales() {
      try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
        const res = await fetch(`/api/sales/history?from=${encodeURIComponent(start)}&to=${encodeURIComponent(end)}`);
        if (!res.ok) throw new Error('No se pudo cargar el historial de ventas.');
        const data = await res.json();
        setSales(data);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    loadSales();
  }, []);

  const total = useMemo(() => sales.reduce((sum, sale) => sum + sale.total, 0), [sales]);

  return (
    <main className="p-6">
      <div className="rounded-3xl border border-pink-200 bg-white/90 p-6 shadow-lg shadow-pink-200/50">
        <h1 className="text-3xl font-bold text-slate-950 mb-3">Historial de Ventas</h1>
        <p className="text-slate-600 mb-6">Ventas del mes actual. Si no hay registros, comenzaremos a registrar ventas ahora.</p>

        {loading ? (
          <div>Cargando historial…</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : sales.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">No hay ventas registradas hoy. ¡Que comience el día! 🧁</div>
        ) : (
          <>
            <div className="mb-4 text-sm text-slate-600">Total del período: <strong>${total.toLocaleString('es-CO')}</strong></div>
            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Cantidad</th>
                    <th className="px-4 py-3">Precio unitario</th>
                    <th className="px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-4 py-3">{new Date(sale.sold_at).toLocaleString('es-CO')}</td>
                      <td className="px-4 py-3">{sale.product_name}</td>
                      <td className="px-4 py-3">{sale.quantity}</td>
                      <td className="px-4 py-3">${sale.unit_price.toLocaleString('es-CO')}</td>
                      <td className="px-4 py-3">${sale.total.toLocaleString('es-CO')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
