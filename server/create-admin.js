const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, 'config.env') });

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_academico',
};

// Datos del administrador
const adminUser = {
  nombre: 'Administrador',
  email: 'admin@admin.com',
  username: 'admin',
  password: 'admin123', // Contraseña por defecto, debería ser cambiada después
  role: 'admin'
};

async function createAdminUser() {
  let connection;
  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado a la base de datos');

    // Verificar si el usuario ya existe
    const [existingUsers] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ? OR username = ?',
      [adminUser.email, adminUser.username]
    );

    if (existingUsers.length > 0) {
      console.log('⚠️  El usuario administrador ya existe en la base de datos');
      return;
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);

    // Insertar el usuario administrador
    const [result] = await connection.query(
      'INSERT INTO usuarios (nombre, email, username, password, role) VALUES (?, ?, ?, ?, ?)',
      [adminUser.nombre, adminUser.email, adminUser.username, hashedPassword, adminUser.role]
    );

    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📋 Datos de acceso:');
    console.log('👤 Usuario: admin');
    console.log('🔑 Contraseña: admin123');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión');

  } catch (error) {
    console.error('❌ Error al crear el usuario administrador:');
    console.error(error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Error de autenticación. Verifica el usuario y contraseña de la base de datos.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('La base de datos no existe. Asegúrate de que la base de datos esté creada.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('No se pudo conectar al servidor de base de datos. Verifica que MySQL esté en ejecución.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar la función para crear el administrador
createAdminUser();
