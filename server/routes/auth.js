const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, query } = require('../config/database');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Configuración de límite de tasa para prevenir ataques de fuerza bruta
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Límite de 10 intentos por ventana
  message: { 
    success: false, 
    error: 'Demasiados intentos, por favor intente de nuevo más tarde' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware para validar campos
const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      errors: errorMessages
    });
  };
};

// Función para generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Middleware para verificar autenticación
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No se proporcionó token de autenticación'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar si el usuario existe
    const [user] = await query(
      'SELECT id, nombre, email, username, role FROM usuarios WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Agregar información del usuario a la solicitud
    req.user = user;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado, por favor inicie sesión nuevamente'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error en la autenticación'
    });
  }
};

// Middleware para verificar roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'No tiene permiso para realizar esta acción'
      });
    }
    next();
  };
};

// Ruta de registro
router.post('/register', [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 100 }).withMessage('El nombre no puede tener más de 100 caracteres'),
    
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es requerido')
    .isEmail().withMessage('Ingrese un correo electrónico válido')
    .isLength({ max: 100 }).withMessage('El correo electrónico no puede tener más de 100 caracteres')
    .normalizeEmail(),
    
  body('username')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
    
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula'),
    
  body('role')
    .isIn(['alumno', 'profesor', 'admin']).withMessage('Rol no válido')
], validate, authLimiter, async (req, res) => {
  try {
    let { nombre, email, username, password, role } = req.body;
    
    // Normalizar el rol a minúsculas
    role = role.toLowerCase();

    // Verificar si el usuario ya existe
    const [existingUsers] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'El correo o nombre de usuario ya está en uso'
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, username, password, role) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, username, hashedPassword, role]
    );

    // Crear token JWT
    const token = jwt.sign(
      { id: result.insertId, email, role },
      process.env.JWT_SECRET || 'tu_secreto_secreto',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: result.insertId,
        nombre,
        email,
        username,
        role
      }
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error en el servidor al registrar el usuario'
    });
  }
});

// Ruta de login
router.post('/login', [
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es requerido')
    .isEmail().withMessage('Ingrese un correo electrónico válido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
], validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    const user = users[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'tu_secreto_secreto',
      { expiresIn: '24h' }
    );

    // Configurar cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    // Enviar respuesta exitosa
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({
      success: false,
      error: 'Error en el servidor al iniciar sesión'
    });
  }
});

// Ruta de logout
router.post('/logout', (req, res) => {
  // Limpiar la cookie de autenticación
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Sesión cerrada correctamente'
  });
});

// Ruta para verificar autenticación
router.get('/verify', (req, res) => {
  // El middleware de autenticación se encargará de verificar el token
  // Si llega aquí, el token es válido
  res.json({
    success: true,
    message: 'Token válido',
    user: req.user // Esto será establecido por el middleware de autenticación
  });
});

// Exportar el router y los middlewares
module.exports = {
  router,
  authenticate,
  authorize
};

// Asignar los middlewares al router para acceso directo
router.authenticate = authenticate;
router.authorize = authorize;
