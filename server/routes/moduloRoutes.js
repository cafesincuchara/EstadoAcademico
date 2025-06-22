const express = require('express');
const router = express.Router();
const moduloController = require('../controllers/moduloController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Ruta para crear un nuevo módulo (solo usuarios autenticados)
router.post('/', authenticateToken, moduloController.crearModulo);

// Ruta para obtener todos los módulos (público)
router.get('/', moduloController.obtenerModulos);

// Ruta para obtener un módulo por ID
router.get('/:id', moduloController.obtenerModuloPorId);

// Ruta para actualizar un módulo
router.put('/:id', authenticateToken, moduloController.actualizarModulo);

// Ruta para eliminar un módulo
router.delete('/:id', authenticateToken, moduloController.eliminarModulo);

// Ruta para validar un módulo (solo usuarios con permiso de validación)
router.post('/:id/validar', authenticateToken, moduloController.validarModulo);

// Ruta para obtener las validaciones de un módulo
router.get('/:id/validaciones', authenticateToken, moduloController.obtenerValidacionesModulo);

module.exports = router;
