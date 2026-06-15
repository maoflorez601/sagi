import { useEffect, useMemo, useState } from 'react';
import './App.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const currentUser = {
  name: 'Admin SAGI',
  role: 'Administrador',
};

const initialLoginForm = {
  email: 'usuario@ejemplo.com',
  password: 'sagi12345',
  remember: false,
};

const initialRegisterForm = {
  firstName: 'Juan Carlos',
  lastName: 'Perez Gonzalez',
  documentType: 'Cedula de ciudadania',
  documentNumber: '1234567890',
  email: 'juan.perez@hospital.com',
  phone: '300 123 4567',
  department: 'Farmacia',
  password: 'sagi12345',
};

const documentTypes = [
  'Cedula de ciudadania',
  'Cedula de extranjeria',
  'Tarjeta de identidad',
  'Pasaporte',
];

const departments = [
  'Farmacia',
  'Administracion',
  'Compras',
  'Almacen',
  'Enfermeria',
  'Auditoria',
];

const roleByDepartment = {
  Farmacia: 'Auxiliar de farmacia',
  Administracion: 'Administrador del sistema',
  Compras: 'Gestor de compras',
  Almacen: 'Coordinador de inventario',
  Enfermeria: 'Usuario asistencial',
  Auditoria: 'Auditor interno',
};

const sampleProducts = [
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

const productsStorageKey = 'sagi_products';

const sampleRequests = [
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
      { product: 'Jeringa 5ml', productCode: 'PROD-005', quantity: 10, unit: 'Caja', observations: '' },
      { product: 'Ibuprofeno 400mg', productCode: 'PROD-003', quantity: 5, unit: 'Caja', observations: '' },
      { product: 'Paracetamol 500mg', productCode: 'PROD-001', quantity: 8, unit: 'Caja', observations: '' },
    ],
  },
  {
    id: 3,
    code: 'SOL-2024-0003',
    date: '2024-05-25T09:20:00',
    area: 'Hospitalizacion',
    requestedBy: 'Laura Torres',
    status: 'Rechazada',
    priority: 'Baja',
    observations: 'Cantidad no justificada para el consumo actual.',
    createdAt: '2024-05-25T09:20:00',
    approvedAt: '2024-05-25T11:00:00',
    approvedBy: 'Admin SAGI',
    products: [{ product: 'Omeprazol 20mg', productCode: 'PROD-002', quantity: 50, unit: 'Caja', observations: 'Solicitud sobredimensionada' }],
  },
  {
    id: 4,
    code: 'SOL-2024-0004',
    date: '2024-05-24T14:10:00',
    area: 'Cirugia',
    requestedBy: 'Andres Molina',
    status: 'Pendiente',
    priority: 'Critica',
    observations: 'Programacion quirurgica de fin de semana.',
    createdAt: '2024-05-24T14:10:00',
    approvedAt: '',
    approvedBy: '',
    products: [
      { product: 'Guantes de Nitrilo Talla M', productCode: 'PROD-004', quantity: 40, unit: 'Caja', observations: '' },
      { product: 'Jeringa 5ml', productCode: 'PROD-005', quantity: 25, unit: 'Caja', observations: '' },
    ],
  },
  {
    id: 5,
    code: 'SOL-2024-0005',
    date: '2024-05-23T08:45:00',
    area: 'Laboratorio Clinico',
    requestedBy: 'Natalia Rios',
    status: 'Aprobada',
    priority: 'Media',
    observations: 'Consumo mensual.',
    createdAt: '2024-05-23T08:45:00',
    approvedAt: '2024-05-23T10:12:00',
    approvedBy: 'Admin SAGI',
    products: [{ product: 'Alcohol antiseptico 70%', productCode: 'PROD-006', quantity: 18, unit: 'Unidad', observations: '' }],
  },
  {
    id: 6,
    code: 'SOL-2024-0006',
    date: '2024-05-22T11:35:00',
    area: 'Consulta Externa',
    requestedBy: 'Julian Perez',
    status: 'Pendiente',
    priority: 'Baja',
    observations: 'Reposicion para consultorios.',
    createdAt: '2024-05-22T11:35:00',
    approvedAt: '',
    approvedBy: '',
    products: [
      { product: 'Ibuprofeno 400mg', productCode: 'PROD-003', quantity: 4, unit: 'Caja', observations: '' },
      { product: 'Paracetamol 500mg', productCode: 'PROD-001', quantity: 6, unit: 'Caja', observations: '' },
    ],
  },
  {
    id: 7,
    code: 'SOL-2024-0007',
    date: '2024-05-21T15:00:00',
    area: 'Urgencias',
    requestedBy: 'Diana Castro',
    status: 'Aprobada',
    priority: 'Critica',
    observations: 'Contingencia por alta ocupacion.',
    createdAt: '2024-05-21T15:00:00',
    approvedAt: '2024-05-21T15:30:00',
    approvedBy: 'Admin SAGI',
    products: [{ product: 'Jeringa 5ml', productCode: 'PROD-005', quantity: 30, unit: 'Caja', observations: '' }],
  },
  {
    id: 8,
    code: 'SOL-2024-0008',
    date: '2024-05-20T13:25:00',
    area: 'Farmacia',
    requestedBy: 'Sofia Herrera',
    status: 'Rechazada',
    priority: 'Media',
    observations: 'Producto disponible en stock local del area.',
    createdAt: '2024-05-20T13:25:00',
    approvedAt: '2024-05-20T14:01:00',
    approvedBy: 'Admin SAGI',
    products: [{ product: 'Paracetamol 500mg', productCode: 'PROD-001', quantity: 10, unit: 'Caja', observations: '' }],
  },
  {
    id: 9,
    code: 'SOL-2024-0009',
    date: '2024-05-19T07:40:00',
    area: 'Hospitalizacion',
    requestedBy: 'Elena Vargas',
    status: 'Pendiente',
    priority: 'Alta',
    observations: 'Aumento temporal de camas habilitadas.',
    createdAt: '2024-05-19T07:40:00',
    approvedAt: '',
    approvedBy: '',
    products: [{ product: 'Guantes de Nitrilo Talla M', productCode: 'PROD-004', quantity: 22, unit: 'Caja', observations: '' }],
  },
  {
    id: 10,
    code: 'SOL-2024-0010',
    date: '2024-05-18T10:05:00',
    area: 'Cirugia',
    requestedBy: 'Pedro Leon',
    status: 'Aprobada',
    priority: 'Alta',
    observations: 'Jornada quirurgica.',
    createdAt: '2024-05-18T10:05:00',
    approvedAt: '2024-05-18T10:40:00',
    approvedBy: 'Admin SAGI',
    products: [
      { product: 'Jeringa 5ml', productCode: 'PROD-005', quantity: 12, unit: 'Caja', observations: '' },
      { product: 'Alcohol antiseptico 70%', productCode: 'PROD-006', quantity: 20, unit: 'Unidad', observations: '' },
    ],
  },
  {
    id: 11,
    code: 'SOL-2024-0011',
    date: '2024-05-17T16:55:00',
    area: 'Laboratorio Clinico',
    requestedBy: 'Camilo Ruiz',
    status: 'Pendiente',
    priority: 'Media',
    observations: 'Turno extendido.',
    createdAt: '2024-05-17T16:55:00',
    approvedAt: '',
    approvedBy: '',
    products: [{ product: 'Alcohol antiseptico 70%', productCode: 'PROD-006', quantity: 8, unit: 'Unidad', observations: '' }],
  },
  {
    id: 12,
    code: 'SOL-2024-0012',
    date: '2024-05-16T12:15:00',
    area: 'Consulta Externa',
    requestedBy: 'Paula Mejia',
    status: 'Aprobada',
    priority: 'Baja',
    observations: 'Reposicion rutinaria.',
    createdAt: '2024-05-16T12:15:00',
    approvedAt: '2024-05-16T13:02:00',
    approvedBy: 'Admin SAGI',
    products: [{ product: 'Omeprazol 20mg', productCode: 'PROD-002', quantity: 3, unit: 'Caja', observations: '' }],
  },
  {
    id: 13,
    code: 'SOL-2024-0013',
    date: '2024-05-15T09:05:00',
    area: 'Urgencias',
    requestedBy: 'Monica Silva',
    status: 'Rechazada',
    priority: 'Alta',
    observations: 'Solicitud duplicada.',
    createdAt: '2024-05-15T09:05:00',
    approvedAt: '2024-05-15T09:40:00',
    approvedBy: 'Admin SAGI',
    products: [{ product: 'Ibuprofeno 400mg', productCode: 'PROD-003', quantity: 14, unit: 'Caja', observations: '' }],
  },
  {
    id: 14,
    code: 'SOL-2024-0014',
    date: '2024-05-14T14:35:00',
    area: 'Farmacia',
    requestedBy: 'Daniela Cano',
    status: 'Pendiente',
    priority: 'Media',
    observations: 'Inventario preventivo.',
    createdAt: '2024-05-14T14:35:00',
    approvedAt: '',
    approvedBy: '',
    products: [{ product: 'Paracetamol 500mg', productCode: 'PROD-001', quantity: 16, unit: 'Caja', observations: '' }],
  },
  {
    id: 15,
    code: 'SOL-2024-0015',
    date: '2024-05-13T08:10:00',
    area: 'Hospitalizacion',
    requestedBy: 'Oscar Marin',
    status: 'Aprobada',
    priority: 'Media',
    observations: 'Reposicion aprobada.',
    createdAt: '2024-05-13T08:10:00',
    approvedAt: '2024-05-13T09:00:00',
    approvedBy: 'Admin SAGI',
    products: [{ product: 'Guantes de Nitrilo Talla M', productCode: 'PROD-004', quantity: 10, unit: 'Caja', observations: '' }],
  },
];

const requestAreas = ['Todas las areas', 'Urgencias', 'Farmacia', 'Hospitalizacion', 'Cirugia', 'Laboratorio Clinico', 'Consulta Externa'];
const requestStatuses = ['Todos los estados', 'Pendiente', 'Aprobada', 'Rechazada'];
const priorityRank = { Baja: 1, Media: 2, Alta: 3, Critica: 4 };

const getStoredProducts = () => {
  try {
    const storedProducts = JSON.parse(localStorage.getItem(productsStorageKey) || '[]');
    return Array.isArray(storedProducts) && storedProducts.length > 0 ? storedProducts : sampleProducts;
  } catch {
    return sampleProducts;
  }
};

const saveStoredProducts = (products) => {
  localStorage.setItem(productsStorageKey, JSON.stringify(products));
};

const menuSections = [
  {
    title: 'MODULO PRINCIPAL',
    items: [
      { label: 'Dashboard', icon: 'home', enabledRoles: ['Administrador', 'Inventario', 'Asistencial'], path: '/dashboard' },
      { label: 'Productos', icon: 'box', enabledRoles: ['Administrador', 'Inventario', 'Asistencial'], path: '/products' },
      { label: 'Lotes y vencimientos', icon: 'calendar', enabledRoles: ['Administrador', 'Inventario'], path: '/batches' },
      { label: 'Movimientos', icon: 'move', enabledRoles: ['Administrador', 'Inventario'], path: '/movements' },
      { label: 'Solicitudes', icon: 'document', enabledRoles: ['Administrador', 'Inventario', 'Asistencial'], path: '/requests' },
    ],
  },
  {
    title: 'REPORTES',
    items: [{ label: 'Reportes', icon: 'chart', enabledRoles: ['Administrador', 'Inventario'], path: '/reports' }],
  },
  {
    title: 'ADMINISTRACION',
    items: [
      { label: 'Usuarios', icon: 'users', enabledRoles: ['Administrador'], path: '/users' },
      { label: 'Configuracion', icon: 'settings', enabledRoles: ['Administrador'], path: '/settings' },
    ],
  },
];

function Icon({ name }) {
  const paths = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
      </>
    ),
    box: (
      <>
        <path d="M4 7h16v13H4z" />
        <path d="M8 7V4h8v3" />
        <path d="M9 11h6" />
      </>
    ),
    calendar: (
      <>
        <path d="M4 5h16v16H4z" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
      </>
    ),
    move: (
      <>
        <path d="M4 12h12" />
        <path d="m13 8 4 4-4 4" />
        <path d="M20 5v5" />
        <path d="M20 14v5" />
      </>
    ),
    document: (
      <>
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M14 3v4h4" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5h16v14z" />
        <path d="m7 16 4-4 3 2 4-6" />
      </>
    ),
    users: (
      <>
        <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M2 21a7 7 0 0 1 14 0" />
        <path d="M17 8a3 3 0 1 0 0-6" />
        <path d="M18 14a6 6 0 0 1 4 6" />
      </>
    ),
    settings: (
      <>
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.3 3.1a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 3.1h5l.3-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" />
      </>
    ),
    search: (
      <>
        <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
        <path d="m20 20-4-4" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12" />
        <path d="m8 11 4 4 4-4" />
        <path d="M5 21h14" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    filter: (
      <>
        <path d="M4 5h16l-6 7v5l-4 2v-7z" />
      </>
    ),
    save: (
      <>
        <path d="M5 4h12l2 2v14H5z" />
        <path d="M8 4v6h8V4" />
        <path d="M8 20v-6h8v6" />
      </>
    ),
    cube: (
      <>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
        <path d="M12 12 4.5 7.7" />
        <path d="M12 12v8.5" />
        <path d="m12 12 7.5-4.3" />
      </>
    ),
    chevronRight: (
      <>
        <path d="m9 18 6-6-6-6" />
      </>
    ),
    edit: (
      <>
        <path d="M4 20h4l11-11-4-4L4 16z" />
        <path d="m13 7 4 4" />
      </>
    ),
    dots: (
      <>
        <path d="M12 6h.01" />
        <path d="M12 12h.01" />
        <path d="M12 18h.01" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </>
    ),
    eye: (
      <>
        <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </>
    ),
    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m11 6-6 6 6 6" />
      </>
    ),
    file: (
      <>
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v5h4" />
        <path d="M10 13h4" />
        <path d="M10 17h4" />
      </>
    ),
    trend: (
      <>
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
        <path d="M5 19h14" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3 2.8 20h18.4z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
      </>
    ),
    clock: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    checkCircle: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="m8.5 12 2.5 2.5L16 9" />
      </>
    ),
    xCircle: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="m9 9 6 6" />
        <path d="m15 9-6 6" />
      </>
    ),
    mail: (
      <>
        <path d="M4 6.5h16v11H4z" />
        <path d="m4.5 7 7.5 6 7.5-6" />
      </>
    ),
    lock: (
      <>
        <path d="M7 10h10v9H7z" />
        <path d="M9 10V7a3 3 0 0 1 6 0v3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
        <path d="M9.3 5.4A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9 7-.3 1.2-1.2 2.6-2.5 3.8" />
        <path d="M6.2 6.7C4.6 8 3.5 10.1 3 12c.5 2.5 4 7 9 7 1.8 0 3.4-.5 4.7-1.3" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5.5 5.6v5.2c0 4 2.6 7.6 6.5 9.2 3.9-1.6 6.5-5.2 6.5-9.2V5.6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function LogoMark() {
  return (
    <div className="app-logo" aria-label="SAGI">
      <span className="app-logo-stripe app-logo-stripe-top" />
      <span className="app-logo-stripe app-logo-stripe-mid" />
      <span className="app-logo-stripe app-logo-stripe-bottom" />
      <span className="app-logo-tower" />
      <span className="app-logo-core" />
    </div>
  );
}

function Sidebar({ activePath = window.location.pathname }) {
  return (
    <aside className="sidebar">
      <LogoMark />

      <nav className="sidebar-nav" aria-label="Navegacion principal">
        {menuSections.map((section) => (
          <section className="menu-section" key={section.title}>
            <h2>{section.title}</h2>
            <div className="menu-items">
              {section.items.map((item) => {
                const enabled = item.enabledRoles.includes(currentUser.role);
                const isActive =
                  item.path === '/products'
                    ? activePath === '/products' || activePath === '/products/create'
                    : activePath === item.path;
                return (
                  <button
                    className={`menu-item ${isActive ? 'menu-item-active' : ''} ${enabled ? '' : 'menu-item-disabled'}`}
                    disabled={!enabled}
                    key={item.label}
                    onClick={() => navigateTo(item.path)}
                    title={enabled ? item.label : 'No disponible para este rol'}
                    type="button"
                  >
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="user-panel">
        <div className="avatar" aria-hidden="true">
          AS
        </div>
        <div>
          <strong>{currentUser.name}</strong>
          <span>{currentUser.role}</span>
        </div>
        <button className="user-exit" type="button" aria-label="Salir">
          <Icon name="arrowRight" />
        </button>
      </div>
    </aside>
  );
}

function StatCard({ color, icon, label, value, caption }) {
  return (
    <article className="stat-card">
      <span className={`stat-icon stat-icon-${color}`}>
        <Icon name={icon} />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{caption}</span>
      </div>
    </article>
  );
}

function ActionButton({ label, icon, onClick }) {
  return (
    <button className="table-action" type="button" aria-label={label} title={label} onClick={onClick}>
      <Icon name={icon} />
    </button>
  );
}

function navigateTo(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function AuthBrandPanel() {
  return (
    <section className="auth-brand-panel" aria-label="Presentacion SAGI">
      <div className="auth-brand-lockup">
        <LogoMark />
        <span>SAGI</span>
      </div>
      <p>
        Sistema de Administracion
        <span>y Gestion de Inventarios</span>
      </p>
      <i />
      <p className="auth-brand-copy">
        Control inteligente para
        <span>una gestion eficiente.</span>
      </p>
      <div className="secure-card">
        <Icon name="shield" />
        <p>
          <strong>Sistema seguro</strong>
          <span>Tus datos estan protegidos</span>
          <span>con encriptacion avanzada.</span>
        </p>
      </div>
    </section>
  );
}

function LoginModule() {
  const [form, setForm] = useState(initialLoginForm);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No fue posible iniciar sesion.');
      }

      if (form.remember) {
        localStorage.setItem('sagi_session', JSON.stringify(data.session));
      }

      navigateTo('/products');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <AuthBrandPanel />
      <section className="auth-card login-card" aria-labelledby="login-title">
        <div className="auth-heading">
          <h1 id="login-title">Iniciar sesion</h1>
          <p>Ingresa tus credenciales para acceder</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Correo electronico</span>
            <span className="auth-input-shell">
              <Icon name="mail" />
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </span>
          </label>
          <label className="auth-field">
            <span>Contrasena</span>
            <span className="auth-input-shell">
              <Icon name="lock" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                className="auth-icon-button"
                type="button"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                aria-label="Mostrar u ocultar contrasena"
              >
                <Icon name="eyeOff" />
              </button>
            </span>
          </label>
          <div className="login-options">
            <label>
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
              <span>Recordarme</span>
            </label>
            <a href="/recuperar-contrasena">Olvidaste tu contrasena?</a>
          </div>
          <button className="auth-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Validando...' : 'Iniciar sesion'}
          </button>
          {status.message ? <p className={`form-status form-status-${status.type}`}>{status.message}</p> : null}
        </form>
        <p className="auth-switch">
          No tienes una cuenta? <a href="/register">Registrate</a>
        </p>
      </section>
    </main>
  );
}

function RegisterModule() {
  const [form, setForm] = useState(initialRegisterForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignedRole = useMemo(
    () => roleByDepartment[form.department] || 'Usuario del sistema',
    [form.department],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${apiBaseUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, role: assignedRole }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo registrar el usuario.');
      }

      setStatus({
        type: 'success',
        message: `Usuario registrado con rol ${data.user.role}. Ya puede iniciar sesion.`,
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <AuthBrandPanel />
      <section className="auth-card register-card" aria-labelledby="register-title">
        <div className="auth-heading">
          <h1 id="register-title">Registro de usuario</h1>
          <p>Completa la informacion personal</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="register-grid">
            <label className="auth-field">
              <span>Nombres</span>
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>
            <label className="auth-field">
              <span>Apellidos</span>
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>
            <label className="auth-field">
              <span>Tipo de documento</span>
              <select name="documentType" value={form.documentType} onChange={handleChange} required>
                {documentTypes.map((documentType) => (
                  <option key={documentType} value={documentType}>
                    {documentType}
                  </option>
                ))}
              </select>
            </label>
            <label className="auth-field">
              <span>Numero de documento</span>
              <input name="documentNumber" value={form.documentNumber} onChange={handleChange} required />
            </label>
            <label className="auth-field">
              <span>Correo electronico</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label className="auth-field">
              <span>Telefono</span>
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>
            <label className="auth-field">
              <span>Area / Departamento</span>
              <select name="department" value={form.department} onChange={handleChange} required>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>
            <label className="auth-field">
              <span>Contrasena inicial</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength="8"
                required
              />
            </label>
          </div>
          <p className="role-note">Rol asignado: {assignedRole}</p>
          <button className="auth-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Crear usuario'}
          </button>
          {status.message ? <p className={`form-status form-status-${status.type}`}>{status.message}</p> : null}
        </form>
        <p className="auth-switch">
          Ya tienes una cuenta? <a href="/login">Inicia sesion</a>
        </p>
      </section>
    </main>
  );
}

function ProductsPortal() {
  const [products, setProducts] = useState(getStoredProducts);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas las categorias');
  const [status, setStatus] = useState('Todos los estados');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetch(`${apiBaseUrl}/api/products`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        const hasLocalProducts = localStorage.getItem(productsStorageKey);

        if (isMounted && !hasLocalProducts && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts(sampleProducts);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => ['Todas las categorias', ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.code.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === 'Todas las categorias' || product.category === category;
      const matchesStatus = status === 'Todos los estados' || product.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, products, query, status]);

  const stats = useMemo(() => {
    const active = products.filter((product) => product.status === 'Activo').length;
    const exhausted = products.filter((product) => product.status === 'Agotado' || product.stock === 0).length;

    return {
      total: products.length,
      active,
      exhausted,
    };
  }, [products]);

  const handleAction = (action, product) => {
    setNotice(`${action}: ${product.code} - ${product.name}`);
  };

  const handleDelete = (product) => {
    setProducts((currentProducts) => {
      const nextProducts = currentProducts.filter((currentProduct) => currentProduct.code !== product.code);
      saveStoredProducts(nextProducts);
      return nextProducts;
    });
    setNotice(`Producto eliminado: ${product.code} - ${product.name}`);
  };

  return (
    <main className="app-shell">
      <Sidebar />

      <section className="content-panel">
        <header className="page-header">
          <div>
            <h1>Productos</h1>
            <p>Gestiona el catalogo de productos del inventario</p>
          </div>
          <div className="header-actions">
            <button className="secondary-button" type="button">
              <Icon name="download" />
              Exportar
            </button>
            <button className="orange-button" type="button" onClick={() => navigateTo('/products/create')}>
              <Icon name="plus" />
              Nuevo producto
            </button>
          </div>
        </header>

        <section className="stats-grid" aria-label="Resumen del inventario">
          <StatCard color="blue" icon="file" label="Total de productos" value={stats.total} caption="En el catalogo" />
          <StatCard color="green" icon="trend" label="Activos" value={stats.active} caption="Productos activos" />
          <StatCard color="orange" icon="alert" label="Agotados" value={stats.exhausted} caption="Sin stock disponible" />
        </section>

        <section className="inventory-card" aria-label="Inventario de productos">
          <div className="filters-row">
            <label className="search-field">
              <Icon name="search" />
              <input
                aria-label="Buscar producto"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar producto, codigo o categoria..."
              />
            </label>

            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Categoria">
              {categories.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>

            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Estado">
              <option>Todos los estados</option>
              <option>Activo</option>
              <option>Agotado</option>
            </select>

            <button className="secondary-button filter-button" type="button">
              <Icon name="filter" />
              Filtros
            </button>
          </div>

          {notice ? <p className="inventory-notice">{notice}</p> : null}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Producto</th>
                  <th>Categoria</th>
                  <th>Presentacion</th>
                  <th>Stock actual</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.code}>
                    <td>{product.code}</td>
                    <td>
                      <strong>{product.name}</strong>
                      <span>{product.description}</span>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.presentation}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-pill ${product.status === 'Activo' ? 'status-active' : 'status-empty'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <ActionButton
                          icon="eye"
                          label={`Ver ${product.name}`}
                          onClick={() => handleAction('Detalle del producto', product)}
                        />
                        <ActionButton
                          icon="edit"
                          label={`Editar ${product.name}`}
                          onClick={() => handleAction('Editar producto', product)}
                        />
                        <ActionButton
                          icon="trash"
                          label={`Eliminar ${product.name}`}
                          onClick={() => handleDelete(product)}
                        />
                        <ActionButton
                          icon="dots"
                          label={`Mas acciones para ${product.name}`}
                          onClick={() => handleAction('Mas acciones', product)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <p>
              Mostrando {filteredProducts.length === 0 ? 0 : 1} a {filteredProducts.length} de{' '}
              {products.length} productos
            </p>
            <div className="pagination">
              <button type="button" aria-label="Pagina anterior">
                <Icon name="arrowLeft" />
              </button>
              <button className="page-current" type="button">
                1
              </button>
              <button type="button" aria-label="Pagina siguiente">
                <Icon name="arrowRight" />
              </button>
            </div>
          </footer>
        </section>
      </section>
    </main>
  );
}

const formatRequestDate = (date) =>
  new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

function RequestsModule() {
  const [requests, setRequests] = useState(sampleRequests);
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('Todas las areas');
  const [status, setStatus] = useState('Todos los estados');
  const [startDate, setStartDate] = useState('2024-05-13');
  const [endDate, setEndDate] = useState('2024-05-27');
  const [sort, setSort] = useState({ key: 'date', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetch(`${apiBaseUrl}/api/requests`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (isMounted && Array.isArray(data.requests) && data.requests.length > 0) {
          setRequests(data.requests);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRequests(sampleRequests);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(
    () => ({
      pending: requests.filter((request) => request.status === 'Pendiente').length,
      approved: requests.filter((request) => request.status === 'Aprobada').length,
      rejected: requests.filter((request) => request.status === 'Rechazada').length,
      total: requests.length,
    }),
    [requests],
  );

  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const from = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const to = endDate ? new Date(`${endDate}T23:59:59`) : null;

    const filtered = requests.filter((request) => {
      const requestDate = new Date(request.date);
      const matchesQuery =
        !normalizedQuery ||
        request.code.toLowerCase().includes(normalizedQuery) ||
        request.area.toLowerCase().includes(normalizedQuery) ||
        request.requestedBy.toLowerCase().includes(normalizedQuery) ||
        request.products.some(
          (product) =>
            product.product.toLowerCase().includes(normalizedQuery) ||
            product.productCode.toLowerCase().includes(normalizedQuery),
        );
      const matchesArea = area === 'Todas las areas' || request.area === area;
      const matchesStatus = status === 'Todos los estados' || request.status === status;
      const matchesStart = !from || requestDate >= from;
      const matchesEnd = !to || requestDate <= to;

      return matchesQuery && matchesArea && matchesStatus && matchesStart && matchesEnd;
    });

    return [...filtered].sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      const aValue = sort.key === 'priority' ? priorityRank[a.priority] : a[sort.key];
      const bValue = sort.key === 'priority' ? priorityRank[b.priority] : b[sort.key];

      if (sort.key === 'date') {
        return (new Date(aValue) - new Date(bValue)) * direction;
      }

      return String(aValue).localeCompare(String(bValue), 'es') * direction;
    });
  }, [area, endDate, query, requests, sort, startDate, status]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    setSort((currentSort) => ({
      key,
      direction: currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const updateRequest = (requestId, patch) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) => (request.id === requestId ? { ...request, ...patch } : request)),
    );
  };

  const approveRequest = (request) => {
    if (request.status !== 'Pendiente') {
      setNotice('Solo las solicitudes pendientes pueden aprobarse.');
      return;
    }

    updateRequest(request.id, {
      status: 'Aprobada',
      approvedAt: new Date().toISOString(),
      approvedBy: currentUser.name,
    });
    setNotice(`Solicitud aprobada: ${request.code}`);
  };

  const rejectRequest = (request) => {
    if (request.status !== 'Pendiente') {
      setNotice('Solo las solicitudes pendientes pueden rechazarse.');
      return;
    }

    const reason = window.prompt('Motivo de rechazo');
    if (!reason) {
      return;
    }

    updateRequest(request.id, {
      status: 'Rechazada',
      observations: reason,
      approvedAt: new Date().toISOString(),
      approvedBy: currentUser.name,
    });
    setNotice(`Solicitud rechazada: ${request.code}`);
  };

  const deleteRequest = (request) => {
    if (request.status !== 'Pendiente') {
      setNotice('Solo las solicitudes pendientes pueden eliminarse.');
      return;
    }

    if (window.confirm(`Eliminar la solicitud ${request.code}?`)) {
      setRequests((currentRequests) => currentRequests.filter((currentRequest) => currentRequest.id !== request.id));
      setNotice(`Solicitud eliminada: ${request.code}`);
    }
  };

  const editRequest = (request) => {
    if (request.status !== 'Pendiente') {
      setNotice('Solo las solicitudes pendientes pueden editarse.');
      return;
    }

    setNotice(`Edicion simulada para ${request.code}. Lista para conectar con formulario.`);
  };

  const exportRequests = () => {
    setNotice(`Exportacion simulada de ${filteredRequests.length} solicitudes filtradas.`);
  };

  return (
    <main className="app-shell">
      <Sidebar activePath="/requests" />

      <section className="content-panel requests-panel">
        <header className="page-header">
          <div>
            <h1>Solicitudes</h1>
            <p>Gestiona las solicitudes internas de las areas</p>
          </div>
          <div className="header-actions">
            <button className="secondary-button" type="button" onClick={exportRequests}>
              <Icon name="download" />
              Exportar
            </button>
            <button className="orange-button" type="button" onClick={() => setNotice('Nueva solicitud lista para formulario futuro.')}>
              <Icon name="plus" />
              Nueva solicitud
            </button>
          </div>
        </header>

        <section className="request-stats-grid" aria-label="Resumen de solicitudes">
          <StatCard color="orange" icon="clock" label="Pendientes" value={summary.pending} caption="Solicitud en espera" />
          <StatCard color="green" icon="checkCircle" label="Aprobadas" value={summary.approved} caption="Solicitudes aprobadas" />
          <StatCard color="red" icon="xCircle" label="Rechazadas" value={summary.rejected} caption="Solicitudes rechazadas" />
          <StatCard color="blue" icon="file" label="Total" value={summary.total} caption="Total de solicitudes" />
        </section>

        <section className="inventory-card requests-card" aria-label="Listado de solicitudes">
          <div className="request-filters-row">
            <label className="search-field">
              <Icon name="search" />
              <input
                aria-label="Buscar solicitud"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Buscar solicitud, producto o area..."
              />
            </label>
            <select value={area} onChange={(event) => setArea(event.target.value)} aria-label="Area">
              {requestAreas.map((areaOption) => (
                <option key={areaOption}>{areaOption}</option>
              ))}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Estado">
              {requestStatuses.map((statusOption) => (
                <option key={statusOption}>{statusOption}</option>
              ))}
            </select>
            <label className="date-range-field">
              <Icon name="calendar" />
              <input value={startDate} onChange={(event) => setStartDate(event.target.value)} type="date" aria-label="Fecha inicial" />
              <span>-</span>
              <input value={endDate} onChange={(event) => setEndDate(event.target.value)} type="date" aria-label="Fecha final" />
            </label>
            <button className="secondary-button filter-button" type="button" onClick={() => setNotice('Filtros avanzados listos para ampliar.')}>
              <Icon name="filter" />
              Filtros
            </button>
          </div>

          {notice ? <p className="inventory-notice">{notice}</p> : null}

          <div className="table-wrap">
            <table className="requests-table">
              <thead>
                <tr>
                  <th><button type="button" onClick={() => handleSort('code')}>Codigo</button></th>
                  <th><button type="button" onClick={() => handleSort('date')}>Fecha</button></th>
                  <th><button type="button" onClick={() => handleSort('area')}>Area solicitante</button></th>
                  <th><button type="button" onClick={() => handleSort('requestedBy')}>Solicitado por</button></th>
                  <th>Productos</th>
                  <th><button type="button" onClick={() => handleSort('status')}>Estado</button></th>
                  <th><button type="button" onClick={() => handleSort('priority')}>Prioridad</button></th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.code}</td>
                    <td>{formatRequestDate(request.date)}</td>
                    <td>{request.area}</td>
                    <td>{request.requestedBy}</td>
                    <td>{request.products.length} productos</td>
                    <td>
                      <span className={`request-status request-status-${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-dot priority-${request.priority.toLowerCase()}`}>{request.priority}</span>
                    </td>
                    <td>
                      <div className="table-actions request-actions">
                        <ActionButton icon="eye" label={`Ver ${request.code}`} onClick={() => setSelectedRequest(request)} />
                        <ActionButton icon="edit" label={`Editar ${request.code}`} onClick={() => editRequest(request)} />
                        <ActionButton icon="checkCircle" label={`Aprobar ${request.code}`} onClick={() => approveRequest(request)} />
                        <ActionButton icon="xCircle" label={`Rechazar ${request.code}`} onClick={() => rejectRequest(request)} />
                        <ActionButton icon="trash" label={`Eliminar ${request.code}`} onClick={() => deleteRequest(request)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <p>
              Mostrando {filteredRequests.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} a{' '}
              {Math.min(currentPage * pageSize, filteredRequests.length)} de {filteredRequests.length} solicitudes
            </p>
            <div className="pagination request-pagination">
              <button type="button" aria-label="Pagina anterior" onClick={() => setPage((currentPageValue) => Math.max(1, currentPageValue - 1))}>
                <Icon name="arrowLeft" />
              </button>
              <button className="page-current" type="button">{currentPage}</button>
              <button type="button" aria-label="Pagina siguiente" onClick={() => setPage((currentPageValue) => Math.min(totalPages, currentPageValue + 1))}>
                <Icon name="arrowRight" />
              </button>
              <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} aria-label="Solicitudes por pagina">
                <option value="5">5 por pagina</option>
                <option value="10">10 por pagina</option>
                <option value="15">15 por pagina</option>
              </select>
            </div>
          </footer>
        </section>
      </section>

      {selectedRequest ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedRequest(null)}>
          <section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-detail-title" onClick={(event) => event.stopPropagation()}>
            <header>
              <div>
                <span>{selectedRequest.code}</span>
                <h2 id="request-detail-title">Detalle de solicitud</h2>
              </div>
              <button type="button" onClick={() => setSelectedRequest(null)} aria-label="Cerrar">Cerrar</button>
            </header>
            <div className="request-detail-grid">
              <p><strong>Fecha</strong>{formatRequestDate(selectedRequest.date)}</p>
              <p><strong>Area solicitante</strong>{selectedRequest.area}</p>
              <p><strong>Solicitado por</strong>{selectedRequest.requestedBy}</p>
              <p><strong>Estado</strong>{selectedRequest.status}</p>
              <p><strong>Prioridad</strong>{selectedRequest.priority}</p>
              <p><strong>Aprobador</strong>{selectedRequest.approvedBy || 'Pendiente'}</p>
              <p className="detail-wide"><strong>Observaciones</strong>{selectedRequest.observations || 'Sin observaciones'}</p>
            </div>
            <h3>Productos solicitados</h3>
            <div className="modal-products">
              {selectedRequest.products.map((product) => (
                <article key={`${selectedRequest.id}-${product.productCode}`}>
                  <strong>{product.product}</strong>
                  <span>{product.productCode}</span>
                  <span>{product.quantity} {product.unit}</span>
                  <p>{product.observations || 'Sin observaciones'}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

const initialProductForm = {
  name: '',
  code: '',
  barcode: '',
  category: '',
  subcategory: '',
  presentation: '',
  unit: '',
  manufacturer: '',
  country: '',
  stock: '',
  minStock: '',
  maxStock: '',
  location: '',
  status: '',
  observations: '',
  sanitaryRegistration: '',
  registrationDate: '',
  description: '',
};

const categoryOptions = ['Medicamentos', 'Insumos Medicos', 'Dispositivos Medicos', 'Aseo y desinfeccion'];
const subcategoryOptions = ['Analgesicos', 'Gastrointestinales', 'Material medico', 'Bioseguridad'];
const unitOptions = ['Unidad', 'Caja', 'Frasco', 'Ampolla', 'Tableta', 'Capsula'];
const statusOptions = ['Activo', 'Inactivo', 'Agotado'];

function ProductField({ error, label, name, onChange, placeholder, required, type = 'text', value }) {
  return (
    <label className="product-field">
      <span>
        {label} {required ? <b>*</b> : null}
      </span>
      <input
        className={error ? 'field-invalid' : ''}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function ProductSelect({ children, error, label, name, onChange, required, value }) {
  return (
    <label className="product-field">
      <span>
        {label} {required ? <b>*</b> : null}
      </span>
      <select className={error ? 'field-invalid' : ''} name={name} onChange={onChange} value={value}>
        {children}
      </select>
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function ProductSection({ children, icon, title }) {
  return (
    <section className="product-form-card">
      <h2>
        <Icon name={icon} />
        {title}
      </h2>
      <div className="product-form-grid">{children}</div>
    </section>
  );
}

function validateProductForm(form) {
  const errors = {};
  const requiredFields = {
    name: 'El nombre del producto es obligatorio.',
    code: 'El codigo del producto es obligatorio.',
    category: 'La categoria es obligatoria.',
    presentation: 'La presentacion es obligatoria.',
    unit: 'La unidad de medida es obligatoria.',
    stock: 'El stock actual es obligatorio.',
    minStock: 'El stock minimo es obligatorio.',
    location: 'La ubicacion en almacen es obligatoria.',
    status: 'El estado es obligatorio.',
  };

  Object.entries(requiredFields).forEach(([field, message]) => {
    if (!String(form[field]).trim()) {
      errors[field] = message;
    }
  });

  const stock = Number(form.stock);
  const minStock = Number(form.minStock);
  const maxStock = form.maxStock === '' ? null : Number(form.maxStock);

  if (form.stock !== '' && (!Number.isFinite(stock) || stock < 0)) {
    errors.stock = 'El stock actual debe ser un numero mayor o igual a 0.';
  }

  if (form.minStock !== '' && (!Number.isFinite(minStock) || minStock < 0)) {
    errors.minStock = 'El stock minimo debe ser un numero mayor o igual a 0.';
  }

  if (form.maxStock !== '' && (!Number.isFinite(maxStock) || maxStock < 0)) {
    errors.maxStock = 'El stock maximo debe ser un numero mayor o igual a 0.';
  }

  if (Number.isFinite(maxStock) && Number.isFinite(minStock) && maxStock < minStock) {
    errors.maxStock = 'El stock maximo debe ser mayor o igual al stock minimo.';
  }

  const duplicateCode = getStoredProducts().some(
    (product) => product.code.toLowerCase() === form.code.trim().toLowerCase(),
  );

  if (duplicateCode) {
    errors.code = 'Ya existe un producto con este codigo.';
  }

  return errors;
}

function CreateProductModule() {
  const [form, setForm] = useState(initialProductForm);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
  };

  const handleCancel = () => {
    navigateTo('/products');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateProductForm(form);
    setSaveError('');

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);

    const nextProduct = {
      code: form.code.trim(),
      name: form.name.trim(),
      description: form.description.trim() || form.observations.trim() || 'Sin descripcion',
      category: form.category,
      presentation: form.presentation.trim(),
      stock: Number(form.stock),
      status: form.status,
      barcode: form.barcode.trim(),
      subcategory: form.subcategory,
      unit: form.unit,
      manufacturer: form.manufacturer.trim(),
      country: form.country.trim(),
      minStock: Number(form.minStock),
      maxStock: form.maxStock === '' ? null : Number(form.maxStock),
      location: form.location.trim(),
      observations: form.observations.trim(),
      sanitaryRegistration: form.sanitaryRegistration.trim(),
      registrationDate: form.registrationDate,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nextProduct),
      }).catch(() => null);

      if (response && !response.ok) {
        const data = await response.json();
        if (response.status === 409) {
          setErrors({ code: data.message || 'Ya existe un producto con este codigo.' });
          return;
        }

        throw new Error(data.message || 'No se pudo guardar el producto.');
      }

      saveStoredProducts([...getStoredProducts(), nextProduct]);
      navigateTo('/products');
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="app-shell">
      <Sidebar />
      <section className="content-panel create-product-panel">
        <header className="create-header">
          <div>
            <nav className="breadcrumb" aria-label="Ruta">
              <a href="/products">Productos</a>
              <Icon name="chevronRight" />
              <span>Nuevo producto</span>
            </nav>
            <h1>Registro de nuevo producto</h1>
            <p>Completa la informacion del producto</p>
          </div>
          <div className="header-actions">
            <button className="secondary-button" type="button" onClick={handleCancel}>
              Cancelar
            </button>
            <button className="orange-button" type="button" onClick={handleSubmit} disabled={isSaving}>
              <Icon name="save" />
              {isSaving ? 'Guardando...' : 'Guardar producto'}
            </button>
          </div>
        </header>

        <form className="product-create-form" onSubmit={handleSubmit}>
          {saveError ? <p className="product-save-error">{saveError}</p> : null}

          <ProductSection icon="cube" title="Informacion general">
            <ProductField
              error={errors.name}
              label="Nombre del producto"
              name="name"
              onChange={handleChange}
              placeholder="Ej. Paracetamol 500mg"
              required
              value={form.name}
            />
            <ProductField
              error={errors.code}
              label="Codigo del producto"
              name="code"
              onChange={handleChange}
              placeholder="Ej. PROD-001"
              required
              value={form.code}
            />
            <ProductField
              error={errors.barcode}
              label="Codigo de barras"
              name="barcode"
              onChange={handleChange}
              placeholder="Ej. 7701234567890"
              value={form.barcode}
            />
            <ProductSelect
              error={errors.category}
              label="Categoria"
              name="category"
              onChange={handleChange}
              required
              value={form.category}
            >
              <option value="">Selecciona una categoria</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </ProductSelect>
            <ProductSelect
              error={errors.subcategory}
              label="Subcategoria"
              name="subcategory"
              onChange={handleChange}
              value={form.subcategory}
            >
              <option value="">Selecciona una subcategoria</option>
              {subcategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </ProductSelect>
            <ProductField
              error={errors.presentation}
              label="Presentacion"
              name="presentation"
              onChange={handleChange}
              placeholder="Ej. Tabletas, Frasco, Ampolla"
              required
              value={form.presentation}
            />
            <ProductSelect
              error={errors.unit}
              label="Unidad de medida"
              name="unit"
              onChange={handleChange}
              required
              value={form.unit}
            >
              <option value="">Selecciona unidad</option>
              {unitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </ProductSelect>
            <ProductField
              error={errors.manufacturer}
              label="Fabricante / Laboratorio"
              name="manufacturer"
              onChange={handleChange}
              placeholder="Ej. Genfar"
              value={form.manufacturer}
            />
            <ProductField
              error={errors.country}
              label="Pais de origen"
              name="country"
              onChange={handleChange}
              placeholder="Ej. Colombia"
              value={form.country}
            />
          </ProductSection>

          <ProductSection icon="cube" title="Informacion de inventario">
            <ProductField
              error={errors.stock}
              label="Stock actual"
              name="stock"
              onChange={handleChange}
              placeholder="Ej. 100"
              required
              type="number"
              value={form.stock}
            />
            <ProductField
              error={errors.minStock}
              label="Stock minimo"
              name="minStock"
              onChange={handleChange}
              placeholder="Ej. 20"
              required
              type="number"
              value={form.minStock}
            />
            <ProductField
              error={errors.maxStock}
              label="Stock maximo"
              name="maxStock"
              onChange={handleChange}
              placeholder="Ej. 500"
              type="number"
              value={form.maxStock}
            />
            <ProductField
              error={errors.location}
              label="Ubicacion en almacen"
              name="location"
              onChange={handleChange}
              placeholder="Ej. Estante A - Nivel 2"
              required
              value={form.location}
            />
            <ProductSelect
              error={errors.status}
              label="Estado"
              name="status"
              onChange={handleChange}
              required
              value={form.status}
            >
              <option value="">Selecciona un estado</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </ProductSelect>
            <ProductField
              error={errors.observations}
              label="Observaciones"
              name="observations"
              onChange={handleChange}
              placeholder="Informacion adicional (opcional)"
              value={form.observations}
            />
          </ProductSection>

          <section className="product-form-card">
            <h2>
              <Icon name="document" />
              Informacion adicional
            </h2>
            <div className="product-form-grid additional-grid">
              <ProductField
                error={errors.sanitaryRegistration}
                label="Numero de registro sanitario"
                name="sanitaryRegistration"
                onChange={handleChange}
                placeholder="Ej. INVIMA 2023M-123456-R1"
                value={form.sanitaryRegistration}
              />
              <ProductField
                error={errors.registrationDate}
                label="Fecha de registro"
                name="registrationDate"
                onChange={handleChange}
                type="date"
                value={form.registrationDate}
              />
              <label className="product-field description-field">
                <span>Descripcion</span>
                <textarea
                  name="description"
                  onChange={handleChange}
                  placeholder="Descripcion detallada del producto..."
                  value={form.description}
                />
                {errors.description ? <small>{errors.description}</small> : null}
              </label>
            </div>
          </section>
        </form>
      </section>
    </main>
  );
}

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => setPath(window.location.pathname);

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  if (path === '/register') {
    return <RegisterModule />;
  }

  if (path === '/products') {
    return <ProductsPortal />;
  }

  if (path === '/products/create') {
    return <CreateProductModule />;
  }

  if (path === '/requests') {
    return <RequestsModule />;
  }

  return <LoginModule />;
}

export default App;
