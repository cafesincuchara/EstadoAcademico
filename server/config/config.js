const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Cargar variables de entorno desde .env
const envPath = path.join(__dirname, '../../.env');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️  No se encontró el archivo .env. Usando variables de entorno del sistema.');
}

// Validar variables de entorno requeridas
const requiredEnvVars = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'NODE_ENV'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Variables de entorno faltantes: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Configuración de la aplicación
const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  
  // Base de datos
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  
  // Autenticación JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 1440, // 24 horas
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || 30,
    resetPasswordExpirationMinutes: 10
  },
  
  // CORS
  cors: {
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de peticiones por ventana
  },
  
  // Logging
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
    directory: 'logs',
    maxSize: '10m',
    maxFiles: '14d',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true
  },
  
  // Seguridad
  security: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    saltRounds: 10,
    resetPasswordTokenBytes: 40
  }
};

// Validar configuración de JWT
if (!config.jwt.secret) {
  throw new Error('La variable de entorno JWT_SECRET no está configurada');
}

// Validar configuración de base de datos
if (!config.db.host || !config.db.user || !config.db.database) {
  throw new Error('Configuración de base de datos incompleta. Verifica las variables de entorno.');
}

// Validar configuración de CORS
if (!config.cors.origin || config.cors.origin.length === 0) {
  console.warn('⚠️  No se configuraron orígenes permitidos para CORS. Usando configuración por defecto.');
  config.cors.origin = ['http://localhost:3000', 'http://127.0.0.1:3000'];
}

// Exportar configuración
module.exports = config;
