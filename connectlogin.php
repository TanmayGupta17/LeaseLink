<?php
session_start(); // Start session to persist user login status

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection
    $conn = new mysqli('localhost', 'root', '', 'leaselink');
    if ($conn->connect_error) {
        echo "$conn->connect_error";
        die("Connection Failed : " . $conn->connect_error);
    } else {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Query to check user credentials
        $sql = "SELECT * FROM buyer WHERE username='$username' AND password='$password'";
        $result = $conn->query($sql);

        if ($result->num_rows == 1) {
            // User found, set session variable and redirect
            $_SESSION['username'] = $username;
            header("Location:propertypage2.php"); // Redirect to dashboard after successful login
        } else {
            echo "Invalid username or password!";
        }
        $conn->close();
    }
}
?>