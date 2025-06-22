(function () {
    if (window.api) {
        console.warn('api.js ya estaba cargado, se omite redeclaración');
        return;
    }

    /**
     * Utilidad para realizar peticiones HTTP autenticadas
     */

let isHandlingAuthError = false;
// Importar AUTH_TOKEN_KEY de auth.js si está disponible
const AUTH_TOKEN_KEY = window.auth?.AUTH_TOKEN_KEY || 'auth_token';

/**
 * Maneja errores de autenticación
 */
function handleAuthError() {
    if (isHandlingAuthError) return;
    
    isHandlingAuthError = true;
    console.warn('Manejando error de autenticación...');
    
    // Limpiar token y datos de usuario
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('user_data');
    
    // Redirigir a login
    if (window.auth) {
        window.auth.logout();
    } else {
        window.location.href = '/login';
    }
    
    // Restablecer después de un tiempo
    setTimeout(() => {
        isHandlingAuthError = false;
    }, 2000);
}

/**
 * Realiza una petición HTTP autenticada
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones de fetch
 * @returns {Promise<Response>}
 */
async function fetchWithAuth(url, options = {}) {
    // Verificar autenticación
    if (!window.auth || !window.auth.isAuthenticated()) {
        console.warn('Usuario no autenticado, redirigiendo...');
        handleAuthError();
        return Promise.reject(new Error('No autenticado'));
    }

    // Obtener token
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
        console.warn('No se encontró token de autenticación');
        handleAuthError();
        return Promise.reject(new Error('Token no encontrado'));
    }
    
    // Configurar headers por defecto
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    try {
        // Mostrar indicador de carga si está disponible
        if (window.showLoading) window.showLoading();
        
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include'
        });
        
        // Ocultar indicador de carga
        if (window.hideLoading) window.hideLoading();
        
        // Manejar respuestas no autorizadas
        if (response.status === 401 || response.status === 403) {
            console.warn(`Acceso no autorizado (${response.status})`);
            handleAuthError();
            return Promise.reject(new Error('Sesión expirada o no autorizada'));
        }
        
        // Manejar otros errores HTTP
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(errorData.message || 'Error en la solicitud');
            error.status = response.status;
            error.data = errorData;
            throw error;
        }

        return response;
    } catch (error) {
        // Ocultar indicador de carga en caso de error
        if (window.hideLoading) window.hideLoading();
        
        // Manejar errores de red
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            console.error('Error de conexión:', error);
            throw new Error('No se pudo conectar al servidor. Verifica tu conexión a internet.');
        }
        
        console.error('Error en la solicitud:', error);
        throw error;
    }
}

/**
 * Realiza una petición GET autenticada
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>}
 */
async function get(url, options = {}) {
    const response = await fetchWithAuth(url, {
        ...options,
        method: 'GET'
    });
    return response.json();
}

/**
 * Realiza una petición POST autenticada
 * @param {string} url - URL del endpoint
 * @param {Object} data - Datos a enviar
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>}
 */
async function post(url, data, options = {}) {
    const response = await fetchWithAuth(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.json();
}

/**
 * Realiza una petición PUT autenticada
 * @param {string} url - URL del endpoint
 * @param {Object} data - Datos a actualizar
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>}
 */
async function put(url, data, options = {}) {
    const response = await fetchWithAuth(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data)
    });
    return response.json();
}

/**
 * Realiza una petición DELETE autenticada
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>}
 */
async function del(url, options = {}) {
    const response = await fetchWithAuth(url, {
        ...options,
        method: 'DELETE'
    });
    return response.json();
}

// Exportar funciones
window.api = {
    get,
    post,
    put,
    del,
    fetch: fetchWithAuth
};

})();
