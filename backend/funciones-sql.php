<?php

	include_once 'funciones-error-handle.php';

	function armarInValue($array) {
		$value = "";
		$separador = "";
		$array_count = count($array);
		for ($i = 0; $i < $array_count; $i++){
			$value .= $separador."'".$array[$i]."'";
			$separador = ",";
		}
		return $value;
	}

?>