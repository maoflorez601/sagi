import { Pool } from 'pg';
import { DATABASE_URL } from '../config/env.js';
import { hashPassword, verifyPassword } from './passwords.js';

const pool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL }) : null;
const memoryUsers = [];

let schemaReady = false;
let demoUserReady = false;
let dbDisabled = false;

const roleByDepartment = {
  Farmacia: 'Auxiliar de farmacia',
  Administracion: 'Administrador del sistema',
  Compras: 'Gestor de compras',
  Almacen: 'Coordinador de inventario',
  Enfermeria: 'Usuario asistencial',
  Auditoria: 'Auditor interno',
};

const publicUserFields = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  documentType: user.documentType,
  documentNumber: user.documentNumber,
  email: user.email,
  phone: user.phone,
  department: user.department,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const mapDbUser = (row) => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  documentType: row.document_type,
  documentNumber: row.document_number,
  email: row.email,
  phone: row.phone,
  department: row.department,
  role: row.role,
  passwordHash: row.password_hash,
  passwordSalt: row.password_salt,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const ensureSchema = async () => {
  if (!pool || dbDisabled || schemaReady) {
    return;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        document_type TEXT NOT NULL,
        document_number TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        department TEXT NOT NULL,
        role TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_salt TEXT');

    schemaReady = true;
  } catch {
    dbDisabled = true;
  }
};

const findMemoryUserByEmail = (email) => memoryUsers.find((user) => user.email === email);

const findDbUserByEmail = async (email) => {
  await ensureSchema();

  if (dbDisabled) {
    return findMemoryUserByEmail(email);
  }

  const result = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return result.rows[0] ? mapDbUser(result.rows[0]) : null;
};

export const ensureDemoUser = async () => {
  if (demoUserReady) {
    return;
  }

  const demoEmail = 'usuario@ejemplo.com';
  const existingUser =
    pool && !dbDisabled ? await findDbUserByEmail(demoEmail) : findMemoryUserByEmail(demoEmail);

  if (!existingUser) {
    await createUser({
      firstName: 'Usuario',
      lastName: 'SAGI',
      documentType: 'Cedula de ciudadania',
      documentNumber: '1000000000',
      email: demoEmail,
      phone: '300 000 0000',
      department: 'Administracion',
      role: roleByDepartment.Administracion,
      password: 'sagi12345',
    });
  }

  demoUserReady = true;
};

export const createUser = async (userInput) => {
  const email = userInput.email.toLowerCase();
  const role = userInput.role || roleByDepartment[userInput.department] || 'Usuario del sistema';
  const { passwordHash, passwordSalt } = await hashPassword(userInput.password);

  await ensureSchema();

  if (!pool || dbDisabled) {
    const duplicate = memoryUsers.find(
      (user) => user.email === email || user.documentNumber === userInput.documentNumber,
    );

    if (duplicate) {
      const error = new Error('Ya existe un usuario con ese correo o documento.');
      error.code = 'USER_DUPLICATED';
      throw error;
    }

    const now = new Date().toISOString();
    const user = {
      id: memoryUsers.length + 1,
      ...userInput,
      email,
      role,
      passwordHash,
      passwordSalt,
      createdAt: now,
      updatedAt: now,
    };

    memoryUsers.push(user);
    return publicUserFields(user);
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO users (
          first_name,
          last_name,
          document_type,
          document_number,
          email,
          phone,
          department,
          role,
          password_hash,
          password_salt
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `,
      [
        userInput.firstName,
        userInput.lastName,
        userInput.documentType,
        userInput.documentNumber,
        email,
        userInput.phone,
        userInput.department,
        role,
        passwordHash,
        passwordSalt,
      ],
    );

    return publicUserFields(mapDbUser(result.rows[0]));
  } catch (error) {
    if (error.code === '23505') {
      const duplicateError = new Error('Ya existe un usuario con ese correo o documento.');
      duplicateError.code = 'USER_DUPLICATED';
      throw duplicateError;
    }

    throw error;
  }
};

export const authenticateUser = async ({ email, password }) => {
  await ensureDemoUser();

  const normalizedEmail = email.toLowerCase();
  const user =
    pool && !dbDisabled ? await findDbUserByEmail(normalizedEmail) : findMemoryUserByEmail(normalizedEmail);

  if (!user) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash, user.passwordSalt);

  if (!isValidPassword) {
    return null;
  }

  return publicUserFields(user);
};
