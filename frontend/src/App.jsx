import { useEffect, useState } from 'react';
import './App.css';
import {
  CreateProductModule,
  CreateRequestModule,
  LoginModule,
  ProductsPortal,
  RegisterModule,
  RequestsModule,
} from './pages/SagiPages.jsx';

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => setPath(window.location.pathname);

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  if (path === '/register') {
    return <RegisterModule />;
  }

  if (path === '/products') {
    return <ProductsPortal />;
  }

  if (path === '/products/create') {
    return <CreateProductModule />;
  }

  if (path === '/requests') {
    return <RequestsModule />;
  }

  if (path === '/requests/create') {
    return <CreateRequestModule />;
  }

  return <LoginModule />;
}

export default App;
