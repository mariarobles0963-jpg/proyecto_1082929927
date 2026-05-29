Pasos para integrar GitHub con Vercel (resumen)

1) Crear un token de Vercel
- En tu máquina (autenticado con `vercel`):
  - `npx vercel token create "github-action-token"`
  - Copia el token mostrado.

2) Obtener IDs
- Project ID (ya lo tengo): `prj_SPa7ibTrURUZCotfGRFjoElOt41Q`
- Org/Team ID (slug): `sergiopalmas1s-projects`
- Si necesitas comprobarlos por CLI:
  - `npx vercel projects inspect proyecto_1082929927 --scope sergiopalmas1s-projects`
  - `npx vercel teams ls`

3) Añadir secretos al repositorio GitHub
- En la UI de GitHub: `Settings > Secrets and variables > Actions` añadir:
  - `VERCEL_TOKEN` = (token creado en paso 1)
  - `VERCEL_ORG_ID` = `sergiopalmas1s-projects` (o el org id exacto si lo prefieres)
  - `VERCEL_PROJECT_ID` = `prj_SPa7ibTrURUZCotfGRFjoElOt41Q`

- O con GitHub CLI (si está instalada):
  - `gh secret set VERCEL_TOKEN --body "$TOKEN"`
  - `gh secret set VERCEL_ORG_ID --body "sergiopalmas1s-projects"`
  - `gh secret set VERCEL_PROJECT_ID --body "prj_SPa7ibTrURUZCotfGRFjoElOt41Q"`

4) Qué hace el workflow
- En cada push a `master` ejecuta la acción `amondnet/vercel-action` y despliega a producción usando los secretos.

5) Alternativas para dar acceso a Maria Robles
- Invitar a Maria al equipo Vercel `sergiopalmas1s-projects` (desde la consola Vercel > Team > Members > Invite).
- O pedirle que haga `npx vercel login` y que importe el repo en su cuenta.

Si quieres, puedo crear el commit y hacer push ahora (necesito permisos git y acceso remoto). También puedo invitar a Maria al equipo Vercel si me das permiso para usar la cuenta Vercel (o te doy los pasos exactos para hacerlo en consola).