export function notFoundHandler(req, _res, next) {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  let status = error.status ?? 500;
  let message = error.message ?? 'Error interno del servidor.';

  if (status === 422) {
    status = 400;
  }

  if (error.code === '23505') {
    status = 400;
    message = 'El registro ya existe y no puede duplicarse.';
  }

  if (error.code === '23503') {
    status = 400;
    message =
      'No se puede eliminar este registro porque tiene informacion relacionada.';
  }

  if (error.code === '23502' || error.code === '23514' || error.code === '22P02') {
    status = 400;
    message = 'Los datos enviados no son validos.';
  }

  const payload = {
    error: true,
    message,
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (process.env.NODE_ENV !== 'production' && error.stack) {
    payload.stack = error.stack;
  }

  res.status(status).json(payload);
}
