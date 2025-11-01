<?php
require_once 'PHPMailer.php';
require_once 'SMTP.php';
require_once 'Exception.php';


class Database {
    private $pdo;

    public function __construct($dbFile = 'villaya-data.db') {
        $this->pdo = new PDO('sqlite:' . $dbFile);
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
                editlink TEXT,
                sharelink TEXT
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

    public function createUser(string $email, string $access, string $editlink, string $sharelink): array {
        $stmt = $this->pdo->prepare("INSERT INTO USER (email, access, editlink, sharelink) VALUES (:email, :access, :editlink, :sharelink)");
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':access', $access, PDO::PARAM_STR);
        $stmt->bindParam(':editlink', $editlink, PDO::PARAM_STR);
        $stmt->bindParam(':sharelink', $sharelink, PDO::PARAM_STR);
        $stmt->execute();

        $userId = $this->pdo->lastInsertId();
        
        $stmt = $this->pdo->prepare("SELECT * FROM USER WHERE id = :id LIMIT 1");
        $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user;
    }

    public function getUserByAccessCode(string $accessCode): ?array {
        $stmt = $this->pdo->prepare("SELECT access FROM USER WHERE access = :access LIMIT 1");
        $stmt->bindParam(':access', $accessCode, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ? $user : null;
    }
}

// Email sending function
function sendEMail(string $email, string $message): bool {
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
        
        // Content
        $mail->isHTML(false);
        $mail->Subject = 'Neue Nachricht';
        $mail->Body    = $message;
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email could not be sent. Mailer Error: {$mail->ErrorInfo}");
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
