const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_academico',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function testConnection() {
  let connection;
  try {
    console.log('Intentando conectar a la base de datos...');
    console.log('Configuración:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      password: dbConfig.password ? '*****' : '(vacía)'
    });
    
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });
    
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Probar una consulta simple
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('✅ Prueba de consulta exitosa. Resultado:', rows[0].result);
    
    // Verificar si la tabla de usuarios existe
    const [tables] = await connection.execute(
      'SHOW TABLES LIKE "usuarios"'
    );
    
    if (tables.length > 0) {
      console.log('✅ La tabla "usuarios" existe');
    } else {
      console.warn('⚠️  La tabla "usuarios" no existe. Ejecuta database.sql para crearla');
    }
    
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:');
    console.error(error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Error de autenticación. Verifica el usuario y contraseña.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('La base de datos no existe. Asegúrate de crearla primero.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('No se pudo conectar al servidor MySQL. ¿Está en ejecución?');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexión cerrada');
    }
  }
}

testConnection();
