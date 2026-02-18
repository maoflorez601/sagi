import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = Number(process.env.PORT || 3000);
export const DATABASE_URL = process.env.DATABASE_URL;
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || '';
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || '';
export const AUTH0_ISSUER =
  process.env.AUTH0_ISSUER || (AUTH0_DOMAIN ? `https://${AUTH0_DOMAIN}/` : '');
