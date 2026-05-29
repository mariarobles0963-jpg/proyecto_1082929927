"use client";

import { useEffect, useMemo, useState } from 'react';

interface SystemConfig {
  low_stock_threshold: number;
}

interface Product {
  id: string;
  name: string;
  current_stock: number;
  is_active: boolean;
}

export default function ConfigPage() {
  const [currentThreshold, setCurrentThreshold] = useState(5);
  const [previewThreshold, setPreviewThreshold] = useState(5);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<string>('Cargando configuración...');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [configRes, productsRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/products'),
        ]);

        if (!configRes.ok) throw new Error('No se pudo cargar la configuración.');
        if (!productsRes.ok) throw new Error('No se pudo cargar los productos.');

        const configData = await configRes.json();
        const productsData = await productsRes.json();

        setCurrentThreshold(configData.config.low_stock_threshold);
        setPreviewThreshold(configData.config.low_stock_threshold);
        setProducts(productsData.products ?? []);
        setStatus('Configuración cargada.');
      } catch (caught) {
        const message = caught instanceof Error ? caught.message : 'Error desconocido';
        setError(message);
        setStatus('Error al cargar la configuración.');
      }
    }

    load();
  }, []);

  const previewCount = useMemo(
    () => products.filter((product) => product.is_active && product.current_stock <= previewThreshold).length,
    [products, previewThreshold]
  );

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ low_stock_threshold: previewThreshold }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || 'No se pudo guardar el umbral.');
      }

      const updated = await response.json();
      setCurrentThreshold(updated.config.low_stock_threshold);
      setStatus('Umbral guardado correctamente.');
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Error desconocido';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-6">
      <div className="max-w-3xl rounded-3xl border border-pink-200 bg-white/90 p-6 shadow-lg shadow-pink-200/50">
        <h1 className="text-3xl font-bold text-slate-950 mb-3">Configuración</h1>
        <p className="mb-5 text-slate-600">Ajusta el umbral de stock bajo y verifica cuántos productos entrarían en alerta antes de guardar.</p>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Umbral actual</p>
            <p className="text-2xl font-semibold text-slate-900">{currentThreshold} unidades</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <label className="block text-sm font-semibold text-slate-700">Probar umbral</label>
            <input
              type="number"
              value={previewThreshold}
              onChange={(event) => setPreviewThreshold(Number(event.target.value))}
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
              min={0}
            />
            <p className="mt-3 text-sm text-slate-600">Con este valor, {previewCount} producto(s) quedarían en alerta.</p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-2xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-fuchsia-400"
          >
            {saving ? 'Guardando…' : 'Guardar umbral'}
          </button>

          <p className="text-sm text-slate-500">{status}</p>
        </div>
      </div>
    </main>
  );
}
