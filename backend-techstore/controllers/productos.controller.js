// =====================================================
//  controllers/productos.controller.js
//  Lógica de negocio + validaciones del CRUD
// =====================================================

const { productos, nextId } = require("../data/productos.js");

// ---------- Helpers de validación ----------
function validarProducto(body, { parcial = false } = {}) {
  const errores = [];

  // En PUT (parcial) permitimos que no vengan todos los campos,
  // pero si vienen, deben cumplir las reglas.
  const nombre =
    body.nombre !== undefined ? String(body.nombre).trim() : undefined;
  const categoria =
    body.categoria !== undefined ? String(body.categoria).trim() : undefined;
  const precio = body.precio !== undefined ? Number(body.precio) : undefined;
  const stock = body.stock !== undefined ? Number(body.stock) : undefined;

  // Regla: nombre no vacío
  if (nombre !== undefined) {
    if (nombre.length === 0) {
      errores.push("El nombre no puede estar vacío.");
    }
  } else if (!parcial) {
    errores.push("El nombre es obligatorio.");
  }

  // Regla: categoría no vacía
  if (categoria !== undefined) {
    if (categoria.length === 0) {
      errores.push("La categoría no puede estar vacía.");
    }
  } else if (!parcial) {
    errores.push("La categoría es obligatoria.");
  }

  // Regla: precio > 0 y numérico
  if (precio !== undefined) {
    if (Number.isNaN(precio)) {
      errores.push("El precio debe ser un número.");
    } else if (precio <= 0) {
      errores.push("El precio debe ser mayor a 0.");
    }
  } else if (!parcial) {
    errores.push("El precio es obligatorio.");
  }

  // Regla: stock >= 0 y numérico
  if (stock !== undefined) {
    if (Number.isNaN(stock)) {
      errores.push("El stock debe ser un número.");
    } else if (stock < 0) {
      errores.push("El stock no puede ser negativo.");
    }
  } else if (!parcial) {
    errores.push("El stock es obligatorio.");
  }

  return {
    errores,
    limpio: { nombre, categoria, precio, stock }
  };
}

// ---------- Controladores ----------

// GET /productos  → listar todos
function obtenerProductos(req, res) {
  try {
    return res.status(200).json(productos);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    return res
      .status(500)
      .json({ mensaje: "Error interno al obtener los productos." });
  }
}

// GET /productos/:id  → buscar por id
function obtenerProductoPorId(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ mensaje: "El id debe ser un número entero." });
    }
    const producto = productos.find(p => p.id === id);
    if (!producto) {
      return res
        .status(404)
        .json({ mensaje: `Producto con id ${id} no encontrado.` });
    }
    return res.status(200).json(producto);
  } catch (err) {
    console.error("Error al obtener producto por id:", err);
    return res
      .status(500)
      .json({ mensaje: "Error interno al buscar el producto." });
  }
}

// POST /productos  → crear
function crearProducto(req, res) {
  try {
    const { errores, limpio } = validarProducto(req.body, { parcial: false });
    if (errores.length > 0) {
      return res.status(400).json({ mensaje: errores.join(" ") });
    }
    const nuevo = {
      id: nextId(),
      nombre: limpio.nombre,
      categoria: limpio.categoria,
      precio: limpio.precio,
      stock: limpio.stock
    };
    productos.push(nuevo);
    return res.status(201).json({
      mensaje: "Producto creado correctamente.",
      producto: nuevo
    });
  } catch (err) {
    console.error("Error al crear producto:", err);
    return res
      .status(500)
      .json({ mensaje: "Error interno al crear el producto." });
  }
}

// PUT /productos/:id  → actualizar
function actualizarProducto(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ mensaje: "El id debe ser un número entero." });
    }
    const idx = productos.findIndex(p => p.id === id);
    if (idx === -1) {
      return res
        .status(404)
        .json({ mensaje: `Producto con id ${id} no encontrado.` });
    }

    const { errores, limpio } = validarProducto(req.body, { parcial: true });
    if (errores.length > 0) {
      return res.status(400).json({ mensaje: errores.join(" ") });
    }

    const actualizado = { ...productos[idx] };
    if (limpio.nombre !== undefined) actualizado.nombre = limpio.nombre;
    if (limpio.categoria !== undefined) actualizado.categoria = limpio.categoria;
    if (limpio.precio !== undefined) actualizado.precio = limpio.precio;
    if (limpio.stock !== undefined) actualizado.stock = limpio.stock;

    productos[idx] = actualizado;
    return res.status(200).json({
      mensaje: "Producto actualizado correctamente.",
      producto: actualizado
    });
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    return res
      .status(500)
      .json({ mensaje: "Error interno al actualizar el producto." });
  }
}

// DELETE /productos/:id  → eliminar
function eliminarProducto(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ mensaje: "El id debe ser un número entero." });
    }
    const idx = productos.findIndex(p => p.id === id);
    if (idx === -1) {
      return res
        .status(404)
        .json({ mensaje: `Producto con id ${id} no encontrado.` });
    }
    const eliminado = productos.splice(idx, 1)[0];
    return res.status(200).json({
      mensaje: "Producto eliminado correctamente.",
      producto: eliminado
    });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    return res
      .status(500)
      .json({ mensaje: "Error interno al eliminar el producto." });
  }
}

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
