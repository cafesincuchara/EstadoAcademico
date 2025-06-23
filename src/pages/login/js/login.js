/**
 * Módulo de autenticación para la página de login
 */

// Configuración de mensajes
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    timeOut: 5000,
    extendedTimeOut: 2000
};

/**
 * Inicializa el formulario de login
 */
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const roleSelect = document.getElementById('role');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    if (!loginForm || !roleSelect || !passwordInput) {
        console.error('Elementos del formulario no encontrados');
        return;
    }

    // Mostrar/ocultar contraseña
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Manejar envío del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const role = roleSelect.value;
        const password = passwordInput.value;

        // Validaciones básicas
        if (!role) {
            showError('Por favor selecciona tu rol');
            roleSelect.focus();
            return;
        }

        if (!password) {
            showError('Por favor ingresa tu contraseña');
            passwordInput.focus();
            return;
        }

        // Mostrar carga
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Iniciando sesión...';

        try {
            // Usar el módulo de autenticación
            const result = auth.login(role, password);
            
            if (result.success) {
                // Mostrar mensaje de éxito
                showSuccess('Inicio de sesión exitoso');
                
                // Redirigir al dashboard correspondiente
                setTimeout(() => {
                    auth.redirectToDashboard();
                }, 1000);
            } else {
                // Mostrar mensaje de error
                showError(result.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            showError(error.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Verificar si ya está autenticado
    if (window.auth && window.auth.isAuthenticated()) {
        window.location.href = '/panel-estudiante';
    }
}

/**
 * Muestra un mensaje de error
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
    toastr.error(message, 'Error', {
        timeOut: 5000,
        closeButton: true
    });
}

// Inicializar el formulario cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoginForm);
} else {
    initLoginForm();
}
