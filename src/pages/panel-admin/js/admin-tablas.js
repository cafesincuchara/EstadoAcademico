/**
 * Funciones para manejar las tablas de datos del panel de administración
 */

// Cargar lista de usuarios
function cargarUsuarios() {
    const tbody = document.querySelector('#tabla-usuarios tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.rol}</td>
            <td><span class="badge ${usuario.estado === 'Activo' ? 'bg-success' : 'bg-danger'}">${usuario.estado}</span></td>
            <td>${usuario.fechaRegistro}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-editar" data-id="${usuario.id}" data-tipo="usuario">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${usuario.id}" data-tipo="usuario">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
    
    // Inicializar DataTable
    if ($.fn.DataTable.isDataTable('#tabla-usuarios')) {
        $('#tabla-usuarios').DataTable().destroy();
    }
    
    $('#tabla-usuarios').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        },
        responsive: true,
        order: [[0, 'desc']]
    });
}

// Cargar lista de estudiantes
function cargarEstudiantes() {
    const tbody = document.querySelector('#tabla-estudiantes tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.estudiantes.forEach(estudiante => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${estudiante.id}</td>
            <td>${estudiante.nombre}</td>
            <td>${estudiante.email}</td>
            <td>${estudiante.carrera}</td>
            <td>${estudiante.semestre}° Semestre</td>
            <td><span class="badge ${estudiante.estado === 'Activo' ? 'bg-success' : 'bg-danger'}">${estudiante.estado}</span></td>
            <td>${estudiante.fechaIngreso}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-editar" data-id="${estudiante.id}" data-tipo="estudiante">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${estudiante.id}" data-tipo="estudiante">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
    
    // Inicializar DataTable
    if ($.fn.DataTable.isDataTable('#tabla-estudiantes')) {
        $('#tabla-estudiantes').DataTable().destroy();
    }
    
    $('#tabla-estudiantes').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        },
        responsive: true,
        order: [[0, 'desc']]
    });
}

// Cargar lista de profesores
function cargarProfesores() {
    const tbody = document.querySelector('#tabla-profesores tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.profesores.forEach(profesor => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${profesor.id}</td>
            <td>${profesor.nombre}</td>
            <td>${profesor.email}</td>
            <td>${profesor.especialidad}</td>
            <td><span class="badge ${profesor.estado === 'Activo' ? 'bg-success' : 'bg-danger'}">${profesor.estado}</span></td>
            <td>${profesor.fechaContratacion}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-editar" data-id="${profesor.id}" data-tipo="profesor">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${profesor.id}" data-tipo="profesor">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
    
    // Inicializar DataTable
    if ($.fn.DataTable.isDataTable('#tabla-profesores')) {
        $('#tabla-profesores').DataTable().destroy();
    }
    
    $('#tabla-profesores').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        },
        responsive: true,
        order: [[0, 'desc']]
    });
}

// Cargar lista de cursos
function cargarCursos() {
    const tbody = document.querySelector('#tabla-cursos tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.cursos.forEach(curso => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${curso.codigo}</td>
            <td>${curso.nombre}</td>
            <td>${curso.profesor}</td>
            <td>${curso.horario}</td>
            <td>${curso.dias}</td>
            <td>${curso.matriculados} / ${curso.cupo}</td>
            <td>
                <span class="badge ${
                    curso.estado === 'Activo' ? 'bg-success' : 
                    curso.estado === 'En espera' ? 'bg-warning' :
                    curso.estado === 'Completo' ? 'bg-info' : 'bg-secondary'
                }">${curso.estado}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary btn-editar" data-id="${curso.id}" data-tipo="curso">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${curso.id}" data-tipo="curso">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
    
    // Inicializar DataTable
    if ($.fn.DataTable.isDataTable('#tabla-cursos')) {
        $('#tabla-cursos').DataTable().destroy();
    }
    
    $('#tabla-cursos').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        },
        responsive: true,
        order: [[0, 'desc']]
    });
}

// Cargar configuración
function cargarConfiguracion() {
    const configSection = document.getElementById('configuracion');
    if (!configSection) return;
    
    configSection.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Configuración del Sistema</h5>
            </div>
            <div class="card-body">
                <form id="form-configuracion">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="nombre-institucion" class="form-label">Nombre de la Institución</label>
                                <input type="text" class="form-control" id="nombre-institucion" value="Instituto Tecnológico Ejemplo">
                            </div>
                            <div class="mb-3">
                                <label for="logo-institucion" class="form-label">Logo de la Institución</label>
                                <input class="form-control" type="file" id="logo-institucion">
                            </div>
                            <div class="mb-3">
                                <label for="correo-contacto" class="form-label">Correo de Contacto</label>
                                <input type="email" class="form-control" id="correo-contacto" value="contacto@ejemplo.com">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="maximo-intentos" class="form-label">Máximo de Intentos de Inicio de Sesión</label>
                                <input type="number" class="form-control" id="maximo-intentos" value="3" min="1" max="10">
                            </div>
                            <div class="form-check form-switch mb-3">
                                <input class="form-check-input" type="checkbox" id="modo-mantenimiento" checked>
                                <label class="form-check-label" for="modo-mantenimiento">Modo Mantenimiento</label>
                            </div>
                            <div class="form-check form-switch mb-3">
                                <input class="form-check-input" type="checkbox" id="registro-usuarios" checked>
                                <label class="form-check-label" for="registro-usuarios">Permitir Registro de Usuarios</label>
                            </div>
                        </div>
                    </div>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="button" class="btn btn-secondary me-md-2">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Configurar evento del formulario
    const form = document.getElementById('form-configuracion');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            mostrarAlerta('Configuración guardada correctamente', 'success');
        });
    }
}
