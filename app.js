//Hola a todos como estamos 55555misnafipnfaisnfkasfnklsafnaslknlknsaflkaslfnaslkfsfnlk//
let ultimoAcceso = { uid: '', estado: '' };
const express = require("express");
const fs = require("fs");
const path = require("path");

// Importar desde serialport v10+
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const app = express();
const PORT = 3000;

// Cambia "COM3" por el puerto real de tu Arduino
const port = new SerialPort({
  path: "COM6",  // 👈 CAMBIA esto si es necesario
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
  if (!data || data.includes("Listo para leer tarjetas")) return; 
  const tarjetasPermitidas = ["027DB8DEB6E000", "E789B56B", "9F3D8CE6","A779C86D", "08DEC7FC"];
  const now = new Date().toLocaleString();

  if (tarjetasPermitidas.includes(data)) {
    fs.appendFileSync("asistencias.txt", `${now} - ${data}\n`);
    ultimoAcceso = { uid: data, estado: "permitido" };
    console.log(`✅ Asistencia registrada: ${data}`);
  } else {
    ultimoAcceso = { uid: data, estado: "denegado" };
    console.log(`🚫 UID no autorizado: ${data}`);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get('/api/asistencias', (req, res) => {
  fs.readFile('asistencias.txt', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo');
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/api/ultimo-acceso', (req, res) => {
  res.json(ultimoAcceso);
});
