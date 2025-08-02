<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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
    
    // Calculate scores by subject
    $subjectScores = [];
    $totalQuestions = 0;
    $totalCorrect = 0;
    
    foreach ($input['answers'] as $answer) {
        // Get question details
        $questionStmt = $pdo->prepare("SELECT * FROM questions WHERE id = :id");
        $questionStmt->execute([':id' => $answer['questionId']]);
        $question = $questionStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($question) {
            $subject = $question['subject'];
            if (!isset($subjectScores[$subject])) {
                $subjectScores[$subject] = ['correct' => 0, 'total' => 0];
            }
            
            $subjectScores[$subject]['total']++;
            $totalQuestions++;
            
            if ($answer['selectedAnswer'] == $question['correct_answer']) {
                $subjectScores[$subject]['correct']++;
                $totalCorrect++;
            }
        }
    }
    
    // Calculate duration in seconds
    $startTime = new DateTime($input['startTime']);
    $endTime = new DateTime($input['endTime']);
    $duration = $endTime->getTimestamp() - $startTime->getTimestamp();
    
    // Save results for each subject
    foreach ($subjectScores as $subject => $scores) {
        $score = ($scores['total'] > 0) ? round(($scores['correct'] / $scores['total']) * 100) : 0;
        
        $stmt = $pdo->prepare("
            INSERT INTO test_results (
                email, test_time, subject, questions, answers, score, duration_seconds, created_at
            ) VALUES (
                :email, :test_time, :subject, :questions, :answers, :score, :duration, NOW()
            )
        ");
        
        $stmt->execute([
            ':email' => $input['email'],
            ':test_time' => $input['startTime'],
            ':subject' => $subject,
            ':questions' => json_encode($input['questions']),
            ':answers' => json_encode($input['answers']),
            ':score' => $score,
            ':duration' => $duration
        ]);
    }
    
    $overallScore = ($totalQuestions > 0) ? round(($totalCorrect / $totalQuestions) * 100) : 0;
    
    echo json_encode([
        'success' => true,
        'message' => 'Test submitted successfully',
        'totalQuestions' => $totalQuestions,
        'duration' => $duration
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>