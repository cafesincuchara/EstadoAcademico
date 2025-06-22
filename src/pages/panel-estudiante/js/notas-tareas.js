/**
 * Funcionalidades de notas y tareas para el panel del estudiante
 */

// Datos de ejemplo para notas y tareas
const notasTareasData = {
    notas: [
        { id: 1, titulo: 'Resumen de Programación', contenido: 'Conceptos clave de programación orientada a objetos...', fecha: '2025-06-20', curso: 'Programación Avanzada', etiquetas: ['programación', 'resumen'] },
        { id: 2, titulo: 'Fórmulas SQL', contenido: 'SELECT, INSERT, UPDATE, DELETE, JOIN...', fecha: '2025-06-18', curso: 'Bases de Datos', etiquetas: ['sql', 'consultas'] },
    ],
    tareas: [
        { id: 1, descripcion: 'Entregar proyecto de programación', fechaEntrega: '2025-06-25', curso: 'Programación Avanzada', prioridad: 'alta', completada: false },
        { id: 2, descripcion: 'Estudiar para examen de redes', fechaEntrega: '2025-06-28', curso: 'Redes de Computadoras', prioridad: 'media', completada: false },
        { id: 3, descripcion: 'Hacer ejercicios de SQL', fechaEntrega: '2025-06-22', curso: 'Bases de Datos', prioridad: 'baja', completada: true },
    ],
    recordatorios: [
        { id: 1, titulo: 'Reunión con asesor', fecha: '2025-06-23', hora: '16:00', descripcion: 'Hablar sobre proyecto de titulación' },
        { id: 2, titulo: 'Pagar colegiatura', fecha: '2025-06-30', hora: '23:59', descripcion: 'Último día para pago sin recargo' },
    ],
    calendario: [
        { id: 1, titulo: 'Estudio de redes', fecha: '2025-06-21', horaInicio: '16:00', horaFin: '18:00', tipo: 'estudio', curso: 'Redes de Computadoras' },
        { id: 2, titulo: 'Práctica de laboratorio', fecha: '2025-06-22', horaInicio: '10:00', horaFin: '13:00', tipo: 'laboratorio', curso: 'Programación Avanzada' },
    ]
};

// Inicialización cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la sección de notas o tareas
    if (document.getElementById('notasTabs') || document.getElementById('tareasSection')) {
        inicializarNotasTareas();
    }
});

// Inicializar el sistema de notas y tareas
function inicializarNotasTareas() {
    cargarNotas();
    cargarTareas();
    cargarRecordatorios();
    cargarCalendario();
    configurarEventosNotasTareas();
    
    // Inicializar el editor de notas
    if (document.getElementById('editorNota')) {
        inicializarEditorNotas();
    }
}

// Cargar y mostrar las notas
function cargarNotas(filtro = '', cursoFiltro = '') {
    const contenedorNotas = document.getElementById('listaNotas');
    if (!contenedorNotas) return;
    
    // Filtrar notas según el término de búsqueda y el curso seleccionado
    let notasFiltradas = notasTareasData.notas;
    
    if (filtro) {
        const busqueda = filtro.toLowerCase();
        notasFiltradas = notasFiltradas.filter(nota => 
            nota.titulo.toLowerCase().includes(busqueda) || 
            nota.contenido.toLowerCase().includes(busqueda) ||
            nota.etiquetas.some(etiqueta => etiqueta.toLowerCase().includes(busqueda))
        );
    }
    
    if (cursoFiltro) {
        notasFiltradas = notasFiltradas.filter(nota => nota.curso === cursoFiltro);
    }
    
    // Mostrar mensaje si no hay notas
    if (notasFiltradas.length === 0) {
        contenedorNotas.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="text-muted">
                    <i class="fas fa-sticky-note fa-3x mb-3"></i>
                    <p>No se encontraron notas que coincidan con tu búsqueda.</p>
                </div>
            </div>`;
        return;
    }
    
    // Generar el HTML de las notas
    let notasHTML = '';
    notasFiltradas.forEach(nota => {
        const fecha = new Date(nota.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const etiquetasHTML = nota.etiquetas.map(etiqueta => 
            `<span class="badge bg-secondary me-1 mb-1">${etiqueta}</span>`
        ).join('');
        
        notasHTML += `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">${nota.titulo}</h5>
                    <span class="badge bg-primary">${nota.curso}</span>
                </div>
                <div class="card-body">
                    <p class="card-text">${nota.contenido.length > 150 ? 
                        nota.contenido.substring(0, 150) + '...' : nota.contenido}</p>
                    <div class="mb-2">${etiquetasHTML}</div>
                    <small class="text-muted">${fecha}</small>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarNota(${nota.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarNota(${nota.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>`;
    });
    
    contenedorNotas.innerHTML = notasHTML;
    // Aplicar filtro si existe
    if (filtro) {
        const busqueda = filtro.toLowerCase();
        notasFiltradas = notasFiltradas.filter(nota => 
            nota.titulo.toLowerCase().includes(busqueda) || 
            nota.contenido.toLowerCase().includes(busqueda) ||
            nota.etiquetas.some(etiqueta => etiqueta.toLowerCase().includes(busquisa))
        );
    }
    
    // Generar HTML de las notas
    if (notasFiltradas.length === 0) {
        contenedorNotas.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-sticky-note fa-3x mb-3 text-muted"></i>
                <p class="text-muted">No se encontraron notas.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    notasFiltradas.forEach(nota => {
        const etiquetas = nota.etiquetas.map(etiqueta => 
            `<span class="badge bg-light text-dark me-1 mb-1">${etiqueta}</span>`
        ).join('');
        
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card card-nota h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${nota.titulo}</h6>
                        <small class="text-muted">${formatearFecha(nota.fecha)}</small>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${nota.contenido.substring(0, 100)}${nota.contenido.length > 100 ? '...' : ''}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">${nota.curso}</small>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-primary" onclick="editarNota(${nota.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="eliminarNota(${nota.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mt-2">${etiquetas}</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    contenedorNotas.innerHTML = html;
}

// Cargar y mostrar las tareas
function cargarTareas() {
    const listaTareas = document.getElementById('listaTareas');
    if (!listaTareas) return;
    
    // Ordenar tareas por fecha de entrega (las más cercanas primero)
    const tareasOrdenadas = [...notasTareasData.tareas].sort((a, b) => 
        new Date(a.fechaEntrega) - new Date(b.fechaEntrega)
    );
    
    if (tareasOrdenadas.length === 0) {
        listaTareas.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-tasks fa-3x mb-3 text-muted"></i>
                <p class="text-muted">No hay tareas pendientes.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    tareasOrdenadas.forEach(tarea => {
        const fecha = new Date(tarea.fechaEntrega);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        // Calcular días restantes
        const diffTime = fecha - hoy;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let claseFecha = '';
        if (diffDays < 0) {
            claseFecha = 'text-danger';
        } else if (diffDays === 0) {
            claseFecha = 'text-warning';
        } else if (diffDays <= 3) {
            claseFecha = 'text-primary';
        }
        
        const textoFecha = diffDays < 0 ? 
            `Vencida hace ${Math.abs(diffDays)} días` :
            diffDays === 0 ? 'Hoy' :
            `En ${diffDays} días`;
            
        const prioridadIcono = tarea.prioridad === 'alta' ? 'exclamation-triangle' : 
                              tarea.prioridad === 'media' ? 'exclamation-circle' : 'info-circle';
        const prioridadColor = tarea.prioridad === 'alta' ? 'danger' : 
                             tarea.prioridad === 'media' ? 'warning' : 'info';
        
        html += `
            <div class="tarea-item ${tarea.completada ? 'completada' : ''}">
                <input type="checkbox" class="tarea-checkbox form-check-input me-3" 
                       ${tarea.completada ? 'checked' : ''} 
                       onchange="marcarTareaCompletada(${tarea.id}, this.checked)">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${tarea.descripcion}</h6>
                        <div>
                            <span class="badge bg-${prioridadColor} me-2">
                                <i class="fas fa-${prioridadIcono} me-1"></i>
                                ${tarea.prioridad}
                            </span>
                            <small class="${claseFecha}">${textoFecha}</small>
                        </div>
                    </div>
                    <div class="text-muted small mt-1">${tarea.curso}</div>
                </div>
            </div>
        `;
    });
    
    listaTareas.innerHTML = html;
}

// Cargar y mostrar los recordatorios
function cargarRecordatorios() {
    const contenedorRecordatorios = document.getElementById('listaRecordatorios');
    if (!contenedorRecordatorios) return;
    
    // Ordenar recordatorios por fecha y hora
    const recordatoriosOrdenados = [...notasTareasData.recordatorios].sort((a, b) => {
        const fechaA = new Date(`${a.fecha} ${a.hora}`);
        const fechaB = new Date(`${b.fecha} ${b.hora}`);
        return fechaA - fechaB;
    });
    
    if (recordatoriosOrdenados.length === 0) {
        contenedorRecordatorios.innerHTML = `
            <div class="col-12 text-center py-3">
                <i class="far fa-bell-slash fa-2x mb-2 text-muted"></i>
                <p class="text-muted mb-0">No hay recordatorios programados.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    recordatoriosOrdenados.forEach(recordatorio => {
        html += `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h6 class="card-title mb-1">${recordatorio.titulo}</h6>
                        <div>
                            <button class="btn btn-sm btn-outline-secondary me-1" onclick="editarRecordatorio(${recordatorio.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarRecordatorio(${recordatorio.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <p class="card-text text-muted small mb-1">
                        <i class="far fa-calendar-alt me-1"></i>
                        ${formatearFecha(recordatorio.fecha)} a las ${recordatorio.hora}
                    </p>
                    <p class="card-text">${recordatorio.descripcion}</p>
                </div>
            </div>
        `;
    });
    
    contenedorRecordatorios.innerHTML = html;
}

// Cargar y mostrar el calendario de estudio
function cargarCalendario() {
    const contenedorCalendario = document.getElementById('calendarioEstudio');
    if (!contenedorCalendario) return;
    
    // Obtener la semana actual
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1); // Lunes de esta semana
    
    // Generar días de la semana
    let diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    let fechasSemana = [];
    let diasHTML = '';
    
    for (let i = 0; i < 7; i++) {
        const fecha = new Date(inicioSemana);
        fecha.setDate(inicioSemana.getDate() + i);
        fechasSemana.push(fecha);
        
        const esHoy = fecha.toDateString() === hoy.toDateString();
        const claseDia = esHoy ? 'bg-primary text-white' : '';
        
        diasHTML += `
            <div class="col p-2 text-center">
                <div class="p-2 rounded ${claseDia}">
                    <div class="fw-bold">${diasSemana[i]}</div>
                    <div>${fecha.getDate()}</div>
                </div>
            </div>
        `;
    }
    
    // Generar eventos para cada día
    let eventosHTML = '';
    
    fechasSemana.forEach((fecha, index) => {
        const eventosDia = notasTareasData.calendario.filter(evento => {
            const fechaEvento = new Date(evento.fecha);
            return fechaEvento.toDateString() === fecha.toDateString();
        });
        
        eventosHTML += `
            <div class="col p-2 border-bottom border-end" style="min-height: 120px;">
                ${eventosDia.map(evento => `
                    <div class="small p-1 mb-1 rounded" 
                         style="background-color: ${getColorEvento(evento.tipo)}; cursor: pointer;"
                         onclick="verDetalleEvento(${evento.id})">
                        <div class="fw-bold">${evento.titulo}</div>
                        <div>${evento.horaInicio} - ${evento.horaFin}</div>
                    </div>
                `).join('')}
            </div>
        `;
    });
    
    contenedorCalendario.innerHTML = `
        <div class="calendario-estudio">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">Mi Semana de Estudio</h5>
                <div>
                    <button class="btn btn-sm btn-outline-primary" onclick="agregarEvento()">
                        <i class="fas fa-plus me-1"></i> Agregar
                    </button>
                </div>
            </div>
            <div class="row g-0 text-center border-bottom">
                ${diasHTML}
            </div>
            <div class="row g-0">
                ${eventosHTML}
            </div>
        </div>
    `;
}

// Inicializar el editor de notas
function inicializarEditorNotas() {
    // Aquí se podría integrar un editor de texto enriquecido como Quill o TinyMCE
    // Por ahora, usaremos un textarea simple
    const editor = document.getElementById('editorNota');
    if (editor) {
        // Configuración básica del editor
        editor.placeholder = 'Escribe tu nota aquí...';
    }
}

// Configurar eventos para notas y tareas
function configurarEventosNotasTareas() {
    // Evento para guardar nota
    const btnGuardarNota = document.getElementById('btnGuardarNota');
    if (btnGuardarNota) {
        btnGuardarNota.addEventListener('click', guardarNota);
    }
    
    // Evento para buscar notas
    const btnBuscarNota = document.getElementById('btnBuscarNota');
    const inputBuscarNota = document.getElementById('buscarNota');
    const filtroCurso = document.getElementById('filtroCurso');
    const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');
    
    if (btnBuscarNota && inputBuscarNota) {
        btnBuscarNota.addEventListener('click', () => {
            cargarNotas(inputBuscarNota.value, filtroCurso.value);
        });
        
        inputBuscarNota.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                cargarNotas(inputBuscarNota.value, filtroCurso.value);
            }
        });
    }
    
    if (filtroCurso) {
        filtroCurso.addEventListener('change', () => {
            cargarNotas(inputBuscarNota ? inputBuscarNota.value : '', filtroCurso.value);
        });
    }
    
    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', () => {
            if (inputBuscarNota) inputBuscarNota.value = '';
            if (filtroCurso) filtroCurso.value = '';
            cargarNotas();
        });
    }
    // Búsqueda de notas
    const buscadorNotas = document.getElementById('buscadorNotas');
    if (buscadorNotas) {
        buscadorNotas.addEventListener('input', (e) => {
            cargarNotas(e.target.value);
        });
    }
    
    // Botón para nueva nota
    const btnNuevaNota = document.getElementById('btnNuevaNota');
    if (btnNuevaNota) {
        btnNuevaNota.addEventListener('click', () => {
            // Mostrar modal para nueva nota
            mostrarModalNota();
        });
    }
    
    // Botón para nueva tarea
    const btnNuevaTarea = document.getElementById('btnNuevaTarea');
    if (btnNuevaTarea) {
        btnNuevaTarea.addEventListener('click', () => {
            // Mostrar modal para nueva tarea
            mostrarModalTarea();
        });
    }
    
    // Botón para nuevo recordatorio
    const btnNuevoRecordatorio = document.getElementById('btnNuevoRecordatorio');
    if (btnNuevoRecordatorio) {
        btnNuevoRecordatorio.addEventListener('click', () => {
            // Mostrar modal para nuevo recordatorio
            mostrarModalRecordatorio();
        });
    }
}

// Funciones para mostrar modales
function mostrarModalNota(notaId = null) {
    const modal = new bootstrap.Modal(document.getElementById('modalNota'));
    const form = document.getElementById('formNota');
    const tituloModal = document.querySelector('#modalNota .modal-title');
    
    // Limpiar el formulario
    form.reset();
    
    if (notaId) {
        // Modo edición
        const nota = notasTareasData.notas.find(n => n.id === notaId);
        if (nota) {
            tituloModal.textContent = 'Editar Nota';
            document.getElementById('notaId').value = nota.id;
            document.getElementById('notaTitulo').value = nota.titulo;
            document.getElementById('notaContenido').value = nota.contenido;
            document.getElementById('notaCurso').value = nota.curso;
            document.getElementById('notaEtiquetas').value = Array.isArray(nota.etiquetas) ? nota.etiquetas.join(', ') : '';
        }
    } else {
        // Modo nueva nota
        tituloModal.textContent = 'Nueva Nota';
        document.getElementById('notaId').value = '';
    }
    
    modal.show();
}

function mostrarModalTarea(tareaId = null) {
    // Implementar lógica para mostrar modal de edición/creación de tarea
    console.log('Mostrar modal de tarea', tareaId);
}

function mostrarModalRecordatorio(recordatorioId = null) {
    // Implementar lógica para mostrar modal de edición/creación de recordatorio
    console.log('Mostrar modal de recordatorio', recordatorioId);
}

// Funciones para marcar tareas como completadas
function marcarTareaCompletada(tareaId, completada) {
    const tarea = notasTareasData.tareas.find(t => t.id === tareaId);
    if (tarea) {
        tarea.completada = completada;
        // Aquí se podría guardar el cambio en el servidor
        mostrarNotificacion(`Tarea "${tarea.descripcion}" ${completada ? 'marcada como completada' : 'pendiente'}`, completada ? 'success' : 'warning');
    }
}

// Funciones para editar y eliminar
function editarNota(notaId) {
    mostrarModalNota(notaId);
}

function eliminarNota(notaId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta nota? Esta acción no se puede deshacer.')) {
        const index = notasTareasData.notas.findIndex(n => n.id === notaId);
        if (index !== -1) {
            notasTareasData.notas.splice(index, 1);
            cargarNotas();
            mostrarNotificacion('Nota eliminada correctamente', 'success');
        }
    }
}

// Función para guardar una nota (nueva o existente)
function guardarNota() {
    const form = document.getElementById('formNota');
    const notaId = document.getElementById('notaId').value;
    const titulo = document.getElementById('notaTitulo').value.trim();
    const curso = document.getElementById('notaCurso').value;
    const contenido = document.getElementById('notaContenido').value.trim();
    const etiquetas = document.getElementById('notaEtiquetas').value
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0);
    
    // Validaciones básicas
    if (!titulo || !curso || !contenido) {
        mostrarNotificacion('Por favor completa todos los campos requeridos', 'error');
        return;
    }
    
    const notaData = {
        id: notaId ? parseInt(notaId) : Date.now(),
        titulo,
        curso,
        contenido,
        etiquetas,
        fecha: new Date().toISOString()
    };
    
    if (notaId) {
        // Actualizar nota existente
        const index = notasTareasData.notas.findIndex(n => n.id === parseInt(notaId));
        if (index !== -1) {
            // Mantener la fecha original de creación
            notaData.fecha = notasTareasData.notas[index].fecha;
            notasTareasData.notas[index] = notaData;
            mostrarNotificacion('Nota actualizada correctamente', 'success');
        }
    } else {
        // Agregar nueva nota
        notasTareasData.notas.unshift(notaData);
        mostrarNotificacion('Nota creada correctamente', 'success');
    }
    
    // Cerrar el modal y actualizar la lista
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalNota'));
    if (modal) modal.hide();
    cargarNotas();
}

function editarRecordatorio(recordatorioId) {
    mostrarModalRecordatorio(recordatorioId);
}

function eliminarRecordatorio(recordatorioId) {
    if (confirm('¿Estás seguro de que deseas eliminar este recordatorio?')) {
        const indice = notasTareasData.recordatorios.findIndex(r => r.id === recordatorioId);
        if (indice !== -1) {
            const recordatorioEliminado = notasTareasData.recordatorios.splice(indice, 1)[0];
            cargarRecordatorios();
            mostrarNotificacion('Recordatorio eliminado correctamente', 'success');
        }
    }
}

function verDetalleEvento(eventoId) {
    const evento = notasTareasData.calendario.find(e => e.id === eventoId);
    if (evento) {
        // Mostrar modal con detalles del evento
        alert(`Detalles del evento:\n\n` +
              `Título: ${evento.titulo}\n` +
              `Curso: ${evento.curso}\n` +
              `Fecha: ${formatearFecha(evento.fecha)}\n` +
              `Hora: ${evento.horaInicio} - ${evento.horaFin}\n` +
              `Tipo: ${evento.tipo}`);
    }
}

function agregarEvento() {
    // Implementar lógica para agregar un nuevo evento al calendario
    console.log('Agregar nuevo evento al calendario');
}

// Funciones de utilidad
function formatearFecha(fechaStr) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
}

function getColorEvento(tipo) {
    const colores = {
        'clase': 'rgba(78, 115, 223, 0.2)',
        'estudio': 'rgba(28, 200, 138, 0.2)',
        'laboratorio': 'rgba(231, 74, 59, 0.2)',
        'examen': 'rgba(246, 194, 62, 0.2)',
        'tarea': 'rgba(110, 66, 193, 0.2)'
    };
    return colores[tipo] || 'rgba(108, 117, 125, 0.2)';
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Implementar lógica para mostrar notificaciones
    console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
    // Aquí se podría usar Toastr, SweetAlert2 o similar
    if (window.toastr) {
        toastr[tipo](mensaje);
    } else if (window.Swal) {
        Swal.fire({
            icon: tipo,
            text: mensaje,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        alert(mensaje);
    }
}

// Hacer las funciones accesibles globalmente
window.marcarTareaCompletada = marcarTareaCompletada;
window.editarNota = editarNota;
window.eliminarNota = eliminarNota;
window.editarRecordatorio = editarRecordatorio;
window.eliminarRecordatorio = eliminarRecordatorio;
window.verDetalleEvento = verDetalleEvento;
window.agregarEvento = agregarEvento;
