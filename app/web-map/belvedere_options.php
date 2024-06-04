<?php

try {
  // Access database connection details from environment variables
  $DBHOST = getenv('DBHOST');
  $DBPORT = getenv('DBPORT');
  $DBNAME = getenv('DBNAME');
  $DBUSERNAME = getenv('DBUSERNAME');
  $DBPASSWORD = getenv('DBPASSWORD');
  $DBSSLMODE = getenv('DBSSLMODE');

  // Build the PDO connection string
  $dsn = "pgsql:host=$DBHOST;port=$DBPORT;dbname=$DBNAME;sslmode=$DBSSLMODE";

  // Create the PDO connection
  $pdo = new PDO($dsn, $DBUSERNAME, $DBPASSWORD);
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
