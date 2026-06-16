import { useState } from 'react';
import logoSagiDark from '../../assets/logo_sagi_dark.png';
import { Icon } from '../../components/ui/Icon.jsx';
import { navigateTo } from '../../utils/navigation.js';

const initialRegisterForm = {
  firstName: 'Juan Carlos',
  lastName: 'Pérez González',
  documentType: 'Cédula de ciudadanía',
  documentNumber: '1234567890',
  email: 'juan.perez@hospital.com',
  phone: '300 123 4567',
  department: 'Farmacia',
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialRegisterForm);
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setStatus('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('sagi_registered_user_draft', JSON.stringify(form));
    setStatus('Información guardada para continuar el registro.');
  };

  return (
    <main className="auth-shell register-shell">
      <section className="auth-brand-panel register-brand-panel" aria-label="Identidad SAGI">
        <div className="auth-brand-lockup register-brand-lockup">
          <img className="auth-brand-logo" src={logoSagiDark} alt="Logo SAGI" />
          <span>SAGI</span>
        </div>
        <p>
          Sistema de Administración
          <span>y Gestión de Inventarios</span>
        </p>
        <i aria-hidden="true" />
        <p className="auth-brand-copy">
          Control inteligente para
          <span>una gestión eficiente.</span>
        </p>
      </section>

      <section className="auth-card register-card restored-register-card" aria-labelledby="register-title">
        <div className="auth-heading register-heading">
          <h1 id="register-title">Registro de usuario</h1>
          <p>Completa la información personal</p>
        </div>

        <form className="auth-form restored-register-form" onSubmit={handleSubmit}>
          <div className="register-grid restored-register-grid">
            <label className="auth-field register-field">
              <span>Nombres</span>
              <input name="firstName" onChange={handleChange} value={form.firstName} />
            </label>

            <label className="auth-field register-field">
              <span>Apellidos</span>
              <input name="lastName" onChange={handleChange} value={form.lastName} />
            </label>

            <label className="auth-field register-field">
              <span>Tipo de documento</span>
              <select name="documentType" onChange={handleChange} value={form.documentType}>
                <option>Cédula de ciudadanía</option>
                <option>Cédula de extranjería</option>
                <option>Pasaporte</option>
                <option>Tarjeta de identidad</option>
              </select>
            </label>

            <label className="auth-field register-field">
              <span>Número de documento</span>
              <input name="documentNumber" onChange={handleChange} value={form.documentNumber} />
            </label>

            <label className="auth-field register-field">
              <span>Correo electrónico</span>
              <input name="email" onChange={handleChange} type="email" value={form.email} />
            </label>

            <label className="auth-field register-field">
              <span>Teléfono</span>
              <input name="phone" onChange={handleChange} value={form.phone} />
            </label>

            <label className="auth-field register-field register-area-field">
              <span>Área / Departamento</span>
              <select name="department" onChange={handleChange} value={form.department}>
                <option>Farmacia</option>
                <option>Urgencias</option>
                <option>Hospitalización</option>
                <option>Cirugía</option>
                <option>Laboratorio Clínico</option>
                <option>Administración</option>
              </select>
            </label>
          </div>

          {status ? <p className="form-status form-status-success register-status">{status}</p> : null}

          <button className="auth-primary register-next-button" type="submit">
            Siguiente
            <Icon name="arrowRight" />
          </button>
        </form>

        <p className="auth-switch register-switch">
          ¿Ya tienes una cuenta? <button type="button" onClick={() => navigateTo('/login')}>Inicia sesión</button>
        </p>
      </section>
    </main>
  );
}
