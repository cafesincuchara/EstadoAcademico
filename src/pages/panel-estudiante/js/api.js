/**
 * Módulo de API para el panel del estudiante
 */

// Usar IIFE para evitar la contaminación del ámbito global
(function() {
    'use strict';

    const API_BASE_URL = 'http://localhost:4000/api';
    const DEFAULT_TIMEOUT = 10000; // 10 segundos

    /**
     * Realiza una petición a la API con manejo de errores mejorado
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} options - Opciones de la petición
     * @returns {Promise<Object>} - Respuesta de la API
     */
    async function fetchAPI(endpoint, options = {}) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);

            const defaultHeaders = {
                'Content-Type': 'application/json',
            };

            // Agregar token de autenticación si existe
            const token = localStorage.getItem('auth_token');
            if (token) {
                defaultHeaders['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...(options.headers || {})
                },
                credentials: 'include', // Incluir cookies para mantener la sesión
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Verificar si la respuesta es JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const error = new Error('La respuesta no es un JSON válido');
                error.response = response;
                throw error;
            }

            const data = await response.json();

            if (!response.ok) {
                const error = new Error(data.message || 'Error en la petición');
                error.response = response;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error en la petición:', {
                endpoint,
                error: error.message,
                status: error.response?.status,
                data: error.data
            });

            // Mejorar mensajes de error
            if (error.name === 'AbortError') {
                throw new Error('La petición ha excedido el tiempo de espera');
            } else if (!navigator.onLine) {
                throw new Error('No hay conexión a Internet');
            } else if (error.response?.status === 401) {
                // Token inválido o expirado
                window.auth.logout();
                throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            } else if (error.response?.status >= 500) {
                throw new Error('Error en el servidor. Por favor, inténtalo más tarde.');
            }

            throw error;
        }
    }

    /**
     * Inicia sesión con credenciales
     * @param {string} email - Correo electrónico
     * @param {string} password - Contraseña
     * @returns {Promise<Object>} - Datos del usuario y token
     */
    async function login(email, password) {
        if (!email || !password) {
            throw new Error('El correo y la contraseña son obligatorios');
        }

        try {
            const response = await fetchAPI('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // Verificar la estructura de la respuesta
            if (!response.token || !response.user) {
                throw new Error('Respuesta del servidor inválida');
            }

            // Guardar token y datos del usuario
            if (window.auth && typeof window.auth.setAuthData === 'function') {
                window.auth.setAuthData(response.token, response.user);
            }

            return response;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            
            // Mejorar mensajes de error
            if (error.response?.status === 401) {
                throw new Error('Correo o contraseña incorrectos');
            } else if (error.response?.status === 0) {
                throw new Error('No se pudo conectar al servidor. Verifica tu conexión.');
            }
            
            throw error;
        }
    }

    /**
     * Obtiene los datos del estudiante autenticado
     * @returns {Promise<Object>} - Datos del estudiante
     */
    async function getStudentProfile() {
        try {
            return await fetchAPI('/estudiante/perfil');
        } catch (error) {
            console.error('Error al obtener perfil del estudiante:', error);
            
            // Si hay un error de autenticación, forzar cierre de sesión
            if (error.response?.status === 401) {
                window.auth.logout();
            }
            
            throw error;
        }
    }

    /**
     * Obtiene las notas del estudiante
     * @returns {Promise<Array>} - Lista de notas
     */
    async function getStudentGrades() {
        try {
            return await fetchAPI('/estudiante/notas');
        } catch (error) {
            console.error('Error al obtener notas:', error);
            
            // Si hay un error de autenticación, forzar cierre de sesión
            if (error.response?.status === 401) {
                window.auth.logout();
            }
            
            throw error;
        }
    }

    // Exportar funciones al objeto window.studentAPI si no existe
    if (!window.studentAPI) {
        window.studentAPI = {
            login,
            getStudentProfile,
            getStudentGrades
        };
    }
})();
