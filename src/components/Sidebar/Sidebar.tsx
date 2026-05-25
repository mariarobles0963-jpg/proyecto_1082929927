import React from 'react';
import Link from 'next/link';

type Role = 'admin' | 'empleado';

export default function Sidebar({ role = 'empleado' }: { role?: Role }){
  const employeeItems = [
    { href: '/inventory', label: 'Inventario' },
    { href: '/sales', label: 'Ventas' },
    { href: '/sales/history', label: 'Historial' },
    { href: '/profile', label: 'Perfil' },
  ];

  const adminExtras = [
    { href: '/config', label: 'Configuración' },
    { href: '/admin', label: 'Administración' }
  ];

  const items = role === 'admin' ? [...employeeItems, ...adminExtras] : employeeItems;

  return (
    <aside className="w-64 p-4 bg-white/60 backdrop-blur-sm border-r" aria-label="Sidebar">
      <div className="mb-6">
        <div className="text-lg font-bold text-center" style={{color:'var(--ss-primary)'}}>🍬 SweetStock</div>
      </div>

      <nav>
        <ul className="space-y-2">
          {items.map(i => (
            <li key={i.href}>
              <Link href={i.href} className="block px-3 py-2 rounded hover:bg-gray-100">{i.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
