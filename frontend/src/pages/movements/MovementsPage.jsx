import { useMemo, useState } from 'react';
import { ActionButton } from '../../components/ui/ActionButton.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { movementStatuses, movementTypes, sampleMovements } from '../../data/mockMovements.js';
import { formatRequestDate } from '../../utils/format.js';

const pageSize = 10;

const movementTypeClass = {
  Entrada: 'movement-type-entry',
  Salida: 'movement-type-exit',
  Ajuste: 'movement-type-adjust',
  Traslado: 'movement-type-transfer',
  Solicitud: 'movement-type-request',
};

export default function MovementsPage() {
  const [movements, setMovements] = useState(sampleMovements);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('Todos los tipos');
  const [status, setStatus] = useState('Todos los estados');
  const [startDate, setStartDate] = useState('2024-05-15');
  const [endDate, setEndDate] = useState('2024-05-27');
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState('');
  const [selectedMovement, setSelectedMovement] = useState(null);

  const summary = useMemo(
    () => ({
      entries: movements.filter((movement) => movement.type === 'Entrada').length,
      exits: movements.filter((movement) => movement.type === 'Salida').length,
      adjustments: movements.filter((movement) => movement.type === 'Ajuste').length,
      total: movements.length,
    }),
    [movements],
  );

  const filteredMovements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const from = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const to = endDate ? new Date(`${endDate}T23:59:59`) : null;

    return movements.filter((movement) => {
      const movementDate = new Date(movement.date);
      const matchesQuery =
        !normalizedQuery ||
        movement.code.toLowerCase().includes(normalizedQuery) ||
        movement.product.toLowerCase().includes(normalizedQuery) ||
        movement.lot.toLowerCase().includes(normalizedQuery) ||
        movement.responsible.toLowerCase().includes(normalizedQuery) ||
        movement.area.toLowerCase().includes(normalizedQuery);
      const matchesType = type === 'Todos los tipos' || movement.type === type;
      const matchesStatus = status === 'Todos los estados' || movement.status === status;
      const matchesStart = !from || movementDate >= from;
      const matchesEnd = !to || movementDate <= to;

      return matchesQuery && matchesType && matchesStatus && matchesStart && matchesEnd;
    });
  }, [endDate, movements, query, startDate, status, type]);

  const totalPages = Math.max(1, Math.ceil(filteredMovements.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedMovements = filteredMovements.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleEdit = (movement) => {
    if (movement.status !== 'Pendiente') {
      setNotice('Solo los movimientos pendientes pueden editarse.');
      return;
    }

    setNotice(`Edicion simulada para ${movement.code}. Lista para conectar con API REST.`);
  };

  const handleCancel = (movement) => {
    if (movement.status === 'Anulado') {
      setNotice(`${movement.code} ya se encuentra anulado.`);
      return;
    }

    if (window.confirm(`Anular el movimiento ${movement.code}?`)) {
      setMovements((currentMovements) =>
        currentMovements.map((currentMovement) =>
          currentMovement.id === movement.id ? { ...currentMovement, status: 'Anulado' } : currentMovement,
        ),
      );
      setNotice(`Movimiento anulado: ${movement.code}`);
    }
  };

  const handleExport = () => {
    setNotice(`Exportacion simulada de ${filteredMovements.length} movimientos filtrados.`);
  };

  return (
    <section className="content-panel movements-panel">
      <header className="page-header">
        <div>
          <h1>Movimientos</h1>
          <p>Consulta y audita los movimientos del inventario</p>
        </div>
        <div className="header-actions">
          <Button onClick={handleExport}>
            <Icon name="download" />
            Exportar
          </Button>
          <Button variant="primary" onClick={() => setNotice('Registro de movimiento listo para futura pantalla/API.')}>
            <Icon name="plus" />
            Registrar movimiento
          </Button>
        </div>
      </header>

      <section className="stats-grid movements-stats-grid" aria-label="Resumen de movimientos">
        <StatCard color="green" icon="download" label="Entradas" value={summary.entries} caption="Suman stock" />
        <StatCard color="red" icon="arrowRight" label="Salidas" value={summary.exits} caption="Restan stock" />
        <StatCard color="orange" icon="settings" label="Ajustes" value={summary.adjustments} caption="Correcciones de stock" />
        <StatCard color="blue" icon="file" label="Total movimientos" value={summary.total} caption="Trazabilidad registrada" />
      </section>

      <section className="inventory-card movements-card" aria-label="Listado de movimientos">
        <div className="request-filters-row movement-filters-row">
          <label className="search-field">
            <Icon name="search" />
            <input
              aria-label="Buscar movimiento"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Buscar codigo, producto, lote, usuario o area..."
              value={query}
            />
          </label>

          <select aria-label="Tipo de movimiento" onChange={(event) => setType(event.target.value)} value={type}>
            {movementTypes.map((movementType) => (
              <option key={movementType}>{movementType}</option>
            ))}
          </select>

          <select aria-label="Estado" onChange={(event) => setStatus(event.target.value)} value={status}>
            {movementStatuses.map((movementStatus) => (
              <option key={movementStatus}>{movementStatus}</option>
            ))}
          </select>

          <label className="date-range-field">
            <Icon name="calendar" />
            <input aria-label="Fecha inicial" onChange={(event) => setStartDate(event.target.value)} type="date" value={startDate} />
            <span>-</span>
            <input aria-label="Fecha final" onChange={(event) => setEndDate(event.target.value)} type="date" value={endDate} />
          </label>

          <Button className="filter-button" onClick={() => setNotice('Filtros avanzados listos para ampliar.')}>
            <Icon name="filter" />
            Filtros
          </Button>
        </div>

        {notice ? <p className="inventory-notice">{notice}</p> : null}

        <div className="table-wrap">
          <Table className="movements-table">
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Lote</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Area / Bodega</th>
                <th>Responsable</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMovements.map((movement) => (
                <tr key={movement.id}>
                  <td>{movement.code}</td>
                  <td>{formatRequestDate(movement.date)}</td>
                  <td>
                    <strong>{movement.product}</strong>
                    <span>{movement.productCode}</span>
                  </td>
                  <td>{movement.lot}</td>
                  <td>
                    <Badge className={`movement-type ${movementTypeClass[movement.type]}`}>{movement.type}</Badge>
                  </td>
                  <td className={movement.quantity < 0 ? 'quantity-negative' : 'quantity-positive'}>
                    {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                  </td>
                  <td>{movement.area}</td>
                  <td>{movement.responsible}</td>
                  <td>
                    <Badge className={`request-status request-status-${movement.status.toLowerCase()}`}>
                      {movement.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="table-actions request-actions">
                      <ActionButton icon="eye" label={`Ver ${movement.code}`} onClick={() => setSelectedMovement(movement)} />
                      <ActionButton icon="edit" label={`Editar ${movement.code}`} onClick={() => handleEdit(movement)} />
                      <ActionButton icon="xCircle" label={`Anular ${movement.code}`} onClick={() => handleCancel(movement)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <footer className="table-footer">
          <p>
            Mostrando {filteredMovements.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} a{' '}
            {Math.min(currentPage * pageSize, filteredMovements.length)} de {filteredMovements.length} movimientos
          </p>
          <div className="pagination">
            <button type="button" aria-label="Pagina anterior" onClick={() => setPage((currentValue) => Math.max(1, currentValue - 1))}>
              <Icon name="arrowLeft" />
            </button>
            <button className="page-current" type="button">{currentPage}</button>
            <button type="button" aria-label="Pagina siguiente" onClick={() => setPage((currentValue) => Math.min(totalPages, currentValue + 1))}>
              <Icon name="arrowRight" />
            </button>
          </div>
        </footer>
      </section>

      {selectedMovement ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedMovement(null)}>
          <section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="movement-detail-title" onClick={(event) => event.stopPropagation()}>
            <header>
              <div>
                <span>{selectedMovement.code}</span>
                <h2 id="movement-detail-title">Detalle de movimiento</h2>
              </div>
              <button type="button" onClick={() => setSelectedMovement(null)}>Cerrar</button>
            </header>
            <div className="request-detail-grid">
              <p><strong>Fecha</strong>{formatRequestDate(selectedMovement.date)}</p>
              <p><strong>Producto</strong>{selectedMovement.product}</p>
              <p><strong>Lote</strong>{selectedMovement.lot}</p>
              <p><strong>Tipo</strong>{selectedMovement.type}</p>
              <p><strong>Cantidad</strong>{selectedMovement.quantity}</p>
              <p><strong>Estado</strong>{selectedMovement.status}</p>
              <p><strong>Area / Bodega</strong>{selectedMovement.area}</p>
              <p><strong>Responsable</strong>{selectedMovement.responsible}</p>
              <p className="detail-wide"><strong>Trazabilidad</strong>{selectedMovement.trace}</p>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
