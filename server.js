const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.static("public"));

// Base de datos en memoria (por ahora)
const devices = new Map(); // device_id -> data

// Recibir datos de la ESP32
app.post("/telemetry", (req, res) => {
  const { device_id, sensor } = req.body;

  if (!device_id) {
    return res.status(400).json({ error: "device_id es requerido" });
  }

  if (!devices.has(device_id)) {
    devices.set(device_id, { lastUpdate: new Date(), data: {} });
  }

  devices.get(device_id).lastUpdate = new Date();
  devices.get(device_id).data.sensor = sensor;

  // Enviar a todos los dashboards conectados
  io.emit("telemetry", { device_id, sensor });

  console.log(`Datos de ${device_id}: sensor = ${sensor}`);
  res.json({ ok: true });
});

// Enviar comando a un dispositivo específico
app.post("/command", (req, res) => {
  const { device_id, command } = req.body;

  if (!device_id || command === undefined) {
    return res.status(400).json({ error: "device_id y command son requeridos" });
  }

  io.emit("command", { device_id, command });

  console.log(`Comando para ${device_id}: ${command}`);
  res.json({ ok: true });
});

// Ver todos los dispositivos
app.get("/devices", (req, res) => {
  res.json(Object.fromEntries(devices));
});

io.on("connection", (socket) => {
  console.log("Dashboard conectado");
  socket.on("disconnect", () => {
    console.log("Dashboard desconectado");
  });
});

server.listen(4000, () => {
  console.log("Servidor corriendo en puerto 4000");
});