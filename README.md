# 📡 Proyecto: Acceso Smart Classroom con RFID + Arduino + Google Sheets

Este sistema registra accesos a un aula inteligente usando un lector RFID conectado a un Arduino. Cada escaneo se refleja en una interfaz web local y se sincroniza automáticamente con una hoja de cálculo de Google Sheets.

---

## 🧰 Requisitos

* Node.js (versión 14+)
* Arduino con lector RFID RC522 (conectado por puerto serie)
* Archivo `credentials` con las credenciales de Google Sheets (OAuth)
* Hoja de cálculo creada con columnas: `UID | NOMBRE | HORA DE ESCANEO | ACCESO`

---

## 📁 Estructura del Proyecto

```
├── app.js               # Servidor principal (web + Arduino + Google Sheets)
├── asistencias.txt      # Historial local
├── public/
│   └── index.html       # Interfaz moderna con historial y sonido
├── credentials          # Credenciales API de Google (renombrado desde .json)
├── package.json         # Dependencias
```

---

## 🚀 Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/davidfp-ltec/arduinojs.git
cd arduinojs
```

2. Instala las dependencias:

```bash
npm install
```

3. Coloca tus credenciales de Google Sheets como `credentials` junto a `app.js`

4. Edita `app.js` para verificar el puerto de tu Arduino (ej. `COM3`, `COM12`, etc.)

---

## ▶️ Ejecutar

```bash
node app.js
```

* Accede a la interfaz en: [http://localhost:3000](http://localhost:3000)
* Los accesos autorizados se muestran en pantalla, se reproducen sonidos y se sincronizan con Google Sheets.

---

## 🧠 Configuración UID y Nombres

Edita directamente en `app.js`:

```js
const tarjetasPermitidas = {
  "A779C86D": "David",
  "E789B56B": "Luis",
  // Agrega más UID aquí
};
```

Opcionalmente, podría integrarse la lectura de esta lista desde Google Sheets.

---

## 🎨 Interfaz Web

* Actualización en tiempo real (cada segundo)
* Iconos grandes (✅ 🚫 ⌛)
* Historial de los últimos 10 escaneos
* Sonido para acceso permitido/denegado/esperando

---

## 📝 Licencia

MIT - Uso educativo y libre.

---

Desarrollado por 5to Bachillerato en Computación, Promo 2025 🚀
