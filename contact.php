<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection
    $conn = new mysqli('localhost', 'root', '', 'leaselink');
    if ($conn->connect_error) {
        echo "$conn->connect_error";
        die("Connection Failed : " . $conn->connect_error);
    }

    $username = $_POST['username'];
    $title = $_POST['title'];
    $description = $_POST['description'];

    // Prepare and bind the SQL statement
    $stmt = $conn->prepare("INSERT INTO issues (username, title, description) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $title, $description);

    // Execute the statement
    if ($stmt->execute()) {
        echo "Thank you for contacting us, $username. We'll get back to you soon!";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}
?>