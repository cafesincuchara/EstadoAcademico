import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../js/api';
import 'react-quill/dist/quill.snow.css';
import './NuevoModulo.css';

// Importar ReactQuill dinámicamente para evitar problemas de SSR
let ReactQuill;
if (typeof window !== 'undefined') {
  ReactQuill = require('react-quill');
}

const NuevoModulo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    contenido: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      contenido: content
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setError('El nombre del módulo es requerido');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/api/modulos', formData);
      window.toastr.success('Módulo creado exitosamente');
      navigate('/modulos');
    } catch (err) {
      console.error('Error al crear el módulo:', err);
      setError('Error al crear el módulo. Por favor, intente nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Nuevo Módulo</h2>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre del Módulo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción
              </label>
              <textarea
                className="form-control"
                id="descripcion"
                name="descripcion"
                rows="3"
                value={formData.descripcion}
                onChange={handleChange}
                disabled={loading}
              ></textarea>
              <div className="form-text">
                Proporciona una breve descripción del contenido del módulo.
              </div>
            </div>
            
            <div className="mb-4">
              <label className="form-label">
                Contenido del Módulo
              </label>
              {ReactQuill ? (
                <ReactQuill
                  theme="snow"
                  value={formData.contenido}
                  onChange={handleEditorChange}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'align': [] }],
                    ],
                  }}
                  placeholder="Escribe el contenido del módulo aquí..."
                  className="editor-contenido"
                />
              ) : (
                <textarea
                  className="form-control"
                  rows="10"
                  value={formData.contenido}
                  onChange={(e) => handleEditorChange(e.target.value)}
                  disabled={loading}
                  placeholder="Cargando editor..."
                ></textarea>
              )}
            </div>
            
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  'Guardar Módulo'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoModulo;
