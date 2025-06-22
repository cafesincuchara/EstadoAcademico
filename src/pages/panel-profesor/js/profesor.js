// Variable para almacenar los datos del profesor
let profesorData = {
    nombre: '',
    id: '',
    departamento: 'Ciencias de la Computación', // Valor por defecto
    email: '',
    telefono: '',
    cursos: [],
    estudiantes: [],
    tareas: [],
    proximasClases: []
};

/**
 * Carga los datos del profesor autenticado
 */
async function cargarDatosProfesor() {
    try {
        // Obtener datos del usuario autenticado
        const userData = window.auth && window.auth.getUserData ? window.auth.getUserData() : null;
        if (!userData || userData.role !== 'profesor') {
            throw new Error('Acceso denegado: solo profesores pueden acceder a este panel');
        }
        // Si tienes endpoint real, puedes cargar así:
        // const perfil = await window.api.get('http://localhost:4000/api/profesor/perfil');
        // Mergea perfil con userData si es necesario
        // Actualizar datos del profesor con la información del usuario
        profesorData = {
            ...profesorData, // Mantener los valores por defecto
            nombre: userData.nombre,
            email: userData.email,
            id: userData.username || 'PROF-' + Math.floor(1000 + Math.random() * 9000), // Usar username o generar un ID
            
            // Datos de ejemplo (en un entorno real, estos vendrían de una API)
            cursos: [
                { 
                    id: 'CS101', 
                    nombre: 'Programación Avanzada', 
                    seccion: 'A', 
                    horario: 'Lun y Mie 10:00-12:00', 
                    aula: 'A-302',
                    estudiantes: 25,
                    creditos: 6
                },
                { 
                    id: 'CS201', 
                    nombre: 'Estructuras de Datos', 
                    seccion: 'B', 
                    horario: 'Mar y Jue 14:00-16:00', 
                    aula: 'B-205',
                    estudiantes: 20,
                    creditos: 6
                }
            ],
            estudiantes: [
                { id: '2023001', nombre: 'Juan Pérez', email: 'juan.perez@ejemplo.com', curso: 'CS101', asistencia: 85, calificacion: 8.5 },
                { id: '2023002', nombre: 'María González', email: 'maria.gonzalez@ejemplo.com', curso: 'CS101', asistencia: 92, calificacion: 9.2 },
                { id: '2023003', nombre: 'Carlos Sánchez', email: 'carlos.sanchez@ejemplo.com', curso: 'CS201', asistencia: 78, calificacion: 7.8 },
                { id: '2023004', nombre: 'Ana Martínez', email: 'ana.martinez@ejemplo.com', curso: 'CS201', asistencia: 95, calificacion: 9.5 }
            ],
            tareas: [
                { id: 1, titulo: 'Tarea 1: Programación Funcional', curso: 'CS101', fechaEntrega: '2025-06-30', entregados: 15, total: 25, estado: 'pendiente' },
                { id: 2, titulo: 'Proyecto Final', curso: 'CS201', fechaEntrega: '2025-07-15', entregados: 5, total: 20, estado: 'en_progreso' },
                { id: 3, titulo: 'Examen Parcial', curso: 'CS101', fechaEntrega: '2025-06-20', entregados: 25, total: 25, estado: 'calificado' }
            ],
            proximasClases: [
                { curso: 'Programación Avanzada', fecha: '2025-06-22', hora: '10:00', aula: 'A-302', tema: 'Programación Reactiva' },
                { curso: 'Estructuras de Datos', fecha: '2025-06-23', hora: '14:00', aula: 'B-205', tema: 'Árboles Binarios' }
            ]
        };
        
        // Actualizar la interfaz con los datos del profesor
        actualizarInterfazUsuario();
        
        // Mostrar notificación de bienvenida
        mostrarNotificacion(`Bienvenido/a, ${userData.nombre || 'Profesor/a'}`);
        
        return profesorData;
        
    } catch (error) {
        console.error('Error al cargar datos del profesor:', error);
        mostrarNotificacion('Error al cargar los datos del profesor', 'error');
        
        // Redirigir al login si no hay usuario autenticado
        if (error.message.includes('No se encontraron datos de usuario')) {
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
        
        throw error;
    }
}

// Función para actualizar la interfaz de usuario con los datos del profesor
function actualizarInterfazUsuario() {
    try {
        // Actualizar barra lateral
        const userAvatar = document.querySelector('.user-avatar');
        const userName = document.querySelector('.user-name');
        const userEmail = document.querySelector('.user-email');
        
        if (userAvatar) {
            userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profesorData.nombre || 'P')}&background=random`;
        }
        if (userName) userName.textContent = profesorData.nombre || 'Profesor';
        if (userEmail) userEmail.textContent = profesorData.email || '';
        
        // Actualizar encabezado
        const headerTitle = document.querySelector('.main-content h1');
        if (headerTitle) {
            headerTitle.textContent = `Bienvenido/a, ${profesorData.nombre || 'Profesor/a'}`;
        }
        
        // Actualizar información del perfil
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileDept = document.getElementById('profileDept');
        const profileId = document.getElementById('profileId');
        
        if (profileName) profileName.textContent = profesorData.nombre || 'Profesor';
        if (profileEmail) profileEmail.textContent = profesorData.email || '';
        if (profileDept) profileDept.textContent = profesorData.departamento || 'Departamento no especificado';
        if (profileId) profileId.textContent = profesorData.id || 'ID no disponible';
        
    } catch (error) {
        console.error('Error al actualizar la interfaz de usuario:', error);
        mostrarNotificacion('Error al actualizar la interfaz de usuario', 'error');
    }
}

// Inicialización cuando el documento esté listo
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Verificar autenticación
        window.auth.checkAuth('profesor');
        
        // Cargar datos del profesor
        await cargarDatosProfesor();
        
        // Inicializar componentes
        inicializarGraficos();
        inicializarTablas();
        inicializarCalendario();
        configurarEventListeners();
        
        // Configurar el botón de cierre de sesión
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.auth.logout();
            });
        }
        
    } catch (error) {
        console.error('Error al inicializar el panel del profesor:', error);
        mostrarNotificacion('Error al inicializar el panel del profesor', 'error');
    }
});

// Cargar datos del profesor
function cargarDatosProfesor() {
    // Actualizar información del perfil
    document.getElementById('nombreProfesor').textContent = profesorData.nombre;
    document.getElementById('idProfesor').textContent = profesorData.id;
    document.getElementById('departamento').textContent = profesorData.departamento;
    document.getElementById('emailProfesor').textContent = profesorData.email;
    document.getElementById('telefonoProfesor').textContent = profesorData.telefono;
    
    // Actualizar estadísticas
    document.getElementById('totalCursos').textContent = profesorData.cursos.length;
    document.getElementById('totalEstudiantes').textContent = profesorData.estudiantes.length;
    document.getElementById('tareasPendientes').textContent = 
        profesorData.tareas.filter(t => t.estado === 'pendiente').length;
}

// Inicializar gráficos
function inicializarGraficos() {
    // Gráfico de distribución de estudiantes por curso
    const ctxEstudiantes = document.getElementById('estudiantesChart').getContext('2d');
    new Chart(ctxEstudiantes, {
        type: 'doughnut',
        data: {
            labels: profesorData.cursos.map(c => c.nombre),
            datasets: [{
                data: profesorData.cursos.map(c => c.estudiantes),
                backgroundColor: ['#4e73df', '#36b9cc', '#1cc88a', '#f6c23e'],
                hoverBackgroundColor: ['#2e59d9', '#2c9faf', '#17a673', '#dda20a'],
                hoverBorderColor: 'rgba(234, 236, 244, 1)',
            }],
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20
                    }
                }
            }
        },
    });
    
    // Gráfico de progreso de tareas
    const ctxTareas = document.getElementById('tareasChart').getContext('2d');
    new Chart(ctxTareas, {
        type: 'bar',
        data: {
            labels: profesorData.tareas.map(t => t.titulo.substring(0, 15) + '...'),
            datasets: [{
                label: 'Entregados',
                data: profesorData.tareas.map(t => t.entregados),
                backgroundColor: '#4e73df',
                borderColor: '#4e73df',
                borderWidth: 1
            }, {
                label: 'Pendientes',
                data: profesorData.tareas.map(t => t.total - t.entregados),
                backgroundColor: '#e74a3b',
                borderColor: '#e74a3b',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Inicializar tablas con DataTables
function inicializarTablas() {
    // Tabla de cursos
    $('#cursosTable').DataTable({
        data: profesorData.cursos,
        columns: [
            { data: 'id' },
            { data: 'nombre' },
            { data: 'seccion' },
            { data: 'horario' },
            { data: 'aula' },
            { data: 'estudiantes' },
            {
                data: null,
                render: function(data, type, row) {
                    return `<button class="btn btn-sm btn-primary btn-ver-curso" data-id="${row.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>`;
                }
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        },
        responsive: true
    });

    // Tabla de estudiantes
    $('#estudiantesTable').DataTable({
        data: profesorData.estudiantes,
        columns: [
            { data: 'id' },
            { data: 'nombre' },
            { data: 'email' },
            { data: 'curso' },
            { 
                data: 'asistencia',
                render: function(data, type, row) {
                    const color = data >= 80 ? 'text-success' : 'text-danger';
                    return `<span class="fw-bold ${color}">${data}%</span>`;
                }
            },
            { 
                data: 'calificacion',
                render: function(data, type, row) {
                    const color = data >= 6 ? 'text-success' : 'text-warning';
                    return `<span class="fw-bold ${color}">${data}</span>`;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <div class="btn-group">
                            <button class="btn btn-sm btn-primary btn-editar" data-id="${row.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-info btn-enviar" data-email="${row.email}">
                                <i class="fas fa-envelope"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        },
        responsive: true
    });

    // Tabla de tareas
    $('#tareasTable').DataTable({
        data: profesorData.tareas,
        columns: [
            { data: 'titulo' },
            { data: 'curso' },
            { 
                data: 'fechaEntrega',
                render: function(data, type, row) {
                    return new Date(data).toLocaleDateString('es-ES');
                }
            },
            { 
                data: null,
                render: function(data, type, row) {
                    return `${row.entregados} / ${row.total}`;
                }
            },
            { 
                data: 'estado',
                render: function(data, type, row) {
                    let badgeClass = 'secondary';
                    let estadoTexto = 'Pendiente';
                    
                    if (data === 'en_progreso') {
                        badgeClass = 'primary';
                        estadoTexto = 'En progreso';
                    } else if (data === 'calificado') {
                        badgeClass = 'success';
                        estadoTexto = 'Calificado';
                    }
                    
                    return `<span class="badge bg-${badgeClass}">${estadoTexto}</span>`;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <div class="btn-group">
                            <button class="btn btn-sm btn-primary btn-ver-tarea" data-id="${row.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning btn-editar-tarea" data-id="${row.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        },
        responsive: true,
        order: [[2, 'asc']] // Ordenar por fecha de entrega
    });
}

// Inicializar calendario
function inicializarCalendario() {
    const calendarEl = document.getElementById('calendario');
    if (!calendarEl) return;
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            ...profesorData.proximasClases.map(clase => ({
                title: `${clase.curso} - ${clase.tema}`,
                start: `${clase.fecha}T${clase.hora}:00`,
                extendedProps: {
                    aula: clase.aula
                },
                backgroundColor: '#4e73df',
                borderColor: '#4e73df'
            })),
            ...profesorData.tareas.map(tarea => ({
                title: `📝 ${tarea.titulo} (${tarea.curso})`,
                start: tarea.fechaEntrega,
                allDay: true,
                backgroundColor: tarea.estado === 'calificado' ? '#1cc88a' : 
                                 (tarea.estado === 'en_progreso' ? '#f6c23e' : '#e74a3b'),
                borderColor: tarea.estado === 'calificado' ? '#1cc88a' : 
                               (tarea.estado === 'en_progreso' ? '#f6c23e' : '#e74a3b')
            }))
        ],
        eventDidMount: function(info) {
            if (info.event.extendedProps.aula) {
                // Agregar tooltip para las clases
                const tooltip = new bootstrap.Tooltip(info.el, {
                    title: `Aula: ${info.event.extendedProps.aula}`,
                    placement: 'top',
                    trigger: 'hover',
                    container: 'body'
                });
            } else {
                // Agregar tooltip para las tareas
                const tooltip = new bootstrap.Tooltip(info.el, {
                    title: 'Fecha límite de entrega',
                    placement: 'top',
                    trigger: 'hover',
                    container: 'body'
                });
            }
        }
    });
    
    calendar.render();
}

// Configurar event listeners
function configurarEventListeners() {
    // Navegación entre pestañas
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-bs-target');
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            document.querySelector(target).classList.add('show', 'active');
            
            // Actualizar clase activa en la navegación
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Botón de ver curso
    $(document).on('click', '.btn-ver-curso', function() {
        const cursoId = $(this).data('id');
        const curso = profesorData.cursos.find(c => c.id === cursoId);
        
        if (curso) {
            // Actualizar modal con información del curso
            document.getElementById('cursoModalLabel').textContent = curso.nombre;
            document.getElementById('modalCursoId').textContent = curso.id;
            document.getElementById('modalSeccion').textContent = curso.seccion;
            document.getElementById('modalHorario').textContent = curso.horario;
            document.getElementById('modalAula').textContent = curso.aula;
            document.getElementById('modalEstudiantes').textContent = curso.estudiantes;
            document.getElementById('modalCreditos').textContent = curso.creditos;
            
            // Mostrar estudiantes del curso
            const estudiantesList = document.getElementById('estudiantesCurso');
            estudiantesList.innerHTML = '';
            
            const estudiantes = profesorData.estudiantes.filter(e => e.curso === curso.id);
            estudiantes.forEach(estudiante => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    ${estudiante.nombre}
                    <span class="badge bg-primary rounded-pill">${estudiante.calificacion}</span>
                `;
                estudiantesList.appendChild(li);
            });
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('cursoModal'));
            modal.show();
        }
    });

    // Botón de editar estudiante
    $(document).on('click', '.btn-editar', function() {
        const estudianteId = $(this).data('id');
        const estudiante = profesorData.estudiantes.find(e => e.id === estudianteId);
        
        if (estudiante) {
            // Actualizar formulario de edición
            document.getElementById('editEstudianteId').value = estudiante.id;
            document.getElementById('editNombre').value = estudiante.nombre;
            document.getElementById('editEmail').value = estudiante.email;
            document.getElementById('editCurso').value = estudiante.curso;
            document.getElementById('editAsistencia').value = estudiante.asistencia;
            document.getElementById('editCalificacion').value = estudiante.calificacion;
            
            // Mostrar modal de edición
            const modal = new bootstrap.Modal(document.getElementById('editarEstudianteModal'));
            modal.show();
        }
    });

    // Botón de enviar correo
    $(document).on('click', '.btn-enviar', function() {
        const email = $(this).data('email');
        window.location.href = `mailto:${email}?subject=Comunicación%20importante`;
    });

    // Botón de ver tarea
    $(document).on('click', '.btn-ver-tarea', function() {
        const tareaId = $(this).data('id');
        const tarea = profesorData.tareas.find(t => t.id === tareaId);
        
        if (tarea) {
            // Actualizar modal con información de la tarea
            document.getElementById('tareaModalLabel').textContent = tarea.titulo;
            document.getElementById('modalTareaCurso').textContent = tarea.curso;
            document.getElementById('modalFechaEntrega').textContent = new Date(tarea.fechaEntrega).toLocaleDateString('es-ES');
            document.getElementById('modalEntregados').textContent = `${tarea.entregados} de ${tarea.total}`;
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('tareaModal'));
            modal.show();
        }
    });

    // Botón de editar tarea
    $(document).on('click', '.btn-editar-tarea', function() {
        const tareaId = $(this).data('id');
        const tarea = profesorData.tareas.find(t => t.id === tareaId);
        
        if (tarea) {
            // Actualizar formulario de edición
            document.getElementById('editTareaId').value = tarea.id;
            document.getElementById('editTitulo').value = tarea.titulo;
            document.getElementById('editTareaCurso').value = tarea.curso;
            document.getElementById('editFechaEntrega').value = tarea.fechaEntrega;
            document.getElementById('editEntregados').value = tarea.entregados;
            document.getElementById('editTotal').value = tarea.total;
            document.getElementById('editEstado').value = tarea.estado;
            
            // Mostrar modal de edición
            const modal = new bootstrap.Modal(document.getElementById('editarTareaModal'));
            modal.show();
        }
    });

    // Guardar cambios de estudiante
    document.getElementById('guardarCambiosEstudiante')?.addEventListener('click', function() {
        const estudianteId = document.getElementById('editEstudianteId').value;
        const estudiante = profesorData.estudiantes.find(e => e.id === estudianteId);
        
        if (estudiante) {
            // Actualizar datos del estudiante
            estudiante.nombre = document.getElementById('editNombre').value;
            estudiante.email = document.getElementById('editEmail').value;
            estudiante.curso = document.getElementById('editCurso').value;
            estudiante.asistencia = parseFloat(document.getElementById('editAsistencia').value);
            estudiante.calificacion = parseFloat(document.getElementById('editCalificacion').value);
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editarEstudianteModal'));
            modal.hide();
            
            // Mostrar notificación
            mostrarNotificacion('Cambios guardados correctamente', 'success');
            
            // Recargar la tabla
            $('#estudiantesTable').DataTable().ajax.reload();
        }
    });

    // Guardar cambios de tarea
    document.getElementById('guardarCambiosTarea')?.addEventListener('click', function() {
        const tareaId = parseInt(document.getElementById('editTareaId').value);
        const tarea = profesorData.tareas.find(t => t.id === tareaId);
        
        if (tarea) {
            // Actualizar datos de la tarea
            tarea.titulo = document.getElementById('editTitulo').value;
            tarea.curso = document.getElementById('editTareaCurso').value;
            tarea.fechaEntrega = document.getElementById('editFechaEntrega').value;
            tarea.entregados = parseInt(document.getElementById('editEntregados').value);
            tarea.total = parseInt(document.getElementById('editTotal').value);
            tarea.estado = document.getElementById('editEstado').value;
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editarTareaModal'));
            modal.hide();
            
            // Mostrar notificación
            mostrarNotificacion('Tarea actualizada correctamente', 'success');
            
            // Recargar la tabla y el calendario
            $('#tareasTable').DataTable().ajax.reload();
            inicializarCalendario();
        }
    });

    // Botón de cierre de sesión
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = '/src/pages/login/index.html';
    });
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notificacion.role = 'alert';
    notificacion.style.zIndex = '9999';
    notificacion.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Eliminar la notificación después de 5 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 5000);
}
