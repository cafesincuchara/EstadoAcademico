import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useModulos } from '../ModuloContext';
import { LoadingSpinner, ErrorMessage, ActionButton } from '../components';
import { formatDate, getEstadoInfo, createMarkup } from '../utils';
import { toast } from 'react-toastify';

/**
 * Página que muestra los detalles de un módulo específico
 * @returns {JSX.Element} Componente de detalle de módulo
 */
const ModuloDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    obtenerModulo, 
    cargarModulos, 
    loading, 
    error, 
    puedeValidar 
  } = useModulos();
  
  const [modulo, setModulo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorDetalle, setErrorDetalle] = useState(null);
  
  // Cargar los detalles del módulo
  useEffect(() => {
    const cargarDetalleModulo = async () => {
      try {
        setCargando(true);
        setErrorDetalle(null);
        
        // Si ya tenemos los módulos cargados, buscar el módulo por ID
        const moduloEncontrado = obtenerModulo(parseInt(id));
        
        if (moduloEncontrado) {
          setModulo(moduloEncontrado);
        } else {
          // Si no encontramos el módulo, intentar recargar la lista
          await cargarModulos();
          const moduloRecargado = obtenerModulo(parseInt(id));
          
          if (moduloRecargado) {
            setModulo(moduloRecargado);
          } else {
            setErrorDetalle('No se encontró el módulo solicitado.');
          }
        }
      } catch (error) {
        console.error('Error al cargar el módulo:', error);
        setErrorDetalle('Error al cargar el módulo. Por favor, intente nuevamente.');
      } finally {
        setCargando(false);
      }
    };
    
    cargarDetalleModulo();
  }, [id, obtenerModulo, cargarModulos]);
  
  // Manejar la eliminación del módulo
  const handleEliminar = async () => {
    if (window.confirm('¿Está seguro de que desea eliminar este módulo? Esta acción no se puede deshacer.')) {
      try {
        // Aquí iría la llamada a la API para eliminar el módulo
        // await moduloAPI.eliminarModulo(id);
        
        toast.success('Módulo eliminado correctamente');
        navigate('/modulos');
      } catch (error) {
        console.error('Error al eliminar el módulo:', error);
        toast.error('No se pudo eliminar el módulo. Por favor, intente nuevamente.');
      }
    }
  };
  
  // Mostrar spinner de carga
  if (cargando) {
    return (
      <div className="container mt-5">
        <LoadingSpinner message="Cargando detalles del módulo..." />
      </div>
    );
  }
  
  // Mostrar mensaje de error
  if (errorDetalle || error) {
    return (
      <div className="container mt-5">
        <ErrorMessage 
          error={errorDetalle || error} 
          onRetry={() => window.location.reload()} 
          retryText="Recargar"
        />
      </div>
    );
  }
  
  // Si no se encontró el módulo
  if (!modulo) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          No se encontró el módulo solicitado.
          <div className="mt-3">
            <Link to="/modulos" className="btn btn-primary">
              Volver a la lista de módulos
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const estadoInfo = getEstadoInfo(modulo.estado);
  
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/modulos">Módulos</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {modulo.titulo}
              </li>
            </ol>
          </nav>
          <h2 className="mb-0">{modulo.titulo}</h2>
        </div>
        
        <div className="d-flex gap-2">
          <span className={`badge ${estadoInfo.className} align-self-center`}>
            {estadoInfo.text}
          </span>
          
          {puedeValidar && (
            <>
              <Link 
                to={`/modulos/editar/${modulo.id}`} 
                className="btn btn-outline-primary"
              >
                <i className="fas fa-edit me-1"></i> Editar
              </Link>
              
              <button 
                className="btn btn-outline-danger"
                onClick={handleEliminar}
              >
                <i className="fas fa-trash me-1"></i> Eliminar
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Descripción</h5>
              <p className="card-text">{modulo.descripcion}</p>
              
              <h5 className="mt-4">Contenido</h5>
              <div 
                className="ql-editor" 
                dangerouslySetInnerHTML={createMarkup(modulo.contenido || '')}
              />
            </div>
          </div>
          
          {/* Sección de archivos adjuntos (opcional) */}
          {/* <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Archivos Adjuntos</h5>
              <div className="list-group">
                {modulo.archivos && modulo.archivos.length > 0 ? (
                  modulo.archivos.map((archivo) => (
                    <a 
                      key={archivo.id} 
                      href={archivo.url} 
                      className="list-group-item list-group-item-action"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-file me-2"></i>
                      {archivo.nombre}
                      <span className="badge bg-secondary ms-2">
                        {archivo.tamanho}
                      </span>
                    </a>
                  ))
                ) : (
                  <p className="text-muted mb-0">No hay archivos adjuntos</p>
                )}
              </div>
            </div>
          </div> */}
        </div>
        
        <div className="col-lg-4">
          {/* Información del módulo */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Información del Módulo</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">Creado por:</span>
                  <span>{modulo.creadoPor?.nombre || 'Usuario desconocido'}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">Fecha de creación:</span>
                  <span>{formatDate(modulo.fechaCreacion)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">Última actualización:</span>
                  <span>{formatDate(modulo.fechaActualizacion || modulo.fechaCreacion)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">Estado:</span>
                  <span className={`badge ${estadoInfo.className}`}>
                    {estadoInfo.text}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Historial de validaciones */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Historial de Validaciones</h5>
              
              {modulo.validaciones && modulo.validaciones.length > 0 ? (
                <div className="validaciones-list">
                  {modulo.validaciones.map((validacion) => (
                    <div key={validacion.id} className="validacion-item">
                      <div className="validacion-header">
                        <span className="validacion-user">
                          {validacion.usuario?.nombre || 'Usuario desconocido'}
                        </span>
                        <small className="validacion-date">
                          {formatDate(validacion.fechaValidacion)}
                        </small>
                      </div>
                      <div className="validacion-status">
                        <span className={`badge bg-${validacion.estado === 'aprobado' ? 'success' : 'danger'}`}>
                          {validacion.estado}
                        </span>
                      </div>
                      {validacion.comentario && (
                        <div className="validacion-comment mt-2">
                          <strong>Comentario:</strong>
                          <p className="mb-0">{validacion.comentario}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No hay historial de validaciones</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between mt-4">
        <Link to="/modulos" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-1"></i> Volver a la lista
        </Link>
        
        {puedeValidar && modulo.estado !== 'aprobado' && (
          <Link 
            to={`/modulos/validar/${modulo.id}`} 
            className="btn btn-primary"
          >
            <i className="fas fa-check-circle me-1"></i> Validar Módulo
          </Link>
        )}
      </div>
    </div>
  );
};

export default ModuloDetalle;
