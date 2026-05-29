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

export default function AdminAuditPage() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSales() {
      setLoading(true);
      setError(null);
      try {
        const [year, monthNumber] = month.split('-').map(Number);
        const from = new Date(year, monthNumber - 1, 1).toISOString();
        const to = new Date(year, monthNumber, 0, 23, 59, 59, 999).toISOString();
        const res = await fetch(`/api/sales/history?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
        if (!res.ok) throw new Error('No se pudo cargar el historial de ventas.');
        const data = await res.json();
        setSales(data ?? []);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    loadSales();
  }, [month]);

  const totalSales = useMemo(() => sales.reduce((sum, sale) => sum + sale.total, 0), [sales]);

  return (
    <main className="p-6">
      <div className="rounded-3xl border border-pink-200 bg-white/90 p-6 shadow-lg shadow-pink-200/50">
        <h1 className="text-3xl font-bold text-slate-950 mb-3">Administración — Auditoría</h1>
        <p className="text-slate-600 mb-4">Selecciona un mes para revisar las ventas y la trazabilidad del negocio.</p>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="text-sm font-semibold text-slate-700">Mes</label>
          <input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : null}

        {loading ? (
          <div>Cargando audit logs…</div>
        ) : sales.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
            No hay registros de ventas para el período seleccionado.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 text-sm text-slate-600">Total vendido en el mes: <strong>${totalSales.toLocaleString('es-CO')}</strong></div>
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Vendido por</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-4 py-3">{new Date(sale.sold_at).toLocaleString('es-CO')}</td>
                    <td className="px-4 py-3">{sale.product_name}</td>
                    <td className="px-4 py-3 capitalize">{sale.sold_by}</td>
                    <td className="px-4 py-3">{sale.quantity}</td>
                    <td className="px-4 py-3">${sale.total.toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
