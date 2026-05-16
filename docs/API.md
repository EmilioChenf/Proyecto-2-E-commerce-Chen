# API REST - PlushStore

Base local:

```text
http://localhost:3000/api
```

Todas las respuestas de error tienen formato JSON:

```json
{
  "error": true,
  "message": "Mensaje claro del error"
}
```

Los endpoints protegidos requieren:

```http
Authorization: Bearer <token>
```

## Autenticacion

| Metodo | Endpoint | Descripcion | Body esperado | Respuesta ejemplo |
|---|---|---|---|---|
| POST | `/api/auth/login` | Inicia sesion. | `{ "correo": "admin@tienda.com", "password": "Admin123!" }` | `200 { "token": "...", "user": { "id_usuario": 1, "rol": "ADMIN" } }` |
| POST | `/api/auth/register` | Registra cliente. | `{ "nombre": "Cliente", "correo": "cliente@test.com", "password": "Cliente123!", "telefono": "555-0000" }` | `201 { "token": "...", "user": { "rol": "CLIENTE" } }` |
| GET | `/api/auth/me` | Obtiene usuario autenticado. | No aplica. | `200 { "user": { "id_usuario": 1, "correo": "admin@tienda.com" } }` |

## Productos

CRUD completo. Lectura publica; escritura requiere rol `ADMIN`.

| Metodo | Endpoint | Descripcion | Body esperado | Respuesta ejemplo |
|---|---|---|---|---|
| GET | `/api/products` | Lista productos. Soporta filtros `search`, `category`, `brand`, `inStock`, `featured`, `sort`. | No aplica. | `200 [{ "id_producto": 1, "nombre": "Peluche Panda Escandalosos", "precio": 189.9 }]` |
| GET | `/api/products/:id` | Obtiene producto por id. | No aplica. | `200 { "id_producto": 1, "nombre": "Peluche Panda Escandalosos" }` |
| POST | `/api/products` | Crea producto. | `{ "nombre": "Producto", "descripcion": "Desc", "precio": 10.5, "stock": 5, "imagen": "/images/productos/placeholder-producto.png", "id_categoria": 1, "id_proveedor": 1, "id_marca": 1 }` | `201 { "id_producto": 21, "nombre": "Producto" }` |
| PUT | `/api/products/:id` | Actualiza producto. | Igual que POST. | `200 { "id_producto": 21, "nombre": "Producto actualizado" }` |
| DELETE | `/api/products/:id` | Elimina producto. | No aplica. | `200 { "success": true, "message": "Producto eliminado correctamente." }` |

## Categorias

CRUD completo. Lectura publica; escritura requiere rol `ADMIN`.

| Metodo | Endpoint | Descripcion | Body esperado | Respuesta ejemplo |
|---|---|---|---|---|
| GET | `/api/categories` | Lista categorias. | No aplica. | `200 [{ "id_categoria": 1, "nombre": "Peluches" }]` |
| GET | `/api/categories/:id` | Obtiene categoria por id. | No aplica. | `200 { "id_categoria": 1, "nombre": "Peluches" }` |
| POST | `/api/categories` | Crea categoria. | `{ "nombre": "Nueva categoria" }` | `201 { "id_categoria": 13, "nombre": "Nueva categoria" }` |
| PUT | `/api/categories/:id` | Actualiza categoria. | `{ "nombre": "Categoria actualizada" }` | `200 { "id_categoria": 13, "nombre": "Categoria actualizada" }` |
| DELETE | `/api/categories/:id` | Elimina categoria. | No aplica. | `200 { "success": true, "message": "Categoria eliminada correctamente." }` |

## Proveedores

CRUD completo. Lectura publica; escritura requiere rol `ADMIN`.

| Metodo | Endpoint | Descripcion | Body esperado | Respuesta ejemplo |
|---|---|---|---|---|
| GET | `/api/suppliers` | Lista proveedores. | No aplica. | `200 [{ "id_proveedor": 1, "nombre": "Distribuidora Escandalosos GT" }]` |
| GET | `/api/suppliers/:id` | Obtiene proveedor por id. | No aplica. | `200 { "id_proveedor": 1, "nombre": "Distribuidora Escandalosos GT" }` |
| POST | `/api/suppliers` | Crea proveedor. | `{ "nombre": "Proveedor", "correo": "proveedor@test.com", "telefono": "555-0000" }` | `201 { "id_proveedor": 4, "nombre": "Proveedor" }` |
| PUT | `/api/suppliers/:id` | Actualiza proveedor. | `{ "nombre": "Proveedor actualizado", "correo": "proveedor@test.com", "telefono": "555-0001" }` | `200 { "id_proveedor": 4, "nombre": "Proveedor actualizado" }` |
| DELETE | `/api/suppliers/:id` | Elimina proveedor. | No aplica. | `200 { "success": true, "message": "Proveedor eliminado correctamente." }` |

## Clientes

CRUD completo. Requiere rol `ADMIN`.

| Metodo | Endpoint | Descripcion | Body esperado | Respuesta ejemplo |
|---|---|---|---|---|
| GET | `/api/customers` | Lista clientes. | No aplica. | `200 [{ "id_cliente": 1, "nombre": "Cliente Demo", "total_compras": 2 }]` |
| GET | `/api/customers/:id` | Obtiene cliente por id. | No aplica. | `200 { "id_cliente": 1, "nombre": "Cliente Demo" }` |
| POST | `/api/customers` | Crea cliente y usuario asociado. | `{ "nombre": "Cliente", "correo": "cliente@test.com", "telefono": "555-0000", "password": "Cliente123!" }` | `201 { "id_cliente": 4, "id_usuario": 5, "nombre": "Cliente" }` |
| PUT | `/api/customers/:id` | Actualiza cliente y usuario asociado. | `{ "nombre": "Cliente editado", "correo": "cliente@test.com", "telefono": "555-0001" }` | `200 { "id_cliente": 4, "nombre": "Cliente editado" }` |
| DELETE | `/api/customers/:id` | Elimina cliente y usuario asociado. | No aplica. | `200 { "success": true, "message": "Cliente eliminado correctamente." }` |

## Ventas

Lectura y creacion de ventas. Las ventas no se actualizan ni eliminan para mantener integridad historica de transacciones.

| Metodo | Endpoint | Descripcion | Body esperado | Respuesta ejemplo |
|---|---|---|---|---|
| GET | `/api/sales` | Lista ventas. Clientes ven solo sus ventas; admin ve todas. | No aplica. | `200 [{ "id_venta": 1, "cliente": "Cliente Demo", "total": 389.7 }]` |
| GET | `/api/sales/:id` | Obtiene venta con detalle. | No aplica. | `200 { "id_venta": 1, "items": [{ "id_producto": 1, "cantidad": 1 }] }` |
| POST | `/api/sales` | Crea venta con transaccion, valida stock y descuenta inventario. | `{ "id_cliente": 1, "id_metodo_pago": 1, "items": [{ "id_producto": 1, "cantidad": 1 }] }` | `201 { "id_venta": 9, "total": 189.9, "items": [...] }` |

## Reportes agregados

Requieren rol `ADMIN`.

| Metodo | Endpoint | Descripcion | Body esperado | Respuesta ejemplo |
|---|---|---|---|---|
| GET | `/api/reports/dashboard-summary` | Resumen agregado de productos, ventas, ingresos y clientes. | No aplica. | `200 { "total_productos": 20, "stock_bajo": 4, "total_ventas": 8, "ingresos_totales": 3308.1 }` |
| GET | `/api/reports/sales-total` | Totales agregados de ventas. | No aplica. | `200 { "total_ventas": 8, "ingresos_totales": 3308.1, "ticket_promedio": 413.51 }` |
| GET | `/api/reports/stock-summary` | Resumen agregado de inventario. | No aplica. | `200 { "total_productos": 20, "unidades_disponibles": 661, "productos_stock_bajo": 4 }` |
| GET | `/api/reports/dashboard` | Datos agregados para dashboard visible. | No aplica. | `200 { "summary": {...}, "salesByMonth": [...] }` |
| GET | `/api/reports/overview` | Reporte completo con graficas, tablas y joins. | No aplica. | `200 { "summary": {...}, "bestSellers": [...], "sqlSamples": {...} }` |

## Exportaciones

Requieren rol `ADMIN`.

| Metodo | Endpoint | Descripcion |
|---|---|---|
| GET | `/api/reports/recent-sales/csv` | Descarga CSV de ventas recientes. |
| GET | `/api/reports/recent-sales/pdf` | Descarga PDF de ventas recientes. |
| GET | `/api/reports/top-products/csv` | Descarga CSV de productos mas vendidos. |
| GET | `/api/reports/top-products/pdf` | Descarga PDF de productos mas vendidos. |
| GET | `/api/reports/low-stock/csv` | Descarga CSV de stock bajo. |
| GET | `/api/reports/low-stock/pdf` | Descarga PDF de stock bajo. |
| GET | `/api/reports/sales-by-payment/csv` | Descarga CSV de ventas por metodo de pago. |
| GET | `/api/reports/sales-by-payment/pdf` | Descarga PDF de ventas por metodo de pago. |
| GET | `/api/reports/sales-by-date/csv` | Descarga CSV de ventas por fecha. |
| GET | `/api/reports/sales-by-date/pdf` | Descarga PDF de ventas por fecha. |
| GET | `/api/reports/top-customers/csv` | Descarga CSV de clientes con mas compras. |
| GET | `/api/reports/top-customers/pdf` | Descarga PDF de clientes con mas compras. |

## Codigos HTTP esperados

| Codigo | Uso |
|---|---|
| 200 | Consultas, actualizaciones y eliminaciones correctas con JSON. |
| 201 | Creacion correcta. |
| 400 | Validacion fallida, datos invalidos o restricciones de PostgreSQL. |
| 401 | Falta token o sesion invalida. |
| 403 | Usuario autenticado sin rol requerido. |
| 404 | Recurso o ruta no encontrada. |
| 500 | Error interno no controlado. |

## Ejemplos de prueba rapida

```bash
curl http://localhost:3000/api/products
curl http://localhost:3000/api/categories/1
curl http://localhost:3000/api/suppliers/1
```

Login admin:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"correo\":\"admin@tienda.com\",\"password\":\"Admin123!\"}"
```

Endpoint agregado con token:

```bash
curl http://localhost:3000/api/reports/dashboard-summary \
  -H "Authorization: Bearer <token>"
```
