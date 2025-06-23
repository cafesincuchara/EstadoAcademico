// Controlador principal del login
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('logout')) {
    console.log('Usuario cerró sesión correctamente');
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('errorMsg');
    errorElement.textContent = '';

    try {
        // Obtener rol del formulario o null para cualquier rol
        const roleElement = document.querySelector('[name="user-type"]:checked');
        const role = roleElement ? roleElement.value : null;
        const result = await authenticateUser(username, password, role);
        
        if (result.success) {
            redirectByRole(result.user.role);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        errorElement.textContent = error.message;
        console.error('Error en login:', error);
    }
});

async function authenticateUser(username, password, role) {
    // Simular validación asíncrona
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = login(username, password, role);
            resolve(result);
        }, 500);
    });
}

function redirectByRole(role) {
    const panels = {
        'admin': 'panel-admin',
        'profesor': 'panel-profesor',
        'estudiante': 'panel-estudiante'
    };

    const panel = panels[role];
    if (panel) {
        window.location.href = `../../pages/${panel}/index.html`;
    } else {
        throw new Error('Rol no reconocido');
    }
}
