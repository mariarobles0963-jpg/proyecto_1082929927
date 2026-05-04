# PROMPTS DE IMPLEMENTACIÓN — SweetStock
> Prompts secuenciales para construir el sistema fase por fase
> Plan de referencia: `doc/PLAN_SWEETSTOCK.md`
> Estado de progreso: `doc/ESTADO_EJECUCION_SWEETSTOCK.md`

---

## INSTRUCCIONES DE USO

1. Ejecuta primero el **Prompt 0** — crea el archivo de seguimiento del proyecto.
2. Para cada fase siguiente, copia el bloque completo y pégalo en tu sesión de IA.
3. La IA leerá el plan, ejecutará la fase y dejará el estado actualizado.
4. No avances a la siguiente fase hasta que el resumen esté generado y el estado marcado como completado.

---

## PROTOCOLO DE EJECUCIÓN — APLICA A TODOS LOS PROMPTS

```
ANTES de escribir código:
1. Leer doc/PLAN_SWEETSTOCK.md
2. Leer doc/ESTADO_EJECUCION_SWEETSTOCK.md
3. Verificar que las fases previas estén completadas
4. Registrar inicio: estado En progreso + fecha y hora

DESPUÉS de completar el trabajo:
5. Registrar cierre: estado Completada + fecha y hora
6. Documentar: acciones ejecutadas, archivos creados/modificados, observaciones
7. Crear doc/RESUMEN_FASE_N_NOMBRE.md con: objetivo, acciones, archivos,
   decisiones técnicas y por qué, problemas encontrados y resolución,
   qué se probó y resultado, estado final EXITOSO / CON OBSERVACIONES / FALLIDO,
   prerrequisitos para la siguiente fase

NUNCA avanzar sin completar este protocolo.
```

---

---

## PROMPT 0 — Crear archivo de estado del proyecto

```
Actúa como Ingeniero de Proyectos. Tu única tarea es leer
doc/PLAN_SWEETSTOCK.md y crear el archivo
doc/ESTADO_EJECUCION_SWEETSTOCK.md.

El archivo debe contener:
- Información del proyecto: nombre, archivos de referencia, estudiante,
  fecha de inicio, estado general
- Dashboard de fases: tabla con todas las fases del plan incluyendo número,
  nombre, rol asignado, estado (todas inician como Pendiente), columnas para
  fecha de inicio, fecha de cierre y archivo de resumen
- Leyenda de estados: Pendiente, En progreso, Completada, Bloqueada, Pausada
- Historial de ejecución: sección append-only con fecha, hora, fase, evento y detalle

Toma los datos directamente del plan. No inventes fases ni cambies nombres ni roles.

Cuando termines escribe en el chat el nombre de cada fase detectada y confirma
que el archivo está listo para comenzar la Fase 1.

Tu trabajo termina aquí.
```

---

---

## PROMPT FASE 1 — Bootstrap, Login y `dataService` base

### Rol: `Ingeniero Fullstack Senior — Arquitecto del sistema y seguridad`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack Senior especializado en
arquitectura de persistencia serverless, autenticación segura con JWT y
diseño de la primera experiencia visual del usuario en aplicaciones de
gestión para pequeños negocios.

Tu mentalidad: SweetStock es la herramienta que reemplaza el cuaderno de
inventario de una dulcería. La dueña y sus empleadas la usarán todos los
días, muchas veces desde el celular. La arquitectura tiene que ser sólida
y el login tiene que transmitir el carácter del negocio: colorido, amigable,
femenino sin ser infantil.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SWEETSTOCK.md — secciones 8 (stack y variables de entorno —
   nota que SweetStock NO usa Resend, solo las variables estándar), 9
   (reglas de oro — especialmente la regla 2 sobre registerSale como
   operación secuencial y la regla 3 sobre snapshots), 10 (estructura del
   seed.json con el admin, la system_config y los 3 productos demo), 13
   (blobAudit con getBlobToken lazy y withFileLock) y 17 (identidad visual
   del login — fondo rosa degradado, cupcake, paleta rosa/violeta)
2. doc/ESTADO_EJECUCION_SWEETSTOCK.md — registra el inicio de la Fase 1

Puntos críticos que no puedes ignorar:

— SweetStock tiene DOS roles: 'admin' y 'empleado'. El JWT incluye el rol
  (como en StockControl y BusetaApp) porque cada usuario tiene un rol fijo.
  JWT({ userId, role, email }, '24h').

— No hay registro público. El formulario de login no tiene link de
  "Crear cuenta". Los usuarios los crea solo la administradora.

— El seed.json tiene TRES secciones: users (el admin), system_config
  (umbral 5) y products (los 3 productos demo). El seedReader debe exponer
  las tres secciones. En modo seed, el sistema puede mostrar el inventario
  demo y la configuración al admin para que tenga contexto antes del
  bootstrap.

— La tabla system_config tiene solo 1 fila. getDailyConfig usa
  SELECT * FROM system_config LIMIT 1. Si no existe: retornar los valores
  por defecto del seed. Esta tabla se inserta durante el bootstrap.

— El token de Blob lazy, get() del SDK de Blob, withFileLock — patrón
  estándar del curso.

— La identidad visual del login: fondo degradado rosa-violeta claro
  (from-pink-100 to-purple-100), tarjeta blanca con borde superior rosa,
  logo de cupcake SVG, nombre con emoji 🍬. Sección 17 del plan.

Al terminar:
- npm run typecheck — cero errores
- Probar: login admin del seed → JWT con role='admin' → modo seed confirmado
- Registra el cierre en ESTADO_EJECUCION_SWEETSTOCK.md
- Crea doc/RESUMEN_FASE_1_BOOTSTRAP.md

Tu trabajo termina aquí. No avances a la Fase 2.
```

---

---

## PROMPT FASE 2 — Dashboard, Layout y bootstrap

### Rol: `Diseñador Frontend Obsesivo + Ingeniero de Sistemas`

---

```
Actúa EXCLUSIVAMENTE como Diseñador Frontend Obsesivo e Ingeniero de Sistemas
trabajando en conjunto. SweetStock tiene una identidad visual propia —
rosa, violeta, dulce — que tiene que estar presente en cada pantalla, no
solo en el login. El sidebar y el bottom nav tienen que transmitir el mismo
carácter cálido del sistema.

Tu mentalidad: una empleada de dulcería que abre SweetStock desde el celular
no está pensando en arquitectura de software — está pensando en atender a
la clienta que tiene enfrente. La interfaz tiene que ser tan intuitiva que
no necesite capacitación.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SWEETSTOCK.md — paleta de colores completa (sección 17 — rosa
   como primario, violeta como secundario), el bottom nav por rol (empleado
   ve Inventario/Ventas/Historial/Perfil; admin ve además Configuración y
   Administración), los componentes LowStockAlert y SeedModeBanner, y la
   Fase 2 del plan
2. doc/ESTADO_EJECUCION_SWEETSTOCK.md — verifica Fase 1 completada,
   registra inicio de Fase 2

Puntos críticos que no puedes ignorar:

— El sidebar del empleado tiene exactamente 4 ítems: Inventario, Ventas,
  Historial, Perfil. El admin ve además Configuración (umbral de stock)
  y Administración (usuarios + auditoría). El empleado nunca ve estas
  opciones adicionales — ni en el sidebar ni en ninguna otra parte.

— Los colores del sistema son específicos: rosa `#EC4899` como primario,
  violeta `#8B5CF6` como acento. Los íconos del sidebar pueden tener el
  color del módulo correspondiente para dar carácter visual. Configurar
  las variables CSS en globals.css desde el principio para que todas las
  fases siguientes las hereden.

— El LowStockAlert es un banner naranja (#D97706 / #FFFBEB) que aparece
  en la parte superior del inventario cuando hay productos con stock ≤ umbral.
  Muestra los nombres de los productos en alerta. Si no hay alertas, no
  renderiza nada.

— La página /admin/db-setup informa exactamente: "Aplicará 4 migrations
  y cargará: 1 usuario admin, la configuración inicial (umbral 5 unidades)
  y 3 productos demo (Chicles de Menta, Bombones de Fresa, Chocolatinas)."

— El middleware.ts protege /admin/* y /config solo para role='admin'.
  El empleado que accede directamente a /config → redirect a /inventory.

Al terminar:
- Verificar el sidebar con ambos roles en 375px y 1280px
- Probar que el empleado no puede navegar a /config ni /admin/*
- Bootstrap completo: modo live, los 3 productos demo visibles, system_config
  insertada
- npm run typecheck
- Registra el cierre y crea doc/RESUMEN_FASE_2_LAYOUT.md

Tu trabajo termina aquí. No avances a la Fase 3.
```

---

---

## PROMPT FASE 3 — Inventario (Productos y Configuración)

### Rol: `Ingeniero Fullstack — Catálogo de productos con umbral configurable`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack especializado en gestión de
catálogos de productos para pequeño comercio, con validaciones de integridad
y control de acceso diferenciado por rol.

Tu mentalidad: en SweetStock el inventario es el corazón del sistema. La
dueña necesita saber en segundos qué le queda de cada producto y cuáles
están por agotarse. La alerta visual de stock bajo es la función más
importante del módulo — si no está bien implementada, la dulcería se queda
sin stock sin saberlo.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SWEETSTOCK.md — migrations 0002 y 0003 (system_config y
   products), el UNIQUE parcial en LOWER(name) WHERE is_active=true, reglas
   RN-02, RN-03, RN-05, RN-07 y RN-08, los componentes ProductCard,
   StockBadge y LowStockAlert (sección 17), y la Fase 3 completa
2. doc/ESTADO_EJECUCION_SWEETSTOCK.md — verifica Fases 1 y 2 completadas,
   registra inicio de Fase 3

Puntos críticos que no puedes ignorar:

— RN-07 — umbral configurable: getLowStockProducts() no usa una constante
  de 5 unidades. Hace:
  const config = await getSystemConfig();
  SELECT * FROM products WHERE is_active=true AND current_stock <= config.low_stock_threshold
  Si el admin cambia el umbral de 5 a 10, los productos con stock ≤ 10
  pasan a estar en alerta inmediatamente. El LowStockAlert se actualiza
  en cada carga de la página.

— RN-03 — distinción entre crear y editar:
  El empleado puede hacer POST /api/products (crear nuevo producto).
  El empleado NO puede hacer PUT /api/products/[id] (editar existente).
  Verificar con withRole(['admin']) en el endpoint PUT. El endpoint DELETE
  también es solo admin.
  El formulario de creación en /inventory/new es accesible para ambos roles.
  El botón "Editar" en las tarjetas del inventario solo aparece para admin.

— RN-05 — UNIQUE parcial en LOWER(name) WHERE is_active=true: un producto
  desactivado libera su nombre para uno nuevo. Al capturar el error de
  Postgres (código '23505'): retornar 409 con mensaje "Ya existe un producto
  activo con ese nombre. Elige otro nombre o reactiva el existente."

— Soft delete (RN-08): deactivateProduct hace UPDATE products SET
  is_active=false WHERE id=?. El modal de confirmación muestra el nombre
  del producto: "¿Eliminar 'Bombones de Fresa' del catálogo? Las ventas
  anteriores de este producto se conservan en el historial."

— La página de configuración /config muestra el umbral actual y permite
  cambiarlo. Al lado del input: un preview en tiempo real de cuántos
  productos quedarían en alerta con ese nuevo valor. Esto ayuda a la admin
  a elegir un umbral sensato antes de guardar.

Al terminar:
- Verificar los 3 productos demo del bootstrap en el inventario
- Crear un producto con el mismo nombre que otro activo → 409
- Crear un producto, desactivarlo, crear uno nuevo con el mismo nombre → OK
- Cambiar el umbral de 5 a 15 → verificar que más productos entran en alerta
- Verificar que el empleado recibe 403 al intentar PUT /api/products/[id]
- npm run typecheck
- Registra el cierre y crea doc/RESUMEN_FASE_3_INVENTARIO.md

Tu trabajo termina aquí. No avances a la Fase 4.
```

---

---

## PROMPT FASE 4 — Ventas e Historial

### Rol: `Ingeniero Fullstack — Registro de ventas con snapshots y trazabilidad`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack especializado en flujos de
punto de venta para pequeño comercio, con validaciones de stock en tiempo
real y diseño de historial con integridad financiera inmutable.

Tu mentalidad: el registro de ventas es la operación más frecuente del
sistema. La empleada lo hace docenas de veces al día. El formulario tiene
que ser el más rápido de toda la app: busco el producto, escribo la cantidad,
confirmo. En tres pasos. Los snapshots son la garantía de que el historial
del mes pasado no cambia aunque hoy la dueña suba el precio de las chocolatinas.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SWEETSTOCK.md — migration 0004 (sales con product_name y
   unit_price como snapshots), reglas RN-01, RN-04, RN-06 y RN-08,
   la implementación completa de registerSale (sección 11.4 — lee el código
   comentado paso a paso), el componente SaleForm con debounce, y la Fase 4
2. doc/ESTADO_EJECUCION_SWEETSTOCK.md — verifica Fases 1 a 3 completadas,
   registra inicio de Fase 4

Puntos críticos que no puedes ignorar:

— registerSale en el dataService sigue esta secuencia EXACTA:
  (1) Verificar que el producto existe y tiene is_active=true (RN-08).
  (2) Verificar que current_stock >= quantity (RN-01).
  (3) UPDATE products SET current_stock = current_stock - quantity.
  (4) INSERT INTO sales con: product_id (FK para joins futuros),
      product_name = product.name (snapshot), unit_price = product.price
      (snapshot), quantity, total = price * quantity, sold_by = userId.
      sold_at lo asigna Postgres por DEFAULT NOW() — el cliente NUNCA envía
      la fecha (RN-04).
  (5) recordAudit.
  El cliente envía solo { productId, quantity }. El servidor obtiene el
  precio de la DB — el cliente nunca puede modificar el precio de una venta.

— Snapshots en acción — por qué importan (RN-08): si mañana la admin
  cambia el precio de Bombones de Fresa de $1.200 a $1.500, las ventas
  de hoy en el historial seguirán mostrando $1.200. Sin el snapshot, el
  historial cambiaría retroactivamente. Verificar esto explícitamente en
  las pruebas de esta fase.

— El SaleForm usa debounce de 300ms para el buscador de producto. Al
  escribir "bom", aparece el dropdown con "Bombones de Fresa". Al seleccionar,
  el campo muestra el stock actual disponible y el precio unitario (solo
  lectura — el empleado no puede cambiar el precio al vender). Al escribir
  la cantidad, el total se calcula en tiempo real (precio × cantidad).
  Si la cantidad supera el stock, el total aparece en rojo y el botón
  "Registrar venta" se deshabilita con el mensaje "Solo quedan X unidades".

— Al confirmar la venta exitosa: toast rosa "✓ Venta registrada — $X.XXX".
  El formulario se limpia completamente. El historial del día se actualiza.

— GET /api/sales/history acepta query params: from (fecha inicio), to
  (fecha fin) y productId (opcional). Si no se especifica el rango, muestra
  el mes actual por defecto.

Al terminar:
- Registrar una venta y verificar que el stock del producto disminuyó
- Intentar vender más de lo disponible → 409 con el stock real en el mensaje
- Cambiar el precio de un producto → hacer una nueva venta → verificar que
  el historial anterior conserva el precio anterior (snapshot funcionando)
- Verificar que sold_at en la DB es la hora del servidor, no del cliente
- Verificar los precios en formato COP ($X.XXX) en la tabla del historial
- npm run typecheck
- Registra el cierre y crea doc/RESUMEN_FASE_4_VENTAS.md

Tu trabajo termina aquí. No avances a la Fase 5.
```

---

---

## PROMPT FASE 5 — Administración y Pulido Final

### Rol: `Diseñador Frontend Obsesivo + Ingeniero Fullstack — Cierre del proyecto`

---

```
Actúa EXCLUSIVAMENTE como Diseñador Frontend Obsesivo e Ingeniero Fullstack
trabajando en conjunto. Esta es la fase de cierre de SweetStock.

Tu mentalidad: SweetStock lo usan la dueña de una dulcería y sus empleadas.
No son desarrolladoras — son personas de negocio. Si el sistema tiene un
error confuso, una pantalla vacía sin orientación, o una interfaz que no
funciona bien en el celular, dejan de usarlo. Esta fase termina cuando el
sistema sea lo suficientemente claro e intuitivo para que alguien sin
experiencia técnica lo use sin manual.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SWEETSTOCK.md — Fase 5 completa, los requerimientos no funcionales
   (RNF-01 al RNF-06) y las restricciones del sistema (sección 20)
2. doc/ESTADO_EJECUCION_SWEETSTOCK.md — verifica Fases 1 a 4 completadas,
   registra inicio de Fase 5

Lo que debes completar en esta fase:

Administración de usuarios:
API Routes con withRole(['admin']): GET/POST /api/users, GET/PUT /api/users/[id].
El POST genera contraseña temporal con crypto.randomBytes (12 chars
alfanuméricos), hashea con bcrypt, must_change_password=true, retorna en
claro una sola vez con modal de advertencia y botón "Copiar". En el login:
si must_change_password=true → redirect a /profile para cambio obligatorio.
Crear app/admin/users/page.tsx: tabla con nombre, email, rol y estado.
Acciones: activar/suspender. El admin no puede suspenderse a sí mismo.
Crear app/admin/audit/page.tsx: AuditViewer con selector de mes. Solo admin.

Empty states con el tono de SweetStock — amigables y motivadores:
- Inventario vacío: "¡Tu dulcería está lista para empezar! 🍬 Agrega
  el primer producto de tu catálogo." Con botón "Agregar producto".
- Sin ventas hoy: "Aún no hay ventas registradas hoy. ¡Que comience
  el día! 🧁"
- Sin resultados de búsqueda: "No encontramos '[término]' en el catálogo.
  ¿Quieres agregar este producto?"
- Historial vacío para el período: "No hay ventas en el período seleccionado."
- Sin productos en alerta: no mostrar el LowStockAlert en absoluto —
  cuando no hay alertas, es buena noticia, no hay nada que mostrar.

Manejo de errores global:
- 401 (sesión expirada): toast + redirect a /login.
- 403 (sin permisos de rol): toast "No tienes permisos para realizar
  esta acción." — sin revelar detalles técnicos.
- 409 con stock insuficiente: NO usar un toast pequeño. Mostrar una
  alerta prominente dentro del formulario de venta con el mensaje exacto:
  "Stock insuficiente. Solo quedan [N] unidades de [nombre del producto]."
- 409 con nombre duplicado: toast "Ya existe un producto activo con
  ese nombre."
- 500: toast genérico con botón "Reintentar".

Verificación de la interfaz en celular (RNF-03):
En 375px: el SaleForm (buscador + cantidad + botón) debe caber en una
pantalla sin scroll. Los botones de acción deben tener mínimo 44px de
alto. Las tarjetas del inventario deben mostrar nombre, precio y badge
de stock claramente legibles sin acercar.

Verificar precios en formato COP en toda la interfaz: sin decimales,
con separador de miles, con símbolo $. Recorrer pantalla por pantalla:
inventario, formulario de venta, historial, auditoría.

Verificar los dos roles en producción:
Admin: ve los botones Editar en el inventario, puede ir a /config y
/admin, puede crear usuarios.
Empleado: no ve botones Editar, no puede acceder a /config ni /admin,
puede agregar productos nuevos y registrar ventas.

Para el cierre técnico:
- npm run typecheck — cero errores
- npm run lint — cero warnings
- npm run build — build exitoso
- Verificar que ningún componente cliente importa módulos de lib/ directamente
- Deploy en Vercel con todas las variables de entorno:
  NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, BLOB_READ_WRITE_TOKEN,
  JWT_SECRET, ADMIN_BOOTSTRAP_SECRET

Probar en producción el flujo completo con ambos roles:
Admin: bootstrap → configurar umbral → crear empleada con contraseña temporal.
Empleada: primer login → cambiar contraseña → ver inventario → agregar
producto nuevo → registrar venta → ver historial.
Admin: editar precio de un producto → verificar que el historial anterior
no cambia → eliminar producto → verificar que el historial de ventas de
ese producto sigue visible con el nombre snapshot.

Al cerrar el proyecto:
- Registra la Fase 5 como Completada en ESTADO_EJECUCION_SWEETSTOCK.md
  con la URL de producción en el historial
- Crea doc/RESUMEN_FASE_5_PULIDO_FINAL.md con: URL de producción, URL del
  repositorio, funcionalidades implementadas, stack, tablas de Supabase,
  decisiones técnicas destacadas (UNIQUE parcial de nombre, snapshot de
  venta, umbral configurable desde DB, empleado puede crear pero no editar,
  soft delete con integridad del historial) y estado final del proyecto

El proyecto SweetStock está terminado. Tu trabajo en este repositorio
concluye aquí.
```

---

> María Robles — Doc: 1082929927
> Curso: Lógica y Programación — SIST0200
