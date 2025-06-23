// Usuarios predefinidos con sus roles y contraseñas
const users = [
    // Administrador
    {
        username: 'admin',
        password: 'Admin123!',
        name: 'Administrador',
        role: 'admin',
        email: 'admin@universidad.edu'
    },
    
    // Profesores
    {
        username: 'jperez',
        password: 'Profesor123!',
        name: 'Juan Pérez',
        role: 'profesor',
        email: 'jperez@universidad.edu',
        department: 'Informática'
    },
    {
        username: 'pgarcia',
        password: 'Profesor456!',
        name: 'Pedro García',
        role: 'profesor',
        email: 'pgarcia@universidad.edu',
        department: 'Matemáticas'
    },
    
    // Estudiantes
    {
        username: 'alopez',
        password: 'Estudiante123!',
        name: 'Ana López',
        role: 'estudiante',
        email: 'alopez@universidad.edu',
        studentId: 'A12345',
        major: 'Ingeniería Informática',
        avatar: 'https://ui-avatars.com/api/?name=Ana+Lopez&size=128'
    },
    {
        username: 'mrodriguez',
        password: 'Estudiante456!',
        name: 'María Rodríguez',
        role: 'estudiante',
        email: 'mrodriguez@universidad.edu',
        studentId: 'M67890',
        major: 'Matemáticas',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&size=128'
    }
];

/**
 * Inicia sesión con un nombre de usuario y contraseña
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} [requiredRole=null] - Rol requerido para el login
 * @returns {Object} Objeto con éxito y datos del usuario o mensaje de error
 */
function login(username, password, requiredRole = null) {
    // Validar tipo de rol
    if (requiredRole && typeof requiredRole !== 'string') {
        console.error('Tipo de rol inválido:', requiredRole);
        requiredRole = null;
    }
    
    console.log(`Intento de login para usuario: ${username}, rol requerido: ${requiredRole || 'cualquiera'}`);
    
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
        console.log('Usuario no encontrado');
        return { success: false, message: 'Usuario no encontrado' };
    }

    if (user.password !== password) {
        console.log('Contraseña incorrecta');
        return { success: false, message: 'Contraseña incorrecta' };
    }

    if (requiredRole && user.role !== requiredRole) {
        console.log(`Acceso denegado. Rol requerido: ${requiredRole}, Rol actual: ${user.role}`);
        return { success: false, message: 'No tienes permisos para este panel' };
    }

    const userData = {
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return { success: true, user: userData };
}

/**
 * Cierra la sesión del usuario actual
 */
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
}

/**
 * Verifica si hay un usuario autenticado
 * @returns {boolean} true si hay un usuario autenticado, false en caso contrario
 */
function isAuthenticated() {
    return !!localStorage.getItem('currentUser');
}

/**
 * Obtiene los datos del usuario actual
 * @returns {Object|null} Datos del usuario o null si no hay sesión
 */
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} role - Rol a verificar
 * @returns {boolean} true si el usuario tiene el rol, false en caso contrario
 */
function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role.toLowerCase() === role.toLowerCase();
}

/**
 * Redirige al panel correspondiente según el rol del usuario
 */
function redirectToDashboard() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/login';
        return;
    }
    
    // Redirigir según el rol
    const role = user.role.toLowerCase();
    if (role === 'admin') {
        window.location.href = '/panel-admin';
    } else if (role === 'profesor') {
        window.location.href = '/panel-profesor';
    } else if (role === 'estudiante') {
        window.location.href = '/panel-estudiante';
    } else {
        window.location.href = '/login';
    }
}

// Hacer funciones accesibles globalmente
const auth = {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    hasRole,
    redirectToDashboard
};

// Exportar para CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = auth;
}
// Exportar para navegadores
if (typeof window !== 'undefined') {
    window.auth = auth;
}
