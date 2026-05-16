import bcrypt from 'bcrypt';

import { pool } from '../db/pool.js';
import {
  getRoleId,
  upsertCustomerProfile,
} from '../services/domainService.js';
import { createHttpError } from '../utils/httpError.js';

export async function listUsers(_req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT
         u.id_usuario,
         u.nombre,
         u.correo,
         r.nombre AS rol,
         u.google_id
       FROM usuarios u
       INNER JOIN roles r ON r.id_rol = u.id_rol
       ORDER BY u.id_usuario DESC`,
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  const connection = await pool.connect();

  try {
    const { nombre, correo, password, rol, telefono = '' } = req.body;
    await connection.query('BEGIN');

    const { rows: existingRows } = await connection.query(
      'SELECT id_usuario FROM usuarios WHERE correo = $1 LIMIT 1',
      [correo],
    );

    if (existingRows.length) {
      throw createHttpError(409, 'Ya existe un usuario con ese correo.');
    }

    const roleId = await getRoleId(connection, rol);
    const passwordHash = await bcrypt.hash(password, 10);

    const { rows } = await connection.query(
      `INSERT INTO usuarios (nombre, correo, password, id_rol, google_id)
       VALUES ($1, $2, $3, $4, NULL)
       RETURNING id_usuario`,
      [nombre.trim(), correo.trim(), passwordHash, roleId],
    );
    const userId = rows[0].id_usuario;

    if (rol === 'CLIENTE') {
      await upsertCustomerProfile(connection, {
        userId,
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono,
      });
    }

    await connection.query('COMMIT');

    res.status(201).json({
      id_usuario: userId,
      nombre: nombre.trim(),
      correo: correo.trim(),
      rol,
      google_id: null,
    });
  } catch (error) {
    await connection.query('ROLLBACK');
    next(error);
  } finally {
    connection.release();
  }
}

export async function updateUser(req, res, next) {
  const connection = await pool.connect();

  try {
    const { id } = req.params;
    const { nombre, correo, password, rol, telefono = '' } = req.body;

    await connection.query('BEGIN');

    const roleId = await getRoleId(connection, rol);
    let result;

    if (password?.trim()) {
      const passwordHash = await bcrypt.hash(password.trim(), 10);
      result = await connection.query(
        `UPDATE usuarios
         SET nombre = $1, correo = $2, password = $3, id_rol = $4
         WHERE id_usuario = $5`,
        [nombre.trim(), correo.trim(), passwordHash, roleId, id],
      );
    } else {
      result = await connection.query(
        `UPDATE usuarios
         SET nombre = $1, correo = $2, id_rol = $3
         WHERE id_usuario = $4`,
        [nombre.trim(), correo.trim(), roleId, id],
      );
    }

    if (!result.rowCount) {
      throw createHttpError(404, 'El usuario no existe.');
    }

    if (rol === 'CLIENTE') {
      await upsertCustomerProfile(connection, {
        userId: Number(id),
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono,
      });
    }

    await connection.query('COMMIT');

    res.json({
      id_usuario: Number(id),
      nombre: nombre.trim(),
      correo: correo.trim(),
      rol,
    });
  } catch (error) {
    await connection.query('ROLLBACK');
    next(error);
  } finally {
    connection.release();
  }
}

export async function deleteUser(req, res, next) {
  const connection = await pool.connect();

  try {
    const { id } = req.params;

    if (Number(id) === Number(req.user?.id_usuario)) {
      throw createHttpError(409, 'No puedes eliminar tu propio usuario.');
    }

    await connection.query('BEGIN');

    await connection.query('DELETE FROM clientes WHERE id_usuario = $1', [id]);
    const result = await connection.query(
      'DELETE FROM usuarios WHERE id_usuario = $1',
      [id],
    );

    if (!result.rowCount) {
      throw createHttpError(404, 'El usuario no existe.');
    }

    await connection.query('COMMIT');
    res.status(204).send();
  } catch (error) {
    await connection.query('ROLLBACK');
    next(error);
  } finally {
    connection.release();
  }
}
