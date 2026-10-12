// Tests de la API con node:test + fetch nativo (sin dependencias extra).
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const app = require("../server.js");

let server;
let base;

before(async () => {
  server = app.listen(0);
  await new Promise(resolve => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

const json = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

test("GET /productos lista productos", async () => {
  const res = await fetch(`${base}/productos`);
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(await res.json()));
});

test("CRUD completo: crear, leer, actualizar y eliminar", async () => {
  const creado = await fetch(`${base}/productos`, json("POST", {
    nombre: "Teclado", categoria: "Periféricos", precio: 19990, stock: 5,
  }));
  assert.equal(creado.status, 201);
  const { id } = await creado.json().then(b => b.producto ?? b);
  assert.ok(Number.isInteger(id));

  const leido = await fetch(`${base}/productos/${id}`);
  assert.equal(leido.status, 200);

  const actualizado = await fetch(`${base}/productos/${id}`, json("PUT", { stock: 9 }));
  assert.equal(actualizado.status, 200);

  const borrado = await fetch(`${base}/productos/${id}`, { method: "DELETE" });
  assert.equal(borrado.status, 200);
  assert.equal((await fetch(`${base}/productos/${id}`)).status, 404);
});

test("rechaza productos inválidos con 400", async () => {
  const res = await fetch(`${base}/productos`, json("POST", {
    nombre: "", categoria: "X", precio: -1, stock: -2,
  }));
  assert.equal(res.status, 400);
  const { mensaje } = await res.json();
  assert.match(mensaje, /nombre/);
  assert.match(mensaje, /precio/);
});

test("id no numérico → 400; ruta inexistente → 404", async () => {
  assert.equal((await fetch(`${base}/productos/abc`)).status, 400);
  assert.equal((await fetch(`${base}/no-existe`)).status, 404);
});

test("JSON malformado → 400 sin stack trace", async () => {
  const res = await fetch(`${base}/productos`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{malo",
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.mensaje, "Solicitud inválida.");
  assert.doesNotMatch(JSON.stringify(body), /\\n\s+at /); // sin líneas de stack trace (en JSON los saltos van escapados)
});

test("no expone X-Powered-By", async () => {
  const res = await fetch(`${base}/`);
  assert.equal(res.headers.get("x-powered-by"), null);
});
