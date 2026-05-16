import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
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

export interface CartState {
  items: CartItem[];
  error: string | null;
}

export type CartAction =
  | { type: 'add'; product: ClientProduct; quantity: number }
  | { type: 'remove'; productId: number }
  | { type: 'updateQuantity'; productId: number; quantity: number }
  | { type: 'clearCart' }
  | { type: 'clearError' };

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

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const { product, quantity } = action;

      if (product.stock <= 0) {
        return { ...state, error: 'Este producto no tiene stock disponible.' };
      }

      if (quantity <= 0) {
        return { ...state, error: 'La cantidad debe ser mayor a cero.' };
      }

      const existing = state.items.find((item) => item.product.id === product.id);

      if (existing) {
        const requestedQuantity = existing.quantity + quantity;
        const nextQuantity = Math.min(requestedQuantity, product.stock);

        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: nextQuantity,
                }
              : item,
          ),
          error:
            nextQuantity < requestedQuantity
              ? 'No hay mas unidades disponibles para este producto.'
              : null,
        };
      }

      const nextQuantity = Math.min(quantity, product.stock);

      return {
        items: [...state.items, { product, quantity: nextQuantity }],
        error:
          nextQuantity < quantity
            ? 'La cantidad solicitada supera el stock disponible.'
            : null,
      };
    }

    case 'remove':
      return {
        items: state.items.filter(
          (item) => Number(item.product.id) !== action.productId,
        ),
        error: null,
      };

    case 'updateQuantity': {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter(
            (item) => Number(item.product.id) !== action.productId,
          ),
          error: null,
        };
      }

      const itemToUpdate = state.items.find(
        (item) => Number(item.product.id) === action.productId,
      );

      return {
        items: state.items.map((item) =>
          Number(item.product.id) === action.productId
            ? {
                ...item,
                quantity: Math.min(action.quantity, item.product.stock),
              }
            : item,
        ),
        error:
          itemToUpdate && action.quantity > itemToUpdate.product.stock
            ? 'No hay mas unidades disponibles para este producto.'
            : null,
      };
    }

    case 'clearCart':
      return { items: [], error: null };

    case 'clearError':
      return { ...state, error: null };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => ({
    items: getStoredCart(),
    error: null,
  }));
  const { items, error } = state;

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
    dispatch({ type: 'clearError' });
  }, []);

  const addToCart = useCallback((product: ClientProduct, quantity = 1) => {
    dispatch({ type: 'add', product, quantity });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    dispatch({ type: 'remove', productId });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: 'updateQuantity', productId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'clearCart' });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      error,
      subtotal,
      total,
      totalItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
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
    [
      addToCart,
      clearCart,
      clearError,
      error,
      items,
      removeFromCart,
      subtotal,
      total,
      totalItems,
      updateQuantity,
    ],
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
