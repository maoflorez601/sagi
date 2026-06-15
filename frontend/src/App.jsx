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

const menuSections = [
  {
    title: 'MODULO PRINCIPAL',
    items: [
      { label: 'Dashboard', icon: 'home', enabledRoles: ['Administrador', 'Inventario', 'Asistencial'] },
      { label: 'Productos', icon: 'box', enabledRoles: ['Administrador', 'Inventario', 'Asistencial'], active: true },
      { label: 'Lotes y vencimientos', icon: 'calendar', enabledRoles: ['Administrador', 'Inventario'] },
      { label: 'Movimientos', icon: 'move', enabledRoles: ['Administrador', 'Inventario'] },
      { label: 'Solicitudes', icon: 'document', enabledRoles: ['Administrador', 'Inventario', 'Asistencial'] },
    ],
  },
  {
    title: 'REPORTES',
    items: [{ label: 'Reportes', icon: 'chart', enabledRoles: ['Administrador', 'Inventario'] }],
  },
  {
    title: 'ADMINISTRACION',
    items: [
      { label: 'Usuarios', icon: 'users', enabledRoles: ['Administrador'] },
      { label: 'Configuracion', icon: 'settings', enabledRoles: ['Administrador'] },
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

function Sidebar() {
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
                return (
                  <button
                    className={`menu-item ${item.active ? 'menu-item-active' : ''} ${enabled ? '' : 'menu-item-disabled'}`}
                    disabled={!enabled}
                    key={item.label}
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
  const [products, setProducts] = useState(sampleProducts);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas las categorias');
  const [status, setStatus] = useState('Todos los estados');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetch(`${apiBaseUrl}/api/products`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (isMounted && Array.isArray(data.products) && data.products.length > 0) {
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
    setProducts((currentProducts) =>
      currentProducts.filter((currentProduct) => currentProduct.code !== product.code),
    );
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
            <button className="orange-button" type="button">
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

  return <LoginModule />;
}

export default App;
