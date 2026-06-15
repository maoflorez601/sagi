import express from 'express';
import { FRONTEND_ORIGIN, PORT } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.get('/', (req, res) => {
  res.send('SAGI API is running OK');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', requestRoutes);
app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`SAGI backend listening on port ${PORT}`);
});
