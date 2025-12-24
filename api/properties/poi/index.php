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

$lat = $_GET['lat'] ?? null;
$lon = $_GET['lon'] ?? null;
$radius = $_GET['radius'] ?? 5000;

if ($lat === null || $lon === null) {
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

/**
 * get data from cachefile or send request with caching
 * @param string $typeKey
 * @param string $typeValue
 * @param string $amount
 * @param int $ttlSeconds
 * @throws RuntimeException
 * @return array
 */
function overpassCached(string $typeKey, string $typeValue, int $amount, int $ttlSeconds = 604800): array
{
    global $lat, $lon, $radius;

    $latR = number_format($lat, 4, '.', '');
    $lonR = number_format($lon, 4, '.', '');
    $cacheKey = "overpass:$typeKey=$typeValue:r=$radius:lat=$latR:lon=$lonR";

    $query = "[out:json][timeout:15];"
        . "("
        . "nwr(around:$radius,$lat,$lon)[\"$typeKey\"=\"$typeValue\"];"
        . ");"
        . "out center tags $amount;";

    $cacheDir = __DIR__ . '/cache';
    if (!is_dir($cacheDir)) {
        mkdir($cacheDir, 0775, true);
    }

    $file = $cacheDir . '/' . hash('sha256', $cacheKey) . '.json';

    // cache hit?
    if (is_file($file) && (time() - filemtime($file) < $ttlSeconds)) {
        $data = json_decode(file_get_contents($file), true);
        if (is_array($data)) {
            return $data;
        }
    }

    // fetch from Overpass with simple fallback mirrors
    $endpoints = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
        'https://overpass.openstreetmap.ru/api/interpreter'
    ];

    $response = null;
    $httpCode = 0;
    $lastError = '';

    foreach ($endpoints as $endpoint) {
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
            break; // success
        }
    }

    if ($response === false) {
        returnError('Failed to connect to Overpass API: ' . $lastError, 502);
    }

    if ($httpCode < 200 || $httpCode >= 300) {
        returnError('Overpass API returned HTTP ' . $httpCode . ', with response ' . $response, 502);
    }

    $data = json_decode($response, true);
    if (!is_array($data)) {
        returnError('Invalid JSON from Overpass', 502);
    }

    // convert into pretty structure
    $data = array_map(function($element) use ($typeValue) {
        $rlat = $element["lat"] ?? ($element["center"]["lat"] ?? null);
        $rlon = $element["lon"] ?? ($element["center"]["lon"] ?? null);
        return [
            "name" => $element["tags"]["name"] ?? null,
            "type" => $typeValue,
            "coordinates" => [
                "lat" => $rlat,
                "lon" => $rlon
            ]
        ];
    }, $data["elements"] ?? []);

    // atomic write
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE));
    rename($tmp, $file);

    return $data;
}

$market = overpassCached('amenity', 'supermarket', 5);
$super = overpassCached('shop', 'supermarket', 5);
$restaurant = overpassCached('amenity', 'restaurant',5);
$beach = overpassCached('natural', 'beach', 3);
$resort = overpassCached('leisure', 'beach_resort', 3);

$result = array_merge($super, $market, $restaurant, $beach, $resort);
echo json_encode($result, JSON_UNESCAPED_UNICODE);
