<?php

header('Content-Type: application/json');

//include_once 'funciones-error-handle.php';

include_once 'database.php';
include_once 'findProyectosFunctions.php';

$response = array();

try {
	$response = reporte($mysqli);	
} catch (Exception $e) {
	$response['error'] = 1;
	$response['message'] = $e->getMessage();
}

echo json_encode($response);
