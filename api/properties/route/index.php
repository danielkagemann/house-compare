<?php
// CORS handling - only allow GET requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$startlat = $_GET['startlat'] ?? null;
$startlon = $_GET['startlon'] ?? null;
$endlat = $_GET['endlat'] ?? null;
$endlon = $_GET['endlon'] ?? null;

if ($startlat === null || $startlon === null || $endlat === null || $endlon === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters']);
    exit;
}

function returnError(string $message, int $code = 500): void
{
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// prepare cachedir
$cacheDir = __DIR__ . '/cache';
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0775, true);
}

// tolerance cachekey by truncating the lat/lon to 4 decimals (~11m)
    $startlatR = number_format($startlat, 4, '.', '');
    $startlonR = number_format($startlon, 4, '.', '');
    $endlatR = number_format($endlat, 4, '.', '');
    $endlonR = number_format($endlon, 4, '.', '');

$cacheKey = "osrm:$startlatR:$startlonR:$endlatR:$endlonR";
$file = $cacheDir . '/' . hash('sha256', $cacheKey) . '.json';

// cache hit?
if (is_file($file) && (time() - filemtime($file) < $ttlSeconds)) {
    $data = json_decode(file_get_contents($file), true);
    if (is_array($data)) {
        return $data;
    }
}

// send query
$response = null;
$httpCode = 0;
$lastError = '';


$endpoint = "https://router.project-osrm.org/route/v1/driving/$startlonR,$startlatR;$endlonR,$endlatR?overview=full&geometries=geojson";
$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => 'data=' . urlencode($query),
    CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
    CURLOPT_TIMEOUT        => 25,
]);

$response = curl_exec($ch);
if ($response === false) {
    $lastError = curl_error($ch);
}
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

    
if ($response !== false && $httpCode >= 200 && $httpCode < 300) {
    $data = json_decode($response, true);

    // atomic write
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    file_put_contents($tmp, $response);
    rename($tmp, $file);

    echo $response;
    exit;
}
  
returnError('Failed to send request: ' . $lastError, 502);
