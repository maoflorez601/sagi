import { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { navigateTo } from '../../utils/navigation.js';
import { apiBaseUrl, getStoredProducts, getStoredRequests, saveStoredRequests } from '../../utils/storage.js';

const initialRequestForm = {
  type: '',
  date: '2024-05-27',
  requester: '',
  area: '',
  priority: '',
  justification: '',
};

const requestTypeOptions = ['Reposicion de inventario', 'Solicitud ordinaria', 'Solicitud urgente', 'Traslado interno'];
const requesterOptions = ['Maria Gomez', 'Carlos Ramirez', 'Laura Torres', 'Andres Molina', 'Natalia Rios', 'Admin SAGI'];
const requestDepartmentOptions = ['Urgencias', 'Farmacia', 'Hospitalizacion', 'Cirugia', 'Laboratorio Clinico', 'Consulta Externa'];
const requestPriorityOptions = ['Baja', 'Media', 'Alta', 'Critica'];

function createEmptyRequestProduct() {
  return {
    productCode: '',
    lot: '',
    quantity: '',
    observations: '',
  };
}

function RequestField({ children, error, label, required }) {
  return (
    <label className="product-field request-field">
      <span>
        {label}
        {required ? <b>*</b> : null}
      </span>
      {children}
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function validateRequestForm(form, rows) {
  const errors = {};
  const rowErrors = rows.map(() => ({}));

  if (!form.type) errors.type = 'Selecciona el tipo de solicitud.';
  if (!form.date) errors.date = 'La fecha de solicitud es obligatoria.';
  if (!form.requester) errors.requester = 'Selecciona el solicitante.';
  if (!form.area) errors.area = 'Selecciona el area o departamento.';
  if (!form.priority) errors.priority = 'Selecciona la prioridad.';
  if (!form.justification.trim()) errors.justification = 'Describe la justificacion de la solicitud.';

  if (rows.length === 0) {
    errors.products = 'Debe existir al menos un producto en la solicitud.';
  }

  rows.forEach((row, index) => {
    if (!row.productCode) {
      rowErrors[index].productCode = 'Selecciona un producto.';
    }

    const quantity = Number(row.quantity);
    if (!row.quantity || Number.isNaN(quantity) || quantity <= 0) {
      rowErrors[index].quantity = 'Ingresa una cantidad mayor a 0.';
    }
  });

  const hasRowErrors = rowErrors.some((rowError) => Object.keys(rowError).length > 0);

  return {
    errors,
    rowErrors,
    hasErrors: Object.keys(errors).length > 0 || hasRowErrors,
  };
}

export default function CreateRequestPage() {
  const [form, setForm] = useState(initialRequestForm);
  const [rows, setRows] = useState([createEmptyRequestProduct()]);
  const [errors, setErrors] = useState({});
  const [rowErrors, setRowErrors] = useState([{}]);
  const [isSaving, setIsSaving] = useState(false);
  const inventoryProducts = getStoredProducts();

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
  };

  const updateRow = (index, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)),
    );
    setRowErrors((currentErrors) =>
      currentErrors.map((rowError, rowIndex) => (rowIndex === index ? { ...rowError, [field]: '' } : rowError)),
    );
  };

  const addRow = () => {
    setRows((currentRows) => [...currentRows, createEmptyRequestProduct()]);
    setRowErrors((currentErrors) => [...currentErrors, {}]);
    setErrors((currentErrors) => ({ ...currentErrors, products: '' }));
  };

  const removeRow = (index) => {
    if (rows.length === 1) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        products: 'Debe existir al menos un producto en la solicitud.',
      }));
      return;
    }

    setRows((currentRows) => currentRows.filter((_, rowIndex) => rowIndex !== index));
    setRowErrors((currentErrors) => currentErrors.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleCancel = () => navigateTo('/requests');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateRequestForm(form, rows);
    setErrors(validation.errors);
    setRowErrors(validation.rowErrors);

    if (validation.hasErrors) {
      return;
    }

    setIsSaving(true);

    const nextRequest = {
      id: Date.now(),
      code: `SOL-${new Date().getFullYear()}-${String(getStoredRequests().length + 1).padStart(4, '0')}`,
      date: `${form.date}T09:00:00`,
      area: form.area,
      requestedBy: form.requester,
      status: 'Pendiente',
      priority: form.priority,
      observations: form.justification.trim(),
      type: form.type,
      createdAt: new Date().toISOString(),
      approvedAt: '',
      approvedBy: '',
      products: rows.map((row) => {
        const product = inventoryProducts.find((inventoryProduct) => inventoryProduct.code === row.productCode);
        return {
          product: product?.name || row.productCode,
          productCode: row.productCode,
          lot: row.lot,
          quantity: Number(row.quantity),
          unit: product?.unit || product?.presentation || 'Unidad',
          observations: row.observations.trim(),
        };
      }),
    };

    try {
      await fetch(`${apiBaseUrl}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nextRequest),
      }).catch(() => null);

      saveStoredRequests([...getStoredRequests(), nextRequest]);
      navigateTo('/requests');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout activePath="/requests">
      <section className="content-panel create-request-panel">
        <header className="create-header request-create-header">
          <div>
            <nav className="breadcrumb" aria-label="Ruta">
              <a href="/requests">Solicitudes</a>
              <Icon name="chevronRight" />
              <span>Nueva solicitud</span>
            </nav>
            <h1>Nueva solicitud</h1>
            <p>Registra una nueva solicitud de productos o insumos</p>
          </div>
          <button className="secondary-button" type="button" onClick={handleCancel}>
            <Icon name="arrowLeft" />
            Volver a solicitudes
          </button>
        </header>

        <form className="product-create-form request-create-form" onSubmit={handleSubmit}>
          <section className="product-form-card request-form-card">
            <h2>
              <Icon name="file" />
              Informacion de la solicitud
            </h2>
            <div className="request-info-grid">
              <RequestField error={errors.type} label="Tipo de solicitud" required>
                <select className={errors.type ? 'field-invalid' : ''} name="type" value={form.type} onChange={handleFormChange}>
                  <option value="">Selecciona el tipo de solicitud</option>
                  {requestTypeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </RequestField>
              <RequestField error={errors.date} label="Fecha de solicitud" required>
                <input className={errors.date ? 'field-invalid' : ''} name="date" type="date" value={form.date} onChange={handleFormChange} />
              </RequestField>
              <RequestField error={errors.requester} label="Solicitante" required>
                <select className={errors.requester ? 'field-invalid' : ''} name="requester" value={form.requester} onChange={handleFormChange}>
                  <option value="">Selecciona el solicitante</option>
                  {requesterOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </RequestField>
              <RequestField error={errors.area} label="Area / Departamento" required>
                <select className={errors.area ? 'field-invalid' : ''} name="area" value={form.area} onChange={handleFormChange}>
                  <option value="">Selecciona el area o departamento</option>
                  {requestDepartmentOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </RequestField>
              <RequestField error={errors.priority} label="Prioridad" required>
                <select className={errors.priority ? 'field-invalid' : ''} name="priority" value={form.priority} onChange={handleFormChange}>
                  <option value="">Selecciona la prioridad</option>
                  {requestPriorityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </RequestField>
              <RequestField error={errors.justification} label="Descripcion / Justificacion" required>
                <textarea
                  className={errors.justification ? 'field-invalid' : ''}
                  name="justification"
                  onChange={handleFormChange}
                  placeholder="Describe el motivo de la solicitud..."
                  value={form.justification}
                />
              </RequestField>
            </div>

            <h2 className="products-request-title">
              <Icon name="box" />
              Productos solicitados
            </h2>
            {errors.products ? <p className="product-save-error">{errors.products}</p> : null}
            <div className="request-products-table">
              <div className="request-products-head">
                <span>Producto <b>*</b></span>
                <span>Lote (opcional)</span>
                <span>Cantidad solicitada <b>*</b></span>
                <span>Observaciones (opcional)</span>
                <span>Acciones</span>
              </div>
              {rows.map((row, index) => (
                <div className="request-product-row" key={`request-product-${index}`}>
                  <label>
                    <select
                      className={rowErrors[index]?.productCode ? 'field-invalid' : ''}
                      value={row.productCode}
                      onChange={(event) => updateRow(index, 'productCode', event.target.value)}
                    >
                      <option value="">Selecciona un producto</option>
                      {inventoryProducts.map((product) => (
                        <option key={product.code} value={product.code}>
                          {product.name} - {product.status === 'Agotado' || product.stock === 0 ? 'Agotado' : `Disponible: ${product.stock}`}
                        </option>
                      ))}
                    </select>
                    {rowErrors[index]?.productCode ? <small>{rowErrors[index].productCode}</small> : null}
                  </label>
                  <select value={row.lot} onChange={(event) => updateRow(index, 'lot', event.target.value)}>
                    <option value="">Selecciona lote</option>
                    <option>L-2024-A</option>
                    <option>L-2024-B</option>
                    <option>L-2024-C</option>
                  </select>
                  <label>
                    <input
                      className={rowErrors[index]?.quantity ? 'field-invalid' : ''}
                      min="1"
                      type="number"
                      value={row.quantity}
                      onChange={(event) => updateRow(index, 'quantity', event.target.value)}
                      placeholder="0"
                    />
                    {rowErrors[index]?.quantity ? <small>{rowErrors[index].quantity}</small> : null}
                  </label>
                  <input
                    value={row.observations}
                    onChange={(event) => updateRow(index, 'observations', event.target.value)}
                    placeholder="Observaciones..."
                  />
                  <button className="delete-row-button" type="button" onClick={() => removeRow(index)} aria-label="Eliminar producto">
                    <Icon name="trash" />
                  </button>
                </div>
              ))}
            </div>
            <button className="add-product-button" type="button" onClick={addRow}>
              <Icon name="plus" />
              Agregar producto
            </button>

            <div className="request-form-actions">
              <button className="secondary-button" type="button" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="orange-button" type="submit" disabled={isSaving}>
                <Icon name="save" />
                {isSaving ? 'Guardando...' : 'Guardar solicitud'}
              </button>
            </div>
          </section>
        </form>
      </section>
    </MainLayout>
  );
}
