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
// Dev: abierto a todos. Prod: recomendamos restringir al dominio del
// frontend pasando FRONTEND_URL como env var en Vercel.
//   const allowedOrigins = (process.env.FRONTEND_URL || "")
//     .split(",")
//     .map(s => s.trim())
//     .filter(Boolean);
//   app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.use(cors());

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
  res
    .status(500)
    .json({ mensaje: "Error interno del servidor.", detalle: err.message });
});

// ---------- Arranque local ----------
// En Vercel, process.env.VERCEL === "1" → NO se llama listen().
// Vercel envuelve la app exportada como serverless function.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("\n===============================================");
    console.log(" TechStore Manager API");
    console.log(` Ejecutándose en http://localhost:${PORT}`);
    console.log("===============================================\n");
  });
}

module.exports = app;
