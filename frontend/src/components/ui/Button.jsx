export function Button({ className = '', children, variant = 'secondary', ...props }) {
  const variantClass = variant === 'primary' ? 'orange-button' : 'secondary-button';
  const buttonClass = [variantClass, className].filter(Boolean).join(' ');
  return <button className={buttonClass} type="button" {...props}>{children}</button>;
}
