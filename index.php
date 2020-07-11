<?php 
    error_reporting(E_ALL ^ E_NOTICE);
    include 'includes/functions/sesiones.php';
    include 'includes/functions/funciones.php';
    include 'includes/templates/header.php'; 
    include 'includes/templates/barra.php';

    // obtener el ID de la url
    if( isset($_GET['id_proyecto']) ) {
        $id_proyecto = $_GET['id_proyecto'];
    }
?>

    <div class="contenedor">
        <?php include 'includes/templates/sidebar.php' ?>

        <main class="contenido-principal">
            <div class="titulo">
                <?php
                    $proyecto = obtenerNombreProyecto($id_proyecto);  
                    if(!$id_proyecto) { 
                        $proyecto = false;
                    }
                    if($proyecto){  ?>
                    <h1>Proyecto actual:
                        <?php 
                            foreach($proyecto as $nombre) { ?>
                                <span class="sub-span"><?php echo $nombre['nombre'] ?></span>
                        <?php }; ?>
                    </h1>
                    <div class="acciones-proyecto" id="<?php echo $id_proyecto ?>">  
                        <input type="submit" class="boton actualizar-proyecto" id="actualizar" value="Actualizar">
                        <input type="submit" class="boton eliminar-proyecto" id="eliminar" value="Eliminar">
                    </div>

            </div>


            <form action="#" class="agregar-tarea">
                <div class="campo">
                    <label for="tarea">Tarea:</label>
                    <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
                </div>
                <div class="campo enviar">
                    <input type="hidden" id="id_proyecto" value="<?php echo $id_proyecto ?>">
                    <input type="submit" class="boton nueva-tarea" value="Agregar">
                </div>
            </form>

            <?php 
                } else{
                    // Si no hay proyectos
                    echo "<p>Selecciona un proyecto a la izquierda</p>";
                } 
            ?>
            
            <h2>Listado de tareas:</h2>

            <div class="listado-pendientes">
                <ul>
                    <?php
                        //Obtiene las tareas del proyecto actual
                        $tareas = obtenerTareasProyecto($id_proyecto);
                        if($tareas->num_rows > 0){
                            // si hay tareas
                            foreach($tareas as $tarea): ?>
                                <li id="tarea:<?php echo $tarea['id'] ?>" class="tarea">
                                    <p><?php echo $tarea['nombre'] ?></p>
                                    <div class="acciones">
                                        <i class="far fa-check-circle <?php echo ($tarea['estado'] === '1' ? 'completo' : ''); ?>"></i>
                                        <i class="fas fa-trash"></i>
                                    </div>
                                </li>  
                    <?php   endforeach;    
                        }else {
                            // no hay tareas
                            echo "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
                        }                                          
                    ?>
                </ul>
            </div>

            <div class="avance">
                <h2>Avance del Proyecto</h2>
                <div id="barra-avance" class="barra-avance">
                    <div id="porcentaje" class="porcentaje"></div>
                </div>
            </div>

        </main>
    </div><!--.contenedor-->

<?php include 'includes/templates/footer.php'; ?>