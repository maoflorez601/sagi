import { Router } from 'express';

const router = Router();

let products = [
  {
    code: 'PROD-001',
    name: 'Paracetamol 500mg',
    description: 'Tabletas',
    category: 'Medicamentos',
    presentation: 'Caja x 100',
    stock: 120,
    status: 'Activo',
  },
  {
    code: 'PROD-002',
    name: 'Omeprazol 20mg',
    description: 'Capsulas',
    category: 'Medicamentos',
    presentation: 'Caja x 30',
    stock: 80,
    status: 'Activo',
  },
  {
    code: 'PROD-003',
    name: 'Ibuprofeno 400mg',
    description: 'Tabletas',
    category: 'Medicamentos',
    presentation: 'Caja x 50',
    stock: 60,
    status: 'Activo',
  },
  {
    code: 'PROD-004',
    name: 'Guantes de Nitrilo Talla M',
    description: 'Caja x 100 unidades',
    category: 'Insumos Medicos',
    presentation: 'Caja x 100',
    stock: 200,
    status: 'Activo',
  },
  {
    code: 'PROD-005',
    name: 'Jeringa 5ml',
    description: 'Esteril, con aguja',
    category: 'Insumos Medicos',
    presentation: 'Caja x 100',
    stock: 150,
    status: 'Activo',
  },
  {
    code: 'PROD-006',
    name: 'Alcohol antiseptico 70%',
    description: 'Frasco 500ml',
    category: 'Aseo y desinfeccion',
    presentation: 'Unidad',
    stock: 0,
    status: 'Agotado',
  },
];

router.get('/products', (req, res) => {
  res.json({ products });
});

router.post('/products', (req, res) => {
  const product = req.body || {};
  const code = typeof product.code === 'string' ? product.code.trim() : '';

  if (!code) {
    return res.status(400).json({
      error: 'missing_product_code',
      message: 'El codigo del producto es obligatorio.',
    });
  }

  const duplicatedCode = products.some(
    (currentProduct) => currentProduct.code.toLowerCase() === code.toLowerCase(),
  );

  if (duplicatedCode) {
    return res.status(409).json({
      error: 'duplicated_product_code',
      message: 'Ya existe un producto con este codigo.',
    });
  }

  const nextProduct = {
    ...product,
    code,
    stock: Number(product.stock || 0),
    status: product.status || 'Activo',
  };

  products = [...products, nextProduct];

  return res.status(201).json({
    message: 'Producto registrado correctamente.',
    product: nextProduct,
  });
});

export default router;
