const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.json());
app.use(express.static("public"));

// Base de datos en memoria (por ahora)
const vehicles = new Map(); // device_id -> data

// Ruta para recibir datos de la ESP32
app.post("/telemetry", (req, res) => {
    const { device_id, data } = req.body;

    if (!device_id) {
        return res.status(400).send({ error: "device_id requerido" });
    }

    // Guardar datos del vehículo
    if (!vehicles.has(device_id)) {
        vehicles.set(device_id, {});
    }

    vehicles.get(device_id).lastUpdate = new Date();
    vehicles.get(device_id).sensorData = data;

    // Emitir a todos los dashboards conectados
    io.emit("telemetry", { device_id, data });

    console.log(`Datos recibidos de ${device_id}:`, data);
    res.send({ ok: true });
});

// Ruta para enviar comandos a un dispositivo específico
app.post("/command", (req, res) => {
    const { device_id, command } = req.body;

    if (!device_id || !command) {
        return res.status(400).send({ error: "device_id y command requeridos" });
    }

    // Emitir comando solo al dispositivo objetivo
    io.emit("command", { device_id, command });

    console.log(`Comando enviado a ${device_id}:`, command);
    res.send({ ok: true });
});

app.get("/vehicles", (req, res) => {
    res.json(Object.fromEntries(vehicles));
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