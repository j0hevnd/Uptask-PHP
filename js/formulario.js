eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;


    if (usuario == "" || password == "") {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Ambos campos son Obligatorios'
        })
    } else {

        // Datos que se envian al formulario
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        // Crear llamado a ajax

        var xhr = new XMLHttpRequest();

        // abrir conexión
        xhr.open('POST', 'includes/model/modelo-admin.php', true);

        // retorno de datos

        xhr.onload = function() {
            if (this.status == 200) {
                var respuesta = JSON.parse(xhr.responseText);

                if (respuesta.respuesta === 'correcto') {
                    // Si es nuevo usuario
                    if (respuesta.tipo === 'crear') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuario Creado',
                            text: 'El usuario se creo correctamente'
                        });

                        setTimeout(() => {
                            window.location.href = 'login.php';
                        }, 3000)
                    } else if (respuesta.tipo === 'login') {
                        Swal.fire({
                                icon: 'success',
                                title: 'Login Correcto',
                                text: 'presiona OK para abrir el Dashboard'
                            })
                            .then(result => {
                                if (result.value === true) {
                                    window.location.href = 'index.php'
                                }
                            })
                    }
                } else {
                    // hubo un error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: respuesta.error
                    })
                }
                document.querySelector('#formulario').reset();
            }
        }

        // Enviar la peticion 
        xhr.send(datos);
    }
}