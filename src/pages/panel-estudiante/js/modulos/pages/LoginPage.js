import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../../js/auth';

/**
 * Página de inicio de sesión
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirigir si ya está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      // Verificar si hay un token de autenticación válido
      const token = localStorage.getItem('auth_token');
      if (token) {
        navigate('/modulos', { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar mensaje de error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validaciones básicas
      if (!formData.email.trim() || !formData.password) {
        throw new Error('Por favor complete todos los campos');
      }

      // Validar formato de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Por favor ingrese un correo electrónico válido');
      }

      // Intentar iniciar sesión
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Redirigir a la página anterior o al dashboard
        const from = location.state?.from || '/modulos';
        toast.success('¡Inicio de sesión exitoso!');
        navigate(from, { replace: true });
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(err.message || 'Error al iniciar sesión. Por favor, intente de nuevo.');
      toast.error(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h2 className="h4 mb-1">Iniciar sesión</h2>
                  <p className="text-muted">Ingrese sus credenciales para continuar</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ingrese su correo electrónico"
                      autoComplete="email"
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label htmlFor="password" className="form-label">
                        Contraseña
                      </label>
                      <Link 
                        to="/forgot-password" 
                        className="small text-decoration-none"
                      >
                        ¿Olvidó su contraseña?
                      </Link>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Ingrese su contraseña"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                  </div>


                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Iniciando sesión...
                        </>
                      ) : 'Iniciar sesión'}
                    </button>
                  </div>
                </form>

              </div>
            </div>

            <div className="text-center mt-3">
              <p className="text-muted">
                ¿No tiene una cuenta?{' '}
                <Link to="/register" className="text-decoration-none">
                  Regístrese aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
