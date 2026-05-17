import { useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { Categories } from '@/figma/admin/Categories';
import { Customers } from '@/figma/admin/Customers';
import { Dashboard } from '@/figma/admin/Dashboard';
import { PaymentMethods } from '@/figma/admin/PaymentMethods';
import { Products } from '@/figma/admin/Products';
import { Reports } from '@/figma/admin/Reports';
import { Sales } from '@/figma/admin/Sales';
import { Sidebar } from '@/figma/admin/Sidebar';
import { Suppliers } from '@/figma/admin/Suppliers';
import { TopBar } from '@/figma/admin/TopBar';
import { Users } from '@/figma/admin/Users';
import { Toaster } from '@/figma/admin/ui/sonner';

const ADMIN_SECTION_PATHS: Record<string, string> = {
  dashboard: '/admin',
  products: '/admin/productos',
  categories: '/admin/categorias',
  suppliers: '/admin/proveedores',
  customers: '/admin/clientes',
  users: '/admin/usuarios',
  sales: '/admin/ventas',
  payments: '/admin/metodos-pago',
  reports: '/admin/reportes',
};

const ADMIN_PATH_SECTIONS: Record<string, string> = Object.fromEntries(
  Object.entries(ADMIN_SECTION_PATHS).map(([section, path]) => [path, section]),
);

export function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const activeSection =
    ADMIN_PATH_SECTIONS[location.pathname] ?? searchParams.get('section') ?? 'dashboard';

  const handleSectionChange = (section: string) => {
    navigate(ADMIN_SECTION_PATHS[section] ?? '/admin');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const content = useMemo(() => {
    switch (activeSection) {
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'suppliers':
        return <Suppliers />;
      case 'customers':
        return <Customers />;
      case 'users':
        return <Users />;
      case 'sales':
        return <Sales />;
      case 'payments':
        return <PaymentMethods />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  }, [activeSection]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{content}</div>
        </main>
      </div>

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
