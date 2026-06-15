import { useState } from 'react';
import logoSagiDark from '../../assets/logo_sagi_dark.png';
import { Icon } from '../../components/ui/Icon.jsx';
import { navigateTo } from '../../utils/navigation.js';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: 'usuario@ejemplo.com',
    password: 'sagi123456',
    remember: false,
  });

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigateTo('/products');
  };

  return (
    <main className="auth-shell login-shell">
      <section className="auth-brand-panel login-brand-panel" aria-label="Identidad SAGI">
        <div className="auth-brand-lockup">
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

        <article className="secure-card">
          <Icon name="shield" />
          <p>
            <strong>Sistema seguro</strong>
            Tus datos están protegidos
            <span>con encriptación avanzada.</span>
          </p>
        </article>
      </section>

      <section className="auth-card login-card" aria-labelledby="login-title">
        <div className="auth-heading">
          <h1 id="login-title">Iniciar sesión</h1>
          <p>Ingresa tus credenciales para acceder</p>
        </div>

        <form className="auth-form login-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Correo electrónico</span>
            <span className="auth-input-shell">
              <Icon name="mail" />
              <input
                autoComplete="email"
                name="email"
                onChange={handleChange}
                placeholder="usuario@ejemplo.com"
                type="email"
                value={form.email}
              />
            </span>
          </label>

          <label className="auth-field">
            <span>Contraseña</span>
            <span className="auth-input-shell">
              <Icon name="lock" />
              <input
                autoComplete="current-password"
                name="password"
                onChange={handleChange}
                placeholder="••••••••••"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
              />
              <button
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="auth-icon-button"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                type="button"
              >
                <Icon name={showPassword ? 'eye' : 'eyeOff'} />
              </button>
            </span>
          </label>

          <div className="login-options">
            <label>
              <input checked={form.remember} name="remember" onChange={handleChange} type="checkbox" />
              <span>Recordarme</span>
            </label>
            <a href="/login">¿Olvidaste tu contraseña?</a>
          </div>

          <button className="auth-primary" type="submit">
            Iniciar sesión
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes una cuenta? <a href="/register">Regístrate</a>
        </p>
      </section>
    </main>
  );
}
