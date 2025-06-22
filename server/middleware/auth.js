const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
exports.authenticateToken = (req, res, next) => {
    // Obtener el token del header Authorization o de las cookies
    const token = req.headers.authorization?.split(' ')[1] || 
                 req.cookies?.token || 
                 req.query.token;

    if (!token) {
        return res.status(401).json({ 
            success: false,
            error: 'Acceso no autorizado. Token no proporcionado.' 
        });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_del_sistema');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(403).json({ 
            success: false,
            error: 'Token inválido o expirado' 
        });
    }
};

// Middleware para verificar roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                error: 'Usuario no autenticado' 
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                error: 'No tienes permiso para acceder a este recurso' 
            });
        }

        next();
    };
};