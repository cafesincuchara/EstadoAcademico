import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente para mostrar mensajes de error
 * @param {Object} props - Propiedades del componente
 * @param {string|Error} [props.error] - Error a mostrar (puede ser un string o un objeto Error)
 * @param {string} [props.className] - Clases CSS adicionales
 * @param {Function} [props.onRetry] - Función a ejecutar al hacer clic en el botón de reintentar
 * @param {string} [props.retryText='Reintentar'] - Texto del botón de reintentar
 * @returns {JSX.Element|null} Componente de mensaje de error o null si no hay error
 */
const ErrorMessage = ({ error, className = '', onRetry, retryText = 'Reintentar' }) => {
  if (!error) return null;
  
  // Obtener el mensaje de error del objeto Error o usar el string directamente
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || 'Ocurrió un error inesperado';

  return (
    <div className={`alert alert-danger ${className}`} role="alert">
      <div className="d-flex align-items-center">
        <i className="fas fa-exclamation-circle me-2"></i>
        <div>
          {errorMessage}
          {onRetry && (
            <div className="mt-2">
              <button 
                className="btn btn-sm btn-outline-danger" 
                onClick={onRetry}
              >
                {retryText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Error),
    PropTypes.shape({
      message: PropTypes.string
    })
  ]),
  className: PropTypes.string,
  onRetry: PropTypes.func,
  retryText: PropTypes.string
};

export default ErrorMessage;
