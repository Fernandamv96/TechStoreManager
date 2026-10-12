// =====================================================
//  services/api.js
//  Capa de comunicación con el backend Express.
//  Encapsula Axios para mantener los componentes limpios.
//
//  Configuración:
//    - En Vercel: setear VITE_API_URL en Environment Variables
//      (ej: https://techstore-api.vercel.app)
//    - En local : usa http://localhost:3000 por defecto
//    - Proyecto full stack (raíz del repo): mismo dominio
// =====================================================

import axios from "axios";

// Base del backend. Si no hay VITE_API_URL: en local cae a
// localhost:3000 y en producción usa el mismo dominio.
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3000" : "");

const cliente = axios.create({
  baseURL: `${API_BASE}/productos`,
  headers: { "Content-Type": "application/json" },
  timeout: 8000
});

/**
 * Normaliza la respuesta de error para que siempre llegue
 * un string legible al frontend.
 */
function normalizarError(err) {
  if (err.response && err.response.data && err.response.data.mensaje) {
    return err.response.data.mensaje;
  }
  if (err.code === "ERR_NETWORK") {
    return `No se pudo conectar con el servidor (${API_BASE || window.location.origin}). Verifica que el backend esté en línea.`;
  }
  return err.message || "Error desconocido";
}

// GET /productos
export async function listarProductos() {
  try {
    const { data } = await cliente.get("/");
    return data;
  } catch (err) {
    throw new Error(normalizarError(err));
  }
}

// GET /productos/:id
export async function obtenerProductoPorId(id) {
  try {
    const { data } = await cliente.get(`/${id}`);
    return data;
  } catch (err) {
    throw new Error(normalizarError(err));
  }
}

// POST /productos
export async function crearProducto(producto) {
  try {
    const { data } = await cliente.post("/", producto);
    return data;
  } catch (err) {
    throw new Error(normalizarError(err));
  }
}

// PUT /productos/:id
export async function actualizarProducto(id, cambios) {
  try {
    const { data } = await cliente.put(`/${id}`, cambios);
    return data;
  } catch (err) {
    throw new Error(normalizarError(err));
  }
}

// DELETE /productos/:id
export async function eliminarProducto(id) {
  try {
    const { data } = await cliente.delete(`/${id}`);
    return data;
  } catch (err) {
    throw new Error(normalizarError(err));
  }
}
