import { Pool } from 'pg';
import { DATABASE_URL } from '../config/env.js';

const pool = DATABASE_URL ? new Pool({ connectionString: DATABASE_URL }) : null;
const memoryUsers = [];

let schemaReady = false;

const ensureSchema = async () => {
  if (!pool || schemaReady) {
    return;
  }

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
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  schemaReady = true;
};

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
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const createUser = async (userInput) => {
  if (!pool) {
    const duplicate = memoryUsers.find(
      (user) => user.email === userInput.email || user.documentNumber === userInput.documentNumber,
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
      createdAt: now,
      updatedAt: now,
    };
    memoryUsers.push(user);
    return user;
  }

  await ensureSchema();

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
          role
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
      [
        userInput.firstName,
        userInput.lastName,
        userInput.documentType,
        userInput.documentNumber,
        userInput.email,
        userInput.phone,
        userInput.department,
        userInput.role,
      ],
    );

    return mapDbUser(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      const duplicateError = new Error('Ya existe un usuario con ese correo o documento.');
      duplicateError.code = 'USER_DUPLICATED';
      throw duplicateError;
    }

    throw error;
  }
};
