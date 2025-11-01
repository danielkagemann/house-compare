<?php
require_once '../../db.php';

/**
 * api/properties/details
 * Handle CRUD operations for property listings
 * GET: Get a specific property/listing by UUID
 * POST: Create or update a listing
 * DELETE: Delete a listing by UUID
 */

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Function to authenticate user
function authenticateUser() {
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
    
    return $userId;
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        // Handle GET - Get specific listing
        $userId = authenticateUser();
        
        // Get UUID from query parameters
        $uuid = $_GET['uuid'] ?? null;
        
        if (!$uuid) {
            http_response_code(400);
            echo json_encode(['error' => 'UUID parameter is required']);
            exit();
        }
        
        // Get the specific listing for the given UUID and user ID
        global $db;
        $listing = $db->getListingByUuidAndUserId($uuid, $userId);
        
        if (!$listing) {
            http_response_code(404);
            echo json_encode(['error' => 'Objekt nicht gefunden']);
            exit();
        }
        
        // Return the listing (JSON parsing is already handled in the database method)
        http_response_code(200);
        echo json_encode($listing);
        
    } elseif ($method === 'POST') {
        // Handle POST - Create or update listing
        $userId = authenticateUser();
        
        // Get UUID from query parameter
        $uuid = $_GET['uuid'] ?? null;
        if (!$uuid) {
            http_response_code(400);
            echo json_encode(['error' => 'UUID parameter is required']);
            exit();
        }
        
        // Read JSON input
        $input = file_get_contents('php://input');
        $listing = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            exit();
        }
        
        // Extend listing with userId and uuid
        $listing['userId'] = $userId;
        $listing['uuid'] = $uuid;
        
        global $db;
        
        // Check if listing exists
        $existing = $db->getListingByUuid($uuid);
        
        // Create or update the listing
        $result = $db->upsertListing($listing);
        
        if ($existing) {
            // Updated existing listing
            http_response_code(200);
            echo json_encode($result);
        } else {
            // Created new listing
            http_response_code(201);
            echo json_encode($result);
        }
        
    } elseif ($method === 'DELETE') {
        // Handle DELETE - Delete listing
        $userId = authenticateUser();
        
        // Get UUID from query parameter
        $uuid = $_GET['uuid'] ?? null;
        
        if (!$uuid) {
            http_response_code(400);
            echo json_encode(['error' => 'Keine UUID angegeben.']);
            exit();
        }
        
        global $db;
        
        // Verify the listing belongs to the user before deleting
        $listing = $db->getListingByUuidAndUserId($uuid, $userId);
        if (!$listing) {
            http_response_code(404);
            echo json_encode(['error' => 'Listing not found or not authorized']);
            exit();
        }
        
        // Delete the listing
        $success = $db->deleteListing($uuid);
        
        if ($success) {
            http_response_code(204); // No Content
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete listing']);
        }
        
    } else {
        // Method not allowed
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
    
} catch (Exception $e) {
    error_log("Properties details error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>