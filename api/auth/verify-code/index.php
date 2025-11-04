<?php
require_once '../../db.php';

/**
 * api/verify-code
 * Verifies a user's confirmation code
 * Expects query parameter: ?code=<verification_code>
 */

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Read JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige Parameter']);
        exit();
    }
    
    $code = $data['code'] ?? null;

    if (!$code) {
        http_response_code(400);
        echo json_encode(['error' => 'Kein Bestätigungscode angegeben.']);
        exit();
    }
    
    // Search in database for code
    global $db;
    $user = $db->getUserByAccessCode($code);
    
    // If code is not found we return 404 otherwise return user data
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Bestätigungscode nicht gefunden.']);
        exit();
    }
    
    // Return token
    http_response_code(200);
    echo json_encode(['token' => $user['access']]);
    
} catch (Exception $e) {
    error_log("Verify code error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
