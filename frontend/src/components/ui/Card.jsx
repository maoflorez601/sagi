export function Card({ className = '', children }) {
  const cardClass = ['product-form-card', className].filter(Boolean).join(' ');
  return <section className={cardClass}>{children}</section>;
}
