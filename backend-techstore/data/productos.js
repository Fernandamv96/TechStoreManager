// =====================================================
//  data/productos.js
//  Capa de datos (en memoria). Simula una "base de datos"
//  de productos para TechStore SPA.
// =====================================================

let productos = [
  {
    id: 1,
    nombre: "Notebook Gamer ASUS ROG",
    categoria: "Computación",
    precio: 1299990,
    stock: 8
  },
  {
    id: 2,
    nombre: "Mouse Logitech G502 Hero",
    categoria: "Periféricos",
    precio: 49990,
    stock: 25
  },
  {
    id: 3,
    nombre: "Teclado Mecánico Razer Huntsman",
    categoria: "Periféricos",
    precio: 139990,
    stock: 12
  },
  {
    id: 4,
    nombre: "Monitor LG UltraGear 27\" 144Hz",
    categoria: "Monitores",
    precio: 349990,
    stock: 6
  },
  {
    id: 5,
    nombre: "Auriculares HyperX Cloud II",
    categoria: "Audio",
    precio: 89990,
    stock: 15
  }
];

// Genera un nuevo id correlativo
function nextId() {
  return productos.length === 0
    ? 1
    : Math.max(...productos.map(p => p.id)) + 1;
}

module.exports = { productos, nextId };
