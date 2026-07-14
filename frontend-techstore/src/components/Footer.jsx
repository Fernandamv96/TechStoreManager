import "../styles/Footer.css";

function Footer() {
  const fechaActual = new Date().toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-mini" />
          <span>
            TechStore <span className="gradient-text">Manager</span>
          </span>
        </div>
        <p className="footer-meta">
          Diseñado y desarrollado por <strong>Daniela Muñoz</strong> ·{" "}
          {fechaActual}
        </p>
        <p className="footer-asignatura">
          Evaluación Sumativa 4 · Programación Front End (TI 3031)
        </p>
      </div>
    </footer>
  );
}

export default Footer;
