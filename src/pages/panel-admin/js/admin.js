/**
 * Archivo principal del panel de administración
 * Contiene la configuración inicial y funciones principales
 */

// Variable para almacenar los datos del administrador
let adminData = {
    // Datos del administrador (se llenarán dinámicamente)
    admin: {
        nombre: "",
        email: "",
        rol: "Administrador",
        ultimoAcceso: new Date().toLocaleString()
    },
    
    // Estadísticas (datos de ejemplo por defecto)
    estadisticas: {
        totalUsuarios: 0,
        totalEstudiantes: 0,
        totalProfesores: 0,
        totalCursos: 0,
        usuariosActivos: 0,
        usuariosInactivos: 0,
        nuevosUsuarios: 0,
        usuariosPorRol: {
            administradores: 1,
            profesores: 0,
            estudiantes: 0,
            preceptores: 0
        }
    },
    
    // Listas que se llenarán dinámicamente
    usuariosRecientes: [],
    usuarios: [],
    estudiantes: [],
    profesores: [],
    cursos: []
};

/**
 * Carga los datos del administrador autenticado
 */
async function cargarDatosAdmin() {
    try {
        // Obtener datos del usuario autenticado
        const userData = window.auth && window.auth.getUserData ? window.auth.getUserData() : null;
        if (!userData || userData.role !== 'admin') {
            throw new Error('Acceso denegado: solo administradores pueden acceder a este panel');
        }
        // Si tienes endpoint real, puedes cargar así:
        // const perfil = await window.api.get('http://localhost:4000/api/admin/perfil');
        // Mergea perfil con userData si es necesario
        // Actualizar datos del administrador
        adminData.admin = {
            nombre: userData.nombre || 'Administrador/a',
            email: userData.email || '',
            rol: 'Administrador',
            ultimoAcceso: new Date().toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };
        
        // Actualizar la interfaz
        actualizarInfoUsuario();
        
        // Generar datos de ejemplo (en un entorno real, estos vendrían de una API)
        generarDatosEjemplo();
        
        // Mostrar notificación de bienvenida
        mostrarAlerta({
            titulo: '¡Bienvenido/a!',
            mensaje: `Sesión iniciada como ${adminData.admin.nombre}`,
            tipo: 'success',
            tiempo: 3000
        });
        
        return adminData;
        
    } catch (error) {
        console.error('Error al cargar datos del administrador:', error);
        
        // Mostrar mensaje de error adecuado
        const mensajeError = error.message.includes('acceso denegado') 
            ? 'No tienes permisos para acceder a esta sección' 
            : 'Error al cargar los datos del administrador';
            
        mostrarAlerta({
            titulo: 'Error',
            mensaje: mensajeError,
            tipo: 'danger',
            tiempo: 5000
        });
        
        // Redirigir según el tipo de error
        if (error.message.includes('No se encontraron datos de usuario') || 
            error.message.includes('acceso denegado')) {
            
            // Limpiar datos de sesión
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            
            // Redirigir después de un breve retraso
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
        
        throw error; // Relanzar el error para manejarlo en el flujo principal
    }
}

/**
 * Inicializa la aplicación del panel de administración
 */
async function inicializarAplicacion() {
    try {
        // Verificar autenticación
        window.auth.checkAuth('admin');
        
        // Cargar datos del usuario autenticado
        const userData = JSON.parse(localStorage.getItem('user_data'));
        if (!userData || userData.role !== 'admin') {
            throw new Error('Acceso denegado: se requiere rol de administrador');
        }
        
        // Cargar datos del administrador
        await cargarDatosAdmin();
        
        // Inicializar componentes
        inicializarPestanias();
        
        // Cargar el contenido inicial
        cargarContenido('inicio');
        
        // Configurar el menú desplegable del usuario
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            new bootstrap.Dropdown(userMenu);
        }
        
        // Configurar el botón de cierre de sesión
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Limpiar datos de autenticación
                window.auth.logout();
            });
        }
        
        // Inicializar DataTables si existe la función
        if (typeof inicializarDataTables === 'function') {
            inicializarDataTables();
        }
        
    } catch (error) {
        console.error('Error al inicializar el panel de administración:', error);
        mostrarAlerta(`Error: ${error.message || 'No se pudo inicializar el panel de administración'}`, 'danger');
        
        // Redirigir al login si hay un error de autenticación
        if (error.message.includes('acceso denegado') || error.message.includes('No se encontraron datos de usuario')) {
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacion);
} else {
    // El DOM ya está listo
    inicializarAplicacion();
}

// Función para generar datos de ejemplo
function generarDatosEjemplo() {
    // Generar usuarios
    for (let i = 1; i <= 50; i++) {
        const tipo = Math.random() > 0.7 ? 'profesor' : 'estudiante';
        const nombre = tipo === 'profesor' ? 
            `Profesor ${String.fromCharCode(65 + (i % 10))}${i}` : 
            `Estudiante ${String.fromCharCode(65 + (i % 10))}${i}`;
        
        const email = `${tipo}${i}@ejemplo.com`;
        const estado = Math.random() > 0.2 ? 'Activo' : 'Inactivo';
        
        adminData.usuarios.push({
            id: i,
            nombre: nombre,
            email: email,
            rol: tipo === 'profesor' ? 'Profesor' : 'Estudiante',
            estado: estado,
            fechaRegistro: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
        
        if (tipo === 'profesor') {
            adminData.profesores.push({
                id: i,
                nombre: nombre,
                email: email,
                especialidad: ['Matemáticas', 'Ciencias', 'Literatura', 'Historia', 'Inglés'][Math.floor(Math.random() * 5)],
                estado: estado,
                fechaContratacion: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
        } else {
            adminData.estudiantes.push({
                id: i,
                nombre: nombre,
                email: email,
                carrera: ['Ingeniería', 'Medicina', 'Derecho', 'Administración', 'Arquitectura'][Math.floor(Math.random() * 5)],
                semestre: Math.floor(Math.random() * 10) + 1,
                estado: estado,
                fechaIngreso: new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
        }
    }
    
    // Generar cursos
    const materias = ['Matemáticas', 'Física', 'Química', 'Biología', 'Literatura', 'Historia', 'Geografía', 'Inglés', 'Programación', 'Bases de Datos'];
    for (let i = 1; i <= 20; i++) {
        const materia = materias[Math.floor(Math.random() * materias.length)];
        const profesor = adminData.profesores[Math.floor(Math.random() * adminData.profesores.length)];
        
        adminData.cursos.push({
            id: i,
            codigo: `CUR-${1000 + i}`,
            nombre: `${materia} ${Math.floor(Math.random() * 5) + 1}0${i % 10}`,
            profesor: profesor.nombre,
            profesorId: profesor.id,
            horario: `${Math.floor(Math.random() * 5) + 8}:00 - ${Math.floor(Math.random() * 5) + 14}:00`,
            dias: ['Lun-Mié-Vie', 'Mar-Jue', 'Lun-Jue', 'Mar-Vie', 'Mié-Vie'][Math.floor(Math.random() * 5)],
            cupo: Math.floor(Math.random() * 20) + 10,
            matriculados: Math.floor(Math.random() * 15) + 5,
            estado: ['Activo', 'En espera', 'Completo', 'Cancelado'][Math.floor(Math.random() * 4)]
        });
    }
}

// Función para actualizar la información del usuario en la interfaz
function actualizarInfoUsuario() {
    try {
        // Actualizar barra lateral
        const userAvatar = document.querySelector('.user-avatar');
        const userName = document.querySelector('.user-name');
        const userEmail = document.querySelector('.user-email');
        
        if (userAvatar) {
            userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(adminData.admin.nombre || 'A')}&background=random`;
        }
        if (userName) userName.textContent = adminData.admin.nombre || 'Administrador';
        if (userEmail) userEmail.textContent = adminData.admin.email || '';
        
        // Actualizar encabezado
        const headerTitle = document.querySelector('.main-content h1');
        if (headerTitle) {
            headerTitle.textContent = `Bienvenido/a, ${adminData.admin.nombre || 'Administrador/a'}`;
        }
        
        // Actualizar información de perfil en la sección correspondiente
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileRole = document.getElementById('profileRole');
        const lastAccess = document.getElementById('lastAccess');
        
        if (profileName) profileName.textContent = adminData.admin.nombre || 'Administrador';
        if (profileEmail) profileEmail.textContent = adminData.admin.email || '';
        if (profileRole) profileRole.textContent = adminData.admin.rol || 'Administrador';
        if (lastAccess) lastAccess.textContent = `Último acceso: ${adminData.admin.ultimoAcceso || new Date().toLocaleString()}`;
        
    } catch (error) {
        console.error('Error al actualizar la información del usuario:', error);
        mostrarAlerta('Error al actualizar la información del usuario', 'danger');
    }
}

// Función para inicializar las pestañas
function inicializarPestanias() {
    // Configurar evento para cambiar entre pestañas
    const enlacesPestanias = document.querySelectorAll('.sidebar-link[data-bs-toggle="tab"]');
    enlacesPestanias.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los enlaces
            enlacesPestanias.forEach(el => el.classList.remove('active'));
            
            // Agregar clase active al enlace clickeado
            this.classList.add('active');
            
            // Obtener el ID del contenido a mostrar
            const targetId = this.getAttribute('href').substring(1);
            
            // Cargar el contenido correspondiente
            cargarContenido(targetId);
        });
    });
}

// Función para cargar el contenido de una pestaña
function cargarContenido(tabId) {
    // Ocultar todos los contenidos
    const contenidos = document.querySelectorAll('.tab-pane');
    contenidos.forEach(contenido => {
        contenido.classList.remove('show', 'active');
    });
    
    // Mostrar el contenido seleccionado
    const contenidoSeleccionado = document.getElementById(tabId);
    if (contenidoSeleccionado) {
        contenidoSeleccionado.classList.add('show', 'active');
        
        // Cargar datos específicos según la pestaña
        switch(tabId) {
            case 'dashboard':
                cargarDashboard();
                break;
            case 'usuarios':
                cargarUsuarios();
                break;
            case 'estudiantes':
                cargarEstudiantes();
                break;
            case 'profesores':
                cargarProfesores();
                break;
            case 'cursos':
                cargarCursos();
                break;
            case 'configuracion':
                cargarConfiguracion();
                break;
        }
    }
}

// Función para inicializar DataTables
function inicializarDataTables() {
    // Inicializar DataTables para todas las tablas
    $('.datatable').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        },
        responsive: true,
        order: [[0, 'desc']]
    });
}

/**
 * Muestra una alerta en la interfaz
 * @param {string|object} opciones - Puede ser un mensaje (string) o un objeto con opciones
 * @param {string} [tipo='info'] - Tipo de alerta (solo si el primer parámetro es un string)
 */
function mostrarAlerta(opciones, tipo = 'info') {
    try {
        // Manejar diferentes formatos de parámetros
        let config = {};
        
        if (typeof opciones === 'string') {
            // Formato antiguo: mostrarAlerta(mensaje, tipo)
            config = {
                mensaje: opciones,
                tipo: tipo || 'info',
                tiempo: 5000
            };
        } else if (typeof opciones === 'object' && opciones !== null) {
            // Formato nuevo: mostrarAlerta({ mensaje, tipo, titulo, tiempo })
            config = {
                mensaje: opciones.mensaje || 'Mensaje no especificado',
                tipo: opciones.tipo || 'info',
                titulo: opciones.titulo || (opciones.tipo === 'error' ? 'Error' : 
                                       opciones.tipo === 'success' ? 'Éxito' :
                                       opciones.tipo === 'warning' ? 'Advertencia' : 'Información'),
                tiempo: opciones.tiempo || 5000
            };
        } else {
            console.error('Formato de parámetros no válido para mostrarAlerta');
            return;
        }
        
        // Crear elemento de alerta
        const alerta = document.createElement('div');
        alerta.className = `alert alert-${config.tipo} alert-dismissible fade show`;
        alerta.role = 'alert';
        
        // Contenido de la alerta
        let contenido = '';
        
        // Agregar título si está definido
        if (config.titulo) {
            contenido += `<h6 class="alert-heading">${config.titulo}</h6>`;
        }
        
        // Agregar mensaje
        contenido += `<div>${config.mensaje}</div>`;
        
        // Agregar botón de cierre
        contenido += `
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar">
                <span aria-hidden="true">&times;</span>
            </button>
        `;
        
        alerta.innerHTML = contenido;
        
        // Agregar al contenedor de alertas o al body si no existe
        let alertasContainer = document.getElementById('alertas');
        if (!alertasContainer) {
            // Crear contenedor si no existe
            alertasContainer = document.createElement('div');
            alertasContainer.id = 'alertas';
            alertasContainer.style.position = 'fixed';
            alertasContainer.style.top = '20px';
            alertasContainer.style.right = '20px';
            alertasContainer.style.zIndex = '9999';
            alertasContainer.style.maxWidth = '350px';
            document.body.appendChild(alertasContainer);
        }
        
        // Insertar la nueva alerta al principio
        if (alertasContainer.firstChild) {
            alertasContainer.insertBefore(alerta, alertasContainer.firstChild);
        } else {
            alertasContainer.appendChild(alerta);
        }
        
        // Inicializar el componente de Bootstrap
        const bsAlert = new bootstrap.Alert(alerta);
        
        // Eliminar la alerta después del tiempo especificado
        if (config.tiempo > 0) {
            setTimeout(() => {
                if (document.body.contains(alerta)) {
                    bsAlert.close();
                }
            }, config.tiempo);
        }
        
        // Manejar el cierre de la alerta
        alerta.addEventListener('closed.bs.alert', () => {
            if (alertasContainer && alertasContainer.children.length === 0) {
                // Eliminar el contenedor si no hay más alertas
                alertasContainer.remove();
            }
        });
        
    } catch (error) {
        console.error('Error al mostrar la alerta:', error);
        // Fallback: mostrar alerta nativa
        const mensaje = typeof opciones === 'object' ? (opciones.mensaje || 'Error desconocido') : opciones;
        alert(`[${tipo.toUpperCase()}] ${mensaje}`);
    }
}

/**
 * Muestra un diálogo de confirmación antes de eliminar un elemento
 * @param {string} id - ID del elemento a eliminar
 * @param {string} tipo - Tipo de elemento (usuario, estudiante, profesor, curso)
 */
function confirmarEliminacion(id, tipo) {
    if (confirm(`¿Está seguro de eliminar este ${tipo}?`)) {
        // Aquí iría la lógica para eliminar el elemento
        mostrarAlerta({
            titulo: 'Eliminación exitosa',
            mensaje: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} eliminado correctamente`,
            tipo: 'success'
        });
        
        // Recargar la tabla correspondiente (estas funciones deberían estar definidas en otro lugar)
        const funcionesRecarga = {
            'usuario': 'cargarUsuarios',
            'estudiante': 'cargarEstudiantes',
            'profesor': 'cargarProfesores',
            'curso': 'cargarCursos'
        };
        
        const funcionRecarga = funcionesRecarga[tipo];
        if (funcionRecarga && typeof window[funcionRecarga] === 'function') {
            window[funcionRecarga]();
        }
    }
}
