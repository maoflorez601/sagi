# SAGI (Sistema de Administración de Gestión e Inventario)

SAGI (Inventory and Management System for Healthcare Providers) es una aplicación web para optimizar control de inventario, trazabilidad y gestión interna de insumos.

## Módulo de autenticación con Auth0

Se agregó una implementación base de autenticación para:

- **Frontend React (Vite)** usando Authorization Code Flow + PKCE.
- **Backend Express** validando access tokens JWT RS256 con llaves públicas de Auth0 (JWKS).

## 1) Configuración en Auth0

1. Crea una **Single Page Application** para el frontend.
2. Crea una **API** para el backend y copia su `Identifier` (audience).
3. En la SPA configura:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`

## 2) Variables de entorno

### Backend (`backend/.env`)

```env
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
AUTH0_DOMAIN=tu-tenant.us.auth0.com
AUTH0_AUDIENCE=https://sagi-api
# Opcional (si no se define se construye con AUTH0_DOMAIN)
AUTH0_ISSUER=https://tu-tenant.us.auth0.com/
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_AUTH0_DOMAIN=tu-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=tu_client_id_spa
VITE_AUTH0_AUDIENCE=https://sagi-api
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
```

## 3) Rutas disponibles

### Backend

- `GET /api/public` → ruta sin autenticación.
- `GET /api/protected` → requiere bearer token válido.
- `GET /api/admin` → requiere token válido y scope `read:admin`.

### Frontend

- Botón **Iniciar sesión con Auth0** para redirigir al login.
- Botón **Llamar /api/protected** para probar la API protegida con token.

## 4) Ejecución local

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```
