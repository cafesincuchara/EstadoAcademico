const bcrypt = require('bcryptjs');

// Contraseña que el usuario está ingresando
const password = 'Admin123';

// Hash de la contraseña que está en la base de datos
const storedHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

// Verificar la contraseña
bcrypt.compare(password, storedHash, (err, result) => {
  if (err) {
    console.error('Error al comparar contraseñas:', err);
    return;
  }
  
  console.log('¿La contraseña es válida?', result);
  
  if (result) {
    console.log('La contraseña es correcta');
  } else {
    console.log('La contraseña es incorrecta');
    console.log('Contraseña ingresada:', `"${password}"`);
    console.log('Hash almacenado:', storedHash);
    
    // Generar un nuevo hash para comparar
    bcrypt.hash(password, 10, (err, newHash) => {
      if (err) {
        console.error('Error al generar nuevo hash:', err);
        return;
      }
      console.log('Nuevo hash generado:', newHash);
    });
  }
});
