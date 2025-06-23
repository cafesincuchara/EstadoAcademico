const httpStatus = require('http-status');

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
    
    // Log the error stack in development
    if (process.env.NODE_ENV === 'development') {
      console.error(this.stack);
    }
  }
  
  static badRequest(message) {
    return new ApiError(httpStatus.BAD_REQUEST, message);
  }
  
  static unauthorized(message = 'No autorizado') {
    return new ApiError(httpStatus.UNAUTHORIZED, message);
  }
  
  static forbidden(message = 'No tiene permiso para realizar esta acción') {
    return new ApiError(httpStatus.FORBIDDEN, message);
  }
  
  static notFound(message = 'Recurso no encontrado') {
    return new ApiError(httpStatus.NOT_FOUND, message);
  }
  
  static conflict(message = 'Conflicto con el estado actual del recurso') {
    return new ApiError(httpStatus.CONFLICT, message);
  }
  
  static internal(message = 'Error interno del servidor') {
    return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
}

module.exports = ApiError;
