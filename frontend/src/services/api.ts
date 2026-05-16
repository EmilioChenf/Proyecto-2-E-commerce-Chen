import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export const TOKEN_STORAGE_KEY = 'plushstore_token';
export const USER_STORAGE_KEY = 'plushstore_user';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

function shouldRetry(error: AxiosError) {
  const method = error.config?.method?.toLowerCase();
  const status = error.response?.status;

  return (
    method === 'get' &&
    (!status || status >= 500) &&
    (error.code === 'ECONNABORTED' || !error.response || status >= 500)
  );
}

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;

    if (!config || !shouldRetry(error)) {
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount ?? 0;

    if (config.retryCount >= 2) {
      return Promise.reject(error);
    }

    config.retryCount += 1;
    await wait(400 * config.retryCount);
    return api(config);
  },
);
