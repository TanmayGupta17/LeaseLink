<?php
session_start(); // Start the session

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['userType'])) {
        $userType = $_POST['userType'];
        $username = $_POST['username']; // Get the username

        // Other user details...
        $aadharID = $_POST['aadharID'];
        $Pan_no = $_POST['Pan_no'];
        $email = $_POST['email'];
        $PhoneNo = $_POST['PhoneNo'];
        $password = $_POST['password'];

        // Database connection
        $conn = new mysqli('localhost', 'root', '', 'leaselink');
        if ($conn->connect_error) {
            echo "$conn->connect_error";
            die("Connection Failed : " . $conn->connect_error);
        } else {
            if ($userType == 'buyer' || $userType == 'seller') {
                $table = $userType; // Table name based on user type
                $stmt = $conn->prepare("INSERT INTO $table (username, aadharID, Pan_no, Email, PhoneNo, password) VALUES (?, ?, ?, ?, ?, ?)");
                if ($stmt) {
                    $stmt->bind_param("sissis", $username, $aadharID, $Pan_no, $email, $PhoneNo, $password);
                    $execval = $stmt->execute();
                    if ($execval) {
                        // Store the username in session
                        $_SESSION['username'] = $username;

                        // Redirect to property page after successful registration
                        header("Location: propertypage2.php");
                        exit(); // Ensure script stops here to prevent further execution
                    } else {
                        echo "Error in registration: " . $conn->error;
                    }
                    $stmt->close();
                } else {
                    echo "Error in preparing statement: " . $conn->error;
                }
            } else {
                echo "Invalid user type!";
            }
            $conn->close();
        }
    } else {
        echo "User type not selected!";
    }
}
?>
