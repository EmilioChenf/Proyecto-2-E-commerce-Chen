import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { CartItem, ClientProduct } from '@/types';

const STORAGE_KEY = 'plushstore_cart';

interface CartContextValue {
  items: CartItem[];
  error: string | null;
  subtotal: number;
  total: number;
  totalItems: number;
  addToCart: (product: ClientProduct, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  clearError: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function getStoredCart() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as CartItem[];
  } catch (_error) {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => getStoredCart());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [items],
  );
  const total = subtotal;
  const totalItems = useMemo(
    () => items.reduce((totalCount, item) => totalCount + item.quantity, 0),
    [items],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      error,
      subtotal,
      total,
      totalItems,
      addToCart(product, quantity = 1) {
        setError(null);

        if (product.stock <= 0) {
          setError('Este producto no tiene stock disponible.');
          return;
        }

        if (quantity <= 0) {
          setError('La cantidad debe ser mayor a cero.');
          return;
        }

        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id);

          if (existing) {
            const requestedQuantity = existing.quantity + quantity;
            const nextQuantity = Math.min(requestedQuantity, product.stock);

            if (nextQuantity < requestedQuantity) {
              setError('No hay mas unidades disponibles para este producto.');
            }

            return current.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: nextQuantity,
                  }
                : item,
            );
          }

          const nextQuantity = Math.min(quantity, product.stock);

          if (nextQuantity < quantity) {
            setError('La cantidad solicitada supera el stock disponible.');
          }

          return [...current, { product, quantity: nextQuantity }];
        });
      },
      removeFromCart(productId) {
        setError(null);
        setItems((current) =>
          current.filter((item) => Number(item.product.id) !== productId),
        );
      },
      updateQuantity(productId, quantity) {
        setError(null);

        if (quantity <= 0) {
          setItems((current) =>
            current.filter((item) => Number(item.product.id) !== productId),
          );
          return;
        }

        setItems((current) =>
          current.map((item) =>
            Number(item.product.id) === productId
              ? {
                  ...item,
                  quantity: Math.min(quantity, item.product.stock),
                }
              : item,
          ),
        );

        const item = items.find((currentItem) => Number(currentItem.product.id) === productId);

        if (item && quantity > item.product.stock) {
          setError('No hay mas unidades disponibles para este producto.');
        }
      },
      clearCart() {
        setError(null);
        setItems([]);
      },
      clearError,
      getSubtotal() {
        return subtotal;
      },
      getTotalItems() {
        return totalItems;
      },
      getTotalPrice() {
        return total;
      },
    }),
    [clearError, error, items, subtotal, total, totalItems],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }

  return context;
}
