function formatPrecio(valor) {
  if (typeof valor !== "number") return "0";
  if (valor >= 1_000_000) return `$${(valor / 1_000_000).toFixed(1)}M`;
  if (valor >= 1_000) return `$${(valor / 1_000).toFixed(0)}K`;
  return `$${valor}`;
}

function Stats({ productos }) {
  const total = productos.length;
  const stockTotal = productos.reduce((acc, p) => acc + (p.stock || 0), 0);
  const valorTotal = productos.reduce(
    (acc, p) => acc + (p.precio || 0) * (p.stock || 0),
    0
  );
  const stockBajo = productos.filter(p => p.stock < 5).length;
  const categorias = new Set(productos.map(p => p.categoria)).size;

  return (
    <div className="stats-grid">
      <div
        className="stat"
        style={{ "--grad": "var(--grad-cyan)" }}
        title="Total de productos en el inventario"
      >
        <div className="stat-label">Total</div>
        <div className="stat-value">{total}</div>
        <div className="stat-trend">productos</div>
      </div>
      <div
        className="stat"
        style={{ "--grad": "var(--grad-purple)" }}
        title="Suma del stock disponible"
      >
        <div className="stat-label">Stock</div>
        <div className="stat-value">{stockTotal}</div>
        <div className="stat-trend">unidades</div>
      </div>
      <div
        className="stat"
        style={{ "--grad": "var(--grad-lime)" }}
        title="Valor total del inventario (precio × stock)"
      >
        <div className="stat-label">Valor</div>
        <div className="stat-value">{formatPrecio(valorTotal)}</div>
        <div className="stat-trend">CLP</div>
      </div>
      <div
        className="stat"
        style={{ "--grad": "var(--grad-amber)" }}
        title="Productos con stock crítico (menor a 5)"
      >
        <div className="stat-label">Stock bajo</div>
        <div className="stat-value">{stockBajo}</div>
        <div className="stat-trend">alertas</div>
      </div>
      <div
        className="stat"
        style={{ "--grad": "var(--grad-pink)" }}
        title="Cantidad de categorías distintas"
      >
        <div className="stat-label">Categorías</div>
        <div className="stat-value">{categorias}</div>
        <div className="stat-trend">diferentes</div>
      </div>
      <div
        className="stat"
        style={{ "--grad": "var(--grad-primary)" }}
        title="Precio promedio"
      >
        <div className="stat-label">Promedio</div>
        <div className="stat-value">
          {formatPrecio(
            total === 0 ? 0 : Math.round(valorTotal / Math.max(stockTotal, 1))
          )}
        </div>
        <div className="stat-trend">por unidad</div>
      </div>
    </div>
  );
}

export default Stats;
