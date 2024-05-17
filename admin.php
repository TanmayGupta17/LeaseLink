<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link href="admin.css" rel="stylesheet">
</head>
<body>
    <main>
      <header>
        <a class="logo">LeaseLink</a>
        <div class="nav_items">
            <a href="plisting.html">List/View Property</a>
            <a href="propertypage.html">All Properties</a>
            <a href="index.html">Logout</a>
        </div>
      </header>
        <section class="py-5 text-center container">
          <div class="row py-lg-5">
            <div class="col-lg-6 col-md-8 mx-auto">
              <h1 class="fw-light"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">USER QUERIES</font></font></h1>
              <p class="lead text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Solve querries by entering the solution below along with the problemID.</font></font></p>
              <!-- <p>
                <a href="#" class="btn btn-primary my-2"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">The main call to action</font></font></a>
                <a href="#" class="btn btn-secondary my-2"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Secondary work</font></font></a>
              </p> -->
            </div>
          </div>
        </section>
        <!-- <div id="last">
          <button id="a" onclick="location.href='#'">Advanced Search</button>
        </div> -->

        <div class="album_py-5_bg-body-tertiary">
          <div class="container">
              <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                  <?php
                  // Database connection
                  $conn = new mysqli('localhost', 'root', '', 'leaselink');
                  if ($conn->connect_error) {
                      die("Connection failed: " . $conn->connect_error);
                  }
      
                  // Prepare and execute SQL statement to fetch all issues
                  $sql = "SELECT * FROM issues";
                  $result = $conn->query($sql);
      
                  // Check if any issues are found
                  if ($result->num_rows > 0) {
                      // Loop through each issue and display it
                      while ($row = $result->fetch_assoc()) {
                          echo '<div class="col">';
                          echo '<div class="card shadow-sm">';
                          echo '<svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Issue img</text></svg>';
                          echo '<div class="card-body">';
                          echo '<p class="card-text">' . $row['description'] . '</p>';
                          
                          echo '<div class="d-flex justify-content-between align-items-center">';
                          echo '<div class="btn-group">';
                          echo '<button type="button" class="btn btn-sm btn-outline-secondary">Resolve</button>';
                          echo '</div>';
                          echo '<small class="text-body-secondary">Issue ID: ' . $row['id'] . '</small>';
                          echo '</div>';
                          echo '</div>';
                          echo '</div>';
                          echo '</div>';
                      }
                  } else {
                      echo "No issues found.";
                  }
      
                  // Close result and connection
                  $result->close();
                  $conn->close();
                  ?>
              </div>
          </div>
      </div>
      

        <!-- <div class="album_py-5_bg-body-tertiary">
          <div class="container">
      
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Problem ID</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">BuyerID</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Problem ID</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">BuyerID</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Problem ID</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">BuyerID</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
      
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Problem ID</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">BuyerID</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Problem ID</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">BuyerID</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Problem ID</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">BuyerID</font></font></small>
                    </div>
                  </div>
                </div>
              </div>      
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Problem ID</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">BuyerID</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Problem ID</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">BuyerID</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Problem ID</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">BuyerID</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <div class="payment-container">
        <form id="admin-form" action="updatingissue.php" method="post">
            <label for="card-number">Problem ID:</label>
            <output type="text" id="price" name="price"></output>
            <input type="text" id="Problem_ID" name="Problem_ID" required>
            <label for="expiry-date">Status(Solved/Unsolved):</label>
            <input type="text" id="status" name="status" required>
            <label for="cvv">Description:</label>
            <input type="text" id="cvv" name="solution" required>
            <button type="submit" onclick="location.href='admin.html'">Submit Resolution</button>
        </form>
        </div>
        <footer>made with &hearts; by LeaseLink team</footer>
      </main>
</body>
</html>