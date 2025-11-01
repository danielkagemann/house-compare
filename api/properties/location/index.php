<?php

require_once '../../util.php';
require_once '../../logger.php';

// CORS handling - only allow GET requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

/**
 * helper routine to get coordinates
 */
function fromAddress(string $direction): array
{
    $url = 'https://nominatim.openstreetmap.org/search?format=json&q=' . urlencode($direction) . '&limit=1';

    $res = fetch($url, 'GET', ['headers' => ['User-Agent: house-compare/1.0']]);
    if ($res['status'] !== 200) {
        throw new Exception("Error fetching data from Nominatim");
    }

    logMessage("Fetched data from Nominatim for address: $direction" . print_r($res, true));

    $data = $res['json'];

    if (!$data || count($data) === 0) {
        throw new Exception("Keine Koordinaten gefunden");
    }

    return ['lat' => floatval($data[0]['lat']), 'lon' => floatval($data[0]['lon'])];
}

/**
 * helper routine to get address from coordinates including country
 */
function fromCoords(float $lat, float $lon): array
{
    $url = "https://nominatim.openstreetmap.org/reverse?lat=$lat&lon=$lon&format=json&addressdetails=1";

    $res = fetch($url, 'GET', ['headers' => ['User-Agent: house-compare/1.0']]);
    if ($res['status'] !== 200) {
        throw new Exception("Error fetching data from Nominatim");
    }

    $data = $res['json'];

    if (!$data) {
        throw new Exception("Keine Daten gefunden");
    }

    $label = [];
    if (isset($data['address']['road'])) {
        $label[] = $data['address']['road'];
    }
    if (isset($data['address']['postcode'])) {
        $label[] = $data['address']['postcode'];
    }
    if (isset($data['address']['village'])) {
        $label[] = $data['address']['village'];
    }
    if (isset($data['address']['town'])) {
        $label[] = $data['address']['town'];
    }

    $display = count($label) === 0 && isset($data['address']['name']) ? $data['address']['name'] : implode(", ", $label);

    return [
        'country' => $data['address']['country'] ?? null,
        'code' => $data['address']['country_code'] ?? null,
        'display' => $display,
    ];
}

try {
    if (!isset($_GET['q']) || trim($_GET['q']) === '') {
        http_response_code(400);
        echo json_encode(['error' => 'no query information']);
        exit;
    }

    $query = trim($_GET['q']);

    // Check if query is in lat,lon format
    $latLonPattern = '/^-?\d+\.?\d*,-?\d+\.?\d*$/';

    if (preg_match($latLonPattern, $query)) {
        // Parse as coordinates
        list($lat, $lon) = explode(',', $query);
        $lat = floatval($lat);
        $lon = floatval($lon);

        // validate ranges
        if ($lat >= -90 && $lat <= 90 && $lon >= -180 && $lon <= 180) {
            // get coordinates, address and country information
            $addressData = fromCoords($lat, $lon);

            echo json_encode(array_merge(['lat' => $lat, 'lon' => $lon], $addressData));
            exit;
        }

        http_response_code(400);
        echo json_encode(['error' => 'Invalid coordinates range']);
        exit;
    }

    // get coordinates, address and country information
    $coords = fromAddress($query);
    $addressData = fromCoords($coords['lat'], $coords['lon']);

    echo json_encode(array_merge($coords, $addressData));
    exit;
} catch (Exception $error) {
    logMessage(msg: "Error fetching location data: " . $error->getMessage(), level: "error");
    http_response_code(406);
    echo json_encode(['error' => $error->getMessage() ?: 'Error fetching location data']);
    exit;
}
