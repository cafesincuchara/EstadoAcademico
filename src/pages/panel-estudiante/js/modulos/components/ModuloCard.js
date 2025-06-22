import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate, getEstadoInfo, truncateText } from '../utils';

/**
 * Componente de tarjeta para mostrar información resumida de un módulo
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.modulo - Objeto con la información del módulo
 * @param {boolean} [props.showActions=true] - Indica si se deben mostrar las acciones (editar, validar, etc.)
 * @returns {JSX.Element} Componente de tarjeta de módulo
 */
const ModuloCard = ({ modulo, showActions = true }) => {
  if (!modulo) return null;

  const { id, titulo, descripcion, estado, creadoPor, fechaCreacion } = modulo;
  const estadoInfo = getEstadoInfo(estado);
  
  return (
    <div className="modulo-card">
      <div className="modulo-card-header">
        <h5 className="mb-0">{titulo}</h5>
        <span className={`status-badge ${estadoInfo.className}`}>
          {estadoInfo.text}
        </span>
      </div>
      
      <div className="modulo-card-body">
        <p className="text-muted mb-2">
          <small>
            Creado por <strong>{creadoPor?.nombre || 'Usuario desconocido'}</strong> • 
            {formatDate(fechaCreacion)}
          </small>
        </p>
        
        <p className="mb-3">
          {truncateText(descripcion, 150)}
        </p>
        
        <div className="d-flex justify-content-between align-items-center">
          <Link 
            to={`/modulos/${id}`} 
            className="btn btn-sm btn-outline-primary"
          >
            Ver detalles
          </Link>
          
          {showActions && (
            <div className="btn-group">
              <Link 
                to={`/modulos/editar/${id}`} 
                className="btn btn-sm btn-outline-secondary"
              >
                Editar
              </Link>
              
              {estado !== 'aprobado' && (
                <Link 
                  to={`/modulos/validar/${id}`} 
                  className="btn btn-sm btn-outline-success"
                >
                  Validar
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ModuloCard.propTypes = {
  modulo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    estado: PropTypes.string,
    creadoPor: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      nombre: PropTypes.string,
      email: PropTypes.string
    }),
    fechaCreacion: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]),
    contenido: PropTypes.string
  }).isRequired,
  showActions: PropTypes.bool
};

export default ModuloCard;
