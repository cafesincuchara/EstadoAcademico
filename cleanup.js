const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server/server.js');

// Leer el archivo
let content = fs.readFileSync(serverPath, 'utf8');

// Encontrar y eliminar la segunda declaración de routes
const routesPattern = /(const routes = \{[\s\S]*?\};)/g;
const matches = [...content.matchAll(routesPattern)];

if (matches.length > 1) {
  console.log('Encontradas declaraciones duplicadas de routes. Eliminando duplicados...');
  // Mantener solo la primera declaración
  content = content.replace(matches[1][0], '');
  
  // Escribir el archivo limpio
  fs.writeFileSync(serverPath, content, 'utf8');
  console.log('Archivo limpiado exitosamente');
} else {
  console.log('No se encontraron declaraciones duplicadas de routes');
}
