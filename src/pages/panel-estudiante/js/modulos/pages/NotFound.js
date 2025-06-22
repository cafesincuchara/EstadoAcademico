import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Página 404 - No encontrado
 * @returns {JSX.Element} Componente de página no encontrada
 */
const NotFound = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center py-5">
          <div className="error-template">
            <h1 className="display-1 text-danger">404</h1>
            <h2 className="display-4">Página no encontrada</h2>
            <div className="error-details mb-4">
              Lo sentimos, la página que está buscando no existe o ha sido movida.
            </div>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/modulos" className="btn btn-primary btn-lg">
                <i className="fas fa-home me-2"></i>
                Ir al Inicio
              </Link>
              <button 
                className="btn btn-outline-secondary btn-lg"
                onClick={() => window.history.back()}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Volver Atrás
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
