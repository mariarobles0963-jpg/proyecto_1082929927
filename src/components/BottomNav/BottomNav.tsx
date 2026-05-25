import React from 'react';
import Link from 'next/link';

type Role = 'admin' | 'empleado';

export default function BottomNav({ role = 'empleado' }: { role?: Role }){
  const employee = [
    { href: '/inventory', label: 'Inventario' },
    { href: '/sales', label: 'Ventas' },
    { href: '/sales/history', label: 'Historial' },
    { href: '/profile', label: 'Perfil' },
  ];

  const adminExtras = [
    { href: '/config', label: 'Config' },
    { href: '/admin', label: 'Admin' }
  ];

  const items = role === 'admin' ? [...employee, ...adminExtras] : employee;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 border-t py-2 md:hidden">
      <ul className="flex justify-around">
        {items.map(i => (
          <li key={i.href}>
            <Link href={i.href} className="text-sm text-center block px-2 py-1">{i.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
