<?php
// Database connection
session_start();
$conn = new mysqli('localhost', 'root', '', 'leaselink');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve property details from the form
    $bhk = $_POST['BHK'];
    $amenities = $_POST['amenities'];
    $price = $_POST['price'];
    $fullAddress = $_POST['address'];
    $postalCode = $_POST['postal_code'];
    $sellerid = $_SESSION['username'];

    // Prepare and bind the SQL statement
    $stmt = $conn->prepare("INSERT INTO property (username, bhk, amenities, price, address, postalcode) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sisiss", $sellerid, $bhk, $amenities, $price, $fullAddress, $postalCode);

    // Execute the statement
    if ($stmt->execute()) {
        // Redirect to property listing page after successful insertion
        header("Location: propertypage.php");
        exit(); // Ensure script stops here to prevent further execution
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}
?>
