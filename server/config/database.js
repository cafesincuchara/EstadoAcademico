const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_academico',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 segundos de tiempo de espera para conexión
  dateStrings: true // Para que las fechas se devuelvan como strings en lugar de objetos Date
});

// Función para probar la conexión a la base de datos
async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Conexión exitosa a la base de datos MySQL');
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    return false;
  } finally {
    if (connection) connection.release();
  }
}

// Función para ejecutar consultas de forma segura
async function query(sql, params) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    console.error('Error en la consulta:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Función para obtener una conexión del pool
async function getConnection() {
  return await pool.getConnection();
}

// Exportar el pool y las funciones de utilidad
module.exports = {
  pool,
  query,
  getConnection,
  testConnection
};
