import bcrypt from 'bcrypt';

import { pool } from '../db/pool.js';
import {
  getRoleId,
  upsertCustomerProfile,
} from '../services/domainService.js';
import { createHttpError } from '../utils/httpError.js';

export async function listCustomers(_req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT
         c.id_cliente,
         c.nombre,
         c.correo,
         c.telefono,
         c.id_usuario,
         COALESCE(COUNT(v.id_venta), 0) AS total_compras
       FROM clientes c
       LEFT JOIN ventas v ON v.id_cliente = c.id_cliente
       GROUP BY c.id_cliente, c.nombre, c.correo, c.telefono, c.id_usuario
       ORDER BY c.id_cliente DESC`,
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function getCustomerById(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT
         c.id_cliente,
         c.nombre,
         c.correo,
         c.telefono,
         c.id_usuario,
         COALESCE(COUNT(v.id_venta), 0) AS total_compras
       FROM clientes c
       LEFT JOIN ventas v ON v.id_cliente = c.id_cliente
       WHERE c.id_cliente = $1
       GROUP BY c.id_cliente, c.nombre, c.correo, c.telefono, c.id_usuario
       LIMIT 1`,
      [req.params.id],
    );

    if (!rows.length) {
      throw createHttpError(404, 'El cliente no existe.');
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function createCustomer(req, res, next) {
  const connection = await pool.connect();

  try {
    const {
      nombre,
      correo,
      telefono,
      password = 'Cliente123!',
    } = req.body;

    await connection.query('BEGIN');

    const { rows: existingRows } = await connection.query(
      'SELECT id_usuario FROM usuarios WHERE correo = $1 LIMIT 1',
      [correo],
    );

    if (existingRows.length) {
      throw createHttpError(409, 'Ya existe un usuario con ese correo.');
    }

    const clientRoleId = await getRoleId(connection, 'CLIENTE');
    const passwordHash = await bcrypt.hash(password, 10);

    const { rows: userRows } = await connection.query(
      `INSERT INTO usuarios (nombre, correo, password, id_rol, google_id)
       VALUES ($1, $2, $3, $4, NULL)
       RETURNING id_usuario`,
      [nombre.trim(), correo.trim(), passwordHash, clientRoleId],
    );
    const userId = userRows[0].id_usuario;

    const customerId = await upsertCustomerProfile(connection, {
      userId,
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
    });

    await connection.query('COMMIT');

    res.status(201).json({
      id_cliente: customerId,
      id_usuario: userId,
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      total_compras: 0,
    });
  } catch (error) {
    await connection.query('ROLLBACK');
    next(error);
  } finally {
    connection.release();
  }
}

export async function updateCustomer(req, res, next) {
  const connection = await pool.connect();

  try {
    const { nombre, correo, telefono } = req.body;
    const { id } = req.params;

    await connection.query('BEGIN');

    const { rows } = await connection.query(
      'SELECT id_usuario FROM clientes WHERE id_cliente = $1 LIMIT 1',
      [id],
    );

    if (!rows.length) {
      throw createHttpError(404, 'El cliente no existe.');
    }

    const userId = rows[0].id_usuario;

    await connection.query(
      `UPDATE usuarios
       SET nombre = $1, correo = $2
       WHERE id_usuario = $3`,
      [nombre.trim(), correo.trim(), userId],
    );

    await connection.query(
      `UPDATE clientes
       SET nombre = $1, correo = $2, telefono = $3
       WHERE id_cliente = $4`,
      [nombre.trim(), correo.trim(), telefono.trim(), id],
    );

    await connection.query('COMMIT');

    res.json({
      id_cliente: Number(id),
      id_usuario: userId,
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
    });
  } catch (error) {
    await connection.query('ROLLBACK');
    next(error);
  } finally {
    connection.release();
  }
}

export async function deleteCustomer(req, res, next) {
  const connection = await pool.connect();

  try {
    const { id } = req.params;
    await connection.query('BEGIN');

    const { rows } = await connection.query(
      'SELECT id_usuario FROM clientes WHERE id_cliente = $1 LIMIT 1',
      [id],
    );

    if (!rows.length) {
      throw createHttpError(404, 'El cliente no existe.');
    }

    const userId = rows[0].id_usuario;

    await connection.query('DELETE FROM clientes WHERE id_cliente = $1', [id]);
    await connection.query('DELETE FROM usuarios WHERE id_usuario = $1', [userId]);

    await connection.query('COMMIT');
    res.json({
      success: true,
      message: 'Cliente eliminado correctamente.',
    });
  } catch (error) {
    await connection.query('ROLLBACK');
    next(error);
  } finally {
    connection.release();
  }
}
