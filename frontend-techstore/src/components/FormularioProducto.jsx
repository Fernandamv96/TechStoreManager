import { useState } from "react";
import "../styles/FormularioProducto.css";

function FormularioProducto({
  producto,
  modoEdicion,
  onChange,
  onSubmit,
  onCancelar,
  cargando
}) {
  const [errores, setErrores] = useState({});

  function validar() {
    const nuevos = {};
    if (!producto.nombre || producto.nombre.trim() === "") {
      nuevos.nombre = "El nombre es obligatorio.";
    } else if (producto.nombre.trim().length < 2) {
      nuevos.nombre = "Mínimo 2 caracteres.";
    }

    if (!producto.categoria || producto.categoria.trim() === "") {
      nuevos.categoria = "La categoría es obligatoria.";
    }

    const precio = Number(producto.precio);
    if (producto.precio === "" || producto.precio === null) {
      nuevos.precio = "El precio es obligatorio.";
    } else if (Number.isNaN(precio)) {
      nuevos.precio = "Debe ser un número.";
    } else if (precio <= 0) {
      nuevos.precio = "Debe ser mayor a 0.";
    }

    const stock = Number(producto.stock);
    if (producto.stock === "" || producto.stock === null) {
      nuevos.stock = "El stock es obligatorio.";
    } else if (Number.isNaN(stock)) {
      nuevos.stock = "Debe ser un número.";
    } else if (stock < 0) {
      nuevos.stock = "No puede ser negativo.";
    }

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;
    onSubmit(e);
  }

  return (
    <form className="form-producto" onSubmit={handleSubmit} noValidate>
      <div className="fila-form">
        <div className="campo">
          <label htmlFor="nombre">
            <svg
              className="icono"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 7h-9l-2-3H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
            </svg>
            Nombre
          </label>
          <div className="input-wrap sin-prefijo">
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={producto.nombre}
              onChange={onChange}
              placeholder="Notebook Gamer"
              className={errores.nombre ? "input-error" : ""}
            />
          </div>
          {errores.nombre && <span className="msg-error">{errores.nombre}</span>}
        </div>

        <div className="campo">
          <label htmlFor="categoria">
            <svg
              className="icono"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Categoría
          </label>
          <div className="input-wrap sin-prefijo">
            <input
              id="categoria"
              name="categoria"
              type="text"
              value={producto.categoria}
              onChange={onChange}
              placeholder="Periféricos"
              className={errores.categoria ? "input-error" : ""}
            />
          </div>
          {errores.categoria && (
            <span className="msg-error">{errores.categoria}</span>
          )}
        </div>
      </div>

      <div className="fila-form">
        <div className="campo">
          <label htmlFor="precio">
            <svg
              className="icono"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Precio
          </label>
          <div className="input-wrap">
            <span className="prefijo">$</span>
            <input
              id="precio"
              name="precio"
              type="number"
              min="0"
              step="1"
              value={producto.precio}
              onChange={onChange}
              placeholder="49990"
              className={errores.precio ? "input-error" : ""}
            />
          </div>
          {errores.precio && <span className="msg-error">{errores.precio}</span>}
        </div>

        <div className="campo">
          <label htmlFor="stock">
            <svg
              className="icono"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
            </svg>
            Stock
          </label>
          <div className="input-wrap sin-prefijo">
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={producto.stock}
              onChange={onChange}
              placeholder="10"
              className={errores.stock ? "input-error" : ""}
            />
          </div>
          {errores.stock && <span className="msg-error">{errores.stock}</span>}
        </div>
      </div>

      <div className="acciones-form">
        <button
          type="submit"
          className={`btn ${modoEdicion ? "btn-warning" : "btn-primary"}`}
          disabled={cargando}
        >
          {cargando ? (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Procesando…
            </>
          ) : modoEdicion ? (
            <>✓ Actualizar producto</>
          ) : (
            <>+ Agregar producto</>
          )}
        </button>

        {modoEdicion && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancelar}
            disabled={cargando}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default FormularioProducto;
