<?php
require_once 'PHPMailer.php';
require_once 'SMTP.php';
require_once 'Exception.php';
require_once 'logger.php';

class Database {
    private $pdo;

    public function __construct($dbFile = 'villaya-data.db') {
        $this->pdo = new PDO('sqlite:' . __DIR__ . '/' . $dbFile);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $this->createTables();
    }

    private function createTables() {
        $this->pdo->exec(
            "CREATE TABLE IF NOT EXISTS USER (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                creationdate DATETIME DEFAULT CURRENT_TIMESTAMP,
                email TEXT NOT NULL UNIQUE,
                access TEXT NOT NULL,
                share TEXT
            )"
        );

        $this->pdo->exec(
            "CREATE TABLE IF NOT EXISTS LISTING (
                uuid TEXT NOT NULL UNIQUE,
                userId INTEGER NOT NULL,
                creationdate DATETIME DEFAULT CURRENT_TIMESTAMP,
                title TEXT,
                url TEXT,
                price TEXT,
                sqm TEXT,
                rooms TEXT,
                location TEXT,
                image TEXT,
                description TEXT,
                contact TEXT,
                year TEXT,
                features TEXT,
                notes TEXT
            )"
        );
    }

    public function getUserIdFromAccessToken(?string $accessToken): ?int {
        if (!$accessToken) {
            return null;
        }

        $stmt = $this->pdo->prepare("SELECT id FROM USER WHERE access = :access LIMIT 1");
        $stmt->bindParam(':access', $accessToken, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return null;
        }

        return (int)$user['id'];
    }

    public function getUserByEmail(string $email): ?array {
        $stmt = $this->pdo->prepare("SELECT access FROM USER WHERE email = :email LIMIT 1");
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ? $user : null;
    }

    public function createUser(string $email, string $access, string $sharelink): array {
        $stmt = $this->pdo->prepare("INSERT INTO USER (email, access, share) VALUES (:email, :access, :share)");
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':access', $access, PDO::PARAM_STR);
        $stmt->bindParam(':share', $sharelink, PDO::PARAM_STR);
        $stmt->execute();

        $userId = $this->pdo->lastInsertId();
        
        $stmt = $this->pdo->prepare("SELECT * FROM USER WHERE id = :id LIMIT 1");
        $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user;
    }

    public function removeUser(int $userId): bool {
        $stmt = $this->pdo->prepare("DELETE FROM USER WHERE id = :id");
        $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
        if ($stmt->execute()) {
            // Also remove all listings for this user
            $stmt = $this->pdo->prepare("DELETE FROM LISTING WHERE userId = :userId");
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->execute();

            return true;
        }
        
        return false;
    }   

    public function getUserByAccessCode(string $accessCode): ?array {
        $stmt = $this->pdo->prepare("SELECT access FROM USER WHERE access = :access LIMIT 1");
        $stmt->bindParam(':access', $accessCode, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ? $user : null;
    }

    public function getUserEmailById(int $userId): ?string {
        $stmt = $this->pdo->prepare("SELECT email FROM USER WHERE id = :id LIMIT 1");
        $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ? $user['email'] : null;
    }

    public function getListingsByUserId(int $userId): array {
        $stmt = $this->pdo->prepare("SELECT * FROM LISTING WHERE userId = :userId");
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Convert JSON strings back to arrays for location and features
        foreach ($listings as &$listing) {
            if (isset($listing['location']) && $listing['location']) {
                $listing['location'] = json_decode($listing['location'], true);
            }
            if (isset($listing['features']) && $listing['features']) {
                $listing['features'] = json_decode($listing['features'], true);
            }
        }

        return $listings;
    }

    public function getListingByUuidAndUserId(string $uuid, int $userId): ?array {
        $stmt = $this->pdo->prepare("SELECT * FROM LISTING WHERE uuid = :uuid AND userId = :userId LIMIT 1");
        $stmt->bindParam(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $listing = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$listing) {
            return null;
        }

        // Convert JSON strings back to arrays for location and features
        if (isset($listing['location']) && $listing['location']) {
            $listing['location'] = json_decode($listing['location'], true);
        }
        if (isset($listing['features']) && $listing['features']) {
            $listing['features'] = json_decode($listing['features'], true);
        }

        return $listing;
    }

    public function upsertListing(array $listing): array {
        // Check if listing exists
        $stmt = $this->pdo->prepare("SELECT uuid FROM LISTING WHERE uuid = :uuid LIMIT 1");
        $stmt->bindParam(':uuid', $listing['uuid'], PDO::PARAM_STR);
        $stmt->execute();
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        // Convert arrays to JSON strings for storage
        $locationJson = isset($listing['location']) ? json_encode($listing['location']) : null;
        $featuresJson = isset($listing['features']) ? json_encode($listing['features']) : null;

        if ($existing) {
            // Update existing listing
            $stmt = $this->pdo->prepare("
                UPDATE LISTING SET 
                title = :title, url = :url, price = :price, sqm = :sqm, rooms = :rooms, 
                location = :location, image = :image, description = :description, 
                contact = :contact, year = :year, features = :features, notes = :notes
                WHERE uuid = :uuid
            ");
            $stmt->execute([
                ':title' => $listing['title'] ?? null,
                ':url' => $listing['url'] ?? null,
                ':price' => $listing['price'] ?? null,
                ':sqm' => $listing['sqm'] ?? null,
                ':rooms' => $listing['rooms'] ?? null,
                ':location' => $locationJson,
                ':image' => $listing['image'] ?? null,
                ':description' => $listing['description'] ?? null,
                ':contact' => $listing['contact'] ?? null,
                ':year' => $listing['year'] ?? null,
                ':features' => $featuresJson,
                ':notes' => $listing['notes'] ?? null,
                ':uuid' => $listing['uuid']
            ]);
        } else {
            // Insert new listing
            $stmt = $this->pdo->prepare("
                INSERT INTO LISTING 
                (uuid, title, url, price, sqm, rooms, location, image, description, contact, year, features, notes, userId) 
                VALUES (:uuid, :title, :url, :price, :sqm, :rooms, :location, :image, :description, :contact, :year, :features, :notes, :userId)
            ");
            $stmt->execute([
                ':uuid' => $listing['uuid'],
                ':title' => $listing['title'] ?? null,
                ':url' => $listing['url'] ?? null,
                ':price' => $listing['price'] ?? null,
                ':sqm' => $listing['sqm'] ?? null,
                ':rooms' => $listing['rooms'] ?? null,
                ':location' => $locationJson,
                ':image' => $listing['image'] ?? null,
                ':description' => $listing['description'] ?? null,
                ':contact' => $listing['contact'] ?? null,
                ':year' => $listing['year'] ?? null,
                ':features' => $featuresJson,
                ':notes' => $listing['notes'] ?? null,
                ':userId' => $listing['userId']
            ]);
        }

        // Return the updated/created listing
        return $this->getListingByUuid($listing['uuid']);
    }

    public function getListingByUuid(string $uuid): ?array {
        $stmt = $this->pdo->prepare("SELECT * FROM LISTING WHERE uuid = :uuid LIMIT 1");
        $stmt->bindParam(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->execute();
        $listing = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$listing) {
            return null;
        }

        // Convert JSON strings back to arrays for location and features
        if (isset($listing['location']) && $listing['location']) {
            $listing['location'] = json_decode($listing['location'], true);
        }
        if (isset($listing['features']) && $listing['features']) {
            $listing['features'] = json_decode($listing['features'], true);
        }

        return $listing;
    }

    public function deleteListing(string $uuid): bool {
        $stmt = $this->pdo->prepare("DELETE FROM LISTING WHERE uuid = :uuid");
        $stmt->bindParam(':uuid', $uuid, PDO::PARAM_STR);
        return $stmt->execute();
    }
}

// Email sending function
function sendEMail(string $email, string $title, string $body): bool {
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'w0083a6c.kasserver.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@villaya.de';
        $mail->Password   = '30092008!Villaya';
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        
        // Recipients
        $mail->setFrom('info@villaya.de', 'Villaya');
        $mail->addAddress($email);
        $mail->addReplyTo($email);

        // Read email template
        $templatePath = __DIR__ . '/email-template.html';
        if (file_exists($templatePath)) {
            $message = file_get_contents($templatePath);
            // Replace placeholders in template
            $message = str_replace('__TITLE__', $title, $message);
            $message = str_replace('__BODY__', $body, $message);
        } else {
            // Fallback to simple HTML if template doesn't exist
            $message = "<html><body><h2>{$title}</h2><p>{$body}</p></body></html>";
        }
        
        // Content
        $mail->CharSet = 'UTF-8';
        $mail->isHTML(true);
        $mail->Subject = 'Neue Nachricht von Villaya';
        $mail->Body    = $message;
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        logMessage("Email could not be sent. Mailer Error: {$mail->ErrorInfo}", "error");
        return false;
    }
}

// Generate random token function
function generateLinkToken(int $len = 30): string {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    $token = '';
    for ($i = 0; $i < $len; $i++) {
        $token .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $token;
}

$db = new Database();
