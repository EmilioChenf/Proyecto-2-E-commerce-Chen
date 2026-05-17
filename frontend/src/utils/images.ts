import type { SyntheticEvent } from 'react';

function normalizeApiUrl(value?: string) {
  const apiUrl = value?.trim() || '/api';
  const normalized = apiUrl.replace(/\/+$/, '');

  if (normalized === '/api' || normalized.endsWith('/api')) {
    return normalized;
  }

  return `${normalized}/api`;
}

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

export const PRODUCT_PLACEHOLDER_IMAGE =
  '/images/productos/placeholder-producto.png';

function getApiOrigin() {
  if (!API_URL.startsWith('http')) {
    return '';
  }

  return API_URL.replace(/\/api\/?$/, '');
}

export function resolveProductImage(image?: string | null) {
  const value = image?.trim();

  if (!value) {
    return PRODUCT_PLACEHOLDER_IMAGE;
  }

  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) {
    return value;
  }

  if (value.startsWith('/')) {
    if (value.startsWith('/uploads/')) {
      return `${getApiOrigin()}${value}`;
    }

    return value;
  }

  return `/images/${value}`;
}

export function useImageFallback(event: SyntheticEvent<HTMLImageElement>) {
  if (event.currentTarget.src !== PRODUCT_PLACEHOLDER_IMAGE) {
    event.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
  }
}
