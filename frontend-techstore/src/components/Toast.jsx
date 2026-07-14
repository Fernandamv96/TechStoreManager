import "../styles/App.css";

function IconoExito() {
  return (
    <svg
      className="toast-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconoError() {
  return (
    <svg
      className="toast-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}

function IconoInfo() {
  return (
    <svg
      className="toast-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

const ICONOS = {
  exito: <IconoExito />,
  error: <IconoError />,
  info: <IconoInfo />
};

const TITULOS = {
  exito: "¡Éxito!",
  error: "Ups, algo salió mal",
  info: "Información"
};

function Toast({ id, tipo, mensaje, onClose }) {
  return (
    <div className={`toast toast-${tipo}`} role="alert">
      {ICONOS[tipo] || ICONOS.info}
      <div className="toast-body">
        <div className="toast-titulo">{TITULOS[tipo] || "Aviso"}</div>
        <div className="toast-mensaje">{mensaje}</div>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={() => onClose(id)}
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>
  );
}

function ToastContainer({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onClose={onClose} />
      ))}
    </div>
  );
}

export default ToastContainer;
