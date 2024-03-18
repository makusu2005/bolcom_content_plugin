<?php

// Assuming you have a MySQL connection established already
$host = 'es89.siteground.eu';
$dbname = 'dbm0gnmrgx5rpo';
$username = 'uvco1p1rfwej2';
$password = 'czsagnkcmnkl';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    function is_token_expired($token_valid) {
        $current_time = new DateTime();
        $token_valid_time = new DateTime($token_valid);
        return $current_time > $token_valid_time;
    }

    function connect_bolcom_api() {
        global $pdo, $token, $token_valid;

        error_log("getting new token");

        $client_id = 'd9432a23-04ed-469f-9c9f-f63a088f3724';
        $client_secret = 'mlTeWJyelTC2Zq2qJxhppMVODw7qLg57NH@0HJpO)IB@Cp1nkIBryl6DGK(?Pb9W';

        try {
            // Check if token is expired
            $stmt = $pdo->prepare("SELECT token, updated FROM att_token WHERE client_id = :client_id");
            $stmt->bindParam(':client_id', $client_id);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row && is_token_expired($row['updated'])) {
                // Token is expired, retrieve a new one
                error_log("getting new token bol.com");

                $url = "https://login.bol.com/token?grant_type=client_credentials&client_id=" . $client_id . "&client_secret=" . $client_secret;
                $payload = [];

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($payload));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 5);

                $response = curl_exec($ch);
                curl_close($ch);

                $json_response = json_decode($response, true);
                $token = $json_response['access_token'];

                $token_valid = date('Y-m-d H:i:s', strtotime('+275 seconds'));

                // Update or insert token into the table
                $stmt = $pdo->prepare("INSERT INTO att_token (client_id, token, updated) VALUES (:client_id, :token, :updated) ON DUPLICATE KEY UPDATE token = :token, updated = :updated");
                $stmt->bindParam(':client_id', $client_id);
                $stmt->bindParam(':token', $token);
                $stmt->bindParam(':updated', $token_valid);
                $stmt->execute();

                error_log("got token, return");
            } else {
                // Token is not expired, use the existing token
                $token = $row['token'];
                $token_valid = $row['updated'];
                error_log($token);
                error_log("using existing token");
            }

            return;
        } catch (Exception $e) {
            error_log("something wrong with requesting token");
            error_log($e);
        }
    }

    connect_bolcom_api();
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

?>
