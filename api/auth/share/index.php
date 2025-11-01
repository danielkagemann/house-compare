<?php

require_once '../../db.php';


// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Extract Authorization header
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? null;
    
    $accessToken = null;
    if ($authHeader && strpos($authHeader, 'Bearer ') === 0) {
        $accessToken = substr($authHeader, 7); // Remove 'Bearer ' prefix
    }
    
    // Validate token using database function
    global $db;
    $shareLink = $db->getShareLink($accessToken);
    
    // Return appropriate status code
    if ($shareLink) {
        http_response_code(200); // OK - token is valid
        echo json_encode(['share' => $shareLink['share']]);
    } else {
        http_response_code(401); // Unauthorized - token is invalid
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
   