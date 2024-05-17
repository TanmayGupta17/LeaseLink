<?php
// Start session
session_start();

// Check if username is set in session
if (!isset($_SESSION['username'])) {
    // Redirect user to login page if username is not set
    header("Location: login.php");
    exit();
}

// Establish database connection
$conn = new mysqli('localhost', 'root', '', 'leaselink');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve form data
$propertyId = $_POST['propertyid'];
$sellerId = $_POST['sellerid'];
$price = $_POST['price'];

// Retrieve username from session
$username = $_SESSION['username'];

// Insert data into transaction table
$sql = "INSERT INTO transaction (sellerid, buyerid, propertyid, amount) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssd", $sellerId, $username, $propertyId, $price);

if ($stmt->execute()) {
    echo "Payment successful. Transaction details added to the database.";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
