-- 1. Crear respaldo de la tabla users (si existe)
CREATE TABLE IF NOT EXISTS backup_users LIKE users;
INSERT INTO backup_users SELECT * FROM users;

-- 2. Eliminar tablas existentes
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- 3. Crear la estructura correcta
-- Tabla de usuarios
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

-- Insertar usuario administrador por defecto (contraseña: Admin123)
INSERT INTO usuarios (nombre, email, username, password, role) 
VALUES (
    'Administrador', 
    'admin@escuela.com', 
    'admin', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'admin'
);

-- Migrar usuarios existentes (si es necesario)
-- INSERT INTO usuarios (nombre, email, username, password, role, created_at)
-- SELECT 
--     username as nombre,
--     email,
--     username,
--     password,
--     CASE 
--         WHEN username = 'admin' THEN 'admin'
--         ELSE 'estudiante' 
--     END as role,
--     created_at
-- FROM backup_users;
