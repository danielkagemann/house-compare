<?php
require_once '../../db.php';
require_once '../../logger.php';

/**
 * api/signin
 * Handles user sign-in by email
 * Expects JSON: { "email": "user@example.com" }
 */

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
    
    $email = $data['email'] ?? null;
    
    if (!$email) {
        http_response_code(400);
        echo json_encode(['error' => 'Keine EMail angegeben.']);
        exit();
    }

    logMessage(msg: "Sign-in attempt for email: $email");

    // Search in database for email
    global $db;
    $user = $db->getUserByEmail($email);
    
    // If user not found, create new user and send email with token
    if (!$user) {
        $newUser = $db->createUser(
            $email,
            generateLinkToken(6),
            generateLinkToken(),
            generateLinkToken()
        );
        
        // Send email with token
        $success = sendEMail($email, "Dein Bestätigungs-Code lautet: " . $newUser['access']);
        
        if (!$success) {
            throw new Exception("Email konnte nicht verschickt werden");
        }
        
        http_response_code(204); // No Content
        exit();
    }
    
    // User exists, return token
    http_response_code(200);
    echo json_encode(['token' => $user['access']]);
    
} catch (Exception $e) {
    logMessage(msg: $e->getMessage(), level: "error");
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
