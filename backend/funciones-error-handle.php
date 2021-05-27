<?php
    function meetingErrorHandler(int $errNo, string $errMsg, string $file, int $line) {
		throw new Exception("Error handler got #[$errNo] occurred in [$file] at line [$line]: [$errMsg]");
	}
	set_error_handler('meetingErrorHandler');
?>