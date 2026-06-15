export function Textarea({ error, ...props }) {
  return <textarea className={error ? 'field-invalid' : ''} {...props} />;
}
