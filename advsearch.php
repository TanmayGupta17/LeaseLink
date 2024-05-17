<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link href="advsearch.css" rel="stylesheet">
</head>
<body>
    <main>
      <header>
        <a class="logo">LeaseLink</a>
        <div class="nav_items">
            <a href="adminlogin.html">Admin Login</a>
            <a href="plisting.html">List/View Property</a>
            <a href="contact.html">Contact</a>
            <a href="index.html">Logout</a>
        </div>
      </header>
        <!-- <section class="py-5 text-center container">
          <div class="row py-lg-5">
            <div class="col-lg-6 col-md-8 mx-auto">
              <h1 class="fw-light"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">START EXPLORING</font></font></h1>
              <p class="lead text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Your Dream Property is just moments away!!</font></font></p>
              <<p>
                <a href="#" class="btn btn-primary my-2"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">The main call to action</font></font></a>
                <a href="#" class="btn btn-secondary my-2"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Secondary work</font></font></a>
              </p> 
            </div>
          </div>
        </section> --->
        <h4>Basic filters</h4>
        <form action="prices.php" method="post"> <!-- Form tag to enclose the filters -->
            <div class="filter-container">
                <div class="filter">
                    <label>Price:</label>
                    <input type="text" placeholder="min" name="min">
                    <input type="text" placeholder="max" name="max">
                </div>
                <input type="submit" class="filter-button" value="Apply Filter"> <!-- Change button to submit input -->
            </div>
        </form>
        <div class="separator"></div>
        
        <form action="cities.php" method="post">
          <div class="filter-container">
              <div class="filter">
                  <label>Location:</label>
                  <input type="text" placeholder="city" name="city">
              </div>
              <input type="submit" class="filter-button" value="Apply Filter">
          </div>
        </form>
        <div class="separator"></div>

        <form action="bhk.php" method="post">
          <div class="filter-container">
              <div class="filter">
                  <label>Rooms:</label>
                  <input type="text" placeholder="bhk" name="bhk">
              </div>
              <input type="submit" class="filter-button" value="Apply Filter">
          </div>
        </form>  
        <div class="separator"></div>
        
        <form action="rater.php" method="post">
          <div class="filter-container">
              <div class="filter">
                  <label>Rating:</label>
                  <input type="text" placeholder="rating" name="rate">
              </div>
              <input type="submit" class="filter-button" value="Apply Filter">
          </div>
        </form>
          <div class="separator"></div>
        <h4>Advanced filters</h4>

        <form action="raterandcity.php" method="post">
          <div class="filter-container">
              <div class="filter">
                  <label>Rating and Location:</label>
                  <input type="text" placeholder="rating" name="rate">
                  <input type="text" placeholder="city" name="city">
              </div>
              <input type="submit" class="filter-button" value="Apply Filter">
          </div>
        </form>
        <div class="separator"></div>

        <form action="priceandaddress.php" method="post">
          <div class="filter-container">
              <div class="filter">
                  <label>Price and location:</label>
                  <input type="text" placeholder="min" name="min">
                  <input type="text" placeholder="city" name="location">
              </div>
              <input type="submit" class="filter-button" value="Apply Filter">
          </div>
        </form>
        <div class="separator"></div>

        <form action="priceandaddress.php" method="post">
        <div class="filter-container">
            <div class="filter">
                <label>Rooms and Price:</label>
                <input type="text" placeholder="bhk" name="bhk">
                <input type="text" placeholder="min" name="min">
            </div>
            <input type="submit" class="filter-button" value="Apply Filter">
        </div>
        </form>
        <div class="separator"></div>
        <form action="sellerdisplay.php" method="post">
        <div class="filter-container">
            <div class="filter">
                <label>Most active Sellers:(based on transactions)</label>
            </div>
            <input type="submit" class="filter-button" value="Apply Filter">
        </div>
        </form>
        <div class="separator"></div>

        <br>
        <br>
        <br>

        <div class="album_py-5_bg-body-tertiary">
          <div class="container">
            
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
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
                          <button type="submit" class="btn btn-sm btn-outline-secondary rate-btn"><a href="rating.html">Rate</a></button>
                            <form action="process_rent.php" method="post">
                              <input type="hidden" name="property_id" value="' . $row["id"] . '">
                              <input type="hidden" name="seller_id" value="' . $row["username"] . '">
                              <input type="hidden" name="price" value="' . $row["price"] . '">
                              
                              <button type="submit" class="btn btn-sm btn-outline-secondary rent-btn"><a href="payment.html">Rent</a></button>
                            </form>
                          </div>
                          <small class="text-body-secondary">₹' . $row["price"] . '</small>
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


              
          </div>

        <!-- <div class="album_py-5_bg-body-tertiary">
          <div class="container">
      
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Property img</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rate</font></font></button>
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rent</font></font></button>
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">9 minutes</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Property img</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rate</font></font></button>
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rent</font></font></button>
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">9 minutes</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Property img</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rate</font></font></button>
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rent</font></font></button>
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">9 minutes</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
      
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Property img</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rate</font></font></button>
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rent</font></font></button>
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">9 minutes</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Property img</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rate</font></font></button>
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rent</font></font></button>
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">9 minutes</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Property img</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rate</font></font></button>
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rent</font></font></button>
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">9 minutes</font></font></small>
                    </div>
                  </div>
                </div>
              </div>      
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Property img</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rate</font></font></button>
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rent</font></font></button>
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">9 minutes</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Property img</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rate</font></font></button>
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rent</font></font></button>
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">9 minutes</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Property img</text></svg>
                  <div class="card-body">
                    <p class="card-text"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">This is a wider card with supporting text below as a natural introduction to additional content. This content is a little longer.</font></font></p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rate</font></font></button>
                        <button type="button" class="btn btn-sm btn-outline-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rent</font></font></button>
                      </div>
                      <small class="text-body-secondary"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">9 minutes</font></font></small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <br>
        <br>
        <br>
        <footer>made with &hearts; by LeaseLink team</footer>
      </main>
      
</body>
</html>