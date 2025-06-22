module.exports = {
  plugins: {
    // Agregar prefijos de proveedores automáticamente
    'postcss-preset-env': {
      stage: 3, // Características CSS estables
      features: {
        // Habilita características CSS personalizadas
        'custom-properties': {
          preserve: false, // Reducir el CSS eliminando las propiedades personalizadas cuando sea posible
        },
        'nesting-rules': true, // Habilita reglas anidadas
        'custom-media-queries': true, // Habilita consultas de medios personalizadas
        'media-query-ranges': true, // Habilita rangos en consultas de medios (min/max)
        'custom-selectors': true, // Habilita selectores personalizados
      },
      // Navegadores objetivo (puedes ajustar según tus necesidades)
      browsers: [
        '> 0.2%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
        'not IE 11',
        'not op_mini all',
      ],
    },
    
    // Optimización de CSS
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: ['default', {
        discardComments: {
          removeAll: true, // Eliminar todos los comentarios en producción
        },
        // No minificar calc() ya que puede romper algunos diseños
        calc: false,
        // No convertir colores a sus equivalentes más cortos
        colormin: false,
      }]
    } : false,
    
    // Agregar prefijos automáticamente para mayor compatibilidad
    'autoprefixer': {},
    
    // Mejorar la legibilidad del CSS anidado
    'postcss-nested': {},
    
    // Variables CSS para navegadores antiguos
    'postcss-custom-properties': {
      preserve: false, // No preservar las variables CSS originales
    },
    
    // Soporte para funciones CSS modernas
    'postcss-functions': {
      functions: {
        // Ejemplo de función personalizada
        // Puedes agregar más según sea necesario
        rem: (px) => {
          const baseFontSize = 16; // Tamaño de fuente base en píxeles
          const remValue = parseFloat(px) / baseFontSize;
          return `${remValue}rem`;
        },
      },
    },
    
    // Ordenar las propiedades CSS de manera consistente
    'postcss-sorting': {
      'properties-order': 'alphabetical',
      'unspecified-properties-position': 'bottom',
    },
    
    // Agregar soporte para CSS Grid en navegadores antiguos
    'autoprefixer': {
      grid: 'autoplace',
    },
  },
};

// Configuración para entornos específicos
if (process.env.NODE_ENV === 'production') {
  // Optimizaciones adicionales para producción
  module.exports.plugins.cssnano = {
    preset: ['default', {
      discardComments: {
        removeAll: true,
      },
      normalizeWhitespace: true,
      discardUnused: true,
      mergeIdents: false, // Evitar fusionar identificadores que podrían romper el CSS
      reduceIdents: false, // Evitar reducir identificadores que podrían romper el CSS
    }]
  };
  
  // Deshabilitar sourcemaps en producción
  module.exports.map = false;
} else {
  // Configuración para desarrollo
  module.exports.plugins['postcss-reporter'] = {
    clearReportedMessages: true,
  };
  
  // Habilitar sourcemaps en desarrollo
  module.exports.map = {
    inline: true,
    annotation: true,
    sourcesContent: true,
  };
}

// Exportar la configuración
module.exports = {
  ...module.exports,
  // Configuración adicional para ciertos entornos o herramientas
  plugins: Object.entries(module.exports.plugins)
    .filter(([_, value]) => value !== false) // Eliminar plugins deshabilitados
    .reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value === true ? {} : value, // Manejar configuraciones booleanas
    }), {}),
};
