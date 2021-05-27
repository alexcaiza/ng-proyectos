<?php

header('Content-Type: application/json');

//include_once 'funciones-error-handle.php';

include_once 'database.php';
include_once 'findProyectosFunctions.php';

$responseInsert = array();

try {
	$postdata = file_get_contents("php://input");

  //var_dump($postdata);
	
	if(isset($postdata) && !empty($postdata)) {
		
		$params = json_decode($postdata);
		
		$paramsProyectos = new stdClass();
		$paramsProyectos->codigoProyecto = $params->codigoProyecto;
		
		$responseProyectos =  findProyectoById($paramsProyectos, $mysqli);
		
		if (isset($responseProyectos) 
			&& isset($responseProyectos['proyecto'])
			) {
			
			$proyecto = $responseProyectos['proyecto'];
			
			//var_dump($proyecto);
		
			$paramsGrupos = new stdClass();
			$paramsGrupos->codigoGrupo = $proyecto['codigogrupo'];
			
			$responseGrupos =  findGrupos($paramsGrupos, $mysqli);
			
			if (isset($responseGrupos)
				&& isset($responseGrupos['count']) == 1 
				) {
					
					$grupo = $responseGrupos['grupos'][0];
					
					//var_dump($grupo);
					
					if ($grupo['cantidadMaxima'] > $grupo['cantidadEstudiantes']) {
						
						$paramsProyectoEstudiante = new stdClass();
						$paramsProyectoEstudiante->codigoestudiante = $params->codigoestudiante;
						
						$responseProyectoEstudiante = findProyectoByEstudiante($params, $mysqli);
						
						if (isset($responseProyectoEstudiante) 
							&& isset($responseProyectoEstudiante['proyecto'])
							 && count($responseProyectoEstudiante['proyecto']) > 0) {
							 	
							 	$proyectoEst = $responseProyectoEstudiante['proyecto'];
							 	
							 	$responseInsert['error'] = 1;
								$responseInsert['message'] = "El estudiante ya esta registrada en el proyecto ".$proyectoEst['nombre'];
								
						 } else {
						 	
							$responseInsert = insertProyectoEstudiante($params, $mysqli);
						 	
						 }
								
					} else {
						$responseInsert['error'] = 1;
						$responseInsert['message'] = "La cantidad maxima de estudiantes ya esta registrada en el grupo ".$grupo['nombre'];
					}	
			}
		}
		
		
		
	}
	else {
		$responseInsert['error'] = 1;
		$responseInsert['message'] = "Datos vacios para consultar los proyectos";
	}
} catch (Exception $e) {
	$responseInsert['error'] = 1;
	$responseInsert['mensaje'] = $e->getMessage();
}

echo json_encode($responseInsert);
