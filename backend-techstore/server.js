// =====================================================
//  server.js
//  Punto de entrada del backend TechStore Manager
//  - En Vercel: se exporta `app` y Vercel lo envuelve como
//    serverless function (no se llama a listen()).
//  - En local : se levanta con app.listen() como siempre.
// =====================================================

const express = require("express");
const cors = require("cors");
const logger = require("./middlewares/logger.js");
const productosRoutes = require("./routes/productos.routes.js");

const app = express();

// ---------- CORS ----------
// Si FRONTEND_URL está definida (una o varias URLs separadas por coma),
// solo esos orígenes pueden llamar a la API. Si no, se permite cualquiera
// (cómodo en desarrollo; en producción conviene definir FRONTEND_URL).
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.disable("x-powered-by");

// ---------- Middlewares globales ----------
app.use(express.json());    // Parseo de body en JSON
app.use(logger);            // Logger: método, ruta, fecha/hora

// ---------- Rutas ----------
app.get("/", (req, res) => {
  res.json({
    sistema: "TechStore Manager API",
    version: "1.0.0",
    entorno: process.env.VERCEL ? "vercel-serverless" : "local",
    endpoints: {
      listar: "GET /productos",
      buscar: "GET /productos/:id",
      crear: "POST /productos",
      actualizar: "PUT /productos/:id",
      eliminar: "DELETE /productos/:id"
    }
  });
});

app.use("/productos", productosRoutes);

// ---------- 404 para rutas no definidas ----------
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada." });
});

// ---------- Manejo global de errores ----------
app.use((err, req, res, _next) => {
  console.error("Error no controlado:", err);
  const status = err.status || err.statusCode || 500;
  const body = { mensaje: status === 400 ? "Solicitud inválida." : "Error interno del servidor." };
  // El detalle solo se expone fuera de producción (evita filtrar información interna)
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) body.detalle = err.message;
  res.status(status).json(body);
});

// ---------- Arranque local ----------
// Solo se llama listen() al ejecutar `node server.js` directamente.
// En Vercel (y en los tests) la app se importa y se envuelve/usa sin listen().
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("\n===============================================");
    console.log(" TechStore Manager API");
    console.log(` Ejecutándose en http://localhost:${PORT}`);
    console.log("===============================================\n");
  });
}

module.exports = app;
