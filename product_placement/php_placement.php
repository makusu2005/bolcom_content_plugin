<?php

$token = '';
$token_valid = new DateTime();
$token_valid->sub(new DateInterval('PT5000S'));

function db_connect() {
    $host = 'localhost';
    $dbname = 'dbm0gnmrgx5rpo';
    $username = 'uvco1p1rfwej2';
    $password = 'czsagnkcmnkl';
    $connecting = true;
    $failed = 0;
    while ($connecting) {
        try {
            $conn = new mysqli('localhost', $username, $password, $dbname);
            if ($conn->connect_error) {
                throw new Exception($conn->connect_error);
            }
            return $conn;

        } catch (Exception $e) {
            error_log($e);
            $failed++;
            error_log("failed to connect, stop");
            exit();
        }
    }
}


// Sanitize input data
function sanitizeInput($input) {
    return htmlspecialchars(trim($input));
}

function token_online() {
    global $token;
    try {
        $conn = db_connect();
        $query = "SELECT access_token FROM att_token";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $access_token = $row['access_token'];
            $token = $access_token;
        } else {
            echo "Token not found";
        }
    } catch (Exception $e) {
        echo "Database Error: " . $e->getMessage();
    } finally {
        if ($conn->ping()) {
            $conn->close();
        }
    }
}

function get_position_bol($cat_id, $target_ean) {
    global $token;
    $page = 1;
    $found_index = null;
    $spot = 1;
    while ($page < 20) {
        $url = "https://api.bol.com/retailer/products/list";
        $data = array(
            "countryCode" => "NL",
            "categoryId" => $cat_id,
            "sort" => "RELEVANCE",
            "page" => $page
        );

        $headers = array(
            'Accept: application/vnd.retailer.v10+json',
            'Authorization: Bearer ' . $token,
            'Content-Type: application/vnd.retailer.v10+json',
            'Accept-Language: nl-NL'
        );

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

        if ($response === false) {
            echo "cURL error: " . curl_error($curl);
            break;
        }

        $data = json_decode($response, true);

        if (empty($data)) {
            echo "data is empty";
            break;
        }


        foreach ($data["products"] as $index => $product) {
            foreach ($product["eans"] as $ean_item) {
                $spot++;
                if ($ean_item["ean"] == $target_ean) {
                    $found_index = $index + 1;
                    break 2; // Break out of both loops
                }
            }
        }

        if ($found_index !== null) {
            echo $spot;
            return array($target_ean, $spot, $cat_id);
        } else {
            $page++;
            //echo "page $page <br />";
                    if ($page == 19)
        {
            $spot = ">500";
            echo $spot;
            return array($target_ean, $spot, $cat_id);

        }

        }

        curl_close($curl);
    }
}

function findLowestSubcategory_n($subcategory) {
    if (isset($subcategory['subcategories']) && !empty($subcategory['subcategories'])) {
        return findLowestSubcategory_n($subcategory['subcategories'][0]);
    }
    return $subcategory;
}



function get_placement_bol($product_ean) {
    global $token;
    $curl = curl_init();
    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://api.bol.com/retailer/products/' . $product_ean . '/placement',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'GET',
      CURLOPT_HTTPHEADER => array(
        'Accept: application/vnd.retailer.v10+json',
        'Authorization' => 'Authorization: Bearer ' . $token,
        'Accept-Language: nl'
    ),
  ));

    $data = curl_exec($curl);

    curl_close($curl);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if (empty($data)) {
        error_log("data is empty");
    }
    if (!empty($data)) {
        $categoryInfo = array();
        $data = json_decode($data, true);

        foreach ($data['categories'] as $category) {
            $lowestSubcategory = findLowestSubcategory_n($category);
            $categoryInfo[] = $lowestSubcategory;

        }


        foreach ($categoryInfo as $info) {
            echo "Category ID: " . $info['id'] . "<br>";
            echo "Category Name: " . $info['name'] . "<br>";
            $placementData = get_position_bol($info['id'],$product_ean,$info['name']); // Call get_placement_bol() here
            if (is_array($placementData) && count($placementData) == 4) {
                list($target_ean, $spot, $cat_name, $cat_id) = $placementData;
            }
            return array($target_ean, $spot, $cat_name, $cat_id);;
        }

    }
}



// Insert data into database
function insertData($ean, $category, $spot) {
    // Create a database connection
    $conn = db_connect(); // Assuming you have a db_connect() function

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    // Check connection
    if (!$conn) {
        die("Database connection failed.");
    }

    // Prepare and bind the statement
    $stmt = $conn->prepare("INSERT INTO att_plugineans (ean, category, position) VALUES (?, ?, ?)");
    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("sss", $ean, $category, $spot);

    if (!$stmt->execute()) {
        echo "Error: " . $stmt->error;
    }

    // Close the statement and database connection
    $stmt->close();
    $conn->close();
}

// Handle parameters and call insertData function
function handleParameters() {
    global $token;
    if (isset($_GET['ean']) && isset($_GET['category'])) {
        $ean = sanitizeInput($_GET['ean']);
        $category = sanitizeInput($_GET['category']);
        token_online();
        $placementData = get_position_bol($category, $ean); // Call get_placement_bol() here
        if (is_array($placementData) && count($placementData) == 3) {
            list($target_ean, $spot, $cat_id) = $placementData;
        }
        insertData($ean, $cat_id, $spot);
    } else {
        echo "Missing or invalid parameters.";
    }
}

handleParameters();
