import { useEffect, useState } from 'react';
import './App.css';
import { MainLayout } from './components/layout/MainLayout.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import LotsPage from './pages/lots/LotsPage.jsx';
import MovementsPage from './pages/movements/MovementsPage.jsx';
import ProductsPage from './pages/products/ProductsPage.jsx';
import CreateProductPage from './pages/products/CreateProductPage.jsx';
import ReportsPage from './pages/reports/ReportsPage.jsx';
import RequestsPage from './pages/requests/RequestsPage.jsx';
import CreateRequestPage from './pages/requests/CreateRequestPage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import UsersPage from './pages/users/UsersPage.jsx';

const internalRoutes = {
  '/dashboard': DashboardPage,
  '/products': ProductsPage,
  '/products/create': CreateProductPage,
  '/requests': RequestsPage,
  '/requests/create': CreateRequestPage,
  '/lots': LotsPage,
  '/movements': MovementsPage,
  '/reports': ReportsPage,
  '/users': UsersPage,
  '/settings': SettingsPage,
};

const layoutRoutes = ['/dashboard', '/lots', '/movements', '/reports', '/users', '/settings'];

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  if (path === '/register') return <RegisterPage />;
  if (path === '/login' || path === '/') return <LoginPage />;

  const Page = internalRoutes[path] || DashboardPage;

  if (layoutRoutes.includes(path) || !internalRoutes[path]) {
    return (
      <MainLayout activePath={path}>
        <Page />
      </MainLayout>
    );
  }

  return <Page />;
}

export default App;
