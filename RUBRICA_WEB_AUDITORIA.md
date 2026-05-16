# Auditoria contra rubrica Proyecto 2 - Sistemas y Tecnologias Web

Fecha de revision: 2026-05-16

## Tabla de cumplimiento

| Requisito | Estado | Evidencia en el codigo | Que falta hacer | Prioridad |
|---|---|---|---|---|
| API REST: endpoints documentados | no cumple | `README.md` solo documenta Docker/PostgreSQL y variables; no hay archivo OpenAPI, Swagger, Postman collection ni seccion de endpoints. Busqueda de `openapi`, `swagger`, `api-doc`, `postman` sin resultados utiles. | Crear documentacion de endpoints: metodo, ruta, auth, body, respuesta, errores. Ideal: `docs/API.md` u OpenAPI/Swagger. | Alta |
| API REST: CRUD completo via API para minimo 2 entidades | cumple | `backend/src/routes/productRoutes.js` tiene GET lista, GET por id, POST, PUT, DELETE. `backend/src/routes/categoryRoutes.js`, `supplierRoutes.js`, `customerRoutes.js`, `userRoutes.js`, `paymentMethodRoutes.js` tambien tienen CRUD o CRUD administrativo. | Nada critico. En documentacion, listar al menos productos y categorias/proveedores como evidencia formal. | Baja |
| API REST: errores con codigos HTTP correctos y JSON | parcial | `backend/src/middlewares/errorHandler.js` responde JSON `{ message, details }`; `backend/src/middlewares/validateRequest.js` retorna 422; controladores usan 404, 403, 409, 422 con `createHttpError`. Pero `errorHandler.js` aun mapea codigos MySQL (`ER_DUP_ENTRY`, etc.) y no codigos PostgreSQL como `23505`, `23503`, `23502`, por lo que algunos errores DB pueden terminar como 500. | Agregar mapeo PostgreSQL para unique violation, foreign key violation, not null/check violation; revisar respuestas de errores de DB reales. | Alta |
| API REST: endpoint agregado de datos | cumple | `backend/src/routes/reportRoutes.js` expone `/api/reports/dashboard` y `/api/reports/overview`. `backend/src/controllers/reportController.js` calcula totales, ventas por mes, metodo de pago, stock bajo, ranking, joins y consultas con agregaciones. | Documentar estos endpoints como "agregados/reportes". | Baja |
| React: React Router con minimo 4 rutas | cumple | `frontend/src/routes/router.tsx` usa `createBrowserRouter` con `/`, `/admin`, `/cliente`, `/catalogo`, `/producto/:id`, `/carrito`, `/checkout`, `/confirmacion`, `/ordenes` y fallback `*`. | Nada critico. | Baja |
| React: Context para sesion, carrito u otro estado global | cumple | `frontend/src/context/AuthContext.tsx` maneja sesion/login/logout; `frontend/src/context/CartContext.tsx` maneja carrito; `frontend/src/context/StoreContext.tsx` maneja catalogo, ordenes y checkout. | Nada critico. | Baja |
| React: hooks `useState`, `useEffect` y `useCallback` o `useMemo` | cumple | `AuthContext.tsx`, `CartContext.tsx`, `StoreContext.tsx`, `AuthPage.tsx`, `Dashboard.tsx`, `Reports.tsx` usan `useState`, `useEffect`, `useMemo`. Componentes UI como `frontend/src/components/ui/sidebar.tsx` y `carousel.tsx` usan `useCallback`. | Nada critico. | Baja |
| React: `useReducer` para flujo complejo | no cumple | Busqueda de `useReducer` y `React.useReducer` en `frontend/src` y `backend/src` sin resultados. El carrito y checkout usan `useState`/Context. | Implementar `useReducer` donde tenga sentido, por ejemplo en `CartContext` o en flujo de checkout, sin cambiar UX. | Alta |
| React: formularios controlados con validacion | cumple | `frontend/src/pages/auth/AuthPage.tsx` controla `formData` y usa inputs requeridos/type email; `frontend/src/figma/client/pages/Checkout.tsx` maneja `errors` y validacion visible; rutas backend usan `express-validator`. Admin CRUD usa estados `formData` en componentes como `Products`, `Categories`, `Users`, `Customers`. | Podria reforzarse con validacion frontend mas explicita en todos los CRUD, pero el requisito base se cumple. | Baja |
| React: reporte visible con datos reales | cumple | `frontend/src/figma/admin/Reports.tsx` llama `fetchOverviewReport()` y renderiza tarjetas, graficas, tablas y consultas SQL visibles. `Dashboard.tsx` llama `fetchDashboardReport()`. Servicios en `frontend/src/services/catalogService.ts` consumen `/reports/overview` y `/reports/dashboard`. | Agregar manejo visible de error si falla la carga inicial del reporte. | Media |
| React: errores visibles para usuario | parcial | Login muestra `AlertMessage` en `AuthPage.tsx`; admin CRUD usa `toast.error` en `Products`, `Categories`, `Customers`, `Users`, `Suppliers`, `PaymentMethods`, `Sales`; checkout muestra errores de formulario. Pero `Dashboard.tsx` y carga inicial de `Reports.tsx` no muestran error si falla `fetchDashboardReport()`/`fetchOverviewReport()`. | Agregar estados de error visibles para cargas de dashboard/reportes/catalogo. | Media |
| Calidad: ESLint funcional | no cumple | `frontend/package.json` y `backend/package.json` no tienen script `lint`; no se encontro `eslint.config.*` ni `.eslintrc*`; ESLint no aparece en dependencias. | Instalar/configurar ESLint para frontend y backend; agregar `npm run lint` o scripts separados. | Alta |
| Calidad: minimo 3 pruebas unitarias o integracion | no cumple | No hay scripts `test` en `frontend/package.json` ni `backend/package.json`; no se encontraron archivos `*.test.*`, `*.spec.*` ni carpetas `__tests__`. | Agregar al menos 3 pruebas. Recomendado: API productos, API ventas/transaccion, React Auth/Cart o servicios. | Alta |
| Docker: `docker compose up` funcional | cumple | `docker-compose.yml` define servicios `db`, `backend`, `frontend`, healthchecks y dependencias. En validaciones previas del proyecto se verifico que PostgreSQL inicializa y backend/frontend levantan; tras reorganizacion, `docker compose build frontend` compilo correctamente. | Para entrega, ejecutar y guardar evidencia final de `docker compose up --build` en ambiente limpio. | Media |
| Docker: `.env.example` correcto | cumple | `.env.example` incluye `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, puertos, JWT, CORS, `VITE_API_URL`. `backend/.env.example` incluye `DB_HOST`, `DB_PORT=5432`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DATABASE_URL`. | Opcional: agregar comentario breve de que Docker usa `POSTGRES_*` y backend usa `DB_*`/`DATABASE_URL`. | Baja |
| Docker: credenciales DB `proy2` / `secret` | cumple | `docker-compose.yml` usa `POSTGRES_USER=${POSTGRES_USER:-proy2}` y `POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-secret}`; `.env.example` y `backend/.env.example` contienen `proy2`/`secret`. | Nada critico. | Baja |
| Avanzado: login/logout con Context | cumple | `frontend/src/context/AuthContext.tsx` define `login`, `register`, `loginWithGoogle`, `logout`; `AdminPage.tsx` pasa `onLogout={logout}` a `TopBar`; `ProtectedRoute` protege rutas por rol. | Nada critico. | Baja |
| Avanzado: exportacion CSV o PDF | cumple | `backend/src/controllers/reportController.js` genera CSV y PDF; `backend/src/routes/reportRoutes.js` expone rutas `/csv` y `/pdf`; `frontend/src/figma/admin/Reports.tsx` descarga reportes con `downloadReport`. | Nada critico. | Baja |
| Avanzado: diseno responsivo | cumple | Uso amplio de clases responsivas Tailwind: `sm:`, `md:`, `lg:`, `grid-cols-1`, `overflow-x-auto`; ejemplos en `frontend/src/figma/client/pages/Catalog.tsx`, `Cart.tsx`, `Checkout.tsx`, `Reports.tsx`, `Dashboard.tsx`, `AuthPage.tsx`. | Verificar visualmente en movil/tablet para evidencia final. | Baja |

## Observaciones adicionales

- La API esta bien modularizada por rutas (`backend/src/routes/*`) y controladores (`backend/src/controllers/*`).
- La transaccion de venta esta implementada en `backend/src/controllers/saleController.js` con `BEGIN`, bloqueo `FOR UPDATE`, insercion de venta, detalle, actualizacion de stock y `COMMIT`/`ROLLBACK`.
- Hay endpoints reales para catalogo, administracion, ventas, reportes y uploads.
- El proyecto ya usa PostgreSQL y Docker con datos semilla.
- La documentacion actual es insuficiente para demostrar la API ante rubrica aunque la API exista.
- Hay carpetas movidas bajo `frontend/src/pages/Login`, `frontend/src/pages/Admin`, `frontend/src/pages/Cliente`, pero el frontend principal aun usa componentes en `frontend/src/figma/*` y paginas principales `frontend/src/pages/auth`, `frontend/src/pages/Admin`, `frontend/src/figma/client/*`.

## Plan de accion por fases para llegar al 100%

### Fase 1 - Evidencia y documentacion API

1. Crear `docs/API.md` o `openapi.yaml`.
2. Documentar minimo: auth, products, categories, suppliers/customers, sales, reports.
3. Incluir ejemplos de request/response y errores esperados.
4. Agregar una seccion en `README.md` apuntando a la documentacion.

### Fase 2 - Correccion de errores HTTP PostgreSQL

1. Actualizar `backend/src/middlewares/errorHandler.js`.
2. Mapear codigos PostgreSQL:
   - `23505` a 409 duplicado.
   - `23503` a 409 o 400 por referencia.
   - `23502` a 400/422 por campo requerido.
   - `22P02` a 400 por formato invalido.
3. Probar duplicados y referencias invalidas con respuestas JSON.

### Fase 3 - `useReducer`

1. Migrar un flujo complejo sin cambiar UX:
   - opcion recomendada: `CartContext`, con acciones `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`.
   - alternativa: checkout con estados de formulario, errores y submit.
2. Mantener API publica del Context para no romper componentes.

### Fase 4 - ESLint

1. Instalar ESLint y plugins para React/TypeScript.
2. Agregar script `lint` en frontend.
3. Agregar ESLint basico para backend Node/Express o un script separado.
4. Corregir solo problemas necesarios para que `npm run lint` pase.

### Fase 5 - Pruebas

1. Backend: agregar pruebas de integracion para:
   - health o login.
   - CRUD de productos.
   - transaccion de ventas.
2. Frontend: agregar prueba de Context o formulario de login/carrito.
3. Agregar scripts `test` y documentar como ejecutarlos.

### Fase 6 - Validacion final

1. Ejecutar `npm run lint`.
2. Ejecutar `npm test`.
3. Ejecutar `npm run build` en frontend.
4. Ejecutar `docker compose up --build`.
5. Validar manualmente:
   - login/logout.
   - catalogo.
   - CRUD productos.
   - checkout.
   - dashboard/reportes.
   - exportacion CSV/PDF.
   - responsive movil/tablet/escritorio.
