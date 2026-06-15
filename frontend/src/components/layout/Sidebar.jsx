import logoSagiDark from '../../assets/logo_sagi_dark.png';
import { navigateTo } from '../../utils/navigation.js';
import { Icon } from '../ui/Icon.jsx';

const currentUser = { name: 'Admin SAGI', role: 'Administrador' };

const menuSections = [
  { title: 'MODULO PRINCIPAL', items: [
    { label: 'Dashboard', icon: 'home', enabledRoles: ['Administrador', 'Inventario', 'Asistencial'], path: '/dashboard' },
    { label: 'Productos', icon: 'box', enabledRoles: ['Administrador', 'Inventario', 'Asistencial'], path: '/products' },
    { label: 'Lotes y vencimientos', icon: 'calendar', enabledRoles: ['Administrador', 'Inventario'], path: '/lots' },
    { label: 'Movimientos', icon: 'move', enabledRoles: ['Administrador', 'Inventario'], path: '/movements' },
    { label: 'Solicitudes', icon: 'document', enabledRoles: ['Administrador', 'Inventario', 'Asistencial'], path: '/requests' },
  ] },
  { title: 'REPORTES', items: [{ label: 'Reportes', icon: 'chart', enabledRoles: ['Administrador', 'Inventario'], path: '/reports' }] },
  { title: 'ADMINISTRACION', items: [
    { label: 'Usuarios', icon: 'users', enabledRoles: ['Administrador'], path: '/users' },
    { label: 'Configuracion', icon: 'settings', enabledRoles: ['Administrador'], path: '/settings' },
  ] },
];

export function Sidebar({ activePath = window.location.pathname }) {
  return (
    <aside className="sidebar">
      <img className="sidebar-logo" src={logoSagiDark} alt="SAGI" />
      <nav className="sidebar-nav" aria-label="Navegacion principal">
        {menuSections.map((section) => (
          <section className="menu-section" key={section.title}>
            <h2>{section.title}</h2>
            <div className="menu-items">
              {section.items.map((item) => {
                const enabled = item.enabledRoles.includes(currentUser.role);
                const isActive = item.path === '/products'
                  ? activePath === '/products' || activePath === '/products/create'
                  : item.path === '/requests'
                    ? activePath === '/requests' || activePath === '/requests/create'
                    : activePath === item.path;
                return (
                  <button className={`menu-item ${isActive ? 'menu-item-active' : ''} ${enabled ? '' : 'menu-item-disabled'}`} disabled={!enabled} key={item.label} onClick={() => navigateTo(item.path)} title={enabled ? item.label : 'No disponible para este rol'} type="button">
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
        <div className="avatar" aria-hidden="true">AS</div>
        <div><strong>{currentUser.name}</strong><span>{currentUser.role}</span></div>
        <button className="user-exit" type="button" aria-label="Salir"><Icon name="arrowRight" /></button>
      </div>
    </aside>
  );
}
