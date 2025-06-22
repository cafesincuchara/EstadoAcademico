# Módulo de Gestión de Contenidos Educativos

Este es un módulo React para la gestión y validación de contenidos educativos en la plataforma de aprendizaje.

## Características

- 🚀 Listado de módulos educativos con búsqueda y filtrado
- 📝 Creación y edición de módulos con editor de texto enriquecido
- 📎 Gestión de archivos adjuntos (PDF, documentos, imágenes)
- ✅ Sistema de validación de contenidos
- 👥 Roles y permisos personalizables
- 📱 Diseño responsive y accesible
- 🌐 Internacionalización lista para usar
- 🔄 Estado global con Context API

## Requisitos

- Node.js 14+ y npm 6+
- React 17+
- React Router DOM 6+
- Bootstrap 5+
- React Icons
- React Quill (editor de texto enriquecido)
- Axios para peticiones HTTP

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
# o
yarn install
```

3. Configurar las variables de entorno (ver `.env.example`)
4. Iniciar la aplicación:

```bash
npm start
# o
yarn start
```

## Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
├── context/            # Contextos de React
├── hooks/              # Custom hooks
├── layouts/            # Layouts de la aplicación
├── pages/              # Páginas de la aplicación
├── services/           # Servicios y APIs
├── styles/             # Estilos globales
├── utils/              # Utilidades y helpers
├── App.js              # Componente principal
└── index.js            # Punto de entrada
```

## Uso

### Inicialización

```javascript
import { initModuloApp } from './modulos';

// Inicializar la aplicación en un contenedor con ID 'modulo-app'
initModuloApp('modulo-app', {
  // Opciones de configuración
  apiUrl: 'https://api.ejemplo.com',
  theme: 'light',
  // ...
});
```

### Componentes Principales

#### Lista de Módulos

```jsx
import { ModuloList } from './modulos';

function App() {
  return (
    <div className="app">
      <ModuloList />
    </div>
  );
}
```

#### Crear/Editar Módulo

```jsx
import { NuevoModulo, EditarModulo } from './modulos';

// Crear nuevo módulo
<NuevoModulo />

// Editar módulo existente
<EditarModulo moduloId={123} />
```

## Configuración

Copia el archivo `.env.example` a `.env` y configura las variables necesarias:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0
```

## Despliegue

Para crear una versión optimizada para producción:

```bash
npm run build
# o
yarn build
```

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añade nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Soporte

Para soporte, por favor abra un issue en el repositorio o contacte a soporte@ejemplo.com.

---

Desarrollado por [Tu Nombre] - [@tuusuario](https://github.com/tuusuario)
