import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ModuloProvider } from './ModuloContext';
import ModuloRoutes from './ModuloRoutes';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import './ModuloList.css';
import './NuevoModulo.css';
import './ModuloApp.css';
import { ToastContainer } from 'react-toastify';

// Función para inicializar la aplicación de módulos
function initModulosApp() {
  const container = document.getElementById('modulos-container');
  
  if (container) {
    // Limpiar el contenedor
    container.innerHTML = '';
    
    // Crear un nuevo elemento para la aplicación React
    const appContainer = document.createElement('div');
    appContainer.id = 'modulos-app';
    container.appendChild(appContainer);
    
    const root = createRoot(appContainer);
    
    root.render(
      <React.StrictMode>
        <BrowserRouter basename="/panel-estudiante">
          <ModuloProvider>
            <div className="modulos-app-container">
              <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              <ModuloRoutes />
            </div>
          </ModuloProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  } else {
    console.error('No se encontró el contenedor de módulos');
  }
}

// Verificar si el DOM ya está cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModulosApp);
} else {
  initModulosApp();
}

// Hacer la función accesible globalmente para ser llamada desde otros scripts
window.initModulosApp = initModulosApp;
