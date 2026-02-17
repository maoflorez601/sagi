//require('dotenv').config();
//const { Client } = require('pg');

import { DATABASE_URL } from './config/env.js';
import { Client } from 'pg';

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    const result = await client.query('SELECT NOW()');
    console.log('🕒 Server time:', result.rows[0].now);

  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
  } finally {
    await client.end();
  }
}

testConnection();
