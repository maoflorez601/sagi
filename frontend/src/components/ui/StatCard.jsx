import { Icon } from './Icon.jsx';

export function StatCard({ color, icon, label, value, caption }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-${color}`}>
        <Icon name={icon} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{caption}</p>
      </div>
    </article>
  );
}
