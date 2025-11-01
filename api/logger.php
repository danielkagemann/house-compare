<?php
function logMessage(string $msg, string $level = "INFO"): void {
    $logFile = "/logs/app.log";
    $time = date("Y-m-d H:i:s");
    $line = "[$time][$level] $msg\n";
    error_log($line, 3, $logFile);
}