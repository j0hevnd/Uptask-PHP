(() => {
    eventListeners();

    var listaProyectos = document.querySelector('#proyectos');

    function eventListeners() {
        document.addEventListener('DOMContentLoaded', function() {
            actualizarProgreso();
        });
        // Botón para crear nuevo proyecto
        document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
        // Boton para nueva tarea
        document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
        // Botones para las acciones de las tareas
        document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
        // Botones para actualizar o eliminar proyectos
        document.querySelector('.acciones-proyecto').addEventListener('click', accionesProyecto);
    }

    function nuevoProyecto(e) {
        e.preventDefault();
        // crea un <input> para el nombre de un nuevo proyecto
        if (!document.querySelector('#nuevo-proyecto')) {
            var nuevoProyecto = document.createElement('li');
            nuevoProyecto.innerHTML = `<input type="text" id="nuevo-proyecto">
                                        <input type="button" id="cancelar" class="btn-cancelar" value="Cancelar">`;
            listaProyectos.appendChild(nuevoProyecto);

            // Seleccionar el ID con el nuevo proyecto
            var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
            inputNuevoProyecto.focus();

            //Al precionar enter crear nuevo proyecto
            inputNuevoProyecto.addEventListener("keypress", function(e) {
                var tecla = e.which || e.keyCode;
                if (tecla === 13) {
                    guardarProyectoDB(inputNuevoProyecto.value);
                    listaProyectos.removeChild(nuevoProyecto);
                }
            });

            // Eliminar caja de texto si no queremos crear un proyecto nuevo

            //Seleccionar botón creado
            document.querySelector('#cancelar').addEventListener('click', function() {
                listaProyectos.removeChild(nuevoProyecto);
            });



        }
    }

    function guardarProyectoDB(nombreProyecto) {
        //Crear llamdo a ajax

        var xhr = new XMLHttpRequest();

        // Enviar datos por formData
        var datos = new FormData();
        datos.append('proyecto', nombreProyecto);
        datos.append('accion', 'crear');

        // abrir la conexión
        xhr.open('POST', 'includes/model/modelo-proyecto.php', true);

        // en la carga
        xhr.onload = function() {
            if (this.status === 200) {
                // obtener Datos de la respuesta
                var respuesta = JSON.parse(xhr.responseText);
                var proyecto = respuesta.nombre_proyecto,
                    id_proyecto = respuesta.id_insertado,
                    tipo = respuesta.tipo,
                    resultado = respuesta.respuesta;

                // Comprovar la inserción
                console.log(respuesta);

                if (resultado === "correcto") {
                    //fue exitoso
                    if (tipo === 'crear') {
                        // Se creo, inyectamos en el HTML
                        var nuevoProyecto = document.createElement('li');
                        nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                        </a>`;
                        listaProyectos.appendChild(nuevoProyecto);

                        //Enviar alerta
                        Swal.fire({
                            icon: 'success',
                            title: 'Proyecto Creado',
                            text: "El proyecto: " + proyecto + " se creó correctamente"
                        }).then(result => {
                            //Redireccionar a la nueva URL
                            if (result.value === true) {
                                window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                            }
                        });

                    } else {
                        // Se actualizo o elimino
                    }
                } else {
                    // hubo un error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: "Hubo un error"
                    })
                }

            }
        }

        // enviar datos
        xhr.send(datos);

    }


    /* ==================TAREAS===================== */


    function agregarTarea(e) {
        e.preventDefault();

        var nombreTarea = document.querySelector('.nombre-tarea').value;

        // validar que el campo tenga algo escrito

        if (nombreTarea === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: "Una tarea no puede ir vacia"
            })
        } else {
            // insertar en PHP

            // Crear llamado a ajax
            var xhr = new XMLHttpRequest();

            // crear FormData
            var datos = new FormData();
            datos.append('tarea', nombreTarea);
            datos.append('accion', 'crear');
            datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

            // abir conexion
            xhr.open('POST', 'includes/model/modelo-tareas.php', true);

            //ejecutarlo y respuesa
            xhr.onload = function() {
                if (this.status === 200) {
                    // todo correcto
                    var respuesta = JSON.parse(xhr.responseText);

                    var id_insertado = respuesta.id_insertado,
                        tarea = respuesta.tarea,
                        tipo = respuesta.tipo,
                        resultado = respuesta.respuesta;


                    if (resultado === "correcto") {
                        // Se agregó correctamente
                        if (tipo === "crear") {
                            Swal.fire({
                                icon: 'success',
                                title: 'Correcto',
                                text: `La tarea: ${tarea}, se creó correctamente`
                            })

                            // Seleccionar parrafo con una lista vacia
                            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                            if (parrafoListaVacia.length > 0) {
                                document.querySelector('.lista-vacia').remove();
                            }

                            // construir template
                            var nuevaTarea = document.createElement('li');

                            // Agregamos el ID 
                            nuevaTarea.id = 'tarea:' + id_insertado;

                            // Agregar la clase tarea
                            nuevaTarea.classList.add('tarea');

                            // Construir el HTML
                            nuevaTarea.innerHTML = `
                                <p>${tarea}</p>
                                <div class="acciones">
                                    <i class="far fa-check-circle"></i>
                                    <i class="fas fa-trash"></i> 
                                </div>
                            `;

                            // agregarlo al html
                            var listadoPendientes = document.querySelector('.listado-pendientes ul');
                            listadoPendientes.appendChild(nuevaTarea);

                            // resetear el formulario
                            document.querySelector('.agregar-tarea').reset();

                            //actualizar barra de estado de tarea
                            actualizarProgreso();
                        }
                    } else {
                        // hubo un error
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: "Hubo un error"
                        })
                    }
                }
            }

            //enviar la consulta
            xhr.send(datos);
        }
    }


    /*================= Cambia el estado de las tareas o las elimina ===============*/
    function accionesTareas(e) {
        e.preventDefault();
        // Actualizar
        if (e.target.classList.contains('fa-check-circle')) {
            if (e.target.classList.contains('completo')) {
                e.target.classList.remove('completo');
                cambiarEstadoTarea(e.target, 0);
            } else {
                e.target.classList.add('completo');
                cambiarEstadoTarea(e.target, 1);
            }
        }

        // Borrar
        if (e.target.classList.contains('fa-trash')) {
            Swal.fire({
                title: 'Seguro(a)?',
                text: "Esta acción no se puede deshacer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {

                    var tareaEliminar = e.target.parentElement.parentElement;

                    // borrar de la BD
                    eliminarTarea(tareaEliminar);

                    // Borrar del html
                    tareaEliminar.remove();

                    Swal.fire(
                        'Eliminado!',
                        'La tarea fue eliminada.',
                        'success'
                    )
                }
            })
        }
    }

    // Completa o descompleta una tarea
    function cambiarEstadoTarea(tarea, estado) {
        var idTarea = tarea.parentElement.parentElement.id.split(':');

        // Crear llamado a ajax
        var xhr = new XMLHttpRequest();

        // Información
        var datos = new FormData();
        datos.append('id_tarea', idTarea[1]);
        datos.append('accion', 'actualizar');
        datos.append('estado', estado);

        // Abrir la conexión
        xhr.open('POST', 'includes/model/modelo-tareas.php', true);

        //Resultado
        xhr.onload = function() {
            if (this.status === 200) {
                JSON.parse(xhr.responseText);
                //actualizar el progreso
                actualizarProgreso();
            }
        }

        // enviar
        xhr.send(datos);
    }

    // Elimina de las tareas de la base de datos
    function eliminarTarea(tarea) {
        var idTarea = tarea.id.split(':');

        // Crear llamado a ajax
        var xhr = new XMLHttpRequest();

        // FormData
        var datos = new FormData();
        datos.append('id_tarea', idTarea[1]);
        datos.append('accion', 'eliminar');

        // Abrir la conexion
        xhr.open('POST', 'includes/model/modelo-tareas.php', true);

        //Resultado
        xhr.onload = function() {
            if (this.status === 200) {
                JSON.parse(xhr.responseText);

                // Comprobar que hayan tares restantes
                var listaTareasRestantes = document.querySelectorAll('li.tarea');
                console.log(listaTareasRestantes);
                if (listaTareasRestantes.length === 0) {
                    document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
                }
                //actualizar el progreso
                actualizarProgreso();
            }
        }

        // Enviar datos
        xhr.send(datos);
    }


    /*================== Actualizar o eliminar un proyecto ================*/
    function accionesProyecto(e) {
        var accion = e.target.id,
            id = e.target.parentElement.id;

        //Crear llamado a ajax
        var xhr = new XMLHttpRequest();

        //Actualizar
        if (accion === "actualizar") {

            Swal.fire({
                title: 'Ingresa un nombre para el Proyecto',
                input: 'text',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'El nombre de proyecto no puede ir vacio'
                    }
                }
            }).then(result => {
                var valorTexto = result.value;
                if (valorTexto != "" && result.isConfirmed === true) {

                    // FormData
                    var datos = new FormData();
                    datos.append('accion', accion);
                    datos.append('proyecto', valorTexto);
                    datos.append('id', id);

                    // Abrimos la conexion
                    xhr.open('POST', 'includes/model/modelo-proyecto.php', true);

                    // obtenemos el resultado
                    xhr.onload = function() {
                        if (this.status === 200) {
                            var respuesta = JSON.parse(xhr.responseText);
                            var resultado = respuesta.respuesta;
                            if (resultado === "correcto") {
                                var nomProyecto = respuesta.nombre_proyecto,
                                    id = respuesta.id_proyecto;

                                Swal.fire({
                                    icon: 'success',
                                    title: `Actualizado a: ${nomProyecto}`,
                                    text: 'El proyecto se ha actualizado correctamente'
                                })

                                // Agregar al HTML
                                var span = document.querySelector('.sub-span');
                                span.innerHTML = nomProyecto;

                                //Sidebar
                                var enlaceSidebar = document.getElementById(`proyecto:${id.toString()}`);
                                enlaceSidebar.innerText = nomProyecto;
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Hubo un error'
                                })
                            }
                        }

                    }

                    // enviar
                    xhr.send(datos);
                    return
                }
                return 'El nombre no puede ir vacio'
            })
        }

        //Borrar
        if (accion === "eliminar") {
            if (document.querySelector('.sub-span')) {
                var span = document.querySelector('.sub-span');

                Swal.fire({
                    title: `Estas a punto de eliminar la tarea: ${span.textContent}`,
                    text: "Esta acción no se puede deshacer",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.value) {


                        // Funcion eliminarProyecto()
                        eliminarProyecto(id);
                        var enlaceSidebar = document.getElementById(`proyecto:${id.toString()}`);

                        //Borrar del HTML
                        enlaceSidebar.remove();

                        Swal.fire(
                            'Eliminado',
                            'El proyecto se elimino correctamente.',
                            'success'
                        )
                    }
                })
            }
        }

    }

    function eliminarProyecto(id) {

        // FormData
        var datos = new FormData();
        datos.append('accion', 'eliminar');
        datos.append('id', id);

        var xhr = new XMLHttpRequest();

        // Abrimos la conexion
        xhr.open('POST', 'includes/model/modelo-proyecto.php', true);

        // Respuesta 
        xhr.onload = function() {
            if (this.status === 200) {
                JSON.parse(xhr.responseText);
            }
        }

        // enviar
        xhr.send(datos);
    }

    // Actualiza el avance del proyecto
    function actualizarProgreso() {
        //Obtener todas las tareas
        const tareas = document.querySelectorAll('li.tarea');

        //Obtene las tareas completadas

        const tareasCompletadas = document.querySelectorAll('i.completo');

        // Determinar el avance
        const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

        // Asignar el avance a la barra 
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';

        // Mostar una alerta al completar el 100%

        if (avance === 100) {
            Swal.fire(
                'Proyecto Terminado',
                'Ya no tienes tareas pendientes',
                'success'
            )
        }

    }

})();