import { Outlet } from 'react-router-dom';

import { CartProvider } from '@/context/CartContext';
import { StoreProvider } from '@/context/StoreContext';
import { Header } from '@/figma/client/Header';
import { Footer } from '@/figma/client/Footer';
import { Toaster } from '@/figma/client/ui/sonner';
import { CartProvider as ClientCartProvider } from '@/pages/Cliente/src/app/contexts/CartContext';

export function ClientLayout() {
  return (
    <StoreProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <ClientCartProvider>
              <Outlet />
            </ClientCartProvider>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" richColors closeButton />
      </CartProvider>
    </StoreProvider>
  );
}
