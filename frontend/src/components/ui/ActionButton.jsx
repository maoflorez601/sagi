import { Icon } from './Icon.jsx';

export function ActionButton({ icon, label, onClick }) {
  return (
    <button className="table-action" type="button" onClick={onClick} aria-label={label} title={label}>
      <Icon name={icon} />
    </button>
  );
}
