<?php
// Database connection
$conn = new mysqli('localhost', 'root', '', 'leaselink');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve input data
    $property_id = $_POST['property_id'];
    $rate = $_POST['rate'];
    $description = $_POST['description'];
    
    // Prepare and execute SQL statement to insert data into the database
    $stmt = $conn->prepare("INSERT INTO rating (propertyid, rate, description) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $property_id, $rate, $description);
    
    if ($stmt->execute() === TRUE) {
        echo "Rating recorded successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close statement
    $stmt->close();
}

// Close connection
$conn->close();
?>
