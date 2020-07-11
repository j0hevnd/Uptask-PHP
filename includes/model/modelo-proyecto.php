<?php 
error_reporting(E_ALL ^ E_NOTICE);
$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];
$id_proyecto = (int) $_POST['id'];

if($accion === 'crear') {
    //importar la conexion
    include '../functions/conexion.php';

    try {
        // Realizar la consulta
        $stmt = $conn->prepare(" INSERT INTO proyectos (nombre) VALUES (?) ");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();

        if( $stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    }catch(Exception $e){
        $respuesta = array(
            'error' =>  $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if($accion === 'actualizar') {
    include '../functions/conexion.php';

    try {
        $stmt = $conn->prepare(" UPDATE proyectos SET nombre = ? WHERE id = ? ");
        $stmt->bind_param('si', $proyecto, $id_proyecto);
        $stmt->execute();

        if( $stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'nombre_proyecto' => $proyecto,
                'id_proyecto' => $id_proyecto
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    }catch(Exception $e){
        $respuesta = array(
            'error' =>  $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if($accion === 'eliminar') {
    include '../functions/conexion.php';

    try {
        $stmt = $conn->prepare(" DELETE FROM proyectos  WHERE id = ? ");
        $stmt->bind_param('i', $id_proyecto);
        $stmt->execute();

        if( $stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto'
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
    }catch(Exception $e){
        $respuesta = array(
            'error' =>  $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}
