import { Router } from 'express';
import { createUser } from '../lib/usersStore.js';

const router = Router();

const requiredFields = [
  'firstName',
  'lastName',
  'documentType',
  'documentNumber',
  'email',
  'phone',
  'department',
  'role',
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeUserInput = (body) => {
  const normalized = {};

  requiredFields.forEach((field) => {
    normalized[field] = typeof body[field] === 'string' ? body[field].trim() : '';
  });

  normalized.email = normalized.email.toLowerCase();
  return normalized;
};

const validateUserInput = (userInput) => {
  const missingField = requiredFields.find((field) => !userInput[field]);

  if (missingField) {
    return `El campo ${missingField} es obligatorio.`;
  }

  if (!emailPattern.test(userInput.email)) {
    return 'El correo electronico no tiene un formato valido.';
  }

  if (userInput.documentNumber.length < 5) {
    return 'El numero de documento debe tener al menos 5 caracteres.';
  }

  return '';
};

router.post('/users', async (req, res) => {
  const userInput = normalizeUserInput(req.body || {});
  const validationError = validateUserInput(userInput);

  if (validationError) {
    return res.status(400).json({
      error: 'invalid_user_payload',
      message: validationError,
    });
  }

  try {
    const user = await createUser(userInput);

    return res.status(201).json({
      message: 'Usuario registrado correctamente.',
      user,
    });
  } catch (error) {
    if (error.code === 'USER_DUPLICATED') {
      return res.status(409).json({
        error: 'duplicated_user',
        message: error.message,
      });
    }

    return res.status(500).json({
      error: 'user_creation_failed',
      message: 'No se pudo registrar el usuario.',
    });
  }
});

export default router;
