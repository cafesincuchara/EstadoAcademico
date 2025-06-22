require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { pool, testConnection } = require('./config/database');

// Importar middlewares
const { authenticateToken } = require('./middleware/auth');

// Importar rutas
const authRoutes = require('./routes/auth');

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:4000', 'http://127.0.0.1:4000'],
    credentials: true
}));

// Rutas de la API
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
    res.json({ message: 'API del Sistema Académico' });
});

// Ruta de prueba de autenticación protegida
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Ruta protegida', 
        user: req.user 
    });
});

// Servir archivos estáticos de la aplicación
app.use(express.static(path.join(__dirname, '../src'), {
    setHeaders: (res, path) => {
        // Configurar los encabezados para los archivos JS
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

// Ruta específica para servir auth.js
app.get('/js/auth.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/js/auth.js'), {
        headers: {
            'Content-Type': 'application/javascript'
        }
    });
});

// Ruta para servir la página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/login/index.html'));
});

// Ruta para servir la página de registro
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/registro/index.html'));
});

// Ruta para servir el panel de estudiante
app.get('/panel-estudiante', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/panel-estudiante/index.html'));
});

// Ruta para servir el panel de administrador
app.get('/panel-admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/panel-admin/index.html'));
});

// Ruta para servir el panel de profesor
app.get('/panel-profesor', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/panel-profesor/index.html'));
});

// Ruta por defecto - Redirigir a login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Algo salió mal en el servidor'
    });
});

// Iniciar el servidor
const startServer = async () => {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
        console.error('No se pudo conectar a la base de datos. Verifica la configuración.');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`Servidor en ejecución en http://localhost:${PORT}`);
    });
};

startServer();