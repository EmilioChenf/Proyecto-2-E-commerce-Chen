# Rubrica Web Final - Proyecto 2 Sistemas y Tecnologias Web

Fecha de revision: 2026-05-18

Proyecto: Plushie Paradise  
Repositorio: https://github.com/EmilioChenf/Proyecto-2-E-commerce-Chen  
Frontend produccion: https://plushie-paradise-frontend.onrender.com  
Backend/API produccion: https://plushie-paradise-api.onrender.com  
Health Check: https://plushie-paradise-api.onrender.com/api/health

## Resumen Ejecutivo

El proyecto cumple de forma amplia con la rubrica: tiene API REST modular, CRUD completo para varias entidades, manejo JSON de errores, reportes agregados, frontend React con Router, Context, hooks, `useReducer`, formularios controlados, pruebas, ESLint, Docker Compose, Render y funcionalidades avanzadas como autenticacion, roles y exportaciones CSV/PDF.

La mayor parte del riesgo restante no es de implementacion, sino de evidencia: verificar visualmente responsive en la presentacion, colocar capturas reales en `docs/images/` y confirmar que los servicios de Render esten redeployados con las ultimas variables.

## Tabla de Evaluacion

| Criterio de rubrica | Puntos posibles | Cumple / parcial / no cumple | Evidencia exacta en el proyecto | Observacion | Puntos estimados |
|---|---:|---|---|---|---:|
| I. Endpoints REST documentados | 6 | Cumple | `README.md` seccion "API REST"; `docs/API.md` con metodos, rutas, auth, bodies y respuestas. | Documenta auth, productos, categorias, proveedores, clientes, ventas, reportes y exportaciones. | 6 |
| I. CRUD completo via API para al menos 2 entidades | 8 | Cumple | `backend/src/routes/productRoutes.js`, `categoryRoutes.js`, `supplierRoutes.js`, `customerRoutes.js`; controladores en `catalogController.js` y `customerController.js`. | Productos, categorias, proveedores y clientes tienen GET, GET/:id, POST, PUT y DELETE. | 8 |
| I. Manejo de errores con codigos HTTP y JSON | 6 | Cumple | `backend/src/middlewares/errorHandler.js`, `validateRequest.js`, `utils/httpError.js`. | Respuestas `{ error: true, message }`; mapea validaciones y codigos PostgreSQL relevantes. | 6 |
| I. Endpoint que agregue datos | 5 | Cumple | `backend/src/routes/reportRoutes.js`; `backend/src/controllers/reportController.js`. | `/api/reports/dashboard`, `/overview`, `/sales-total`, `/stock-summary` usan agregaciones SQL. | 5 |
| I. API REST con prefijo `/api` y JSON | 5 | Cumple | `backend/src/app.js`: `/api/auth`, `/api/products`, `/api/categories`, `/api/reports`, `/api/health`. | Tambien conserva `/health` por compatibilidad, pero la entrega usa `/api/health`. | 5 |
| II. React Router con minimo 4 rutas | 6 | Cumple | `frontend/src/routes/router.tsx`. | Rutas: `/login`, `/admin/*`, `/cliente`, `/catalogo`, `/producto/:id`, `/carrito`, `/checkout`, `/ordenes`, etc. | 6 |
| II. Estado global con React Context | 6 | Cumple | `frontend/src/context/AuthContext.tsx`, `CartContext.tsx`, `StoreContext.tsx`. | Sesion, carrito, catalogo, ordenes y checkout centralizados. | 6 |
| II. Hooks `useState`, `useEffect`, `useCallback` o `useMemo` | 5 | Cumple | Contextos y paginas en `frontend/src/context/*`, `frontend/src/figma/client/pages/*`, `frontend/src/figma/admin/*`. | Uso amplio de hooks requeridos. | 5 |
| II. Flujo complejo con `useReducer` | 5 | Cumple | `frontend/src/context/CartContext.tsx`, pruebas en `CartContext.test.ts`. | `cartReducer` maneja agregar, quitar, actualizar cantidad, stock y errores. | 5 |
| II. Formularios controlados con validacion cliente para CRUD | 6 | Cumple | `frontend/src/pages/Login/AuthPage.tsx`, `frontend/src/figma/admin/Products.tsx`, `Categories.tsx`, `Suppliers.tsx`, `Customers.tsx`, `Users.tsx`, `frontend/src/figma/client/pages/Checkout.tsx`. | Login/registro, CRUD admin y checkout validan antes de enviar. | 6 |
| II. Reporte visible en UI con datos reales | 6 | Cumple | `frontend/src/figma/admin/Reports.tsx`, `Dashboard.tsx`, servicios en `frontend/src/services/catalogService.ts`. | Consume `/api/reports/overview` y `/dashboard` desde PostgreSQL. | 6 |
| II. Manejo visible de errores al usuario | 6 | Cumple | `AuthPage.tsx`, `Checkout.tsx`, `StoreContext.tsx`, `Reports.tsx`, CRUD admin con `toast.error`. | Hay mensajes en login, forms, catalogo/reportes y CRUD. | 6 |
| III. ESLint funcional sin errores | 8 | Cumple | `frontend/eslint.config.js`, `backend/eslint.config.js`; scripts `npm run lint` en ambos `package.json`. | Validado en esta revision. | 8 |
| III. Al menos 3 pruebas unitarias/integracion | 8 | Cumple | `frontend/src/utils/format.test.ts`, `validation.test.ts`, `frontend/src/context/CartContext.test.ts`. | 7 pruebas pasan con Vitest. | 8 |
| III. Calidad/organizacion de codigo | 4 | Cumple | Separacion `routes`, `controllers`, `services`, `middlewares`, `context`, `services`, `utils`. | Quedan carpetas duplicadas de versiones antiguas, pero no se importan desde la app principal. | 3 |
| IV. README con instrucciones funcionales y Docker | 7 | Cumple | `README.md` actualizado. | Incluye enlaces, Docker, Render, variables, credenciales, endpoints, pruebas y troubleshooting. | 7 |
| IV. `docker compose up` sin pasos adicionales | 7 | Cumple | `docker-compose.yml`, `backend/src/sql/init.sql`, healthchecks. | PostgreSQL se inicializa y backend tambien ejecuta init idempotente al arrancar. | 7 |
| IV. Variables de entorno y Render documentados | 6 | Cumple | `.env.example`, `backend/.env.example`, `frontend/.env.example`, `render.yaml`, `README.md`. | Incluye `DATABASE_URL`, `FRONTEND_URL`, `VITE_API_URL`, DB `proy2`/`secret`. | 6 |
| V. Autenticacion login/logout y sesion con Context | 8 | Cumple | `AuthContext.tsx`, `authRoutes.js`, `authController.js`, `ProtectedRoute.tsx`. | JWT, roles, persistencia local, logout y rutas protegidas. | 8 |
| V. Exportacion CSV/PDF desde UI | 8 | Cumple | `frontend/src/figma/admin/Reports.tsx`, `backend/src/routes/reportRoutes.js`, `reportController.js`. | Exporta ventas recientes, productos, stock, pagos, fechas y clientes. | 8 |
| V. Diseno responsivo movil/escritorio | 6 | Cumple parcial | Clases responsive en vistas cliente/admin/login: `sm:`, `md:`, `lg:`, grids, flex, overflow. | Requiere verificacion visual final en navegador antes de presentar. | 5 |
| V. Roles y proteccion de vistas | 3 | Cumple | `ProtectedRoute.tsx`, `router.tsx`, `authorize.js`. | Admin y cliente tienen accesos diferenciados frontend/backend. | 3 |

## Puntaje Estimado

- Puntos estimados: **132 / 135**
- Nota acreditable maxima sobre 100: **97.8 / 100**

Calculo: `132 / 135 * 100 = 97.8`.

## Evidencias Clave por Archivo

- API principal: `backend/src/app.js`
- Rutas REST: `backend/src/routes/*.js`
- Controladores REST: `backend/src/controllers/*.js`
- Errores JSON: `backend/src/middlewares/errorHandler.js`
- Validaciones API: `backend/src/middlewares/validateRequest.js`
- SQL PostgreSQL: `backend/src/sql/init.sql`
- Inicializacion automatica DB: `backend/src/db/initializeDatabase.js`, `backend/src/server.js`
- Auth backend: `backend/src/controllers/authController.js`, `backend/src/services/authService.js`
- Router frontend: `frontend/src/routes/router.tsx`
- Auth Context: `frontend/src/context/AuthContext.tsx`
- Cart reducer: `frontend/src/context/CartContext.tsx`
- Store Context/API state: `frontend/src/context/StoreContext.tsx`
- Cliente final: `frontend/src/figma/client/pages/*`
- Admin final/reportes: `frontend/src/figma/admin/*`
- Servicios API: `frontend/src/services/*.ts`
- Pruebas: `frontend/src/**/*.test.ts`
- Docker: `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`
- Render: `render.yaml`, README seccion "Despliegue en Render"

## Riesgos Restantes

1. **Capturas del README**: `README.md` referencia `docs/images/login.png` y `docs/images/cliente.png`; deben colocarse capturas reales antes de entregar.
2. **Responsive visual**: el codigo usa clases responsive, pero conviene abrir login, catalogo, carrito, checkout y admin en movil/escritorio antes de presentar.
3. **Redeploy Render**: despues de los ultimos cambios, redeployar frontend y backend para que produccion tenga rutas, seeds y README actualizados.
4. **Carpetas duplicadas**: existen copias antiguas en `frontend/src/pages/Cliente/src/app` y componentes base en `frontend/src/figma/*`; no rompen porque la app principal importa la version final, pero pueden confundir si se revisa superficialmente.
5. **Pruebas backend**: la rubrica pide al menos 3 pruebas y se cumple con frontend; agregar pruebas backend seria mejora, no bloqueo.

## Recomendaciones Finales antes de Entregar

1. Agregar capturas reales:
   - `docs/images/login.png`
   - `docs/images/cliente.png`
2. Ejecutar:
   ```bash
   cd frontend
   npm run lint
   npm test
   npm run build
   cd ../backend
   npm run lint
   cd ..
   docker compose up --build
   ```
3. Probar produccion:
   - Abrir frontend.
   - Iniciar sesion como admin y cliente.
   - Abrir `/api/health`.
   - Probar `Admin > Reportes` y una descarga CSV/PDF.
4. Confirmar variables Render:
   - Backend: `DATABASE_URL`, `FRONTEND_URL`, `JWT_SECRET`, `NODE_ENV=production`.
   - Frontend: `VITE_API_URL=https://plushie-paradise-api.onrender.com/api`.
