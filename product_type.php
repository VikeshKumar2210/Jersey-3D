<!DOCTYPE html>
<html lang="en">
<?php
include('db.php');
if (isset($_GET['cat'])) {
    $cat = $_GET['cat'];
}
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="icon" type="image/x-icon" href="images/jogLogo2.png">



    <style>
        /*------------------------------
            ALL_MAIN_PRODUCTS STARTS
        -------------------------*/

        .AllMainProducts {
            padding: 50px 50px 80px 50px;
            background: url('./images/AllProducts/productMainbg.png');
            background-repeat: repeat;
            background-size: auto;
            background-repeat: no-repeat;
            background-size: cover;
            margin: auto;
        }

        .AllMainProducts .container {
            max-width: 80%;
        }

        .AllMainProducts .AllProductsItems .card {
            border: 1px solid #DDDDDD;
            text-align: center;
            overflow: hidden;
            min-height: 270px;
            max-height: 270px;
        }


        .AllMainProducts .head {
            padding: 0 0 30px 0;
        }

        .AllMainProducts .productContent {
            padding: 2vw 0.4vw;
            color: var(--white1);
            background: var(--white1);
            transition: .5s ease;
            position: absolute;
            bottom: 0;
            width: 100%;
            transform: translateY(60px);
            border-top: 1px solid #DDDDDD5E;
            border-radius: 20px 20px 0 0;
            min-height: 150px;
            box-shadow: rgba(0, 0, 0, 0.06) 0px 3px 8px;
        }


        .AllMainProducts .AllProductsItems img {
            width: 150px;
            transition: .5s ease;
            min-height: 200px;
            object-fit: cover;
            max-height: 200px;

        }

        .AllMainProducts .productTitle {
            color: #313131;
            font-size: var(--f14);
            font-family: var(--font2);
        }

        .AllMainProducts .productDesc {
            font-size: var(--f13);
        }

        .AllMainProducts .card:hover .productContent {
            transform: translateY(20px);
            transition: .5s ease;
        }

        .AllMainProducts .card:hover img {
            transform: scale(0.9);
            margin-top: -5px;
        }

        .AllMainProducts .card:hover figure {
            background: #2F50A3;
            margin-bottom: 0;
        }

        .AllMainProducts .card:hover .productDesc {
            color: var(--black1);
        }

        .AllMainProducts .card:hover .productTitle {
            transition: .5s ease;
        }

        /*------------------------------
            ALL_MAIN_PRODUCTS STARTS
        -------------------------*/
    </style>
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
    ALL_MAIN_PRODUCT_CAT STARTS
     ------------------------------->
    <section class="AllMainProducts selectModel">
        <div class="container">
            <div class="row">
                <div class="sectionHeader  ">
                    <h6 class="f12 font2"> Product Type</h6>
                    <h2 class="sectionTitle">HOCKEY</h2>
                </div>
            </div>
            <div class="AllProductsItems">
                <div class="grid4 gap4">
                    <?php
                    $sql_select = "SELECT 
                                        subcategories.id AS id,
                                        subcategories.name AS name,
                                        subcategories.image AS image,
                                        subcategories.description AS description,
                                        subcategories.insert_date AS insert_date,
                                        subcategories.updated_date AS updated_date,
                                        categories.name AS category_name,
                                        categories.id AS category_id
                                    FROM 
                                        subcategories
                                    JOIN 
                                        categories ON subcategories.category_id = categories.id  
                                    WHERE                                 
                                        categories.id= $cat
                                    ORDER BY 
                                        subcategories.id ASC";

                    $rs_select = $conn->query($sql_select);
                    while ($row_s_user = $rs_select->fetch_assoc()) {
                    ?>
                        <a href="customize.php?cat=<?php echo $row_s_user['category_id']; ?>&subcat=<?php echo $row_s_user['id']; ?>" class="card models" data-model="fullSleeves">
                            <figure>
                                <img src="admin/uploads/<?php echo $row_s_user['image']; ?>" alt="">
                            </figure>
                            <div class="productContent">
                                <h6 class="productTitle text-center"><?php echo $row_s_user['name']; ?></h6>
                                <p class="productDesc"><?php echo $row_s_user['description']; ?> </p>
                            </div>
                        </a>
                    <?php
                    }
                    ?>



                </div>
            </div>
        </div>
    </section>
    <!-----------------------------
    ALL_MAIN_PRODUCT_CAT ENDS
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

    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery.activity-indicator/1.0.0/jquery.activity-indicator.min.js"
        integrity="sha512-vIgIa++fkxuAQ95xP3yHzA33Z+iwePLCFeeMcIOqmHhTEAvfBoFap1nswEwU/xE/o4oW0putZ6dbY7JS1emkdQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="js/useful.js"></script>
</body>

</html>