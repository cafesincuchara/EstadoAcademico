const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20, // Aumentado para manejar más conexiones simultáneas
  queueLimit: 0,
  connectTimeout: 30000, // Aumentado a 30 segundos
  dateStrings: true,
  timezone: 'local',
  charset: 'utf8mb4',
  supportBigNumbers: true,
  bigNumberStrings: true,
  multipleStatements: true
});

// Manejador de eventos para la conexión
pool.on('acquire', (connection) => {
  console.log(`Conexión ${connection.threadId} adquirida`);
});

pool.on('release', (connection) => {
  console.log(`Conexión ${connection.threadId} liberada`);
});

pool.on('enqueue', () => {
  console.log('Esperando por una conexión disponible...');
});

// Función para probar la conexión a la base de datos
async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('🔌 Conexión exitosa a la base de datos MySQL');
    
    // Verificar si la tabla de usuarios existe
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'usuarios'"
    );
    
    if (tables.length === 0) {
      console.warn('⚠️  La tabla de usuarios no existe. Creando estructura inicial...');
      await createInitialSchema(connection);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
    console.error('Detalles:', error);
    return false;
  } finally {
    if (connection) await connection.release();
  }
}

// Función para crear el esquema inicial
async function createInitialSchema(connection) {
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'profesor', 'estudiante') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    console.log('✅ Estructura de la base de datos creada correctamente');
    
    // Insertar usuario administrador por defecto si no existe
    const [adminUser] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ?', 
      ['admin@escuela.com']
    );
    
    if (adminUser.length === 0) {
      const hashedPassword = await require('bcryptjs').hash('admin123', 10);
      await connection.query(
        'INSERT INTO usuarios (nombre, email, username, password, role) VALUES (?, ?, ?, ?, ?)',
        ['Administrador', 'admin@escuela.com', 'admin', hashedPassword, 'admin']
      );
      console.log('👤 Usuario administrador creado con éxito');
    }
    
  } catch (error) {
    console.error('❌ Error al crear la estructura inicial:', error);
    throw error;
  }
}

// Función para ejecutar consultas de forma segura
async function query(sql, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log(`🔍 Ejecutando consulta: ${sql}`, params);
    const start = Date.now();
    const [rows] = await connection.query(sql, params);
    const duration = Date.now() - start;
    console.log(`✅ Consulta ejecutada en ${duration}ms`);
    return rows;
  } catch (error) {
    console.error('❌ Error en la consulta:', error.message);
    console.error('📌 Consulta fallida:', sql);
    console.error('📌 Parámetros:', params);
    
    // Mejorar mensajes de error
    if (error.code === 'ER_DUP_ENTRY') {
      const field = error.message.includes('email') ? 'correo electrónico' : 'nombre de usuario';
      error.message = `El ${field} ya está en uso`;
      error.statusCode = 409; // Conflict
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      error.message = 'Error en la estructura de la base de datos';
      error.statusCode = 500;
    } else if (!error.statusCode) {
      error.statusCode = 500;
    }
    
    throw error;
  } finally {
    if (connection) await connection.release();
  }
}

// Función para obtener una conexión del pool con manejo de transacciones
async function getConnection() {
  const connection = await pool.getConnection();
  
  // Agregar métodos de transacción
  connection.beginTransaction = async () => {
    console.log('🔄 Iniciando transacción');
    await connection.query('START TRANSACTION');
  };
  
  connection.commit = async () => {
    console.log('✅ Confirmando transacción');
    await connection.query('COMMIT');
  };
  
  connection.rollback = async () => {
    console.log('⏪ Revirtiendo transacción');
    await connection.query('ROLLBACK');
  };
  
  // Método para ejecutar consultas dentro de una transacción
  connection.transaction = async (callback) => {
    await connection.beginTransaction();
    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  };
  
  return connection;
}

// Exportar el pool y las funciones de utilidad
module.exports = {
  pool,
  query,
  getConnection,
  testConnection
};
