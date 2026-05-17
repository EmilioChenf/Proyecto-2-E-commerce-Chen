import dotenv from 'dotenv';

dotenv.config();

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toList(value, fallback) {
  const source = value ?? fallback;
  return source
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueList(values) {
  return [...new Set(values.filter(Boolean))];
}

const nodeEnv = process.env.NODE_ENV ?? 'development';
const frontendUrl = process.env.FRONTEND_URL ?? (
  nodeEnv === 'production' ? '' : 'http://localhost:8080'
);
const defaultCorsOrigins =
  nodeEnv === 'production'
    ? ''
    : 'http://localhost:5173,http://localhost:8080,http://127.0.0.1:5173,http://127.0.0.1:8080';
const corsOrigins = uniqueList([
  ...toList(process.env.CORS_ORIGIN, defaultCorsOrigins),
  frontendUrl,
]);

export const env = {
  nodeEnv,
  port: toNumber(process.env.PORT, 3000),
  host: process.env.HOST ?? '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET ?? 'secret_jwt_dev',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigins,
  frontendUrl,
  db: {
    databaseUrl: process.env.DATABASE_URL,
    host: process.env.DB_HOST ?? 'localhost',
    port: toNumber(process.env.DB_PORT, 5432),
    database: process.env.DB_NAME ?? 'tienda_peluches',
    user: process.env.DB_USER ?? 'proy2',
    password: process.env.DB_PASSWORD ?? 'secret',
    connectionLimit: toNumber(process.env.DB_CONNECTION_LIMIT, 10),
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
};
