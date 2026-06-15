import { Router } from 'express';

const router = Router();

const requests = [
  {
    id: 1,
    code: 'SOL-2024-0001',
    date: '2024-05-27T10:30:00',
    area: 'Farmacia',
    requestedBy: 'Maria Gomez',
    status: 'Pendiente',
    priority: 'Media',
    observations: 'Reposicion semanal para dispensacion.',
    createdAt: '2024-05-27T10:30:00',
    approvedAt: '',
    approvedBy: '',
    products: [
      { product: 'Paracetamol 500mg', productCode: 'PROD-001', quantity: 30, unit: 'Caja', observations: 'Alta rotacion' },
      { product: 'Omeprazol 20mg', productCode: 'PROD-002', quantity: 12, unit: 'Caja', observations: '' },
      { product: 'Jeringa 5ml', productCode: 'PROD-005', quantity: 8, unit: 'Caja', observations: 'Con aguja' },
    ],
  },
  {
    id: 2,
    code: 'SOL-2024-0002',
    date: '2024-05-26T16:15:00',
    area: 'Urgencias',
    requestedBy: 'Carlos Ramirez',
    status: 'Aprobada',
    priority: 'Alta',
    observations: 'Solicitud para turno nocturno.',
    createdAt: '2024-05-26T16:15:00',
    approvedAt: '2024-05-26T17:05:00',
    approvedBy: 'Admin SAGI',
    products: [
      { product: 'Guantes de Nitrilo Talla M', productCode: 'PROD-004', quantity: 20, unit: 'Caja', observations: '' },
      { product: 'Alcohol antiseptico 70%', productCode: 'PROD-006', quantity: 15, unit: 'Unidad', observations: 'Area triage' },
    ],
  },
];

router.get('/requests', (req, res) => {
  res.json({ requests });
});

router.post('/requests', (req, res) => {
  const request = req.body || {};
  const nextRequest = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    status: 'Pendiente',
    products: [],
    ...request,
  };

  requests.push(nextRequest);

  return res.status(201).json({
    message: 'Solicitud registrada correctamente.',
    request: nextRequest,
  });
});

export default router;
