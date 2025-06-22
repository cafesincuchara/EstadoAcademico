/**
 * Configuración de la aplicación de módulos
 */

export const APP_CONFIG = {
  // Configuración de la API
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  API_TIMEOUT: 30000, // 30 segundos
  
  // Configuración de autenticación
  AUTH_TOKEN_KEY: 'modulos_auth_token',
  REFRESH_TOKEN_KEY: 'modulos_refresh_token',
  TOKEN_EXPIRY_BUFFER: 300, // 5 minutos (en segundos)
  
  // Configuración de paginación
  ITEMS_PER_PAGE: 10,
  
  // Configuración de archivos
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ],
  
  // Configuración de notificaciones
  NOTIFICATION_TIMEOUT: 5000, // 5 segundos
  
  // Configuración del editor de texto enriquecido
  EDITOR_MODULES: {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['formula']
    ],
  },
  
  EDITOR_FORMATS: [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image', 'video',
    'color', 'background',
    'align',
    'blockquote', 'code-block',
    'formula'
  ],
  
  // Configuración de temas
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  },
  
  // Configuración de roles y permisos
  ROLES: {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    VALIDATOR: 'validator',
    GUEST: 'guest'
  },
  
  // Configuración de rutas
  ROUTES: {
    HOME: '/modulos',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    MODULES: {
      LIST: '/modulos',
      CREATE: '/modulos/nuevo',
      DETAIL: '/modulos/:id',
      EDIT: '/modulos/:id/editar',
      VALIDATE: '/modulos/:id/validar'
    },
    NOT_FOUND: '/404'
  },
  
  // Configuración de validación
  VALIDATION: {
    TITLE_MIN_LENGTH: 5,
    TITLE_MAX_LENGTH: 255,
    DESCRIPTION_MIN_LENGTH: 10,
    DESCRIPTION_MAX_LENGTH: 1000,
    CONTENT_MIN_LENGTH: 20,
    COMMENT_MIN_LENGTH: 10,
    COMMENT_MAX_LENGTH: 1000
  },
  
  // Configuración de caché
  CACHE: {
    ENABLED: true,
    TTL: 60 * 60 * 1000, // 1 hora en milisegundos
    PREFIX: 'modulos_'
  },
  
  // Configuración de notificaciones push
  PUSH_NOTIFICATIONS: {
    ENABLED: 'Notification' in window,
    PERMISSION_GRANTED: 'granted',
    PERMISSION_DENIED: 'denied',
    PERMISSION_DEFAULT: 'default',
    VAPID_PUBLIC_KEY: process.env.REACT_APP_VAPID_PUBLIC_KEY || ''
  },
  
  // Configuración de analíticas
  ANALYTICS: {
    ENABLED: process.env.NODE_ENV === 'production',
    TRACKING_ID: process.env.REACT_APP_GA_TRACKING_ID || ''
  },
  
  // Configuración de errores
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
    SERVER_ERROR: 'Error del servidor. Por favor, inténtalo de nuevo más tarde.',
    UNAUTHORIZED: 'No autorizado. Por favor, inicia sesión nuevamente.',
    FORBIDDEN: 'No tienes permiso para realizar esta acción.',
    NOT_FOUND: 'El recurso solicitado no fue encontrado.',
    VALIDATION_ERROR: 'Por favor, corrige los errores en el formulario.',
    UNKNOWN_ERROR: 'Ha ocurrido un error inesperado.'
  },
  
  // Configuración de fechas
  DATE_FORMATS: {
    DATE: 'DD/MM/YYYY',
    DATETIME: 'DD/MM/YYYY HH:mm',
    TIME: 'HH:mm',
    API_DATE: 'YYYY-MM-DD',
    API_DATETIME: 'YYYY-MM-DDTHH:mm:ssZ'
  },
  
  // Configuración de moneda
  CURRENCY: {
    SYMBOL: '€',
    DECIMALS: 2,
    DECIMAL_SEPARATOR: ',',
    THOUSANDS_SEPARATOR: '.'
  },
  
  // Configuración de internacionalización
  I18N: {
    DEFAULT_LANGUAGE: 'es',
    LANGUAGES: [
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' }
    ]
  },
  
  // Configuración de temas de colores
  THEME_COLORS: {
    PRIMARY: '#3498db',
    SECONDARY: '#2ecc71',
    DANGER: '#e74c3c',
    WARNING: '#f39c12',
    INFO: '#3498db',
    SUCCESS: '#2ecc71',
    DARK: '#2c3e50',
    LIGHT: '#ecf0f1'
  },
  
  // Configuración de breakpoints para diseño responsive
  BREAKPOINTS: {
    XS: 0,
    SM: 576,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1400
  },
  
  // Configuración de animaciones
  ANIMATIONS: {
    DURATION: 300, // ms
    EASING: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Configuración de características experimentales
  FEATURE_FLAGS: {
    DARK_MODE: true,
    OFFLINE_MODE: false,
    PWA_SUPPORT: true,
    NOTIFICATIONS: true,
    ANALYTICS: process.env.NODE_ENV === 'production',
    DEBUG: process.env.NODE_ENV !== 'production'
  }
};

/**
 * Configuración por entorno
 */
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  buildDate: process.env.REACT_APP_BUILD_DATE || new Date().toISOString()
};

/**
 * Configuración de la aplicación
 */
const config = {
  ...APP_CONFIG,
  ...ENV_CONFIG,
  
  /**
   * Obtener la URL completa de la API
   * @param {string} path - Ruta de la API
   * @returns {string} URL completa
   */
  getApiUrl(path) {
    // Eliminar la barra inicial si existe
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${this.API_BASE_URL}/${cleanPath}`;
  },
  
  /**
   * Verificar si una característica está habilitada
   * @param {string} feature - Nombre de la característica
   * @returns {boolean} true si está habilitada
   */
  isFeatureEnabled(feature) {
    return this.FEATURE_FLAGS[feature] === true;
  },
  
  /**
   * Obtener el tiempo de expiración de la caché
   * @returns {number} Tiempo en milisegundos
   */
  getCacheExpiry() {
    return this.CACHE.ENABLED ? this.CACHE.TTL : 0;
  },
  
  /**
   * Obtener la clave de caché con prefijo
   * @param {string} key - Clave de caché
   * @returns {string} Clave con prefijo
   */
  getCacheKey(key) {
    return `${this.CACHE.PREFIX}${key}`;
  },
  
  /**
   * Obtener el mensaje de error para un código de error
   * @param {string} errorCode - Código de error
   * @param {string} defaultMessage - Mensaje por defecto
   * @returns {string} Mensaje de error
   */
  getErrorMessage(errorCode, defaultMessage = null) {
    return this.ERROR_MESSAGES[errorCode] || defaultMessage || this.ERROR_MESSAGES.UNKNOWN_ERROR;
  },
  
  /**
   * Formatear una fecha
   * @param {Date|string|number} date - Fecha a formatear
   * @param {string} format - Formato de fecha (opcional)
   * @returns {string} Fecha formateada
   */
  formatDate(date, format = this.DATE_FORMATS.DATE) {
    // Implementación básica - en una aplicación real, usaría una librería como date-fns o moment.js
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Fecha inválida';
    
    // Implementación simple - en una aplicación real, usar una librería
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },
  
  /**
   * Formatear un número como moneda
   * @param {number} amount - Cantidad
   * @param {string} currency - Código de moneda (opcional)
   * @returns {string} Cantidad formateada
   */
  formatCurrency(amount, currency = this.CURRENCY.SYMBOL) {
    if (isNaN(amount)) return '--';
    
    const value = parseFloat(amount).toFixed(this.CURRENCY.DECIMALS);
    const [integer, decimal] = value.split('.');
    
    // Formatear la parte entera con separadores de miles
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.CURRENCY.THOUSANDS_SEPARATOR);
    
    // Unir todo
    return `${currency} ${formattedInteger}${this.CURRENCY.DECIMAL_SEPARATOR}${decimal}`;
  }
};

export default config;
