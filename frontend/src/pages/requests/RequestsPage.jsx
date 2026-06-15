import { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout.jsx';
import { ActionButton } from '../../components/ui/ActionButton.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { priorityRank, requestAreas, requestsStorageKey, requestStatuses } from '../../data/mockRequests.js';
import { navigateTo } from '../../utils/navigation.js';
import { formatRequestDate } from '../../utils/format.js';
import { apiBaseUrl, getStoredRequests, saveStoredRequests } from '../../utils/storage.js';

const currentUser = {
  name: 'Admin SAGI',
};

export default function RequestsPage() {
  const [requests, setRequests] = useState(getStoredRequests);
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('Todas las areas');
  const [status, setStatus] = useState('Todos los estados');
  const [startDate, setStartDate] = useState('2024-05-13');
  const [endDate, setEndDate] = useState('2024-05-27');
  const [sort, setSort] = useState({ key: 'date', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetch(`${apiBaseUrl}/api/requests`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        const hasLocalRequests = localStorage.getItem(requestsStorageKey);

        if (isMounted && !hasLocalRequests && Array.isArray(data.requests) && data.requests.length > 0) {
          setRequests(data.requests);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRequests(getStoredRequests());
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(
    () => ({
      pending: requests.filter((request) => request.status === 'Pendiente').length,
      approved: requests.filter((request) => request.status === 'Aprobada').length,
      rejected: requests.filter((request) => request.status === 'Rechazada').length,
      total: requests.length,
    }),
    [requests],
  );

  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const from = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const to = endDate ? new Date(`${endDate}T23:59:59`) : null;

    const filtered = requests.filter((request) => {
      const requestDate = new Date(request.date);
      const matchesQuery =
        !normalizedQuery ||
        request.code.toLowerCase().includes(normalizedQuery) ||
        request.area.toLowerCase().includes(normalizedQuery) ||
        request.requestedBy.toLowerCase().includes(normalizedQuery) ||
        request.products.some(
          (product) =>
            product.product.toLowerCase().includes(normalizedQuery) ||
            product.productCode.toLowerCase().includes(normalizedQuery),
        );
      const matchesArea = area === 'Todas las areas' || request.area === area;
      const matchesStatus = status === 'Todos los estados' || request.status === status;
      const matchesStart = !from || requestDate >= from;
      const matchesEnd = !to || requestDate <= to;

      return matchesQuery && matchesArea && matchesStatus && matchesStart && matchesEnd;
    });

    return [...filtered].sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      const aValue = sort.key === 'priority' ? priorityRank[a.priority] : a[sort.key];
      const bValue = sort.key === 'priority' ? priorityRank[b.priority] : b[sort.key];

      if (sort.key === 'date') {
        return (new Date(aValue) - new Date(bValue)) * direction;
      }

      return String(aValue).localeCompare(String(bValue), 'es') * direction;
    });
  }, [area, endDate, query, requests, sort, startDate, status]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    setSort((currentSort) => ({
      key,
      direction: currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const updateRequest = (requestId, patch) => {
    setRequests((currentRequests) => {
      const nextRequests = currentRequests.map((request) =>
        request.id === requestId ? { ...request, ...patch } : request,
      );
      saveStoredRequests(nextRequests);
      return nextRequests;
    });
  };

  const approveRequest = (request) => {
    if (request.status !== 'Pendiente') {
      setNotice('Solo las solicitudes pendientes pueden aprobarse.');
      return;
    }

    updateRequest(request.id, {
      status: 'Aprobada',
      approvedAt: new Date().toISOString(),
      approvedBy: currentUser.name,
    });
    setNotice(`Solicitud aprobada: ${request.code}`);
  };

  const rejectRequest = (request) => {
    if (request.status !== 'Pendiente') {
      setNotice('Solo las solicitudes pendientes pueden rechazarse.');
      return;
    }

    const reason = window.prompt('Motivo de rechazo');
    if (!reason) {
      return;
    }

    updateRequest(request.id, {
      status: 'Rechazada',
      observations: reason,
      approvedAt: new Date().toISOString(),
      approvedBy: currentUser.name,
    });
    setNotice(`Solicitud rechazada: ${request.code}`);
  };

  const deleteRequest = (request) => {
    if (request.status !== 'Pendiente') {
      setNotice('Solo las solicitudes pendientes pueden eliminarse.');
      return;
    }

    if (window.confirm(`Eliminar la solicitud ${request.code}?`)) {
      setRequests((currentRequests) => {
        const nextRequests = currentRequests.filter((currentRequest) => currentRequest.id !== request.id);
        saveStoredRequests(nextRequests);
        return nextRequests;
      });
      setNotice(`Solicitud eliminada: ${request.code}`);
    }
  };

  const editRequest = (request) => {
    if (request.status !== 'Pendiente') {
      setNotice('Solo las solicitudes pendientes pueden editarse.');
      return;
    }

    setNotice(`Edicion simulada para ${request.code}. Lista para conectar con formulario.`);
  };

  const exportRequests = () => {
    setNotice(`Exportacion simulada de ${filteredRequests.length} solicitudes filtradas.`);
  };

  return (
    <MainLayout activePath="/requests">

      <section className="content-panel requests-panel">
        <header className="page-header">
          <div>
            <h1>Solicitudes</h1>
            <p>Gestiona las solicitudes internas de las areas</p>
          </div>
          <div className="header-actions">
            <button className="secondary-button" type="button" onClick={exportRequests}>
              <Icon name="download" />
              Exportar
            </button>
            <button className="orange-button" type="button" onClick={() => navigateTo('/requests/create')}>
              <Icon name="plus" />
              Nueva solicitud
            </button>
          </div>
        </header>

        <section className="request-stats-grid" aria-label="Resumen de solicitudes">
          <StatCard color="orange" icon="clock" label="Pendientes" value={summary.pending} caption="Solicitud en espera" />
          <StatCard color="green" icon="checkCircle" label="Aprobadas" value={summary.approved} caption="Solicitudes aprobadas" />
          <StatCard color="red" icon="xCircle" label="Rechazadas" value={summary.rejected} caption="Solicitudes rechazadas" />
          <StatCard color="blue" icon="file" label="Total" value={summary.total} caption="Total de solicitudes" />
        </section>

        <section className="inventory-card requests-card" aria-label="Listado de solicitudes">
          <div className="request-filters-row">
            <label className="search-field">
              <Icon name="search" />
              <input
                aria-label="Buscar solicitud"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Buscar solicitud, producto o area..."
              />
            </label>
            <select value={area} onChange={(event) => setArea(event.target.value)} aria-label="Area">
              {requestAreas.map((areaOption) => (
                <option key={areaOption}>{areaOption}</option>
              ))}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Estado">
              {requestStatuses.map((statusOption) => (
                <option key={statusOption}>{statusOption}</option>
              ))}
            </select>
            <label className="date-range-field">
              <Icon name="calendar" />
              <input value={startDate} onChange={(event) => setStartDate(event.target.value)} type="date" aria-label="Fecha inicial" />
              <span>-</span>
              <input value={endDate} onChange={(event) => setEndDate(event.target.value)} type="date" aria-label="Fecha final" />
            </label>
            <button className="secondary-button filter-button" type="button" onClick={() => setNotice('Filtros avanzados listos para ampliar.')}>
              <Icon name="filter" />
              Filtros
            </button>
          </div>

          {notice ? <p className="inventory-notice">{notice}</p> : null}

          <div className="table-wrap">
            <table className="requests-table">
              <thead>
                <tr>
                  <th><button type="button" onClick={() => handleSort('code')}>Codigo</button></th>
                  <th><button type="button" onClick={() => handleSort('date')}>Fecha</button></th>
                  <th><button type="button" onClick={() => handleSort('area')}>Area solicitante</button></th>
                  <th><button type="button" onClick={() => handleSort('requestedBy')}>Solicitado por</button></th>
                  <th>Productos</th>
                  <th><button type="button" onClick={() => handleSort('status')}>Estado</button></th>
                  <th><button type="button" onClick={() => handleSort('priority')}>Prioridad</button></th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.code}</td>
                    <td>{formatRequestDate(request.date)}</td>
                    <td>{request.area}</td>
                    <td>{request.requestedBy}</td>
                    <td>{request.products.length} productos</td>
                    <td>
                      <span className={`request-status request-status-${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-dot priority-${request.priority.toLowerCase()}`}>{request.priority}</span>
                    </td>
                    <td>
                      <div className="table-actions request-actions">
                        <ActionButton icon="eye" label={`Ver ${request.code}`} onClick={() => setSelectedRequest(request)} />
                        <ActionButton icon="edit" label={`Editar ${request.code}`} onClick={() => editRequest(request)} />
                        <ActionButton icon="checkCircle" label={`Aprobar ${request.code}`} onClick={() => approveRequest(request)} />
                        <ActionButton icon="xCircle" label={`Rechazar ${request.code}`} onClick={() => rejectRequest(request)} />
                        <ActionButton icon="trash" label={`Eliminar ${request.code}`} onClick={() => deleteRequest(request)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <p>
              Mostrando {filteredRequests.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} a{' '}
              {Math.min(currentPage * pageSize, filteredRequests.length)} de {filteredRequests.length} solicitudes
            </p>
            <div className="pagination request-pagination">
              <button type="button" aria-label="Pagina anterior" onClick={() => setPage((currentPageValue) => Math.max(1, currentPageValue - 1))}>
                <Icon name="arrowLeft" />
              </button>
              <button className="page-current" type="button">{currentPage}</button>
              <button type="button" aria-label="Pagina siguiente" onClick={() => setPage((currentPageValue) => Math.min(totalPages, currentPageValue + 1))}>
                <Icon name="arrowRight" />
              </button>
              <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} aria-label="Solicitudes por pagina">
                <option value="5">5 por pagina</option>
                <option value="10">10 por pagina</option>
                <option value="15">15 por pagina</option>
              </select>
            </div>
          </footer>
        </section>
      </section>

      {selectedRequest ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedRequest(null)}>
          <section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-detail-title" onClick={(event) => event.stopPropagation()}>
            <header>
              <div>
                <span>{selectedRequest.code}</span>
                <h2 id="request-detail-title">Detalle de solicitud</h2>
              </div>
              <button type="button" onClick={() => setSelectedRequest(null)} aria-label="Cerrar">Cerrar</button>
            </header>
            <div className="request-detail-grid">
              <p><strong>Fecha</strong>{formatRequestDate(selectedRequest.date)}</p>
              <p><strong>Area solicitante</strong>{selectedRequest.area}</p>
              <p><strong>Solicitado por</strong>{selectedRequest.requestedBy}</p>
              <p><strong>Estado</strong>{selectedRequest.status}</p>
              <p><strong>Prioridad</strong>{selectedRequest.priority}</p>
              <p><strong>Aprobador</strong>{selectedRequest.approvedBy || 'Pendiente'}</p>
              <p className="detail-wide"><strong>Observaciones</strong>{selectedRequest.observations || 'Sin observaciones'}</p>
            </div>
            <h3>Productos solicitados</h3>
            <div className="modal-products">
              {selectedRequest.products.map((product) => (
                <article key={`${selectedRequest.id}-${product.productCode}`}>
                  <strong>{product.product}</strong>
                  <span>{product.productCode}</span>
                  <span>{product.quantity} {product.unit}</span>
                  <p>{product.observations || 'Sin observaciones'}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </MainLayout>
  );
}
