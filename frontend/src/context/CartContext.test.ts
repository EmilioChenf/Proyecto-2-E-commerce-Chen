import { describe, expect, it } from 'vitest';

import { cartReducer, type CartState } from './CartContext';
import type { ClientProduct } from '@/types';

const product: ClientProduct = {
  id: '1',
  name: 'Peluche Panda',
  price: 125,
  category: 'Peluches',
  brand: 'Escandalosos',
  description: 'Peluche de prueba',
  imagen: '/images/panda.png',
  image: '/images/panda.png',
  stock: 3,
};

const initialState: CartState = {
  items: [],
  error: null,
};

describe('cartReducer', () => {
  it('adds a product to the cart', () => {
    const nextState = cartReducer(initialState, {
      type: 'add',
      product,
      quantity: 2,
    });

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(2);
    expect(nextState.error).toBeNull();
  });

  it('caps quantity at available stock and exposes an error', () => {
    const stateWithProduct = cartReducer(initialState, {
      type: 'add',
      product,
      quantity: 2,
    });

    const nextState = cartReducer(stateWithProduct, {
      type: 'add',
      product,
      quantity: 5,
    });

    expect(nextState.items[0].quantity).toBe(3);
    expect(nextState.error).toBe('No hay mas unidades disponibles para este producto.');
  });

  it('removes a product when quantity is updated to zero', () => {
    const stateWithProduct = cartReducer(initialState, {
      type: 'add',
      product,
      quantity: 1,
    });

    const nextState = cartReducer(stateWithProduct, {
      type: 'updateQuantity',
      productId: 1,
      quantity: 0,
    });

    expect(nextState.items).toHaveLength(0);
    expect(nextState.error).toBeNull();
  });
});

