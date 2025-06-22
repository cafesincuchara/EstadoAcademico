/**
 * Funcionalidades de calendario y asistencia para el panel del estudiante
 * @module calendarioAsistencia
 */

// Constantes para tipos de eventos y colores
const TIPOS_EVENTO = {
    CLASE: 'clase',
    EXAMEN: 'examen',
    LABORATORIO: 'laboratorio',
    TAREA: 'tarea'
};

const COLORES_EVENTO = {
    [TIPOS_EVENTO.CLASE]: '#4e73df',
    [TIPOS_EVENTO.EXAMEN]: '#e74a3b',
    [TIPOS_EVENTO.LABORATORIO]: '#1cc88a',
    [TIPOS_EVENTO.TAREA]: '#f6c23e',
    default: '#6c757d'
};

// Datos de ejemplo para el calendario y asistencia
const asistenciaData = Object.freeze({
    calendario: Object.freeze([
        Object.freeze({
            id: 1,
            titulo: 'Clase de Programación',
            fecha: '2025-06-21',
            horaInicio: '08:00',
            horaFin: '10:00',
            tipo: TIPOS_EVENTO.CLASE,
            curso: 'Programación Avanzada'
        }),
        Object.freeze({
            id: 2,
            titulo: 'Examen de Bases de Datos',
            fecha: '2025-06-22',
            horaInicio: '10:00',
            horaFin: '12:00',
            tipo: TIPOS_EVENTO.EXAMEN,
            curso: 'Bases de Datos'
        }),
        Object.freeze({
            id: 3,
            titulo: 'Laboratorio de Redes',
            fecha: '2025-06-23',
            horaInicio: '14:00',
            horaFin: '16:00',
            tipo: TIPOS_EVENTO.LABORATORIO,
            curso: 'Redes de Computadoras'
        })
    ]),
    registros: Object.freeze([
        Object.freeze({
            id: 1,
            fecha: '2025-06-20',
            curso: 'Programación Avanzada',
            hora: '08:00 - 10:00',
            estado: 'Asistió',
            justificacion: ''
        }),
        Object.freeze({
            id: 2,
            fecha: '2025-06-18',
            curso: 'Bases de Datos',
            hora: '10:00 - 12:00',
            estado: 'Tardanza',
            justificacion: 'Tráfico'
        }),
        Object.freeze({
            id: 3,
            fecha: '2025-06-15',
            curso: 'Redes de Computadoras',
            hora: '14:00 - 16:00',
            estado: 'Falta',
            justificacion: 'Enfermedad'
        })
    ]),
    estadisticas: Object.freeze({
        totalClases: 20,
        asistencias: 17,
        tardanzas: 2,
        faltas: 1
    })
});

/**
 * Obtiene el color correspondiente a un tipo de evento
 * @param {string} tipo - Tipo de evento
 * @returns {string} Código de color hexadecimal
 */
function getColorEvento(tipo) {
    return COLORES_EVENTO[tipo] || COLORES_EVENTO.default;
}

/**
 * Inicializa el módulo cuando el DOM está completamente cargado
 * @listens DOMContentLoaded
 */
function inicializarModulo() {
    try {
        if (typeof FullCalendar === 'undefined') {
            throw new Error('FullCalendar no está cargado correctamente');
        }
        
        inicializarCalendario();
        cargarAsistencia();
        configurarEventosCalendarioAsistencia();
    } catch (error) {
        console.error('Error al inicializar el módulo de calendario y asistencia:', error);
        mostrarErrorAlUsuario('No se pudo cargar el calendario. Por favor, recarga la página.');
    }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarModulo);

/**
 * Inicializa el calendario con FullCalendar
 * @returns {boolean} true si se inicializó correctamente, false en caso contrario
 */
function inicializarCalendario() {
    try {
        const calendarEl = document.getElementById('calendarioEstudio');
        if (!calendarEl) {
            console.warn('Elemento del calendario no encontrado');
            return false;
        }

        const configuracion = {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: mapearEventosParaCalendario(asistenciaData.calendario),
            eventClick: manejarClicEnEvento,
            dateClick: manejarClicEnFecha
        };

        const calendar = new FullCalendar.Calendar(calendarEl, configuracion);
        calendar.render();
        window.calendarioEstudio = calendar;
        
        return true;
    } catch (error) {
        console.error('Error al inicializar el calendario:', error);
        return false;
    }
}

/**
 * Mapea los eventos al formato esperado por FullCalendar
 * @param {Array} eventos - Lista de eventos a mapear
 * @returns {Array} Eventos formateados para FullCalendar
 */
function mapearEventosParaCalendario(eventos) {
    return eventos.map(evento => ({
        title: evento.titulo,
        start: `${evento.fecha}T${evento.horaInicio}`,
        end: `${evento.fecha}T${evento.horaFin}`,
        backgroundColor: getColorEvento(evento.tipo),
        borderColor: getColorEvento(evento.tipo),
        extendedProps: {
            descripcion: evento.descripcion || '',
            curso: evento.curso || '',
            tipo: evento.tipo
        }
    }));
}

/**
 * Maneja el clic en un evento del calendario
 * @param {Object} info - Información del evento de clic
 */
function manejarClicEnEvento(info) {
    try {
        verDetalleEvento(info.event.extendedProps);
    } catch (error) {
        console.error('Error al manejar clic en evento:', error);
    }
}

/**
 * Maneja el clic en una fecha del calendario
 * @param {Object} info - Información de la fecha clickeada
 */
function manejarClicEnFecha(info) {
    console.log('Fecha clickeada:', info.dateStr);
    // Aquí podrías implementar la lógica para agregar un nuevo evento
}

/**
 * Carga y muestra los registros de asistencia
 * @returns {boolean} true si se cargaron los registros correctamente, false en caso contrario
 */
function cargarAsistencia() {
    try {
        const tbody = document.getElementById('cuerpoTablaAsistencia');
        const totalRegistros = document.getElementById('totalRegistros');
        const registrosMostrados = document.getElementById('registrosMostrados');
        
        if (!tbody || !totalRegistros || !registrosMostrados) {
            console.warn('Elementos de la tabla de asistencia no encontrados');
            return false;
        }
    
        // Limpiar el contenido actual
        tbody.innerHTML = '';
        
        // Procesar y mostrar los registros
        asistenciaData.registros.forEach(registro => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${formatearFecha(registro.fecha)}</td>
                <td>${registro.curso}</td>
                <td>${registro.hora}</td>
                <td><span class="badge bg-${getClaseEstado(registro.estado)}">${registro.estado}</span></td>
                <td>${registro.justificacion || '-'}</td>
            `;
            tbody.appendChild(fila);
        });
        
        // Actualizar contadores
        totalRegistros.textContent = asistenciaData.registros.length;
        registrosMostrados.textContent = asistenciaData.registros.length;
        
        // Inicializar DataTable si está disponible
        if ($.fn.DataTable) {
            $('#tablaAsistencia').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
                },
                responsive: true,
                order: [[0, 'desc']]
            });
        }
        
        // Actualizar estadísticas
        actualizarEstadisticasAsistencia();
        
        return true;
    } catch (error) {
        console.error('Error al cargar la asistencia:', error);
        mostrarErrorAlUsuario('No se pudieron cargar los registros de asistencia');
        return false;
    }
    
    if (asistenciaData.registros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="far fa-calendar-check fa-2x mb-2 text-muted"></i>
                    <p class="mb-0">No hay registros de asistencia para mostrar</p>
                </td>
            </tr>`;
        return;
    }
    
    // Generar filas de la tabla
    asistenciaData.registros.forEach(registro => {
        const fila = document.createElement('tr');
        const estadoClass = {
            'Asistió': 'text-success',
            'Tardanza': 'text-warning',
            'Falta': 'text-danger'
        }[registro.estado] || '';
        
        fila.innerHTML = `
            <td>${formatearFecha(registro.fecha)}</td>
            <td>${registro.curso}</td>
            <td>${registro.hora}</td>
            <td><span class="fw-bold ${estadoClass}">${registro.estado}</span></td>
            <td>${registro.justificacion || '-'}</td>
        `;
        
        tbody.appendChild(fila);
    });
    
    // Actualizar contadores
    if (totalRegistros) totalRegistros.textContent = asistenciaData.registros.length;
    if (registrosMostrados) registrosMostrados.textContent = asistenciaData.registros.length;
    
    // Actualizar estadísticas
    actualizarEstadisticasAsistencia();
}

// Actualizar las estadísticas de asistencia
function actualizarEstadisticasAsistencia() {
    const { totalClases, asistencias, tardanzas, faltas } = asistenciaData.estadisticas;
    const porcentajeAsistencia = Math.round((asistencias / totalClases) * 100);
    const porcentajeTardanzas = Math.round((tardanzas / totalClases) * 100);
    const porcentajeFaltas = Math.round((faltas / totalClases) * 100);
    
    // Actualizar tarjetas de estadísticas
    const tarjetaAsistencia = document.querySelector('#asistencia .card.border-start-success h2');
    const tarjetaTardanzas = document.querySelector('#asistencia .card.border-start-warning h2');
    const tarjetaFaltas = document.querySelector('#asistencia .card.border-start-danger h2');
    
    if (tarjetaAsistencia) tarjetaAsistencia.textContent = `${porcentajeAsistencia}%`;
    if (tarjetaTardanzas) tarjetaTardanzas.textContent = `${porcentajeTardanzas}%`;
    if (tarjetaFaltas) tarjetaFaltas.textContent = `${porcentajeFaltas}%`;
}

// Configurar eventos para el calendario y asistencia
function configurarEventosCalendarioAsistencia() {
    // Evento para el botón de agregar evento
    const btnAgregarEvento = document.getElementById('btnAgregarEvento');
    if (btnAgregarEvento) {
        btnAgregarEvento.addEventListener('click', function() {
            // Implementar lógica para agregar un nuevo evento
            mostrarNotificacion('Función de agregar evento no implementada aún', 'info');
        });
    }
    
    // Inicializar DataTable para la tabla de asistencia
    if ($.fn.DataTable.isDataTable('#tablaAsistencia')) {
        $('#tablaAsistencia').DataTable().destroy();
    }
    
    $('#tablaAsistencia').DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        },
        order: [[0, 'desc']], // Ordenar por fecha descendente
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        responsive: true
    });
}

// Función para ver el detalle de un evento del calendario
function verDetalleEvento(evento) {
    // Crear el contenido del modal
    const modalContent = `
        <div class="modal fade" id="modalDetalleEvento" tabindex="-1" aria-labelledby="modalDetalleEventoLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalDetalleEventoLabel">${evento.title || 'Detalle del Evento'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Curso:</strong> ${evento.curso || 'No especificado'}</p>
                        <p><strong>Fecha:</strong> ${formatearFecha(evento.start?.split('T')[0] || '')}</p>
                        <p><strong>Hora:</strong> ${evento.start?.split('T')[1]?.substring(0, 5) || ''} - ${evento.end?.split('T')[1]?.substring(0, 5) || ''}</p>
                        ${evento.descripcion ? `<p><strong>Descripción:</strong> ${evento.descripcion}</p>` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>`;
    
    // Agregar el modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalDetalleEvento'));
    modal.show();
    
    // Eliminar el modal del DOM cuando se cierre
    document.getElementById('modalDetalleEvento').addEventListener('hidden.bs.modal', function () {
        document.getElementById('modalDetalleEvento').remove();
    });
}

/**
 * Obtiene la clase CSS para el estado de asistencia
 * @param {string} estado - Estado de la asistencia
 * @returns {string} Clase CSS correspondiente
 */
function getClaseEstado(estado) {
    const clases = {
        'Asistió': 'success',
        'Tardanza': 'warning',
        'Falta': 'danger'
    };
    return clases[estado] || 'secondary';
}

/**
 * Formatea una fecha en un formato legible
 * @param {string} fechaStr - Fecha en formato string
 * @returns {string} Fecha formateada
 */
function formatearFecha(fechaStr) {
    if (!fechaStr) return '';
    try {
        const fecha = new Date(fechaStr);
        if (isNaN(fecha.getTime())) return fechaStr;
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return fecha.toLocaleDateString('es-ES', opciones);
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return fechaStr;
    }
}

/**
 * Muestra un mensaje de error al usuario
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarErrorAlUsuario(mensaje) {
    // Implementar lógica para mostrar el error en la interfaz
    console.error('Error para el usuario:', mensaje);
    // Ejemplo con toastr si está disponible:
    // if (typeof toastr !== 'undefined') {
    //     toastr.error(mensaje);
    // }
}

// Hacer las funciones accesibles globalmente
window.verDetalleEvento = verDetalleEvento;

// Exportar para pruebas unitarias (si es necesario)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        getColorEvento,
        mapearEventosParaCalendario,
        TIPOS_EVENTO,
        COLORES_EVENTO
    };
}
