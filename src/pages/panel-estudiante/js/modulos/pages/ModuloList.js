import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useModulos } from '../ModuloContext';
import { ModuloCard, LoadingSpinner, ErrorMessage, ActionButton } from '../components';
import { toast } from 'react-toastify';

/**
 * Página que muestra la lista de módulos disponibles
 * @returns {JSX.Element} Componente de lista de módulos
 */
const ModuloList = () => {
  const { 
    modulos, 
    loading, 
    error, 
    cargarModulos, 
    puedeValidar 
  } = useModulos();
  
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  
  // Cargar módulos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await cargarModulos();
      } catch (error) {
        console.error('Error al cargar módulos:', error);
        toast.error('No se pudieron cargar los módulos. Intente nuevamente.');
      }
    };
    
    cargarDatos();
  }, [cargarModulos]);
  
  // Filtrar módulos según los filtros aplicados
  const modulosFiltrados = modulos.filter(modulo => {
    // Aplicar filtro por estado
    if (filtro !== 'todos' && modulo.estado !== filtro) {
      return false;
    }
    
    // Aplicar búsqueda por título o descripción
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      return (
        modulo.titulo.toLowerCase().includes(busquedaLower) ||
        modulo.descripcion.toLowerCase().includes(busquedaLower)
      );
    }
    
    return true;
  });
  
  // Mostrar spinner de carga
  if (loading && modulos.length === 0) {
    return (
      <div className="container mt-5">
        <LoadingSpinner message="Cargando módulos..." />
      </div>
    );
  }
  
  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="container mt-5">
        <ErrorMessage 
          error={error} 
          onRetry={cargarModulos} 
          retryText="Reintentar"
        />
      </div>
    );
  }
  
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Módulos de Aprendizaje</h2>
        
        {/* Botón para crear nuevo módulo (solo para usuarios con permisos) */}
        {puedeValidar && (
          <Link to="/modulos/nuevo" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>
            Nuevo Módulo
          </Link>
        )}
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar módulos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobado">Aprobados</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
        
        <div className="col-md-2 d-flex justify-content-end">
          <ActionButton
            variant="outline-secondary"
            onClick={cargarModulos}
            icon="sync-alt"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </ActionButton>
        </div>
      </div>
      
      {/* Lista de módulos */}
      {modulosFiltrados.length === 0 ? (
        <div className="alert alert-info">
          No se encontraron módulos que coincidan con los criterios de búsqueda.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {modulosFiltrados.map((modulo) => (
            <div key={modulo.id} className="col">
              <ModuloCard modulo={modulo} showActions={puedeValidar} />
            </div>
          ))}
        </div>
      )}
      
      {/* Paginación (opcional) */}
      {/* <div className="mt-4">
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={(page) => console.log('Cambiar a página:', page)}
        />
      </div> */}
    </div>
  );
};

export default ModuloList;
