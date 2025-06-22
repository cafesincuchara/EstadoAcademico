import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useModulos } from '../ModuloContext';
import { LoadingSpinner, ErrorMessage, ActionButton } from '../components';
import { validateModuleData } from '../utils';
import { toast } from 'react-toastify';

/**
 * Página para editar un módulo existente
 * @returns {JSX.Element} Componente de edición de módulo
 */
const EditarModulo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    obtenerModulo, 
    actualizarModulo, 
    loading, 
    error, 
    cargarModulos 
  } = useModulos();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    contenido: '',
    archivos: [],
    archivosExistentes: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const fileInputRef = useRef(null);
  
  // Configuración del editor Quill
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };
  
  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];
  
  // Cargar los datos del módulo al montar el componente
  useEffect(() => {
    const cargarDatosModulo = async () => {
      try {
        setCargandoDatos(true);
        
        // Cargar el módulo existente
        const modulo = obtenerModulo(parseInt(id));
        
        if (!modulo) {
          // Si no encontramos el módulo, intentar recargar la lista
          await cargarModulos();
          const moduloRecargado = obtenerModulo(parseInt(id));
          
          if (!moduloRecargado) {
            throw new Error('No se encontró el módulo solicitado');
          }
          
          // Establecer los datos del módulo en el estado
          setFormData({
            titulo: moduloRecargado.titulo || '',
            descripcion: moduloRecargado.descripcion || '',
            contenido: moduloRecargado.contenido || '',
            archivos: [],
            archivosExistentes: moduloRecargado.archivos || []
          });
        } else {
          // Establecer los datos del módulo en el estado
          setFormData({
            titulo: modulo.titulo || '',
            descripcion: modulo.descripcion || '',
            contenido: modulo.contenido || '',
            archivos: [],
            archivosExistentes: modulo.archivos || []
          });
        }
        
      } catch (error) {
        console.error('Error al cargar el módulo:', error);
        toast.error('No se pudo cargar el módulo. Por favor, intente nuevamente.');
      } finally {
        setCargandoDatos(false);
      }
    };
    
    cargarDatosModulo();
  }, [id, obtenerModulo, cargarModulos]);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al editar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Manejar cambios en el editor de contenido
  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      contenido: content
    }));
    
    if (errors.contenido) {
      setErrors(prev => ({
        ...prev,
        contenido: null
      }));
    }
  };
  
  // Manejar selección de archivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar archivos (tamaño, tipo, etc.)
    const validFiles = files.filter(file => {
      // Ejemplo: solo permitir archivos PDF y hasta 5MB
      const isValidType = file.type === 'application/pdf' || 
                        file.type === 'application/msword' ||
                        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast.error(`El archivo ${file.name} no es un tipo de archivo válido. Solo se permiten PDF o Word.`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`El archivo ${file.name} es demasiado grande. El tamaño máximo permitido es 5MB.`);
        return false;
      }
      
      return true;
    });
    
    setFormData(prev => ({
      ...prev,
      archivos: [...prev.archivos, ...validFiles]
    }));
  };
  
  // Eliminar un archivo adjunto
  const removeFile = (index, esArchivoExistente = false) => {
    if (esArchivoExistente) {
      // Para archivos existentes, solo los marcamos para eliminación
      setFormData(prev => ({
        ...prev,
        archivosExistentes: prev.archivosExistentes.map((archivo, i) => 
          i === index ? { ...archivo, eliminado: true } : archivo
        )
      }));
    } else {
      // Para archivos nuevos, los eliminamos directamente
      setFormData(prev => ({
        ...prev,
        archivos: prev.archivos.filter((_, i) => i !== index)
      }));
    }
  };
  
  // Deshacer la eliminación de un archivo existente
  const undoRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      archivosExistentes: prev.archivosExistentes.map((archivo, i) => 
        i === index ? { ...archivo, eliminado: false } : archivo
      )
    }));
  };
  
  // Validar el formulario
  const validateForm = () => {
    const validationErrors = validateModuleData({
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      contenido: formData.contenido
    });
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Crear un objeto FormData para enviar los datos
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('contenido', formData.contenido);
      
      // Agregar archivos nuevos al FormData
      formData.archivos.forEach((file, index) => {
        formDataToSend.append(`archivosNuevos[${index}]`, file);
      });
      
      // Agregar IDs de archivos existentes que se deben eliminar
      const archivosAEliminar = formData.archivosExistentes
        .filter(archivo => archivo.eliminado)
        .map(archivo => archivo.id);
      
      if (archivosAEliminar.length > 0) {
        formDataToSend.append('archivosAEliminar', JSON.stringify(archivosAEliminar));
      }
      
      // Llamar a la API para actualizar el módulo
      await actualizarModulo(parseInt(id), formDataToSend);
      
      // Mostrar mensaje de éxito y redirigir
      toast.success('Módulo actualizado exitosamente');
      navigate(`/modulos/${id}`);
      
    } catch (error) {
      console.error('Error al actualizar el módulo:', error);
      toast.error('Error al actualizar el módulo. Por favor, intente nuevamente.');
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
  if (error && !isSubmitting) {
    return (
      <div className="container mt-5">
        <ErrorMessage 
          error={error} 
          onRetry={() => window.location.reload()} 
          retryText="Recargar"
        />
      </div>
    );
  }
  
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
                <a href={`/modulos/${id}`}>{formData.titulo || 'Módulo'}</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Editar
              </li>
            </ol>
          </nav>
          <h2>Editar Módulo</h2>
        </div>
        
        <div>
          <a href={`/modulos/${id}`} className="btn btn-outline-secondary me-2">
            <i className="fas fa-times me-1"></i> Cancelar
          </a>
          <ActionButton 
            type="submit" 
            form="editarModuloForm"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            <i className="fas fa-save me-1"></i>
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </ActionButton>
        </div>
      </div>
      
      <form id="editarModuloForm" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="titulo" className="form-label">
                    Título del Módulo <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Ej: Introducción a la Programación"
                    required
                  />
                  {errors.titulo && (
                    <div className="invalid-feedback">
                      {errors.titulo}
                    </div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">
                    Descripción <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                    id="descripcion"
                    name="descripcion"
                    rows="3"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Proporcione una descripción detallada del módulo"
                    required
                  />
                  {errors.descripcion && (
                    <div className="invalid-feedback">
                      {errors.descripcion}
                    </div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">
                    Contenido <span className="text-danger">*</span>
                  </label>
                  <div className={`quill-editor-container ${errors.contenido ? 'is-invalid' : ''}`}>
                    <ReactQuill
                      theme="snow"
                      value={formData.contenido}
                      onChange={handleContentChange}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Escriba el contenido detallado del módulo aquí..."
                    />
                  </div>
                  {errors.contenido && (
                    <div className="invalid-feedback d-block">
                      {errors.contenido}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            {/* Sección de archivos adjuntos */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Archivos Adjuntos</h5>
                <p className="text-muted small">
                  Puede adjuntar archivos de apoyo como PDFs o documentos de Word (máx. 5MB por archivo).
                </p>
                
                <div className="mb-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    onChange={handleFileChange}
                    multiple
                    accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    Agregar Archivos
                  </button>
                </div>
                
                {/* Archivos existentes */}
                {formData.archivosExistentes.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-muted mb-2">Archivos existentes:</h6>
                    <div className="list-group">
                      {formData.archivosExistentes.map((archivo, index) => (
                        !archivo.eliminado ? (
                          <div key={`existente-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="text-truncate me-2" style={{ maxWidth: '70%' }}>
                              <i className="far fa-file me-2"></i>
                              {archivo.nombre}
                            </div>
                            <div className="d-flex">
                              <a 
                                href={archivo.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary me-2"
                                title="Ver archivo"
                              >
                                <i className="fas fa-eye"></i>
                              </a>
                              <button 
                                type="button" 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeFile(index, true)}
                                title="Eliminar archivo"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div key={`eliminado-${index}`} className="list-group-item d-flex justify-content-between align-items-center bg-light">
                            <div className="text-truncate me-2 text-decoration-line-through" style={{ maxWidth: '70%' }}>
                              <i className="far fa-file me-2"></i>
                              {archivo.nombre}
                            </div>
                            <button 
                              type="button" 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => undoRemoveFile(index)}
                              title="Deshacer eliminación"
                            >
                              <i className="fas fa-undo"></i>
                            </button>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Archivos nuevos */}
                {formData.archivos.length > 0 && (
                  <div>
                    <h6 className="text-muted mb-2">Archivos nuevos:</h6>
                    <div className="list-group">
                      {formData.archivos.map((file, index) => (
                        <div key={`nuevo-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
                          <div className="text-truncate me-2" style={{ maxWidth: '70%' }}>
                            <i className="far fa-file me-2"></i>
                            {file.name}
                          </div>
                          <div className="d-flex">
                            <span className="badge bg-light text-dark me-2">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <button 
                              type="button" 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFile(index, false)}
                              title="Eliminar archivo"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData.archivosExistentes.length === 0 && formData.archivos.length === 0 && (
                  <div className="text-center py-3 text-muted">
                    <i className="fas fa-folder-open fa-2x mb-2"></i>
                    <p className="mb-0">No hay archivos adjuntos</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Opciones de guardado */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Opciones</h5>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notificarCambios"
                  />
                  <label className="form-check-label" htmlFor="notificarCambios">
                    Notificar a los usuarios sobre los cambios
                  </label>
                </div>
                
                <div className="d-grid gap-2">
                  <ActionButton 
                    type="submit" 
                    variant="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-100"
                  >
                    <i className="fas fa-save me-1"></i>
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditarModulo;
