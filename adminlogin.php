<?php
session_start(); // Start session to persist admin login status

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection
    $conn = new mysqli('localhost', 'root', '', 'leaselink');
    if ($conn->connect_error) {
        echo "$conn->connect_error";
        die("Connection Failed : " . $conn->connect_error);
    } else {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Query to check admin credentials
        $sql = "SELECT * FROM admin WHERE username='$username' AND password='$password'";
        $result = $conn->query($sql);

        if ($result->num_rows == 1) {
            // Admin found, set session variable and redirect
            // $_SESSION['admin_username'] = $username;
            header("Location: admin.php"); // Redirect to admin dashboard after successful login
            //exit(); // Stop further execution
        } else {
            echo "Invalid username or password!";
        }
        $conn->close();
    }
}
?>
