<?php

include_once 'funciones-error-handle.php';

include_once 'database.php';
include_once 'funciones-sql.php';

function findProyectos($params, $mysqli) {

	$response = array();

	$response['params'] = $params;

	if(isset($params) && !empty($params)) {
		
		$proyectos = array();

		$codigoGrupo = null;
		if(isset($params->codigoGrupo) && !empty($params->codigoGrupo)) {
			$codigoGrupo = mysqli_real_escape_string($mysqli, $params->codigoGrupo);
		}

		$sql = "SELECT ";
		$sql .= " p.* ";		
		$sql .= " FROM proyectos p ";		
		$sql .= " WHERE 1=1 ";		
		$sql .= " AND p.estado = '1' ";

		if ($codigoGrupo != null) {
			$sql .= " AND p.codigogrupo = '$codigoGrupo' ";
		}
		
		$response['sqlProyectos'] = $sql;
		
		$result = mysqli_query($mysqli, $sql);
		
		if(empty(mysqli_errno($mysqli))) {
			if(mysqli_num_rows($result) > 0) {
				while($row = mysqli_fetch_assoc($result)) {
					$proyecto = array();
					
					$proyecto['codigoProyecto'] = $row['codigoproyecto'];
					$proyecto['codigoGrupo'] = $row['codigogrupo'];
					$proyecto['nombre'] = $row['nombre'];
					$proyecto['descripcion'] = $row['descripcion'];					
					$proyecto['estado'] = $row['estado'];
					
					// Consulta la cantidad de estudiantes del proyecto
					$proyecto['cantidadEstudiantes'] = 0;
					
					$paramsProyectos = new stdClass();
					$paramsProyectos->codigoProyecto = $proyecto['codigoProyecto'];
					
					$responseCount = countProyectoEstudiante($paramsProyectos, $mysqli);
					//var_dump($responseCount);
					if ($responseCount['error'] == 0 && isset($responseCount['count'])) {
						$proyecto['cantidadEstudiantes'] = $responseCount['count'];						
					}
					
					$proyectos[] = $proyecto;
				}
			}
			$response['error'] = 0;
			$response['proyectos'] = $proyectos;			
			$response['count'] = count($proyectos);
			if (count($proyectos) > 0) {
				$response['message'] = 'Los proyectos se consultaron correctamente';
			} else {
				$response['message'] = 'La consulta de proyectos no devolvio registros';
			}
		} else {
			$response['error'] = 1;
			$response['message'] = 'Error al consultar las reuniones del estudiante '.mysqli_error($mysqli);
		}
	}
	else {
		$response['error'] = 1;
		$response['message'] = 'Datos vacios para consultar las citas del estudiante';
	}

	return $response;
}

function findGrupos($params, $mysqli) {

	$response = array();

	$response['params'] = $params;

	if(isset($params) && !empty($params)) {
		
		$codigoGrupo = null;
		if(isset($params->codigoGrupo) && !empty($params->codigoGrupo)) {
			$codigoGrupo = mysqli_real_escape_string($mysqli, $params->codigoGrupo);
		}
				
		$grupos = array();

		$sql = "SELECT ";
		$sql .= " g.* ";		
		$sql .= " FROM grupos g ";		
		$sql .= " WHERE 1=1 ";		
		$sql .= " AND g.estado = '1' ";
		
		if ($codigoGrupo != null) {
			$sql .= " AND g.codigogrupo = '$codigoGrupo' ";
		}
		
		$response['sqlGrupos'] = $sql;
		
		$result = mysqli_query($mysqli, $sql);
		
		if(empty(mysqli_errno($mysqli))) {
			if(mysqli_num_rows($result) > 0) {
				while($row = mysqli_fetch_assoc($result)) {
					$grupo = array();
					
					$grupo['codigoGrupo'] = $row['codigogrupo'];
					$grupo['nombre'] = $row['nombre'];
					$grupo['descripcion'] = $row['descripcion'];
					$grupo['cantidadMaxima'] = $row['cantidadmaxima'];
					
					$paramsProyectos = new stdClass();
					$paramsProyectos->codigoGrupo = $grupo['codigoGrupo'];
					$paramsProyectos->isvalid = true;
					
					// Consulta la cantidad de estudiantes del grupo
					$grupo['cantidadEstudiantes'] = 0;
					
					$responseCount = countProyectoEstudiante($paramsProyectos, $mysqli);
					//var_dump($responseCount);
					if ($responseCount['error'] == 0 && isset($responseCount['count'])) {
						$grupo['cantidadEstudiantes'] = $responseCount['count'];						
					}

					// Consulta los proyectos del grupo
					$responseProyectos = findProyectos($paramsProyectos, $mysqli);

					if ($responseProyectos['error'] == 0 && isset($responseProyectos['proyectos'])) {
						$grupo['proyectos'] = $responseProyectos['proyectos'];						
					}
					
					$grupos[] = $grupo;
				}
			}
			$response['error'] = 0;
			$response['grupos'] = $grupos;			
			$response['count'] = count($grupos);
			if (count($grupos) > 0) {
				$response['message'] = 'Los grupos de proyectos se consultaron correctamente';
			} else {
				$response['message'] = 'La consulta de proyectos no devolvio registros';
			}
		} else {
			$response['error'] = 1;
			$response['message'] = 'Error al consultar los grupos de proyectos '.mysqli_error($mysqli);
		}
	}
	else {
		$response['error'] = 1;
		$response['message'] = 'Datos vacios para consultar los grupos de proyectos';
	}

	return $response;
}

function findEstudianteByCedula($params, $mysqli) {

	$response = array();

	$response['params'] = $params;

	if(isset($params) && !empty($params)) {
		
		$cedula = null;
		if(isset($params->cedula) && !empty($params->cedula)) {
			$cedula = mysqli_real_escape_string($mysqli, $params->cedula);
		}
				
		$estudiante = array();

		$sql = "SELECT ";
		$sql .= " e.* ";		
		$sql .= " FROM estudiantes e ";		
		$sql .= " WHERE 1=1 ";		
		$sql .= " AND e.estado = '1' ";		
		$sql .= " AND e.cedula = '$cedula' ";
		
		$response['sqlEstudiante'] = $sql;
		
		$result = mysqli_query($mysqli, $sql);
		
		if(empty(mysqli_errno($mysqli))) {
			if(mysqli_num_rows($result) > 0) {
				while($row = mysqli_fetch_assoc($result)) {					
					$estudiante['codigoestudiante'] = $row['codigoestudiante'];
					$estudiante['cedula'] = $row['cedula'];
					$estudiante['nombres'] = $row['nombres'];
					$estudiante['apellidos'] = $row['apellidos'];
					$estudiante['nombrecompleto'] = $row['nombrecompleto'];
					$estudiante['curso'] = $row['curso'];
					$estudiante['estado'] = $row['estado'];
				}
			}
			$response['error'] = 0;
			$response['estudiante'] = $estudiante;		
			
			if (count($estudiante) > 0) {
				$response['message'] = 'Los datos del estudiante se consultaron correctamente';
			} else {
				$response['error'] = 1;
				$response['message'] = "No existe el estudiante con la cedula: $cedula";
			}
		} else {
			$response['error'] = 1;
			$response['message'] = 'Error al consultar los datos del estudiante '.mysqli_error($mysqli);
		}
	}
	else {
		$response['error'] = 1;
		$response['message'] = 'Datos vacios para consultar los datos del estudiante';
	}

	return $response;
}

function findProyectoById($params, $mysqli) {

	$response = array();

	$response['params'] = $params;

	if(isset($params) && !empty($params)) {
		
		$codigoProyecto = null;
		if(isset($params->codigoProyecto) && !empty($params->codigoProyecto)) {
			$codigoProyecto = mysqli_real_escape_string($mysqli, $params->codigoProyecto);
		}
				
		$proyecto = array();

		$sql = "SELECT ";
		$sql .= " p.* ";		
		$sql .= " FROM proyectos p ";		
		$sql .= " WHERE 1=1 ";		
		$sql .= " AND p.estado = '1' ";		
		$sql .= " AND codigoProyecto = '$codigoProyecto' ";
		
		$response['sqlProyecto'] = $sql;
		
		$result = mysqli_query($mysqli, $sql);
		
		if(empty(mysqli_errno($mysqli))) {
			if(mysqli_num_rows($result) > 0) {
				while($row = mysqli_fetch_assoc($result)) {
					
					$proyecto['codigoproyecto'] = $row['codigoproyecto'];
					$proyecto['codigogrupo'] = $row['codigogrupo'];
					$proyecto['nombre'] = $row['nombre'];
					$proyecto['descripcion'] = $row['descripcion'];					
					$proyecto['estado'] = $row['estado'];
					
					$proyecto['cantidadEstudiantes'] = 0;
					
				}
			}
			$response['error'] = 0;
			$response['proyecto'] = $proyecto;		
			
			if (count($proyecto) > 0) {
				$response['message'] = 'Los datos del proyecto se consultaron correctamente';
			} else {
				$response['error'] = 1;
				$response['message'] = "No existe el proyecto con el codigo: $codigoProyecto";
			}
		} else {
			$response['error'] = 1;
			$response['message'] = 'Error al consultar los datos del proyecto '.mysqli_error($mysqli);
		}
	}
	else {
		$response['error'] = 1;
		$response['message'] = 'Datos vacios para consultar los datos del proyecto';
	}

	return $response;
}

function findProyectoByEstudiante($params, $mysqli) {

	$response = array();

	$response['params'] = $params;

	if(isset($params) && !empty($params)) {
		
		$codigoestudiante = null;
		if(isset($params->codigoestudiante) && !empty($params->codigoestudiante)) {
			$codigoestudiante = mysqli_real_escape_string($mysqli, $params->codigoestudiante);
		} else {
			return null;
		}
				
		$proyecto = array();

		$sql = "SELECT ";
		$sql .= " p.* ";		
		$sql .= " FROM proyecto_estudiante pe ";		
		$sql .= " INNER JOIN proyectos p on p.codigoproyecto = pe.codigoproyecto ";
		$sql .= " INNER JOIN estudiantes e on e.codigoestudiante = pe.codigoestudiante  ";
		
		$sql .= " WHERE 1=1 ";		
		$sql .= " AND p.estado = '1' ";
		$sql .= " AND e.estado = '1' ";
		
		if ($codigoestudiante != null) {
			$sql .= " AND e.codigoestudiante = '$codigoestudiante' ";
		}
		
		$response['sqlProyecto'] = $sql;
		
		$result = mysqli_query($mysqli, $sql);
		
		if(empty(mysqli_errno($mysqli))) {
			if(mysqli_num_rows($result) > 0) {
				while($row = mysqli_fetch_assoc($result)) {
					
					$proyecto['codigoproyecto'] = $row['codigoproyecto'];
					$proyecto['codigogrupo'] = $row['codigogrupo'];
					$proyecto['nombre'] = $row['nombre'];
					$proyecto['descripcion'] = $row['descripcion'];					
					$proyecto['estado'] = $row['estado'];
					
					$proyecto['cantidadEstudiantes'] = 0;
					
				}				
			}	
			
			if (count($proyecto) > 0) {
				
				$response['error'] = 0;
				$response['proyecto'] = $proyecto;
				
				$response['message'] = 'Los datos del proyecto se consultaron correctamente';
			} else {
				$response['error'] = 1;
				$response['message'] = "No existe el proyecto con el codigo del estudiante: $codigoestudiante";
			}
		} else {
			$response['error'] = 1;
			$response['message'] = 'Error al consultar los datos del proyecto '.mysqli_error($mysqli);
		}
	}
	else {
		$response['error'] = 1;
		$response['message'] = 'Datos vacios para consultar los datos del proyecto';
	}

	return $response;
}

function countProyectoEstudiante($params, $mysqli) {

	$response = array();

	$response['params'] = $params;

	if(isset($params) && !empty($params)) {
		
		$codigoProyecto = null;
		if(isset($params->codigoProyecto) && !empty($params->codigoProyecto)) {
			$codigoProyecto = mysqli_real_escape_string($mysqli, $params->codigoProyecto);
		}
		
		$codigoestudiante = null;
		if(isset($params->codigoestudiante) && !empty($params->codigoestudiante)) {
			$codigoestudiante = mysqli_real_escape_string($mysqli, $params->codigoestudiante);
		}
		
		$codigoGrupo = null;
		if(isset($params->codigoGrupo) && !empty($params->codigoGrupo)) {
			$codigoGrupo = mysqli_real_escape_string($mysqli, $params->codigoGrupo);
		}
				
		$proyecto = array();

		$sql = "SELECT ";
		$sql .= " count(*) AS `count` ";		
		$sql .= " FROM proyecto_estudiante pe ";		
		$sql .= " INNER JOIN proyectos p on p.codigoproyecto = pe.codigoproyecto ";
		$sql .= " INNER JOIN estudiantes e on e.codigoestudiante = pe.codigoestudiante  ";
		
		$sql .= " WHERE 1=1 ";		
		$sql .= " AND p.estado = '1' ";
		$sql .= " AND e.estado = '1' ";
		
		if ($codigoProyecto != null) {
			$sql .= " AND p.codigoProyecto = '$codigoProyecto' ";
		}
		
		if ($codigoestudiante != null) {
			$sql .= " AND e.codigoestudiante = '$codigoestudiante' ";
		}
		
		if ($codigoGrupo != null) {
			$sql .= " AND p.codigoGrupo = '$codigoGrupo' ";
		}
		
		$response['sqlCount'] = $sql;
		
		$result = mysqli_query($mysqli, $sql);
		
		if(empty(mysqli_errno($mysqli))) {
			
			//$row = mysql_fetch_assoc($result);
			$row = mysqli_fetch_assoc($result);
			
			$response['count'] = (int)$row['count'];
			$response['error'] = 0;
			
		} else {
			$response['error'] = 1;
			$response['message'] = 'Error al consultar los datos del proyecto '.mysqli_error($mysqli);
		}
	}
	else {
		$response['error'] = 1;
		$response['message'] = 'Datos vacios para consultar los datos del proyecto';
	}

	return $response;
}

function insertProyectoEstudiante($params, $mysqli) {
	$meetingid = null;
	$error = null;
	$message = null;
	
	$response = array();
	
	try {
		
		$estado = 1;
		$fecharegistro = date('Y-m-d H:i:s');
		
		// Registra un insert on table meetings
		$sqlInsert = "INSERT INTO `proyecto_estudiante` ";
		$sqlInsert .= "(`codigoproyecto`, `codigoestudiante`, `fecharegistro`, `estado`) ";
		$sqlInsert .= " VALUES ";
		$sqlInsert .= "(";		
		$sqlInsert .= "".$params->codigoProyecto.",";
		$sqlInsert .= "".$params->codigoestudiante.",";
		$sqlInsert .= "'$estado',";
		$sqlInsert .= "'$fecharegistro'";
		$sqlInsert .= ")";
		
		$response['sqlInsert'] = $sqlInsert;
		
		//var_dump($sqlInsertMeeting);
	
		$resultset = mysqli_query($mysqli, $sqlInsert) or die(mysqli_error());
		
		if($resultset) {				
			//$meetingid = mysqli_insert_id($mysqli);
			$error = 0;
			$message = "Los datos se registraron correctamente";				
		} else  {
			$error = 1;
			$message = "Error statement insert table proyecto_estudiante";
		}
	} catch (Exception $e) {
		$error = 1;
		$message = $e->getMessage();
	}
	
	$response['error'] = $error;
	$response['message'] = $message;
	//$obj->meetingid = $meetingid;
	
	return $response;
}

function reporte($mysqli) {

	$response = array();
				
	$data = array();

	$sql = "SELECT ";
	$sql .= " e.cedula, e.nombrecompleto, e.curso,  ";		
	$sql .= " g.nombre as nombregrupo,  ";
	$sql .= " p.nombre as nombreproyecto  ";
	$sql .= " FROM estudiantes e ";		
	$sql .= " LEFT JOIN proyecto_estudiante pe on pe.codigoestudiante = e.codigoestudiante ";
	$sql .= " LEFT JOIN proyectos p on p.codigoproyecto = pe.codigoproyecto ";
	$sql .= " LEFT JOIN grupos g on g.codigogrupo = p.codigogrupo ";
	$sql .= " WHERE 1=1 ";
	$sql .= " ORDER BY -g.nombre desc, -p.nombre desc, e.curso, e.nombrecompleto ";
	
	$response['sqlReporte'] = $sql;
	
	$result = mysqli_query($mysqli, $sql);
	
	if(empty(mysqli_errno($mysqli))) {
		if(mysqli_num_rows($result) > 0) {
			while($row = mysqli_fetch_assoc($result)) {
				$data[] = $row;
			}
		}
		
		$response['data'] = $data;			
		$response['count'] = count($data);
		if (count($data) > 0) {
			$response['error'] = 0;
			$response['message'] = 'Los datos del reporte se consultaron correctamente';
		} else {
			$response['error'] = 1;
			$response['message'] = 'La consulta del reporte no devolvio registros';
		}
	} else {
		$response['error'] = 1;
		$response['message'] = 'Error al consultar los datos del reporte '.mysqli_error($mysqli);
	}

	return $response;
}