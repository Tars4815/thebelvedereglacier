<?php

include '../../.credentials/config.php';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=$sslmode";
    $pdo = new PDO($dsn, $username, $password);
} catch (PDOException $e) {
    die("Error: Could not connect to the database: " . $e->getMessage());
}

// Check if the 'pointLabel' parameter is set in the URL
if (isset($_GET['pointLabel'])) {
    // Get the value of the 'pointLabel' parameter
    $pointLabel = $_GET['pointLabel'];

    // Construct the SQL query using prepared statements to prevent SQL injection
    $query = "SELECT survey_date, d_mod FROM public.measurements_calculation WHERE point_label = 'D01''";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$pointLabel]);
    $displacementData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check if displacement data was fetched successfully
    if ($displacementData) {
        // Return the displacement data as JSON
        header('Content-Type: application/json');
        echo json_encode($displacementData);
    } else {
        // If no displacement data found for the given point label, return an empty array
        header('Content-Type: application/json');
        echo json_encode(array("message" => "No displacement data found for the given point label."));
    }
} else {
    // If 'pointLabel' parameter is not set, return an error message
    http_response_code(400); // Bad Request
    echo json_encode(array("message" => "Error: 'pointLabel' parameter is missing."));
}
?>
