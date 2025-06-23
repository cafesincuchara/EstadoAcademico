// Controlador principal del panel admin
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar (misma lógica que otros paneles)
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
        
        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            sidebar.classList.add('collapsed');
        }
    }

    // Funcionalidad específica de admin
    document.querySelectorAll('.btn-admin-action').forEach(btn => {
        btn.addEventListener('click', handleAdminAction);
    });
});

function handleAdminAction() {
    // Lógica para acciones administrativas
    console.log('Admin action:', this.dataset.action);
}
