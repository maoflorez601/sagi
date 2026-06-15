import { useMemo, useState } from 'react';
import './App.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

const initialForm = {
  firstName: 'Juan Carlos',
  lastName: 'Perez Gonzalez',
  documentType: 'Cedula de ciudadania',
  documentNumber: '1234567890',
  email: 'juan.perez@hospital.com',
  phone: '300 123 4567',
  department: 'Farmacia',
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignedRole = useMemo(
    () => roleByDepartment[form.department] || 'Usuario del sistema',
    [form.department],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
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
        body: JSON.stringify({
          ...form,
          role: assignedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo registrar el usuario.');
      }

      setStatus({
        type: 'success',
        message: `Usuario registrado correctamente con rol ${data.user.role}.`,
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="registration-shell">
      <section className="brand-panel" aria-label="Presentacion SAGI">
        <div className="brand-lockup">
          <div className="sagi-mark" aria-hidden="true">
            <span className="mark-stripe mark-stripe-top" />
            <span className="mark-stripe mark-stripe-mid" />
            <span className="mark-stripe mark-stripe-bottom" />
            <span className="mark-tower" />
            <span className="mark-core" />
          </div>
          <span className="brand-name">SAGI</span>
        </div>
        <p className="brand-system">
          Sistema de Administracion
          <span>y Gestion de Inventarios</span>
        </p>
        <span className="brand-rule" />
        <p className="brand-copy">
          Control inteligente para
          <span>una gestion eficiente.</span>
        </p>
      </section>

      <section className="form-card" aria-labelledby="registration-title">
        <div className="form-heading">
          <h1 id="registration-title">Registro de usuario</h1>
          <p>Completa la informacion personal</p>
        </div>

        <form className="user-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Nombres</span>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />
            </label>

            <label>
              <span>Apellidos</span>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
            </label>

            <label>
              <span>Tipo de documento</span>
              <select name="documentType" value={form.documentType} onChange={handleChange} required>
                {documentTypes.map((documentType) => (
                  <option key={documentType} value={documentType}>
                    {documentType}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Numero de documento</span>
              <input
                name="documentNumber"
                value={form.documentNumber}
                onChange={handleChange}
                inputMode="numeric"
                required
              />
            </label>

            <label>
              <span>Correo electronico</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Telefono</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </label>

            <label>
              <span>Area / Departamento</span>
              <select name="department" value={form.department} onChange={handleChange} required>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Rol asignado</span>
              <input value={assignedRole} readOnly />
            </label>
          </div>

          <button className="primary-action" type="submit" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Registrando...' : 'Siguiente'}</span>
            <span aria-hidden="true">-&gt;</span>
          </button>

          {status.message ? (
            <p className={`form-status form-status-${status.type}`}>{status.message}</p>
          ) : null}
        </form>

        <p className="signin-hint">
          Ya tienes una cuenta? <a href="/login">Inicia sesion</a>
        </p>
      </section>
    </main>
  );
}

export default App;
