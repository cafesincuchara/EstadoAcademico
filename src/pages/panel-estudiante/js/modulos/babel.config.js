module.exports = (api) => {
  // Esta opción de caché ayudará a mejorar el rendimiento
  const isProd = api.cache(() => process.env.NODE_ENV === 'production');
  
  // Configuración de presets
  const presets = [
    [
      '@babel/preset-env',
      {
        // Configuración para navegadores con más del 0.2% de uso
        // y versiones no mantenidas de navegadores
        targets: {
          browsers: ['>0.2%', 'not dead', 'not op_mini all'],
        },
        // Usar polyfills solo cuando sea necesario
        useBuiltIns: 'usage',
        // Usar la versión 3 de core-js
        corejs: '3.22',
        // No transformar módulos (dejamos que webpack los maneje)
        modules: false,
        // Excluir transformaciones que ya no son necesarias
        exclude: ['transform-typeof-symbol'],
      },
    ],
    // Preset de React con el nuevo JSX transform
    ['@babel/preset-react', { runtime: 'automatic' }],
  ];

  // Configuración de plugins
  const plugins = [
    // Soporte para propiedades de clase
    '@babel/plugin-proposal-class-properties',
    // Soporte para propiedades privadas de clase
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    // Soporte para propiedades privadas con #
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    // Mejor manejo de async/await
    '@babel/plugin-transform-runtime',
    // Soporte para el operador de encadenamiento opcional
    '@babel/plugin-proposal-optional-chaining',
    // Soporte para el operador de fusión nula
    '@babel/plugin-proposal-nullish-coalescing-operator',
    // Mejor depuración en desarrollo
    !isProd && 'react-refresh/babel',
    // Mejor manejo de módulos en desarrollo
    !isProd && ['babel-plugin-module-resolver', {
      root: ['./src'],
      alias: {
        '@': './src',
      },
    }],
    // Mejor rendimiento en producción
    isProd && 'babel-plugin-transform-react-remove-prop-types',
    isProd && 'babel-plugin-transform-react-constant-elements',
    isProd && 'babel-plugin-transform-react-inline-elements',
    isProd && 'babel-plugin-transform-react-pure-class-to-function',
  ].filter(Boolean);

  return {
    presets,
    plugins,
    // Configuración adicional para entornos
    env: {
      development: {
        // Plugins específicos para desarrollo
        plugins: [
          'babel-plugin-styled-components',
        ],
      },
      production: {
        // Plugins específicos para producción
        plugins: [
          ['babel-plugin-styled-components', {
            displayName: false,
            minify: true,
            transpileTemplateLiterals: true,
          }],
          'babel-plugin-jsx-remove-data-test-id',
        ],
      },
      test: {
        // Configuración para pruebas
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-react',
        ],
      },
    },
  };
};
