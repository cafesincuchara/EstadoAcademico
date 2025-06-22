import React from 'react';

/**
 * Componente de carga que muestra un spinner de carga
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.message='Cargando...'] - Mensaje a mostrar debajo del spinner
 * @returns {JSX.Element} Componente de spinner de carga
 */
const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <div className="loading-container">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      {message && <p className="mt-2 text-muted">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
