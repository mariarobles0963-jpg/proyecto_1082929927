import React from 'react';
import Link from 'next/link';

export default function SeedModeBanner(){
  return (
    <div className="bg-pink-50 border-l-4 border-pink-300 p-3 rounded-md mb-4">
      <div className="flex items-center justify-between">
        <div>
          <strong className="text-pink-700">Modo Seed activo</strong>
          <div className="text-sm text-gray-700">Estás en modo demo: el sistema usa `data/seed.json` con 1 admin y 3 productos.</div>
        </div>
        <Link href="/admin/db-setup" className="text-sm text-pink-600">Ver DB setup</Link>
      </div>
    </div>
  );
}
