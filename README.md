# Proyecto-2-E-commerce-Chen

Aplicacion e-commerce con frontend React/Vite, backend Node.js/Express y base de datos PostgreSQL con SQL explicito.

## Docker

Levantar todo el proyecto:

```bash
docker compose up --build
```

Servicios locales:

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432

PostgreSQL usa el script inicial en `backend/src/sql/init.sql` para crear tablas, indices, vista y datos semilla.

## Variables principales

Para Docker local:

```env
DB_HOST=db
DB_PORT=5432
DB_NAME=tienda_peluches
DB_USER=proy2
DB_PASSWORD=secret
```

El `docker-compose.yml` crea la base con:

```env
POSTGRES_DB=tienda_peluches
POSTGRES_USER=proy2
POSTGRES_PASSWORD=secret
```

Para Render se puede configurar solo `DATABASE_URL`:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/base
```

Si `DATABASE_URL` existe, el backend la usa sobre las variables `DB_*`.

## API REST

La documentacion de endpoints REST esta en `docs/API.md`.
