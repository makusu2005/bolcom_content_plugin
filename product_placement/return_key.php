<?php
$host = 'es89.siteground.eu';
$dbname = 'dbm0gnmrgx5rpo';
$username = 'uvco1p1rfwej2';
$password = 'czsagnkcmnkl';

try {
    // Connect to the database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

    // Prepare and execute the query
    $query = "SELECT access_token FROM att_token";
    $stmt = $pdo->prepare($query);
    $stmt->execute();

    // Fetch the access_token
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        $access_token = $result['access_token'];
        echo $access_token;
    } else {
        http_response_code(404); // Not Found
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo "Database Error: " . $e->getMessage();
    exit;
}
?>
