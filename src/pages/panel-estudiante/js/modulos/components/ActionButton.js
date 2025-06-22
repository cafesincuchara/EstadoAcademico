import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente de botón de acción con soporte para estados de carga
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.variant='primary'] - Variante de estilo del botón (primary, secondary, success, danger, etc.)
 * @param {string} [props.size='md'] - Tamaño del botón (sm, md, lg)
 * @param {boolean} [props.loading=false] - Indica si el botón está en estado de carga
 * @param {string} [props.icon] - Icono a mostrar a la izquierda del texto
 * @param {string} [props.type='button'] - Tipo de botón (button, submit, reset)
 * @param {boolean} [props.disabled=false] - Indica si el botón está deshabilitado
 * @param {Function} [props.onClick] - Función a ejecutar al hacer clic en el botón
 * @param {string} [props.className] - Clases CSS adicionales
 * @param {React.ReactNode} props.children - Contenido del botón
 * @returns {JSX.Element} Componente de botón de acción
 */
const ActionButton = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  children,
  ...rest
}) => {
  // Mapear tamaños a clases de Bootstrap
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  // Determinar si el botón está deshabilitado
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClasses[size] || ''} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <>
          <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
          Procesando...
        </>
      ) : (
        <>
          {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
          {children}
        </>
      )}
    </button>
  );
};

ActionButton.propTypes = {
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'link'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default ActionButton;
