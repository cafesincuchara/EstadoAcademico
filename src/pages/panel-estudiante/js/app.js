// Configuración global
const CONFIG = {
    API_BASE_URL: '/api/v1',
    DEFAULT_ERROR_MSG: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    TOAST_DELAY: 5000 // 5 segundos
};

// Estado global de la aplicación
const AppState = {
    user: null,
    authToken: null,
    lastActivity: Date.now(),
    timeoutId: null
};

// Inicialización de la aplicación
class StudentPanelApp {
    constructor() {
        this.initEventListeners();
        this.checkAuthStatus();
        this.setupInactivityTimer();
    }

    // Inicializar event listeners
    initEventListeners() {
        // Cerrar sesión
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="logout"]')) {
                e.preventDefault();
                this.logout();
            }
        });

        // Actualizar actividad del usuario
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, this.updateActivity.bind(this), false);
        });
    }


    // Verificar estado de autenticación
    async checkAuthStatus() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                this.redirectToLogin();
                return;
            }

            const user = await this.fetchUserData(token);
            if (user) {
                AppState.user = user;
                AppState.authToken = token;
                this.updateUI();
                this.loadInitialData();
            } else {
                this.redirectToLogin();
            }
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            this.redirectToLogin();
        }
    }


    // Cargar datos iniciales
    async loadInitialData() {
        try {
            // Inicializar componentes
            this.initializeComponents();
            
            // Cargar datos del dashboard
            await this.loadDashboardData();
            
            // Inicializar tooltips
            this.initializeTooltips();
            
            // Mostrar notificación de bienvenida
            this.showNotification(
                `¡Bienvenido/a de vuelta, ${AppState.user.nombre || 'Estudiante'}!`,
                'success'
            );
        } catch (error) {
            console.error('Error al cargar datos iniciales:', error);
            this.showNotification(CONFIG.DEFAULT_ERROR_MSG, 'error');
        }
    }

    // Inicializar componentes de la interfaz
    initializeComponents() {
        // Inicializar tooltips de Bootstrap
        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        
        tooltipTriggerList.map(tooltipTriggerEl => 
            new bootstrap.Tooltip(tooltipTriggerEl)
        );
        
        // Inicializar popovers
        const popoverTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="popover"]')
        );
        
        popoverTriggerList.map(popoverTriggerEl => 
            new bootstrap.Popover(popoverTriggerEl)
        );
    }

    // Inicializar tooltips
    initializeTooltips() {
        // Inicializar tooltips de Bootstrap
        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        
        tooltipTriggerList.map(tooltipTriggerEl => 
            new bootstrap.Tooltip(tooltipTriggerEl)
        );
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        const toastId = `toast-${Date.now()}`;
        const toast = document.createElement('div');
        
        toast.id = toastId;
        toast.className = `toast show align-items-center text-white bg-${this.getBootstrapAlertClass(type)} border-0`;
        toast.role = 'alert';
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Configurar cierre automático
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: CONFIG.TOAST_DELAY
        });
        
        bsToast.show();
        
        // Eliminar el toast del DOM después de que se oculte
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    // Obtener clase de alerta de Bootstrap según el tipo
    getBootstrapAlertClass(type) {
        const types = {
            success: 'success',
            error: 'danger',
            warning: 'warning',
            info: 'info'
        };
        
        return types[type] || 'info';
    }

    // Crear contenedor de notificaciones
    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1080';
        document.body.appendChild(container);
        return container;
    }

    // Cerrar sesión
    async logout() {
        try {
            // Limpiar estado
            localStorage.removeItem('authToken');
            sessionStorage.clear();
            
            // Redirigir al login
            this.redirectToLogin();
            
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            this.redirectToLogin();
        }
    }

    // Redirigir al login
    redirectToLogin() {
        window.location.href = '/login';
    }

    // Configurar temporizador de inactividad
    setupInactivityTimer() {
        // Restablecer temporizador con cada interacción del usuario
        const resetTimer = () => {
            clearTimeout(AppState.timeoutId);
            AppState.timeoutId = setTimeout(
                this.logout.bind(this),
                CONFIG.SESSION_TIMEOUT
            );
        };

        // Iniciar temporizador
        resetTimer();

        // Restablecer temporizador con eventos de usuario
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'click'];
        events.forEach(event => {
            document.addEventListener(event, resetTimer, false);
        });
    }

    // Actualizar actividad del usuario
    updateActivity() {
        AppState.lastActivity = Date.now();
    }

    // Obtener datos del usuario
    async fetchUserData(token) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/usuario/actual`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener datos del usuario');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            throw error;
        }
    }

    // Cargar datos del dashboard
    async loadDashboardData() {
        try {
            // Aquí iría la lógica para cargar los datos del dashboard
            // Por ahora usamos datos de ejemplo
            const dashboardData = {
                promedioGeneral: 8.7,
                cursosInscritos: 5,
                tareasPendientes: 3,
                porcentajeAsistencia: 92,
                progresoSemestre: 40,
                proximasActividades: [
                    { actividad: 'Examen de Matemáticas', curso: 'Matemáticas IV', fecha: '2023-06-25', estado: 'Pendiente' },
                    { actividad: 'Entrega de Proyecto', curso: 'Programación Web', fecha: '2023-06-28', estado: 'En progreso' },
                    { actividad: 'Tarea de Física', curso: 'Física II', fecha: '2023-06-30', estado: 'Pendiente' },
                    { actividad: 'Presentación', curso: 'Inglés Técnico', fecha: '2023-07-02', estado: 'Por empezar' }
                ]
            };

            this.updateDashboardUI(dashboardData);
        } catch (error) {
            console.error('Error al cargar datos del dashboard:', error);
            throw error;
        }
    }

    // Actualizar la interfaz del dashboard
    updateDashboardUI(data) {
        // Actualizar estadísticas
        document.getElementById('promedioGeneral').textContent = data.promedioGeneral.toFixed(1);
        document.getElementById('cursosInscritos').textContent = data.cursosInscritos;
        document.getElementById('tareasPendientes').textContent = data.tareasPendientes;
        document.getElementById('porcentajeAsistencia').textContent = `${data.porcentajeAsistencia}%`;
        document.getElementById('progresoSemestre').textContent = `${data.progresoSemestre}%`;

        // Actualizar barra de progreso
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${data.progresoSemestre}%`;
            progressBar.setAttribute('aria-valuenow', data.progresoSemestre);
        }

        // Actualizar tabla de próximas actividades
        this.updateProximasActividades(data.proximasActividades);
    }

    // Actualizar tabla de próximas actividades
    updateProximasActividades(actividades) {
        const tbody = document.querySelector('#proximasActividades tbody');
        if (!tbody) return;

        // Limpiar tabla existente
        tbody.innerHTML = '';

        // Agregar nuevas filas
        actividades.forEach(actividad => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${actividad.actividad}</td>
                <td>${actividad.curso}</td>
                <td>${actividad.fecha}</td>
                <td><span class="badge bg-${this.getBadgeClass(actividad.estado)}">${actividad.estado}</span></td>
            `;
            
            tbody.appendChild(row);
        });

        // Inicializar DataTable si está disponible
        if (window.$.fn.DataTable) {
            if ($.fn.DataTable.isDataTable('#proximasActividades')) {
                $('#proximasActividades').DataTable().destroy();
            }
            
            $('#proximasActividades').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
                },
                order: [[2, 'asc']],
                responsive: true,
                pageLength: 5,
                lengthMenu: [5, 10, 25, 50]
            });
        }
    }

    // Obtener clase de badge según el estado
    getBadgeClass(estado) {
        const estados = {
            'pendiente': 'warning',
            'en progreso': 'info',
            'por empezar': 'secondary',
            'completado': 'success',
            'atrasado': 'danger',
            'reprobado': 'danger',
            'aprobado': 'success',
            'cursando': 'primary',
            'riesgo': 'warning'
        };
        
        return estados[estado.toLowerCase()] || 'secondary';
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new StudentPanelApp();
    window.app = app; // Hacer accesible desde la consola para depuración
});
