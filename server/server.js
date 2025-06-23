// Cargar variables de entorno primero
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Verificar variables de entorno requeridas
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Faltan variables de entorno requeridas: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Importar dependencias
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const httpStatus = require('http-status');

console.log('🔑 Variables de entorno cargadas correctamente');

// Importar configuración
const { pool, testConnection } = require('./config/database');
const ApiError = require('./utils/ApiError');
const { errorConverter, errorHandler } = require('./middleware/error');

// Importar rutas y middlewares
const { router: authRouter, authenticate } = require('./routes/auth');

// Crear la aplicación Express
const app = express();

// Configuración de puerto
const PORT = process.env.PORT || 4000;

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:4000', 'http://127.0.0.1:4000'];
      
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'El origen de la petición no está permitido por CORS';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message: 'Demasiadas peticiones desde esta IP, por favor intente de nuevo más tarde.'
});

// Configuración de seguridad de encabezados HTTP
const cspDefaults = helmet.contentSecurityPolicy.getDefaultDirectives();

// Configuración personalizada de CSP
app.use(
  helmet({
    contentSecurityPolicy: false, // Desactivamos temporalmente CSP para simplificar la depuración
    crossOriginEmbedderPolicy: false, // Necesario para ciertos recursos
    crossOriginOpenerPolicy: false,   // Necesario para ciertas redirecciones
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Permitir recursos de diferentes orígenes
    dnsPrefetchControl: false,        // Control de precarga de DNS
    frameguard: { action: 'sameorigin' }, // Permitir iframes del mismo origen
    hidePoweredBy: true,              // Ocultar cabecera X-Powered-By
    hsts: { maxAge: 15552000, includeSubDomains: true }, // HSTS
    ieNoOpen: true,                  // Prevenir apertura de archivos en el contexto de IE
    noSniff: true,                   // Prevenir MIME type sniffing
    referrerPolicy: { policy: 'same-origin' }, // Política de referente
    xssFilter: false                 // Desactivar filtro XSS del navegador (puede causar problemas)
  })
);

// Configuración personalizada de CSP
app.use((req, res, next) => {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://code.jquery.com https://cdnjs.cloudflare.com https://kit.fontawesome.com https://cdn.datatables.net",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.datatables.net https://fonts.gstatic.com",
    "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
    "img-src 'self' data: https: https://ui-avatars.com https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.cloudflare.com https://*.bootstrapcdn.com https://*.fontawesome.com",
    "connect-src 'self' https://kit.fontawesome.com https://api.ui-avatars.com http://localhost:4000 http://127.0.0.1:4000",
    "frame-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' http://localhost:4000 http://127.0.0.1:4000"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', csp);
  next();
});

// Configuración de CORS
app.use(cors(corsOptions));

// Configuración de rate limiting
app.use('/api', limiter);

// Body parser, leyendo datos del body en req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitizar datos contra inyección NoSQL
app.use(mongoSanitize());

// Prevenir ataques XSS
app.use(xss());

// Prevenir parámetros de consulta contaminados
app.use(hpp({
  whitelist: [
    'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
  ]
}));

// Compresión de respuestas
app.use(compression());

// Middleware para archivos estáticos
app.use('/css', express.static(path.join(__dirname, '../src/css'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));

app.use('/js', express.static(path.join(__dirname, '../src/js')));

// Primero, configuramos las rutas específicas

// Ruta para servir la página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/pages/login/index.html'));
});

// Ruta para servir la página de registro
app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/pages/registro/index.html'));
});

// Ruta para servir el panel de administrador
app.get('/panel-admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/pages/panel-admin/index.html'));
});

// Ruta para servir el panel de profesor
app.get('/panel-profesor', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/pages/panel-profesor/index.html'));
});

// Ruta para servir el panel de estudiante
app.get('/panel-estudiante', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/pages/panel-estudiante/index.html'));
});

// Configuración de archivos estáticos
app.use('/img', express.static(path.join(__dirname, '../src/img')));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, '..'), {
  setHeaders: (res, path) => {
    // Configurar los encabezados para los archivos JS
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
    // Permitir credenciales
    res.set('Access-Control-Allow-Credentials', 'true');
    // Configurar CORS para archivos estáticos
    res.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
  },
  index: false, // Evitar que busque index.html automáticamente
  dotfiles: 'ignore',
  etag: true,
  extensions: ['htm', 'html'],
  fallthrough: true,
  immutable: false,
  maxAge: '1d',
  redirect: true,
  lastModified: true
}));

// Servir archivos estáticos del directorio src
app.use('/src', express.static(path.join(__dirname, '../src'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

// Servir archivos estáticos públicos (si existen)
app.use('/public', express.static(path.join(__dirname, '../public')));

// Configuración de cookies
app.use(cookieParser());

// Test de conexión a la base de datos
app.use(async (req, res, next) => {
  try {
    await testConnection();
    next();
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error de conexión a la base de datos'));
  }
});

// Registrar hora de la petición
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Rutas de la API
app.use('/api/v1/auth', authRouter);

// Ruta de estado del servidor
app.get('/api/v1/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Servidor en funcionamiento',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rutas para los paneles
app.get('/panel-admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/panel-admin/index.html'));
});

app.get('/panel-profesor', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/panel-profesor/index.html'));
});

app.get('/panel-estudiante', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/panel-estudiante/index.html'));
});

// Ruta de documentación
app.get('/api/v1/docs', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      endpoints: {
        auth: {
          login: 'POST /api/v1/auth/login',
          register: 'POST /api/v1/auth/register',
          me: 'GET /api/v1/auth/me',
          refresh: 'POST /api/v1/auth/refresh-token',
          logout: 'POST /api/v1/auth/logout'
        },
        users: {
          getAll: 'GET /api/v1/users',
          getOne: 'GET /api/v1/users/:id',
          update: 'PATCH /api/v1/users/:id',
          delete: 'DELETE /api/v1/users/:id'
        }
      }
    }
  });
});

app.get('/api', (req, res) => {
  res.json({ message: 'API del Sistema Académico' });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '¡Bienvenido al Sistema de Gestión Académica!',
    documentation: '/api/v1/docs',
    timestamp: new Date().toISOString()
  });
});

// Montar rutas de autenticación
app.use('/api/auth', authRouter);

// Ruta de prueba de autenticación protegida
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Ruta protegida', 
    data: { user: req.user }
  });
});

// Ruta específica para servir auth.js
app.get('/js/auth.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/js/auth.js'), {
    headers: {
      'Content-Type': 'application/javascript'
    }
  });
});

// Manejador de rutas no encontradas
app.all('*', (req, res, next) => {
  next(new ApiError(`No se pudo encontrar ${req.originalUrl} en este servidor`, httpStatus.NOT_FOUND));
});

// Convertir errores a ApiError
app.use(errorConverter);

// Manejador de errores global
app.use(errorHandler);

// Iniciar el servidor
const startServer = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 Servidor corriendo en modo ${process.env.NODE_ENV || 'development'} en http://localhost:${PORT}`);
      console.log(`📚 Documentación disponible en http://localhost:${PORT}/api/v1/docs`);
      console.log(`⏰ ${new Date().toLocaleString()}`);
      console.log('----------------------------------------');
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} is already in use`);
        console.log('Trying alternative port...');
        app.listen(PORT + 1);
      } else {
        console.error('Server error:', err);
      }
    });

    // Manejadores de errores no capturados
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Apagando...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECIBIDO. Cerrando servidor...');
      server.close(() => {
        console.log('💥 Proceso terminado');
      });
    });

    return server;
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar la aplicación
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;