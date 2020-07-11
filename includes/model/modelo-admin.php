<?php

$accion = $_POST['accion'];
$usuario = $_POST['usuario'];
$password = $_POST['password'];

if($accion === 'crear') {
    //Codigo para crear los administradores

    // hashear password
    $opciones = array(
        'cost' => 12
    );
    
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

    //importar la conexion
    include '../functions/conexion.php';
    try {
        // Realizar la consulta
        $stmt = $conn->prepare(" INSERT INTO usuarios (usuario, password) VALUES (? , ?) ");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();

        if( $stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    }catch(Exception $e){
        //tomamos las exepciones
        $respuesta = array(
            'error' =>  $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if($accion === 'login') {
    include '../functions/conexion.php';
    try {
        // Seleccionar de la base de datos
        $stmt = $conn->prepare(" SELECT id, usuario, password FROM usuarios WHERE usuario = ? ");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();

        // Loguear el Usuario
        $stmt->bind_result($id_usuario, $nombre_usuario, $pass_usuario); //bind_result Trae el resultado y lo asigna automaticamente
        $stmt->fetch(); // Nos muestra los resultados que trajimos con el bind_result
        if($nombre_usuario) {
            // El usuario existe, verificamos la contraseña
            if( password_verify( $password, $pass_usuario ) ) {

                // Iniciar la Sesion 
                session_start();
                $_SESSION['usuario'] = $nombre_usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;

                // Login correcto
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_usuario,
                    'tipo' => $accion
                );
            } else {
                // Login incorrecto, enviar error
                $respuesta = array(
                    'error' => 'Password Incorrecto'
                );
            }
        } else {
            $respuesta = array(
                'error' => 'Usuario no existe'
            );
        }
        $stmt->close();
        $conn->close();
    }catch(Exception $e){
        //tomamos las exepciones
        $respuesta = array(
            'error' =>  $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}


