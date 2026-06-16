import { useMemo, useState } from 'react';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { sampleMovements } from '../../data/mockMovements.js';
import { sampleProducts } from '../../data/mockProducts.js';
import { sampleRequests } from '../../data/mockRequests.js';
import {
  estimatedInventoryValue,
  expiringLotsReport,
  inventoryStatusReport,
  reportFilters,
  topMovingProductsReport,
} from '../../data/mockReports.js';
import { formatRequestDate } from '../../utils/format.js';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  currency: 'COP',
  maximumFractionDigits: 0,
  style: 'currency',
});

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    startDate: '2024-05-01',
    endDate: '2024-05-31',
    category: 'Todas las categorias',
    area: 'Todas las areas',
    state: 'Todos los estados',
  });
  const [notice, setNotice] = useState('');

  const summary = useMemo(() => {
    const lowStock = sampleProducts.filter((product) => product.stock > 0 && product.stock <= 80).length;
    const expiringSoon = expiringLotsReport.filter((lot) => lot.daysLeft >= 0 && lot.daysLeft <= 30).length;
    const pendingRequests = sampleRequests.filter((request) => request.status === 'Pendiente').length;

    return {
      totalProducts: sampleProducts.length,
      lowStock,
      expiringSoon,
      pendingRequests,
      monthlyMovements: sampleMovements.length,
      estimatedValue: currencyFormatter.format(estimatedInventoryValue),
    };
  }, []);

  const requestSummary = useMemo(
    () => ({
      pending: sampleRequests.filter((request) => request.status === 'Pendiente').length,
      approved: sampleRequests.filter((request) => request.status === 'Aprobada').length,
      rejected: sampleRequests.filter((request) => request.status === 'Rechazada').length,
    }),
    [],
  );

  const recentMovements = useMemo(
    () =>
      [...sampleMovements]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [],
  );

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  };

  const handleApplyFilters = () => {
    setNotice(
      `Filtros aplicados: ${filters.startDate} a ${filters.endDate}, ${filters.category}, ${filters.area}, ${filters.state}.`,
    );
  };

  const handleExport = () => {
    setNotice('Exportacion simulada del reporte general de inventario.');
  };

  return (
    <section className="content-panel reports-panel">
      <header className="page-header">
        <div>
          <h1>Reportes</h1>
          <p>Analiza el estado del inventario y sus indicadores principales</p>
        </div>
        <div className="header-actions">
          <Button variant="primary" onClick={handleExport}>
            <Icon name="download" />
            Exportar reporte
          </Button>
        </div>
      </header>

      <section className="reports-summary-grid" aria-label="Indicadores principales">
        <StatCard color="blue" icon="file" label="Total productos" value={summary.totalProducts} caption="Productos inventariados" />
        <StatCard color="orange" icon="alert" label="Stock bajo" value={summary.lowStock} caption="Requieren reposicion" />
        <StatCard color="red" icon="calendar" label="Proximos a vencer" value={summary.expiringSoon} caption="Dentro de 30 dias" />
        <StatCard color="orange" icon="clock" label="Solicitudes pendientes" value={summary.pendingRequests} caption="En flujo de aprobacion" />
        <StatCard color="green" icon="move" label="Movimientos del mes" value={summary.monthlyMovements} caption="Entradas, salidas y ajustes" />
        <StatCard color="blue" icon="trend" label="Valor estimado" value={summary.estimatedValue} caption="Inventario valorizado" />
      </section>

      <section className="inventory-card report-filters-card" aria-label="Filtros del reporte">
        <div className="report-filters-row">
          <label className="date-range-field">
            <Icon name="calendar" />
            <input name="startDate" onChange={handleFilterChange} type="date" value={filters.startDate} aria-label="Fecha inicial" />
            <span>-</span>
            <input name="endDate" onChange={handleFilterChange} type="date" value={filters.endDate} aria-label="Fecha final" />
          </label>
          <select name="category" onChange={handleFilterChange} value={filters.category} aria-label="Categoria">
            {reportFilters.categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <select name="area" onChange={handleFilterChange} value={filters.area} aria-label="Area o bodega">
            {reportFilters.areas.map((area) => <option key={area}>{area}</option>)}
          </select>
          <select name="state" onChange={handleFilterChange} value={filters.state} aria-label="Estado">
            {reportFilters.states.map((state) => <option key={state}>{state}</option>)}
          </select>
          <Button className="filter-button" onClick={handleApplyFilters}>
            <Icon name="filter" />
            Aplicar filtros
          </Button>
        </div>
        {notice ? <p className="inventory-notice">{notice}</p> : null}
      </section>

      <section className="reports-grid">
        <article className="inventory-card report-section inventory-status-section">
          <header className="report-section-header">
            <h2>Estado del inventario</h2>
            <p>Distribucion actual por criticidad</p>
          </header>
          <div className="inventory-status-grid">
            {inventoryStatusReport.map((item) => (
              <article className={`inventory-status-card report-${item.color}`} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.caption}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="inventory-card report-section requests-status-section">
          <header className="report-section-header">
            <h2>Solicitudes por estado</h2>
            <p>Resumen del flujo de aprobacion</p>
          </header>
          <div className="request-status-bars">
            <ReportBar label="Pendientes" value={requestSummary.pending} total={sampleRequests.length} color="orange" />
            <ReportBar label="Aprobadas" value={requestSummary.approved} total={sampleRequests.length} color="green" />
            <ReportBar label="Rechazadas" value={requestSummary.rejected} total={sampleRequests.length} color="red" />
          </div>
        </article>

        <article className="inventory-card report-section expiring-section">
          <header className="report-section-header">
            <h2>Vencimientos proximos</h2>
            <p>Lotes que requieren seguimiento</p>
          </header>
          <div className="table-wrap">
            <Table className="report-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Lote</th>
                  <th>Fecha vencimiento</th>
                  <th>Dias restantes</th>
                  <th>Stock</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {expiringLotsReport.map((lot) => (
                  <tr key={`${lot.product}-${lot.lot}`}>
                    <td><strong>{lot.product}</strong></td>
                    <td>{lot.lot}</td>
                    <td>{lot.expiresAt}</td>
                    <td className={lot.daysLeft < 0 ? 'quantity-negative' : 'quantity-positive'}>{lot.daysLeft}</td>
                    <td>{lot.stock}</td>
                    <td>
                      <Badge className={`report-badge report-badge-${lot.status.toLowerCase()}`}>{lot.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </article>

        <article className="inventory-card report-section top-products-section">
          <header className="report-section-header">
            <h2>Productos con mayor movimiento</h2>
            <p>Productos mas solicitados o movidos</p>
          </header>
          <div className="top-products-list">
            {topMovingProductsReport.map((product, index) => (
              <article key={product.product}>
                <span className="ranking-number">{index + 1}</span>
                <div>
                  <strong>{product.product}</strong>
                  <p>{product.category}</p>
                </div>
                <span>{product.movements}</span>
                <Badge className={product.trend.startsWith('+') ? 'trend-positive' : 'trend-negative'}>{product.trend}</Badge>
              </article>
            ))}
          </div>
        </article>

        <article className="inventory-card report-section recent-movements-section">
          <header className="report-section-header">
            <h2>Movimientos recientes</h2>
            <p>Ultimos registros auditables</p>
          </header>
          <div className="table-wrap">
            <Table className="report-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{movement.code}</td>
                    <td>{formatRequestDate(movement.date)}</td>
                    <td><strong>{movement.product}</strong></td>
                    <td>{movement.type}</td>
                    <td className={movement.quantity < 0 ? 'quantity-negative' : 'quantity-positive'}>
                      {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                    </td>
                    <td>
                      <Badge className={`request-status request-status-${movement.status.toLowerCase()}`}>
                        {movement.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </article>
      </section>
    </section>
  );
}

function ReportBar({ color, label, total, value }) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <article className="report-bar">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="report-bar-track">
        <span className={`report-bar-fill report-fill-${color}`} style={{ width: `${percentage}%` }} />
      </div>
      <small>{percentage}%</small>
    </article>
  );
}
