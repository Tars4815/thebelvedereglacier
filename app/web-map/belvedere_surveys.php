<?php

include '../.credentials/config.php';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=$sslmode";
    $pdo = new PDO($dsn, $username, $password);
} catch (PDOException $e) {
    die("Error: Could not connect to the database: " . $e->getMessage());
}
// Fetch point data from the database based on the selected year
$year = isset($_GET['year']) ? $_GET['year'] : date('Y'); // Default to current year if not specified
// Construct the SQL query using prepared statements to prevent SQL injection
$query = "SELECT * FROM public.points_measurements WHERE survey_year = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$year]);
$points = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($points);
