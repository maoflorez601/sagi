import { verifyAuth0Token } from '../lib/auth0Jwt.js';

const bearerPrefix = 'Bearer ';

export const requireAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || '';

    if (!authorization.startsWith(bearerPrefix)) {
      return res.status(401).json({
        error: 'missing_token',
        message: 'Debes enviar un access token en el header Authorization.',
      });
    }

    const token = authorization.slice(bearerPrefix.length).trim();
    const payload = await verifyAuth0Token(token);

    req.auth = payload;
    return next();
  } catch (error) {
    return res.status(401).json({
      error: 'invalid_token',
      message: error.message,
    });
  }
};

export const requireScope = (scope) => (req, res, next) => {
  const scopes = (req.auth?.scope || '').split(' ').filter(Boolean);

  if (!scopes.includes(scope)) {
    return res.status(403).json({
      error: 'insufficient_scope',
      message: `Se requiere el scope "${scope}" para acceder a este recurso.`,
    });
  }

  return next();
};
