const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const fs = require('fs');

// Cambia COM3 por tu puerto (en Linux suele ser /dev/ttyUSB0)
const port = new SerialPort('COM3', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

console.log('Esperando tarjetas RFID...');

parser.on('data', (uid) => {
  console.log(`Tarjeta detectada: ${uid}`);

  const now = new Date();
  const timestamp = now.toISOString();
  const entry = `${timestamp} - UID: ${uid}\n`;

  fs.appendFile('asistencias.txt', entry, (err) => {
    if (err) console.error('Error al guardar asistencia:', err);
    else console.log('Asistencia guardada.');
  });
});
