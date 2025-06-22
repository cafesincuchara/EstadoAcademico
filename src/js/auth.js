// Módulo de autenticación
(function() {
    // Claves para localStorage
    const AUTH_TOKEN_KEY = 'auth_token';
    const USER_DATA_KEY = 'user_data';

    // Guardar datos de autenticación
    function setAuthData(token, user) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    }

    // Obtener datos del usuario
    function getUserData() {
        try {
            return JSON.parse(localStorage.getItem(USER_DATA_KEY)) || null;
        } catch (e) {
            console.error('Error al obtener datos del usuario:', e);
            return null;
        }
    }


    // Verificar si el usuario está autenticado
    function isAuthenticated() {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const user = getUserData();
        return !!(token && user && user.id);
    }

    // Verificar rol del usuario
    function hasRole(requiredRole) {
        if (!requiredRole) return true; // Si no se requiere un rol específico
        const user = getUserData();
        return user && user.role === requiredRole.toLowerCase();
    }

    // Verificar autenticación y redirigir si es necesario
    function checkAuth(requiredRole) {
        if (!isAuthenticated()) {
            // Si no está autenticado, redirigir al login
            window.location.href = '/login';
            return false;
        }

        // Si se requiere un rol específico y el usuario no lo tiene
        if (requiredRole && !hasRole(requiredRole)) {
            const user = getUserData();
            // Redirigir según el rol del usuario
            switch(user.role) {
                case 'admin':
                    window.location.href = '/panel-admin';
                    break;
                case 'profesor':
                    window.location.href = '/panel-profesor';
                    break;
                case 'alumno':
                    window.location.href = '/panel-estudiante';
                    break;
                default:
                    window.location.href = '/';
            }
            return false;
        }

        return true;
    }

    // Cerrar sesión
    function logout() {
        // Opcional: Llamar al endpoint de logout del servidor
        fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        }).finally(() => {
            // Limpiar localStorage independientemente de la respuesta del servidor
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(USER_DATA_KEY);
            window.location.href = '/login';
        });
    }

    // Exponer las funciones necesarias
    window.auth = { 
        setAuthData, 
        getUserData, 
        isAuthenticated,
        hasRole,
        checkAuth,
        logout,
        AUTH_TOKEN_KEY
    };
})();
