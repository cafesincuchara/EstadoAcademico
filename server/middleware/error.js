const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger');

/**
 * Convierte un error que no es de instancia de ApiError a ApiError
 */
const errorConverter = (err, req, res, next) => {
  let error = err;
  
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 
      (error.code && error.code >= 400 && error.code < 600 ? error.code : httpStatus.INTERNAL_SERVER_ERROR);
    
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  
  next(error);
};

/**
 * Maneja los errores y envía una respuesta al cliente
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  // Si el entorno no es de desarrollo, no exponer el stack trace
  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }
  
  // Log del error
  const errorResponse = {
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };
  
  // Log del error completo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    logger.error(err);
  } else {
    logger.error(`[${statusCode}] ${message}`, { 
      url: req.originalUrl, 
      method: req.method, 
      ip: req.ip,
      body: req.body,
      params: req.params,
      query: req.query,
      user: req.user ? req.user.id : 'No autenticado'
    });
  }
  
  // Enviar respuesta de error
  res.status(statusCode).json(errorResponse);
};

/**
 * Captura errores 404 y los reenvía al manejador de errores
 */
const notFound = (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Recurso no encontrado'));
};

module.exports = {
  errorConverter,
  errorHandler,
  notFound
};
