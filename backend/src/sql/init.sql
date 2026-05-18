CREATE TABLE IF NOT EXISTS categorias (
  id_categoria SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS proveedores (
  id_proveedor SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL UNIQUE,
  correo VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS marcas (
  id_marca SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS roles (
  id_rol SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NULL,
  id_rol INT NOT NULL,
  google_id VARCHAR(255) NULL UNIQUE,
  CONSTRAINT fk_usuarios_roles
    FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS clientes (
  id_cliente SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(30) NOT NULL,
  id_usuario INT NOT NULL UNIQUE,
  CONSTRAINT fk_clientes_usuarios
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS metodos_pago (
  id_metodo_pago SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS productos (
  id_producto SERIAL PRIMARY KEY,
  nombre VARCHAR(180) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  imagen VARCHAR(500) NOT NULL,
  id_categoria INT NOT NULL,
  id_proveedor INT NOT NULL,
  id_marca INT NOT NULL,
  CONSTRAINT fk_productos_categorias
    FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_productos_proveedores
    FOREIGN KEY (id_proveedor) REFERENCES proveedores (id_proveedor)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_productos_marcas
    FOREIGN KEY (id_marca) REFERENCES marcas (id_marca)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS ventas (
  id_venta SERIAL PRIMARY KEY,
  id_cliente INT NOT NULL,
  id_usuario INT NOT NULL,
  id_metodo_pago INT NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_ventas_clientes
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_ventas_usuarios
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_ventas_metodos_pago
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago (id_metodo_pago)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS detalle_venta (
  id_detalle SERIAL PRIMARY KEY,
  id_venta INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_detalle_venta_ventas
    FOREIGN KEY (id_venta) REFERENCES ventas (id_venta)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_detalle_venta_productos
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios (correo);
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos (nombre);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas (fecha);
CREATE INDEX IF NOT EXISTS idx_detalle_venta_producto ON detalle_venta (id_producto);

INSERT INTO roles (id_rol, nombre)
VALUES
  (1, 'ADMIN'),
  (2, 'CLIENTE')
ON CONFLICT (id_rol) DO UPDATE SET nombre = EXCLUDED.nombre;

INSERT INTO metodos_pago (id_metodo_pago, nombre)
VALUES
  (1, 'Efectivo'),
  (2, 'Tarjeta'),
  (3, 'Transferencia')
ON CONFLICT (id_metodo_pago) DO UPDATE SET nombre = EXCLUDED.nombre;

INSERT INTO categorias (id_categoria, nombre)
VALUES
  (1, 'Peluches'),
  (2, 'Llaveros'),
  (3, 'Tazas'),
  (4, 'Playeras'),
  (5, 'Sudaderas'),
  (6, 'Mochilas'),
  (7, 'Stickers'),
  (8, 'Termos'),
  (9, 'Gorras'),
  (10, 'Libretas'),
  (11, 'Mousepads'),
  (12, 'Figuras')
ON CONFLICT (id_categoria) DO UPDATE SET nombre = EXCLUDED.nombre;

INSERT INTO marcas (id_marca, nombre)
VALUES
  (1, 'Escandalosos'),
  (2, 'Snoopy')
ON CONFLICT (id_marca) DO UPDATE SET nombre = EXCLUDED.nombre;

INSERT INTO proveedores (id_proveedor, nombre, correo, telefono)
VALUES
  (1, 'Distribuidora Escandalosos GT', 'ventas@escandalososgt.com', '555-0101'),
  (2, 'Peanuts Imports Guatemala', 'contacto@peanutsgt.com', '555-0202'),
  (3, 'Merchandising Plus Guatemala', 'info@merchplusgt.com', '555-0303')
ON CONFLICT (id_proveedor) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  correo = EXCLUDED.correo,
  telefono = EXCLUDED.telefono;

INSERT INTO usuarios (id_usuario, nombre, correo, password, id_rol, google_id)
VALUES
  (1, 'Administrador Principal', 'admin@tienda.com', '$2b$10$bbdiRGiP6xK9gKr0cQUI3.BakiBXbSHjUV/9UZIXT9To1DWbbN.OG', 1, NULL),
  (2, 'Cliente Demo', 'cliente@tienda.com', '$2b$10$gv8r9LTpRJNQgOAe8SzSNey4dUtDJBmAFufUOqQB4c.CIMMPhWHLa', 2, NULL),
  (3, 'Carlos Ruiz', 'carlos@cliente.com', '$2b$10$gv8r9LTpRJNQgOAe8SzSNey4dUtDJBmAFufUOqQB4c.CIMMPhWHLa', 2, NULL),
  (4, 'Ana Lopez', 'ana@cliente.com', '$2b$10$gv8r9LTpRJNQgOAe8SzSNey4dUtDJBmAFufUOqQB4c.CIMMPhWHLa', 2, NULL)
ON CONFLICT (id_usuario) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  correo = EXCLUDED.correo,
  password = EXCLUDED.password,
  id_rol = EXCLUDED.id_rol,
  google_id = EXCLUDED.google_id;

INSERT INTO clientes (id_cliente, nombre, correo, telefono, id_usuario)
VALUES
  (1, 'Cliente Demo', 'cliente@tienda.com', '555-1001', 2),
  (2, 'Carlos Ruiz', 'carlos@cliente.com', '555-1002', 3),
  (3, 'Ana Lopez', 'ana@cliente.com', '555-1003', 4)
ON CONFLICT (id_cliente) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  correo = EXCLUDED.correo,
  telefono = EXCLUDED.telefono,
  id_usuario = EXCLUDED.id_usuario;

INSERT INTO productos (
  id_producto, nombre, descripcion, precio, stock, imagen, id_categoria, id_proveedor, id_marca
)
VALUES
  (1, 'Peluche Panda Escandalosos', 'Peluche suave de Panda de Escandalosos, ideal para coleccionistas y regalos.', 189.90, 24, '/images/productos/peluche-panda-escandalosos.jpg', 1, 1, 1),
  (2, 'Peluche Polar Escandalosos', 'Peluche de Polar con acabado premium y textura extra suave.', 189.90, 18, '/images/productos/peluche-polar-escandalosos.jpg', 1, 1, 1),
  (3, 'Peluche Pardo Escandalosos', 'Peluche de Pardo de Escandalosos, abrazable y resistente para uso diario.', 189.90, 20, '/images/productos/peluche-pardo-escandalosos.jpg', 1, 1, 1),
  (4, 'Llavero Escandalosos', 'Llavero compacto con diseno de los tres osos, perfecto para mochila o llaves.', 34.90, 60, '/images/productos/llavero-escandalosos.jpg', 2, 3, 1),
  (5, 'Taza Escandalosos', 'Taza de ceramica con arte de Escandalosos, capacidad aproximada de 350 ml.', 59.90, 45, '/images/productos/taza-escandalosos.jpg', 3, 3, 1),
  (6, 'Playera Escandalosos', 'Playera casual de algodon con estampado frontal de Escandalosos.', 99.90, 35, '/images/productos/playera-escandalosos.jpg', 4, 3, 1),
  (7, 'Sudadera Escandalosos', 'Sudadera con capucha y estampado de los osos, comoda para clima fresco.', 219.90, 8, '/images/productos/sudadera-escandalosos.jpg', 5, 3, 1),
  (8, 'Mochila Escandalosos', 'Mochila con compartimentos amplios y diseno inspirado en Escandalosos.', 199.90, 7, '/images/productos/mochila-escandalosos.jpg', 6, 3, 1),
  (9, 'Sticker Pack Escandalosos', 'Paquete de stickers decorativos de Escandalosos para laptop, libreta o botella.', 24.90, 80, '/images/productos/stickers-escandalosos.jpg', 7, 3, 1),
  (10, 'Termo Escandalosos', 'Termo reutilizable con ilustracion de Escandalosos y tapa de seguridad.', 129.90, 28, '/images/productos/termo-escandalosos.jpg', 8, 3, 1),
  (11, 'Peluche Snoopy Clasico', 'Peluche clasico de Snoopy con detalles bordados y textura suave.', 179.90, 22, '/images/productos/peluche-snoopy-clasico.jpg', 1, 2, 2),
  (12, 'Llavero Snoopy', 'Llavero de Snoopy en goma flexible, ligero y resistente.', 34.90, 70, '/images/productos/llavero-snoopy.jpg', 2, 2, 2),
  (13, 'Taza Snoopy', 'Taza de ceramica con ilustracion de Snoopy, ideal para cafe o chocolate.', 59.90, 42, '/images/productos/taza-snoopy.jpg', 3, 2, 2),
  (14, 'Playera Snoopy', 'Playera de algodon con grafico minimalista de Snoopy.', 99.90, 36, '/images/productos/playera-snoopy.jpg', 4, 2, 2),
  (15, 'Sudadera Snoopy', 'Sudadera comoda con capucha y estampado de Snoopy.', 229.90, 6, '/images/productos/sudadera-snoopy.jpg', 5, 2, 2),
  (16, 'Gorra Snoopy', 'Gorra ajustable con bordado frontal de Snoopy.', 89.90, 33, '/images/productos/gorra-snoopy.jpg', 9, 2, 2),
  (17, 'Mochila Snoopy', 'Mochila practica con diseno de Snoopy y bolsillo frontal.', 199.90, 9, '/images/productos/mochila-snoopy.jpg', 6, 2, 2),
  (18, 'Libreta Snoopy', 'Libreta rayada con portada de Snoopy, ideal para escuela u oficina.', 44.90, 55, '/images/productos/libreta-snoopy.jpg', 10, 2, 2),
  (19, 'Mousepad Snoopy', 'Mousepad suave con base antideslizante y arte de Snoopy.', 49.90, 48, '/images/productos/mousepad-snoopy.jpg', 11, 2, 2),
  (20, 'Figura Snoopy', 'Figura coleccionable de Snoopy para escritorio o vitrina.', 149.90, 5, '/images/productos/figura-snoopy.jpg', 12, 2, 2)
ON CONFLICT (id_producto) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  precio = EXCLUDED.precio,
  stock = EXCLUDED.stock,
  imagen = EXCLUDED.imagen,
  id_categoria = EXCLUDED.id_categoria,
  id_proveedor = EXCLUDED.id_proveedor,
  id_marca = EXCLUDED.id_marca;

INSERT INTO ventas (id_venta, id_cliente, id_usuario, id_metodo_pago, fecha, total)
VALUES
  (1, 1, 1, 2, NOW() - INTERVAL '2 days', 389.70),
  (2, 2, 1, 1, NOW() - INTERVAL '1 day', 474.70),
  (3, 3, 1, 3, NOW() - INTERVAL '5 days', 249.80),
  (4, 1, 1, 2, NOW() - INTERVAL '35 days', 599.70),
  (5, 2, 1, 1, NOW() - INTERVAL '65 days', 134.80),
  (6, 3, 1, 3, NOW() - INTERVAL '95 days', 119.80),
  (7, 1, 1, 2, NOW() - INTERVAL '125 days', 579.70),
  (8, 2, 1, 1, NOW() - INTERVAL '155 days', 759.60)
ON CONFLICT (id_venta) DO UPDATE SET
  id_cliente = EXCLUDED.id_cliente,
  id_usuario = EXCLUDED.id_usuario,
  id_metodo_pago = EXCLUDED.id_metodo_pago,
  fecha = EXCLUDED.fecha,
  total = EXCLUDED.total;

INSERT INTO detalle_venta (id_detalle, id_venta, id_producto, cantidad, precio_unitario, subtotal)
VALUES
  (1, 1, 1, 1, 189.90, 189.90),
  (2, 1, 6, 2, 99.90, 199.80),
  (3, 2, 4, 1, 34.90, 34.90),
  (4, 2, 7, 2, 219.90, 439.80),
  (5, 3, 2, 1, 189.90, 189.90),
  (6, 3, 5, 1, 59.90, 59.90),
  (7, 4, 3, 2, 189.90, 379.80),
  (8, 4, 7, 1, 219.90, 219.90),
  (9, 5, 4, 1, 34.90, 34.90),
  (10, 5, 6, 1, 99.90, 99.90),
  (11, 6, 5, 2, 59.90, 119.80),
  (12, 7, 1, 2, 189.90, 379.80),
  (13, 7, 8, 1, 199.90, 199.90),
  (14, 8, 6, 1, 99.90, 99.90),
  (15, 8, 7, 3, 219.90, 659.70)
ON CONFLICT (id_detalle) DO UPDATE SET
  id_venta = EXCLUDED.id_venta,
  id_producto = EXCLUDED.id_producto,
  cantidad = EXCLUDED.cantidad,
  precio_unitario = EXCLUDED.precio_unitario,
  subtotal = EXCLUDED.subtotal;

SELECT setval(pg_get_serial_sequence('categorias', 'id_categoria'), COALESCE(MAX(id_categoria), 1), true) FROM categorias;
SELECT setval(pg_get_serial_sequence('proveedores', 'id_proveedor'), COALESCE(MAX(id_proveedor), 1), true) FROM proveedores;
SELECT setval(pg_get_serial_sequence('marcas', 'id_marca'), COALESCE(MAX(id_marca), 1), true) FROM marcas;
SELECT setval(pg_get_serial_sequence('roles', 'id_rol'), COALESCE(MAX(id_rol), 1), true) FROM roles;
SELECT setval(pg_get_serial_sequence('usuarios', 'id_usuario'), COALESCE(MAX(id_usuario), 1), true) FROM usuarios;
SELECT setval(pg_get_serial_sequence('clientes', 'id_cliente'), COALESCE(MAX(id_cliente), 1), true) FROM clientes;
SELECT setval(pg_get_serial_sequence('metodos_pago', 'id_metodo_pago'), COALESCE(MAX(id_metodo_pago), 1), true) FROM metodos_pago;
SELECT setval(pg_get_serial_sequence('productos', 'id_producto'), COALESCE(MAX(id_producto), 1), true) FROM productos;
SELECT setval(pg_get_serial_sequence('ventas', 'id_venta'), COALESCE(MAX(id_venta), 1), true) FROM ventas;
SELECT setval(pg_get_serial_sequence('detalle_venta', 'id_detalle'), COALESCE(MAX(id_detalle), 1), true) FROM detalle_venta;

CREATE OR REPLACE VIEW vista_resumen_ventas AS
SELECT
  v.id_venta,
  v.fecha,
  c.nombre AS cliente,
  u.nombre AS usuario,
  mp.nombre AS metodo_pago,
  v.total
FROM ventas v
INNER JOIN clientes c ON c.id_cliente = v.id_cliente
INNER JOIN usuarios u ON u.id_usuario = v.id_usuario
INNER JOIN metodos_pago mp ON mp.id_metodo_pago = v.id_metodo_pago;
