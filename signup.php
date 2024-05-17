<?php
// Function to validate email address


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['userType'])) {
        $userType = $_POST['userType'];
        $username = $_POST['username'];
        $aadharID = $_POST['aadharID'];
        $Pan_no = $_POST['Pan_no'];
        $email = $_POST['email'];
        $PhoneNo = $_POST['PhoneNo'];
        $password = $_POST['password'];

        // Validate email address
        if (!validateEmail($email)) {
            echo "Invalid email address!";
            exit; // Stop execution if email is invalid
        }

        // Database connection
        $conn = new mysqli('localhost', 'root', '', 'leaselink');
        if ($conn->connect_error) {
            echo "$conn->connect_error";
            die("Connection Failed : " . $conn->connect_error);
        } else {
            if ($userType == 'buyer') {
                $stmt = $conn->prepare("INSERT INTO buyer (username, aadharID, Pan_no, Email, PhoneNo, password) VALUES (?, ?, ?, ?, ?, ?)");
            } elseif ($userType == 'seller') {
                $stmt = $conn->prepare("INSERT INTO seller (username, aadharID, Pan_no, Email, PhoneNo, password) VALUES (?, ?, ?, ?, ?, ?)");
            }

            if (isset($stmt)) { // Check if $stmt is set before using it
                $stmt->bind_param("sissis", $username, $aadharID, $Pan_no, $email, $PhoneNo, $password);
                $execval = $stmt->execute();
                if ($execval) {
                    echo "Registration successfully...";
                } else {
                    echo "Error in registration: " . $conn->error;
                }
                $stmt->close();
            } else {
                echo "Error in preparing statement: " . $conn->error;
            }

            $conn->close();
        }
    } else {
        echo "User type not selected!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="signupstyle.css">
</head>
<body>
    <div class="option">
        <p>Are you a Buyer or a Seller?<p>
        <div class="radio">
            <input type="radio" name="userType" value="buyer" checked >Buyer
            <input type="radio" name="userType" value="seller">Seller
        </div>
    </div>
    <div class="wrapper">
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
            <h1>SIGN UP</h1>
            <div class="input">
                <input type="text" placeholder="username" name="username">
            </div>
            <div class="input">
                <input type="text" placeholder="adhaarID" name="aadharID">
            </div>
            <div class="input">
                <input type="text" placeholder="Pan no." name="Pan_no">
            </div>
            <div class="input">
                <input type="text" placeholder="Email" name="email">
            </div>
            <div class="input">
                <input type="text" placeholder="Phone no." name="PhoneNo">
            </div>
            <div class="input">
                <input type="password" placeholder="password" name="password">
            </div>

            <button type="submit" class="btn btn-primary">
                Sign Up
            </button>
            <div class="signup">
                <p>aldready have an account?<a href="login.html">Login</a></p>
            </div>
        </form>
    </div>
</div>  
</body>
</html>
