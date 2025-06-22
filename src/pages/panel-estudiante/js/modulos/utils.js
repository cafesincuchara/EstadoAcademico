/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {boolean} [includeTime=true] - Incluir hora en el formato
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, includeTime = true) => {
  if (!date) return 'Fecha no disponible';
  
  const dateObj = new Date(date);
  
  // Verificar si la fecha es válida
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString('es-ES', options);
};

/**
 * Obtiene la información del estado para mostrar en la interfaz
 * @param {string} estado - Estado del módulo (pendiente, aprobado, rechazado, en_revision, etc.)
 * @returns {Object} Objeto con texto, clase CSS y color para el estado
 */
export const getEstadoInfo = (estado) => {
  const estados = {
    aprobado: { 
      text: 'Aprobado', 
      className: 'bg-success',
      color: '#198754'
    },
    rechazado: { 
      text: 'Rechazado', 
      className: 'bg-danger',
      color: '#dc3545'
    },
    pendiente: { 
      text: 'Pendiente', 
      className: 'bg-warning text-dark',
      color: '#ffc107'
    },
    en_revision: {
      text: 'En Revisión',
      className: 'bg-info text-dark',
      color: '#0dcaf0'
    },
    borrador: {
      text: 'Borrador',
      className: 'bg-secondary',
      color: '#6c757d'
    },
    publicado: {
      text: 'Publicado',
      className: 'bg-primary',
      color: '#0d6efd'
    },
    deshabilitado: {
      text: 'Deshabilitado',
      className: 'bg-dark',
      color: '#212529'
    }
  };
  
  return estados[estado?.toLowerCase()] || { 
    text: estado || 'Desconocido', 
    className: 'bg-secondary',
    color: '#6c757d'
  };
};

/**
 * Recorta un texto a una longitud máxima y agrega puntos suspensivos si es necesario
 * @param {string} text - Texto a recortar
 * @param {number} maxLength - Longitud máxima del texto
 * @param {boolean} [words=false] - Si es true, corta en el último espacio antes de maxLength
 * @returns {string} Texto recortado
 */
export const truncateText = (text, maxLength = 100, words = false) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  if (words) {
    // Cortar en el último espacio antes de maxLength
    let trimmed = text.substring(0, maxLength);
    trimmed = trimmed.substring(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));
    return trimmed + '...';
  }
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Valida los datos del formulario de módulo
 * @param {Object} data - Datos del formulario
 * @returns {Object} Objeto con errores de validación
 */
export const validateModuleData = (data) => {
  const errors = {};
  
  // Validar título
  if (!data.titulo || data.titulo.trim().length < 5) {
    errors.titulo = 'El título debe tener al menos 5 caracteres';
  } else if (data.titulo.length > 255) {
    errors.titulo = 'El título no puede tener más de 255 caracteres';
  }
  
  // Validar descripción
  if (!data.descripcion || data.descripcion.trim().length < 10) {
    errors.descripcion = 'La descripción debe tener al menos 10 caracteres';
  } else if (data.descripcion.length > 1000) {
    errors.descripcion = 'La descripción no puede tener más de 1000 caracteres';
  }
  
  // Validar contenido
  if (!data.contenido || data.contenido.trim().length < 20) {
    errors.contenido = 'El contenido debe tener al menos 20 caracteres';
  }
  
  // Validar archivos (si existen en los datos)
  if (data.archivos && data.archivos.length > 0) {
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    
    data.archivos.forEach((file, index) => {
      if (file.size > maxFileSize) {
        errors[`archivo_${index}`] = `El archivo ${file.name} es demasiado grande (máx. 10MB)`;
      }
      
      if (!allowedTypes.includes(file.type)) {
        errors[`archivo_${index}_tipo`] = `Tipo de archivo no permitido: ${file.name}`;
      }
    });
  }
  
  return errors;
};

/**
 * Maneja errores de la API
 * @param {Error} error - Error de la API
 * @param {string} [defaultMessage='Error al procesar la solicitud'] - Mensaje por defecto
 * @returns {string} Mensaje de error amigable
 */
export const handleApiError = (error, defaultMessage = 'Error al procesar la solicitud') => {
  console.error('API Error:', error);
  
  if (!error) return defaultMessage;
  
  // Manejar errores de validación de formulario (422 Unprocessable Entity)
  if (error.response && error.response.status === 422 && error.response.data.errors) {
    // Devolver el primer mensaje de error de validación
    const firstErrorKey = Object.keys(error.response.data.errors)[0];
    const firstErrorMessage = error.response.data.errors[firstErrorKey][0];
    return firstErrorMessage || 'Error de validación en el formulario';
  }
  
  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    if (error.response.status === 400) {
      return error.response.data?.message || 'Solicitud incorrecta';
    } else if (error.response.status === 401) {
      return 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
    } else if (error.response.status === 403) {
      return 'No tiene permisos para realizar esta acción.';
    } else if (error.response.status === 404) {
      return 'El recurso solicitado no fue encontrado.';
    } else if (error.response.status === 409) {
      return 'Conflicto: El recurso ya existe o ha sido modificado.';
    } else if (error.response.status >= 500) {
      return 'Error del servidor. Por favor, intente nuevamente más tarde.';
    } else if (error.response.data?.message) {
      return error.response.data.message;
    } else {
      return `Error del servidor (${error.response.status}): ${error.response.statusText}`;
    }
  } else if (error.request) {
    // La solicitud fue hecha pero no se recibió respuesta
    return 'No se pudo conectar al servidor. Verifique su conexión a internet.';
  } else if (error.message) {
    // Error en la configuración de la solicitud
    return error.message;
  }
  
  return defaultMessage;
};

/**
 * Genera un ID único
 * @param {number} [length=8] - Longitud del ID
 * @returns {string} ID único
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Crea un objeto de marcado HTML seguro para usar con dangerouslySetInnerHTML
 * @param {string} html - Contenido HTML
 * @returns {Object} Objeto con la propiedad __html
 */
export const createMarkup = (html) => {
  if (!html) return { __html: '' };
  
  // Limpieza básica de HTML para prevenir XSS
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=".*?"/gi, '');
    
  return { __html: cleanHtml };
};

/**
 * Formatea el tamaño de un archivo en un formato legible
 * @param {number} bytes - Tamaño en bytes
 * @param {number} [decimals=2] - Número de decimales
 * @returns {string} Tamaño formateado (ej: "2.5 MB")
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Obtiene el tipo de archivo basado en la extensión o tipo MIME
 * @param {string} filename - Nombre del archivo o tipo MIME
 * @returns {string} Tipo de archivo (document, image, video, audio, archive, other)
 */
export const getFileType = (filename) => {
  if (!filename) return 'other';
  
  const extension = filename.split('.').pop().toLowerCase();
  const mimeType = filename.split('/')[0];
  
  // Por extensión
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  if (audioExtensions.includes(extension)) return 'audio';
  if (archiveExtensions.includes(extension)) return 'archive';
  if (documentExtensions.includes(extension)) return 'document';
  
  // Por tipo MIME
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/zip' || mimeType === 'application/x-rar-compressed') return 'archive';
  if (mimeType.startsWith('application/') && 
      (mimeType.includes('word') || 
       mimeType.includes('excel') || 
       mimeType.includes('powerpoint') || 
       mimeType.includes('pdf') || 
       mimeType.includes('text'))) {
    return 'document';
  }
  
  return 'other';
};

/**
 * Obtiene el ícono de FontAwesome para un tipo de archivo
 * @param {string} filename - Nombre del archivo o tipo MIME
 * @returns {string} Clase de ícono de FontAwesome
 */
export const getFileIcon = (filename) => {
  const fileType = getFileType(filename);
  
  switch (fileType) {
    case 'image':
      return 'fa-file-image';
    case 'video':
      return 'fa-file-video';
    case 'audio':
      return 'fa-file-audio';
    case 'document':
      if (filename.includes('.pdf')) return 'fa-file-pdf';
      if (filename.includes('.doc') || filename.includes('word')) return 'fa-file-word';
      if (filename.includes('.xls') || filename.includes('excel') || filename.includes('spreadsheet')) return 'fa-file-excel';
      if (filename.includes('.ppt') || filename.includes('powerpoint')) return 'fa-file-powerpoint';
      if (filename.includes('.txt') || filename.includes('text/plain')) return 'fa-file-alt';
      return 'fa-file-alt';
    case 'archive':
      return 'fa-file-archive';
    case 'code':
      return 'fa-file-code';
    default:
      return 'fa-file';
  }
};

/**
 * Descarga un archivo desde una URL
 * @param {string} url - URL del archivo a descargar
 * @param {string} [filename] - Nombre del archivo para la descarga
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  
  if (filename) {
    link.setAttribute('download', filename);
  } else {
    // Extraer el nombre del archivo de la URL si no se proporciona
    const urlParts = url.split('/');
    const urlFilename = urlParts[urlParts.length - 1].split('?')[0];
    link.setAttribute('download', urlFilename);
  }
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Convierte un objeto FormData a un objeto JavaScript plano
 * @param {FormData} formData - Objeto FormData
 * @returns {Object} Objeto JavaScript con los datos del formulario
 */
export const formDataToObject = (formData) => {
  const object = {};
  
  for (const [key, value] of formData.entries()) {
    // Manejar campos con múltiples valores (como checkboxes con el mismo nombre)
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (!Array.isArray(object[key])) {
        object[key] = [object[key]];
      }
      object[key].push(value);
    } else {
      object[key] = value;
    }
  }
  
  return object;
};

/**
 * Convierte un objeto JavaScript a un objeto FormData
 * @param {Object} obj - Objeto JavaScript
 * @returns {FormData} Objeto FormData
 */
export const objectToFormData = (obj) => {
  const formData = new FormData();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Para arrays, agregar cada elemento con la misma clave
      value.forEach(item => {
        if (item !== undefined && item !== null) {
          formData.append(key, item);
        }
      });
    } else if (value instanceof FileList) {
      // Para listas de archivos (input type="file" multiple)
      Array.from(value).forEach(file => {
        formData.append(key, file);
      });
    } else if (value !== undefined && value !== null) {
      // Para valores normales
      formData.append(key, value);
    }
  });
  
  return formData;
};

/**
 * Función de utilidad para copiar texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} True si se copió correctamente, false en caso contrario
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    
    // Método alternativo para navegadores más antiguos
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textarea);
      return result;
    } catch (err) {
      console.error('Error al copiar al portapapeles (método alternativo):', err);
      return false;
    }
  }
};
