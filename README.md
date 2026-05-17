# Proyecto 2 - E-commerce PlushStore

Aplicacion e-commerce para venta de peluches y productos relacionados. Incluye frontend React/Vite, backend Node.js/Express, API REST con SQL explicito y base de datos PostgreSQL inicializada con Docker.

## Tecnologias

- React 18 + Vite
- TypeScript
- React Router
- React Context
- Node.js + Express
- PostgreSQL
- SQL explicito sin ORM
- Docker Compose
- Nginx para servir el frontend y proxyear API
- ESLint
- Vitest

## Estructura

```text
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── db/
│   │   └── sql/init.sql
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── figma/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docs/API.md
├── docker-compose.yml
└── .env.example
```

## Requisitos Previos

- Docker Desktop o Docker Engine con Docker Compose
- Node.js 20+ solo si se ejecuta sin Docker
- npm

## Variables De Entorno

El archivo principal de ejemplo esta en `.env.example`.

Credenciales locales requeridas para PostgreSQL:

```env
POSTGRES_DB=tienda_peluches
POSTGRES_USER=proy2
POSTGRES_PASSWORD=secret

DB_HOST=db
DB_PORT=5432
DB_NAME=tienda_peluches
DB_USER=proy2
DB_PASSWORD=secret
```

El backend tambien soporta `DATABASE_URL`, util para Render:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/base
```

Ejemplos adicionales:

- `backend/.env.example`
- `frontend/.env.example`

## Ejecutar Con Docker

Desde la raiz del proyecto:

```bash
docker compose up --build
```

No se requieren pasos adicionales. Docker levanta:

- PostgreSQL con datos semilla desde `backend/src/sql/init.sql`
- Backend Express en el puerto `3000`
- Frontend React servido por Nginx en el puerto `8080`

URLs locales:

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- Healthcheck backend: http://localhost:3000/api/health
- PostgreSQL: localhost:5432

Para reiniciar la base desde cero:

```bash
docker compose down -v
docker compose up --build
```

## Usuarios De Prueba

| Rol | Correo | Password |
|---|---|---|
| ADMIN | `admin@tienda.com` | `Admin123!` |
| CLIENTE | `cliente@tienda.com` | `Cliente123!` |

## Funcionalidades Por Rol

ADMIN:

- Dashboard administrativo
- CRUD de productos
- CRUD de categorias
- CRUD de proveedores
- CRUD de clientes
- Gestion de usuarios, ventas y metodos de pago
- Reportes con datos reales desde PostgreSQL
- Exportacion CSV/PDF de reportes

CLIENTE:

- Login y registro
- Catalogo de productos
- Detalle de producto
- Carrito
- Checkout con validaciones
- Confirmacion de compra
- Historial de pedidos

## Endpoints Principales

La documentacion completa esta en `docs/API.md`.

Resumen:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/categories`
- `POST /api/categories`
- `GET /api/suppliers`
- `POST /api/suppliers`
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/sales`
- `POST /api/sales`
- `GET /api/reports/overview`

Los endpoints protegidos usan:

```http
Authorization: Bearer <token>
```

## Reportes Y Exportacion

La vista `Admin > Reportes` consume datos reales desde:

```http
GET /api/reports/overview
```

Reportes visibles:

- Total de ventas e ingresos
- Ventas recientes
- Productos mas vendidos
- Productos con bajo stock
- Ventas por metodo de pago
- Ventas por fecha
- Clientes con mas compras

Exportaciones disponibles desde la UI:

- `GET /api/reports/recent-sales/csv`
- `GET /api/reports/recent-sales/pdf`
- `GET /api/reports/top-products/csv`
- `GET /api/reports/top-products/pdf`
- `GET /api/reports/low-stock/csv`
- `GET /api/reports/low-stock/pdf`
- `GET /api/reports/sales-by-payment/csv`
- `GET /api/reports/sales-by-date/csv`

## Pruebas

Las pruebas unitarias del frontend usan Vitest:

```bash
cd frontend
npm test
```

Pruebas incluidas:

- Formato de moneda `formatCurrencyGTQ`
- Validaciones de email y telefono
- Reducer del carrito

## Deploy En Render

Render debe desplegar este monorepo como servicios separados. No uses `docker-compose.yml` en produccion; ese archivo queda solo para desarrollo local.

Tambien se incluye `render.yaml` como blueprint opcional. Si prefieres configurar desde la UI de Render, usa estos pasos.

### 1. Crear PostgreSQL

1. Crear un servicio **Render Postgres**.
2. Guardar el valor **Internal Database URL** o **External Database URL** como `DATABASE_URL` del backend.
3. No crear usuario ni base de datos manualmente desde SQL de produccion. Render ya entrega usuario, password, host y base.

Para crear tablas y datos demo en una base nueva:

```bash
cd backend
npm install
DATABASE_URL="postgresql://usuario:password@host:5432/base" npm run db:init
```

En Windows PowerShell:

```powershell
cd backend
npm install
$env:DATABASE_URL="postgresql://usuario:password@host:5432/base"
npm run db:init
```

El script ejecuta `backend/src/sql/init.sql`, que usa `CREATE TABLE IF NOT EXISTS` y `INSERT ... ON CONFLICT`. No ejecuta `CREATE DATABASE`, `CREATE USER` ni borra datos reales.

### 2. Crear Backend Web Service

- Tipo: **Web Service**
- Root Directory: `backend`
- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Variables necesarias:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<URL de Render Postgres>
FRONTEND_URL=https://<tu-frontend>.onrender.com
JWT_SECRET=<valor-largo-y-seguro>
```

Opcionales:

```env
JWT_EXPIRES_IN=7d
DB_CONNECTION_LIMIT=10
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CORS_ORIGIN=https://<tu-frontend>.onrender.com
```

El backend usa `process.env.PORT`, escucha en `0.0.0.0` y usa SSL para PostgreSQL cuando corre en `NODE_ENV=production` con `DATABASE_URL`.

### 3. Crear Frontend Static Site

- Tipo: **Static Site**
- Root Directory: `frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`

Variables necesarias:

```env
VITE_API_URL=https://<tu-backend>.onrender.com/api
```

Opcional:

```env
VITE_GOOGLE_CLIENT_ID=
```

Para React Router en Render Static Site, agrega una regla de rewrite:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

El `render.yaml` ya incluye esa regla.

### 4. URLs Y Pruebas

Probar salud del backend:

```bash
curl https://<tu-backend>.onrender.com/api/health
```

Respuesta esperada:

```json
{ "ok": true, "message": "API funcionando" }
```

Probar login desde la UI:

- Abrir `https://<tu-frontend>.onrender.com`
- Usar credenciales demo:

| Rol | Correo | Password |
|---|---|---|
| ADMIN | `admin@tienda.com` | `Admin123!` |
| CLIENTE | `cliente@tienda.com` | `Cliente123!` |

Tambien se puede probar la API:

```bash
curl -X POST https://<tu-backend>.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"correo\":\"admin@tienda.com\",\"password\":\"Admin123!\"}"
```

### 5. Errores Comunes En Render

Si falla CORS:

- Verificar que `FRONTEND_URL` en el backend sea exactamente la URL publica del Static Site, incluyendo `https://`.
- Verificar que `VITE_API_URL` en el frontend apunte al backend y termine en `/api`.
- Redeployar backend y frontend despues de cambiar variables.

Si falla `DATABASE_URL`:

- Confirmar que la variable exista en el backend, no en el frontend.
- Usar la URL de Render Postgres completa.
- Ejecutar `npm run db:init` una vez contra la base nueva si faltan tablas.
- Revisar logs del backend para errores de SSL o credenciales.

### 6. Validacion Antes De Deploy

Frontend:

```bash
cd frontend
npm install
npm run build
```

Backend:

```bash
cd backend
npm install
npm start
```

Docker local:

```bash
docker compose up --build
```

Antes de subir cambios, verificar:

- No subir `.env` reales.
- No subir `node_modules/`.
- No subir `frontend/dist/`.
- No depender de `localhost` en produccion.

## Lint

Frontend:

```bash
cd frontend
npm run lint
```

Backend:

```bash
cd backend
npm run lint
```

## Ejecucion Sin Docker

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Para ejecucion local sin Docker, ajustar `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` o usar `DATABASE_URL`.

## Errores Comunes

Puerto ocupado:

- Cambiar `FRONTEND_PORT`, `BACKEND_PORT` o `POSTGRES_PORT` en `.env`.

La base no refleja cambios del `init.sql`:

- PostgreSQL solo ejecuta scripts iniciales cuando el volumen esta vacio.
- Ejecutar:

```bash
docker compose down -v
docker compose up --build
```

Error de conexion a PostgreSQL:

- Verificar que `DB_USER=proy2` y `DB_PASSWORD=secret`.
- Verificar que el servicio `db` este healthy.

Error de CORS:

- Verificar `CORS_ORIGIN`.
- En Docker debe incluir `http://localhost:8080` y, si usas Vite directo, `http://localhost:5173`.

Error `EPERM` en Windows al ejecutar build/test local:

- Cerrar procesos Node activos.
- Volver a ejecutar el comando.
- En algunos entornos se requiere terminal con permisos suficientes.

## Entrega

El repositorio no debe subir:

- `.env`
- `node_modules/`
- `dist/`
- `backend/uploads/`

Estos patrones estan ignorados en `.gitignore`.
