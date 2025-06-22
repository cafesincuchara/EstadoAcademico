import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useModulos } from '../ModuloContext';
import { LoadingSpinner, ErrorMessage, ActionButton } from '../components';
import { validateModuleData } from '../utils';
import { toast } from 'react-toastify';

/**
 * Página para crear un nuevo módulo
 * @returns {JSX.Element} Componente de creación de módulo
 */
const NuevoModulo = () => {
  const navigate = useNavigate();
  const { crearModulo, loading, error } = useModulos();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    contenido: '',
    archivos: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      archivos: prev.archivos.filter((_, i) => i !== index)
    }));
  };
  
  // Validar el formulario
  const validateForm = () => {
    const validationErrors = validateModuleData(formData);
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
      // Crear un objeto FormData para enviar los archivos
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('contenido', formData.contenido);
      
      // Agregar archivos al FormData
      formData.archivos.forEach((file, index) => {
        formDataToSend.append(`archivos[${index}]`, file);
      });
      
      // Llamar a la API para crear el módulo
      const nuevoModulo = await crearModulo(formDataToSend);
      
      // Mostrar mensaje de éxito y redirigir
      toast.success('Módulo creado exitosamente');
      navigate(`/modulos/${nuevoModulo.id}`);
      
    } catch (error) {
      console.error('Error al crear el módulo:', error);
      toast.error('Error al crear el módulo. Por favor, intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Mostrar spinner de carga
  if (loading && !isSubmitting) {
    return (
      <div className="container mt-5">
        <LoadingSpinner message="Cargando formulario..." />
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
              <li className="breadcrumb-item active" aria-current="page">
                Nuevo Módulo
              </li>
            </ol>
          </nav>
          <h2>Crear Nuevo Módulo</h2>
        </div>
        
        <div>
          <a href="/modulos" className="btn btn-outline-secondary me-2">
            <i className="fas fa-times me-1"></i> Cancelar
          </a>
          <ActionButton 
            type="submit" 
            form="moduloForm"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            <i className="fas fa-save me-1"></i>
            {isSubmitting ? 'Guardando...' : 'Guardar Módulo'}
          </ActionButton>
        </div>
      </div>
      
      <form id="moduloForm" onSubmit={handleSubmit}>
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
                    Seleccionar Archivos
                  </button>
                </div>
                
                {formData.archivos.length > 0 ? (
                  <div className="list-group">
                    {formData.archivos.map((file, index) => (
                      <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
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
                            onClick={() => removeFile(index)}
                            title="Eliminar archivo"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
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
                    id="notificarUsuarios"
                  />
                  <label className="form-check-label" htmlFor="notificarUsuarios">
                    Notificar a los usuarios sobre este nuevo módulo
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
                    {isSubmitting ? 'Guardando...' : 'Guardar Módulo'}
                  </ActionButton>
                  
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary w-100"
                    onClick={() => navigate('/modulos')}
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

export default NuevoModulo;
