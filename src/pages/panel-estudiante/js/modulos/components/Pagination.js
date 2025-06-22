import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Componente de paginación
 * @param {Object} props - Propiedades del componente
 * @param {number} props.currentPage - Página actual
 * @param {number} props.totalPages - Número total de páginas
 * @param {Function} props.onPageChange - Función que se ejecuta al cambiar de página
 * @param {number} [props.maxVisiblePages=5] - Número máximo de páginas visibles en la paginación
 * @param {string} [props.basePath=''] - Ruta base para los enlaces
 * @returns {JSX.Element} Componente de paginación
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  basePath = ''
}) => {
  // Si solo hay una página, no mostrar la paginación
  if (totalPages <= 1) return null;

  // Calcular el rango de páginas a mostrar
  const getPageRange = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Ajustar el inicio si estamos cerca del final
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    return { start, end };
  };

  const { start, end } = getPageRange();
  const pages = [];
  
  // Generar el array de páginas a mostrar
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Manejar el cambio de página
  const handlePageChange = (page, e) => {
    if (e) e.preventDefault();
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    if (onPageChange) {
      onPageChange(page);
    }
    
    // Desplazarse al principio de la página
    window.scrollTo(0, 0);
  };

  // Generar la URL para una página específica
  const getPageUrl = (page) => {
    if (!basePath) return '#';
    return `${basePath}?page=${page}`;
  };

  return (
    <nav aria-label="Navegación de páginas">
      <ul className="pagination justify-content-center">
        {/* Botón Anterior */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <Link
            className="page-link"
            to={getPageUrl(currentPage - 1)}
            onClick={(e) => handlePageChange(currentPage - 1, e)}
            aria-label="Anterior"
          >
            <span aria-hidden="true">&laquo;</span>
          </Link>
        </li>

        {/* Primera página */}
        {start > 1 && (
          <>
            <li className="page-item">
              <Link
                className="page-link"
                to={getPageUrl(1)}
                onClick={(e) => handlePageChange(1, e)}
              >
                1
              </Link>
            </li>
            {start > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}

        {/* Páginas */}
        {pages.map((page) => (
          <li 
            key={page} 
            className={`page-item ${page === currentPage ? 'active' : ''}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            <Link
              className="page-link"
              to={getPageUrl(page)}
              onClick={(e) => handlePageChange(page, e)}
            >
              {page}
            </Link>
          </li>
        ))}

        {/* Última página */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className="page-item">
              <Link
                className="page-link"
                to={getPageUrl(totalPages)}
                onClick={(e) => handlePageChange(totalPages, e)}
              >
                {totalPages}
              </Link>
            </li>
          </>
        )}

        {/* Botón Siguiente */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <Link
            className="page-link"
            to={getPageUrl(currentPage + 1)}
            onClick={(e) => handlePageChange(currentPage + 1, e)}
            aria-label="Siguiente"
          >
            <span aria-hidden="true">&raquo;</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  maxVisiblePages: PropTypes.number,
  basePath: PropTypes.string
};

export default Pagination;
