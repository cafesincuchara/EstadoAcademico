import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useModulos } from '../ModuloContext';
import { LoadingSpinner, ErrorMessage, ActionButton } from '../components';
import { formatDate, getEstadoInfo } from '../utils';
import { toast } from 'react-toastify';

/**
 * Página para validar un módulo
 * @returns {JSX.Element} Componente de validación de módulo
 */
const ValidarModulo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    obtenerModulo, 
    validarModulo, 
    loading, 
    error, 
    cargarModulos 
  } = useModulos();
  
  const [modulo, setModulo] = useState(null);
  const [comentario, setComentario] = useState('');
  const [decision, setDecision] = useState('');
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState(null);
  
  // Cargar los datos del módulo al montar el componente
  useEffect(() => {
    const cargarDatosModulo = async () => {
      try {
        setCargandoDatos(true);
        setErrorValidacion(null);
        
        // Cargar el módulo existente
        const moduloEncontrado = obtenerModulo(parseInt(id));
        
        if (!moduloEncontrado) {
          // Si no encontramos el módulo, intentar recargar la lista
          await cargarModulos();
          const moduloRecargado = obtenerModulo(parseInt(id));
          
          if (!moduloRecargado) {
            throw new Error('No se encontró el módulo solicitado');
          }
          
          setModulo(moduloRecargado);
        } else {
          setModulo(moduloEncontrado);
        }
        
      } catch (error) {
        console.error('Error al cargar el módulo:', error);
        setErrorValidacion('No se pudo cargar el módulo. Por favor, intente nuevamente.');
      } finally {
        setCargandoDatos(false);
      }
    };
    
    cargarDatosModulo();
  }, [id, obtenerModulo, cargarModulos]);
  
  // Manejar cambio en el comentario
  const handleComentarioChange = (e) => {
    setComentario(e.target.value);
  };
  
  // Manejar cambio en la decisión
  const handleDecisionChange = (e) => {
    setDecision(e.target.value);
  };
  
  // Validar el formulario
  const validateForm = () => {
    if (!decision) {
      toast.error('Por favor, seleccione una decisión (Aprobar o Rechazar)');
      return false;
    }
    
    if (decision === 'rechazado' && !comentario.trim()) {
      toast.error('Por favor, proporcione un comentario explicando el motivo del rechazo');
      return false;
    }
    
    return true;
  };
  
  // Manejar el envío del formulario de validación
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Llamar a la API para validar el módulo
      await validarModulo(parseInt(id), {
        decision,
        comentario: comentario.trim()
      });
      
      // Mostrar mensaje de éxito y redirigir
      toast.success(`Módulo ${decision === 'aprobado' ? 'aprobado' : 'rechazado'} exitosamente`);
      navigate(`/modulos/${id}`);
      
    } catch (error) {
      console.error('Error al validar el módulo:', error);
      toast.error('Error al procesar la validación. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Mostrar spinner de carga
  if (cargandoDatos || (loading && !isSubmitting)) {
    return (
      <div className="container mt-5">
        <LoadingSpinner message="Cargando módulo..." />
      </div>
    );
  }
  
  // Mostrar mensaje de error
  if (errorValidacion || error) {
    return (
      <div className="container mt-5">
        <ErrorMessage 
          error={errorValidacion || error} 
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
            <a href="/modulos" className="btn btn-primary">
              Volver a la lista de módulos
            </a>
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
                <a href="/modulos">Módulos</a>
              </li>
              <li className="breadcrumb-item">
                <a href={`/modulos/${id}`}>{modulo.titulo}</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Validar
              </li>
            </ol>
          </nav>
          <h2>Validar Módulo</h2>
        </div>
        
        <a href={`/modulos/${id}`} className="btn btn-outline-secondary">
          <i className="fas fa-times me-1"></i> Cancelar
        </a>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Detalles del Módulo</h5>
              
              <div className="mb-3">
                <h4 className="mb-1">{modulo.titulo}</h4>
                <p className="text-muted">{modulo.descripcion}</p>
                <div className="d-flex gap-2 mb-3">
                  <span className={`badge ${estadoInfo.className}`}>
                    {estadoInfo.text}
                  </span>
                  <span className="text-muted">
                    Creado por: {modulo.creadoPor?.nombre || 'Usuario desconocido'}
                  </span>
                  <span className="text-muted">
                    Fecha: {formatDate(modulo.fechaCreacion)}
                  </span>
                </div>
              </div>
              
              <div className="border-top pt-3 mt-3">
                <h5>Contenido del Módulo</h5>
                <div 
                  className="ql-editor" 
                  dangerouslySetInnerHTML={{ __html: modulo.contenido || '<p>No hay contenido disponible.</p>' }}
                />
              </div>
              
              {/* Archivos adjuntos */}
              {modulo.archivos && modulo.archivos.length > 0 && (
                <div className="border-top pt-3 mt-3">
                  <h5>Archivos Adjuntos</h5>
                  <div className="list-group">
                    {modulo.archivos.map((archivo, index) => (
                      <a 
                        key={index} 
                        href={archivo.url} 
                        className="list-group-item list-group-item-action"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <i className="far fa-file me-2"></i>
                        {archivo.nombre}
                        <span className="badge bg-secondary ms-2">
                          {archivo.tamanho}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Historial de validaciones */}
          {modulo.validaciones && modulo.validaciones.length > 0 && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Historial de Validaciones</h5>
                <div className="validaciones-list">
                  {modulo.validaciones.map((validacion, index) => (
                    <div key={index} className="validacion-item">
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
              </div>
            </div>
          )}
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Proceso de Validación</h5>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Decisión <span className="text-danger">*</span>
                  </label>
                  
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="decision"
                      id="decisionAprobar"
                      value="aprobado"
                      checked={decision === 'aprobado'}
                      onChange={handleDecisionChange}
                      disabled={isSubmitting}
                    />
                    <label className="form-check-label" htmlFor="decisionAprobar">
                      <i className="fas fa-check-circle text-success me-1"></i>
                      Aprobar Módulo
                    </label>
                    <p className="form-text text-muted small ms-3 mt-1 mb-0">
                      El módulo será publicado y estará disponible para los estudiantes.
                    </p>
                  </div>
                  
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="decision"
                      id="decisionRechazar"
                      value="rechazado"
                      checked={decision === 'rechazado'}
                      onChange={handleDecisionChange}
                      disabled={isSubmitting}
                    />
                    <label className="form-check-label" htmlFor="decisionRechazar">
                      <i className="fas fa-times-circle text-danger me-1"></i>
                      Rechazar Módulo
                    </label>
                    <p className="form-text text-muted small ms-3 mt-1 mb-0">
                      El módulo será devuelto al creador para realizar correcciones.
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="comentario" className="form-label fw-bold">
                    Comentarios {decision === 'rechazado' && <span className="text-danger">*</span>}
                  </label>
                  <textarea
                    className="form-control"
                    id="comentario"
                    rows="5"
                    placeholder="Proporcione comentarios detallados sobre el módulo. Si está rechazando, explique claramente los motivos y las correcciones necesarias."
                    value={comentario}
                    onChange={handleComentarioChange}
                    disabled={isSubmitting}
                    required={decision === 'rechazado'}
                  />
                  <div className="form-text">
                    {decision === 'rechazado' 
                      ? 'Por favor, sea específico sobre los cambios necesarios.' 
                      : 'Los comentarios son opcionales si está aprobando el módulo.'}
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <ActionButton 
                    type="submit" 
                    variant={decision === 'aprobado' ? 'success' : 'danger'}
                    loading={isSubmitting}
                    disabled={isSubmitting || !decision}
                    className="w-100"
                  >
                    <i className={`fas fa-${decision === 'aprobado' ? 'check' : 'times'}-circle me-1`}></i>
                    {isSubmitting 
                      ? 'Procesando...' 
                      : decision === 'aprobado' 
                        ? 'Aprobar Módulo' 
                        : 'Rechazar Módulo'}
                  </ActionButton>
                  
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary w-100"
                    onClick={() => navigate(`/modulos/${id}`)}
                    disabled={isSubmitting}
                  >
                    <i className="fas fa-times me-1"></i>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Información de ayuda */}
          <div className="card mt-4">
            <div className="card-body">
              <h6 className="card-title">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                Directrices de Validación
              </h6>
              <ul className="list-unstyled small">
                <li className="mb-2">
                  <strong>Al aprobar:</strong> Asegúrese de que el contenido sea preciso, completo y cumpla con los estándares de calidad.
                </li>
                <li className="mb-2">
                  <strong>Al rechazar:</strong> Proporcione comentarios constructivos que ayuden a mejorar el módulo.
                </li>
                <li>
                  <strong>Nota:</strong> Esta acción quedará registrada en el historial del módulo.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidarModulo;
