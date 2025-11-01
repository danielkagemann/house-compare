<?php
require_once '../../db.php';
require_once '../../logger.php';

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow DELETE requests
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? null;
    
$accessToken = null;
if ($authHeader && strpos($authHeader, 'Bearer ') === 0) {
    $accessToken = substr($authHeader, 7); // Remove 'Bearer ' prefix
}
    
global $db;
$userId = $db->getUserIdFromAccessToken($accessToken);
    
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Nicht berechtigt']);
    exit();
}

try {
    $result = $db->removeUser($userId);
    
    if ($result) {
        // send goodbye email
        sendEMail($db->getUserEmailById($userId),
        "Schade, dass Du gehst",
        "Dein Konto wurde erfolgreich gelöscht. Alle damit verbundenen Daten wurden ebenfalls entfernt. Du kannst jederzeit zurückkommen und ein neues Konto anlegen.");

        http_response_code(200);
        echo json_encode(['success' => 'User removed successfully']);
    } else {
        sendEMail($db->getUserEmailById($userId),
        "Kontolöschung fehlgeschlagen",
        "Dein Konto konnte nicht gelöscht werden. Bitte versuche es später erneut.");

        http_response_code(500);
        echo json_encode(['error' => 'Failed to remove user']);
    }
} catch (Exception $e) {
    error_log("Error removing user: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}