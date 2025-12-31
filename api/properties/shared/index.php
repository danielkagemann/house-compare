<?php
require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../logger.php';


// Handle CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
   http_response_code(405);
   header("Allow: GET");
   exit('Method Not Allowed');
}

try {
    // Get token from query parameters
    $from = $_GET['from'] ?? null;
    
    if (!$from) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige Paramter.']);
        exit();
    }
    
    // Search in database for shared listings by token
    global $db;
    $userId = $db->getUserIdFromShareLink($from);

    if (!$userId) {
        http_response_code(404);
        echo json_encode(['error' => 'Benutzer nicht gefunden.']);
        exit();
    }

    $listings = $db->getListingsByUserId($userId);
    http_response_code(200);
    echo json_encode($listings);
    
} catch (Throwable $e) {
    logMessage("Catched error in shared listings endpoint: " . $e->getMessage(), "ERROR");
    error_log("Shared listings error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}