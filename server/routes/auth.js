const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { body, validationResult } = require('express-validator');

// Middleware para validar campos
const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Ruta de registro
router.post('/register', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Ingrese un correo electrónico válido'),
  body('username').notEmpty().withMessage('El nombre de usuario es requerido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role').isIn(['alumno', 'profesor', 'admin']).withMessage('Rol no válido'),
  validateFields
], async (req, res) => {
  try {
    const { nombre, email, username, password, role } = req.body;

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
  body('email').isEmail().withMessage('Ingrese un correo electrónico válido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validateFields
], async (req, res) => {
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

module.exports = router;
