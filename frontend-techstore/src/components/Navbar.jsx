import "../styles/Navbar.css";

function Navbar({ totalProductos = 0, cargando = false }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a className="navbar-brand" href="#top">
          <div className="navbar-logo" aria-label="TechStore">
            T
          </div>
          <div className="navbar-text">
            <span className="navbar-titulo">TechStore Manager</span>
            <span className="navbar-subtitulo">Admin · v1.0</span>
          </div>
        </a>

        <div className="navbar-info">
          <div className="navbar-counter" title="Total de productos en el inventario">
            <span>📦</span>
            <strong>{cargando ? "—" : totalProductos}</strong>
            <span style={{ color: "var(--text-muted)" }}>productos</span>
          </div>
          <div className="navbar-status" title="API conectada">
            <span className="pulse" />
            <span>En línea</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
