import { useState } from 'react';
import { useAuth } from './auth/useAuth.js';
import './App.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function App() {
  const { isAuthenticated, isLoading, user, login, logout, accessToken, error } = useAuth();
  const [protectedResult, setProtectedResult] = useState('');
  const [requestError, setRequestError] = useState('');

  const callProtectedApi = async () => {
    try {
      setRequestError('');
      const response = await fetch(`${apiBaseUrl}/api/protected`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo consultar la ruta protegida.');
      }

      setProtectedResult(JSON.stringify(data, null, 2));
    } catch (apiError) {
      setRequestError(apiError.message);
      setProtectedResult('');
    }
  };

  return (
    <main className="container">
      <h1>Autenticación Auth0 (React + Express)</h1>
      <p className="subtitle">
        Demo de login con Auth0 desde frontend y validación JWT en backend.
      </p>

      {isLoading ? <p>Cargando estado de autenticación...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <section className="card">
        <h2>Sesión</h2>
        {isAuthenticated ? (
          <>
            <p>
              <strong>Usuario:</strong> {user?.name || user?.email || user?.sub}
            </p>
            <button onClick={logout}>Cerrar sesión</button>
          </>
        ) : (
          <button onClick={login}>Iniciar sesión con Auth0</button>
        )}
      </section>

      <section className="card">
        <h2>API protegida</h2>
        <p>Esta acción envía el access token al backend Express.</p>
        <button disabled={!isAuthenticated} onClick={callProtectedApi}>
          Llamar /api/protected
        </button>
        {requestError ? <p className="error">{requestError}</p> : null}
        {protectedResult ? <pre>{protectedResult}</pre> : null}
      </section>
    </main>
  );
}

export default App;
