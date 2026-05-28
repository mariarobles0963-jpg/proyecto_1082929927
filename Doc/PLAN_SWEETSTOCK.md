# SweetStock — Plan Maestro del Sistema
> Sistema de Administración de Inventario y Ventas para Dulcería | Versión 1.0
> Proyecto Fullstack Individual | Mayo 2026
> Stack: Next.js + TypeScript + Supabase Postgres + Vercel Blob + Vercel
> Estudiante: María Robles | Doc: 1082929927

---

## Índice General

1. [Definición del sistema](#1-definición-del-sistema)
2. [Problema que resuelve](#2-problema-que-resuelve)
3. [Actores del sistema](#3-actores-del-sistema)
4. [Roles y permisos](#4-roles-y-permisos)
5. [Casos de uso](#5-casos-de-uso)
6. [Requerimientos funcionales](#6-requerimientos-funcionales)
7. [Reglas de negocio](#7-reglas-de-negocio)
8. [Stack tecnológico](#8-stack-tecnológico)
9. [Arquitectura de persistencia](#9-arquitectura-de-persistencia)
10. [Bootstrap y migrations](#10-bootstrap-y-migrations)
11. [Capa de datos unificada (dataService)](#11-capa-de-datos-unificada)
12. [Modelo de datos — Supabase Postgres](#12-modelo-de-datos--supabase-postgres)
13. [Auditoría en Vercel Blob](#13-auditoría-en-vercel-blob)
14. [Arquitectura de rutas](#14-arquitectura-de-rutas)
15. [Requerimientos no funcionales](#15-requerimientos-no-funcionales)
16. [Flujos de usuario y de trabajo](#16-flujos-de-usuario-y-de-trabajo)
17. [Diseño de interfaz](#17-diseño-de-interfaz)
18. [Plan de fases de implementación](#18-plan-de-fases-de-implementación)
19. [Estrategia de seguridad](#19-estrategia-de-seguridad)
20. [Restricciones del sistema](#20-restricciones-del-sistema)
21. [Glosario](#21-glosario)

---

## 1. Definición del sistema

**SweetStock** es una aplicación web de gestión de inventario y ventas diseñada para dulcerías y pequeños negocios de confitería. Permite registrar y consultar el catálogo de productos con su stock en tiempo real, registrar ventas con descuento automático del inventario, y consultar el historial completo de transacciones.

El sistema incluye control de acceso por roles (administrador y empleado), alertas visuales de stock bajo con umbral configurable, y generación de historial de ventas con fecha, hora, producto y monto.

Opera completamente desde el navegador con Next.js App Router en Vercel. Persiste todos los datos en Supabase Postgres y registra la auditoría de operaciones en Vercel Blob.

---

## 2. Problema que resuelve

| Problema actual | Cómo lo resuelve SweetStock |
|---|---|
| Inventario en papel o Excel desactualizado. | Catálogo digital actualizado en tiempo real tras cada venta. |
| Errores en precios y existencias. | Precios y cantidades centralizados, con validación en el servidor. |
| Sin registro formal de ventas. | Historial persistente con fecha/hora, producto, cantidad y total. |
| Dificultad para identificar productos con poco stock. | Alerta visual automática cuando el stock cae bajo el umbral mínimo configurable. |
| Sin distinción de quién puede editar qué. | Dos roles: el empleado registra ventas; solo el admin edita precios y elimina productos. |

---

## 3. Actores del sistema

| Actor | Tipo | Descripción |
|---|---|---|
| **Administrador** | Interno | Acceso completo. Crea y gestiona productos, edita precios, elimina del catálogo, configura el umbral de alerta, crea usuarios. |
| **Empleado** | Interno | Puede agregar productos (sin editar precios de los existentes), registrar ventas y consultar el inventario e historial. |
| **Sistema** | No humano | Descuenta stock automáticamente, activa alertas visuales, registra auditoría. |

> **Sin registro público.** Los usuarios los crea el administrador con contraseña temporal.

---

## 4. Roles y permisos

### Matriz de permisos

| Recurso / Acción | Empleado | Administrador |
|---|:-:|:-:|
| Login / cambiar contraseña propia | ✅ | ✅ |
| Acceder a `/admin/db-setup` | ❌ | ✅ |
| **PRODUCTOS** | | |
| Ver inventario completo | ✅ | ✅ |
| Buscar producto por nombre | ✅ | ✅ |
| Agregar nuevo producto | ✅ | ✅ |
| Editar nombre de un producto | ❌ | ✅ |
| Editar precio de un producto | ❌ | ✅ |
| Editar cantidad (entrada de mercancía) | ❌ | ✅ |
| Eliminar producto del catálogo | ❌ | ✅ |
| Configurar umbral de stock mínimo | ❌ | ✅ |
| **VENTAS** | | |
| Registrar venta | ✅ | ✅ |
| Ver historial completo de ventas | ✅ | ✅ |
| **USUARIOS** | | |
| Crear / activar / suspender usuarios | ❌ | ✅ |
| **AUDITORÍA** | | |
| Ver bitácora de operaciones | ❌ | ✅ |

### Distinción entre agregar y editar

Un **empleado** puede registrar un nuevo producto (cuando llega mercancía nueva al catálogo). Lo que no puede es modificar el precio ni la cantidad de un producto ya existente — esas operaciones cambian datos sensibles del negocio. Si el empleado necesita ingresar más unidades de un producto existente, se lo indica al administrador.

---

## 5. Casos de uso

### Módulo de Autenticación

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-A1 | Iniciar sesión | Todos | Correo y contraseña. El sistema redirige al panel según el rol. |
| CU-A2 | Cerrar sesión | Todos | Elimina la cookie de sesión. |
| CU-A3 | Cambiar contraseña | Todos | Actualiza contraseña verificando la actual. |

### Módulo de Inventario

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-01 | Ver inventario | Todos | Lista todos los productos activos con nombre, precio, stock y badge de alerta si el stock ≤ umbral mínimo. |
| CU-02 | Buscar producto | Todos | Búsqueda por nombre (parcial, insensible a mayúsculas) en tiempo real. |
| CU-03 | Agregar producto | Todos | Registra nombre (único), precio y cantidad inicial. |
| CU-04 | Editar producto | Admin | Modifica nombre, precio y/o cantidad de un producto existente. |
| CU-05 | Eliminar producto | Admin | Marca el producto como inactivo (soft delete). Si tiene ventas históricas, el historial lo conserva con el nombre. Requiere confirmación modal. |
| CU-06 | Configurar umbral | Admin | Actualiza el número de unidades mínimas para la alerta de stock bajo. El valor por defecto es 5 (RN-07). |

### Módulo de Ventas

| ID | Caso de uso | Actor | Descripción |
|---|---|---|---|
| CU-07 | Registrar venta | Todos | Selecciona producto (con buscador), ingresa cantidad, el sistema calcula el total, confirma. Valida stock antes de registrar. |
| CU-08 | Ver historial de ventas | Todos | Lista todas las ventas con fecha/hora, producto, cantidad, precio unitario y total. Filtrable por fecha y por producto. |

---

## 6. Requerimientos funcionales

| ID | Requerimiento |
|---|---|
| RF-B1 | El sistema debe poder ejecutarse sin Supabase configurado, sirviendo el seed de `data/` para login inicial del admin. |
| RF-B2 | El sistema debe ofrecer `/admin/db-setup` para diagnóstico, migrations y seed. |
| RF-01 | El sistema permite registrar nuevos productos indicando nombre, precio unitario y cantidad inicial. |
| RF-02 | El sistema muestra el inventario completo con nombre, precio y stock de cada producto. |
| RF-03 | El sistema permite registrar ventas con descuento automático del inventario. |
| RF-04 | El sistema impide registrar ventas si la cantidad supera el stock disponible. |
| RF-05 | El sistema permite al admin editar los datos completos de un producto existente. |
| RF-06 | El sistema permite al admin eliminar (desactivar) productos del catálogo. |
| RF-07 | El sistema genera un historial de ventas con fecha/hora, producto, cantidad y total. |
| RF-08 | El sistema permite buscar productos por nombre. |
| RF-09 | El sistema alerta visualmente cuando el stock cae por debajo del umbral mínimo configurable. |

---

## 7. Reglas de negocio

| ID | Regla | Implementación técnica |
|---|---|---|
| RN-01 | El stock no puede quedar negativo. Si la cantidad a vender supera el stock, la venta es rechazada. | Verificar `products.current_stock >= quantity` en el servidor. Retornar 409 con el stock disponible. |
| RN-02 | El precio debe ser un número positivo mayor que cero. | Validación Zod: `z.number().positive()`. CHECK en Postgres: `price > 0`. |
| RN-03 | Solo el administrador puede eliminar productos o modificar precios y cantidades de productos existentes. | `withRole(['admin'])` en los endpoints de edición y eliminación. El empleado puede usar `POST /api/products` para agregar nuevos, pero no `PUT /api/products/[id]`. |
| RN-04 | Cada venta queda registrada con fecha y hora del servidor. | Campo `sold_at TIMESTAMPTZ DEFAULT NOW()` en la tabla `sales`. El cliente nunca envía la fecha. |
| RN-05 | El nombre de un producto debe ser único entre los productos activos. | UNIQUE parcial en `products(LOWER(name)) WHERE is_active = true`. Capturar error de Postgres y retornar 409. |
| RN-06 | La cantidad vendida debe ser un entero positivo >= 1. | Validación Zod: `z.number().int().min(1)`. |
| RN-07 | El umbral de stock mínimo para alertas es 5 por defecto y es configurable por el admin. | Tabla `system_config` con campo `low_stock_threshold`. El sistema usa este valor para calcular las alertas en cada carga del inventario. |
| RN-08 | Un producto eliminado (inactivo) no aparece en el inventario activo ni puede recibir nuevas ventas. El historial de ventas anteriores lo referencia por nombre directamente (snapshot). | Soft delete: `is_active = false`. El campo `product_name` en la tabla `sales` es un snapshot del nombre al momento de vender. |

---

## 8. Stack tecnológico

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.x | Rutas, server components, API routes |
| Lenguaje | TypeScript | 5.x | Tipado estático |
| UI | React | 19.x | Componentes del cliente |
| Estilos | Tailwind CSS | 4.x | Utilidades y responsive |
| Animaciones | Framer Motion | 12.x | Transiciones |
| Validación | Zod | 4.x | Validación servidor y cliente |
| Autenticación | JWT (jose) + bcryptjs | — | Sesiones con cookie HttpOnly |
| Base de datos | Supabase Postgres | — | Datos estructurados |
| Cliente DB (migrations) | `pg` (node-postgres) | 8.x | SQL crudo desde bootstrap |
| Cliente DB (queries) | `@supabase/supabase-js` | 2.x | Queries del día a día |
| Auditoría | `@vercel/blob` | — | Logs append-only |
| Iconos | Lucide React | — | Iconografía |
| Deploy | Vercel | — | Hosting serverless |

### Variables de entorno requeridas

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
JWT_SECRET=
ADMIN_BOOTSTRAP_SECRET=
```

---

## 9. Arquitectura de persistencia

### 9.1 Destinos de persistencia

| Destino | Qué guarda | Por qué |
|---|---|---|
| **Supabase Postgres** | Usuarios, configuración del sistema, productos, ventas. | El inventario requiere queries confiables: validación de stock, historial filtrado por período y producto, alertas de stock bajo. |
| **Vercel Blob** | Auditoría de operaciones del admin (`audit/<YYYYMM>.json`). | Logs append-only sin necesidad de SQL. |
| **`data/` en el repo** | Seed inicial: admin + config por defecto + productos demo. | Read-only. Solo para arrancar antes del bootstrap. |

### 9.2 Reglas de oro

1. **`dataService.ts` es el ÚNICO punto de acceso a datos.**
2. **`registerSale` es una operación secuencial en el servidor**: verificar producto activo → verificar stock → descontar → insertar venta con snapshot de nombre y precio. El cliente nunca controla el stock.
3. **Snapshot en la venta**: `sales.product_name` y `sales.unit_price` se copian del producto al momento de vender. Si el producto cambia de nombre o precio después, el historial no se altera.
4. **CERO caché** en `/api/:path*`. Headers `no-store` desde `next.config.ts`.
5. **`get()` del SDK de Blob, nunca `fetch(url)`** para auditoría.
6. **Token de Blob accedido con función lazy** (`getBlobToken()`).

---

## 10. Bootstrap y migrations

### 10.1 Estructura de `data/` (solo semilla)

```
data/
  config.json     ← { "version": "1.0", "system_name": "SweetStock" }
  seed.json       ← {
                      "users": [{
                        email: "admin@sweetstock.com",
                        password_hash: "<bcrypt admin123>",
                        name: "Administrador",
                        role: "admin"
                      }],
                      "system_config": {
                        "low_stock_threshold": 5
                      },
                      "products": [
                        { "name": "Chicles de Menta", "price": 500, "current_stock": 80 },
                        { "name": "Bombones de Fresa", "price": 1200, "current_stock": 45 },
                        { "name": "Chocolatinas", "price": 2500, "current_stock": 30 }
                      ]
                    }
  README.md
```

### 10.2 Estructura de `supabase/migrations/`

```
supabase/migrations/
  0001_init_users.sql          ← Fase 1: users + _migrations
  0002_init_config.sql         ← Fase 3: system_config
  0003_init_products.sql       ← Fase 3: products
  0004_init_sales.sql          ← Fase 4: sales
```

---

## 11. Capa de datos unificada

`lib/dataService.ts` es el **único punto de acceso a datos** desde el resto de la aplicación.

### 11.1 Modos de operación

| Modo | Cuándo | Lecturas | Escrituras |
|---|---|---|---|
| **`seed`** | Sin migrations | `data/*.json` | Bloqueadas — solo login admin. |
| **`live`** | Con migrations | Supabase Postgres | Postgres + auditoría a Blob. |

### 11.2 Estructura interna de `lib/`

```
lib/
  dataService.ts       ← ÚNICO punto de acceso
  supabase.ts          ← Solo lo importa dataService
  blobAudit.ts         ← Solo lo importa dataService
  pgMigrate.ts         ← Solo lo importa /api/system/bootstrap
  seedReader.ts        ← Solo lo importa dataService en modo seed
  auth.ts
  withAuth.ts
  withRole.ts
  types.ts
  schemas.ts
  dateUtils.ts
```

### 11.3 API pública del `dataService`

```typescript
// Sistema
export async function getSystemMode(): Promise<'seed' | 'live'>
export async function getSystemConfig(): Promise<SystemConfig>
export async function updateSystemConfig(userId: string, data: UpdateConfigRequest): Promise<SystemConfig>

// Auth y usuarios
export async function getUserByEmail(email: string): Promise<User | null>
export async function getUserById(id: string): Promise<User | null>
export async function createUser(data: CreateUserRequest): Promise<User>
export async function updateUser(id: string, data: UpdateUserRequest): Promise<User>
export async function listUsers(): Promise<SafeUser[]>

// Productos
export async function getProducts(filters?: ProductFilters): Promise<Product[]>
export async function getProductById(id: string): Promise<Product | null>
export async function getProductByName(name: string): Promise<Product | null>
export async function createProduct(userId: string, data: CreateProductRequest): Promise<Product>
export async function updateProduct(id: string, userId: string, data: UpdateProductRequest): Promise<Product>
export async function deactivateProduct(id: string, userId: string): Promise<Product>
export async function getLowStockProducts(): Promise<Product[]>

// Ventas
export async function registerSale(userId: string, data: RegisterSaleRequest): Promise<Sale>
export async function getSales(filters?: SaleFilters): Promise<Sale[]>
export async function getDailySummary(): Promise<DailySummary>

// Auditoría
export async function recordAudit(entry: AuditEntry): Promise<void>
export async function readAuditMonth(yyyymm: string): Promise<AuditEntry[]>
```

### 11.4 Lógica crítica: `registerSale`

```typescript
export async function registerSale(userId: string, data: RegisterSaleRequest): Promise<Sale> {
  const { productId, quantity } = data;

  // 1. Verificar que el producto existe y está activo (RN-08)
  const product = await getProductById(productId);
  if (!product || !product.is_active) {
    throw new NotFoundError('Producto no encontrado o inactivo');
  }

  // 2. Verificar stock suficiente (RN-01)
  if (product.current_stock < quantity) {
    throw new ConflictError('Stock insuficiente', {
      available: product.current_stock,
      requested: quantity
    });
  }

  // 3. Descontar del inventario
  await supabase
    .from('products')
    .update({ current_stock: product.current_stock - quantity })
    .eq('id', productId);

  // 4. Insertar venta con snapshot de nombre y precio (RN-04, RN-08)
  const { data: sale } = await supabase
    .from('sales')
    .insert({
      product_id: productId,
      product_name: product.name,      // snapshot del nombre
      unit_price: product.price,       // snapshot del precio
      quantity,
      total: product.price * quantity,
      sold_by: userId,
      // sold_at se asigna automáticamente por DEFAULT NOW() en Postgres
    })
    .select()
    .single();

  // 5. Auditoría
  await recordAudit({
    action: 'register_sale',
    entity: 'sale',
    entity_id: sale.id,
    summary: `Venta: ${quantity} x ${product.name} = $${(product.price * quantity).toLocaleString('es-CO')}`,
  });

  return sale;
}
```

---

## 12. Modelo de datos — Supabase Postgres

### Diagrama de entidades

```
users ──< products (created_by, updated_by)
users ──< sales (sold_by)
products ──< sales (product_id — referencia histórica)
system_config (1 sola fila — umbral configurable)
```

### Migration `0001_init_users.sql`

```sql
CREATE TABLE IF NOT EXISTS users (
  id                   UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name                 VARCHAR(100) NOT NULL,
  email                VARCHAR(255) UNIQUE NOT NULL,
  password_hash        TEXT         NOT NULL,
  role                 VARCHAR(10)  NOT NULL DEFAULT 'empleado'
                       CHECK (role IN ('empleado', 'admin')),
  is_active            BOOLEAN      DEFAULT true,
  must_change_password BOOLEAN      DEFAULT false,
  last_login_at        TIMESTAMPTZ,
  created_at           TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS _migrations (
  id         SERIAL       PRIMARY KEY,
  filename   VARCHAR(255) UNIQUE NOT NULL,
  applied_at TIMESTAMPTZ  DEFAULT NOW()
);
```

### Migration `0002_init_config.sql`

```sql
-- Configuración global del sistema (1 sola fila)
CREATE TABLE IF NOT EXISTS system_config (
  id                  SERIAL    PRIMARY KEY,
  low_stock_threshold INTEGER   NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  updated_by          UUID      REFERENCES users(id) ON DELETE SET NULL,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### Migration `0003_init_products.sql`

```sql
CREATE TABLE IF NOT EXISTS products (
  id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  name          VARCHAR(150)  NOT NULL,
  price         DECIMAL(10,2) NOT NULL CHECK (price > 0),   -- RN-02
  current_stock INTEGER       NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  is_active     BOOLEAN       DEFAULT true,
  created_by    UUID          REFERENCES users(id) ON DELETE SET NULL,
  updated_by    UUID          REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ   DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   DEFAULT NOW()
);

-- RN-05: nombre único entre productos activos (insensible a mayúsculas)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_name_unique
  ON products(LOWER(name))
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_stock  ON products(current_stock);
```

### Migration `0004_init_sales.sql`

```sql
CREATE TABLE IF NOT EXISTS sales (
  id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id    UUID          REFERENCES products(id) ON DELETE SET NULL,
  product_name  VARCHAR(150)  NOT NULL,   -- snapshot del nombre al vender (RN-08)
  unit_price    DECIMAL(10,2) NOT NULL,   -- snapshot del precio al vender
  quantity      INTEGER       NOT NULL CHECK (quantity >= 1),  -- RN-06
  total         DECIMAL(12,2) NOT NULL,
  sold_by       UUID          REFERENCES users(id) ON DELETE SET NULL,
  sold_at       TIMESTAMPTZ   DEFAULT NOW()  -- RN-04: fecha del servidor
);

CREATE INDEX IF NOT EXISTS idx_sales_product ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_date    ON sales(sold_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_user    ON sales(sold_by);
```

> **Snapshot de nombre y precio:** si un producto se renombra o su precio cambia después de la venta, el historial conserva el nombre y precio originales de la transacción. Esto es crítico para la integridad financiera del historial.

---

## 13. Auditoría en Vercel Blob

### 13.1 Estructura de cada entrada

```typescript
type AuditEntry = {
  id: string;
  timestamp: string;
  user_id: string;
  user_email: string;
  user_role: 'empleado' | 'admin';
  action:
    | 'login' | 'logout'
    | 'create_product' | 'update_product' | 'deactivate_product'
    | 'register_sale'
    | 'update_config'
    | 'create_user' | 'toggle_user'
    | 'bootstrap';
  entity: 'product' | 'sale' | 'config' | 'user' | 'system';
  entity_id?: string;
  summary: string;  // "Bombones de Fresa actualizado: precio $1.200 → $1.500"
  metadata?: Record<string, unknown>;
};
```

---

## 14. Arquitectura de rutas

### Estructura de carpetas

```
app/
  layout.tsx
  page.tsx                      ← Redirige a /inventory o /login
  login/page.tsx                ← Sin link de registro
  inventory/
    page.tsx                    ← Inventario con alerta de stock bajo
    new/page.tsx                ← Agregar producto
    [id]/edit/page.tsx          ← Editar producto (solo admin)
  sales/
    page.tsx                    ← Registrar venta + historial del día
    history/page.tsx            ← Historial completo con filtros
  config/page.tsx               ← Configurar umbral de stock mínimo (solo admin)
  profile/page.tsx              ← Cambiar contraseña
  admin/
    db-setup/page.tsx
    users/page.tsx
    audit/page.tsx

  api/
    system/bootstrap | diagnose | mode
    auth/login | logout | me | change-password
    config/route.ts             ← GET | PUT (admin)
    products/
      route.ts                  ← GET lista | POST crear
      search/route.ts           ← GET búsqueda por nombre
      [id]/route.ts             ← GET | PUT (admin) | DELETE soft (admin)
    sales/
      route.ts                  ← POST registrar | GET historial del día
      history/route.ts          ← GET historial completo con filtros
      summary/route.ts          ← GET resumen del día
    users/route.ts | [id]/route.ts
    audit/route.ts

components/
  ui/
  layout/                       ← AppLayout, Sidebar, SeedModeBanner
  inventory/                    ← ProductCard, ProductTable, StockBadge,
                                   LowStockAlert, ProductForm
  sales/                        ← SaleForm, SaleRow, DailySummary
  admin/                        ← DiagnosticPanel, BootstrapPanel, AuditViewer

lib/
  dataService.ts | supabase.ts | blobAudit.ts | pgMigrate.ts | seedReader.ts
  auth.ts | withAuth.ts | withRole.ts | types.ts | schemas.ts | dateUtils.ts
```

---

## 15. Requerimientos no funcionales

| ID | Requerimiento |
|---|---|
| RNF-01 | El inventario debe cargarse y reflejar el stock actualizado en menos de 2 segundos. |
| RNF-02 | El registro de una venta debe completarse en menos de 1 segundo. |
| RNF-03 | La interfaz debe ser funcional en celulares (empleados pueden registrar ventas desde el celular). |
| RNF-04 | Las contraseñas deben hashearse con bcrypt. |
| RNF-05 | Las sesiones deben gestionarse con JWT en cookie HttpOnly. |
| RNF-06 | Los precios deben mostrarse en formato COP (`$X.XXX`) en toda la interfaz. |

---

## 16. Flujos de usuario y de trabajo

### Flujo de bootstrap

Login admin del seed → banner modo seed → `/admin/db-setup` → bootstrap → modo live. El bootstrap inserta `system_config` y los 3 productos demo.

### Flujo de venta

| Paso | Actor | Acción |
|---|---|---|
| 1 | Empleado | Accede a /sales. Busca el producto en el campo de búsqueda. |
| 2 | Empleado | Selecciona el producto. El sistema muestra stock actual y precio. |
| 3 | Empleado | Ingresa la cantidad. El sistema calcula el total en tiempo real. |
| 4 | Empleado | Confirma. El servidor verifica stock, descuenta y registra la venta. |
| 5 | Sistema | Si el stock resultante ≤ umbral: el producto aparece con alerta en el inventario. |
| 6 | Empleado | Ve el resumen: "✓ Venta registrada — $X.XXX". |

---

## 17. Diseño de interfaz

### Identidad visual del Login

SweetStock es una herramienta para una dulcería. El diseño transmite dulzura, color y modernidad — diferente al tono institucional de otros sistemas del curso.

| Elemento | Especificación |
|---|---|
| **Layout** | Pantalla completa. Formulario centrado. |
| **Fondo** | Rosa suave degradado (`from-pink-100 to-purple-100`). |
| **Tarjeta** | Fondo blanco, `border-radius: 16px`, sombra rosa suave, borde superior de 4px en rosa primario (`#EC4899`), max-w-sm. |
| **Logo** | SVG de un cupcake estilizado con un ícono de lista de inventario superpuesto, en rosa (`#EC4899`), 52px. |
| **Nombre** | "SweetStock 🍬" en Inter Bold 28px, rosa oscuro (`#9D174D`). |
| **Tagline** | "Inventario dulce, control real." Inter Regular 13px, slate (`#6B7280`). |
| **Campos** | Borde gris (`#D1D5DB`), focus en rosa (`#EC4899`). |
| **Botón principal** | bg `#EC4899`, texto blanco, hover `#DB2777`. |
| **Pie** | Sin link de registro. |
| **Animación** | Framer Motion: `opacity: 0→1`, `y: 8→0`, 0.4s. |

### Paleta de colores

| Elemento | Hex |
|---|---|
| Primario (rosa) | `#EC4899` |
| Primario oscuro | `#DB2777` |
| Primario claro | `#FCE7F3` |
| Secundario (violeta) | `#8B5CF6` |
| Fondo principal | `#FFF5F8` |
| Fondo de tarjetas | `#FFFFFF` |
| Fondo alterno | `#FDF4FF` |
| Texto principal | `#1F2937` |
| Texto secundario | `#6B7280` |
| Stock OK | `#16A34A` + fondo `#F0FDF4` |
| Stock bajo | `#D97706` + fondo `#FFFBEB` |
| Stock agotado (0) | `#DC2626` + fondo `#FEF2F2` |
| Venta exitosa | `#16A34A` |
| Error | `#DC2626` |
| Bordes | `#F3E8FF` |
| Banner modo seed | Fondo `#FEF3C7`, texto `#92400E`, borde `#F59E0B` |

### Componentes clave

| Componente | Descripción |
|---|---|
| `ProductCard` | Tarjeta de producto: nombre, precio en COP, stock con `StockBadge`. Botón "Editar" visible solo para admin. En mobile: cards; en desktop: tabla. |
| `StockBadge` | Verde (> umbral), naranja (1 a umbral), rojo "AGOTADO" (0). |
| `LowStockAlert` | Banner superior naranja cuando hay productos con stock ≤ umbral. Lista los productos en alerta. |
| `SaleForm` | Buscador de producto con autocompletado (debounce 300ms), input de cantidad, total en tiempo real, botón "Registrar venta". |
| `ProductForm` | Formulario de creación/edición: nombre, precio, cantidad. Para empleados, solo nombre y precio al crear (no edición). |

### Diseño responsivo

| Dispositivo | Comportamiento |
|---|---|
| Computador (≥1024px) | Sidebar fijo. Inventario en tabla. SaleForm en panel lateral. |
| Tablet (768–1023px) | Sidebar colapsable. Inventario en tabla reducida. |
| Celular (<768px) | Bottom nav (Inventario, Ventas, Historial, Perfil). Inventario en cards. SaleForm en pantalla completa. |

---

## 18. Plan de fases de implementación

### Fase 1 — Bootstrap, Login y `dataService` base
> Rol: Ingeniero Fullstack Senior — Arquitecto del sistema y seguridad

| # | Tarea |
|---|---|
| 1.1 | Instalar: `bcryptjs jose @supabase/supabase-js @vercel/blob pg @types/bcryptjs @types/pg` |
| 1.2 | Crear proyecto en Supabase. Blob Store privado. Variables de entorno. |
| 1.3 | Crear `data/seed.json` con admin (password `admin123` hasheado), `system_config` (umbral 5) y los 3 productos demo. |
| 1.4 | Crear `supabase/migrations/0001_init_users.sql`. |
| 1.5 | Crear `lib/supabase.ts`, `lib/blobAudit.ts` (getBlobToken lazy, withFileLock, get() del SDK), `lib/pgMigrate.ts`, `lib/seedReader.ts`. |
| 1.6 | Crear `lib/dataService.ts` con `getSystemMode`, auth de usuarios, `getSystemConfig` y `recordAudit`. |
| 1.7 | Crear `lib/auth.ts`, `lib/withAuth.ts`, `lib/withRole.ts`. |
| 1.8 | Crear `next.config.ts` con headers `no-store` para `/api/:path*`. |
| 1.9 | Crear API Routes: bootstrap, diagnose, mode, login, logout, me, change-password. |
| 1.10 | Crear `app/login/page.tsx` con la identidad visual de SweetStock: fondo rosa degradado, logo de cupcake, paleta rosa/violeta. Sin link de registro. |
| 1.11 | `npm run typecheck` sin errores. Probar: login admin del seed → modo seed → cookie HttpOnly. |

---

### Fase 2 — Dashboard, Layout y bootstrap
> Rol: Diseñador Frontend Obsesivo + Ingeniero de Sistemas

| # | Tarea |
|---|---|
| 2.1 | Crear componentes UI base: Button, Card, Badge, Toast, Modal, EmptyState, Table. |
| 2.2 | Configurar variables CSS de la paleta rosa en `globals.css`. Inter con `next/font`. |
| 2.3 | Crear `AppLayout.tsx`: sidebar (desktop), bottom nav (mobile). Empleado ve: Inventario, Ventas, Historial, Perfil. Admin ve además: Configuración y Administración. |
| 2.4 | Crear `/admin/db-setup/page.tsx` con diagnóstico y bootstrap. |
| 2.5 | Crear `SeedModeBanner.tsx`. |
| 2.6 | Crear `middleware.ts`: protege rutas privadas, `/admin/*` y `/config` solo para admin. |
| 2.7 | Probar: bootstrap → modo live → los 3 productos demo y `system_config` insertados. |

---

### Fase 3 — Inventario (Productos y Configuración)
> Rol: Ingeniero Fullstack — Catálogo de productos con control de acceso por rol

| # | Tarea |
|---|---|
| 3.1 | Crear migrations 0002, 0003. Aplicar desde `/admin/db-setup`. |
| 3.2 | Agregar tipos `Product`, `SystemConfig`, `CreateProductRequest`, `UpdateProductRequest` y schemas Zod (RN-02, RN-05, RN-06). |
| 3.3 | Extender `dataService`: `getProducts` (con `is_active=true`, ordenado por nombre), `getProductById`, `getProductByName` (ILIKE para búsqueda), `createProduct` (captura UNIQUE violation → 409 con "Ya existe un producto con ese nombre"), `updateProduct` (solo admin — RN-03), `deactivateProduct` (soft delete — solo admin), `getLowStockProducts`, `updateSystemConfig`. |
| 3.4 | API Routes: `GET/POST /api/products`, `GET /api/products/search?q=`, `GET/PUT/DELETE /api/products/[id]` (PUT y DELETE con `withRole(['admin'])`), `GET/PUT /api/config`. |
| 3.5 | Crear `app/inventory/page.tsx`: tabla/cards con `StockBadge`. `LowStockAlert` si hay productos bajo el umbral. Botón "Nuevo producto" (ambos roles). Botones "Editar" solo visibles para admin. |
| 3.6 | Crear `app/inventory/new/page.tsx`: formulario de nuevo producto. |
| 3.7 | Crear `app/inventory/[id]/edit/page.tsx` (solo admin): editar nombre, precio y cantidad. |
| 3.8 | Crear `app/config/page.tsx` (solo admin): input del umbral de stock mínimo. Al guardar muestra los productos que quedarían en alerta con el nuevo valor. |
| 3.9 | Verificar RN-05: crear dos productos con el mismo nombre → 409. Con distinto nombre → OK. |
| 3.10 | Verificar RN-03: intentar PUT /api/products/[id] como empleado → 403. |
| 3.11 | Verificar umbral configurable: cambiar de 5 a 10 → los productos con stock ≤ 10 aparecen en alerta. |

---

### Fase 4 — Ventas e Historial
> Rol: Ingeniero Fullstack — Registro de ventas y trazabilidad

| # | Tarea |
|---|---|
| 4.1 | Crear migration 0004. Aplicar desde `/admin/db-setup`. |
| 4.2 | Agregar tipos `Sale`, `RegisterSaleRequest`, `DailySummary` y schemas Zod (RN-01, RN-06). |
| 4.3 | Extender `dataService`: `registerSale` (secuencia completa: verificar activo → verificar stock → descontar → insertar con snapshots → auditoría), `getSales`, `getDailySummary`. |
| 4.4 | API Routes: `POST /api/sales` (ambos roles), `GET /api/sales` (historial del día), `GET /api/sales/history?from=&to=&productId=`, `GET /api/sales/summary`. |
| 4.5 | Crear `app/sales/page.tsx`: `SaleForm` con buscador de producto (debounce 300ms → llama `/api/products/search`), cantidad, total en tiempo real, botón "Registrar venta". Abajo: historial del día. |
| 4.6 | Al confirmar venta exitosa: toast rosa "✓ Venta registrada — $X.XXX". El formulario se limpia. El historial del día se actualiza. |
| 4.7 | Crear `app/sales/history/page.tsx`: filtros por rango de fechas y por producto. Tabla con fecha/hora, producto, cantidad, precio unitario y total. |
| 4.8 | Verificar RN-01: vender más de lo disponible → 409 con el stock real. |
| 4.9 | Verificar snapshot: cambiar el precio de un producto → hacer una venta → el historial anterior conserva el precio anterior. |
| 4.10 | Verificar RN-04: `sold_at` lo asigna el servidor (DEFAULT NOW()), no el cliente. |

---

### Fase 5 — Administración y Pulido Final
> Rol: Diseñador Frontend Obsesivo + Ingeniero Fullstack

| # | Tarea |
|---|---|
| 5.1 | API Routes con `withRole(['admin'])`: `GET/POST /api/users`, `GET/PUT /api/users/[id]`. POST genera contraseña temporal, `must_change_password=true`, retorna en claro una sola vez con modal. |
| 5.2 | En login: si `must_change_password=true` → redirect a `/profile` para cambio obligatorio. |
| 5.3 | Crear `app/admin/users/page.tsx`: tabla de usuarios con nombre, email, rol y estado. Acciones: activar/suspender. |
| 5.4 | Crear `app/admin/audit/page.tsx`: `AuditViewer` con selector de mes. Solo admin. |
| 5.5 | Empty states: inventario vacío ("¡Agrega el primer producto de tu dulcería!"), sin ventas hoy ("Aún no hay ventas registradas hoy"), historial vacío para filtros aplicados. Mensajes con el tono de SweetStock. |
| 5.6 | Manejo de errores global: 401 (sesión expirada), 403 (sin permisos de rol), 409 (stock insuficiente — alerta con el disponible real, no toast genérico), 409 (nombre duplicado), 500. |
| 5.7 | Verificar precios en formato COP en toda la interfaz. |
| 5.8 | Verificar el flujo de venta en celular: buscador → seleccionar → cantidad → confirmar. Botones ≥ 44px. |
| 5.9 | `npm run typecheck`, `npm run lint`, `npm run build` — cero errores. |
| 5.10 | Deploy en Vercel con todas las variables de entorno. |
| 5.11 | Probar en producción con ambos roles: admin hace bootstrap → crea empleado → empleado registra venta → admin edita precio → ver que historial anterior no cambia → admin elimina producto → verificar que el historial de ventas de ese producto sigue visible. |

---

## 19. Estrategia de seguridad

### Flujo de login

```
1. Validar body con Zod
2. getUserByEmail(email)  ← seed o Postgres
3. Verificar is_active y bcrypt.compare()
4. Si must_change_password: flag en JWT → redirect /profile
5. JWT({ userId, role, email }, 24h) → cookie HttpOnly, Secure, SameSite=Strict
6. recordAudit({ action: 'login', ... })
7. Retornar SafeUser
```

### Integridad de `registerSale`

El servidor es la única fuente de verdad. El cliente envía `{ productId, quantity }`. El servidor obtiene el precio actual del producto en la misma operación — el cliente nunca puede enviar el precio.

---

## 20. Restricciones del sistema

| ID | Restricción | Descripción |
|---|---|---|
| RS-01 | Sin registro público | Los usuarios los crea el admin. |
| RS-02 | Sin recuperación de contraseña por correo | Solo cambio de contraseña autenticado. No hay Resend en v1. |
| RS-03 | Una dulcería por instalación | No hay multitenancy. Un negocio, una instancia. |
| RS-04 | Soft delete de productos | Los productos eliminados quedan `is_active=false`. El historial de ventas los referencia por nombre snapshot. |
| RS-05 | Bootstrap obligatorio | Hasta aplicar migrations + seed, solo permite login admin. |

---

## 21. Glosario

| Término | Definición |
|---|---|
| **Stock** | Cantidad disponible de un producto en el inventario. |
| **Umbral mínimo** | Cantidad de unidades por debajo de la cual el sistema genera alerta visual. Configurable por el admin (default 5). |
| **Snapshot de venta** | Copia del nombre y precio del producto al momento de la venta. Preserva el historial aunque el producto cambie después. |
| **Soft delete** | Marcar un producto como inactivo (`is_active=false`) en lugar de eliminarlo físicamente. Preserva el historial de ventas. |
| **Bootstrap** | Proceso inicial donde el admin aplica migrations y carga el seed. |
| **Modo seed** | Estado antes del bootstrap. Solo permite login admin. |
| **dataService** | Único punto de acceso a datos. |
| **JWT** | JSON Web Token — credencial firmada en cookie HttpOnly. |
| **Vercel Blob** | Servicio para archivos. Aquí guarda la auditoría de operaciones. |

---

> Última actualización: Mayo 2026
> María Robles | Doc: 1082929927
> Curso: Lógica y Programación — SIST0200
