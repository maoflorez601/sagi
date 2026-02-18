import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContextValue.js';
import {
  exchangeCodeForToken,
  loginWithRedirect,
  logoutWithRedirect,
  parseJwtPayload,
} from './auth0Client';

const tokenStorageKey = 'auth_access_token';

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem(tokenStorageKey) || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const bootAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (code && state) {
          const tokenResponse = await exchangeCodeForToken(code, state);
          localStorage.setItem(tokenStorageKey, tokenResponse.access_token);
          setAccessToken(tokenResponse.access_token);

          const cleanUrl = `${window.location.origin}${window.location.pathname}`;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } catch (authError) {
        setError(authError.message);
      } finally {
        setIsLoading(false);
      }
    };

    bootAuth();
  }, []);

  const login = async () => {
    setError('');
    await loginWithRedirect();
  };

  const logout = () => {
    localStorage.removeItem(tokenStorageKey);
    setAccessToken('');
    logoutWithRedirect();
  };

  const user = useMemo(() => parseJwtPayload(accessToken), [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthenticated: Boolean(accessToken),
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
