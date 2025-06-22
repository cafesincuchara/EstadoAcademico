// Registro universal multi-rol
// Requiere /src/js/auth.js y /src/js/api.js cargados en el HTML

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = form.email.value.trim();
        const password = form.password.value;
        const nombre = form.nombre?.value?.trim() || '';
        const role = form.role ? form.role.value : 'estudiante'; // Opción por defecto

        if (!email || !password || !nombre) {
            toastr.error('Completa todos los campos requeridos');
            return;
        }
        try {
            // Llama a la API universal para registrar
            const res = await window.api.post('http://localhost:4000/api/register', {
                email, password, nombre, role
            });
            if (!res || !res.token || !res.user) {
                toastr.error(res.message || 'Registro fallido');
                return;
            }
            // Normalizar rol recibido
            let rawRole = res.user.role || '';
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
            console.log('[REGISTRO] Rol recibido:', rawRole, '-> Normalizado:', role);
            res.user.role = role;

            // Guarda datos y redirige según el rol
            await window.auth.setAuthData(res.token, res.user);
            toastr.success('¡Registro exitoso! Redirigiendo...');
            setTimeout(() => {
                const dashboard = window.auth.getDashboardPath(res.user.role);
                window.location.href = dashboard;
            }, 1200);
        } catch (err) {
            toastr.error(err.message || 'Error al registrar');
        }
    });
});
