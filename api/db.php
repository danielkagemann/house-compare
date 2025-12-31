<?php
require_once 'PHPMailer.php';
require_once 'SMTP.php';
require_once 'Exception.php';
require_once 'logger.php';

class Database {
    private $pdo;
    private array $config;

    public function __construct() {
        $this->config = require __DIR__ . '/secrets.php';

        try {
            $dsn = "mysql:host={$this->config['host']};dbname={$this->config['database']};charset=utf8mb4";
            $this->pdo = new PDO($dsn, $this->config['username'], $this->config['password']);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
            $this->createTables();
        } catch (PDOException $e) {
            logMessage("Database connection failed: " . $e->getMessage(), "error");
            throw $e;
        }
    }

    private function createTables() {
        $this->pdo->exec(
            "CREATE TABLE IF NOT EXISTS USER (
                id INT AUTO_INCREMENT PRIMARY KEY,
                creationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                email VARCHAR(255) NOT NULL UNIQUE,
                access VARCHAR(20) NOT NULL,
                share VARCHAR(255) NULL,
                INDEX idx_access (access),
                INDEX idx_share (share)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
        );

        $this->pdo->exec(
            "CREATE TABLE IF NOT EXISTS LISTING (
                uuid VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
                userId INT NOT NULL,
                creationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                title VARCHAR(500) NULL,
                url TEXT NULL,
                price VARCHAR(100) NULL,
                sqm VARCHAR(100) NULL,
                rooms VARCHAR(100) NULL,
                location JSON NULL,
                image LONGTEXT NULL,
                description TEXT NULL,
                contact TEXT NULL,
                year VARCHAR(50) NULL,
                features JSON NULL,
                notes TEXT NULL,
                FOREIGN KEY (userId) REFERENCES USER(id) ON DELETE CASCADE,
                INDEX idx_userId (userId),
                INDEX idx_creationdate (creationdate)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
        );

        // Ensure 'rank' column exists on LISTING table (INT) with default 0
        $this->pdo->exec(
            "ALTER TABLE LISTING ADD COLUMN IF NOT EXISTS `rank` INT NOT NULL DEFAULT 0"
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

    public function getShareLink(string $access): ?array {
        $stmt = $this->pdo->prepare("SELECT share FROM USER WHERE access = :access LIMIT 1");
        $stmt->bindParam(':access', $access, PDO::PARAM_STR);
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
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function removeUser(int $userId): bool {
        $stmt = $this->pdo->prepare("DELETE FROM USER WHERE id = :id");
        $stmt->bindParam(':id', $userId, PDO::PARAM_INT);

        return $stmt->execute();
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

    public function getUserIdFromShareLink(string $shareLink): ?int {
        $stmt = $this->pdo->prepare("SELECT id FROM USER WHERE share = :share LIMIT 1");
        $stmt->bindParam(':share', $shareLink, PDO::PARAM_STR);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row || !isset($row['id'])) {
            return null;
        }

        return (int)$row['id'];
    }

    public function getListingsByUserId(int $userId): array {
        $stmt = $this->pdo->prepare("SELECT * FROM LISTING WHERE userId = :userId");
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Convert JSON columns back to arrays for location and features
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

        // Convert JSON columns back to arrays for location and features
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

        // Convert arrays to JSON for MariaDB storage
        $locationJson = isset($listing['location']) ? json_encode($listing['location'], JSON_UNESCAPED_UNICODE) : null;
        $featuresJson = isset($listing['features']) ? json_encode($listing['features'], JSON_UNESCAPED_UNICODE) : null;

        if ($existing) {
            // Update existing listing
            $stmt = $this->pdo->prepare("
                UPDATE LISTING SET
                title = :title, url = :url, price = :price, sqm = :sqm, rooms = :rooms,
                location = :location, image = :image, description = :description,
                contact = :contact, year = :year, features = :features, notes = :notes, rank = :rank
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
                ':rank' => $listing['rank'] ?? 0,
                ':uuid' => $listing['uuid']
            ]);
        } else {
            // Insert new listing
            $stmt = $this->pdo->prepare("
                INSERT INTO LISTING
                (uuid, title, url, price, sqm, rooms, location, image, description, contact, year, features, notes, rank, userId)
                VALUES (:uuid, :title, :url, :price, :sqm, :rooms, :location, :image, :description, :contact, :year, :features, :notes, :rank, :userId)
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
                ':rank' => $listing['rank'] ?? 0,
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

        // Convert JSON columns back to arrays for location and features
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

    $cfg = require __DIR__ . '/secrets.php';
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = $cfg['email_host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $cfg['email_user'];
        $mail->Password   = $cfg['email_pw'];
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

try {
    $db = new Database();
} catch (PDOException $e) {
    logMessage("Failed to initialize database: " . $e->getMessage(), "error");
    // Fallback or error handling can be added here
    throw $e;
}
