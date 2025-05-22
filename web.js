const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
app.use(express.static('public'));

// Servir archivos estáticos (HTML)
app.use(express.static('public'));

// Ruta para obtener el contenido de asistencias.txt
app.get('/api/asistencias', (req, res) => {
  fs.readFile('asistencias.txt', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo');
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor web activo en http://localhost:${PORT}`);
});
