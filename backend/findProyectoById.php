<?php

header('Content-Type: application/json');

//include_once 'funciones-error-handle.php';

include_once 'database.php';
include_once 'findProyectosFunctions.php';

$response = array();

try {
	$postdata = file_get_contents("php://input");

  //var_dump($postdata);
	
	if(isset($postdata) && !empty($postdata)) {
		
		$params = json_decode($postdata);
		
		//var_dump($params);
		
		$response = findProyectoById($params, $mysqli);		
	}
	else {
		$response['error'] = 1;
		$response['message'] = "Datos vacios para consultar los proyectos";
	}
} catch (Exception $e) {
	$response['error'] = 1;
	$response['mensaje'] = $e->getMessage();
}

echo json_encode($response);
