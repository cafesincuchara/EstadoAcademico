const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'qwertyenplanholysheet1',
  database: process.env.DB_NAME || 'sistema_academico',
  port: process.env.DB_PORT || 3306
};

// Cargar variables de entorno desde config.env
require('dotenv').config({ path: './config.env' });

// Lista de usuarios de prueba
const testUsers = [
  // Administradores
  {
    nombre: 'Admin Principal',
    email: 'admin1@escuela.com',
    username: 'admin1',
    password: 'Admin123',
    role: 'admin'
  },
  
  // Profesores
  {
    nombre: 'Profesor Juan Pérez',
    email: 'juan.perez@escuela.com',
    username: 'jperez',
    password: 'Profesor123',
    role: 'profesor'
  },
  {
    nombre: 'Profesora María Gómez',
    email: 'maria.gomez@escuela.com',
    username: 'mgomez',
    password: 'Profesor123',
    role: 'profesor'
  },
  
  // Estudiantes
  {
    nombre: 'Estudiante Ana López',
    email: 'ana.lopez@estudiante.com',
    username: 'alopez',
    password: 'Estudiante123',
    role: 'estudiante'
  },
  {
    nombre: 'Estudiante Carlos Ruiz',
    email: 'carlos.ruiz@estudiante.com',
    username: 'cruiz',
    password: 'Estudiante123',
    role: 'estudiante'
  },
  {
    nombre: 'Estudiante Laura Méndez',
    email: 'laura.mendez@estudiante.com',
    username: 'lmendez',
    password: 'Estudiante123',
    role: 'estudiante'
  }
];

async function seedDatabase() {
  let connection;
  
  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado a la base de datos');
    
    // Verificar si la tabla de usuarios existe
    const [tables] = await connection.query("SHOW TABLES LIKE 'usuarios'");
    if (tables.length === 0) {
      throw new Error('La tabla de usuarios no existe en la base de datos');
    }
    
    // Procesar cada usuario
    for (const user of testUsers) {
      try {
        // Verificar si el usuario ya existe
        const [existingUsers] = await connection.query(
          'SELECT id FROM usuarios WHERE email = ? OR username = ?',
          [user.email, user.username]
        );
        
        if (existingUsers.length > 0) {
          console.log(`⚠️  Usuario ya existe: ${user.email} (${user.username})`);
          continue;
        }
        
        // Hashear la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        
        // Insertar el usuario
        await connection.query(
          'INSERT INTO usuarios (nombre, email, username, password, role) VALUES (?, ?, ?, ?, ?)',
          [user.nombre, user.email, user.username, hashedPassword, user.role]
        );
        
        console.log(`✅ Usuario creado: ${user.email} (${user.username})`);
        
      } catch (error) {
        console.error(`❌ Error al crear usuario ${user.email}:`, error.message);
      }
    }
    
    console.log('\n🎉 Proceso de inserción de usuarios completado');
    
  } catch (error) {
    console.error('❌ Error en el proceso de inserción:', error.message);
    
  } finally {
    // Cerrar la conexión
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión a la base de datos cerrada');
    }
  }
}

// Ejecutar el script
seedDatabase();
