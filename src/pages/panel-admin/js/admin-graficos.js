/**
 * Funciones para manejar los gráficos del panel de administración
 */

// Inicializar gráficos
function inicializarGraficos() {
    // Gráfico de usuarios por rol
    const ctx1 = document.getElementById('usuariosPorRolChart');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['Administradores', 'Profesores', 'Estudiantes', 'Preceptores'],
                datasets: [{
                    data: [
                        adminData.estadisticas.usuariosPorRol.administradores,
                        adminData.estadisticas.usuariosPorRol.profesores,
                        adminData.estadisticas.usuariosPorRol.estudiantes,
                        adminData.estadisticas.usuariosPorRol.preceptores
                    ],
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
                    hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
                    hoverBorderColor: 'rgba(234, 236, 244, 1)',
                }],
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Usuarios por Rol',
                        font: {
                            size: 16
                        }
                    }
                },
                cutout: '70%',
            },
        });
    }
    
    // Gráfico de actividad reciente
    const ctx2 = document.getElementById('actividadRecienteChart');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Nuevos Usuarios',
                    backgroundColor: '#4e73df',
                    hoverBackgroundColor: '#2e59d9',
                    borderColor: '#4e73df',
                    data: [65, 59, 80, 81, 56, 55],
                    maxBarThickness: 25,
                }],
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 6
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgb(234, 236, 244)',
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineColor: 'rgb(234, 236, 244)',
                            zeroLineBorderDash: [2]
                        },
                        ticks: {
                            padding: 10,
                            callback: function(value) {
                                return value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Actividad Reciente',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de rendimiento académico
    const ctx3 = document.getElementById('rendimientoAcademicoChart');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Promedio General',
                    data: [75, 78, 82, 80, 85, 88],
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Rendimiento Académico',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de asistencia
    const ctx4 = document.getElementById('asistenciaChart');
    if (ctx4) {
        new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Asistencia',
                    data: [92, 88, 95, 90, 93, 97],
                    backgroundColor: 'rgba(28, 200, 138, 0.8)',
                    borderColor: 'rgba(28, 200, 138, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Porcentaje de Asistencia',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}
