// =====================================================
//  routes/productos.routes.js
//  Definición de endpoints del recurso /productos
// =====================================================

const express = require("express");
const router = express.Router();

const {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require("../controllers/productos.controller.js");

// GET /productos           → listar todos
router.get("/", obtenerProductos);

// GET /productos/:id       → buscar por id
router.get("/:id", obtenerProductoPorId);

// POST /productos          → crear
router.post("/", crearProducto);

// PUT /productos/:id       → actualizar
router.put("/:id", actualizarProducto);

// DELETE /productos/:id    → eliminar
router.delete("/:id", eliminarProducto);

module.exports = router;
