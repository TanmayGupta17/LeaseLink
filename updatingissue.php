<?php
// Database connection
$conn = new mysqli('localhost', 'root', '', 'leaselink');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $problem_id = $_POST['Problem_ID'];
    $status = $_POST['status'];
    $solution = $_POST['solution'];

    // Prepare and execute SQL statement to update issue
    $sql_update = "UPDATE issues SET status=?, solution=? WHERE id=?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("ssi", $status, $solution, $problem_id);
    
    if ($stmt_update->execute()) {
        echo "Issue updated successfully.";
    } else {
        echo "Error updating issue: " . $conn->error;
    }

    // Close statement
    $stmt_update->close();
}

// Close connection
$conn->close();
?>
