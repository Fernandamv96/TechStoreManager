function formatearPrecio(valor) {
  if (typeof valor !== "number") return valor;
  return valor.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  });
}

function IconoEditar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

function IconoEliminar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" />
    </svg>
  );
}

function Producto({ producto, onEditar, onEliminar }) {
  const stockClass =
    producto.stock === 0
      ? "stock-agotado"
      : producto.stock < 5
      ? "stock-bajo"
      : "stock-ok";

  return (
    <tr className="fila-producto">
      <td data-label="ID">
        <span className="id-cell">#{String(producto.id).padStart(3, "0")}</span>
      </td>
      <td data-label="Nombre" className="nombre-cell">
        {producto.nombre}
      </td>
      <td data-label="Categoría">
        <span className="chip">{producto.categoria}</span>
      </td>
      <td data-label="Precio" className="precio-cell">
        {formatearPrecio(producto.precio)}
      </td>
      <td data-label="Stock">
        <span className={`stock-badge ${stockClass}`}>{producto.stock}</span>
      </td>
      <td data-label="Acciones">
        <div className="acciones-tabla">
          <button
            type="button"
            className="btn-icon-edit"
            onClick={() => onEditar(producto)}
            title="Editar"
            aria-label={`Editar ${producto.nombre}`}
          >
            <IconoEditar />
          </button>
          <button
            type="button"
            className="btn-icon-delete"
            onClick={() => onEliminar(producto.id)}
            title="Eliminar"
            aria-label={`Eliminar ${producto.nombre}`}
          >
            <IconoEliminar />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default Producto;
