import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

/**
 * Componente para manejar errores en la aplicación
 * Captura errores en los componentes hijos y muestra un mensaje de error amigable
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    // Recargar la aplicación
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de error personalizada
      return (
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="text-center">
                <div className="text-warning mb-4">
                  <FaExclamationTriangle size={64} />
                </div>
                <h2 className="mb-3">¡Vaya! Algo salió mal</h2>
                <p className="lead mb-4">
                  Lo sentimos, ha ocurrido un error inesperado en la aplicación.
                </p>
                
                <div className="alert alert-danger text-start mb-4">
                  <p className="mb-1">
                    <strong>Error:</strong> {this.state.error?.toString() || 'Error desconocido'}
                  </p>
                  {process.env.NODE_ENV === 'development' && this.state.errorInfo?.componentStack && (
                    <details className="mt-3" style={{ whiteSpace: 'pre-wrap' }}>
                      <summary>Detalles del error</summary>
                      <pre className="small p-3 bg-dark text-light rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
                
                <div className="d-flex justify-content-center gap-3">
                  <Button 
                    variant="primary" 
                    onClick={this.handleReload}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaRedo /> Recargar aplicación
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => window.history.back()}
                  >
                    Volver atrás
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Si no hay error, renderiza los hijos normalmente
    return this.props.children; 
  }
}

export default ErrorBoundary;
