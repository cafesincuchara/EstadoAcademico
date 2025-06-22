const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_academico',
};

async function resetAdminPassword() {
  const newPassword = 'Admin123';
  const saltRounds = 10;
  
  try {
    // Generar hash de la nueva contraseña
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log('Nuevo hash generado:', hashedPassword);
    
    // Conectar a la base de datos
    const connection = await mysql.createConnection(dbConfig);
    console.log('Conectado a la base de datos');
    
    // Actualizar la contraseña del administrador
    const [result] = await connection.execute(
      'UPDATE usuarios SET password = ? WHERE username = ?',
      [hashedPassword, 'admin']
    );
    
    if (result.affectedRows > 0) {
      console.log('✅ Contraseña del administrador actualizada correctamente');
      console.log('Usuario: admin');
      console.log('Nueva contraseña: Admin123');
    } else {
      console.log('⚠️ No se encontró el usuario administrador');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error al actualizar la contraseña:', error);
  }
}

// Ejecutar la función
resetAdminPassword();
