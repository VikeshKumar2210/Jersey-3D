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

    <!-- Slick CSS -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" />

    <!-- Slick Theme (optional) -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css" />

</head>

<body>

    <button id="scrollToTopBtn" title="Go to top">↑</button>

    <!-----------------------------
    HEADER_MAIN
     ------------------------------->
    <div class="Header header2" id="mainHeader">
        <div class="container">
            <div class="row">
                <div class="header2Nav grid3">
                    <div class="BrandLogo">
                        <a href="index.php">
                            <figure class="m-0">
                                <img src="images/BrandLogo.png" alt="Company Logo" />
                            </figure>
                        </a>
                    </div>
                    <div class="allPages navLinks">
                        <a href="#builder">Builder</a>
                        <a href="#collection">Collection</a>
                        <a href="#highlights">Highlights</a>
                        <a href="#whyCustom">Why Custom?</a>
                        <a href="#benefits">Benefits</a>
                        <a href="#process">Process</a>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>

    <!-----------------------------
    HEADER_MAIN
     ------------------------------->


    <!-----------------------------
    HOME BANNER
     ------------------------------->
    <section class="homeBanner">
        <div class="container h-100">
            <div class="row h-100">
                <div class="col-md-6 h-100">
                    <div class="bannerContent">
                        <h2 class="bannerTitle">Welcome to Your Team’s New Era of Customization </h2>
                        <p>Step into a seamless journey of designing performance-driven, identity-rich sportswear. </p>
                        <div class="d-inline-flex" id="builder">
                            <a href="chooseSports.php" class="defBtnStyle font2 gap2">
                                3D Configurator
                                <figure class="my-auto"><img src="images/icons/arrowRightWhite.png" alt="" class="icon1"></figure>
                            </a>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-----------------------------
    HOME BANNER
     ------------------------------->

    <!-----------------------------
      ABOUT CONFIGURATOR
     ------------------------------->
    <section class="aboutConfigurator">
        <div class="container-fluid h-100">
            <div class="row h-100">
                <div class="col-md-6 col-xl-6 contentSide">
                    <div class="innerDiv ">
                        <h4>Craft Every Detail in Real-Time with Our 3D Custom Builder</h4>
                        <p class="grey1">Say goodbye to guesswork. With our interactive 3D tool, every color, stripe, and logo is exactly where you want it.</p>
                        <ul class="listStyle1 p-0">
                            <li>
                                <figure><img src="images/icons/rightarrowBg.png" alt="" class="icon2"></figure>
                                What you see is what you get — accurate previews
                            </li>
                            <li id="collection">
                                <figure><img src="images/icons/rightarrowBg.png" alt="" class="icon2"></figure>
                                Select styles, fabrics, colors, logos, and more
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-6 rightVideoSide">
                    <div class="innerDiv h-100">
                        <div class="video-container">
                            <div class="video-thumbnail" id="videoThumbnail">
                                <img src="images/main/3dConfigurator.png" alt="Video Thumbnail" class="video__image">
                                <button id="playButton">
                                    <Figure><img src="images/icons/Play-icon.png" alt=""></Figure>
                                </button>
                            </div>

                            <video id="mainVideo" width="100%" controls style="display: none;">
                                <source src="assets/video/aboutConfigurator.mp4" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
    <!-----------------------------
      ABOUT CONFIGURATOR
     ------------------------------->



    <!-----------------------------
      DESIGNS COLLECTIONS
     ------------------------------->
    <section class="designCollection">
        <div class="container-fluid">
            <div class="row">
                <div class="sectionHeader col-md-6">
                    <h2 class="sectionTitle">Design from Our Signature Collections</h2>
                    <p class="sectionDesc">Choose from a wide range of professional jersey designs tailored for different sports and team styles. Customise them further to match your team spirit.</p>
                </div>
                <div class="allDesigns">
                    <div class="allDesignsSlider">
                        <div class="card AllDesignsItems">
                            <figure class="designImg"><img src="images/AllProducts/design1.png" alt="Design 1"></figure>
                            <div class="designName">
                                <a href="customize.php?cat=1&subcat=101" class="iconBTn">Sublimation Pro Series
                                    <figure class="my-auto"><img src="images/icons/arrowRightWhite.png" alt="" class="iconBtn1"></figure>
                                </a>
                            </div>
                        </div>
                        <div class="card AllDesignsItems">
                            <figure class="designImg"><img src="images/AllProducts/design2.png" alt="Design 2"></figure>
                            <div class="designName">
                                <a href="customize.php?cat=1&subcat=102" class="iconBTn">Sublimation Pro Series
                                    <figure class="my-auto"><img src="images/icons/arrowRightWhite.png" alt="" class="iconBtn1"></figure>
                                </a>
                            </div>
                        </div>
                        <div class="card AllDesignsItems">
                            <figure class="designImg"><img src="images/AllProducts/design3.png" alt="Design 3"></figure>
                            <div class="designName">
                                <a href="customize.php?cat=2&subcat=103" class="iconBTn">Sub Reversible Jersey
                                    <figure class="my-auto"><img src="images/icons/arrowRightWhite.png" alt="" class="iconBtn1"></figure>
                                </a>
                            </div>
                        </div>
                        <div class="card AllDesignsItems">
                            <figure class="designImg"><img src="images/AllProducts/design4.png" alt="Design 4"></figure>
                            <div class="designName">
                                <a href="customize.php?cat=3&subcat=104" class="iconBTn">Shell Pants
                                    <figure class="my-auto"><img src="images/icons/arrowRightWhite.png" alt="" class="iconBtn1"></figure>
                                </a>
                            </div>
                        </div>
                        <div class="card AllDesignsItems">
                            <figure class="designImg"><img src="images/AllProducts/design5.png" alt="Design 5"></figure>
                            <div class="designName">
                                <a href="customize.php?cat=4&subcat=105" class="iconBTn">Bags
                                    <figure class="my-auto"><img src="images/icons/arrowRightWhite.png" alt="" class="iconBtn1"></figure>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div id="highlights"></div>
                </div>
            </div>
        </div>
    </section>
    <!-----------------------------
    DESIGNS COLLECTIONS
     ------------------------------->


    <!-----------------------------
    ABOUT HIGHLIGHTS
     ------------------------------->
    <section class="highlights d-flex align-items-center">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="highlightList grid4" id="whyCustom">
                        <div class="highlightsItems ">
                            <figure class="my-auto"><img src="images/icons/highlight1.png" alt=""></figure>
                            <h6> Fully Customisable Designs </h6>
                        </div>
                        <div class="highlightsItems">
                            <figure class="my-auto"><img src="images/icons/highlight2.png" alt=""></figure>
                            <h6> Instant 3D Visualisation </h6>
                        </div>
                        <div class="highlightsItems">
                            <figure class="my-auto"><img src="images/icons/highlight3.png" al t=""></figure>
                            <h6> Premium Quality Jerseys </h6>
                        </div>
                        <div class="highlightsItems">
                            <figure class="my-auto"><img src="images/icons/highlight4.png" alt=""></figure>
                            <h6> Flexible Design Options</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-----------------------------
    ABOUT HIGHLIGHTS
     ------------------------------->


    <!-----------------------------
    WHY CUSTOM BUILDER
     ------------------------------->
    <section class="whyCustomBuilder">
        <div class="container">
            <div class="row">
                <div class="sectionHeader col-md-6">
                    <h2 class="sectionTitle">Why Use a Custom Builder?</h2>
                    <p class="sectionDesc">Design smarter, approve faster, and order with confidence </p>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="insideInnerMain">
                        <div class="innerDiv">
                            <div class="innerItems">
                                <h6>Instant 3D Visualisation</h6>
                                <p>See exactly how your jersey will look in real-time.</p>
                                <figure class="borderBottomImg"><img src="images/icons/lineBorder.png" alt="" class="w-100"></figure>
                            </div>
                        </div>
                        <div class="innerDiv">
                            <div class="innerItems">
                                <h6>Accurate & Reliable</h6>
                                <p>What you see is what you get</p>
                                <figure class="borderBottomImg"><img src="images/icons/lineBorder.png" alt="" class="w-100"></figure>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 center text-center">
                    <div class="insideInnerMain">
                        <figure class="my-0">
                            <img src="images/main/whyUsMain.png" alt="">
                        </figure>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="insideInnerMain">
                        <div class="innerDiv">
                            <div class="innerItems">
                                <h6>Instant 3D Visualisation</h6>
                                <p>Share designs instantly with coaches and players for faster approvals.</p>
                                <figure class="borderBottomImg"><img src="images/icons/lineBorder.png" alt="" class="w-100"></figure>
                            </div>
                        </div>
                        <div class="innerDiv">
                            <div class="innerItems">
                                <h6>Instant 3D Visualisation</h6>
                                <p id="benefits">Reduce weeks of communication to just minutes of designing.</p>
                                <figure class="borderBottomImg"><img src="images/icons/lineBorder.png" alt="" class="w-100"></figure>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-----------------------------
    WHY CUSTOM BUILDER
     ------------------------------->



    <!-----------------------------
     HOW IT WORKS
    ------------------------------->
    <section class="howItWorks">
        <div class="container-fluid">
            <div class="row">
                <div class="sectionHeader col-md-6">
                    <h2 class="sectionTitle">How It Works?</h2>
                </div>
            </div>
            <div class="worksSteps  ">
                <div class="workStepsItems">
                    <figure class="iconImg"><img src="images/icons/steps1.png" alt=""></figure>
                    <h6>Select your sport & product.</h6>
                </div>
                <div class="stepsDiv">
                    <figure>
                        <img src="images/icons/nextArrow.png" alt="">
                    </figure>
                </div>
                <div class="workStepsItems">
                    <figure class="iconImg"><img src="images/icons/steps1.png" alt=""></figure>
                    <h6>Customize in 3D.</h6>
                </div>
                <div class="stepsDiv">
                    <figure>
                        <img src="images/icons/nextArrow.png" alt="">
                    </figure>
                </div>
                <div class="workStepsItems">
                    <figure class="iconImg"><img src="images/icons/steps1.png" alt=""></figure>
                    <h6>Add player details.</h6>
                </div>
                <div class="stepsDiv">
                    <figure>
                        <img src="images/icons/nextArrow.png" alt="">
                    </figure>
                </div>
                <div class="workStepsItems">
                    <figure class="iconImg"><img src="images/icons/steps1.png" alt=""></figure>
                    <h6>Review and share.</h6>
                </div>
                <div class="stepsDiv">
                    <figure>
                        <img src="images/icons/nextArrow.png" alt="">
                    </figure>
                </div>
                <div class="workStepsItems" id="process">
                    <figure class="iconImg"><img src="images/icons/steps1.png" alt=""></figure>
                    <h6>Place your order with your sales rep.</h6>
                </div>
            </div>
        </div>
    </section>
    <!-----------------------------
     HOW IT WORKS
    ------------------------------->



    <!-----------------------------
     MARQUEE HOME
    ------------------------------->
    <section class="homeMarquee">
        <div class="container-fluid">
            <div class="row">
                <div class="marqueeContainer">
                    <div class="marqueeTrack">
                        <div class="marqueeItems">
                            <figure><img src="images/icons/marquee1.png" alt=""></figure>
                            <h6>Start customising</h6>
                        </div>
                        <div class="marqueeItems">
                            <figure><img src="images/icons/marquee1.png" alt=""></figure>
                            <h6>Start customising</h6>
                        </div>
                        <div class="marqueeItems">
                            <figure><img src="images/icons/marquee1.png" alt=""></figure>
                            <h6>Start customising</h6>
                        </div>
                        <div class="marqueeItems">
                            <figure><img src="images/icons/marquee1.png" alt=""></figure>
                            <h6>Start customising</h6>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-----------------------------
     MARQUEE HOME
    ------------------------------->



    <!-----------------------------
    CUSTOMIZE START HOME FOOTER UPPER
    ------------------------------->
    <section class="FooterUpperCustomize">
        <div class="container">
            <div class="row">
                <div class=" col-md-7 contentSide">
                    <div class="innerDiv">
                        <h5>Ready to Design Your Team Jersey?</h5>
                        <p>Bring your team’s identity to life with our powerful 3D Custom Builder. Create, customise, and preview every detail – all before you place your order.</p>
                        <div class="d-inline-flex">
                            <a href="chooseSports.php" class="defBtnStyle font2 gap2">
                                Start Customising
                                <figure class="my-auto"><img src="images/icons/arrowRightWhite.png" alt="" class="icon1"></figure>
                            </a>

                        </div>
                    </div>
                </div>
                <div class="  col-md-5 imageSide">
                    <div class="innerDiv">
                        <figure><img src="images/main/customizeDesign.png" alt="" class="w-100"></figure>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-----------------------------
    CUSTOMIZE START HOME FOOTER UPPER
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
                            <di v class="grid2">
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
                            </di>
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
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Slick JS -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>
    <!-- <script>
        const playButton = document.getElementById('playButton');
        const video = document.getElementById('mainVideo');
        const thumbnail = document.getElementById('videoThumbnail');

        playButton.addEventListener('click', () => {
            thumbnail.style.display = 'none'; // hide thumbnail
            video.style.display = 'block'; // show video
            // video.style.objectFit = 'cover';  
            video.play(); // play video
        });
    </script> -->

    <script>
        const playButton = document.getElementById('playButton');
        const video = document.getElementById('mainVideo');
        const thumbnail = document.getElementById('videoThumbnail');

        // Play button click handler
        playButton.addEventListener('click', () => {
            thumbnail.style.display = 'none'; // hide thumbnail
            video.style.display = 'block'; // show video
            video.play(); // play video
        });

        // When video is paused, show thumbnail again
        video.addEventListener('pause', () => {
            thumbnail.style.display = 'block'; // show thumbnail
            video.style.display = 'none'; // hide video again
        });

        // Fullscreen change handler
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement === video) {
                video.style.objectFit = 'contain'; // fullscreen mode
            } else {
                video.style.objectFit = 'cover'; // normal mode
            }
        });

        // Double-click to toggle fullscreen
        video.addEventListener('dblclick', () => {
            if (!document.fullscreenElement) {
                video.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    </script>
    <script>
        $(document).ready(function() {
            $('.allDesignsSlider').slick({
                slidesToShow: 4.5,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 2000,
                arrows: true,
                dots: true,
                responsive: [{
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 4.5,
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 3.5,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2.5,
                        }
                    },
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 1,
                        }
                    }
                ]
            });
        });
    </script>


    <script>
        window.addEventListener("scroll", function() {
            const header = document.getElementById("mainHeader");
            if (window.scrollY > 100) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
        });
    </script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const navLinks = document.querySelectorAll(".navLinks a");

            navLinks.forEach(link => {
                link.addEventListener("click", function(e) {
                    // Remove active from all links
                    navLinks.forEach(l => l.classList.remove("active"));

                    // Add active to the clicked link
                    this.classList.add("active");
                });
            });
        });
    </script>
    <script>
        const scrollBtn = document.getElementById("scrollToTopBtn");

        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                scrollBtn.style.display = "block";
            } else {
                scrollBtn.style.display = "none";
            }
        });

        scrollBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    </script>

</body>

</html>