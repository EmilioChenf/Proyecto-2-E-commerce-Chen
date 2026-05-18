import { createBrowserRouter, Navigate } from 'react-router-dom';

import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { ClientLayout } from '@/layouts/ClientLayout';
import { AuthPage } from '@/pages/Login/AuthPage';
import { AdminPage } from '@/pages/Admin/AdminPage';
import { Home } from '@/pages/Cliente/src/app/pages/Home';
import { Catalog } from '@/pages/Cliente/src/app/pages/Catalog';
import { ProductDetail } from '@/pages/Cliente/src/app/pages/ProductDetail';
import { Cart } from '@/pages/Cliente/src/app/pages/Cart';
import { Checkout } from '@/pages/Cliente/src/app/pages/Checkout';
import { Confirmation } from '@/pages/Cliente/src/app/pages/Confirmation';
import { Orders } from '@/pages/Cliente/src/app/pages/Orders';
import { getPathForRole } from '@/context/AuthContext';

function RouteErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          No pudimos cargar esta vista
        </h1>
        <p className="mt-3 text-gray-600">
          Intenta recargar la pagina o vuelve al inicio.
        </p>
      </div>
    </div>
  );
}

function RootEntry() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={getPathForRole(user.rol)} replace />;
  }

  return <AuthPage />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootEntry />,
    errorElement: <RouteErrorFallback />,
  },
  {
    path: '/login',
    element: <RootEntry />,
    errorElement: <RouteErrorFallback />,
  },
  {
    path: '/admin/*',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminPage />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorFallback />,
  },
  {
    element: (
      <ProtectedRoute allowedRoles={['CLIENTE']}>
        <ClientLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorFallback />,
    children: [
      {
        path: '/cliente',
        element: <Home />,
      },
      {
        path: '/catalogo',
        element: <Catalog />,
      },
      {
        path: '/producto/:id',
        element: <ProductDetail />,
      },
      {
        path: '/carrito',
        element: <Cart />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/confirmacion',
        element: <Confirmation />,
      },
      {
        path: '/ordenes',
        element: <Orders />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
