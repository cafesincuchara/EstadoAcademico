// Controlador principal del panel estudiante
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
        
        // Restaurar estado del sidebar
        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            sidebar.classList.add('collapsed');
        }
    }

    // Configurar listeners para todos los botones de logout
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    // Cargar perfil estudiantil
    loadStudentData();
});

function handleLogout(e) {
    e.preventDefault();
    
    // Confirmar con el usuario
    const confirmLogout = confirm('¿Estás seguro que deseas cerrar sesión?');
    if (!confirmLogout) return;

    // Limpiar datos de sesión
    localStorage.removeItem('currentUser');
    
    // Redirigir a login con parámetro de logout
    window.location.href = '../../pages/login.html?logout=true';
}

// Exportar funciones si se necesitan en otros módulos
export function initStudentComponents() {
    // Inicialización de componentes específicos
}

export function loadStudentData() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (user) {
        // Actualizar UI básica
        document.getElementById('studentName').textContent = user.name;
        document.getElementById('usernameNav').textContent = user.name;
        
        // Cargar perfil completo
        loadStudentProfile(user);
        
        // Inicializar componentes
        initGradesTable();
        initCalendar();
    }
}

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=Usuario&size=128';

function loadStudentProfile(user) {
    document.getElementById('student-name').textContent = user.name;
    document.getElementById('student-email').textContent = user.email;
    document.getElementById('student-major').textContent = user.major;
    document.getElementById('student-id').textContent = user.studentId;
    
    const avatarImg = document.getElementById('student-avatar');
    if (avatarImg) {
        avatarImg.src = user.avatar || DEFAULT_AVATAR;
        avatarImg.alt = `Avatar de ${user.name}`;
    }
}

function initGradesTable() {
    // Inicialización de la tabla de calificaciones
}

function initCalendar() {
    // Inicialización del calendario
}
