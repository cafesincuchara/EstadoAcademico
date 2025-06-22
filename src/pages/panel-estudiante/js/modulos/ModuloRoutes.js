import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from './components';

// Carga perezosa de los componentes de página
const ModuloList = lazy(() => import('./pages/ModuloList'));
const ModuloDetalle = lazy(() => import('./pages/ModuloDetalle'));
const NuevoModulo = lazy(() => import('./pages/NuevoModulo'));
const EditarModulo = lazy(() => import('./pages/EditarModulo'));
const ValidarModulo = lazy(() => import('./pages/ValidarModulo'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Componente de carga para Suspense
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
    <LoadingSpinner message="Cargando..." />
  </div>
);

const ModuloRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Ruta principal - Redirige a la lista de módulos */}
        <Route path="/" element={<Navigate to="/modulos" replace />} />
        
        {/* Rutas de módulos */}
        <Route path="/modulos" element={<ModuloList />} />
        <Route path="/modulos/nuevo" element={<NuevoModulo />} />
        <Route path="/modulos/:id" element={<ModuloDetalle />} />
        <Route path="/modulos/editar/:id" element={<EditarModulo />} />
        <Route path="/modulos/validar/:id" element={<ValidarModulo />} />
        
        {/* Ruta 404 - Debe ser la última */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default ModuloRoutes;
