import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../js/api';
import './ModuloList.css';

const ModuloList = () => {
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarModulos = async () => {
      try {
        const response = await api.get('/api/modulos');
        setModulos(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar los módulos:', err);
        setError('No se pudieron cargar los módulos. Intente nuevamente.');
        setLoading(false);
      }
    };

    cargarModulos();
  }, []);

  const handleVerDetalle = (id) => {
    navigate(`/modulos/${id}`);
  };

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Módulos Disponibles</h2>
        {window.auth.getUserData()?.role === 'admin' && (
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/modulos/nuevo')}
          >
            Nuevo Módulo
          </button>
        )}
      </div>
      
      <div className="row">
        {modulos.map((modulo) => (
          <div key={modulo.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{modulo.nombre}</h5>
                <p className="card-text text-muted">
                  {modulo.descripcion?.substring(0, 100)}...
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className={`badge ${getEstadoBadgeClass(modulo.estado)}`}>
                    {modulo.estado}
                  </span>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleVerDetalle(modulo.id)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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

export default ModuloList;
