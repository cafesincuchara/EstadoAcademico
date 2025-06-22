import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../utils';

/**
 * Componente para mostrar el historial de validaciones de un módulo
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.validaciones - Lista de validaciones
 * @param {Function} [props.onLoadMore] - Función para cargar más validaciones (paginación)
 * @param {boolean} [props.hasMore=false] - Indica si hay más validaciones por cargar
 * @param {boolean} [props.loading=false] - Indica si se están cargando más validaciones
 * @returns {JSX.Element} Componente de lista de validaciones
 */
const ValidacionesList = ({ 
  validaciones = [], 
  onLoadMore, 
  hasMore = false, 
  loading = false 
}) => {
  const [expandedValidacionId, setExpandedValidacionId] = useState(null);

  // Si no hay validaciones, mostrar un mensaje
  if (validaciones.length === 0) {
    return (
      <div className="alert alert-info">
        No hay historial de validaciones para este módulo.
      </div>
    );
  }

  // Manejar la expansión/colapso de una validación
  const toggleValidacion = (id) => {
    setExpandedValidacionId(expandedValidacionId === id ? null : id);
  };

  return (
    <div className="validaciones-list">
      <h5>Historial de Validaciones</h5>
      
      {validaciones.map((validacion) => (
        <div key={validacion.id} className="validacion-item">
          <div 
            className="validacion-header" 
            onClick={() => toggleValidacion(validacion.id)}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <span className="validacion-user">
                {validacion.usuario?.nombre || 'Usuario desconocido'}
              </span>
              <span className="ms-2 badge bg-secondary">
                {validacion.estado}
              </span>
            </div>
            <small className="validacion-date">
              {formatDate(validacion.fechaValidacion)}
            </small>
          </div>
          
          {(expandedValidacionId === validacion.id || validacion.comentario) && (
            <div className="validacion-comment mt-2">
              <strong>Comentario:</strong>
              <p className="mb-0">{validacion.comentario || 'Sin comentarios'}</p>
            </div>
          )}
        </div>
      ))}
      
      {hasMore && (
        <div className="text-center mt-3">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cargando...
              </>
            ) : (
              'Cargar más'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

ValidacionesList.propTypes = {
  validaciones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      estado: PropTypes.string.isRequired,
      comentario: PropTypes.string,
      fechaValidacion: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date)
      ]).isRequired,
      usuario: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nombre: PropTypes.string,
        email: PropTypes.string
      })
    })
  ),
  onLoadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool
};

export default ValidacionesList;
