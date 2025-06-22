import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../js/api';
import './ModuloDetalle.css';

const ModuloDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modulo, setModulo] = useState(null);
  const [validaciones, setValidaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comentario, setComentario] = useState('');
  const [mostrarFormValidacion, setMostrarFormValidacion] = useState(false);
  const [tipoValidacion, setTipoValidacion] = useState('aprobado');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar datos del módulo
        const moduloResponse = await api.get(`/api/modulos/${id}`);
        setModulo(moduloResponse.data);
        
        // Cargar validaciones del módulo
        const validacionesResponse = await api.get(`/api/modulos/${id}/validaciones`);
        setValidaciones(validacionesResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los datos del módulo:', err);
        setError('No se pudieron cargar los datos del módulo.');
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleValidar = async (e) => {
    e.preventDefault();
    
    try {
      await api.post(`/api/modulos/${id}/validar`, {
        estado: tipoValidacion,
        comentario
      });
      
      // Recargar los datos
      const moduloResponse = await api.get(`/api/modulos/${id}`);
      setModulo(moduloResponse.data);
      
      const validacionesResponse = await api.get(`/api/modulos/${id}/validaciones`);
      setValidaciones(validacionesResponse.data);
      
      // Resetear el formulario
      setComentario('');
      setMostrarFormValidacion(false);
      
      // Mostrar notificación de éxito
      window.toastr.success('Módulo validado correctamente');
    } catch (err) {
      console.error('Error al validar el módulo:', err);
      window.toastr.error('Error al validar el módulo');
    }
  };

  const puedeValidar = () => {
    const user = window.auth.getUserData();
    return user && (user.role === 'admin' || user.role === 'profesor');
  };

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!modulo) {
    return <div className="alert alert-warning">Módulo no encontrado</div>;
  }

  return (
    <div className="container mt-4">
      <button 
        className="btn btn-link mb-3" 
        onClick={() => navigate(-1)}
      >
        &larr; Volver a la lista
      </button>
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">{modulo.nombre}</h3>
          <span className={`badge ${getEstadoBadgeClass(modulo.estado)}`}>
            {modulo.estado}
          </span>
        </div>
        <div className="card-body">
          <h5>Descripción</h5>
          <p className="card-text">{modulo.descripcion}</p>
          
          <h5 className="mt-4">Contenido</h5>
          <div className="border p-3 bg-light rounded">
            {modulo.contenido ? (
              <div dangerouslySetInnerHTML={{ __html: modulo.contenido }} />
            ) : (
              <p className="text-muted">No hay contenido disponible para este módulo.</p>
            )}
          </div>
          
          <div className="mt-4">
            <small className="text-muted">
              Creado por: {modulo.creado_por_nombre} • {new Date(modulo.fecha_creacion).toLocaleDateString()}
            </small>
          </div>
        </div>
      </div>
      
      {/* Sección de validación */}
      {puedeValidar() && !mostrarFormValidacion && (
        <div className="text-end mb-4">
          <button 
            className="btn btn-primary"
            onClick={() => setMostrarFormValidacion(true)}
          >
            Validar Módulo
          </button>
        </div>
      )}
      
      {mostrarFormValidacion && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Validar Módulo</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleValidar}>
              <div className="mb-3">
                <label className="form-label">Estado</label>
                <select 
                  className="form-select"
                  value={tipoValidacion}
                  onChange={(e) => setTipoValidacion(e.target.value)}
                >
                  <option value="aprobado">Aprobar</option>
                  <option value="rechazado">Rechazar</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Comentario (opcional)</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                ></textarea>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setMostrarFormValidacion(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Enviar Validación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Historial de validaciones */}
      <div className="card">
        <div className="card-header">
          <h5>Historial de Validaciones</h5>
        </div>
        <div className="card-body">
          {validaciones.length > 0 ? (
            <div className="list-group">
              {validaciones.map((validacion) => (
                <div key={validacion.id} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="mb-1">{validacion.validador}</h6>
                      <p className="mb-1">{validacion.comentario || 'Sin comentarios'}</p>
                      <small className="text-muted">
                        {new Date(validacion.fecha_validacion).toLocaleString()}
                      </small>
                    </div>
                    <span className={`badge ${validacion.estado === 'aprobado' ? 'bg-success' : 'bg-danger'}`}>
                      {validacion.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted mb-0">No hay validaciones registradas para este módulo.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const getEstadoBadgeClass = (estado) => {
  switch (estado) {
    case 'aprobado':
      return 'bg-success';
    case 'rechazado':
      return 'bg-danger';
    case 'pendiente':
    default:
      return 'bg-warning';
  }
};

export default ModuloDetalle;
