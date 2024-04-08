<?php

include '../../.credentials/config.php';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=$sslmode";
    $pdo = new PDO($dsn, $username, $password);
} catch (PDOException $e) {
    die("Error: Could not connect to the database: " . $e->getMessage());
}

// Fetch unique survey years from the database
$query = "SELECT DISTINCT survey_year FROM public.points_measurements ORDER BY survey_year ASC";
$stmt = $pdo->prepare($query);
$stmt->execute();
$years = $stmt->fetchAll(PDO::FETCH_COLUMN);

// Return the years as JSON
header('Content-Type: application/json');
echo json_encode($years);

