"use client";

import { type FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, current_stock: stock }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'No se pudo crear el producto.');
      } else {
        setMessage(`Producto creado: ${data.name}`);
        setTimeout(() => router.push('/inventory'), 1200);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Error desconocido');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="p-6">
      <div className="rounded-3xl border border-pink-200 bg-white/90 p-6 shadow-lg shadow-pink-200/50">
        <h1 className="text-3xl font-bold text-slate-950 mb-3">Agregar producto</h1>
        <p className="text-slate-600 mb-6">Crea un nuevo producto disponible para venta e inventario.</p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="space-y-2">
            <span className="block text-sm font-semibold text-slate-700">Nombre del producto</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
            />
          </label>

          <label className="space-y-2">
            <span className="block text-sm font-semibold text-slate-700">Precio unitario</span>
            <input
              type="number"
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
              min={0}
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
            />
          </label>

          <label className="space-y-2">
            <span className="block text-sm font-semibold text-slate-700">Stock inicial</span>
            <input
              type="number"
              value={stock}
              onChange={(event) => setStock(Number(event.target.value))}
              min={1}
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          {message ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center rounded-2xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-fuchsia-400"
          >
            {busy ? 'Creando…' : 'Agregar producto'}
          </button>
        </form>
      </div>
    </main>
  );
}
