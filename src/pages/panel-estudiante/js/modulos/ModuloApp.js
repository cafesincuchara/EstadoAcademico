import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-quill/dist/quill.snow.css';
import '../css/modulos.css';

// Utilidades de autenticación
import { isAuthenticated, getUserData, logout } from '../../../js/auth';

// Contextos
import { ModuloProvider } from './context/ModuloContext';

// Componentes
import { LoadingSpinner, ErrorBoundary } from './components';

// Páginas
import { 
  ModuloList, 
  ModuloDetalle, 
  NuevoModulo, 
  EditarModulo, 
  ValidarModulo, 
  NotFound,
  LoginPage
} from './pages';

// Layout
import MainLayout from './layouts/MainLayout';

/**
 * Componente principal de la aplicación de módulos
 * Maneja el enrutamiento y la autenticación
 */
const ModuloApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = isAuthenticated();
        
        if (isAuth) {
          // Obtener datos del usuario desde localStorage
          const userData = getUserData();
          
          if (userData) {
            // Mapear los datos del usuario al formato esperado
            const mappedUser = {
              id: userData.id,
              nombre: userData.nombre || '',
              apellido: userData.apellido || '',
              email: userData.email || '',
              rol: userData.role || 'estudiante',
              avatar: userData.avatar || null,
              // Definir permisos basados en el rol
              puedeCrear: ['admin', 'profesor'].includes(userData.role),
              puedeEditar: ['admin', 'profesor'].includes(userData.role),
              puedeEliminar: userData.role === 'admin',
              puedeValidar: userData.role === 'admin'
            };
            
            setUser(mappedUser);
            setIsAuthenticated(true);
          } else {
            // Si no hay datos de usuario, forzar cierre de sesión
            logout();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error al verificar autenticación:', err);
        setError('No se pudo verificar la sesión. Por favor, recargue la página.');
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Escuchar eventos de autenticación
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token' || e.key === 'user_data') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Renderizar cargando
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <LoadingSpinner size="lg" message="Cargando aplicación..." />
      </div>
    );
  }

  // Mostrar error si lo hay
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button 
            className="btn btn-outline-danger" 
            onClick={() => window.location.reload()}
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated && !isLoading) {
    // Redirigir a la página de login
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  // Renderizar la aplicación
  return (
    <ErrorBoundary>
      <ModuloProvider user={user}>
        <Router>
          <Suspense 
            fallback={
              <div className="d-flex justify-content-center align-items-center vh-100">
                <LoadingSpinner size="lg" message="Cargando contenido..." />
              </div>
            }
          >
            <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
            
            {/* Rutas protegidas */}
            <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" state={{ from: window.location.pathname }} replace />}>
              <Route index element={<ModuloList />} />
              <Route path="nuevo" element={user?.puedeCrear ? <NuevoModulo /> : <Navigate to="/" replace />} />
              <Route path=":id" element={<ModuloDetalle />} />
              <Route path=":id/editar" element={user?.puedeEditar ? <EditarModulo /> : <Navigate to="/" replace />} />
              <Route path=":id/validar" element={user?.puedeValidar ? <ValidarModulo /> : <Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          </Suspense>
          
          {/* Toast de notificaciones */}
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
            theme="light"
          />
        </Router>
      </ModuloProvider>
    </ErrorBoundary>
  );
};

export default ModuloApp;
