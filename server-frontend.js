const express = require('express');
const path = require('path');
const app = express();
const PORT = 4002;

// Servir archivos estáticos desde la carpeta src
app.use(express.static(path.join(__dirname, 'src')));

// Redirigir todas las rutas a index.html para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'login', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor frontend corriendo en http://localhost:${PORT}`);
});
