import { PORT } from './config/env.js';
import express from 'express';
//const express = require('express')
const app = express()
//const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('SAGI API is running OK 🚀');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})