import { useState, useEffect, useRef, useCallback } from "react";

import Navbar from "./components/Navbar.jsx";
import FormularioProducto from "./components/FormularioProducto.jsx";
import TablaProductos from "./components/TablaProductos.jsx";
import Footer from "./components/Footer.jsx";
import Stats from "./components/Stats.jsx";
import ToastContainer from "./components/Toast.jsx";

import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "./services/api.js";

import "./styles/App.css";

const PRODUCTO_VACIO = {
  id: null,
  nombre: "",
  categoria: "",
  precio: "",
  stock: ""
};

let toastId = 0;

function App() {
  const [productos, setProductos] = useState([]);
  const [productoEnEdicion, setProductoEnEdicion] = useState(PRODUCTO_VACIO);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef({});

  // ============== Toasts ==============
  const mostrarToast = useCallback((tipo, mensaje) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, tipo, mensaje }]);
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
    }
    timeoutsRef.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete timeoutsRef.current[id];
    }, 4500);
  }, []);

  const cerrarToast = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
  }, []);

  // ============== Carga de datos ==============
  useEffect(() => {
    cargarProductos();
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cargarProductos() {
    try {
      setCargando(true);
      const data = await listarProductos();
      setProductos(data);
    } catch (err) {
      mostrarToast("error", err.message);
    } finally {
      // pequeño delay para que se vea el skeleton (UX premium)
      setTimeout(() => setCargando(false), 350);
    }
  }

  // ============== Form ==============
  function handleChangeCampo(e) {
    const { name, value } = e.target;
    setProductoEnEdicion(prev => ({ ...prev, [name]: value }));
  }

  function handleCancelar() {
    setProductoEnEdicion(PRODUCTO_VACIO);
    setModoEdicion(false);
    mostrarToast("info", "Edición cancelada.");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      nombre: productoEnEdicion.nombre,
      categoria: productoEnEdicion.categoria,
      precio: productoEnEdicion.precio,
      stock: productoEnEdicion.stock
    };
    try {
      setCargando(true);
      if (modoEdicion) {
        await actualizarProducto(productoEnEdicion.id, payload);
        mostrarToast("exito", `"${payload.nombre}" se actualizó correctamente.`);
      } else {
        await crearProducto(payload);
        mostrarToast("exito", `"${payload.nombre}" se agregó al inventario.`);
      }
      setProductoEnEdicion(PRODUCTO_VACIO);
      setModoEdicion(false);
      await cargarProductos();
    } catch (err) {
      mostrarToast("error", err.message);
    } finally {
      setCargando(false);
    }
  }

  // ============== Acciones tabla ==============
  function handleEditar(producto) {
    setProductoEnEdicion({
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: String(producto.precio),
      stock: String(producto.stock)
    });
    setModoEdicion(true);
    mostrarToast("info", `Editando #${String(producto.id).padStart(3, "0")} — ${producto.nombre}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleEliminar(id) {
    const producto = productos.find(p => p.id === id);
    const ok = window.confirm(
      `¿Eliminar "${producto?.nombre || `producto #${id}`}"? Esta acción no se puede deshacer.`
    );
    if (!ok) return;
    try {
      setCargando(true);
      await eliminarProducto(id);
      mostrarToast("exito", `Producto eliminado del inventario.`);
      if (modoEdicion && productoEnEdicion.id === id) handleCancelar();
      await cargarProductos();
    } catch (err) {
      mostrarToast("error", err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="app" id="top">
      <Navbar totalProductos={productos.length} cargando={cargando} />

      <ToastContainer toasts={toasts} onClose={cerrarToast} />

      <header className="hero">
        <div className="hero-badge">
          <span className="dot" />
          <span>API conectada · http://localhost:3000</span>
        </div>
        <h1 className="hero-title">
          <span className="gradient-text">TechStore</span> Manager
        </h1>
        <p className="hero-subtitle">
          Sistema <strong>full stack</strong> para administrar el inventario
          de productos. Construido con{" "}
          <strong>React + Express</strong>.
        </p>
      </header>

      <main className="bento">
        {/* === Formulario === */}
        <section className="card bento-form">
          <div className="card-titulo">
            <div className="icon">{modoEdicion ? "✏️" : "✨"}</div>
            <div className="card-titulo-text">
              <span>
                {modoEdicion ? "Editar producto" : "Nuevo producto"}
              </span>
              <span className="subtitulo">
                {modoEdicion
                  ? `Actualizando #${String(productoEnEdicion.id).padStart(3, "0")}`
                  : "Completa los campos para agregar al inventario"}
              </span>
            </div>
          </div>
          <FormularioProducto
            producto={productoEnEdicion}
            modoEdicion={modoEdicion}
            onChange={handleChangeCampo}
            onSubmit={handleSubmit}
            onCancelar={handleCancelar}
            cargando={cargando}
          />
        </section>

        {/* === Stats === */}
        <section className="card bento-stat">
          <div className="card-titulo">
            <div className="icon">📊</div>
            <div className="card-titulo-text">
              <span>Inventario</span>
              <span className="subtitulo">Métricas en tiempo real</span>
            </div>
          </div>
          <Stats productos={productos} />
        </section>

        {/* === Tabla === */}
        <section className="card bento-table">
          <div className="card-titulo">
            <div className="icon">📦</div>
            <div className="card-titulo-text">
              <span>Catálogo de productos</span>
              <span className="subtitulo">
                Busca, ordena, edita o elimina cualquier producto
              </span>
            </div>
          </div>
          <TablaProductos
            productos={productos}
            cargando={cargando}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
