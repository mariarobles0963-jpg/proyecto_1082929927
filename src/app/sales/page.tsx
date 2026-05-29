"use client";

import { type FormEvent, useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  current_stock: number;
  price: number;
  is_active: boolean;
};

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products ?? []);
      setSelectedId(data.products?.[0]?.id ?? '');
    }
    loadProducts();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId),
    [products, selectedId]
  );

  const total = selectedProduct ? selectedProduct.price * quantity : 0;
  const stockMessage = selectedProduct
    ? quantity > selectedProduct.current_stock
      ? `Solo quedan ${selectedProduct.current_stock} unidades.`
      : null
    : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    if (!selectedProduct) {
      setError('Selecciona un producto válido.');
      setBusy(false);
      return;
    }

    try {
      const response = await fetch('/api/sales/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProduct.id, quantity, userId: 'admin' }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'No se pudo registrar la venta.');
      } else {
        setMessage(`✓ Venta registrada — $${data.total.toLocaleString('es-CO')}`);
        setQuantity(1);
        setProducts((current) =>
          current.map((product) =>
            product.id === data.product_id
              ? { ...product, current_stock: product.current_stock - data.quantity }
              : product
          )
        );
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
        <h1 className="text-3xl font-bold text-slate-950 mb-3">Ventas</h1>
        <p className="text-slate-600 mb-6">Registra ventas rápidas con stock en tiempo real y total calculado.</p>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <label className="space-y-2">
            <span className="block text-sm font-semibold text-slate-700">Producto</span>
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          {selectedProduct ? (
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Stock disponible: <strong>{selectedProduct.current_stock}</strong></p>
              <p className="text-sm text-slate-600">Precio unitario: <strong>${selectedProduct.price.toLocaleString('es-CO')}</strong></p>
            </div>
          ) : null}

          <label className="space-y-2">
            <span className="block text-sm font-semibold text-slate-700">Cantidad</span>
            <input
              type="number"
              min={1}
              max={selectedProduct?.current_stock ?? 1}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
            />
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Total</p>
            <p className={`text-2xl font-semibold ${stockMessage ? 'text-red-600' : 'text-slate-950'}`}>
              ${total.toLocaleString('es-CO')}
            </p>
            {stockMessage ? <p className="mt-2 text-sm text-red-700">{stockMessage}</p> : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          {message ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
          ) : null}

          <button
            type="submit"
            disabled={busy || Boolean(stockMessage)}
            className="inline-flex items-center justify-center rounded-2xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-fuchsia-400"
          >
            {busy ? 'Registrando…' : 'Registrar venta'}
          </button>
        </form>
      </div>
    </main>
  );
}
