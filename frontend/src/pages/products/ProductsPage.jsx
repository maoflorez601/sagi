import { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout.jsx';
import { ActionButton } from '../../components/ui/ActionButton.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { productsStorageKey, sampleProducts } from '../../data/mockProducts.js';
import { navigateTo } from '../../utils/navigation.js';
import { apiBaseUrl, getStoredProducts, saveStoredProducts } from '../../utils/storage.js';

export default function ProductsPage() {
  const [products, setProducts] = useState(getStoredProducts);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas las categorias');
  const [status, setStatus] = useState('Todos los estados');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetch(`${apiBaseUrl}/api/products`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        const hasLocalProducts = localStorage.getItem(productsStorageKey);

        if (isMounted && !hasLocalProducts && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts(sampleProducts);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => ['Todas las categorias', ...Array.from(new Set(products.map((product) => product.category)))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.code.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === 'Todas las categorias' || product.category === category;
      const matchesStatus = status === 'Todos los estados' || product.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, products, query, status]);

  const stats = useMemo(() => {
    const active = products.filter((product) => product.status === 'Activo').length;
    const exhausted = products.filter((product) => product.status === 'Agotado' || product.stock === 0).length;

    return {
      total: products.length,
      active,
      exhausted,
    };
  }, [products]);

  const handleAction = (action, product) => {
    setNotice(`${action}: ${product.code} - ${product.name}`);
  };

  const handleDelete = (product) => {
    setProducts((currentProducts) => {
      const nextProducts = currentProducts.filter((currentProduct) => currentProduct.code !== product.code);
      saveStoredProducts(nextProducts);
      return nextProducts;
    });
    setNotice(`Producto eliminado: ${product.code} - ${product.name}`);
  };

  return (
    <MainLayout activePath="/products">

      <section className="content-panel">
        <header className="page-header">
          <div>
            <h1>Productos</h1>
            <p>Gestiona el catalogo de productos del inventario</p>
          </div>
          <div className="header-actions">
            <button className="secondary-button" type="button">
              <Icon name="download" />
              Exportar
            </button>
            <button className="orange-button" type="button" onClick={() => navigateTo('/products/create')}>
              <Icon name="plus" />
              Nuevo producto
            </button>
          </div>
        </header>

        <section className="stats-grid" aria-label="Resumen del inventario">
          <StatCard color="blue" icon="file" label="Total de productos" value={stats.total} caption="En el catalogo" />
          <StatCard color="green" icon="trend" label="Activos" value={stats.active} caption="Productos activos" />
          <StatCard color="orange" icon="alert" label="Agotados" value={stats.exhausted} caption="Sin stock disponible" />
        </section>

        <section className="inventory-card" aria-label="Inventario de productos">
          <div className="filters-row">
            <label className="search-field">
              <Icon name="search" />
              <input
                aria-label="Buscar producto"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar producto, codigo o categoria..."
              />
            </label>

            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Categoria">
              {categories.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>

            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Estado">
              <option>Todos los estados</option>
              <option>Activo</option>
              <option>Agotado</option>
            </select>

            <button className="secondary-button filter-button" type="button">
              <Icon name="filter" />
              Filtros
            </button>
          </div>

          {notice ? <p className="inventory-notice">{notice}</p> : null}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Producto</th>
                  <th>Categoria</th>
                  <th>Presentacion</th>
                  <th>Stock actual</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.code}>
                    <td>{product.code}</td>
                    <td>
                      <strong>{product.name}</strong>
                      <span>{product.description}</span>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.presentation}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-pill ${product.status === 'Activo' ? 'status-active' : 'status-empty'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <ActionButton
                          icon="eye"
                          label={`Ver ${product.name}`}
                          onClick={() => handleAction('Detalle del producto', product)}
                        />
                        <ActionButton
                          icon="edit"
                          label={`Editar ${product.name}`}
                          onClick={() => handleAction('Editar producto', product)}
                        />
                        <ActionButton
                          icon="trash"
                          label={`Eliminar ${product.name}`}
                          onClick={() => handleDelete(product)}
                        />
                        <ActionButton
                          icon="dots"
                          label={`Mas acciones para ${product.name}`}
                          onClick={() => handleAction('Mas acciones', product)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <p>
              Mostrando {filteredProducts.length === 0 ? 0 : 1} a {filteredProducts.length} de{' '}
              {products.length} productos
            </p>
            <div className="pagination">
              <button type="button" aria-label="Pagina anterior">
                <Icon name="arrowLeft" />
              </button>
              <button className="page-current" type="button">
                1
              </button>
              <button type="button" aria-label="Pagina siguiente">
                <Icon name="arrowRight" />
              </button>
            </div>
          </footer>
        </section>
      </section>
    </MainLayout>
  );
}
