const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

async function initializeDatabase() {
  // Configuración de conexión sin especificar la base de datos
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Permitir múltiples consultas
  });

  try {
    console.log('Conectando a MySQL...');
    
    // Leer el archivo SQL
    const sql = await fs.readFile(path.join(__dirname, '../database.sql'), 'utf8');
    
    console.log('Ejecutando script SQL...');
    
    // Ejecutar el script SQL
    await connection.query(sql);
    
    console.log('Base de datos inicializada exitosamente!');
    console.log('Usuario administrador creado:');
    console.log('- Email: admin@escuela.com');
    console.log('- Contraseña: Admin123');
    
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  } finally {
    // Cerrar la conexión
    await connection.end();
    process.exit(0);
  }
}

// Ejecutar la inicialización
initializeDatabase();
