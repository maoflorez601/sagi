import { Sidebar } from './Sidebar.jsx';

export function MainLayout({ activePath, children }) {
  return (
    <main className="app-shell">
      <Sidebar activePath={activePath} />
      {children}
    </main>
  );
}
