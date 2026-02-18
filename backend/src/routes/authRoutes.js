import { Router } from 'express';
import { requireAuth, requireScope } from '../middleware/auth.js';

const router = Router();

router.get('/public', (req, res) => {
  res.json({
    message: 'Ruta pública accesible sin autenticación.',
    ts: new Date().toISOString(),
  });
});

router.get('/protected', requireAuth, (req, res) => {
  res.json({
    message: 'Acceso autorizado mediante Auth0.',
    user: {
      sub: req.auth.sub,
      scope: req.auth.scope || '',
    },
  });
});

router.get('/admin', requireAuth, requireScope('read:admin'), (req, res) => {
  res.json({
    message: 'Ruta con scope read:admin autorizado.',
  });
});

export default router;
