<?php
// Database connection
$conn = new mysqli('localhost', 'root', '', 'leaselink');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch property details from the database
$sql = "SELECT * FROM property";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        // Display property details in card format
        echo '<div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Property img</text></svg>
                  <div class="card-body">
                    <p class="card-text">' . $row["amenities"] . '</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary">Rate</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary">More Info</button>
                      </div>
                      <small class="text-body-secondary">' . $row["price"] . '</small>
                    </div>
                  </div>
                </div>
              </div>';
    }
} else {
    echo "No properties found.";
}

// Close connection
$conn->close();
?>
