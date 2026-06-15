export function Input({ error, ...props }) {
  return <input className={error ? 'field-invalid' : ''} {...props} />;
}
