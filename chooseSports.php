<!DOCTYPE html>
<html lang="en">
<?php
include('db.php');
?>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jog 3D Configurator</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="style/root.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="icon" type="image/x-icon" href="images/faviconLogo.png">
    <link href="https://fonts.googleapis.com/css2?family=Bella:wght@400;700&display=swap" rel="stylesheet">


</head>

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
                        <a href="chooseSports.php" class="activePage flexRow">
                            <figure class="m-0"><img src="images/icons/mdi_football.png" alt=""></figure> CHOOSE SPORT
                            <span></span>
                        </a>
                    </li>
                    <div class="line"></div>
                    <li>
                        <a href="product_type.php" class="flexRow">
                            <figure class="m-0"><img src="images/icons/mdi_footballInactive.png" alt=""></figure>
                            PRODUCT TYPE
                            <span></span>
                        </a>
                    </li>
                    <div class="line"></div>
                    <li>
                        <a href="customize.php" class="flexRow">
                            <figure class="m-0"><img src="images/icons/mdi_footballInactive.png" alt=""></figure>
                            CUSTOMIZE
                            <span></span>
                        </a>
                    </li>
                    <div class="line"></div>
                    <li>
                        <a href="roasterDetails.php" class="flexRow">
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



    <!-----------------------------
    CHOOSE_SPORTS_MAIN
     ------------------------------->
    <section class="allSports choose_Sports_Main">
        <div class="container">
            <div class="row">
                <div class="col-md-6 m-auto">

                    <div class="sectionHeader  ">
                        <h2 class="sectionTitle f20">Choose Your Sport</h2>
                    </div>
                    <div class="sportsItems grid3 gap4 m-auto">
                        <?php
                        $sql_select = "SELECT * FROM `categories` WHERE 1";
                        $rs_select = $conn->query($sql_select);
                        while ($row_s_user = $rs_select->fetch_assoc()) {
                        ?>
                            <a href="product_type.php?cat=<?php echo $row_s_user['id']; ?>" class="items  ">
                                <figure class="m-0"><img src="admin/uploads/<?php echo $row_s_user['image']; ?>" alt=""></figure>
                                <h5 class="sportsTitle f20"> <?php echo $row_s_user['name']; ?></h5>
                            </a>
                        <?php
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-----------------------------
    CHOOSE_SPORTS_MAIN
     ------------------------------->


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


    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.activity-indicator/1.0.0/jquery.activity-indicator.min.js"
        integrity="sha512-vIgIa++fkxuAQ95xP3yHzA33Z+iwePLCFeeMcIOqmHhTEAvfBoFap1nswEwU/xE/o4oW0putZ6dbY7JS1emkdQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="js/useful.js"></script>

</body>

</html>