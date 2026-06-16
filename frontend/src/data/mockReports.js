export const inventoryStatusReport = [
  { label: 'Disponible', value: 4, color: 'green', caption: 'Productos con stock suficiente' },
  { label: 'Stock bajo', value: 2, color: 'orange', caption: 'Requieren reposicion' },
  { label: 'Agotado', value: 1, color: 'red', caption: 'Sin unidades disponibles' },
  { label: 'Vencido', value: 1, color: 'blue', caption: 'Revisar disposicion final' },
];

export const expiringLotsReport = [
  {
    product: 'Paracetamol 500mg',
    lot: 'L-2024-A',
    expiresAt: '2024-06-12',
    daysLeft: 16,
    stock: 42,
    status: 'Proximo',
  },
  {
    product: 'Omeprazol 20mg',
    lot: 'L-2024-F',
    expiresAt: '2024-06-22',
    daysLeft: 26,
    stock: 18,
    status: 'Vigente',
  },
  {
    product: 'Alcohol antiseptico 70%',
    lot: 'L-2024-D',
    expiresAt: '2024-06-04',
    daysLeft: 8,
    stock: 9,
    status: 'Critico',
  },
  {
    product: 'Ibuprofeno 400mg',
    lot: 'L-2024-E',
    expiresAt: '2024-05-20',
    daysLeft: -7,
    stock: 6,
    status: 'Vencido',
  },
];

export const topMovingProductsReport = [
  { product: 'Guantes de Nitrilo Talla M', movements: 160, trend: '+18%', category: 'Insumos Medicos' },
  { product: 'Paracetamol 500mg', movements: 115, trend: '+12%', category: 'Medicamentos' },
  { product: 'Jeringa 5ml', movements: 87, trend: '+9%', category: 'Insumos Medicos' },
  { product: 'Alcohol antiseptico 70%', movements: 57, trend: '-4%', category: 'Aseo y desinfeccion' },
];

export const reportFilters = {
  categories: ['Todas las categorias', 'Medicamentos', 'Insumos Medicos', 'Aseo y desinfeccion'],
  areas: ['Todas las areas', 'Bodega principal', 'Farmacia', 'Urgencias', 'Hospitalizacion', 'Cirugia', 'Laboratorio Clinico'],
  states: ['Todos los estados', 'Disponible', 'Stock bajo', 'Agotado', 'Vencido'],
};

export const estimatedInventoryValue = 42850000;
