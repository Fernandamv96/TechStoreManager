import { useMemo, useState } from "react";
import Producto from "./Producto.jsx";
import "../styles/TablaProductos.css";

const COLUMNAS = [
  { key: "id", label: "ID", sortable: true },
  { key: "nombre", label: "Nombre", sortable: true },
  { key: "categoria", label: "Categoría", sortable: true },
  { key: "precio", label: "Precio", sortable: true },
  { key: "stock", label: "Stock", sortable: true },
  { key: null, label: "Acciones", sortable: false }
];

function IconoLupa() {
  return (
    <svg
      className="lupa"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function SkeletonRow({ idx }) {
  return (
    <tr className="skeleton-row" key={idx}>
      <td>
        <div className="skeleton id" />
      </td>
      <td>
        <div className="skeleton nombre" />
      </td>
      <td>
        <div className="skeleton chip" />
      </td>
      <td>
        <div className="skeleton precio" />
      </td>
      <td>
        <div className="skeleton stock" />
      </td>
      <td>
        <div className="skeleton" style={{ width: "70px", marginLeft: "auto" }} />
      </td>
    </tr>
  );
}

function TablaProductos({
  productos,
  cargando,
  onEditar,
  onEliminar
}) {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState({ key: "id", dir: "asc" });

  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    let lista = productos;
    if (q) {
      lista = lista.filter(p => {
        const matchId = String(p.id).includes(q);
        const matchNombre = p.nombre.toLowerCase().includes(q);
        const matchCat = p.categoria.toLowerCase().includes(q);
        return matchId || matchNombre || matchCat;
      });
    }
    const { key, dir } = orden;
    const factor = dir === "asc" ? 1 : -1;
    return [...lista].sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * factor;
      }
      return String(va).localeCompare(String(vb), "es", { numeric: true }) * factor;
    });
  }, [productos, busqueda, orden]);

  function handleSort(key) {
    setOrden(prev => {
      if (prev.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  }

  return (
    <div className="tabla-wrapper">
      <div className="tabla-header">
        <div className="tabla-filtros">
          <div className="buscar-wrap">
            <IconoLupa />
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o id…"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              aria-label="Buscar productos"
            />
            {busqueda && (
              <button
                type="button"
                className="limpiar"
                onClick={() => setBusqueda("")}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="tabla-contenedor">
          <table className="tabla-productos">
            <thead>
              <tr>
                {COLUMNAS.map((c, i) => (
                  <th key={i}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map(i => (
                <SkeletonRow key={i} idx={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="tabla-vacia">
          <div className="tabla-vacia-icon">📭</div>
          <h3>
            {busqueda
              ? "Sin coincidencias"
              : "No hay productos en el inventario"}
          </h3>
          <p>
            {busqueda
              ? `No encontramos productos para "${busqueda}"`
              : "Agrega uno desde el formulario para comenzar."}
          </p>
        </div>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla-productos">
            <thead>
              <tr>
                {COLUMNAS.map((c, i) => {
                  if (!c.sortable) {
                    return (
                      <th key={i} style={{ textAlign: "right" }}>
                        {c.label}
                      </th>
                    );
                  }
                  const active = orden.key === c.key;
                  return (
                    <th
                      key={i}
                      className={`sortable ${active ? "active" : ""}`}
                      onClick={() => handleSort(c.key)}
                    >
                      {c.label}
                      <span className="sort-icon">
                        {active ? (orden.dir === "asc" ? "▲" : "▼") : "⇅"}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map(p => (
                <Producto
                  key={p.id}
                  producto={p}
                  onEditar={onEditar}
                  onEliminar={onEliminar}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!cargando && productosFiltrados.length > 0 && (
        <div className="tabla-footer">
          <span>
            Mostrando <strong>{productosFiltrados.length}</strong> de{" "}
            <strong>{productos.length}</strong> productos
          </span>
          {busqueda && (
            <span>
              Filtrado por: <strong>"{busqueda}"</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default TablaProductos;
