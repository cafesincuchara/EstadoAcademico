/**
 * Funciones para manejar los modales de edición en el panel de administración
 */

// Abrir modal de edición
function abrirModalEditar(id, tipo) {
    // Obtener los datos según el tipo
    let datos = null;
    let titulo = '';
    
    switch(tipo) {
        case 'usuario':
            datos = adminData.usuarios.find(u => u.id == id);
            titulo = 'Editar Usuario';
            break;
        case 'estudiante':
            datos = adminData.estudiantes.find(e => e.id == id);
            titulo = 'Editar Estudiante';
            break;
        case 'profesor':
            datos = adminData.profesores.find(p => p.id == id);
            titulo = 'Editar Profesor';
            break;
        case 'curso':
            datos = adminData.cursos.find(c => c.id == id);
            titulo = 'Editar Curso';
            break;
    }
    
    if (!datos) return;
    
    // Crear el contenido del modal según el tipo
    let contenido = '';
    
    switch(tipo) {
        case 'usuario':
            contenido = `
                <div class="mb-3">
                    <label for="edit-nombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="edit-nombre" value="${datos.nombre}">
                </div>
                <div class="mb-3">
                    <label for="edit-email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="edit-email" value="${datos.email}">
                </div>
                <div class="mb-3">
                    <label for="edit-rol" class="form-label">Rol</label>
                    <select class="form-select" id="edit-rol">
                        <option value="Administrador" ${datos.rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
                        <option value="Profesor" ${datos.rol === 'Profesor' ? 'selected' : ''}>Profesor</option>
                        <option value="Estudiante" ${datos.rol === 'Estudiante' ? 'selected' : ''}>Estudiante</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="edit-estado" class="form-label">Estado</label>
                    <select class="form-select" id="edit-estado">
                        <option value="Activo" ${datos.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                        <option value="Inactivo" ${datos.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                    </select>
                </div>
            `;
            break;
            
        case 'estudiante':
            const carreras = ['Ingeniería', 'Medicina', 'Derecho', 'Administración', 'Arquitectura'];
            const opcionesCarreras = carreras.map(c => 
                `<option value="${c}" ${datos.carrera === c ? 'selected' : ''}>${c}</option>`
            ).join('');
            
            contenido = `
                <div class="mb-3">
                    <label for="edit-nombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="edit-nombre" value="${datos.nombre}">
                </div>
                <div class="mb-3">
                    <label for="edit-email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="edit-email" value="${datos.email}">
                </div>
                <div class="mb-3">
                    <label for="edit-carrera" class="form-label">Carrera</label>
                    <select class="form-select" id="edit-carrera">
                        ${opcionesCarreras}
                    </select>
                </div>
                <div class="mb-3">
                    <label for="edit-semestre" class="form-label">Semestre</label>
                    <input type="number" class="form-control" id="edit-semestre" min="1" max="12" value="${datos.semestre}">
                </div>
                <div class="mb-3">
                    <label for="edit-estado" class="form-label">Estado</label>
                    <select class="form-select" id="edit-estado">
                        <option value="Activo" ${datos.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                        <option value="Inactivo" ${datos.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                    </select>
                </div>
            `;
            break;
            
        case 'profesor':
            const especialidades = ['Matemáticas', 'Ciencias', 'Literatura', 'Historia', 'Inglés', 'Programación', 'Bases de Datos'];
            const opcionesEspecialidades = especialidades.map(e => 
                `<option value="${e}" ${datos.especialidad === e ? 'selected' : ''}>${e}</option>`
            ).join('');
            
            contenido = `
                <div class="mb-3">
                    <label for="edit-nombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="edit-nombre" value="${datos.nombre}">
                </div>
                <div class="mb-3">
                    <label for="edit-email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="edit-email" value="${datos.email}">
                </div>
                <div class="mb-3">
                    <label for="edit-especialidad" class="form-label">Especialidad</label>
                    <select class="form-select" id="edit-especialidad">
                        ${opcionesEspecialidades}
                    </select>
                </div>
                <div class="mb-3">
                    <label for="edit-fecha" class="form-label">Fecha de Contratación</label>
                    <input type="date" class="form-control" id="edit-fecha" value="${datos.fechaContratacion}">
                </div>
                <div class="mb-3">
                    <label for="edit-estado" class="form-label">Estado</label>
                    <select class="form-select" id="edit-estado">
                        <option value="Activo" ${datos.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                        <option value="Inactivo" ${datos.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                    </select>
                </div>
            `;
            break;
            
        case 'curso':
            const profesores = adminData.profesores.map(p => 
                `<option value="${p.id}" ${datos.profesorId == p.id ? 'selected' : ''}>${p.nombre}</option>`
            ).join('');
            
            contenido = `
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="edit-codigo" class="form-label">Código</label>
                            <input type="text" class="form-control" id="edit-codigo" value="${datos.codigo}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="edit-nombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="edit-nombre" value="${datos.nombre}">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="edit-profesor" class="form-label">Profesor</label>
                            <select class="form-select" id="edit-profesor">
                                ${profesores}
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="edit-cupo" class="form-label">Cupo</label>
                            <input type="number" class="form-control" id="edit-cupo" min="1" value="${datos.cupo}">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="edit-horario" class="form-label">Horario</label>
                            <input type="text" class="form-control" id="edit-horario" value="${datos.horario}" placeholder="Ej: 8:00 - 10:00">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="edit-dias" class="form-label">Días</label>
                            <select class="form-select" id="edit-dias">
                                <option value="Lun-Mié-Vie" ${datos.dias === 'Lun-Mié-Vie' ? 'selected' : ''}>Lunes, Miércoles, Viernes</option>
                                <option value="Mar-Jue" ${datos.dias === 'Mar-Jue' ? 'selected' : ''}>Martes, Jueves</option>
                                <option value="Lun-Jue" ${datos.dias === 'Lun-Jue' ? 'selected' : ''}>Lunes, Jueves</option>
                                <option value="Mar-Vie" ${datos.dias === 'Mar-Vie' ? 'selected' : ''}>Martes, Viernes</option>
                                <option value="Mié-Vie" ${datos.dias === 'Mié-Vie' ? 'selected' : ''}>Miércoles, Viernes</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="edit-estado" class="form-label">Estado</label>
                    <select class="form-select" id="edit-estado">
                        <option value="Activo" ${datos.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                        <option value="En espera" ${datos.estado === 'En espera' ? 'selected' : ''}>En espera</option>
                        <option value="Completo" ${datos.estado === 'Completo' ? 'selected' : ''}>Completo</option>
                        <option value="Cancelado" ${datos.estado === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </div>
            `;
            break;
    }
    
    // Crear el modal
    const modalHTML = `
        <div class="modal fade" id="modal-editar" tabindex="-1" aria-labelledby="modalEditarLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalEditarLabel">${titulo}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <form id="form-editar">
                            ${contenido}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" form="form-editar" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Agregar el modal al body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Inicializar el modal
    const modal = new bootstrap.Modal(document.getElementById('modal-editar'));
    
    // Configurar el evento de envío del formulario
    const form = document.getElementById('form-editar');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarCambios(id, tipo);
            modal.hide();
        });
    }
    
    // Eliminar el modal del DOM cuando se oculte
    document.getElementById('modal-editar').addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(this);
    });
    
    // Mostrar el modal
    modal.show();
}

// Guardar cambios en un elemento
function guardarCambios(id, tipo) {
    // Aquí iría la lógica para guardar los cambios en el servidor
    // Por ahora, solo mostramos un mensaje
    mostrarAlerta(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} actualizado correctamente`, 'success');
    
    // Recargar la tabla correspondiente
    switch(tipo) {
        case 'usuario':
            cargarUsuarios();
            break;
        case 'estudiante':
            cargarEstudiantes();
            break;
        case 'profesor':
            cargarProfesores();
            break;
        case 'curso':
            cargarCursos();
            break;
    }
}
