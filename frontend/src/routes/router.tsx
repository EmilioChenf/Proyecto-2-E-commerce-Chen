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
  },
  {
    path: '/login',
    element: <RootEntry />,
  },
  {
    path: '/admin/*',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute allowedRoles={['CLIENTE']}>
        <ClientLayout />
      </ProtectedRoute>
    ),
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
