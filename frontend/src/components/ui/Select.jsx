export function Select({ error, children, ...props }) {
  return <select className={error ? 'field-invalid' : ''} {...props}>{children}</select>;
}
