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

// Fetch point data from the database based on the selected year
$year = isset($_GET['year']) ? $_GET['year'] : date('Y'); // Default to current year if not specified
// Construct the SQL query using prepared statements to prevent SQL injection
$query = "SELECT * FROM public.points_measurements WHERE is_fixed = FALSE AND survey_year = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$year]);
$points = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($points);
