import { randomUUID } from 'crypto';
import { Router } from 'express';
import { authenticateUser } from '../lib/usersStore.js';

const router = Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/auth/login', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    return res.status(400).json({
      error: 'missing_credentials',
      message: 'Debes ingresar correo electronico y contrasena.',
    });
  }

  if (!emailPattern.test(email)) {
    return res.status(400).json({
      error: 'invalid_email',
      message: 'El correo electronico no tiene un formato valido.',
    });
  }

  try {
    const user = await authenticateUser({ email, password });

    if (!user) {
      return res.status(401).json({
        error: 'invalid_credentials',
        message: 'Correo electronico o contrasena incorrectos.',
      });
    }

    return res.json({
      message: 'Inicio de sesion correcto.',
      session: {
        token: randomUUID(),
        user,
        createdAt: new Date().toISOString(),
      },
    });
  } catch {
    return res.status(500).json({
      error: 'login_failed',
      message: 'No se pudo validar el inicio de sesion.',
    });
  }
});

export default router;
