<?php 

// función para obtener la pagina en la que nos encontramos
function obtenerPaginaActual() {
    $archivo = basename($_SERVER['PHP_SELF']); /* El $_SERVER accede a los archivos en los que se esta ospedado.
    El PHP_SELF nos devuelve la ruta en la que nos encontramos actualmente */
    $pagina = str_replace(".php", "", $archivo); // Reemplaza una parte de un string por otra
    return $pagina;
}

/* Consultas */

/* Obtener todos los proyectos */
function obtenerProyectos() {
    include 'conexion.php';
    try {
        return $conn->query( "SELECT id, nombre FROM proyectos" );        
    }catch(Exceotion $e) {
        echo "Error!! :" . $e->getMessage();
        return false;
    }

}

// Obtener el nombre del proyecto
function obtenerNombreProyecto( $id = null ) {
    include 'conexion.php';
    try {
        return $conn->query( "SELECT nombre FROM proyectos WHERE id = '$id'" );        
    }catch(Exceotion $e) {
        echo "Error!! :" . $e->getMessage();
        return false;
    }
}

// Obtener las clases del proyecto 

function obtenerTareasProyecto( $id = null ) {
    include 'conexion.php';
    try {
    return $conn->query( "SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}" );        
    }catch(Exceotion $e) {
        echo "Error!! :" . $e->getMessage();
        return false;
    }
}

?>