# Sistema de Gestión Académica

Sistema completo para la gestión de estudiantes, profesores y administradores de una institución educativa.

## 🚀 Características

- Autenticación de usuarios (Estudiantes, Profesores, Administradores)
- Panel de administración
- Gestión de estudiantes y profesores
- Control académico
- Interfaz responsiva

## 🛠️ Requisitos

- Node.js 14+
- NPM o Yarn

## 🚀 Instalación

1. Clona el repositorio:
   ```bash
   git clone [url-del-repositorio]
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm start
   # o
   yarn start
   ```

4. Abre tu navegador en: [http://localhost:3000](http://localhost:3000)

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
