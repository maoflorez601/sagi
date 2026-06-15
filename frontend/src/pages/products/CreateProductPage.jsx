import { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { navigateTo } from '../../utils/navigation.js';
import { apiBaseUrl, getStoredProducts, saveStoredProducts } from '../../utils/storage.js';

const initialProductForm = {
  name: '',
  code: '',
  barcode: '',
  category: '',
  subcategory: '',
  presentation: '',
  unit: '',
  manufacturer: '',
  country: '',
  stock: '',
  minStock: '',
  maxStock: '',
  location: '',
  status: '',
  observations: '',
  sanitaryRegistration: '',
  registrationDate: '',
  description: '',
};

const categoryOptions = ['Medicamentos', 'Insumos Medicos', 'Dispositivos Medicos', 'Aseo y desinfeccion'];
const subcategoryOptions = ['Analgesicos', 'Antibioticos', 'Material medico', 'Bioseguridad', 'Desinfeccion'];
const unitOptions = ['Unidad', 'Caja', 'Frasco', 'Ampolla', 'Blister', 'Paquete'];
const statusOptions = ['Activo', 'Agotado', 'Inactivo'];

function ProductSection({ children, icon, title }) {
  return (
    <section className="product-form-card">
      <h2>
        <Icon name={icon} />
        {title}
      </h2>
      <div className="product-form-grid">{children}</div>
    </section>
  );
}

function ProductField({ error, label, required, ...props }) {
  return (
    <label className="product-field">
      <span>
        {label}
        {required ? <b>*</b> : null}
      </span>
      <input className={error ? 'field-invalid' : ''} {...props} />
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function ProductSelect({ children, error, label, required, ...props }) {
  return (
    <label className="product-field">
      <span>
        {label}
        {required ? <b>*</b> : null}
      </span>
      <select className={error ? 'field-invalid' : ''} {...props}>
        {children}
      </select>
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function validateProductForm(form) {
  const nextErrors = {};
  const requiredFields = {
    name: 'El nombre del producto es obligatorio.',
    code: 'El codigo del producto es obligatorio.',
    category: 'Selecciona una categoria.',
    presentation: 'La presentacion es obligatoria.',
    unit: 'Selecciona una unidad de medida.',
    stock: 'El stock actual es obligatorio.',
    minStock: 'El stock minimo es obligatorio.',
    location: 'La ubicacion en almacen es obligatoria.',
    status: 'Selecciona un estado.',
  };

  Object.entries(requiredFields).forEach(([field, message]) => {
    if (!String(form[field]).trim()) {
      nextErrors[field] = message;
    }
  });

  const stock = Number(form.stock);
  const minStock = Number(form.minStock);
  const maxStock = form.maxStock === '' ? null : Number(form.maxStock);

  if (form.stock !== '' && (Number.isNaN(stock) || stock < 0)) {
    nextErrors.stock = 'El stock actual debe ser un numero mayor o igual a 0.';
  }

  if (form.minStock !== '' && (Number.isNaN(minStock) || minStock < 0)) {
    nextErrors.minStock = 'El stock minimo debe ser un numero mayor o igual a 0.';
  }

  if (form.maxStock !== '' && (Number.isNaN(maxStock) || maxStock < minStock)) {
    nextErrors.maxStock = 'El stock maximo debe ser mayor o igual al stock minimo.';
  }

  const duplicatedCode = getStoredProducts().some(
    (product) => product.code.toLowerCase() === form.code.trim().toLowerCase(),
  );

  if (duplicatedCode) {
    nextErrors.code = 'Ya existe un producto con este codigo.';
  }

  return nextErrors;
}

export default function CreateProductPage() {
  const [form, setForm] = useState(initialProductForm);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
  };

  const handleCancel = () => {
    navigateTo('/products');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateProductForm(form);
    setSaveError('');

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);

    const nextProduct = {
      code: form.code.trim(),
      name: form.name.trim(),
      description: form.description.trim() || form.observations.trim() || 'Sin descripcion',
      category: form.category,
      presentation: form.presentation.trim(),
      stock: Number(form.stock),
      status: form.status,
      barcode: form.barcode.trim(),
      subcategory: form.subcategory,
      unit: form.unit,
      manufacturer: form.manufacturer.trim(),
      country: form.country.trim(),
      minStock: Number(form.minStock),
      maxStock: form.maxStock === '' ? null : Number(form.maxStock),
      location: form.location.trim(),
      observations: form.observations.trim(),
      sanitaryRegistration: form.sanitaryRegistration.trim(),
      registrationDate: form.registrationDate,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nextProduct),
      }).catch(() => null);

      if (response && !response.ok) {
        const data = await response.json();
        if (response.status === 409) {
          setErrors({ code: data.message || 'Ya existe un producto con este codigo.' });
          return;
        }

        throw new Error(data.message || 'No se pudo guardar el producto.');
      }

      saveStoredProducts([...getStoredProducts(), nextProduct]);
      navigateTo('/products');
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout activePath="/products">
      <section className="content-panel create-product-panel">
        <header className="create-header">
          <div>
            <nav className="breadcrumb" aria-label="Ruta">
              <a href="/products">Productos</a>
              <Icon name="chevronRight" />
              <span>Nuevo producto</span>
            </nav>
            <h1>Registro de nuevo producto</h1>
            <p>Completa la informacion del producto</p>
          </div>
          <div className="header-actions">
            <button className="secondary-button" type="button" onClick={handleCancel}>
              Cancelar
            </button>
            <button className="orange-button" type="button" onClick={handleSubmit} disabled={isSaving}>
              <Icon name="save" />
              {isSaving ? 'Guardando...' : 'Guardar producto'}
            </button>
          </div>
        </header>

        <form className="product-create-form" onSubmit={handleSubmit}>
          {saveError ? <p className="product-save-error">{saveError}</p> : null}

          <ProductSection icon="cube" title="Informacion general">
            <ProductField
              error={errors.name}
              label="Nombre del producto"
              name="name"
              onChange={handleChange}
              placeholder="Ej. Paracetamol 500mg"
              required
              value={form.name}
            />
            <ProductField
              error={errors.code}
              label="Codigo del producto"
              name="code"
              onChange={handleChange}
              placeholder="Ej. PROD-001"
              required
              value={form.code}
            />
            <ProductField
              error={errors.barcode}
              label="Codigo de barras"
              name="barcode"
              onChange={handleChange}
              placeholder="Ej. 7701234567890"
              value={form.barcode}
            />
            <ProductSelect
              error={errors.category}
              label="Categoria"
              name="category"
              onChange={handleChange}
              required
              value={form.category}
            >
              <option value="">Selecciona una categoria</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </ProductSelect>
            <ProductSelect
              error={errors.subcategory}
              label="Subcategoria"
              name="subcategory"
              onChange={handleChange}
              value={form.subcategory}
            >
              <option value="">Selecciona una subcategoria</option>
              {subcategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </ProductSelect>
            <ProductField
              error={errors.presentation}
              label="Presentacion"
              name="presentation"
              onChange={handleChange}
              placeholder="Ej. Tabletas, Frasco, Ampolla"
              required
              value={form.presentation}
            />
            <ProductSelect
              error={errors.unit}
              label="Unidad de medida"
              name="unit"
              onChange={handleChange}
              required
              value={form.unit}
            >
              <option value="">Selecciona unidad</option>
              {unitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </ProductSelect>
            <ProductField
              error={errors.manufacturer}
              label="Fabricante / Laboratorio"
              name="manufacturer"
              onChange={handleChange}
              placeholder="Ej. Genfar"
              value={form.manufacturer}
            />
            <ProductField
              error={errors.country}
              label="Pais de origen"
              name="country"
              onChange={handleChange}
              placeholder="Ej. Colombia"
              value={form.country}
            />
          </ProductSection>

          <ProductSection icon="cube" title="Informacion de inventario">
            <ProductField
              error={errors.stock}
              label="Stock actual"
              name="stock"
              onChange={handleChange}
              placeholder="Ej. 100"
              required
              type="number"
              value={form.stock}
            />
            <ProductField
              error={errors.minStock}
              label="Stock minimo"
              name="minStock"
              onChange={handleChange}
              placeholder="Ej. 20"
              required
              type="number"
              value={form.minStock}
            />
            <ProductField
              error={errors.maxStock}
              label="Stock maximo"
              name="maxStock"
              onChange={handleChange}
              placeholder="Ej. 500"
              type="number"
              value={form.maxStock}
            />
            <ProductField
              error={errors.location}
              label="Ubicacion en almacen"
              name="location"
              onChange={handleChange}
              placeholder="Ej. Estante A - Nivel 2"
              required
              value={form.location}
            />
            <ProductSelect
              error={errors.status}
              label="Estado"
              name="status"
              onChange={handleChange}
              required
              value={form.status}
            >
              <option value="">Selecciona un estado</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </ProductSelect>
            <ProductField
              error={errors.observations}
              label="Observaciones"
              name="observations"
              onChange={handleChange}
              placeholder="Informacion adicional (opcional)"
              value={form.observations}
            />
          </ProductSection>

          <section className="product-form-card">
            <h2>
              <Icon name="document" />
              Informacion adicional
            </h2>
            <div className="product-form-grid additional-grid">
              <ProductField
                error={errors.sanitaryRegistration}
                label="Numero de registro sanitario"
                name="sanitaryRegistration"
                onChange={handleChange}
                placeholder="Ej. INVIMA 2023M-123456-R1"
                value={form.sanitaryRegistration}
              />
              <ProductField
                error={errors.registrationDate}
                label="Fecha de registro"
                name="registrationDate"
                onChange={handleChange}
                type="date"
                value={form.registrationDate}
              />
              <label className="product-field description-field">
                <span>Descripcion</span>
                <textarea
                  name="description"
                  onChange={handleChange}
                  placeholder="Descripcion detallada del producto..."
                  value={form.description}
                />
                {errors.description ? <small>{errors.description}</small> : null}
              </label>
            </div>
          </section>
        </form>
      </section>
    </MainLayout>
  );
}
