import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { fetchBrands, fetchCategories, fetchPaymentMethods, fetchProducts, fetchSales } from '@/services/catalogService';
import { createSale } from '@/services/adminService';
import { useAuth } from './AuthContext';
import { toLegacyProduct } from '@/utils/adapters';
import type {
  Brand,
  Category,
  ClientProduct,
  CheckoutPayload,
  PaymentMethod,
  SaleDetail,
  SaleListItem,
} from '@/types';

interface StoreContextValue {
  products: ClientProduct[];
  categories: Category[];
  brands: Brand[];
  paymentMethods: PaymentMethod[];
  orders: SaleListItem[];
  loading: boolean;
  error: string | null;
  refreshCatalog: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  checkout: (payload: CheckoutPayload) => Promise<SaleDetail>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<ClientProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orders, setOrders] = useState<SaleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCatalog = useCallback(async () => {
    setError(null);

    const [nextProducts, nextCategories, nextBrands, nextPaymentMethods] =
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBrands(),
        fetchPaymentMethods(),
      ]);

    setProducts(nextProducts.map(toLegacyProduct));
    setCategories(nextCategories);
    setBrands(nextBrands);
    setPaymentMethods(nextPaymentMethods);
  }, []);

  const refreshOrders = useCallback(async () => {
    if (!user || user.rol !== 'CLIENTE') {
      setOrders([]);
      return;
    }

    const nextOrders = await fetchSales('mine');
    setOrders(nextOrders);
  }, [user]);

  const checkout = useCallback(
    async (payload: CheckoutPayload) => {
      const sale = await createSale(payload);
      await Promise.all([refreshCatalog(), refreshOrders()]);
      return sale;
    },
    [refreshCatalog, refreshOrders],
  );

  useEffect(() => {
    async function bootstrap() {
      setLoading(true);

      try {
        await Promise.all([refreshCatalog(), refreshOrders()]);
      } catch {
        setError('No se pudieron cargar los productos. Intenta recargar la pagina.');
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [refreshCatalog, refreshOrders]);

  const value = useMemo<StoreContextValue>(
    () => ({
      products,
      categories,
      brands,
      paymentMethods,
      orders,
      loading,
      error,
      refreshCatalog,
      refreshOrders,
      checkout,
    }),
    [
      brands,
      categories,
      checkout,
      error,
      loading,
      orders,
      paymentMethods,
      products,
      refreshCatalog,
      refreshOrders,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore debe usarse dentro de StoreProvider');
  }

  return context;
}
