<?php
require_once '../db.php';

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

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Get access token from Authorization header
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? null;
    
    $accessToken = null;
    if ($authHeader && strpos($authHeader, 'Bearer ') === 0) {
        $accessToken = substr($authHeader, 7); // Remove 'Bearer ' prefix
    }
    
    // Get user ID from access token
    global $db;
    $userId = $db->getUserIdFromAccessToken($accessToken);
    
    if (!$userId) {
        http_response_code(401);
        echo json_encode(['error' => 'Nicht berechtigt']);
        exit();
    }
    
    // Get all listings for this user
    $listings = $db->getListingsByUserId($userId);
    
    // Log the number of listings found (equivalent to console.log in TypeScript)
    error_log("listings: " . count($listings));
    
    // Return the listings
    http_response_code(200);
    echo json_encode($listings);
    
} catch (Exception $e) {
    error_log("Properties error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}