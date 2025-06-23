const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const { combine, timestamp, printf, colorize, json } = format;

// Crear directorio de logs si no existe
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Formato personalizado para los logs
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}] ${message} `;
  
  // Si hay metadata, mostrarla
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata, null, 2);
  }
  
  return msg;
});

// Configuración para desarrollo (consola con colores)
const devLogger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [new transports.Console()]
});

// Configuración para producción (archivos de log)
const prodLogger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json()
  ),
  transports: [
    // Escribir todos los logs a combined.log
    new transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
      zippedArchive: true
    }),
    // Escribir logs de error a error.log
    new transports.File({ 
      level: 'error',
      filename: path.join(logDir, 'error.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
      zippedArchive: true
    })
  ],
  exceptionHandlers: [
    new transports.File({ 
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
      zippedArchive: true
    })
  ],
  exitOnError: false
});

// Usar el logger según el entorno
const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

// Capturar excepciones no manejadas
process
  .on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  })
  .on('uncaughtException', (error) => {
    logger.error('Uncaught Exception thrown:', error);
    process.exit(1);
  });

module.exports = logger;
