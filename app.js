const express = require("express");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const app = express();
const PORT = 3000;

// Puerto serie
const port = new SerialPort({
  path: "COM16",
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// Variables de estado
let ultimoAcceso = { uid: '', estado: '' };
let ultimoUIDProcesado = '';
const tarjetasPermitidas = {
  "76F1B105": "David Arturo Franco Pacheco",
  "C7F9AF05": "Gabriel Santiago Escobar Hernández",
  "CBECB105": "Gustavo José Ortíz Vega",
  "6B61CD05": "Dania Beticia Lémus Sagastume",
  "47F7B005": "Kevin Dagoberto Guerra Giron",
  "ED19CD05": "Andrea Natalia Abigail Morales Brito",
};

// Google Sheets Config
const SHEET_ID = "1U-JxZuIeY3ULEft_AroVdmu01yqRzabh9_oz4O7_r8U";
const SHEET_NAME = "Hoja 1";
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "credentials.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

async function agregarFilaAGoogleSheets(uid, nombre, estado) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  const fecha = new Date().toLocaleString("es-MX");
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:D`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[uid, nombre, fecha, estado.toUpperCase()]]
    }
  });
}

parser.on("data", async (data) => {
  if (!data || data.includes("Listo para leer tarjetas")) return;
  if (data === ultimoUIDProcesado) return;

  const now = new Date().toLocaleString("es-MX");
  const nombre = tarjetasPermitidas[data];

  if (nombre) {
    fs.appendFileSync("asistencias.txt", `${now} - ${data}\n`);
    ultimoAcceso = { uid: data, estado: "permitido", nombre, timestamp: new Date().toISOString() };
    console.log(`✅ Acceso permitido: ${data} (${nombre})`);
    await agregarFilaAGoogleSheets(data, nombre, "permitido");
  } else {
    ultimoAcceso = { uid: data, estado: "denegado", timestamp: new Date().toISOString() };
    console.log(`🚫 Acceso denegado: ${data}`);
    await agregarFilaAGoogleSheets(data, "Desconocido", "denegado");
  }

  ultimoUIDProcesado = data;
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/asistencias", (req, res) => {
  fs.readFile("asistencias.txt", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");
    res.send(data);
  });
});

app.get("/api/ultimo-acceso", (req, res) => {
  res.json(ultimoAcceso);
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});
