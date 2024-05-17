<?php
// Establish database connection
$conn = new mysqli('localhost', 'root', '', 'leaselink');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Execute the stored procedure
$sql = "CALL GetAllSellersWithMaxTransactions()";
$result = $conn->query($sql);

// Process the result (fetch data, display, etc.)
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Process each row of data
        $sellerId = $row['sellerid'];
        $propertyName = $row['property_name'];
        $price = $row['price'];

        // Perform any processing or manipulation of the data
        // For example, you can echo the data or store it in an array for further use
        echo "Seller ID: $sellerId, Property Name: $propertyName, Price: $price<br>";
    }
} else {
    echo "No results found.";
}

// Close the database connection
$conn->close();
?>
