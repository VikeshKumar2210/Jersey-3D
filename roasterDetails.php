<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jog 3D Configurator (Roster Details)</title>


    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="style/root.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="icon" type="image/x-icon" href="images/jogLogo2.png">
    <link href="https://fonts.googleapis.com/css2?family=Bella:wght@400;700&display=swap" rel="stylesheet">


</head>

<?php
$frontImage = $_POST['frontImage'] ?? '';
$backImage = $_POST['backImage'] ?? '';
$leftImage = $_POST['leftImage'] ?? '';
$rightImage = $_POST['rightImage'] ?? '';
$svgFile =  $_POST['svgFile'];     // base64 SVG string
$epsFile =  $_POST['epsFile'];

$uploadDir = __DIR__ . '/uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true); // Create it recursively with full permissions
}

// Save SVG file
if (!empty($_POST['svgFile'])) {
    file_put_contents($uploadDir . 'design.svg', base64_decode($_POST['svgFile']));
}

// Save EPS file
if (!empty($_POST['epsFile'])) {
    file_put_contents($uploadDir . 'design.eps', base64_decode($_POST['epsFile']));
}

if (isset($_POST['logoImage'])) {
    $base64 = $_POST['logoImage'];

    // Optional: decode and save the file
    $data = explode(',', $base64);
    if (count($data) === 2) {
        $imageData = base64_decode($data[1]);
        file_put_contents('uploads/user-logo.png', $imageData);
    }
}

?>

<body>
    <!-----------------------------
    HEADER_MAIN
     ------------------------------->
    <div class="Header" id="mainHeader2">
        <div class="container-fluid">
            <div class="row">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="BrandLogo">
                        <a href="index.php">
                            <figure class="m-0">
                                <img src="images/BrandLogo.png" alt="Company Logo" />
                            </figure>
                        </a>
                    </div>
                    <div class="RightSide d-flex justify-content-between align-items-center">
                        <h6 class="font2 my-auto f14">3D Configurator</h6>
                        <figure class="mx-2 mb-2">
                            <img src="images/3dConf.png" alt="" />
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-----------------------------
    HEADER_MAIN
     ------------------------------->

    <!-----------------------------
    UPPER PAGE HISTORY
     ------------------------------->
    <div class="upperTabsPageHistory">
        <div class="container">
            <div class="row">
                <ul class="flexRow">
                    <li>
                        <a href="index.php" class="activePage flexRow">
                            <figure class="m-0"><img src="images/icons/mdi_football.png" alt=""></figure> CHOOSE SPORT
                            <span></span>
                        </a>
                    </li>
                    <div class="line"></div>
                    <li>
                        <a href="product_type.php" class="activePage flexRow">
                            <figure class="m-0"><img src="images/icons/mdi_football.png" alt=""></figure>
                            PRODUCT TYPE
                            <span></span>
                        </a>
                    </li>
                    <div class="line"></div>
                    <li>
                        <a href="customize.php" class="activePage flexRow">
                            <figure class="m-0"><img src="images/icons/mdi_footballInactive.png" alt=""></figure>
                            CUSTOMIZE
                            <span></span>
                        </a>
                    </li>
                    <div class="line"></div>
                    <li>
                        <a href="roasterDetails.php" class=" activePage flexRow">
                            <figure class="m-0"><img src="images/icons/mdi_footballInactive.png" alt=""></figure> ADD
                            ROSTER
                            DETAIL
                            <span></span>
                        </a>
                    </li>

                </ul>
            </div>
        </div>
    </div>
    <!-----------------------------
    UPPER PAGE HISTORY
     ------------------------------->

    <section class="AddRoasterMAin">
        <div class="container">
            <div class="row">
                <div class="flexRow  justify-content-between ">
                    <div class="head">
                        <h5>Add Roster detail</h5>
                        <p>Please fill the details accordingly</p>
                    </div>
                    <div class="uploadRosterDetails">

                        <div class="flexRow justify-content-end">
                            <a href="assets/rosterDemo/Jog_Sports_Roster_Download.xlsx" download class="btn btn-sm downloadBlue flexRow">
                                <i class="fa fa-cloud-download" aria-hidden="true"></i>
                                <figure class="my-auto">
                                    <img src="images/icons/DownloadWhite.png" alt="" class="icon2">
                                </figure>
                                Download Roster
                            </a>
                            <form id="uploadForm" enctype="multipart/form-data">
                                <input type="file" id="rosterFileInput" name="rosterFile" accept=".xlsx, .xls" style="display: none;">
                                <button type="button" class="btn btn-sm uploadBlue flexRow" onclick="document.getElementById('rosterFileInput').click();">
                                    <figure class="my-auto">
                                        <img src="images/icons/Upload.png" alt="" class="icon2">
                                    </figure>
                                    Upload Roster
                                </button>
                            </form>
                        </div>

                    </div>

                </div>

                <div>


                    <div class="rosterHelperBtn flexRow   justify-content-between ">

                        <div>
                            <button class="textTransform capitalize">Aa</button>
                            <button class="textTransform UpperCase">AA</button>
                            <button class="textTransform lowerCase">aa</button>
                        </div>
                        <button class=" sizeGuard  d-flex " data-toggle="modal" data-target="#roasterSizeChartModal">
                            <figure class="my-auto ">
                                <img src="images/icons/sizeGuide.png" alt="" width="20">
                            </figure>
                            Size Guide
                        </button>
                    </div>

                </div>
                <form action=" #" class="customizedModel">
                    <?php if ($frontImage && $backImage): ?>
                        <div class="row mb-4 allFourAngles">
                            <div class="col-md-3">
                                <h6>Front View:</h6>
                                <img src="<?= htmlspecialchars($frontImage) ?>" style="width:100%; border:1px solid #ccc;">
                            </div>
                            <div class="col-md-3">
                                <h6>Back View:</h6>
                                <img src="<?= htmlspecialchars($backImage) ?>" style="width:100%; border:1px solid #ccc;">
                            </div>
                            <div class="col-md-3">
                                <h6>left View:</h6>
                                <img src="<?= htmlspecialchars($leftImage) ?>" style="width:100%; border:1px solid #ccc;">
                            </div>
                            <div class="col-md-3">
                                <h6>Right View:</h6>
                                <img src="<?= htmlspecialchars($rightImage) ?>" style="width:100%; border:1px solid #ccc;">
                            </div>

                        </div>
                        <div class="row mb-4">
                            <div class="col-md-3" style="width: 206px;">
                                <h6>Design LOGO:</h6>
                                <img src="uploads/user-logo.png" style="width:100%; border:1px solid #ccc;">
                            </div>
                            <div class="col-md-3">
                                <h6>Final SVG:</h6>
                                <img src="uploads/design.svg" style=" width:182px; border:1px solid #ccc;">
                            </div>
                        </div>
                    <?php endif; ?>
                    <table class="table table-bordered table-hover roasterDetailsTable" id="playerTable">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col" class="text-center">No.</th>
                                <th scope="col" style="width: 400px;">Player Name</th>
                                <th scope="col">Size</th>
                                <th scope="col" class="text-center">Jersey No.</th>
                                <th scope="col" class="text-center">Color</th>
                                <th scope="col" class="text-center">Qty</th>
                                <th scope="col" class="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row" class="text-center">1</th>
                                <td class="reflectTransform">John</td>
                                <td>
                                    <select class="w-100 border-none bg-none">
                                        <option value="">M</option>
                                        <option value="">XS</option>
                                        <option value="">M</option>
                                        <option value="">L</option>
                                        <option value="">XL</option>
                                        <option value="">2XL</option>
                                        <option value="">3XL</option>
                                        <option value="">4XL</option>
                                        <option value="">5XL</option>
                                    </select>
                                </td>
                                <td class="text-center">11</td>
                                <td class="text-center">Blue</td>
                                <td class="text-center">1</td>
                                <td class="text-center"><button type="button" class="deleteRowButton"><img
                                            src="images/icons/delete.png" alt="" class="iconImg"> Delete</button></td>
                            </tr>
                            <tr>
                                <th scope="row" class="text-center">2</th>
                                <td class="reflectTransform">Paul</td>
                                <td>
                                    <select class="w-100 border-none bg-none">
                                        <option value="">M</option>
                                        <option value="">XS</option>
                                        <option value="">M</option>
                                        <option value="">L</option>
                                        <option value="">XL</option>
                                        <option value="">2XL</option>
                                        <option value="">3XL</option>
                                        <option value="">4XL</option>
                                        <option value="">5XL</option>
                                    </select>
                                </td>
                                <td class="text-center">15</td>
                                <td class="text-center">Blue</td>
                                <td class="text-center">2</td>
                                <td class="text-center"><button type="button" class="deleteRowButton"><img
                                            src="images/icons/delete.png" alt="" class="iconImg"> Delete</button></td>
                            </tr>
                            <tr>
                                <th scope="row" class="text-center">3</th>
                                <td class="reflectTransform">Smith</td>
                                <td>
                                    <select class="w-100 border-none bg-none">
                                        <option value="">M</option>
                                        <option value="">XS</option>
                                        <option value="">M</option>
                                        <option value="">L</option>
                                        <option value="">XL</option>
                                        <option value="">2XL</option>
                                        <option value="">3XL</option>
                                        <option value="">4XL</option>
                                        <option value="">5XL</option>
                                    </select>
                                </td>
                                <td class="text-center">20</td>
                                <td class="text-center">Blue</td>
                                <td class="text-center">5</td>
                                <td class="text-center"><button type="button" class="deleteRowButton"><img
                                            src="images/icons/delete.png" alt="" class="iconImg"> Delete</button></td>
                            </tr>
                            <tr>
                                <th scope="row" class="text-center">4</th>
                                <td class="reflectTransform">Tame</td>
                                <td>
                                    <select class="w-100 border-none bg-none">
                                        <option value="">M</option>
                                        <option value="">XS</option>
                                        <option value="">M</option>
                                        <option value="">L</option>
                                        <option value="">XL</option>
                                        <option value="">2XL</option>
                                        <option value="">3XL</option>
                                        <option value="">4XL</option>
                                        <option value="">5XL</option>
                                    </select>
                                </td>
                                <td class="text-center">5</td>
                                <td class="text-center">Blue</td>
                                <td class="text-center">5</td>
                                <td class="text-center"><button type="button" class="deleteRowButton"><img
                                            src="images/icons/delete.png" alt="" class="iconImg"> Delete</button></td>
                            </tr>
                            <tr>
                                <th scope="row" class="text-center">5</th>
                                <td class="reflectTransform"><input type="text" id="name" name="name" required class="w-100"></td>
                                <td>
                                    <select class="w-100 border-none bg-none">
                                        <option value="">M</option>
                                        <option value="">XS</option>
                                        <option value="">M</option>
                                        <option value="">L</option>
                                        <option value="">XL</option>
                                        <option value="">2XL</option>
                                        <option value="">3XL</option>
                                        <option value="">4XL</option>
                                        <option value="">5XL</option>
                                    </select>
                                </td>
                                <td class="text-center">11</td>
                                <td class="text-center">Blue</td>
                                <td class="text-center">1</td>
                                <td class="text-center"><button type="button" class="deleteRowButton"><img
                                            src="images/icons/delete.png" alt="" class="iconImg"> Delete</button></td>
                            </tr>
                            <tr class="p-0">
                                <td colspan="7" class="p-0">
                                    <button type="button" class="w-100" id="addRowButton">Add Row <img
                                            src="images/icons/addRowBtn.png" alt="" class="iconImg"> </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="additionItems">
                        <h5>Additional Items</h5>
                        <div class="additionalItemsForm d-flex gap2">
                            <div class="singleItems">
                                <input type="checkbox" id="Matching_Socks" name="Matching_Socks">
                                <label for="Matching_Socks">Matching Socks</label>
                            </div>
                            <div class="singleItems">
                                <input type="checkbox" id="Fight_Strap" name="Fight_Strap">
                                <label for="Fight_Strap">Fight Strap</label>
                            </div>
                        </div>
                    </div>

                    <!-- <button class="w-100 saveButton">Save details & Continue</button> -->
                    <a href="reviewDetails.php" class="w-100 saveButton">Generate PO</a>
                </form>
            </div>
        </div>
    </section>


    <!-----------------------------
     FOOTER_MAIN
     ------------------------------->
    <section class="footer_main">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="grid4">
                        <div class="items">
                            <figure><img src="images/icons/footerLogo.png" alt="" class="brandImg"></figure>
                        </div>
                        <div class="items allSportsNames">
                            <h6 class="footLinksHeading"> SPORT </h6>
                            <div class="links">
                                <div class="grid2">
                                    <a href="#">Hockey</a>
                                    <a href="#">Basketball</a>
                                    <a href="#">Baseball</a>
                                    <a href="#">Volleyball</a>
                                    <a href="#">Track & Field</a>
                                </div>
                                <div class="grid2">
                                    <a href="#">American Football</a>
                                    <a href="#">Football</a>
                                    <a href="#">Lacrosse</a>
                                    <a href="#">Rugby</a>
                                </div>
                            </div>
                        </div>
                        <div class="items spanSocialLinks">
                            <h6 class="footLinksHeading"> SOCIAL MEDIA </h6>
                            <div class="links">
                                <a href="#" class="flexRow mb-2">
                                    <figure class="mb-auto"><img src="images/icons/fb.png" alt="" class="icon1"></figure> Facebook
                                </a>
                                <a href="#" class="flexRow mb-2">
                                    <figure class="my-auto"><img src="images/icons/twitter.png" alt="" class="icon1"></figure> Twitter
                                </a>
                                <a href="#" class="flexRow mb-2">
                                    <figure class="my-auto"><img src="images/icons/isntagram.png" alt="" class="icon1"></figure> Instagram
                                </a>
                            </div>
                        </div>
                        <div class="items spanContact">
                            <h6 class="footLinksHeading"> CONTACT US </h6>
                            <div class="grid2">
                                <div class="links">
                                    <p class="white1">JOG Athletics LLC. (USA) 🇺🇸</p>
                                    <a href="#">501 Silverside Rd, Suite 105-3610 Wilmington DE,USA 19809
                                        Phone: (302) 538 9444
                                        info@jogsports.com</a>
                                </div>
                                <div class="links">
                                    <p class="white1 "> JOG Sports Ltd. (Asia) 🇹🇭 </p>

                                    <a href="">99 Soi Payasurent 35,
                                        Bangchan, Klongsamwa,
                                        Bangkok, Thailand 10510
                                        Phone: (662) 004 7057
                                        info@jogsports.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row FooterBottom">
                    <div class="d-flex justify-content-xl-between">
                        <p class="white1">©2024 JOG Sports. All Rights Reserved.</p>
                        <a href="#" class="white1">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-----------------------------
        FOOTER_MAIN
     ------------------------------->

    <!-- Modal -->
    <div class="modal fade" id="roasterSizeChartModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-body">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <figure class="my-auto"><img src="images/jerseySizeChart.jpg" alt="" class="w-100"></figure>
            </div>

        </div>
    </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery.activity-indicator/1.0.0/jquery.activity-indicator.min.js"
        integrity="sha512-vIgIa++fkxuAQ95xP3yHzA33Z+iwePLCFeeMcIOqmHhTEAvfBoFap1nswEwU/xE/o4oW0putZ6dbY7JS1emkdQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <script>
        document.getElementById('addRowButton').addEventListener('click', function() {
            const tableBody = document.querySelector('#playerTable tbody');
            const rowCount = tableBody.rows.length; // Get the current number of rows

            // Create a new row
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
            <th scope="row" class="text-center">${rowCount}</th>
            <td><input type="text" name="name" required class="w-100"></td>
            <td>
                <select class="w-100 border-none bg-none">
                    <option value="">M</option>
                    <option value="">XS</option>
                    <option value="">M</option>
                    <option value="">L</option>
                    <option value="">XL</option>
                    <option value="">2XL</option>
                    <option value="">3XL</option>
                    <option value="">4XL</option>
                    <option value="">5XL</option>
                </select>
            </td>
            <td class="text-center">11</td>
            <td class="text-center">Blue</td>
            <td class="text-center">1</td>
            <td class="text-center"><button type="button" class="deleteRowButton"><img src="images/icons/delete.png" alt="" class="iconImg"> Delete</button></td>
        `;

            // Insert the new row before the last row (the button row)
            tableBody.insertBefore(newRow, tableBody.lastElementChild);
        });

        // Event delegation for delete buttons
        document.querySelector('#playerTable tbody').addEventListener('click', function(event) {
            if (event.target.closest('.deleteRowButton')) {
                const row = event.target.closest('tr');
                if (row) {
                    row.remove(); // Remove the row
                    updateRowNumbers(); // Update row numbers after deletion
                }
            }
        });

        // Function to update row numbers
        function updateRowNumbers() {
            const rows = document.querySelectorAll('#playerTable tbody tr');
            rows.forEach((row, index) => {
                if (index < rows.length - 1) { // Exclude the button row
                    row.querySelector('th').textContent = index + 1; // Update the row number
                }
            });
        }
    </script>

    <script>
        document.querySelectorAll('.textTransform').forEach(button => {
            button.addEventListener('click', () => {
                const transformType = button.classList.contains('capitalize') ? 'capitalize' :
                    button.classList.contains('UpperCase') ? 'uppercase' :
                    button.classList.contains('lowerCase') ? 'lowercase' : '';

                // Remove previous transform classes from all td
                document.querySelectorAll('.reflectTransform').forEach(td => {
                    td.classList.remove('capitalize', 'uppercase', 'lowercase');
                    if (transformType) {
                        td.classList.add(transformType);
                    }
                });

                // Remove active class from all buttons
                document.querySelectorAll('.textTransform').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Add active class to clicked button
                button.classList.add('active');
            });
        });
    </script>



</body>

</html>