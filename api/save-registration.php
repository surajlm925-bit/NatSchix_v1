<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Database configuration
$host = 'localhost';
$dbname = 'assessment_db';
$username = 'your_db_username';
$password = 'your_db_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("
        INSERT INTO registrations (
            email, first_name, last_name, phone, date_of_birth, gender,
            address, city, state, zip_code, country, education, institution,
            field_of_study, experience, hear_about_us, created_at
        ) VALUES (
            :email, :first_name, :last_name, :phone, :date_of_birth, :gender,
            :address, :city, :state, :zip_code, :country, :education, :institution,
            :field_of_study, :experience, :hear_about_us, NOW()
        )
    ");
    
    $stmt->execute([
        ':email' => $input['email'],
        ':first_name' => $input['firstName'],
        ':last_name' => $input['lastName'],
        ':phone' => $input['phone'],
        ':date_of_birth' => $input['dateOfBirth'],
        ':gender' => $input['gender'],
        ':address' => $input['address'],
        ':city' => $input['city'],
        ':state' => $input['state'],
        ':zip_code' => $input['zipCode'],
        ':country' => $input['country'],
        ':education' => $input['education'],
        ':institution' => $input['institution'],
        ':field_of_study' => $input['fieldOfStudy'],
        ':experience' => $input['experience'],
        ':hear_about_us' => $input['hearAboutUs']
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Registration saved successfully']);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>