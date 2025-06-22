// Configuración de la API para módulos
const API_BASE_URL = 'http://localhost:4000/api'; // Ruta base de la API

// Función para realizar peticiones autenticadas
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la petición');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
}

// Funciones de la API para módulos
export const moduloAPI = {
  // Obtener todos los módulos
  getModulos: async () => {
    return fetchWithAuth('/');
  },
  
  // Obtener un módulo por ID
  getModulo: async (id) => {
    return fetchWithAuth(`/${id}`);
  },
  
  // Crear un nuevo módulo
  createModulo: async (data) => {
    return fetchWithAuth('/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // Validar un módulo
  validarModulo: async (id, data) => {
    return fetchWithAuth(`/${id}/validar`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // Obtener validaciones de un módulo
  getValidaciones: async (moduloId) => {
    return fetchWithAuth(`/${moduloId}/validaciones`);
  },
  
  // Verificar si el usuario actual puede validar módulos
  puedeValidar: async () => {
    try {
      const response = await fetchWithAuth('/puede-validar');
      return response.puedeValidar || false;
    } catch (error) {
      console.error('Error al verificar permisos de validación:', error);
      return false;
    }
  }
};

export default moduloAPI;
