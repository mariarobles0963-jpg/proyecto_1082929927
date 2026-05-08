# 🚀 Plan de Implementación por Fases
## Fullstack TypeScript · Next.js · GitHub · Vercel · JSON Data Layer

> **Documento:** Plan de Ejecución  
> **Referencia:** Plan de Infraestructura Fullstack v1.0.0  
> **Metodología:** Entrega incremental · Validación por fase · CI/CD desde el inicio  
> **Duración estimada total:** 3–5 días hábiles (desarrollador individual)

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Mapa de Fases](#2-mapa-de-fases)
3. [Fase 0 — Prerequisitos y Preparación del Entorno](#3-fase-0--prerequisitos-y-preparación-del-entorno)
4. [Fase 1 — Inicialización del Proyecto](#4-fase-1--inicialización-del-proyecto)
5. [Fase 2 — Capa de Datos JSON](#5-fase-2--capa-de-datos-json)
6. [Fase 3 — Interfaz Home "Hola Mundo"](#6-fase-3--interfaz-home-hola-mundo)
7. [Fase 4 — API Serverless](#7-fase-4--api-serverless)
8. [Fase 5 — Pipeline CI/CD GitHub Actions](#8-fase-5--pipeline-cicd-github-actions)
9. [Fase 6 — Despliegue en Vercel](#9-fase-6--despliegue-en-vercel)
10. [Fase 7 — Verificación y Cierre del MVP](#10-fase-7--verificación-y-cierre-del-mvp)
11. [Matriz de Riesgos](#11-matriz-de-riesgos)
12. [Criterios de Éxito Global](#12-criterios-de-éxito-global)

---

## 1. Resumen Ejecutivo

Este documento detalla la ejecución paso a paso del plan de infraestructura fullstack, organizado en **7 fases secuenciales** con dependencias claras entre ellas. Cada fase tiene objetivos específicos, tareas concretas, criterios de aceptación verificables y puntos de control antes de avanzar.

### Filosofía de Entrega
- **Nunca avanzar a la siguiente fase con errores pendientes** en la actual
- **Commit atómico por tarea** significativa — historial limpio desde el inicio
- **Validar TypeScript en cada cambio** — `tsc --noEmit` antes de cada commit
- **La rama `main` siempre debe estar en estado deployable**

### Leyenda de Estados
| Símbolo | Significado |
|---------|-------------|
| 🔲 | Tarea pendiente |
| ✅ | Criterio de aceptación / gate de fase |
| ⚠️ | Punto de atención / riesgo |
| 🔁 | Tarea que puede repetirse |
| ⏱️ | Estimación de tiempo |

---

## 2. Mapa de Fases

```
FASE 0          FASE 1          FASE 2          FASE 3
Prerequisitos → Inicialización → Datos JSON  → UI Home
(~1h)           (~1.5h)         (~1h)          (~2h)
    │               │               │               │
    └───────────────┴───────────────┴───────────────┘
                            │
                            ▼
                    FASE 4          FASE 5          FASE 6          FASE 7
                    API Route   →  CI/CD GitHub → Deploy Vercel → Verificación
                    (~45min)        (~30min)        (~30min)        (~30min)
```

### Dependencias entre Fases
```
Fase 0  ──►  Fase 1  ──►  Fase 2  ──►  Fase 3
                               │
                               └──►  Fase 4  ──►  Fase 5  ──►  Fase 6  ──►  Fase 7
```

> **Nota:** Las Fases 3 y 4 pueden desarrollarse en paralelo una vez completada la Fase 2. La Fase 5 (CI/CD) puede configurarse en cualquier momento después de la Fase 1.

---

## 3. Fase 0 — Prerequisitos y Preparación del Entorno

> **Duración estimada:** 30–60 minutos  
> **Objetivo:** Garantizar que todas las herramientas, cuentas y accesos estén listos antes de escribir una sola línea de código del proyecto.

---

### 3.1 Verificación de Herramientas Locales

Ejecutar cada comando en terminal y confirmar las versiones:

```bash
# Node.js — debe ser 20 LTS o superior
node --version
# Esperado: v20.x.x o superior

# npm — debe ser 10.x o superior
npm --version
# Esperado: 10.x.x

# Git — debe ser 2.40 o superior
git --version
# Esperado: git version 2.40.x
```

**Si Node.js no está instalado o está desactualizado:**
```bash
# Usar nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20
nvm alias default 20
```

#### Checklist Fase 0.1
- 🔲 Node.js 20+ instalado y activo
- 🔲 npm 10+ disponible
- 🔲 Git instalado y configurado con nombre/email
- 🔲 VS Code instalado (u otro editor)

---

### 3.2 Configuración de Git Global

```bash
# Configurar identidad (si no está configurada)
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Verificar configuración
git config --global --list
```

---

### 3.3 Verificación de Cuentas

**GitHub:**
1. Acceder a [github.com](https://github.com) y confirmar login
2. Verificar que se puede crear un nuevo repositorio
3. Confirmar acceso SSH o HTTPS configurado

```bash
# Verificar conexión SSH a GitHub (si usa SSH)
ssh -T git@github.com
# Esperado: "Hi username! You've successfully authenticated..."

# Si usa HTTPS, verificar credenciales almacenadas
git credential-osxkeychain erase  # macOS, solo si hay problemas
```

**Vercel:**
1. Acceder a [vercel.com](https://vercel.com) y confirmar login
2. Confirmar que la cuenta de GitHub está **vinculada** a Vercel
3. Navegar a: Dashboard → Settings → Git Integration → confirmar conexión GitHub

#### Checklist Fase 0.2
- 🔲 GitHub: login activo y repositorios accesibles
- 🔲 GitHub: autenticación SSH o HTTPS funcionando
- 🔲 Vercel: login activo
- 🔲 Vercel: cuenta de GitHub vinculada en Settings

---

### 3.4 Instalación de Extensiones VS Code

Instalar las extensiones recomendadas para el proyecto:

```bash
# Instalar desde terminal (si code CLI está disponible)
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension formulahendry.auto-rename-tag
```

---

### ✅ Gate de Fase 0 — Criterios para avanzar

Antes de proceder a la Fase 1, todos estos puntos deben estar confirmados:

- ✅ `node --version` retorna v20 o superior
- ✅ `git config --global user.email` muestra el email correcto
- ✅ La conexión a GitHub funciona (SSH o HTTPS)
- ✅ Vercel muestra la cuenta de GitHub vinculada
- ✅ VS Code abre y las extensiones están activas

---

## 4. Fase 1 — Inicialización del Proyecto

> **Duración estimada:** 60–90 minutos  
> **Objetivo:** Crear el proyecto Next.js con TypeScript, configurarlo correctamente y hacer el primer commit al repositorio GitHub.  
> **Entrega al final de la fase:** Repositorio en GitHub con proyecto base funcionando localmente.

---

### 4.1 Crear el Repositorio en GitHub

1. Ir a [github.com/new](https://github.com/new)
2. Configurar:
   - **Repository name:** `mi-proyecto-fullstack` (o el nombre elegido)
   - **Visibility:** Public o Private
   - **Initialize:** ❌ NO marcar "Add a README" — se inicializará localmente
   - **Add .gitignore:** ❌ NO — Next.js lo generará automáticamente
3. Clic en **"Create repository"**
4. Copiar la URL del repositorio (SSH o HTTPS)

---

### 4.2 Scaffolding con create-next-app

```bash
# Crear el proyecto con todas las opciones necesarias
npx create-next-app@latest mi-proyecto-fullstack \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --src-dir \
  --import-alias "@/*" \
  --no-git

# Ingresar al directorio
cd mi-proyecto-fullstack
```

> **⚠️ Atención:** Se usa `--no-git` porque inicializaremos Git manualmente para conectarlo al repositorio remoto ya creado.

---

### 4.3 Configurar TypeScript Estricto

Abrir `tsconfig.json` y reemplazar su contenido:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### 4.4 Configurar next.config.ts

Renombrar `next.config.js` a `next.config.ts` (si no se creó como `.ts`) y reemplazar contenido:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
```

---

### 4.5 Configurar ESLint

Reemplazar `.eslintrc.json`:

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

Instalar el plugin de TypeScript para ESLint:

```bash
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

---

### 4.6 Instalar Dependencias del Proyecto

```bash
# Dependencias de producción
npm install framer-motion zod clsx

# Verificar que se instalaron correctamente
npm list framer-motion zod clsx
```

---

### 4.7 Actualizar Scripts en package.json

Abrir `package.json` y agregar/actualizar la sección `scripts`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "validate": "npm run type-check && npm run lint"
  }
}
```

---

### 4.8 Crear Estructura de Carpetas

```bash
# Crear todas las carpetas necesarias de una vez
mkdir -p \
  data/schema \
  src/components/ui \
  src/components/layout \
  src/lib \
  src/styles \
  .github/workflows

# Crear archivos vacíos placeholder
touch \
  data/site.json \
  src/lib/data.ts \
  src/lib/types.ts \
  src/lib/utils.ts \
  src/components/ui/HolaMundo.tsx \
  .env.local \
  .env.example
```

---

### 4.9 Crear .env.example

```bash
# Contenido de .env.example (commiteable — no contiene secretos)
echo "# Variables de entorno del proyecto
# Copiar este archivo como .env.local y completar los valores

# URL del sitio en producción (sin slash final)
# NEXT_PUBLIC_SITE_URL=https://mi-proyecto.vercel.app
" > .env.example
```

---

### 4.10 Validar el Proyecto Base

```bash
# Ejecutar validación de tipos
npm run type-check

# Ejecutar linter
npm run lint

# Levantar en desarrollo
npm run dev
# Abrir http://localhost:3000 — debe mostrar la página por defecto de Next.js
```

---

### 4.11 Primer Commit y Push a GitHub

```bash
# Inicializar Git
git init

# Conectar al repositorio remoto (usar la URL copiada en 4.1)
git remote add origin git@github.com:tu-usuario/mi-proyecto-fullstack.git
# O con HTTPS:
# git remote add origin https://github.com/tu-usuario/mi-proyecto-fullstack.git

# Primer commit
git add .
git commit -m "feat: inicialización del proyecto Next.js + TypeScript

- Next.js 14 App Router con TypeScript estricto
- Tailwind CSS configurado
- ESLint + @typescript-eslint configurado
- framer-motion, zod, clsx instalados
- Estructura de carpetas base creada
- Scripts validate y type-check en package.json"

# Push inicial
git branch -M main
git push -u origin main
```

---

### ✅ Gate de Fase 1 — Criterios para avanzar

- ✅ `npm run type-check` → sin errores
- ✅ `npm run lint` → sin errores críticos
- ✅ `npm run dev` → localhost:3000 carga correctamente
- ✅ Repositorio visible en GitHub con todos los archivos
- ✅ La estructura de carpetas coincide con el plan de infraestructura

---

## 5. Fase 2 — Capa de Datos JSON

> **Duración estimada:** 45–60 minutos  
> **Objetivo:** Implementar la capa de datos basada en archivos JSON como sustituto de base de datos, con tipado completo en TypeScript y validación en runtime con Zod.  
> **Entrega al final de la fase:** Data layer funcional y testeado localmente.

---

### 5.1 Crear el Archivo de Datos Principal

Contenido de `data/site.json`:

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

---

### 5.2 Definir Interfaces TypeScript

Contenido de `src/lib/types.ts`:

```typescript
// ============================================================
// Types globales del sistema
// Estas interfaces reflejan la estructura de los archivos JSON
// ============================================================

export interface HomeContent {
  titulo: string;
  subtitulo: string;
  descripcion: string;
}

export interface SiteMeta {
  createdAt: string;
  updatedAt: string;
}

export interface SiteConfig {
  id: string;
  nombre: string;
  version: string;
  home: HomeContent;
  meta: SiteMeta;
}

// Tipo de respuesta genérico para la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

### 5.3 Implementar el Esquema de Validación Zod

Contenido de `data/schema/site.schema.ts`:

```typescript
import { z } from 'zod';

export const HomeContentSchema = z.object({
  titulo: z.string().min(1, 'El título no puede estar vacío'),
  subtitulo: z.string().min(1),
  descripcion: z.string().min(1),
});

export const SiteMetaSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const SiteConfigSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Debe ser formato semver'),
  home: HomeContentSchema,
  meta: SiteMetaSchema,
});

// Tipo inferido desde Zod (consistente con src/lib/types.ts)
export type SiteConfigValidated = z.infer<typeof SiteConfigSchema>;
```

---

### 5.4 Implementar la Capa de Acceso a Datos

Contenido de `src/lib/data.ts`:

```typescript
import fs from 'fs';
import path from 'path';
import type { SiteConfig } from './types';
import { SiteConfigSchema } from '../../data/schema/site.schema';

// Directorio raíz de los datos JSON
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Lee y parsea un archivo JSON del directorio /data
 * Lanza un error descriptivo si el archivo no existe o es JSON inválido
 */
function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`[data] Archivo no encontrado: ${filename}`);
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`[data] Error al parsear JSON: ${filename}`);
  }
}

/**
 * Obtiene y valida la configuración del sitio desde /data/site.json
 */
export function getSiteConfig(): SiteConfig {
  const raw = readJSON<unknown>('site.json');
  const result = SiteConfigSchema.safeParse(raw);

  if (!result.success) {
    throw new Error(`[data] Validación fallida en site.json: ${result.error.message}`);
  }

  return result.data as SiteConfig;
}

// ============================================================
// Patrón para agregar nuevas colecciones:
//
// import type { MiColeccion } from './types';
// export function getMiColeccion(): MiColeccion[] {
//   return readJSON<MiColeccion[]>('mi-coleccion.json');
// }
// ============================================================
```

---

### 5.5 Implementar Utilidades

Contenido de `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx';

/**
 * Combina clases CSS de forma condicional (Tailwind-safe)
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Formatea una fecha ISO a formato legible en español
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

---

### 5.6 Validar la Capa de Datos

```bash
# Verificar tipos — la data layer debe compilar sin errores
npm run type-check

# Si hay errores de módulo en data/schema, verificar que tsconfig
# incluye la ruta correcta con resolveJsonModule: true
```

> **⚠️ Punto de atención:** La función `getSiteConfig()` se ejecuta en **server-side** únicamente (en `page.tsx` server component y en API routes). Nunca debe importarse en componentes `'use client'`.

---

### 5.7 Commit de la Capa de Datos

```bash
git add .
git commit -m "feat(data): implementar capa de datos JSON

- data/site.json: configuración inicial del sitio
- data/schema/site.schema.ts: validación Zod con tipos semver
- src/lib/types.ts: interfaces TypeScript de todas las entidades
- src/lib/data.ts: funciones de acceso tipadas con validación runtime
- src/lib/utils.ts: cn() y formatDate() helpers"

git push origin main
```

---

### ✅ Gate de Fase 2 — Criterios para avanzar

- ✅ `npm run type-check` → sin errores en la data layer
- ✅ `getSiteConfig()` puede importarse y ejecutarse sin excepciones
- ✅ El JSON en `data/site.json` es válido (verificar con `JSON.parse`)
- ✅ La validación Zod pasa correctamente con los datos actuales

---

## 6. Fase 3 — Interfaz Home "Hola Mundo"

> **Duración estimada:** 90–120 minutos  
> **Objetivo:** Implementar el Home con el efecto visual elegante de "Hola Mundo", conectado a la capa de datos JSON, completamente tipado en TypeScript.  
> **Entrega al final de la fase:** Página Home funcionando en localhost con el efecto animado completo.

---

### 6.1 Configurar Estilos Globales

Reemplazar `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Fuentes desde Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=JetBrains+Mono:wght@400;500&display=swap');

/* Variables CSS del sistema */
:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;
  --color-bg: #050510;
  --color-accent: rgba(99, 102, 241, 1);
  --color-glow: rgba(139, 92, 246, 0.8);
}

/* Utilidades de fuente */
.font-display { font-family: var(--font-display); }
.font-mono    { font-family: var(--font-mono); }

/* Reset del body */
body {
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Orbs de fondo ── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.orb-2 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%);
  bottom: -100px;
  right: -100px;
  animation-delay: -4s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -2s;
  animation-duration: 12s;
}

/* ── Keyframes ── */
@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-30px) scale(1.06); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}

/* ── Gradiente radial (util Tailwind) ── */
.bg-gradient-radial {
  background: radial-gradient(
    ellipse at center,
    var(--tw-gradient-from),
    var(--tw-gradient-via, transparent),
    var(--tw-gradient-to)
  );
}
```

---

### 6.2 Implementar el Root Layout

Reemplazar `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mi Proyecto Fullstack',
  description: 'Sistema fullstack TypeScript · Next.js · Vercel',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

---

### 6.3 Implementar el Componente HolaMundo

Contenido de `src/components/ui/HolaMundo.tsx`:

```typescript
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HolaMundoProps {
  titulo: string;
  subtitulo: string;
  version: string;
  className?: string;
}

// Variantes de animación para cada letra
const letterVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    filter: 'blur(12px)',
    scale: 0.8,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      delay: i * 0.065,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.065 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function HolaMundo({
  titulo,
  subtitulo,
  version,
  className,
}: HolaMundoProps): JSX.Element {
  const letras = titulo.split('');

  return (
    <div
      className={cn(
        'relative z-10 flex flex-col items-center gap-8 px-8 text-center',
        className
      )}
    >
      {/* Línea decorativa superior */}
      <motion.div
        className="h-px w-24 bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      />

      {/* Título — animación letra por letra */}
      <motion.h1
        className="font-display text-6xl font-black tracking-tight text-white md:text-8xl lg:text-9xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={titulo}
      >
        {letras.map((letra, i) => (
          <motion.span
            key={`${letra}-${i}`}
            custom={i}
            variants={letterVariants}
            className="inline-block"
            style={
              letra === ' '
                ? { minWidth: '0.35em' }
                : {
                    textShadow: `
                      0 0 30px rgba(139, 92, 246, 0.9),
                      0 0 60px rgba(99, 102, 241, 0.5),
                      0 0 100px rgba(99, 102, 241, 0.2)
                    `,
                  }
            }
          >
            {letra === ' ' ? '\u00A0' : letra}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subtítulo */}
      <motion.p
        className="font-mono text-xs uppercase tracking-[0.4em] text-indigo-300/60 md:text-sm"
        custom={1.2}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        {subtitulo}
      </motion.p>

      {/* Badge de versión y estado */}
      <motion.div
        className="flex items-center gap-3"
        custom={1.5}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-950/50 px-5 py-2 backdrop-blur-sm">
          {/* Dot pulsante */}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
          </span>
          <span className="font-mono text-xs text-indigo-300/80">
            TypeScript · v{version} · Sistema operativo
          </span>
        </div>
      </motion.div>

      {/* Línea decorativa inferior */}
      <motion.div
        className="h-px w-24 bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      />
    </div>
  );
}
```

---

### 6.4 Implementar el Home Page (Server Component)

Reemplazar `src/app/page.tsx`:

```typescript
import { getSiteConfig } from '@/lib/data';
import HolaMundo from '@/components/ui/HolaMundo';
import type { Metadata } from 'next';

// Metadata dinámica desde el JSON
export async function generateMetadata(): Promise<Metadata> {
  const config = getSiteConfig();
  return {
    title: `${config.home.titulo} — ${config.nombre}`,
    description: config.home.descripcion,
  };
}

export default function HomePage(): JSX.Element {
  // Los datos se leen en server-side desde el JSON
  const config = getSiteConfig();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050510]">

      {/* ── Capa de fondo ── */}
      <div className="absolute inset-0 bg-gradient-radial from-indigo-950/30 via-transparent to-transparent" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ── Grid sutil de fondo ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Componente principal ── */}
      <HolaMundo
        titulo={config.home.titulo}
        subtitulo={config.home.subtitulo}
        version={config.version}
      />

      {/* ── Footer mínimo ── */}
      <footer className="absolute bottom-6 font-mono text-xs text-white/15">
        {config.nombre} · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
```

---

### 6.5 Validar el Home Localmente

```bash
# Levantar el servidor de desarrollo
npm run dev

# Abrir en el navegador:
# http://localhost:3000

# Verificar:
# ✓ Fondo oscuro (#050510) con orbs flotantes
# ✓ Grid sutil visible
# ✓ Letras de "Hola Mundo" aparecen una por una con blur y glow
# ✓ Subtítulo aparece tras el título
# ✓ Badge verde pulsante aparece al final
# ✓ Footer con el nombre del sitio y año

# Validar TypeScript
npm run type-check
```

---

### 6.6 Commit del Home

```bash
git add .
git commit -m "feat(ui): implementar Home con efecto Hola Mundo

- src/app/globals.css: estilos globales, orbs, keyframes, variables CSS
- src/app/layout.tsx: Root Layout tipado con Metadata
- src/app/page.tsx: Server Component conectado a getSiteConfig()
- src/components/ui/HolaMundo.tsx: animación letra por letra con Framer Motion
  - Glow pulsante por letra
  - Fade-up para subtítulo y badge
  - Dot animado ping en badge de estado
  - Grid de fondo sutil"

git push origin main
```

---

### ✅ Gate de Fase 3 — Criterios para avanzar

- ✅ El Home carga en `localhost:3000` sin errores en consola
- ✅ Las letras de "Hola Mundo" animan correctamente al cargar
- ✅ Los datos del JSON (título, subtítulo, versión) aparecen correctamente
- ✅ `npm run type-check` → sin errores
- ✅ No hay imports de `getSiteConfig` en archivos con `'use client'`

---

## 7. Fase 4 — API Serverless

> **Duración estimada:** 30–45 minutos  
> **Objetivo:** Exponer la capa de datos JSON mediante una API REST tipada usando Vercel Serverless Functions (Next.js API Routes), validando el funcionamiento fullstack.  
> **Entrega al final de la fase:** Endpoint `/api/site` respondiendo JSON válido.

---

### 7.1 Crear el Endpoint de Configuración

Crear `src/app/api/site/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/data';
import type { NextRequest } from 'next/server';
import type { ApiResponse, SiteConfig } from '@/lib/types';

/**
 * GET /api/site
 * Retorna la configuración del sitio desde /data/site.json
 */
export async function GET(
  _request: NextRequest
): Promise<NextResponse<ApiResponse<SiteConfig>>> {
  try {
    const config = getSiteConfig();

    return NextResponse.json(
      { success: true, data: config },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
```

---

### 7.2 Verificar el Endpoint Localmente

```bash
# Asegurarse de que el dev server está corriendo
npm run dev

# En otra terminal, probar el endpoint con curl:
curl http://localhost:3000/api/site | json_pp

# Respuesta esperada:
# {
#   "success": true,
#   "data": {
#     "id": "site-config",
#     "nombre": "Mi Proyecto Fullstack",
#     "version": "1.0.0",
#     "home": { ... },
#     "meta": { ... }
#   }
# }

# Alternativa: abrir en el navegador
# http://localhost:3000/api/site
```

---

### 7.3 Commit de la API

```bash
git add .
git commit -m "feat(api): agregar endpoint GET /api/site

- src/app/api/site/route.ts: endpoint tipado con ApiResponse<SiteConfig>
- Manejo de errores con mensajes descriptivos
- Headers de caché para producción (s-maxage=60)"

git push origin main
```

---

### ✅ Gate de Fase 4 — Criterios para avanzar

- ✅ `GET /api/site` responde con `{ success: true, data: {...} }`
- ✅ Si se corrompe `site.json`, responde con `{ success: false, error: "..." }`
- ✅ `npm run type-check` → sin errores en los archivos de la API
- ✅ El tipo de retorno `ApiResponse<SiteConfig>` está correctamente inferido

---

## 8. Fase 5 — Pipeline CI/CD GitHub Actions

> **Duración estimada:** 20–30 minutos  
> **Objetivo:** Configurar validación automática de TypeScript y ESLint en cada push y Pull Request, garantizando que ningún código con errores llegue a producción.  
> **Entrega al final de la fase:** GitHub Actions corriendo y en verde para el branch `main`.

---

### 8.1 Crear el Workflow de CI

Crear `.github/workflows/ci.yml`:

```yaml
name: CI — Validación TypeScript y ESLint

on:
  push:
    branches: ['**']          # Todos los branches
  pull_request:
    branches: [main]          # Solo PRs hacia main

jobs:
  validate:
    name: Type Check & Lint
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      # 1. Checkout del código
      - name: 📦 Checkout
        uses: actions/checkout@v4

      # 2. Configurar Node.js con caché de npm
      - name: ⚙️ Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # 3. Instalar dependencias (usa package-lock.json exacto)
      - name: 📥 Instalar dependencias
        run: npm ci

      # 4. Validar tipos con TypeScript
      - name: 🔷 TypeScript — type-check
        run: npm run type-check

      # 5. Validar código con ESLint
      - name: 🔍 ESLint — lint
        run: npm run lint

      # 6. Confirmar éxito
      - name: ✅ Validación exitosa
        run: |
          echo "================================"
          echo "✅ TypeScript: sin errores"
          echo "✅ ESLint: sin errores"
          echo "✅ Listo para deploy en Vercel"
          echo "================================"
```

---

### 8.2 Push y Verificar en GitHub

```bash
git add .
git commit -m "ci: agregar GitHub Actions workflow de validación

- .github/workflows/ci.yml: type-check + lint en cada push
- Corre en ubuntu-latest con Node.js 20
- Timeout de 10 minutos para evitar runs colgados
- Caché de npm para builds más rápidos"

git push origin main
```

**Verificar en GitHub:**
1. Ir al repositorio en GitHub
2. Clic en la pestaña **"Actions"**
3. Ver el workflow `CI — Validación TypeScript y ESLint`
4. Confirmar que todos los steps terminan en ✅ verde

---

### ✅ Gate de Fase 5 — Criterios para avanzar

- ✅ El workflow aparece en la pestaña Actions de GitHub
- ✅ Todos los steps del workflow pasan en verde
- ✅ El badge de estado del CI muestra "passing"
- ✅ Al hacer un push intencional con error de tipos, el CI falla correctamente

---

## 9. Fase 6 — Despliegue en Vercel

> **Duración estimada:** 20–30 minutos  
> **Objetivo:** Conectar el repositorio GitHub a Vercel y realizar el primer deploy automático a producción.  
> **Entrega al final de la fase:** URL pública de producción funcionando con el Home "Hola Mundo".

---

### 9.1 Importar el Repositorio en Vercel

1. Acceder al **[dashboard de Vercel](https://vercel.com/dashboard)**
2. Clic en **"Add New..." → "Project"**
3. En la sección **"Import Git Repository"**, seleccionar la cuenta de GitHub
4. Buscar y seleccionar el repositorio `mi-proyecto-fullstack`
5. Clic en **"Import"**

---

### 9.2 Configurar el Proyecto en Vercel

En la pantalla de configuración del proyecto:

| Campo | Valor |
|-------|-------|
| **Project Name** | `mi-proyecto-fullstack` |
| **Framework Preset** | Next.js (auto-detectado) |
| **Root Directory** | `.` (raíz del repo) |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `.next` (automático) |
| **Install Command** | `npm ci` (default) |

**Variables de entorno:** Para el MVP no se requieren. Dejar vacío y continuar.

6. Clic en **"Deploy"**

---

### 9.3 Monitorear el Build

En la pantalla de logs del deploy, verificar que todos los pasos completan exitosamente:

```
✓ Cloning github.com/usuario/mi-proyecto-fullstack
✓ Installing dependencies
✓ Running "npm run build"
  ✓ Compiled successfully
  ✓ Linting and checking validity of types
✓ Build completed
✓ Deploying to production
```

> **⚠️ Si el build falla:** Revisar los logs de Vercel. El error más común es un import incorrecto. Corregir localmente, push a main, y Vercel re-desplegará automáticamente.

---

### 9.4 Verificar el Deploy de Producción

Una vez completado el deploy:

1. Copiar la URL de producción (ej: `mi-proyecto-fullstack.vercel.app`)
2. Abrir en el navegador — debe mostrar el Home "Hola Mundo" con el efecto visual
3. Verificar el endpoint de la API en producción:

```bash
curl https://mi-proyecto-fullstack.vercel.app/api/site | json_pp
```

---

### 9.5 Configurar Dominio y Entornos (Opcional)

En el dashboard de Vercel → Settings del proyecto:

**Ramas automáticas:**
- `main` → producción (`mi-proyecto.vercel.app`)
- Cualquier otra rama → preview URL única por deploy

**Custom Domain (opcional):**
- Settings → Domains → agregar dominio personalizado si se dispone de uno

---

### ✅ Gate de Fase 6 — Criterios para avanzar

- ✅ El build en Vercel completa sin errores
- ✅ La URL de producción carga el Home "Hola Mundo"
- ✅ La animación de letras funciona en producción
- ✅ `GET https://[dominio].vercel.app/api/site` retorna JSON válido
- ✅ Al hacer un nuevo push a `main`, Vercel inicia un nuevo deploy automáticamente

---

## 10. Fase 7 — Verificación y Cierre del MVP

> **Duración estimada:** 20–30 minutos  
> **Objetivo:** Ejecutar un checklist de verificación completo en producción, documentar el estado final del MVP y preparar el terreno para las siguientes iteraciones.

---

### 10.1 Checklist de Verificación Final

#### Validación Local
- 🔲 `npm run type-check` → **0 errores**
- 🔲 `npm run lint` → **0 errores críticos**
- 🔲 `npm run build` → build local exitoso
- 🔲 `localhost:3000` → Home "Hola Mundo" visible con efecto elegante
- 🔲 `localhost:3000/api/site` → JSON válido con `success: true`

#### Validación GitHub
- 🔲 Repositorio visible y con historial de commits limpio
- 🔲 GitHub Actions → todos los workflows en ✅ verde
- 🔲 No hay ramas con errores sin resolver

#### Validación Vercel
- 🔲 Dashboard muestra deploy exitoso con ✅ verde
- 🔲 URL de producción carga correctamente
- 🔲 Tiempo de carga del Home < 3 segundos (LCP)
- 🔲 La animación de letras funciona en producción
- 🔲 El badge "Sistema operativo" aparece al final de la animación

#### Validación API en Producción
```bash
# Reemplazar [dominio] con la URL real de Vercel
curl -s https://[dominio].vercel.app/api/site | json_pp

# Verificar que la respuesta incluye:
# - success: true
# - data.home.titulo: "Hola Mundo"
# - data.version: "1.0.0"
```

---

### 10.2 Registro del Estado Final

Crear `CHANGELOG.md` en la raíz del proyecto:

```markdown
# Changelog

## [1.0.0] — 2026-03-27

### Añadido
- Proyecto Next.js 14 App Router con TypeScript estricto
- Capa de datos JSON en /data/ con validación Zod
- Home "Hola Mundo" con efecto de animación letra por letra (Framer Motion)
- API REST: GET /api/site retorna configuración del sitio
- Pipeline CI/CD con GitHub Actions (type-check + lint)
- Deploy automático en Vercel vinculado a GitHub
```

---

### 10.3 Commit de Cierre del MVP

```bash
git add CHANGELOG.md
git commit -m "docs: registrar cierre del MVP v1.0.0

- CHANGELOG.md: primera entrada documentando el MVP
- Sistema fullstack TypeScript operativo en producción
- URL: https://[dominio].vercel.app"

git push origin main
```

---

### ✅ Gate de Fase 7 — MVP Completado

- ✅ Todos los ítems del checklist marcados como completados
- ✅ La URL de producción está operativa y estable
- ✅ El historial de Git tiene commits descriptivos y atómicos
- ✅ GitHub Actions está en verde en `main`
- ✅ `CHANGELOG.md` documenta la versión 1.0.0

---

## 11. Matriz de Riesgos

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|-------------|---------|------------|
| R1 | Error de tipos en `data.ts` al leer JSON | Media | Alto | Validación con Zod en runtime + `safeParse` |
| R2 | Build falla en Vercel por import incorrecto | Media | Alto | Ejecutar `npm run build` localmente antes del push |
| R3 | Fuentes de Google Fonts no cargan en prod | Baja | Medio | Tener fuentes de fallback en CSS (`Georgia, serif`) |
| R4 | `framer-motion` causa errores de hidratación | Media | Alto | Usar `'use client'` en el componente de animación |
| R5 | GitHub Actions falla por versión de Node | Baja | Medio | Fijar `node-version: '20'` en el workflow |
| R6 | `getSiteConfig()` llamado en cliente | Baja | Alto | Nunca importar `data.ts` desde archivos `'use client'` |
| R7 | JSON mal formado en `/data/site.json` | Baja | Alto | Validar el JSON con un linter antes del commit |

---

## 12. Criterios de Éxito Global

El MVP se considera **exitosamente completado** cuando:

```
┌──────────────────────────────────────────────────────────┐
│                    MVP COMPLETADO ✅                      │
│                                                          │
│  1. TypeScript compila sin errores en todo el proyecto  │
│  2. "Hola Mundo" visible y centrado en producción       │
│  3. Efecto de animación elegante funcionando            │
│  4. API /api/site retorna datos JSON válidos            │
│  5. GitHub Actions pasa todos los checks                │
│  6. Vercel despliega automáticamente al hacer push      │
│  7. La URL de producción es accesible públicamente      │
└──────────────────────────────────────────────────────────┘
```

### Métricas de Calidad Objetivo

| Métrica | Objetivo |
|---------|----------|
| Errores TypeScript | 0 |
| Errores ESLint críticos | 0 |
| Tiempo de carga (LCP) | < 3s |
| Lighthouse Performance | > 85 |
| Lighthouse Accessibility | > 90 |
| Deploy time en Vercel | < 2 minutos |

---

## 📌 Comandos de Referencia Rápida por Fase

```bash
# ── Fase 0: Prerequisitos ──────────────────────────────────
node --version && npm --version && git --version

# ── Fase 1: Inicialización ─────────────────────────────────
npx create-next-app@latest mi-proyecto-fullstack --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --no-git
npm install framer-motion zod clsx
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser

# ── Validación continua (usar en todas las fases) ──────────
npm run type-check          # Solo TypeScript
npm run lint                # Solo ESLint
npm run validate            # Ambos (type-check + lint)
npm run build               # Build completo (simula Vercel)

# ── Desarrollo ─────────────────────────────────────────────
npm run dev                 # localhost:3000

# ── Git workflow ───────────────────────────────────────────
git add . && git commit -m "tipo(scope): descripción"
git push origin main

# ── Prueba de API ──────────────────────────────────────────
curl http://localhost:3000/api/site | json_pp
curl https://[dominio].vercel.app/api/site | json_pp
```

---

*Plan de Implementación por Fases · Fullstack TypeScript · GitHub · Vercel · v1.0.0*
