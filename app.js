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
  path: "COM3",  // 👈 CAMBIA esto si es necesario
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
  const tarjetasPermitidas = ["AB12CD34", "11223344", "A1B2C3D4"];
  const now = new Date().toLocaleString();

  if (tarjetasPermitidas.includes(data)) {
    fs.appendFileSync("asistencias.txt", `${now} - ${data}\n`);
    console.log(`✅ Asistencia registrada: ${data}`);
  } else {
    console.log(`🚫 UID no autorizado: ${data}`);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});
