# RESUMEN FASE 2 — Dashboard, Layout y Bootstrap

Estado: EN PROGRESO (parcialmente implementado)

Objetivo
- Implementar la identidad visual compartida (paleta rosa/violeta), el
  sidebar (roles admin/empleado), el bottom nav móvil, el banner de modo
  seed y protección de rutas administrativas.

Acciones ejecutadas
- Añadidas variables CSS en `src/app/globals.css` con la paleta:
  --ss-primary `#EC4899`, --ss-accent `#8B5CF6`, background gradient.
- Componente `Sidebar` creado en `src/components/Sidebar/Sidebar.tsx`.
- Componente `BottomNav` creado en `src/components/BottomNav/BottomNav.tsx`.
- Componente `SeedModeBanner` creado en `src/components/SeedModeBanner/SeedModeBanner.tsx`.
- Middleware `middleware.ts` añadido para proteger `/admin/*` y `/config`.
- La página `/admin/db-setup` ya existe y contiene el mensaje requerido.

Archivos creados/modificados
- `src/app/globals.css` (variables y gradient)
- `src/components/Sidebar/Sidebar.tsx`
- `src/components/BottomNav/BottomNav.tsx`
- `src/components/SeedModeBanner/SeedModeBanner.tsx`
- `middleware.ts`
- `Doc/RESUMEN_FASE_2_LAYOUT.md`

Decisiones técnicas
- Variables CSS globales para garantizar consistencia visual.
- `middleware.ts` verifica el `token` cookie JWT y redirige no-admins a
  `/inventory`. En ausencia de `JWT_SECRET` usa `dev-secret` (solo dev).

Problemas y observaciones
- No se pueden ejecutar `npm run type-check` ni probar middleware aquí
  porque Node/npm no están instalados en este entorno; validación local
  pendiente.
- La protección basada en cookies asume que `token` es un JWT firmado con
  `JWT_SECRET` y accesible en cookies HttpOnly.

Pruebas pendientes (manuales en entorno local)
- Ejecutar `npm install` y `npm run type-check`.
- Verificar que el `Sidebar` muestra 4 ítems para `empleado` y 6 para
  `admin` en 375px y 1280px.
- Acceder a `/config` y `/admin` como empleado para confirmar redirect.

Estado final esperado
- Fase 2 COMPLETADA después de las pruebas locales y ajuste de accesos.
