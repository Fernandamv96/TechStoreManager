// =====================================================
//  api/index.js
//  Función serverless del proyecto full stack en Vercel.
//  Reutiliza la app Express del backend; vercel.json
//  redirige /productos y /productos/:id hacia aquí.
// =====================================================

module.exports = require("../backend-techstore/server.js");
