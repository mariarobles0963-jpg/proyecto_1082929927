# 🏗️ Plan de Infraestructura — Fullstack TypeScript con GitHub + Vercel

> **Versión:** 1.0.0  
> **Autor:** Arquitecto de Software  
> **Stack:** Next.js 14 · TypeScript · Vercel · JSON Data Layer  

---

## 📋 Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Estructura de Carpetas](#3-estructura-de-carpetas)
4. [Stack Tecnológico](#4-stack-tecnológico)
5. [Capa de Datos JSON](#5-capa-de-datos-json)
6. [Configuración del Proyecto](#6-configuración-del-proyecto)
7. [Implementación del Home — Hola Mundo](#7-implementación-del-home--hola-mundo)
8. [Pipeline CI/CD — GitHub + Vercel](#8-pipeline-cicd--github--vercel)
9. [Requisitos del Entorno](#9-requisitos-del-entorno)
10. [Checklist de Implementación](#10-checklist-de-implementación)

---

## 1. Visión General

### Descripción
Sistema web fullstack construido en **TypeScript puro**, desplegado automáticamente en **Vercel** mediante integración con **GitHub**. La persistencia de datos se maneja a través de una **capa de archivos JSON** estructurados como si fueran colecciones de base de datos, eliminando la necesidad de un motor de base de datos convencional.

### Objetivos del MVP
- ✅ Validar el pipeline TypeScript end-to-end (frontend + backend)
- ✅ Confirmar el flujo de despliegue GitHub → Vercel
- ✅ Establecer la arquitectura de datos basada en JSON
- ✅ Mostrar un **Home con "Hola Mundo"** centrado con efecto visual elegante

### Principios de Diseño
| Principio | Decisión |
|-----------|----------|
| **Type Safety** | TypeScript estricto en todo el proyecto (`strict: true`) |
| **Zero Database** | Archivos JSON como fuente de verdad |
| **Serverless** | Vercel Functions para la API |
| **Atomic Deployments** | Cada push a `main` genera un deploy inmutable |
| **Monorepo-ready** | Estructura preparada para escalar |

---

## 2. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        DEVELOPER                            │
│                    (Local Machine)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │ git push
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     GITHUB REPOSITORY                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   main      │  │  feature/*   │  │  GitHub Actions  │   │
│  │  (prod)     │  │  (dev)       │  │  (lint + tsc)    │   │
│  └──────┬──────┘  └──────────────┘  └──────────────────┘   │
└─────────┼───────────────────────────────────────────────────┘
          │ webhook trigger
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL PLATFORM                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              BUILD PIPELINE                          │   │
│  │  next build → tsc --noEmit → output: .next/         │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │              EDGE NETWORK (CDN)                      │   │
│  │  Static Assets · ISR Pages · Edge Functions         │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │           VERCEL SERVERLESS FUNCTIONS                │   │
│  │  /api/*  →  Lee archivos JSON desde /data/          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                      END USER                               │
│              Browser · PWA · Mobile Web                     │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos (JSON Layer)

```
Request HTTP
     │
     ▼
Vercel Function (/api/[recurso].ts)
     │
     ▼
Data Service (src/lib/data.ts)
     │  fs.readFileSync / fs.writeFileSync
     ▼
Archivo JSON (/data/[coleccion].json)
     │
     ▼
Response tipada con TypeScript Interfaces
```

---

## 3. Estructura de Carpetas

```
mi-proyecto/
│
├── 📁 .github/
│   └── workflows/
│       └── ci.yml                  # Lint + Type Check en cada PR
│
├── 📁 data/                        # 🗄️ "Base de datos" JSON
│   ├── site.json                   # Configuración del sitio
│   ├── pages.json                  # Contenido de páginas
│   └── schema/                     # Esquemas de validación (Zod)
│       └── site.schema.ts
│
├── 📁 public/
│   ├── favicon.ico
│   └── fonts/                      # Fuentes locales (opcional)
│
├── 📁 src/
│   ├── 📁 app/                     # Next.js App Router
│   │   ├── layout.tsx              # Root Layout + Metadata
│   │   ├── page.tsx                # HOME → Hola Mundo
│   │   ├── globals.css             # Estilos globales + variables CSS
│   │   └── api/                    # Serverless API Routes
│   │       └── site/
│   │           └── route.ts        # GET /api/site
│   │
│   ├── 📁 components/
│   │   ├── ui/
│   │   │   └── HolaMundo.tsx       # Componente principal del Home
│   │   └── layout/
│   │       └── RootLayout.tsx
│   │
│   ├── 📁 lib/
│   │   ├── data.ts                 # Capa de acceso a datos JSON
│   │   ├── types.ts                # Interfaces y Types globales
│   │   └── utils.ts                # Utilidades TypeScript
│   │
│   └── 📁 styles/
│       └── animations.css          # Keyframes y efectos
│
├── .env.local                      # Variables de entorno locales
├── .env.example                    # Template de variables (commiteable)
├── .eslintrc.json                  # Reglas ESLint + TypeScript
├── .gitignore
├── next.config.ts                  # Configuración Next.js en TS
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json                   # TypeScript config estricto
```

---

## 4. Stack Tecnológico

### Core
| Tecnología | Versión | Rol |
|------------|---------|-----|
| **Next.js** | 14.x (App Router) | Framework fullstack |
| **TypeScript** | 5.x | Lenguaje principal |
| **React** | 18.x | UI Library |
| **Tailwind CSS** | 3.x | Estilos utilitarios |

### Infraestructura
| Tecnología | Rol |
|------------|-----|
| **Vercel** | Hosting + Serverless Functions + CDN |
| **GitHub** | Repositorio + CI/CD trigger |
| **GitHub Actions** | Validación de tipos y lint en PRs |

### Librerías de Apoyo
| Librería | Propósito |
|----------|-----------|
| `zod` | Validación de esquemas JSON en runtime |
| `framer-motion` | Animaciones elegantes (efecto Hola Mundo) |
| `clsx` | Utilidad para clases CSS condicionales |
| `eslint` + `@typescript-eslint` | Linting estricto |

---

## 5. Capa de Datos JSON

### Filosofía
Cada archivo en `/data/` representa una **colección**. La capa `src/lib/data.ts` actúa como el ORM/repositorio que abstrae la lectura y escritura, garantizando tipado con TypeScript.

### Archivo: `/data/site.json`
```json
{
  "id": "site-config",
  "nombre": "Mi Proyecto Fullstack",
  "version": "1.0.0",
  "home": {
    "titulo": "Hola Mundo",
    "subtitulo": "TypeScript · Next.js · Vercel",
    "descripcion": "Sistema fullstack desplegado con GitHub y Vercel"
  },
  "meta": {
    "createdAt": "2026-03-27T00:00:00.000Z",
    "updatedAt": "2026-03-27T00:00:00.000Z"
  }
}
```

### Archivo: `src/lib/types.ts`
```typescript
// Interfaces que reflejan la estructura de los JSON

export interface HomeContent {
  titulo: string;
  subtitulo: string;
  descripcion: string;
}

export interface SiteConfig {
  id: string;
  nombre: string;
  version: string;
  home: HomeContent;
  meta: {
    createdAt: string;
    updatedAt: string;
  };
}
```

### Archivo: `src/lib/data.ts`
```typescript
import fs from 'fs';
import path from 'path';
import type { SiteConfig } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export function getSiteConfig(): SiteConfig {
  return readJSON<SiteConfig>('site.json');
}

// Patrón para colecciones futuras:
// export function getCollection<T>(filename: string): T[] {
//   return readJSON<T[]>(filename);
// }
```

### Validación con Zod: `data/schema/site.schema.ts`
```typescript
import { z } from 'zod';

export const SiteConfigSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  version: z.string(),
  home: z.object({
    titulo: z.string(),
    subtitulo: z.string(),
    descripcion: z.string(),
  }),
  meta: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
```

---

## 6. Configuración del Proyecto

### `tsconfig.json` — TypeScript Estricto
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@data/*": ["./data/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `next.config.ts`
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Habilita la configuración en TypeScript nativo
  experimental: {
    typedRoutes: true,
  },
  // Los archivos JSON en /data son accesibles solo server-side
  // No se exponen al bundle del cliente
};

export default nextConfig;
```

### `.eslintrc.json`
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### `package.json` — Scripts clave
```json
{
  "name": "mi-proyecto-fullstack",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "validate": "npm run type-check && npm run lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "clsx": "^2.1.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0"
  }
}
```

---

## 7. Implementación del Home — Hola Mundo

### Efecto Visual: `Reveal con partículas de luz`
El texto "Hola Mundo" aparece con un efecto de **fade-in escalonado por letra** acompañado de un **glow pulsante** y un **gradiente animado** de fondo. Todo manejado con Framer Motion + CSS variables.

---

### `src/app/page.tsx`
```typescript
import { getSiteConfig } from '@/lib/data';
import HolaMundo from '@/components/ui/HolaMundo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const config = getSiteConfig();
  return {
    title: config.nombre,
    description: config.home.descripcion,
  };
}

export default function HomePage(): JSX.Element {
  const config = getSiteConfig();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050510]">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-radial from-indigo-950/40 via-transparent to-transparent" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Componente principal */}
      <HolaMundo
        titulo={config.home.titulo}
        subtitulo={config.home.subtitulo}
        version={config.version}
      />
    </main>
  );
}
```

---

### `src/components/ui/HolaMundo.tsx`
```typescript
'use client';

import { motion } from 'framer-motion';

interface HolaMundoProps {
  titulo: string;
  subtitulo: string;
  version: string;
}

const letterVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.06,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

export default function HolaMundo({ titulo, subtitulo, version }: HolaMundoProps): JSX.Element {
  const letras = titulo.split('');

  return (
    <div className="relative z-10 flex flex-col items-center gap-6 px-8 text-center">
      {/* Título letra por letra */}
      <motion.h1
        className="font-display text-7xl font-bold tracking-tight text-white md:text-9xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={titulo}
      >
        {letras.map((letra, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            className="inline-block"
            style={
              letra === ' '
                ? { minWidth: '0.4em' }
                : {
                    textShadow:
                      '0 0 40px rgba(139,92,246,0.8), 0 0 80px rgba(99,102,241,0.4)',
                  }
            }
          >
            {letra === ' ' ? '\u00A0' : letra}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subtítulo */}
      <motion.p
        className="font-mono text-sm uppercase tracking-[0.3em] text-indigo-300/70"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        {subtitulo}
      </motion.p>

      {/* Badge de versión */}
      <motion.div
        className="mt-4 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-4 py-1.5 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <span className="font-mono text-xs text-indigo-400">
          TypeScript · v{version} · ✓ Funcionando
        </span>
      </motion.div>
    </div>
  );
}
```

---

### `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;
}

.font-display { font-family: var(--font-display); }
.font-mono    { font-family: var(--font-mono); }

/* Orbs de fondo */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
  bottom: -80px;
  right: -80px;
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-30px) scale(1.05); }
}

.bg-gradient-radial {
  background: radial-gradient(ellipse at center, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
}
```

---

### API Route: `src/app/api/site/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/data';
import type { NextRequest } from 'next/server';

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const config = getSiteConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error leyendo configuración' },
      { status: 500 }
    );
  }
}
```

> **Validación:** Accede a `https://tu-dominio.vercel.app/api/site` para confirmar que la capa de datos JSON está funcionando correctamente en producción.

---

## 8. Pipeline CI/CD — GitHub + Vercel

### Flujo de Trabajo

```
Desarrollador
    │
    ├─── feature/nueva-funcionalidad
    │         │
    │         │ git push origin feature/...
    │         ▼
    │    GitHub Actions CI
    │    ├── npm run type-check   (tsc --noEmit)
    │    ├── npm run lint         (eslint)
    │    └── ✅ PR listo para review
    │
    └─── merge a main
              │
              ▼
         Vercel webhook
              │
              ▼
         Build: next build
              │
         ┌────┴────────────────┐
         │  ✅ Build exitoso   │   ❌ Build fallido
         │  Deploy a prod      │   Notificación email
         └────────────────────-┘
```

### `.github/workflows/ci.yml`
```yaml
name: CI — Type Check & Lint

on:
  push:
    branches: ['*']
  pull_request:
    branches: [main]

jobs:
  validate:
    name: TypeScript + ESLint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: ✅ Validación completa
        run: echo "TypeScript compiló sin errores. Listo para deploy."
```

### Configuración en Vercel

1. **Importar repositorio** desde el dashboard de Vercel → GitHub
2. **Framework Preset:** Next.js (auto-detectado)
3. **Build Command:** `npm run build`
4. **Output Directory:** `.next` (automático)
5. **Install Command:** `npm ci`
6. **Root Directory:** `/` (raíz del repo)
7. **Variables de entorno:** No requeridas para el MVP

### Ramas y Entornos
| Rama | Entorno Vercel | URL |
|------|---------------|-----|
| `main` | Production | `mi-proyecto.vercel.app` |
| `develop` | Preview | `mi-proyecto-git-develop.vercel.app` |
| `feature/*` | Preview | `mi-proyecto-git-feature-*.vercel.app` |

---

## 9. Requisitos del Entorno

### Herramientas Locales
| Herramienta | Versión Mínima | Verificar con |
|-------------|---------------|--------------|
| **Node.js** | 20 LTS | `node --version` |
| **npm** | 10.x | `npm --version` |
| **Git** | 2.40+ | `git --version` |
| **VS Code** (recomendado) | Latest | — |

### Extensiones VS Code Recomendadas
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag"
  ]
}
```

### Cuentas Requeridas
- ✅ **GitHub** — Repositorio del proyecto
- ✅ **Vercel** — Vinculada a la cuenta GitHub

### Variables de Entorno (`.env.example`)
```bash
# En el MVP no se requieren variables externas.
# Agregar aquí futuras variables:
# NEXT_PUBLIC_SITE_URL=https://mi-proyecto.vercel.app
```

---

## 10. Checklist de Implementación

### Fase 1 — Setup Local
- [ ] Crear repositorio en GitHub (ej: `mi-proyecto-fullstack`)
- [ ] Ejecutar `npx create-next-app@latest --typescript --tailwind --app`
- [ ] Configurar `tsconfig.json` con `strict: true`
- [ ] Crear estructura de carpetas según el plan
- [ ] Instalar dependencias: `framer-motion`, `zod`, `clsx`
- [ ] Crear `/data/site.json` con el contenido inicial
- [ ] Implementar `src/lib/data.ts` y `src/lib/types.ts`

### Fase 2 — Home "Hola Mundo"
- [ ] Implementar `src/app/globals.css` con orbs y fuentes
- [ ] Crear `src/components/ui/HolaMundo.tsx`
- [ ] Conectar `src/app/page.tsx` con datos del JSON
- [ ] Crear API route `/api/site/route.ts`
- [ ] Validar localmente: `npm run dev` → `localhost:3000`
- [ ] Validar API: `localhost:3000/api/site` devuelve JSON

### Fase 3 — Validación TypeScript
- [ ] Ejecutar `npm run type-check` → sin errores
- [ ] Ejecutar `npm run lint` → sin warnings críticos
- [ ] Ejecutar `npm run build` → build exitoso

### Fase 4 — CI/CD
- [ ] Push del proyecto a GitHub
- [ ] Crear `.github/workflows/ci.yml`
- [ ] Verificar que GitHub Actions pasa correctamente
- [ ] Vincular repositorio en Vercel Dashboard
- [ ] Confirmar deploy automático en `main`
- [ ] Validar URL de producción en Vercel
- [ ] Verificar `/api/site` en producción

### Fase 5 — Verificación Final
- [ ] ✅ "Hola Mundo" visible y centrado con efecto elegante
- [ ] ✅ Animación de letras funcionando
- [ ] ✅ API `/api/site` retorna datos del JSON
- [ ] ✅ TypeScript sin errores en todo el proyecto
- [ ] ✅ GitHub Actions verde en todos los checks
- [ ] ✅ Vercel muestra deploy exitoso en producción

---

## 📌 Comandos de Referencia Rápida

```bash
# Desarrollo local
npm run dev

# Validar TypeScript
npm run type-check

# Lint
npm run lint

# Build de producción (simular Vercel)
npm run build && npm run start

# Instalar dependencias del plan
npm install framer-motion zod clsx
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

---

## 🔮 Próximos Pasos (Post-MVP)

Una vez validado el MVP, la arquitectura está preparada para escalar hacia:

1. **Más colecciones JSON** — Agregar `data/usuarios.json`, `data/productos.json`, etc.
2. **Autenticación** — NextAuth.js con JWT (sin base de datos, sesiones en JSON)
3. **CMS headless** — Reemplazar JSONs con Contentlayer o MDX
4. **Testing** — Vitest + Testing Library para componentes TypeScript
5. **Migración a DB** — Si el volumen lo requiere, migrar a Prisma + PlanetScale manteniendo las mismas interfaces TypeScript

---

*Plan generado para validación fullstack TypeScript · GitHub · Vercel · JSON Data Layer*
