import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Badge, Button } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaSignOutAlt, FaHome, FaBook, FaPlus, FaSearch } from 'react-icons/fa';

/**
 * Layout principal de la aplicación
 * Incluye la barra de navegación y el contenedor principal
 */
const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inicio');
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Actualizar la pestaña activa cuando cambia la ruta
  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes('nuevo')) {
      setActiveTab('nuevo');
    } else if (path.includes('editar')) {
      setActiveTab('editar');
    } else if (path.includes('validar')) {
      setActiveTab('validar');
    } else if (path.includes('modulos/')) {
      setActiveTab('detalle');
    } else {
      setActiveTab('inicio');
    }
    
    // Simular notificaciones (en una aplicación real, esto vendría de una API)
    setNotifications([
      { id: 1, message: 'Tienes 3 módulos pendientes de revisión', read: false, type: 'info', date: '2023-06-01' },
      { id: 2, message: 'El módulo "Matemáticas Básicas" ha sido aprobado', read: true, type: 'success', date: '2023-05-30' },
      { id: 3, message: 'Recordatorio: Revisa los comentarios en tu módulo', read: false, type: 'warning', date: '2023-05-28' },
    ]);
  }, [location]);
  
  // Manejar el cierre de sesión
  const handleLogout = () => {
    // Aquí iría la lógica de cierre de sesión
    console.log('Cerrando sesión...');
    // Redirigir al login
    navigate('/login');
  };
  
  // Manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/modulos?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Contar notificaciones no leídas
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Barra de navegación */}
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid="lg">
          {/* Logo y marca */}
          <Navbar.Brand as={Link} to="/modulos" className="d-flex align-items-center">
            <FaBook className="me-2" />
            <span className="fw-bold">Plataforma Educativa</span>
          </Navbar.Brand>
          
          {/* Botón para móviles */}
          <Navbar.Toggle aria-controls="main-navbar-nav" />
          
          {/* Menú de navegación */}
          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                as={Link} 
                to="/modulos" 
                active={activeTab === 'inicio'}
                className="mx-2"
              >
                <FaHome className="me-1" /> Inicio
              </Nav.Link>
              
              <Nav.Link 
                as={Link} 
                to="/modulos/nuevo" 
                active={activeTab === 'nuevo'}
                className="mx-2"
              >
                <FaPlus className="me-1" /> Nuevo Módulo
              </Nav.Link>
              
              <Nav.Link 
                href="#" 
                className="mx-2"
                disabled
              >
                Mis Cursos
              </Nav.Link>
              
              <Nav.Link 
                href="#" 
                className="mx-2"
                disabled
              >
                Calendario
              </Nav.Link>
            </Nav>
            
            {/* Barra de búsqueda */}
            <form className="d-flex me-3" onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Buscar módulos..."
                  aria-label="Buscar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ minWidth: '200px' }}
                />
                <Button 
                  variant="light" 
                  type="submit"
                  size="sm"
                >
                  <FaSearch />
                </Button>
              </div>
            </form>
            
            {/* Notificaciones */}
            <NavDropdown
              align="end"
              title={
                <div className="position-relative">
                  <FaBell size={20} />
                  {unreadNotifications > 0 && (
                    <Badge 
                      pill 
                      bg="danger" 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.6rem', padding: '0.25em 0.4em' }}
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </div>
              }
              id="notifications-dropdown"
              className="mx-2"
              menuVariant="light"
            >
              <NavDropdown.Header>Notificaciones</NavDropdown.Header>
              {notifications.length > 0 ? (
                <>
                  {notifications.map(notification => (
                    <NavDropdown.Item 
                      key={notification.id} 
                      href="#" 
                      className={`d-flex align-items-center ${!notification.read ? 'fw-bold' : ''}`}
                    >
                      <div className="me-2">
                        {notification.type === 'info' && <span className="text-primary">ℹ️</span>}
                        {notification.type === 'success' && <span className="text-success">✅</span>}
                        {notification.type === 'warning' && <span className="text-warning">⚠️</span>}
                        {notification.type === 'error' && <span className="text-danger">❌</span>}
                      </div>
                      <div>
                        <div>{notification.message}</div>
                        <small className="text-muted">{notification.date}</small>
                      </div>
                    </NavDropdown.Item>
                  ))}
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/notificaciones">
                    Ver todas las notificaciones
                  </NavDropdown.Item>
                </>
              ) : (
                <NavDropdown.Item disabled>No hay notificaciones</NavDropdown.Item>
              )}
            </NavDropdown>
            
            {/* Perfil de usuario */}
            <NavDropdown
              align="end"
              title={
                <div className="d-flex align-items-center">
                  <FaUserCircle size={24} className="me-1" />
                  <span className="d-none d-lg-inline">Usuario</span>
                </div>
              }
              id="user-dropdown"
              menuVariant="light"
            >
              <NavDropdown.Header>Mi Cuenta</NavDropdown.Header>
              <NavDropdown.Item as={Link} to="/perfil">
                <FaUserCircle className="me-2" /> Perfil
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/configuracion">
                <i className="fas fa-cog me-2"></i> Configuración
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Cerrar sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Contenido principal */}
      <main className="flex-grow-1 py-4">
        <Container fluid="lg">
          <Outlet />
        </Container>
      </main>
      
      {/* Pie de página */}
      <footer className="bg-light py-4 mt-auto border-top">
        <Container fluid="lg">
          <div className="row">
            <div className="col-md-6">
              <h5>Plataforma Educativa</h5>
              <p className="text-muted">
                Herramienta para la gestión y validación de módulos educativos.
              </p>
            </div>
            <div className="col-md-3">
              <h5>Enlaces rápidos</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none">Inicio</a></li>
                <li><a href="#" className="text-decoration-none">Módulos</a></li>
                <li><a href="#" className="text-decoration-none">Cursos</a></li>
                <li><a href="#" className="text-decoration-none">Ayuda</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5>Contacto</h5>
              <ul className="list-unstyled">
                <li><i className="fas fa-envelope me-2"></i> soporte@plataforma.edu</li>
                <li><i className="fas fa-phone me-2"></i> +123 456 7890</li>
                <li><i className="fas fa-map-marker-alt me-2"></i> Ciudad, País</li>
              </ul>
            </div>
          </div>
          <hr />
          <div className="text-center text-muted">
            <small>© {new Date().getFullYear()} Plataforma Educativa. Todos los derechos reservados.</small>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout;
