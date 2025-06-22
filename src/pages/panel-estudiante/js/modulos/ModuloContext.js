import React, { createContext, useContext, useState, useEffect } from 'react';
import { moduloAPI } from './api';

// Crear el contexto
const ModuloContext = createContext();

// Hook personalizado para usar el contexto
export const useModulos = () => {
  return useContext(ModuloContext);
};

// Proveedor del contexto
export const ModuloProvider = ({ children }) => {
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [puedeValidar, setPuedeValidar] = useState(false);

  // Cargar módulos
  const cargarModulos = async () => {
    try {
      setLoading(true);
      const data = await moduloAPI.getModulos();
      setModulos(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar módulos:', err);
      setError('No se pudieron cargar los módulos. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar permisos de validación
  const verificarPermisos = async () => {
    try {
      const puede = await moduloAPI.puedeValidar();
      setPuedeValidar(puede);
    } catch (err) {
      console.error('Error al verificar permisos:', err);
      setPuedeValidar(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const inicializar = async () => {
      await Promise.all([
        cargarModulos(),
        verificarPermisos()
      ]);
    };
    
    inicializar();
  }, []);

  // Crear un nuevo módulo
  const crearModulo = async (nuevoModulo) => {
    try {
      const moduloCreado = await moduloAPI.createModulo(nuevoModulo);
      setModulos([...modulos, moduloCreado]);
      return { success: true, data: moduloCreado };
    } catch (err) {
      console.error('Error al crear módulo:', err);
      return { 
        success: false, 
        error: err.message || 'Error al crear el módulo' 
      };
    }
  };

  // Validar un módulo
  const validarModulo = async (moduloId, datosValidacion) => {
    try {
      const validacion = await moduloAPI.validarModulo(moduloId, datosValidacion);
      
      // Actualizar el estado del módulo
      setModulos(modulos.map(mod => 
        mod.id === moduloId 
          ? { 
              ...mod, 
              estado: datosValidacion.estado,
              validaciones: [...(mod.validaciones || []), validacion] 
            } 
          : mod
      ));
      
      return { success: true, data: validacion };
    } catch (err) {
      console.error('Error al validar módulo:', err);
      return { 
        success: false, 
        error: err.message || 'Error al validar el módulo' 
      };
    }
  };

  // Obtener un módulo por ID
  const obtenerModulo = (id) => {
    return modulos.find(mod => mod.id === parseInt(id));
  };

  // Valores disponibles en el contexto
  const value = {
    modulos,
    loading,
    error,
    puedeValidar,
    cargarModulos,
    crearModulo,
    validarModulo,
    obtenerModulo
  };

  return (
    <ModuloContext.Provider value={value}>
      {children}
    </ModuloContext.Provider>
  );
};

export default ModuloContext;
