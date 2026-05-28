/**
 * Home Page — Server Component
 *
 * Este componente ejecuta en el servidor durante renderizado.
 * Lee los datos JSON desde /data/pages/home.json usando readJson<T>()
 * y pasa props tipadas al componente HolaMundo.
 *
 * Ventajas de este patrón:
 * 1. Sin llamada HTTP innecesaria (mejora performance)
 * 2. Datos disponibles en el primer render (SSR)
 * 3. TypeScript valida en compilación que HomeData cumple el contrato
 * 4. El cliente solo recibe HTML renderizado + CSS/JS mínimo
 */

import HolaMundo from "@/components/HolaMundo/HolaMundo";
import { readJson } from "@/lib/db/reader";
import Link from "next/link";
import type { HomeData } from "@/lib/db/types";
import type { EffectType } from "@/components/HolaMundo/HolaMundo.types";

// Server Component: lee el JSON en el servidor sin llamada HTTP
export default function HomePage() {
  const { hero } = readJson<HomeData>("pages/home");

  return (
    <main>
      <HolaMundo
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        effect={hero.effect as EffectType}
      />
      <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4">
        <Link
          href="/login"
          className="rounded-full bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:bg-fuchsia-700"
        >
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
}

