# Checklist Final de Entrega - Proyecto 2 Web

Fecha de revision: 2026-05-16

| Criterio | Cumple si/no | Evidencia | Como probarlo |
|---|---|---|---|
| API REST documentada | Si | `docs/API.md` documenta base URL, autenticacion, CRUD, reportes, exportaciones, cuerpos esperados, respuestas y codigos HTTP. | Abrir `docs/API.md` y comparar endpoints con `backend/src/routes/*.js`. |
| CRUD minimo 2 entidades | Si | `backend/src/routes/productRoutes.js`, `categoryRoutes.js`, `supplierRoutes.js`, `customerRoutes.js` exponen `GET`, `GET/:id`, `POST`, `PUT/:id`, `DELETE/:id`. | Probar `/api/products`, `/api/categories`, `/api/suppliers` o `/api/customers` con Postman/curl usando token admin. |
| Errores JSON y codigos HTTP | Si | `backend/src/middlewares/errorHandler.js` devuelve `{ "error": true, "message": "..." }` y mapea validacion, no encontrado, no autorizado y errores PostgreSQL. | Enviar un body invalido a un endpoint protegido o pedir un recurso inexistente y confirmar JSON con codigo 400/401/403/404. |
| Endpoint agregado | Si | `backend/src/routes/reportRoutes.js` incluye `/api/reports/overview`, `/dashboard-summary`, `/sales-total`, `/stock-summary` con SQL agregado real. | Ejecutar `Invoke-WebRequest -UseBasicParsing http://localhost:3000/api/reports/dashboard-summary` con token valido si aplica. |
| React Router con minimo 4 rutas | Si | `frontend/src/routes/router.tsx` define `/login`, `/admin/*`, `/cliente`, `/catalogo`, `/producto/:id`, `/carrito`, `/checkout`, `/ordenes`, entre otras. | Levantar frontend y navegar a esas rutas; refrescar la pagina para confirmar que Vite/nginx conserva la SPA. |
| Rutas protegidas por rol | Si | `frontend/src/routes/ProtectedRoute.tsx` valida autenticacion y roles `ADMIN`/`CLIENTE`; `router.tsx` lo aplica a vistas privadas. | Entrar sin sesion a `/admin`, iniciar como cliente e intentar `/admin`, iniciar como admin y entrar a `/admin/productos`. |
| Context global | Si | `frontend/src/context/AuthContext.tsx`, `CartContext.tsx` y `StoreContext.tsx` centralizan sesion, carrito y datos de tienda. | Iniciar sesion, agregar productos al carrito, refrescar y confirmar persistencia en `localStorage`. |
| Hooks requeridos | Si | Hay uso de `useState`, `useEffect`, `useCallback` y `useMemo` en contexts y vistas de catalogo/admin/reportes/checkout. | Revisar `frontend/src/context/*.tsx`, `frontend/src/pages/**/*.tsx` y `frontend/src/figma/admin/*.tsx`. |
| useReducer | Si | `frontend/src/context/CartContext.tsx` implementa `cartReducer` para agregar, eliminar, actualizar cantidad y limpiar carrito. | Ejecutar `cd frontend; npm test`, que incluye pruebas del reducer del carrito. |
| Formularios controlados | Si | Login/registro, productos, categorias, proveedores, clientes y checkout usan estado React y validaciones visibles. | Intentar enviar formularios vacios o con correo/precio/stock invalidos y confirmar que no se envia al backend. |
| Reporte visible con datos reales | Si | `frontend/src/figma/admin/Reports.tsx` consume `fetchOverviewReport()` desde `/api/reports/overview` y muestra ventas, stock y productos reales. | Iniciar como admin, abrir `/admin/reportes` y confirmar tarjetas/tablas con datos de la base. |
| Errores visibles para usuario | Si | Login, checkout, CRUD admin, reportes y exportaciones muestran errores de validacion o backend en la UI. | Forzar credenciales invalidas, formulario invalido o apagar backend y confirmar mensajes visibles. |
| ESLint funcional | Si | `frontend/eslint.config.js`, `backend/eslint.config.js`; scripts `npm run lint` en ambos `package.json`. | Ejecutar `cd frontend; npm run lint` y luego `cd ../backend; npm run lint`. |
| Minimo 3 pruebas | Si | `frontend/src/utils/format.test.ts`, `validation.test.ts`, `frontend/src/context/CartContext.test.ts`; 7 pruebas pasan con Vitest. | Ejecutar `cd frontend; npm test`. |
| Docker funcional | Si | `docker-compose.yml` levanta `db` PostgreSQL, `backend` y `frontend`; se verifico `docker compose up --build -d` con servicios sanos. | Ejecutar `docker compose up --build -d` y luego `docker compose ps`. |
| Credenciales DB correctas | Si | `.env.example` y `docker-compose.yml` usan `DB_USER=proy2`, `DB_PASSWORD=secret`, `POSTGRES_USER=proy2`, `POSTGRES_PASSWORD=secret`. | Ejecutar `docker compose config` y revisar variables de `db` y `backend`. |
| README completo | Si | `README.md` incluye descripcion, tecnologias, estructura, variables, Docker, URLs, usuarios, roles, endpoints, reportes, exportacion, pruebas, lint y errores comunes. | Leer `README.md` y seguir la seccion de ejecucion con Docker. |
| Login/logout | Si | `AuthContext.tsx` maneja `login`, `register`, `loginWithGoogle`, `logout`, token, usuario y rol; logout limpia sesion. | Iniciar sesion, navegar a ruta privada, cerrar sesion y confirmar redireccion a `/login`. |
| Persistencia de sesion | Si | `AuthContext.tsx` carga sesion inicial desde `localStorage` y conserva token/usuario/rol al refrescar. | Iniciar sesion, refrescar `/admin` o `/cliente` y confirmar que no vuelve a login si el token existe. |
| Exportacion CSV/PDF | Si | `Reports.tsx` tiene botones de descarga y `backend/src/controllers/reportController.js` genera CSV/PDF con datos reales. | En `/admin/reportes`, usar un boton de exportacion y confirmar archivo descargado con datos. |
| Diseno responsivo | Si, con verificacion visual recomendada | El frontend usa clases responsive y layouts flex/grid en las vistas; no se modifico el diseno visual. | Abrir `http://localhost:8080` y revisar login, catalogo, carrito, checkout y admin con viewport movil y desktop. |
| Sin archivos generados innecesarios en repo | Si | `git status --ignored --short` mostro `node_modules` ignorado; no hay `.env`, `dist` ni `uploads` trackeados. | Ejecutar `git status --short` y `git status --ignored --short`. |
| PostgreSQL con datos semilla | Si | Docker creo tablas y datos; consulta verificada con 20 productos, 5 usuarios y 8 ventas. | Ejecutar `docker compose exec -T db psql -U proy2 -d tienda_peluches -c "SELECT COUNT(*) FROM productos;"`. |
| Backend conecta a PostgreSQL | Si | `/health` respondio 200 y `/api/products` devolvio datos reales desde PostgreSQL. | Ejecutar `Invoke-WebRequest -UseBasicParsing http://localhost:3000/health` y consultar `/api/products`. |

## Riesgos y notas

- La comprobacion responsive debe hacerse visualmente antes de presentar, porque la evidencia automatica solo confirma compilacion y carga del frontend.
- Durante una ejecucion de `docker compose up --build -d` hubo un fallo transitorio de red al descargar dependencias con npm; al reintentar, Docker construyo y levanto correctamente.
- En Windows, npm puede mostrar un aviso de actualizacion/cache aunque `npm run lint`, `npm test` y `npx tsc --noEmit` terminen con codigo correcto.
- Los endpoints protegidos requieren token valido; para probar CRUD completo se recomienda iniciar sesion como usuario ADMIN y usar el token en Postman.

## Comandos verificados

```powershell
docker compose config
docker compose up --build -d
docker compose ps
Invoke-WebRequest -UseBasicParsing http://localhost:3000/health
Invoke-WebRequest -UseBasicParsing http://localhost:8080
docker compose exec -T db psql -U proy2 -d tienda_peluches -c "SELECT COUNT(*) AS productos, (SELECT COUNT(*) FROM usuarios) AS usuarios, (SELECT COUNT(*) FROM ventas) AS ventas FROM productos;"
cd frontend
npm run lint
npm test
npx tsc --noEmit
cd ../backend
npm run lint
```
