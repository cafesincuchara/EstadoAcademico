// Controlador principal del panel profesor
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar (misma lógica que estudiante)
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

    // Funcionalidad específica de profesor
    document.querySelectorAll('.btn-grade-action').forEach(btn => {
        btn.addEventListener('click', handleGradeAction);
    });
});

function handleGradeAction() {
    // Lógica para acciones de calificación
    console.log('Grade action:', this.dataset.action);
}
