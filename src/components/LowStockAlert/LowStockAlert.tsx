import React from 'react';

export default function LowStockAlert({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-md mb-4">
      <strong className="text-orange-700">Productos con stock bajo:</strong>
      <ul className="mt-2 list-disc list-inside text-sm text-orange-800">
        {items.map((n) => (<li key={n}>{n}</li>))}
      </ul>
    </div>
  );
}
