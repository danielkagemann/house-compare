<?php

require_once '../../util.php';

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    if (!isset($_GET['url']) || empty($_GET['url'])) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'missing url']);
        exit;
    }

    $url = $_GET['url'];

    $res = fetch($url, 'GET');

    if ($res['status'] !== 200) {
        throw new Exception('Failed to fetch image, status code: ' . $res['status']);
    }

    $contentType = 'image/jpeg';
    if (isset($res['headers']['Content-Type'])) {
        $contentType = $res['headers']['Content-Type'];
    }

    header('Content-Type: ' . $contentType);
    header('Access-Control-Allow-Origin: *');
    echo $res['body'];

} catch (Exception $e) {
    http_response_code(406);
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
}

