// =====================================================
//  middlewares/logger.js
//  Muestra por consola: método HTTP, ruta y fecha/hora
//  Formato: GET /productos
//            07-07-2026 15:30
// =====================================================

function formatearFecha(d = new Date()) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
}

function logger(req, res, next) {
  const lineaMetodo = `${req.method} ${req.originalUrl}`;
  const lineaFecha = formatearFecha();
  console.log("\n┌─────────────────────────────────────────────");
  console.log(`│  ${lineaMetodo}`);
  console.log(`│  ${lineaFecha}`);
  console.log("└─────────────────────────────────────────────");
  next();
}

module.exports = logger;
