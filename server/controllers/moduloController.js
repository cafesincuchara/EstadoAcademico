const db = require('../config/database');

// Obtener un módulo por ID
exports.obtenerModuloPorId = async (req, res) => {
    const { id } = req.params;
    
    try {
        const modulo = await db.query('SELECT * FROM modulos WHERE id = ?', [id]);
        
        if (modulo.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Módulo no encontrado' 
            });
        }
        
        res.json({ success: true, data: modulo[0] });
    } catch (error) {
        console.error('Error al obtener módulo por ID:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener el módulo',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Actualizar un módulo existente
exports.actualizarModulo = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, contenido } = req.body;
    const actualizado_por = req.user.id;
    
    try {
        // Verificar si el módulo existe
        const [moduloExistente] = await db.query('SELECT * FROM modulos WHERE id = ?', [id]);
        
        if (moduloExistente.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Módulo no encontrado' 
            });
        }
        
        // Actualizar el módulo
        await db.query(
            'UPDATE modulos SET nombre = ?, descripcion = ?, contenido = ?, actualizado_por = ?, actualizado_en = NOW() WHERE id = ?',
            [nombre, descripcion, contenido, actualizado_por, id]
        );
        
        // Obtener el módulo actualizado
        const [moduloActualizado] = await db.query('SELECT * FROM modulos WHERE id = ?', [id]);
        
        res.json({ success: true, data: moduloActualizado[0] });
    } catch (error) {
        console.error('Error al actualizar módulo:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al actualizar el módulo',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Eliminar un módulo
exports.eliminarModulo = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Verificar si el módulo existe
        const [moduloExistente] = await db.query('SELECT * FROM modulos WHERE id = ?', [id]);
        
        if (moduloExistente.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Módulo no encontrado' 
            });
        }
        
        // Eliminar el módulo
        await db.query('DELETE FROM modulos WHERE id = ?', [id]);
        
        res.json({ success: true, message: 'Módulo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar módulo:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al eliminar el módulo',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Crear un nuevo módulo
exports.crearModulo = async (req, res) => {
    const { nombre, descripcion, contenido } = req.body;
    const creado_por = req.user.id;
    
    try {
        // Insertar el nuevo módulo usando la función query del módulo de base de datos
        const result = await db.query(
            'INSERT INTO modulos (nombre, descripcion, contenido, creado_por) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, contenido, creado_por]
        );
        
        // Obtener el módulo recién creado
        const modulo = await db.query('SELECT * FROM modulos WHERE id = ?', [result.insertId]);
        
        res.status(201).json({ success: true, data: modulo[0] });
    } catch (error) {
        console.error('Error al crear módulo:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al crear el módulo', 
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};

// Obtener todos los módulos
exports.obtenerModulos = async (req, res) => {
    try {
        const modulos = await db.query('SELECT * FROM modulos ORDER BY creado_en DESC');
        res.json({ success: true, data: modulos });
    } catch (error) {
        console.error('Error al obtener módulos:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener los módulos',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Validar un módulo
exports.validarModulo = async (req, res) => {
    const { id } = req.params;
    const { valido, comentarios } = req.body;
    const validado_por = req.user.id;
    
    // Obtener una conexión del pool para realizar una transacción
    const connection = await db.getConnection();
    
    try {
        // Iniciar transacción
        await connection.beginTransaction();
        
        // Actualizar el estado de validación del módulo
        await connection.query(
            'UPDATE modulos SET validado = ?, validado_por = ?, validado_en = NOW() WHERE id = ?',
            [valido, validado_por, id]
        );
        
        // Registrar la validación en el historial
        await connection.query(
            'INSERT INTO validaciones_modulos (modulo_id, valido, comentarios, validado_por) VALUES (?, ?, ?, ?)',
            [id, valido, comentarios, validado_por]
        );
        
        // Confirmar la transacción
        await connection.commit();
        
        // Obtener el módulo actualizado
        const [modulo] = await connection.query('SELECT * FROM modulos WHERE id = ?', [id]);
        
        // Liberar la conexión
        connection.release();
        
        res.json({ success: true, data: modulo[0] });
    } catch (error) {
        // Revertir la transacción en caso de error
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        
        console.error('Error al validar módulo:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al validar el módulo',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obtener validaciones de un módulo
exports.obtenerValidacionesModulo = async (req, res) => {
    const { id } = req.params;
    
    try {
        const validaciones = await db.query(
            'SELECT v.*, u.nombre as validador_nombre, u.apellido as validador_apellido ' +
            'FROM validaciones_modulos v ' +
            'JOIN usuarios u ON v.validado_por = u.id ' +
            'WHERE v.modulo_id = ? ' +
            'ORDER BY v.validado_en DESC',
            [id]
        );
        
        res.json({ success: true, data: validaciones });
    } catch (error) {
        console.error('Error al obtener validaciones:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener el historial de validaciones',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
