/**
 * Módulo de autenticación para la página de login
 */

// Configuración de toastr
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
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    if (!loginForm || !emailInput || !passwordInput) {
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
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validaciones básicas
        if (!email) {
            showError('Por favor ingresa tu correo electrónico');
            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showError('Por favor ingresa un correo electrónico válido');
            emailInput.focus();
            return;
        }

        if (!password) {
            showError('Por favor ingresa tu contraseña');
            passwordInput.focus();
            return;
        }

        // Deshabilitar botón de envío
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Iniciando sesión...';

        try {
            // Llamar a la API para iniciar sesión
            const response = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            // Normalizar rol recibido
            let rawRole = data.user.role || '';
            let role = rawRole.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            if (role === 'administrador') role = 'admin';
            if (role === 'profesores') role = 'profesor';
            if (role === 'alumno') role = 'estudiante';
            // Solo permitidos
            const validRoles = ['admin', 'profesor', 'estudiante'];
            if (!validRoles.includes(role)) {
                toastr.error('Rol de usuario no válido: ' + rawRole);
                throw new Error('Rol de usuario no válido: ' + rawRole);
            }
            // Log para depuración
            console.log('[LOGIN] Rol recibido:', rawRole, '-> Normalizado:', role);
            data.user.role = role;

            // Guardar token y datos del usuario
            if (window.auth) {
                await window.auth.setAuthData(data.token, data.user);
            } else {
                // Si el módulo de autenticación no está cargado, guardar de forma básica
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user_data', JSON.stringify(data.user));
            }

            // Mostrar mensaje de éxito
            toastr.success('¡Bienvenido! Redirigiendo...');

            // Redirigir al panel correspondiente según el rol
            const dashboardPath = (window.auth && typeof window.auth.getDashboardPath === 'function')
                ? window.auth.getDashboardPath(data.user.role)
                : '/login';
            setTimeout(() => {
                window.location.href = dashboardPath;
            }, 1500);

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            showError(error.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
            
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

/**
 * Valida si un correo electrónico tiene un formato válido
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} - true si el correo es válido, false en caso contrario
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Inicializar el formulario cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoginForm);
} else {
    initLoginForm();
}
