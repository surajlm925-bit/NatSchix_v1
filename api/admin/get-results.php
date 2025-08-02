<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
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
        SELECT 
            r.email,
            r.first_name,
            r.last_name,
            tr.test_time,
            tr.subject,
            tr.score,
            tr.duration_seconds,
            tr.created_at
        FROM test_results tr
        JOIN registrations r ON tr.email = r.email
        ORDER BY tr.test_time DESC, tr.email, tr.subject
    ");
    
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Group results by user and test session
    $groupedResults = [];
    foreach ($results as $result) {
        $key = $result['email'] . '_' . $result['test_time'];
        if (!isset($groupedResults[$key])) {
            $groupedResults[$key] = [
                'email' => $result['email'],
                'name' => $result['first_name'] . ' ' . $result['last_name'],
                'testDate' => date('Y-m-d', strtotime($result['test_time'])),
                'duration' => round($result['duration_seconds'] / 60) . ' min',
                'subjects' => []
            ];
        }
        $groupedResults[$key]['subjects'][$result['subject']] = $result['score'];
    }
    
    // Calculate overall scores
    $finalResults = [];
    foreach ($groupedResults as $result) {
        $totalScore = 0;
        $subjectCount = count($result['subjects']);
        
        foreach ($result['subjects'] as $score) {
            $totalScore += $score;
        }
        
        $result['totalScore'] = $subjectCount > 0 ? round($totalScore / $subjectCount) : 0;
        $finalResults[] = $result;
    }
    
    echo json_encode(['success' => true, 'results' => $finalResults]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>