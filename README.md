# 🎓 Sistema de Gestión Académica

Un sistema completo para la gestión académica de instituciones educativas, desarrollado con Node.js, Express y MySQL.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16.x-brightgreen)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)

## 🚀 Características principales

- **Autenticación segura** con JWT y refresh tokens
- **Roles de usuario**: Administrador, Profesor, Estudiante
- **Panel de administración** completo
- **API RESTful** documentada
- **Seguridad mejorada** con Helmet, rate limiting, sanitización
- **Logging** completo de actividades
- **Validación de datos** con express-validator
- **Manejo de errores** centralizado
- **CORS** configurable
- **Variables de entorno** para configuración

## 📋 Requisitos del sistema

- Node.js 16.x o superior
- MySQL 8.0 o superior
- npm 8.x o superior
- Git (recomendado)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd sistema-gestion-academica
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar el archivo .env con tus credenciales
   ```

4. **Iniciar la base de datos**
   ```bash
   # Crear la base de datos
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sistema_academico;"
   
   # Ejecutar migraciones
   npm run migrate:up
   
   # Opcional: Cargar datos de prueba
   npm run seed
   ```

5. **Iniciar el servidor**
   ```bash
   # Modo desarrollo (con reinicio automático)
   npm run dev
   
   # Modo producción
   npm start
   ```

6. **Acceder a la aplicación**
   - API: http://localhost:4000/api/v1
   - Documentación: http://localhost:4000/api/v1/docs

## 📂 Estructura del proyecto

```
sistema-gestion-academica/
├── server/
│   ├── config/           # Configuraciones de la aplicación
│   │   ├── config.js     # Configuración principal
│   │   ├── database.js   # Configuración de la base de datos
│   │   └── logger.js     # Configuración de logs
│   │
│   ├── controllers/     # Controladores de la API
│   │   └── auth.controller.js
│   │
│   ├── middleware/      # Middlewares personalizados
│   │   ├── auth.js       # Autenticación
│   │   └── error.js      # Manejo de errores
│   │
│   ├── models/         # Modelos de datos
│   │   └── user.model.js
│   │
│   ├── routes/         # Rutas de la API
│   │   └── auth.routes.js
│   │
│   ├── services/       # Lógica de negocio
│   │   └── auth.service.js
│   │
│   ├── utils/          # Utilidades
│   │   ├── ApiError.js   # Clase de errores personalizados
│   │   └── logger.js     # Utilidades de logging
│   │
│   └── server.js       # Punto de entrada de la aplicación
│
├── public/             # Archivos estáticos
├── .env                 # Variables de entorno
├── .eslintrc.js         # Configuración de ESLint
├── .gitignore           # Archivos a ignorar por Git
├── package.json         # Dependencias y scripts
└── README.md            # Este archivo
```

## 🔒 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Aplicación
NODE_ENV=development
PORT=4000

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=sistema_academico

# Autenticación
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_ACCESS_EXPIRATION_MINUTES=1440  # 24 horas
JWT_REFRESH_EXPIRATION_DAYS=30

# CORS (separados por comas sin espacios)
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 🚦 Scripts disponibles

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm test` - Ejecuta las pruebas
- `npm run test:coverage` - Genera informe de cobertura de pruebas
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código con Prettier
- `npm run migrate:up` - Ejecuta migraciones
- `npm run migrate:down` - Revierte migraciones
- `npm run seed` - Carga datos de prueba

## 🔒 Seguridad

El proyecto incluye las siguientes características de seguridad:

- Autenticación JWT con refresh tokens
- Rate limiting para prevenir ataques de fuerza bruta
- Sanitización de datos de entrada
- Prevención de inyección SQL
- Headers de seguridad con Helmet
- Validación de datos con express-validator
- CORS configurable
- Variables de entorno para datos sensibles

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Reconocimientos

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [JWT](https://jwt.io/)
- [Winston](https://github.com/winstonjs/winston)
- [Express Validator](https://express-validator.github.io/)
- [Helmet](https://helmetjs.github.io/)

---

Desarrollado con ❤️ por [Tu Nombre] | [@tuusuario](https://github.com/tuusuario) 

## 📁 Estructura del Proyecto

```
├── public/                 # Archivos estáticos
│   ├── css/               # Estilos CSS
│   ├── js/                # Scripts JavaScript
│   └── images/            # Imágenes
├── src/                   # Código fuente
│   ├── pages/             # Páginas de la aplicación
│   │   ├── login/         # Página de inicio de sesión
│   │   ├── registro/      # Página de registro
│   │   ├── panel-admin/   # Panel de administración
│   │   ├── panel-profesor/ # Panel de profesores
│   │   └── panel-estudiante/ # Panel de estudiantes
│   ├── components/        # Componentes reutilizables
│   ├── utils/             # Utilidades
│   └── config/            # Configuración
├── server.js              # Servidor Node.js
├── package.json           # Dependencias y scripts
└── README.md              # Este archivo
```

## 📝 Uso

1. **Como Administrador**:
   - Gestiona usuarios, cursos y configuraciones del sistema.
   - Accede a reportes y estadísticas.

2. **Como Profesor**:
   - Gestiona calificaciones y asistencias.
   - Comunícate con estudiantes.

3. **Como Estudiante**:
   - Revisa tus calificaciones y asistencias.
   - Accede a material de estudio.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

Sistema web para la gestión de un negocio de café, incluyendo módulos para profesores, dashboard y registro de usuarios.

## Requisitos

- Navegador web moderno
- Conexión a internet

## Estructura de Archivos

- `public/index.html`: Página principal
- `public/dashboard.html`: Panel de control
- `public/profesor.html`: Módulo para profesores
- `public/register.html`: Formulario de registro
- `src/js/dashboard.js`: Lógica del dashboard
- `src/js/js.js`: Funcionalidades generales
- `public/css/style.css`: Estilos principales
- `public/css/style1.css`: Estilos adicionales
- `public/css/style2.css`: Estilos complementarios
