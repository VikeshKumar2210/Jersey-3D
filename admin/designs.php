<!DOCTYPE html>
<html lang="en">
<?php
include('../db.php');
?>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="apple-touch-icon" sizes="76x76" href="assets/img/apple-icon.png">
  <link rel="icon" type="image/png" href="assets/img/favicon.png">
  <title>
    Material Dashboard 3 by Creative Tim
  </title>
  <!--     Fonts and icons     -->
  <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700,900" />
  <!-- Nucleo Icons -->
  <link href="assets/css/nucleo-icons.css" rel="stylesheet" />
  <link href="assets/css/nucleo-svg.css" rel="stylesheet" />
  <!-- Font Awesome Icons -->
  <script src="https://kit.fontawesome.com/42d5adcbca.js" crossorigin="anonymous"></script>
  <!-- Material Icons -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
  <!-- CSS Files -->
  <link id="pagestyle" href="assets/css/material-dashboard.css?v=3.2.0" rel="stylesheet" />
</head>

<body class="g-sidenav-show  bg-gray-100">
  <aside class="sidenav navbar navbar-vertical navbar-expand-xs border-radius-lg fixed-start ms-2  bg-white my-2" id="sidenav-main">
    <div class="sidenav-header">
      <i class="fas fa-times p-3 cursor-pointer text-dark opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
      <a class="navbar-brand px-4 py-3 m-0" href=" https://demos.creative-tim.com/material-dashboard/pages/dashboard " target="_blank">
        <img src="assets/img/logo-ct-dark.png" class="navbar-brand-img" width="26" height="26" alt="main_logo">
        <span class="ms-1 text-sm text-dark">Creative Tim</span>
      </a>
    </div>
    <hr class="horizontal dark mt-0 mb-2">
    <?php
        include 'sidebar.php';
    ?>
    <div class="sidenav-footer position-absolute w-100 bottom-0 ">
      <div class="mx-3">
        <a class="btn btn-outline-dark mt-4 w-100" href="https://www.creative-tim.com/learning-lab/bootstrap/overview/material-dashboard?ref=sidebarfree" type="button">Documentation</a>
        <a class="btn bg-gradient-dark w-100" href="https://www.creative-tim.com/product/material-dashboard-pro?ref=sidebarfree" type="button">Upgrade to pro</a>
      </div>
    </div>
  </aside>
  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
    <!-- Navbar -->
    <?php include 'navbar.php';  ?>
    <!-- End Navbar --> 
    <div class="container-fluid py-2">
        <div class="row">
            <div class="col-12">
            <div class="card my-4">
                <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div class="bg-gradient-dark shadow-dark border-radius-lg pt-4 pb-3">
                    <h6 class="text-white text-capitalize ps-3">Designs</h6>
                    <button type="button" class="btn bg-gradient-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Add Designs
                    </button>
                </div>
                </div>
                <div class="card-body px-0 pb-2">
                <div class="table-responsive p-0">
                    <table class="table align-items-center mb-0">
                    <thead>
                        <tr>
                        <th class="text-uppercase">Designs name</th>
                        <th class="text-uppercase text-secondary">Name</th>
                        <th class="text-center text-uppercase">Price</th>
                        <th class="text-center text-uppercase">Modal Type</th>
                        <th class="text-center text-uppercase">Subcategory</th>
                        <th class="text-center text-uppercase">colors</th>
                        <th class="text-center text-uppercase ">Last Update </th>
                        <th class="text-secondary text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                      $sql_select = "SELECT 
                          designs.id AS id,
                          designs.name AS name,
                          designs.image AS image,
                          designs.model AS model,
                          designs.price AS price,
                          designs.modal_type AS modal_type,
                          designs.insert_date AS insert_date,
                          designs.updated_date AS updated_date,
                          subcategories.name AS subcategory_name,
                          GROUP_CONCAT(colors.name ORDER BY colors.name ASC) AS colors
                      FROM 
                          designs
                      JOIN 
                          subcategories ON designs.subcategory_id = subcategories.id
                      LEFT JOIN 
                          design_colors ON designs.id = design_colors.design_id
                      LEFT JOIN 
                          colors ON design_colors.color_id = colors.id
                      GROUP BY 
                          designs.id
                      ORDER BY 
                          designs.insert_date DESC";

                      $rs_select = $conn->query($sql_select);
                      while($row_s_user = $rs_select->fetch_assoc()){
                      ?>
                          <tr>
                              <td>                                    
                                  <div>
                                      <img src="uploads/designs/images/<?php echo $row_s_user['image']; ?>" class="border-radius-lg shadow-sm" width="100px" alt="design image">
                                  </div>                                                                        
                              </td>
                              <td>
                                  <h6 class="mb-0 text-sm"><?php echo $row_s_user['name']; ?></h6>
                              </td>
                              <td class="align-middle text-center text-sm">
                                  <span class="badge badge-sm bg-gradient-success">$ <?php echo $row_s_user['price']; ?></span>
                              </td>
                              <td class="align-middle text-center text-sm">
                                  <h6 class="mb-0 text-sm"><?php echo $row_s_user['modal_type']; ?></h6>
                              </td>
                              <td>
                                  <h6 class="mb-0 text-sm text-center"><?php echo $row_s_user['subcategory_name']; ?></h6>
                              </td>
                              <td class="align-middle text-center ">
                                <div class="d-flex">
                                  <?php
                                  if(!empty($row_s_user['colors'])){
                                    $colordata = explode(",",$row_s_user['colors']); 
                                    foreach ($colordata as $key => $color) {
                                      echo "<div class='palette whiteSmoke' data-color='$color' style='background:$color; width:20px;height: 20px;'></div>";                                      
                                    }
                                  }
                                  ?>
                                </div>                                  
                              </td>
                              <td class="align-middle text-center">
                                  <span class="text-secondary text-xs font-weight-bold"><?php echo $row_s_user['updated_date']; ?></span>
                              </td>
                              <td class="align-middle text-center">
                                  <button type="button" class="btn bg-gradient-primary" data-bs-toggle="modal" data-bs-target="#editdatamodal" onclick="editModalData(<?php echo $row_s_user['id']; ?>)">
                                      Edit
                                  </button>
                              </td>
                          </tr>
                      <?php
                      }
                      ?>
                      
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
  </main>
  <div class="fixed-plugin">
    <a class="fixed-plugin-button text-dark position-fixed px-3 py-2">
      <i class="material-symbols-rounded py-2">settings</i>
    </a>
    <div class="card shadow-lg">
      <div class="card-header pb-0 pt-3">
        <div class="float-start">
          <h5 class="mt-3 mb-0">Material UI Configurator</h5>
          <p>See our dashboard options.</p>
        </div>
        <div class="float-end mt-4">
          <button class="btn btn-link text-dark p-0 fixed-plugin-close-button">
            <i class="material-symbols-rounded">clear</i>
          </button>
        </div>
        <!-- End Toggle Button -->
      </div>
      <hr class="horizontal dark my-1">
      <div class="card-body pt-sm-3 pt-0">
        <!-- Sidebar Backgrounds -->
        <div>
          <h6 class="mb-0">Sidebar Colors</h6>
        </div>
        <a href="javascript:void(0)" class="switch-trigger background-color">
          <div class="badge-colors my-2 text-start">
            <span class="badge filter bg-gradient-primary" data-color="primary" onclick="sidebarColor(this)"></span>
            <span class="badge filter bg-gradient-dark active" data-color="dark" onclick="sidebarColor(this)"></span>
            <span class="badge filter bg-gradient-info" data-color="info" onclick="sidebarColor(this)"></span>
            <span class="badge filter bg-gradient-success" data-color="success" onclick="sidebarColor(this)"></span>
            <span class="badge filter bg-gradient-warning" data-color="warning" onclick="sidebarColor(this)"></span>
            <span class="badge filter bg-gradient-danger" data-color="danger" onclick="sidebarColor(this)"></span>
          </div>
        </a>
        <!-- Sidenav Type -->
        <div class="mt-3">
          <h6 class="mb-0">Sidenav Type</h6>
          <p class="text-sm">Choose between different sidenav types.</p>
        </div>
        <div class="d-flex">
          <button class="btn bg-gradient-dark px-3 mb-2" data-class="bg-gradient-dark" onclick="sidebarType(this)">Dark</button>
          <button class="btn bg-gradient-dark px-3 mb-2 ms-2" data-class="bg-transparent" onclick="sidebarType(this)">Transparent</button>
          <button class="btn bg-gradient-dark px-3 mb-2  active ms-2" data-class="bg-white" onclick="sidebarType(this)">White</button>
        </div>
        <p class="text-sm d-xl-none d-block mt-2">You can change the sidenav type just on desktop view.</p>
        <!-- Navbar Fixed -->
        <div class="mt-3 d-flex">
          <h6 class="mb-0">Navbar Fixed</h6>
          <div class="form-check form-switch ps-0 ms-auto my-auto">
            <input class="form-check-input mt-1 ms-auto" type="checkbox" id="navbarFixed" onclick="navbarFixed(this)">
          </div>
        </div>
        <hr class="horizontal dark my-3">
        <div class="mt-2 d-flex">
          <h6 class="mb-0">Light / Dark</h6>
          <div class="form-check form-switch ps-0 ms-auto my-auto">
            <input class="form-check-input mt-1 ms-auto" type="checkbox" id="dark-version" onclick="darkMode(this)">
          </div>
        </div>
        <hr class="horizontal dark my-sm-4">
        <a class="btn bg-gradient-info w-100" href="https://www.creative-tim.com/product/material-dashboard-pro">Free Download</a>
        <a class="btn btn-outline-dark w-100" href="https://www.creative-tim.com/learning-lab/bootstrap/overview/material-dashboard">View documentation</a>
        <div class="w-100 text-center">
          <a class="github-button" href="https://github.com/creativetimofficial/material-dashboard" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star creativetimofficial/material-dashboard on GitHub">Star</a>
          <h6 class="mt-3">Thank you for sharing!</h6>
          <a href="https://twitter.com/intent/tweet?text=Check%20Material%20UI%20Dashboard%20made%20by%20%40CreativeTim%20%23webdesign%20%23dashboard%20%23bootstrap5&amp;url=https%3A%2F%2Fwww.creative-tim.com%2Fproduct%2Fsoft-ui-dashboard" class="btn btn-dark mb-0 me-2" target="_blank">
            <i class="fab fa-twitter me-1" aria-hidden="true"></i> Tweet
          </a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=https://www.creative-tim.com/product/material-dashboard" class="btn btn-dark mb-0 me-2" target="_blank">
            <i class="fab fa-facebook-square me-1" aria-hidden="true"></i> Share
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title font-weight-normal" id="exampleModalLabel">Add Category</h5>
            <button type="button" class="btn-close text-dark" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <form action="add_design.php" method="POST" enctype="multipart/form-data">
          <div class="modal-body">
              <!-- Design Name -->
              <div class="input-group input-group-outline my-3">
                  <label class="form-label">Design Name</label>
                  <input type="text" class="form-control" name="name" required>
              </div>

              <!-- Design Image -->
              <div class="input-group input-group-outline my-3">
                  <label class="form-label">Design Image</label>
                  <input type="file" class="form-control" name="image" accept="image/*" required>
              </div>

              <!-- GLB Model -->
              <div class="input-group input-group-outline my-3">
                  <label class="form-label">3D Model (GLB File)</label>
                  <input type="file" class="form-control" name="model" accept=".glb" required>
              </div>

              <!-- Design Price -->
              <div class="input-group input-group-outline my-3">
                  <label class="form-label">Price</label>
                  <input type="number" step="0.01" class="form-control" name="price" required>
              </div>

              <!-- Modal Type -->
              <div class="input-group input-group-static mb-4">
                  <label for="modalType" class="ms-0">Modal Type</label>
                  <select class="form-control" name="modal_type" id="modalType" required>
                      <option value="halfSleeves">Half Sleeves</option>
                      <option value="fullSleeves">Full Sleeves</option>
                      <option value="HockeyDesign1">Hockey Design 1</option>
                  </select>
              </div>

              <!-- Subcategory -->
              <div class="input-group input-group-static mb-4">
                  <label for="subcategory" class="ms-0">Subcategory</label>
                  <select class="form-control" name="subcategory_id" id="subcategory" required>
                      <?php
                      // Fetch subcategories from the database
                      $sql_subcategories = "SELECT * FROM `subcategories`";
                      $result_subcategories = $conn->query($sql_subcategories);
                      while ($row = $result_subcategories->fetch_assoc()) {
                          echo "<option value='{$row['id']}'>{$row['name']}</option>";
                      }
                      ?>
                  </select>
              </div>
              <div class="input-group input-group-static mb-4">
                <label for="colors" class="ms-0">Colors</label>
                <select class="form-control" name="colors[]" id="colors" multiple>
                    <?php
                    // Fetch available colors from the database
                    $sql_colors = "SELECT * FROM `colors`";
                    $result_colors = $conn->query($sql_colors);
                    while ($row = $result_colors->fetch_assoc()) {
                        echo "<option value='{$row['id']}'>{$row['name']}</option>";
                    }
                    ?>
                </select>
            </div>
            <!-- Add Multiple New Colors -->
            <div class="input-group input-group-outline my-3">
                <label class="form-label">Add New Colors</label>
                <input type="text" class="form-control" name="new_colors" placeholder="Enter multiple colors, separated by commas">
            </div>

          </div>

          <div class="modal-footer">
              <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn bg-gradient-primary">Save changes</button>
          </div>
        </form>

    </div>
  </div>
</div>
<div class="modal fade" id="editdatamodal" tabindex="-1" role="dialog" aria-labelledby="editdatamodal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title font-weight-normal" id="exampleModalLabel">Edit <Data></Data></h5>
            <button type="button" class="btn-close text-dark" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <div id="editdata">

        </div>      
    </div>
  </div>
</div>
  <!--   Core JS Files   -->
  <script src="assets/js/core/popper.min.js"></script>
  <script src="assets/js/core/bootstrap.min.js"></script>
  <script src="assets/js/plugins/perfect-scrollbar.min.js"></script>
  <script src="assets/js/plugins/smooth-scrollbar.min.js"></script>
  <script src="assets/js/plugins/chartjs.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" ></script>  
  <script type="text/javascript">
    function editModalData(id) {
      $.ajax({
          type: "POST",
          url: "ajax/design/edit_design.php",
          data: { id: id },
          success: function (response) {
              $('#editdata').html(response); // Populate modal content
              $('#editdatamodal').modal('show'); // Show modal
          },
          error: function () {
              alert("Failed to fetch data. Please try again.");
          }
      });
    }
    $(document).on('submit', '#editDesignForm', function (e) {
        e.preventDefault(); // Prevent default form submission

        let formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "ajax/design/update_design.php", // Endpoint for updating data
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                
                $('#editdatamodal').modal('hide'); // Hide modal
                location.reload(); // Refresh the page or update the table dynamically
            },
            error: function () {
                alert("Failed to update data. Please try again.");
            }
        });
    });
  </script>
  <script>
    var win = navigator.platform.indexOf('Win') > -1;
    if (win && document.querySelector('#sidenav-scrollbar')) {
      var options = {
        damping: '0.5'
      }
      Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
    }
    
  </script>
  <!-- Github buttons -->
  <script async defer src="https://buttons.github.io/buttons.js"></script>
  <!-- Control Center for Material Dashboard: parallax effects, scripts for the example pages etc -->
  <script src="assets/js/material-dashboard.min.js?v=3.2.0"></script>
</body>

</html>