<!DOCTYPE html>
<html lang="en">
<?php
include('db.php');
if (isset($_GET['cat'])) {
    $cat = $_GET['cat'];
}
if (isset($_GET['subcat'])) {
    $subcat = $_GET['subcat'];
}
?>
<!-- applyImageToSelectedMesh -->
<!-- dynamicImageMeshButtons -->

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jog 3D Configurator</title>


    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <!-- <link rel="stylesheet" href="style/main.css"> -->
    <!-- <link rel="stylesheet" href="style/default.css"> -->
    <link rel="stylesheet" href="style/root.css">
    <link rel="stylesheet" href="style/responisve.css">
    <link rel="stylesheet" href="style/configurator.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="icon" type="image/x-icon" href="images/jogLogo2.png">
    <style>
        .messError {
            border: 1px solid #EAEAEA;
            padding: 20px;
            font-size: 14px;
            font-weight: 500;
            border-radius: 4px;
            background: #eee;
            text-transform: capitalize;
        }

        .appliedDecalsList {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 10px;
        }

        .decal-list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #f5f5f5;
            border-radius: 4px;
            font-size: 14px;
        }

        .decal-list-item span {
            font-weight: 500;
            text-transform: capitalize;
        }

        .delete-decal-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
        }

        .delete-decal-btn img {
            width: 16px;
            height: 18px;
        }

        #threejs-container {
            width: 100%;
            height: 100vh;
            overflow: hidden;
        }

        /* .colorItems.onlyShowInTertiary {
            display: none;
        } */

        canvas {
            pointer-events: auto;
            touch-action: none;
            width: 100% !important;
            height: 100% !important;
        }




        #dynamicMeshButtons button.active {
            border: 2px solid #007bff;
            background-color: rgba(0, 123, 255, 0.1);
        }

        .textMeshesItems .textDecalMesh .decalText {
            font-weight: 700;
            font-size: 16px;
            margin: 0;
        }

        .textDecalMesh .decalText {
            font-size: 22px;
            background: #EEEEEE54;
            padding: 5px;
            text-align: center;
            border: 2px dotted #1C1C1C;
        }




        /* textControls */
        .textControls label {
            margin: auto 0;
            white-space: nowrap;
        }

        .textControls .rotate p {
            min-width: 35;
        }

        .selectGradientColors {
            display: flex;
            gap: 10px;
            padding: 15px;
        }



        .patternSizeHandle button {
            border: none;
            background: none;
            margin: 0;
            padding: 0;
        }

        .patternSizeHandle button img {
            width: 27px;

        }

        /* #zoomIn,
        #zoomOut {
            display: none;
        } */

        /* textControls */




        .chooseColor label {
            font-size: 13px;
        }

        .static-shoulder-btn {
            background-color: #ffcc00;
            /* Yellow background to make it stand out */
            border: 2px solid #ff9900;
            font-weight: bold;
        }

        .static-shoulder-btn:hover {
            background-color: #ffdd33;
        }

        .imageMeshBtn {
            margin: 5px;
            padding: 8px;
            display: inline-block;
        }

        /* If you want to group buttons for the same mesh */
        .mesh-button-group {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 10px;
        }


        .patternsItems.active img {
            border: 2px solid #0060DF;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

        }


        .patternArea .checkbox-button input {
            display: none;
        }

        .colorPicker {
            width: 40px;
            margin-top: 10px;
            height: 40px;
            border: 1px solid rgb(230, 230, 230);
            border-radius: 50%;
            background: var(--selectedColor);
        }





        .textDecalFirstScreen,
        .textDecalSecondScreen,
        .textDecalThirdScreen {
            transition: opacity 0.5s ease;
        }

        .selectedBackGround {
            width: 40px;
            margin-top: 10px;
            height: 40px;
            border: 1px solid rgb(230, 230, 230);
            border-radius: 50%;
            background: var(--selectedColor);
        }

        .selectedBackGround {
            width: 30px;
            height: 30px;
            border: 1px solid #ccc;
            background-color: #ffffff;
            /* Default white */
        }


        .gradient-slider {
            margin-bottom: 10px;
        }



        .gradient-slider label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
        }

        .gradient-slider input[type="range"] {
            width: 100%;
        }

        #updateTextButton {
            display: none;
        }

        #resetBackgroundButton {
            padding: 5px 10px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 3px;
            cursor: pointer;
        }

        #resetBackgroundButton:hover {
            background: #e0e0e0;
        }



        .text-center {
            text-align: center;
        }



        #uploadImageBtn {
            background-color: #4CAF50;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        #uploadImageBtn:hover {
            background-color: #45a049;
        }


        #imagePreviewBorder {
            box-sizing: border-box;
            border-radius: 4px;
            transition: all 0.3s ease;
        }



        .patternImagesArea img {
            border: 1px solid #D3D3D3;
        }


        .meshActiveColor {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: inline-block;
            margin: 5px;
            border: 2px solid #fff;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }

        input[name="meshActiveColor"]:checked+.meshActiveColor {
            border: 2px solid #000;
            transform: scale(1.1);
        }

        .meshActiveColor {
            width: 30px;
            height: 30px;
            border-radius:
                100px;
            margin-bottom: 5px;
            background-color: #ccc;
        }

        .meshActiveFaceName {
            margin: 0;
            display: flex;
            font-size: 13px;
            align-items: center;
            white-space: nowrap;
            max-width: 70px;
            overflow: auto;
            scrollbar-width: none;
        }

        #dynamicPatternForm .label-text {
            max-width: 70px;
            overflow: hidden;
        }

        .outlineColor .palette.active {
            border: 2px solid #333;
            transform: scale(1.1);
        }

        /* ---------------------------------
        -----------------------------------
         */

        .decal-hover {
            cursor: move;
        }



        .gradient-controls .control-group {
            margin-bottom: 10px;
        }

        .gradient-controls label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .gradient-controls input[type="range"] {
            width: 100%;
        }





        .gradient-palette input[type="checkbox"] {
            position: absolute;
            left: 0;
            width: 20px;
            top: -6px;
            height: 14px;
        }

        .gradient-palette input[type="checkbox"]:checked+span {
            border: 2px solid #000;
        }

        /* Example color classes - adjust to match your palette */
        .gradient-palette .teal {
            background-color: #007C7C;
        }

        .gradient-palette .green {
            background-color: #8BC53F;
        }



        #undoButton,
        #redoButton {
            padding: 8px 12px;
            margin: 0 5px;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        #undoButton:hover,
        #redoButton:hover {
            background-color: #e0e0e0;
        }

        #undoButton:disabled,
        #redoButton:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        #toggleRotationBtn.locked {
            background-color: #2F50A357;
            color: white;
        }



        .preloader-content {
            text-align: center;
        }

        .preloader-spinner {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            width: 300px;
            height: 300px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        .preloader-progress {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }

        #preloader .MainContent {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }

        .preloader-time {
            font-size: 14px;
            color: #666;
        }

        #decalControls {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 4px;
            padding: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        }

        .drag-handle {
            display: inline-block;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            margin: 0 2px;
            cursor: pointer;
            border-radius: 3px;
            background: #fff;
            border: 1px solid #ddd;
        }

        .drag-handle:hover {
            background: #f0f0f0;
        }

        .drag-handle {
            width: 24px;
            height: 24px;
            background: white;
            border: 2px solid #3498db;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            font-size: 12px;
            z-index: 1000;
        }

        .rotate-handle {
            top: -30px !important;
            background: #2ecc71;
            border-color: #27ae60;
        }

        .top-left,
        .bottom-right {
            cursor: nwse-resize;
        }

        .top-right,
        .bottom-left {
            cursor: nesw-resize;
        }

        #decalControls {
            z-index: 1000;
        }

        .drag-handle {
            width: 24px;
            height: 24px;
            background: white;
            border: 2px solid #3498db;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: absolute;
            font-size: 14px;
            color: #3498db;
            user-select: none;
            pointer-events: all;
        }

        .drag-handle:hover {
            background: #3498db;
            color: white;
        }

        .drag-handle.resize {
            transform: translate(50%, -50%);
            cursor: nwse-resize;
        }

        .drag-handle.rotate {
            transform: translate(50%, -50%);
            cursor: grab;
        }

        .drag-handle.lock {
            transform: translate(-50%, 50%);
            cursor: pointer;
        }

        .drag-handle.remove {
            transform: translate(50%, 50%);
            cursor: pointer;
            background: #e74c3c;
            border-color: #e74c3c;
            color: white;
        }

        .drag-handle.remove:hover {
            background: #c0392b;
        }


        @media screen and (max-width:1200px) {
            .statusSelect {
                min-width: 100px;
            }

            .dashboardPage .table-responsive {
                overflow-x: auto;
            }
        }
    </style>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const fabricRadios = document.querySelectorAll(".fabricArea input[type='radio']");
            const subZonesDiv = document.querySelector(".subZonesDiv");

            fabricRadios.forEach(radio => {
                radio.addEventListener("change", function() {
                    if (this.value === "Mesh") {
                        subZonesDiv.classList.add("active");
                    } else {
                        subZonesDiv.classList.remove("active");
                    }
                });
            });
        });
    </script>
    <!-- <script>
        document.addEventListener("DOMContentLoaded", function() {
            const tabs = document.querySelectorAll(".innerTabs .nav-link");
            let currentIndex = 0;

            function activateTab(index) {
                if (index >= 0 && index < tabs.length) {
                    const tabTrigger = new bootstrap.Tab(tabs[index]);
                    tabTrigger.show();
                    currentIndex = index;
                }
            }

            document.querySelector(".themeBtn.icnBtn").addEventListener("click", function(e) {
                e.preventDefault();
                activateTab(currentIndex + 1);
            });

            document.querySelector(".greyBtn.icnBtn").addEventListener("click", function(e) {
                e.preventDefault();
                activateTab(currentIndex - 1);
            });

            // Update currentIndex when tab is manually clicked
            tabs.forEach((tab, index) => {
                tab.addEventListener("shown.bs.tab", () => {
                    currentIndex = index;
                });
            });
        });
    </script> -->


    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const tabs = document.querySelectorAll(".innerTabs .nav-link");
            let currentIndex = 0;

            function activateTab(index) {
                if (index >= 0 && index < tabs.length) {
                    const tabTrigger = new bootstrap.Tab(tabs[index]);
                    tabTrigger.show();
                    currentIndex = index;
                }
            }

            // NEXT button
            document.querySelector(".themeBtn.icnBtn").addEventListener("click", function(e) {
                e.preventDefault();
                activateTab(currentIndex + 1);
            });

            // GO BACK button
            document.querySelector(".greyBtn.icnBtn").addEventListener("click", function(e) {
                e.preventDefault();

                // If current tab is the last one (Fabrics) and going back
                if (currentIndex === tabs.length - 1) {
                    const confirmReset = confirm("Your previous customization changes will be removed. Do you want to continue?");
                    if (!confirmReset) {
                        return; // Stop here if user clicked Cancel
                    }

                    // TODO: Add your reset logic here if you actually want to clear changes
                    // resetCustomization();

                }

                activateTab(currentIndex - 1);
            });

            // Keep track of current index when tabs change manually
            tabs.forEach((tab, index) => {
                tab.addEventListener("shown.bs.tab", () => {
                    currentIndex = index;
                });
            });
        });
    </script>


    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const collarForm = document.getElementById("collarForms");
            const stripeForm = document.getElementById("jerseyStripesForm");
            const noticeDiv = document.getElementById("chooseCollarNotice");

            // Map collar values to stripe div classes
            const collarToStripesMap = {
                collar1: "forTriangleVNeck",
                collar2: "forTriangleVNeckWithLace",
                collar3: "forVNeck",
                collar4: "ForTriSewInLace",
                collar5: "forPentagonNeck",
                collar6: "forSewInLaceWithPentagonNeck"
            };

            // Hide all stripe groups
            function hideAllStripes() {
                stripeForm.querySelectorAll("div").forEach(div => {
                    div.style.display = "none";
                });
            }

            // Show notice and hide stripes
            function resetToNotice() {
                hideAllStripes();
                noticeDiv.style.display = "block";
            }

            // Listen for collar selection
            collarForm.querySelectorAll("input[type='checkbox']").forEach(input => {
                input.addEventListener("change", function() {
                    // Allow only one collar checkbox at a time
                    collarForm.querySelectorAll("input[type='checkbox']").forEach(cb => {
                        if (cb !== this) cb.checked = false;
                    });

                    hideAllStripes();

                    if (this.checked) {
                        const targetClass = collarToStripesMap[this.value];
                        if (targetClass) {
                            const targetDiv = stripeForm.querySelector("." + targetClass);
                            if (targetDiv) {
                                targetDiv.style.display = "grid";
                                noticeDiv.style.display = "none"; // hide notice
                            }
                        }
                    } else {
                        resetToNotice(); // if unchecked, show notice again
                    }
                });
            });

            // Default state
            resetToNotice();
        });
    </script>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const collarForm = document.getElementById("collarForms");
            const styleForm = document.getElementById("jerseyStyleForm");
            const styleNotice = document.getElementById("chooseCollarForStyleNotice");

            // Map collar values to style div classes
            const collarToStyleMap = {
                collar1: "JerseyTriangleVNeck",
                collar2: "JerseyTriangleVNeckWithLace",
                collar3: "JerseyVNeckWithoutPatch",
                collar4: "forSewInLaceHTri",
                collar5: "JerseyPentagon",
                collar6: "SewInLaceWithPentagonNeck"
            };

            // Hide all style groups
            function hideAllStyles() {
                styleForm.querySelectorAll("div").forEach(div => {
                    div.style.display = "none";
                });
            }

            // Reset to notice
            function resetStyleNotice() {
                hideAllStyles();
                styleNotice.style.display = "block";
            }

            // Watch collar selection
            collarForm.querySelectorAll("input[type='checkbox']").forEach(input => {
                input.addEventListener("change", function() {
                    // only one collar at a time
                    collarForm.querySelectorAll("input[type='checkbox']").forEach(cb => {
                        if (cb !== this) cb.checked = false;
                    });

                    hideAllStyles();

                    if (this.checked) {
                        const targetClass = collarToStyleMap[this.value];
                        if (targetClass) {
                            const targetDiv = styleForm.querySelector("." + targetClass);
                            if (targetDiv) {
                                targetDiv.style.display = "grid";
                                styleNotice.style.display = "none"; // hide notice
                            }
                        }
                    } else {
                        resetStyleNotice();
                    }
                });
            });

            // Default
            resetStyleNotice();
        });
    </script>
</head>

<body>


    <!-----------------------------
    HEADER_MAIN
     ------------------------------->
    <div class="Header d-none">
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
                                    <li>
                                        <a href="product_type.php" class=" activePage flexRow">
                                            <figure class="m-0"><img src="images/icons/mdi_footballInactive.png" alt=""></figure>
                                            PRODUCT TYPE
                                            <span></span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="customize.php" class=" activePage flexRow">
                                            <figure class="m-0"><img src="images/icons/mdi_footballInactive.png" alt=""></figure>
                                            CUSTOMIZE
                                            <span></span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="roasterDetails.php" class="flexRow">
                                            <figure class="m-0"><img src="images/icons/mdi_footballInactive.png" alt=""></figure> ADD
                                            ROSTER
                                            DETAIL
                                            <span></span>
                                        </a>
                                    </li>
                                    <li><a href="reviewDetails.php" class="flexRow">
                                            <figure class="m-0"><img src="images/icons/mdi_footballInactive.png" alt=""></figure> REVIEW
                                        </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="RightSide d-flex justify-content-between align-items-center">
                        <h6>3D Configurator</h6>
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

    <section class="ConfiguratorMain">
        <div class="container-fluid h-100">
            <div class="row h-100">
                <div class="col-md-4 configuratorControlsArea">
                    <div class="innerDiv">
                        <div class="customHeader">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="BrandLogo">
                                    <a href="index.php">
                                        <figure class="m-0">
                                            <img src="images/BrandLogo.png" alt="Company Logo" />
                                        </figure>
                                    </a>
                                </div>

                                <div class="RightSide d-flex justify-content-between align-items-center">
                                    <h6 class="f14 font2 my-auto">3D Configurator</h6>
                                    <figure class="mx-2 mb-2">
                                        <img src="images/3dConf.png" alt="" />
                                    </figure>
                                </div>
                            </div>
                        </div>
                        <div class="configuratorAllControls">
                            <div class="innerDiv">
                                <div class="sidebar_tabs tabSec p0 flex-column gap3">

                                    <!-- MAIN SIDEBAR NAV -->
                                    <ul class="nav nav-pills flex-column sidebarTabs" id="mainTab" role="tablist">
                                        <li class="nav-item">
                                            <a class="nav-link active " id="patternContent-tab" data-bs-toggle="pill" href="#patternContent" role="tab" aria-controls="patternContent" aria-selected="true">
                                                <img src="images/icons/pattern.png" alt="Pattern Icon" class="tabsImgIcon inactiveImg" />
                                                <img src="images/icons/fabric.png" alt="Pattern Icon" class="tabsImgIcon activeImg" />
                                                Fabrics
                                            </a>
                                        </li>
                                        <li class="nav-item border-left">
                                            <a class="nav-link" id="main-colors-tab" data-bs-toggle="pill" href="#main-colors" role="tab" aria-controls="main-colors" aria-selected="false">
                                                <img src="images/icons/colors.png" alt="Colors Icon" class="tabsImgIcon inactiveImg" />
                                                <img src="images/icons/colorActive.png" alt="Colors Icon" class="tabsImgIcon activeImg" />
                                                Colors
                                            </a>
                                        </li>
                                        <li class="nav-item border-left">
                                            <a class="nav-link" id="main-logo-tab" data-bs-toggle="pill" href="#main-logo" role="tab" aria-controls="main-logo" aria-selected="false">
                                                <img src="images/icons/logo.png" alt="Logo Icon" class="tabsImgIcon inactiveImg" />
                                                <img src="images/icons/colorActive.png" alt="Logo Icon" class="tabsImgIcon activeImg" />
                                                Logo
                                            </a>
                                        </li>
                                        <li class="nav-item border-left">
                                            <a class="nav-link" id="nameTab" data-bs-toggle="pill" href="#textContent" role="tab" aria-controls="textContent" aria-selected="false" data-type="name">
                                                <img src="images/icons/name.png" class="tabsImgIcon inactiveImg" />
                                                <img src="images/icons/colorActive.png" class="tabsImgIcon activeImg" />
                                                Name
                                            </a>
                                        </li>

                                        <li class="nav-item border-left">
                                            <a class="nav-link" id="numberTab" data-bs-toggle="pill" href="#textContent" role="tab" aria-controls="textContent" aria-selected="false" data-type="number">
                                                <img src="images/icons/number.png" class="tabsImgIcon inactiveImg" />
                                                <img src="images/icons/colorActive.png" class="tabsImgIcon activeImg" />
                                                Number
                                            </a>
                                        </li>

                                    </ul>
                                    <div class="sidebar_content" id="sidebar">
                                        <div class="tab-content sidebar_inner_content" id="mainTabContent">

                                            <!-- MAIN: FABRICS -->
                                            <div class="tab-pane fade show active" id="patternContent" role="tabpanel" aria-labelledby="patternContent-tab">

                                                <div class="season_content">
                                                    <div class="insideTabs patternTabs">
                                                        <!-- INNER FABRICS NAV -->
                                                        <ul class="nav nav-pills innerTabs grid4" id="fabricInnerTab" role="tablist">
                                                            <li class="nav-item">
                                                                <a class="nav-link active" id="fabric-collar-tab" data-bs-toggle="pill" href="#fabric-collar" role="tab" aria-controls="fabric-collar" aria-selected="true">
                                                                    Collar
                                                                </a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a class="nav-link" id="fabric-style-tab" data-bs-toggle="pill" href="#fabric-style" role="tab" aria-controls="fabric-style" aria-selected="false">
                                                                    Style
                                                                </a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a class="nav-link" id="fabric-stripes-tab" data-bs-toggle="pill" href="#fabric-stripes" role="tab" aria-controls="fabric-stripes" aria-selected="false">
                                                                    Stripes
                                                                </a>
                                                            </li>
                                                            <li class="nav-item">
                                                                <a class="nav-link" id="fabric-material-tab" data-bs-toggle="pill" href="#fabric-material" role="tab" aria-controls="fabric-material" aria-selected="false">
                                                                    Fabrics
                                                                </a>
                                                            </li>
                                                        </ul>

                                                        <!-- INNER FABRICS TAB CONTENT -->
                                                        <div class="tab-content" id="fabricInnerTabContent">
                                                            <div class="tab-pane fade show active" id="fabric-collar" role="tabpanel" aria-labelledby="fabric-collar-tab">
                                                                <!-- Collar Content -->
                                                                <div class="subTabsContent">
                                                                    <h6 class="subTabsTitle">
                                                                        Choose Jersey Collar
                                                                    </h6>
                                                                    <div class="collarAllStyles ">
                                                                        <form action="" class="grid3" id="collarForms">
                                                                            <label class="collarItems checkBoxDesign">
                                                                                <input type="checkbox" name="fabricMaterial[]" value="collar1">
                                                                                <figure class="my-0"><img src="images/collarDesigns/collar01.png" alt=""></figure>

                                                                                <h6 class="fabricName"> Triangle V-Neck</h6>
                                                                            </label>
                                                                            <label class="collarItems checkBoxDesign">
                                                                                <input type="checkbox" name="fabricMaterial[]" value="collar2">
                                                                                <figure class="my-0"><img src="images/collarDesigns/collar02.png" alt=""></figure>

                                                                                <h6 class="fabricName"> Lace Neck with Triangle</h6>
                                                                            </label>
                                                                            <label class="collarItems checkBoxDesign">
                                                                                <input type="checkbox" name="fabricMaterial[]" value="collar3">
                                                                                <figure class="my-0"><img src="images/collarDesigns/Collar03.png" alt=""></figure>
                                                                                <h6 class="fabricName"> V-Neck</h6>
                                                                            </label>
                                                                            <label class="collarItems checkBoxDesign">
                                                                                <input type="checkbox" name="fabricMaterial[]" value="collar4">
                                                                                <figure class="my-0"><img src="images/collarDesigns/collar04.png" alt=""></figure>
                                                                                <h6 class="fabricName"> Sewn-in Lace(H) with Triangle</h6>
                                                                            </label>
                                                                            <label class="collarItems checkBoxDesign">
                                                                                <input type="checkbox" name="fabricMaterial[]" value="collar5">
                                                                                <figure class="my-0"><img src="images/collarDesigns/collar05.png" alt=""></figure>
                                                                                <h6 class="fabricName">Pentagon Neck</h6>
                                                                            </label>
                                                                            <label class="collarItems checkBoxDesign">
                                                                                <input type="checkbox" name="fabricMaterial[]" value="collar6">
                                                                                <figure class="my-0"><img src="images/collarDesigns/collar06.png" alt=""></figure>
                                                                                <h6 class="fabricName">Sewn-in Lace with Pentagon</h6>
                                                                            </label>
                                                                        </form>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="tab-pane fade" id="fabric-style" role="tabpanel" aria-labelledby="fabric-style-tab">
                                                                <!-- Style Content -->
                                                                <div class="subTabsContent">
                                                                    <h6 class="subTabsTitle">
                                                                        Choose Jersey Style
                                                                    </h6>

                                                                    <!-- Default message -->
                                                                    <div id="chooseCollarForStyleNotice" class="messError">
                                                                        ⚠️ Please choose a collar first before selecting a style.
                                                                    </div>

                                                                    <div class="JerseyAllStyles">
                                                                        <form action="" id="jerseyStyleForm">
                                                                            <div class="JerseyTriangleVNeck grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="style1">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/TriNeckWithPatch/0.5-1-2-1-0.5.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> Jersey Triangle V-Neck With Patch</h6>
                                                                                </label>
                                                                            </div>
                                                                            <div class="JerseyTriangleVNeckWithLace grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="style2">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/TriWithLace/Neck0.5-1-2-1-0.5.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> Jersey Triangle V-Neck With Laces</h6>
                                                                                </label>
                                                                            </div>
                                                                            <div class="JerseyVNeckWithoutPatch grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="style3">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/TriWithoutPatch/VNeck 5inches.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> Style 3 V-Neck Without Patch</h6>
                                                                                </label>
                                                                            </div>
                                                                            <div class="forSewInLaceHTri grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="style4">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/Sewn-in_Lace(H)_with_Triangle/SewnLace(H)withTriangle 2-3.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> Sew in Lace (H)</h6>
                                                                                </label>
                                                                            </div>
                                                                            <div class="JerseyPentagon grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="style5">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/Pentagon_Neck/PentagonNeck5inches.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> Jersey Pentagon Neck</h6>
                                                                                </label>
                                                                            </div>
                                                                            <div class="SewInLaceWithPentagonNeck grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="style6">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/Sewn-in_Lace_with_Pentagon/Sewn-inLaceWithPentagon2-3.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> Sew in Lace with Pentagon Neck</h6>
                                                                                </label>
                                                                            </div>

                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="tab-pane fade" id="fabric-stripes" role="tabpanel" aria-labelledby="fabric-stripes-tab">
                                                                <!-- Stripes Content -->
                                                                <div class="subTabsContent">
                                                                    <h6 class="subTabsTitle">
                                                                        Choose Stripes
                                                                    </h6>
                                                                    <div class="JerseyAllStripes">
                                                                        <form action="" id="jerseyStripesForm">
                                                                            <div id="chooseCollarNotice" class="messError">
                                                                                ⚠️ Please choose a collar first before selecting stripes.
                                                                            </div>
                                                                            <div class="forTriangleVNeck grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="stripe1">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/TriNeckWithPatch/0.5-1-2-1-0.5.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> <span>0.5-1-2-1-0.5 Inches</span></h6>
                                                                                </label>
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="stripe2">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/TriNeckWithPatch/5-inches.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> <span>5-inches</span></h6>
                                                                                </label>
                                                                            </div>
                                                                            <div class="forTriangleVNeckWithLace grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="stripe1">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/TriWithLace/Neck0.5-1-2-1-0.5.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> <span>1.5-2-1.5 Inches</span></h6>
                                                                                </label>
                                                                            </div>
                                                                            <div class="forVNeck grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="stripe1">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/TriWithoutPatch/VNeck0.5-1-2-1-0.5.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> <span> 0.5-1-2-1-0.5 Inches</span></h6>
                                                                                </label>
                                                                            </div>
                                                                            <div class="ForTriSewInLace grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="stripe1">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/Sewn-in_Lace(H)_with_Triangle/SewnLace(H)withTriangle 2-3.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> <span>2-3 Inches</span></h6>
                                                                                </label>
                                                                            </div>
                                                                            <div class="forPentagonNeck grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="stripe1">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/Pentagon_Neck/PentagonNeck5inches.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> <span> 5 Inches</span></h6>
                                                                                </label>
                                                                            </div>
                                                                            <div class="forSewInLaceWithPentagonNeck grid3">
                                                                                <label class="JerseyItems checkBoxDesign">
                                                                                    <input type="checkbox" name="fabricMaterial[]" value="stripe1">
                                                                                    <figure class="my-0"><img src="assets/accordingCollar/stripesType/Sewn-in_Lace_with_Pentagon/Sewn-inLaceWithPentagon2-3.png" alt=""></figure>
                                                                                    <h6 class="fabricName"> <span>2-3 Inches</span></h6>
                                                                                </label>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="tab-pane fade" id="fabric-material" role="tabpanel" aria-labelledby="fabric-material-tab">
                                                                <!-- Fabrics Content -->
                                                                <form class="selectFabric " id="fabricForm">
                                                                    <div class="fabricArea grid3">
                                                                        <label class="fabricItems defRadioStyle">
                                                                            <input type="radio" name="fabric" value="Base">
                                                                            <figure class="my-0">
                                                                                <img src="images/Patterns/fabricsSelect.png" alt="">
                                                                            </figure>
                                                                            <span>Base</span>
                                                                        </label>

                                                                        <label class="fabricItems defRadioStyle">
                                                                            <input type="radio" name="fabric" value="Shoulder">
                                                                            <figure class="my-0">
                                                                                <img src="images/Patterns/fabricsSelect.png" alt="">
                                                                            </figure>
                                                                            <span>Shoulder</span>
                                                                        </label>

                                                                        <label class="fabricItems defRadioStyle">
                                                                            <input type="radio" name="fabric" value="Mesh">
                                                                            <figure class="my-0">
                                                                                <img src="images/Patterns/fabricsSelect.png" alt="">
                                                                            </figure>
                                                                            <span>Mesh</span>
                                                                        </label>
                                                                    </div>
                                                                    <div class="allFabricMaterials grid5">

                                                                        <div class="subZonesDiv column5 grid4 ">
                                                                            <label class="fabricItems defRadioStyle">
                                                                                <input type="radio" name="fabric" value="Base">
                                                                                <figure class="my-0">
                                                                                    <img src="images/Patterns/fabricsSelect.png" alt="">
                                                                                </figure>
                                                                                <span>Sub-Zone 1</span>
                                                                            </label>
                                                                            <label class="fabricItems defRadioStyle">
                                                                                <input type="radio" name="fabric" value="Base">
                                                                                <figure class="my-0">
                                                                                    <img src="images/Patterns/fabricsSelect.png" alt="">
                                                                                </figure>
                                                                                <span>Sub-Zone 2</span>
                                                                            </label>
                                                                            <label class="fabricItems defRadioStyle">
                                                                                <input type="radio" name="fabric" value="Base">
                                                                                <figure class="my-0">
                                                                                    <img src="images/Patterns/fabricsSelect.png" alt="">
                                                                                </figure>
                                                                                <span>Sub-Zone 3</span>
                                                                            </label>
                                                                            <label class="fabricItems defRadioStyle">
                                                                                <input type="radio" name="fabric" value="Base">
                                                                                <figure class="my-0">
                                                                                    <img src="images/Patterns/fabricsSelect.png" alt="">
                                                                                </figure>
                                                                                <span>Sub-Zone 4</span>
                                                                            </label>
                                                                        </div>

                                                                        <label class="fabricDesign checkBoxDesign">
                                                                            <input type="checkbox" name="fabricMaterial[]" value="fabric1">
                                                                            <figure class="my-0"><img src="images/Patterns/fabric1.png" alt=""></figure>
                                                                            <h6 class="fabricName">Dura Light</h6>
                                                                        </label>

                                                                        <label class="fabricDesign checkBoxDesign">
                                                                            <input type="checkbox" name="fabricMaterial[]" value="fabric2">
                                                                            <figure class="my-0"><img src="images/Patterns/fabric2.png" alt=""></figure>
                                                                            <h6 class="fabricName">Dura Light Plus</h6>
                                                                        </label>

                                                                        <label class="fabricDesign checkBoxDesign">
                                                                            <input type="checkbox" name="fabricMaterial[]" value="fabric3">
                                                                            <figure class="my-0"><img src="images/Patterns/fabric4.png" alt=""></figure>
                                                                            <h6 class="fabricName">Air Knit Pro</h6>
                                                                        </label>

                                                                        <label class="fabricDesign checkBoxDesign">
                                                                            <input type="checkbox" name="fabricMaterial[]" value="fabric4">
                                                                            <figure class="my-0"><img src="images/Patterns/fabric5.png" alt=""></figure>
                                                                            <h6 class="fabricName">Air Knit Pro Max</h6>
                                                                        </label>

                                                                        <label class="fabricDesign checkBoxDesign">
                                                                            <input type="checkbox" name="fabricMaterial[]" value="fabric5">
                                                                            <figure class="my-0"><img src="images/Patterns/fabric6.png" alt=""></figure>
                                                                            <h6 class="fabricName">Air Knit Pro ‘X’</h6>
                                                                        </label>
                                                                        <label class="fabricDesign checkBoxDesign">
                                                                            <input type="checkbox" name="fabricMaterial[]" value="fabric6">
                                                                            <figure class="my-0"><img src="images/Patterns/fabric7.png" alt=""></figure>
                                                                            <h6 class="fabricName">Concave Pro Emboss</h6>
                                                                        </label>
                                                                        <label class="fabricDesign checkBoxDesign">
                                                                            <input type="checkbox" name="fabricMaterial[]" value="fabric7">
                                                                            <figure class="my-0"><img src="images/Patterns/fabric8.png" alt=""></figure>
                                                                            <h6 class="fabricName">Endurance Pro PK</h6>
                                                                        </label>
                                                                        <label class="fabricDesign checkBoxDesign">
                                                                            <input type="checkbox" name="fabricMaterial[]" value="fabric8">
                                                                            <figure class="my-0"><img src="images/Patterns/fabric9.png" alt=""></figure>
                                                                            <h6 class="fabricName">Poly-Pro Mesh</h6>
                                                                        </label>
                                                                        <label class="fabricDesign checkBoxDesign">
                                                                            <input type="checkbox" name="fabricMaterial[]" value="fabric9">
                                                                            <figure class="my-0"><img src="images/Patterns/fabric10.png" alt=""></figure>
                                                                            <h6 class="fabricName">Poly-Pro Stretch Mesh</h6>
                                                                        </label>
                                                                        <label class="fabricDesign checkBoxDesign">
                                                                            <input type="checkbox" name="fabricMaterial[]" value="fabric10">
                                                                            <figure class="my-0"><img src="images/Patterns/fabric11.png" alt=""></figure>
                                                                            <h6 class="fabricName">Pro Stretch RIB</h6>
                                                                        </label>
                                                                        <label class="fabricDesign checkBoxDesign">
                                                                            <input type="checkbox" name="fabricMaterial[]" value="fabric11">
                                                                            <figure class="my-0"><img src="images/Patterns/fabric12.png" alt=""></figure>
                                                                            <h6 class="fabricName">Tuff Shell</h6>
                                                                        </label>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- MAIN: COLORS -->
                                            <div class="tab-pane fade" id="main-colors" role="tabpanel" aria-labelledby="main-colors-tab">
                                                <!-- Colors Content -->
                                                <div class="season_content" id="colorsContent">
                                                    <div class="subTabsContent">
                                                        <div class="">
                                                            <h6 class=" subTabsTitle">Customize colors for your jersey</h6>
                                                            <div style="white-space: nowrap;" class="d-none">
                                                                <label class="switch cursor">
                                                                    Advance
                                                                    <input type="checkbox" id="meshColorSwitch">
                                                                    <span class="slider round"></span>
                                                                </label>
                                                            </div>
                                                        </div>


                                                        <div class="contentMain">
                                                            <div class="grid3 colorFaces" id="meshColorOptions" style="display: none;">
                                                                <!-- Dynamic mesh options will be inserted here -->
                                                            </div>
                                                            <div class="grid3 colorFaces" id="myZones">
                                                                <label class="colorsMeshItems">
                                                                    <input type="radio" name="zoneRadio" value="zone1" checked>
                                                                    <div class="meshActiveColor" id="colorPreview-zone1"></div>
                                                                    <h6 class="meshActiveFaceName">Zone 1</h6>
                                                                </label>
                                                                <label class="colorsMeshItems">
                                                                    <input type="radio" name="zoneRadio" value="zone2">
                                                                    <div class="meshActiveColor" id="colorPreview-zone2"></div>
                                                                    <h6 class="meshActiveFaceName">Zone 2</h6>
                                                                </label>
                                                                <label class="colorsMeshItems">
                                                                    <input type="radio" name="zoneRadio" value="zone3">
                                                                    <div class="meshActiveColor" id="colorPreview-zone3"></div>
                                                                    <h6 class="meshActiveFaceName">Zone 3</h6>
                                                                </label>


                                                                <label class="colorsMeshItems">
                                                                    <input type="radio" name="zoneRadio" value="zone4">
                                                                    <div class="meshActiveColor" id="colorPreview-zone4"></div>
                                                                    <h6 class="meshActiveFaceName">Zone 4</h6>
                                                                </label>
                                                                <label class="colorsMeshItems">
                                                                    <input type="radio" name="zoneRadio" value="zone5">
                                                                    <div class="meshActiveColor" id="colorPreview-zone5"></div>
                                                                    <h6 class="meshActiveFaceName">Zone 5</h6>
                                                                </label>
                                                                <label class="colorsMeshItems">
                                                                    <input type="radio" name="zoneRadio" value="zone6">
                                                                    <div class="meshActiveColor" id="colorPreview-zone6"></div>
                                                                    <h6 class="meshActiveFaceName">Zone 6</h6>
                                                                </label>
                                                                <label class="colorsMeshItems">
                                                                    <input type="radio" name="zoneRadio" value="zone7">
                                                                    <div class="meshActiveColor" id="colorPreview-zone7"></div>
                                                                    <h6 class="meshActiveFaceName">Zone 7</h6>
                                                                </label>

                                                                <label class="colorsMeshItems">
                                                                    <input type="radio" name="zoneRadio" value="zone8">
                                                                    <div class="meshActiveColor" id="colorPreview-zone8"></div>
                                                                    <h6 class="meshActiveFaceName">Zone 8</h6>
                                                                </label>
                                                                <label class="colorsMeshItems">
                                                                    <input type="radio" name="zoneRadio" value="zone9">
                                                                    <div class="meshActiveColor" id="colorPreview-zone9"></div>
                                                                    <h6 class="meshActiveFaceName">Zone 9</h6>
                                                                </label>
                                                                <label class="colorsMeshItems">
                                                                    <input type="radio" name="zoneRadio" value="zone10">
                                                                    <div class="meshActiveColor" id="colorPreview-zone10"></div>
                                                                    <h6 class="meshActiveFaceName">Zone 10</h6>
                                                                </label>
                                                                <div class="subCategory zone3 subZonesDiv ">
                                                                    <label class="colorsMeshItems">
                                                                        <input type="radio" name="zoneRadio" value="stripes1">
                                                                        <div class="meshActiveColor" id="colorPreview-stripes1"></div>
                                                                        <h6 class="meshActiveFaceName">Stripes 1</h6>
                                                                    </label>
                                                                    <label class="colorsMeshItems">
                                                                        <input type="radio" name="zoneRadio" value="stripes2">
                                                                        <div class="meshActiveColor" id="colorPreview-stripes2"></div>
                                                                        <h6 class="meshActiveFaceName">Stripes 2</h6>
                                                                    </label>
                                                                    <label class="colorsMeshItems">
                                                                        <input type="radio" name="zoneRadio" value="stripes3">
                                                                        <div class="meshActiveColor" id="colorPreview-stripes3"></div>
                                                                        <h6 class="meshActiveFaceName">Stripes 3</h6>
                                                                    </label>
                                                                </div>
                                                                <div class="subCategory zone6 subZonesDiv ">
                                                                    <label class="colorsMeshItems">
                                                                        <input type="radio" name="zoneRadio" value="Shoulder1">
                                                                        <div class="meshActiveColor" id="colorPreview-Shoulder1"></div>
                                                                        <h6 class="meshActiveFaceName">Shoulder 1</h6>
                                                                    </label>
                                                                    <label class="colorsMeshItems">
                                                                        <input type="radio" name="zoneRadio" value="Shoulder2">
                                                                        <div class="meshActiveColor" id="colorPreview-Shoulder2"></div>
                                                                        <h6 class="meshActiveFaceName">Shoulder 2</h6>
                                                                    </label>
                                                                    <label class="colorsMeshItems">
                                                                        <input type="radio" name="zoneRadio" value="Shoulder3">
                                                                        <div class="meshActiveColor" id="colorPreview-Shoulder3"></div>
                                                                        <h6 class="meshActiveFaceName">Shoulder 3</h6>
                                                                    </label>
                                                                </div>
                                                                <div class="subCategory zone7 subZonesDiv ">
                                                                    <label class="colorsMeshItems">
                                                                        <input type="radio" name="zoneRadio" value="collar1">
                                                                        <div class="meshActiveColor" id="colorPreview-collar1"></div>
                                                                        <h6 class="meshActiveFaceName">Collar 1</h6>
                                                                    </label>
                                                                    <!-- <label class="colorsMeshItems">
                                                                        <input type="radio" name="zoneRadio" value="collar2">
                                                                        <div class="meshActiveColor" id="colorPreview-collar2"></div>
                                                                        <h6 class="meshActiveFaceName">Collar 2</h6>
                                                                    </label>
                                                                    <label class="colorsMeshItems">
                                                                        <input type="radio" name="zoneRadio" value="collar3">
                                                                        <div class="meshActiveColor" id="colorPreview-collar3"></div>
                                                                        <h6 class="meshActiveFaceName">Collar 3</h6>
                                                                    </label> -->
                                                                </div>
                                                            </div>


                                                            <div class="MeshFaceColorPalette SinlgeColors mesh-color-palette defSection">
                                                                <div class="border">
                                                                    <div id="zoneTitle" class="title titlePrimary">Choose color for Zone</div>


                                                                    <div class="meshColorPalette color-palette mesh-color-palette">
                                                                        <!-- Column 1 -->
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#006B3F" data-title="PMS 350C Forest Green">
                                                                                <div class="palette forestGreen" data-color="#006B3F" title="PMS 350C Forest Green"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#154734" data-title="PMS 343C Dark Green">
                                                                                <div class="palette darkGreen" data-color="#154734" title="PMS 343C Dark Green"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#007A33" data-title="PMS 342C Dallas Green">
                                                                                <div class="palette dallasGreen" data-color="#007A33" title="PMS 342C Dallas Green"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#4C9F38" data-title="PMS 355C Kelly Green">
                                                                                <div class="palette kellyGreen" data-color="#4C9F38" title="PMS 355C Kelly Green"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#78D64B" data-title="PMS 802C Neon Green">
                                                                                <div class="palette neonGreen" data-color="#78D64B" title="PMS 802C Neon Green"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#66B032" data-title="PMS 7482C Mission Green">
                                                                                <div class="palette missionGreen" data-color="#66B032" title="PMS 7482C Mission Green"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#8E7CC3" data-title="PMS 265C Light Purple">
                                                                                <div class="palette lightPurple" data-color="#8E7CC3" title="PMS 265C Light Purple"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#3F2A56" data-title="PMS 274C Kings Purple">
                                                                                <div class="palette kingsPurple" data-color="#3F2A56" title="PMS 274C Kings Purple"></div>
                                                                            </label>
                                                                        </div>

                                                                        <!-- Column 2 -->
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#B9D9EB" data-title="PMS 284C Columbia Blue">
                                                                                <div class="palette columbiaBlue" data-color="#B9D9EB" title="PMS 284C Columbia Blue"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#00205B" data-title="PMS 2766C Dark Royal">
                                                                                <div class="palette darkRoyal" data-color="#00205B" title="PMS 2766C Dark Royal"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#3A5DAE" data-title="PMS 287C Varsity Royal">
                                                                                <div class="palette varsityRoyal" data-color="#3A5DAE" title="PMS 287C Varsity Royal"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#007BA7" data-title="PMS 3005C Ocean Blue">
                                                                                <div class="palette oceanBlue" data-color="#007BA7" title="PMS 3005C Ocean Blue"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems onlyShowInTertiary">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#9BCBEB" data-title="PMS 277C Powder Blue">
                                                                                <div class="palette powderBlue" data-color="#9BCBEB" title="PMS 277C Powder Blue"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#1C2D8C" data-title="PMS 7682C Pro Blue">
                                                                                <div class="palette proBlue" data-color="#1C2D8C" title="PMS 7682C Pro Blue"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#00AEEF" data-title="PMS 306C Alaska Blue">
                                                                                <div class="palette alaskaBlue" data-color="#00AEEF" title="PMS 306C Alaska Blue"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#330072" data-title="PMS 2695C Indigo Purple">
                                                                                <div class="palette indigoPurple" data-color="#330072" title="PMS 2695C Indigo Purple"></div>
                                                                            </label>
                                                                        </div>

                                                                        <!-- Column 3 -->
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#862633" data-title="PMS 7427C Indiana Red">
                                                                                <div class="palette indianaRed" data-color="#862633" title="PMS 7427C Indiana Red"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#C8102E" data-title="PMS 186C Scarlet Red">
                                                                                <div class="palette scarletRed" data-color="#C8102E" title="PMS 186C Scarlet Red"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#C41E3A" data-title="PMS 200C University Red">
                                                                                <div class="palette universityRed" data-color="#C41E3A" title="PMS 200C University Red"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#BF5700" data-title="PMS 1585C Burnt Orange">
                                                                                <div class="palette burntOrange" data-color="#BF5700" title="PMS 1585C Burnt Orange"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#FF5F00" data-title="PMS 811C Neon Orange">
                                                                                <div class="palette neonOrange" data-color="#FF5F00" title="PMS 811C Neon Orange"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#FF6A13" data-title="PMS 165C Bright Orange">
                                                                                <div class="palette brightOrange" data-color="#FF6A13" title="PMS 165C Bright Orange"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#FF69B4" data-title="PMS 806C Hot Pink">
                                                                                <div class="palette hotPink" data-color="#FF69B4" title="PMS 806C Hot Pink"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#800000" data-title="PMS 7644C Maroon">
                                                                                <div class="palette maroon" data-color="#800000" title="PMS 7644C Maroon"></div>
                                                                            </label>
                                                                        </div>

                                                                        <!-- Column 3 extra -->
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#007398" data-title="PMS 7710C Teal Blue">
                                                                                <div class="palette tealBlue" data-color="#007398" title="PMS 7710C Teal Blue"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#582C83" data-title="PMS 268C Purple">
                                                                                <div class="palette purple" data-color="#582C83" title="PMS 268C Purple"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#F5F5F5" data-title="White Smoke">
                                                                                <div class="palette whiteSmoke" data-color="#F5F5F5" title="White Smoke"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#8C92AC" data-title="Cool Grey">
                                                                                <div class="palette coolGrey" data-color="#8C92AC" title="Cool Grey"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#FFA500" data-title="Tangerine">
                                                                                <div class="palette tangerine" data-color="#FFA500" title="Tangerine"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#FFF700" data-title="Bright Yellow">
                                                                                <div class="palette brightYellow" data-color="#FFF700" title="Bright Yellow"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#FFDAB9" data-title="Peach">
                                                                                <div class="palette peach" data-color="#FFDAB9" title="Peach"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#FFC1CC" data-title="Bubblegum Pink">
                                                                                <div class="palette bubblegum" data-color="#FFC1CC" title="Bubblegum Pink"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#F4C2C2" data-title="Baby Pink">
                                                                                <div class="palette babyPink" data-color="#F4C2C2" title="Baby Pink"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#E6E6FA" data-title="Lavender">
                                                                                <div class="palette lavender" data-color="#E6E6FA" title="Lavender"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#87CEEB" data-title="Sky Blue">
                                                                                <div class="palette skyBlue" data-color="#87CEEB" title="Sky Blue"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#191970" data-title="Midnight Blue">
                                                                                <div class="palette midnightBlue" data-color="#191970" title="Midnight Blue"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#7DF9FF" data-title="Electric Blue">
                                                                                <div class="palette electricBlue" data-color="#7DF9FF" title="Electric Blue"></div>
                                                                            </label>
                                                                        </div>

                                                                        <!-- Column 4 -->
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#FFD100" data-title="PMS 116C Yellow">
                                                                                <div class="palette yellow" data-color="#FFD100" title="PMS 116C Yellow"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#F4EBD0" data-title="PMS 7506C Cream">
                                                                                <div class="palette cream" data-color="#F4EBD0" title="PMS 7506C Cream"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#EFE1B9" data-title="PMS 468C Vintage Cream">
                                                                                <div class="palette vintageCream" data-color="#EFE1B9" title="PMS 468C Vintage Cream"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#C5B358" data-title="PMS 4515C Vegas Gold">
                                                                                <div class="palette vegasGold" data-color="#C5B358" title="PMS 4515C Vegas Gold"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#B4975A" data-title="PMS 465C Dust Gold">
                                                                                <div class="palette dustGold" data-color="#B4975A" title="PMS 465C Dust Gold"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#FFD700" data-title="PMS 7548C Varsity Gold">
                                                                                <div class="palette varsityGold" data-color="#FFD700" title="PMS 7548C Varsity Gold"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#DAA520" data-title="PMS 874C Nugget Gold">
                                                                                <div class="palette nuggetGold" data-color="#DAA520" title="PMS 874C Nugget Gold"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#FFCB05" data-title="PMS 7406C Michigan Maze">
                                                                                <div class="palette michiganMaze" data-color="#FFCB05" title="PMS 7406C Michigan Maze"></div>
                                                                            </label>
                                                                        </div>

                                                                        <!-- Column 5 -->
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#B7B1A9" data-title="Cool Grey 11C Mod Grey">
                                                                                <div class="palette modGrey" data-color="#B7B1A9" title="Cool Grey 11C Mod Grey"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#999999" data-title="PMS 7543C Pro Grey">
                                                                                <div class="palette proGrey" data-color="#999999" title="PMS 7543C Pro Grey"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#C0C0C0" data-title="PMS 421C Silver">
                                                                                <div class="palette silver" data-color="#C0C0C0" title="PMS 421C Silver"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems onlyShowInTertiary">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#FFFFFF" data-title="White">
                                                                                <div class="palette white" data-color="#FFFFFF" title="White"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#101820" data-title="PMS 426C Altuva">
                                                                                <div class="palette altuva" data-color="#101820" title="PMS 426C Altuva"></div>
                                                                            </label>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <label>
                                                                                <input type="checkbox" class="colorCheckbox" value="#000000" data-title="Black">
                                                                                <div class="palette black" data-color="#000000" title="Black"></div>
                                                                            </label>
                                                                        </div>
                                                                    </div>



                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- MAIN: LOGO -->
                                            <div class="tab-pane fade" id="main-logo" role="tabpanel" aria-labelledby="main-logo-tab">
                                                <!-- Logo Content -->
                                                <div class="season_content" id="logoContent">
                                                    <div class="subTabsContent">
                                                        <div class="season_content">
                                                            <div class="logoUploadSection">
                                                                <h6 class="subTabsTitle">Upload</h6>
                                                                <div class="uploadLogoMainDiv position-relative ">
                                                                    <div class="logoFirstScreen" id="logoFirstScreen">
                                                                        <!-- <label for="fileInput" class="uploadLabel">Upload</label> -->
                                                                        <form class="uploadLogoForm">
                                                                            <div class="custom-file-input">
                                                                                <input type="file" id="fileInput" accept="image/*" />
                                                                                <label for="fileInput" class="custom-file-label"> </label>
                                                                                <button type="button" class="submitFrom">Browse</button>
                                                                            </div>
                                                                        </form>
                                                                        <div class="note f13">
                                                                            * Files such as PNG, SVG, etc., are accepted. We also support
                                                                            other
                                                                            common image formats for your convenience.
                                                                        </div>
                                                                        <!-- <div class="activeImgLogos grid2">

                                                                            <div class="logosItems">
                                                                                <div class="upper flexRow justify-content-between">
                                                                                    <p class="logoPosition my-auto">Left Shoulder</p>
                                                                                    <figure class="bottomLeftButton my-auto">
                                                                                        <img src="images/icons/deletIcon.png" alt="deleteDecalIcon" class="textMeshesItemsIcon TextRemoveValue" style="width: 15px;">
                                                                                    </figure>
                                                                                </div>
                                                                                <figure class="m-auto mainLogo"><img src="images/icons/defLogo.png" alt=""></figure>
                                                                            </div>
                                                                            <div class="logosItems">
                                                                                <div class="upper flexRow justify-content-between">
                                                                                    <p class="logoPosition my-auto">Right Shoulder</p>
                                                                                    <figure class="bottomLeftButton my-auto">
                                                                                        <img src="images/icons/deletIcon.png" alt="deleteDecalIcon" class="textMeshesItemsIcon TextRemoveValue" style="width: 15px;">
                                                                                    </figure>
                                                                                </div>
                                                                                <figure class="m-auto mainLogo"><img src="images/icons/defLogo.png" alt=""></figure>
                                                                            </div>
                                                                        </div> -->
                                                                    </div>


                                                                    <div class="logoSecondScreen decalsPlacementsMeshes  " style="display: none;" id="logoSecondScreen">
                                                                        <div class="goBAckBtn  backBtn1 backToFirstScreen flexRow">
                                                                            <a href="#" class="backBtn1 m-0 ">
                                                                                <figure class="my-auto">
                                                                                    <img
                                                                                        src="images/icons/arrowLeft.png" alt="Arrow Left" />
                                                                                </figure>
                                                                                Go
                                                                                Back
                                                                            </a>
                                                                            <h6 class="noteText my-auto"> "Quick Unselect: Just Double-Click"</h6>

                                                                        </div>
                                                                        <div class="textMeshesItems">
                                                                            <div class="flexRow justify-content-between">
                                                                                <h6 class="meshItemsTitle grey2 f14 my-auto">Uploaded Logos</h6>
                                                                                <button id="deleteImageButton" class="deleteDecalIcon position-relative m-0 w-auto" style="background: none; border:none;">
                                                                                    <figure class="bottomLeftButton my-auto">
                                                                                        <img src="images/icons/deletIcon.png" alt="deleteDecalIcon"
                                                                                            class="textMeshesItemsIcon TextRemoveValue" style="width: 15px;">
                                                                                    </figure>
                                                                                </button>
                                                                            </div>

                                                                            <div class="text-center UploadImgArea">
                                                                                <figure class="text-center d-flex my-0" style="position: relative; width: 100%;">
                                                                                    <img src="" alt="Uploaded Image Preview" class="uploadImgPreview" id="uploadedImagePreview"
                                                                                        style="  display: none;">
                                                                                    <div id="imagePreviewBorder" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                                                                border: 2px dashed blue; display: none; pointer-events: none;"></div>
                                                                                </figure>
                                                                            </div>
                                                                        </div>

                                                                        <form class="uploadLogoForm" style="margin: 15px 0;">
                                                                            <div class="custom-file-input">
                                                                                <input type="file" id="fileInput" accept="image/*">
                                                                                <button type="button" class="  " id="applyLogoButton">Apply Logo</button>
                                                                            </div>
                                                                        </form>
                                                                    </div>

                                                                    <div class="logoThirdScreen" style="display: none;">
                                                                        <div class="decalsPlacementsMeshes">
                                                                            <div class="contentHeader">
                                                                                <h6>Please Choose Logo Placements</h6>
                                                                            </div>
                                                                            <div class="selectArea  " id="ImagePlacementsMeshes" style="display: none;">
                                                                                <div id="dynamicImageMeshButtons" class="selectArea grid2"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="logoFourthScreen" style="display: none;" id="logoFourthScreen">

                                                                        <div class="resize defImgDecalItems ">
                                                                            <label for="resizeImgSlider ">Resize </label>
                                                                            <div class="imgControl">
                                                                                <input type="range" class="w-100  " id="resizeImgSlider" min="10" max="200" step="1" value="50">
                                                                                <span id="resizeValue">50%</span>
                                                                            </div>
                                                                        </div>
                                                                        <div class="rotate  defImgDecalItems">
                                                                            <label for="rotateImgSlider ">Rotate </label>
                                                                            <div class="imgControl">
                                                                                <input type="range" class="w-100  " id="rotateImgSlider" min="0" max="360" step="1" value="0">
                                                                                <span id="rotateImgValue">0°</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div class="appliedDecalsList" id="appliedDecalsListImg">
                                                            <!-- Dynamic text/image decal entries will appear here -->
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- MAIN: NAME -->
                                            <div class="tab-pane fade" id="textContent" role="tabpanel" aria-labelledby="textContent-tab">
                                                <!-- Name Content -->
                                                <div class="season_content" id="textContent">
                                                    <div class="subTabsContent">
                                                        <div class="textDecalFirstScreen" id="screen1">
                                                            <h6 class="subTabsTitle">Add Text</h6>
                                                            <div class="input-container">
                                                                <label for="decalText2" class="sp">Enter text to display on the
                                                                    jersey.</label>
                                                                <input type="text" id="textInput" placeholder="Enter your text here" />

                                                                <div class="grid2">
                                                                    <button id="updateTextButton" class="updateTxt btnBlack2 defBtnStyle">UPDATE</button>
                                                                    <button id="applyTextButton" class="btnBlack defBtnStyle">APPLY</button>


                                                                </div>
                                                            </div>
                                                            <div class="TextinusMeshesItems" id="screen4">
                                                                <div class="appliedDecalsList" id="appliedDecalsList">
                                                                    <!-- Dynamic text/image decal entries will appear here -->
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div class="textDecalSecondScreen  " id="screen2" style="display: none;">


                                                            <!-- For text decal placement -->
                                                            <div class="decalsPlacementsMeshes">

                                                                <div class="contentHeader">
                                                                    <h6 class="placement-header" id="textPlacement">Please Choose Text Placements</h6>
                                                                    <h6 class="placement-header" id="namePlacement">Please Choose Name Placements</h6>
                                                                    <h6 class="placement-header" id="numberPlacement">Please Choose Number Placements</h6>
                                                                </div>

                                                                <div class="selectArea grid2" id="dynamicMeshButtons">

                                                                    <!-- Dynamic text placement buttons will be inserted here -->
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="textDecalThirdScreen  " id="screen3" style="display: none;">
                                                            <div class="decalControls NameThirdScreen textDecalControls ">
                                                                <div class="flexRow justify-content-between   ">
                                                                    <div class="goBAckBtn m-0 flexRow  justify-content-between w-100">
                                                                        <a href="#" id="goBackButton" class="backBtn1 m-0">
                                                                            <i class="fa fa-angle-left" aria-hidden="true"></i> Go Back
                                                                        </a>
                                                                        <h6 class="noteText mb-2"> "Quick Unselect: Just Double-Click"</h6>
                                                                    </div>
                                                                </div>
                                                                <div class="textMeshes">

                                                                    <div class="grid2 " id="border-buttons">
                                                                        <div class="textMeshesItems ">
                                                                            <div class="flexRow justify-content-between">
                                                                                <h6 class="meshItemsTitle">Text</h6>
                                                                                <button id="deleteTextButton" class="deleteBtn deleteDecalIcon my-auto" style="background: none; border:none;">
                                                                                    <figure id="bottomLeftButton" class="bottomLeftButton">
                                                                                        <img src="images/icons/deletIcon.png" alt="deleteDecalIcon"
                                                                                            class="textMeshesItemsIcon TextRemoveValue">
                                                                                    </figure>
                                                                                </button>
                                                                            </div>


                                                                            <div class="textDecalMesh">
                                                                                <h3 class="decalText"> </h3>
                                                                            </div>
                                                                        </div>
                                                                        <div class="textMeshesItems">
                                                                            <h6 class="meshItemsTitle">Color</h6>
                                                                            <div class="colorUse bg-none border-none w-100 flexRow m-0 px-0 f14 " type="button" data-bs-toggle="collapse" data-bs-target="#textColorControlsShow" aria-expanded="false" aria-controls="textColorControlsShow">

                                                                                <div class="colorPicker"></div>
                                                                            </div>

                                                                        </div>

                                                                    </div>
                                                                </div>


                                                                <div class="controlItems mb-0">
                                                                    <button class=" bg-none border-none w-100 flexRow m-0 px-0 f14 " type="button" data-bs-toggle="collapse" data-bs-target="#textColorControlsShow" aria-expanded="false" aria-controls="textColorControlsShow">
                                                                        Change Text Color
                                                                    </button>
                                                                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                                                                </div>

                                                                <div class="collapse" id="textColorControlsShow">
                                                                    <div class="textColorPalette border input-container chooseColor  m-0 " data-decal-id="decal2">
                                                                        <label class="titlePrimary w-100 m-0 ">Choose Color:</label>
                                                                        <div class=" text-color-palette color-palette">
                                                                            <!-- Column 1 -->
                                                                            <div class="colorItems">
                                                                                <div class="palette forestGreen" data-color="#006B3F" title="PMS 350C Forest Green"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette darkGreen" data-color="#154734" title="PMS 343C Dark Green"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette dallasGreen" data-color="#007A33" title="PMS 342C Dallas Green"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette kellyGreen" data-color="#4C9F38" title="PMS 355C Kelly Green"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette neonGreen" data-color="#78D64B" title="PMS 802C Neon Green"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette missionGreen" data-color="#66B032" title="PMS 7482C Mission Green"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette lightPurple" data-color="#8E7CC3" title="PMS 265C Light Purple"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette kingsPurple" data-color="#3F2A56" title="PMS 274C Kings Purple"></div>
                                                                            </div>

                                                                            <!-- Column 2 -->
                                                                            <div class="colorItems">
                                                                                <div class="palette columbiaBlue" data-color="#B9D9EB" title="PMS 284C Columbia Blue"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette darkRoyal" data-color="#00205B" title="PMS 2766C Dark Royal"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette varsityRoyal" data-color="#3A5DAE" title="PMS 287C Varsity Royal"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette oceanBlue" data-color="#007BA7" title="PMS 3005C Ocean Blue"></div>
                                                                            </div>
                                                                            <div class="colorItems onlyShowInTertiary">
                                                                                <div class="palette powderBlue" data-color="#9BCBEB" title="PMS 277C Powder Blue"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette proBlue" data-color="#1C2D8C" title="PMS 7682C Pro Blue"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette alaskaBlue" data-color="#00AEEF" title="PMS 306C Alaska Blue"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette indigoPurple" data-color="#330072" title="PMS 2695C Indigo Purple"></div>
                                                                            </div>

                                                                            <!-- Column 3 -->
                                                                            <div class="colorItems">
                                                                                <div class="palette indianaRed" data-color="#862633" title="PMS 7427C Indiana Red"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette scarletRed" data-color="#C8102E" title="PMS 186C Scarlet Red"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette universityRed" data-color="#C41E3A" title="PMS 200C University Red"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette burntOrange" data-color="#BF5700" title="PMS 1585C Burnt Orange"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette neonOrange" data-color="#FF5F00" title="PMS 811C Neon Orange"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette brightOrange" data-color="#FF6A13" title="PMS 165C Bright Orange"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette hotPink" data-color="#FF69B4" title="PMS 806C Hot Pink"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette maroon" data-color="#800000" title="PMS 7644C Maroon"></div>
                                                                            </div>
                                                                            <!-- Add these to your .meshColorPalette block -->

                                                                            <div class="colorItems">
                                                                                <div class="palette tealBlue" data-color="#007398" title="PMS 7710C Teal Blue"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette purple" data-color="#582C83" title="PMS 268C Purple"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette whiteSmoke" data-color="#F5F5F5" title="White Smoke"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette coolGrey" data-color="#8C92AC" title="Cool Grey"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette tangerine" data-color="#FFA500" title="Tangerine"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette brightYellow" data-color="#FFF700" title="Bright Yellow"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette peach" data-color="#FFDAB9" title="Peach"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette bubblegum" data-color="#FFC1CC" title="Bubblegum Pink"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette babyPink" data-color="#F4C2C2" title="Baby Pink"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette lavender" data-color="#E6E6FA" title="Lavender"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette skyBlue" data-color="#87CEEB" title="Sky Blue"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette midnightBlue" data-color="#191970" title="Midnight Blue"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette electricBlue" data-color="#7DF9FF" title="Electric Blue"></div>
                                                                            </div>

                                                                            <!-- Column 4 -->
                                                                            <div class="colorItems">
                                                                                <div class="palette yellow" data-color="#FFD100" title="PMS 116C Yellow"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette cream" data-color="#F4EBD0" title="PMS 7506C Cream"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette vintageCream" data-color="#EFE1B9" title="PMS 468C Vintage Cream"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette vegasGold" data-color="#C5B358" title="PMS 4515C Vegas Gold"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette dustGold" data-color="#B4975A" title="PMS 465C Dust Gold"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette varsityGold" data-color="#FFD700" title="PMS 7548C Varsity Gold"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette nuggetGold" data-color="#DAA520" title="PMS 874C Nugget Gold"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette michiganMaze" data-color="#FFCB05" title="PMS 7406C Michigan Maze"></div>
                                                                            </div>

                                                                            <!-- Column 5 -->
                                                                            <div class="colorItems">
                                                                                <div class="palette modGrey" data-color="#B7B1A9" title="Cool Grey 11C Mod Grey"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette proGrey" data-color="#999999" title="PMS 7543C Pro Grey"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette silver" data-color="#C0C0C0" title="PMS 421C Silver"></div>
                                                                            </div>
                                                                            <div class="colorItems onlyShowInTertiary">
                                                                                <div class="palette white" data-color="#FFFFFF" title="White"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette altuva" data-color="#101820" title="PMS 426C Altuva"></div>
                                                                            </div>
                                                                            <div class="colorItems">
                                                                                <div class="palette black" data-color="#000000" title="Black"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="TextDecalControls">

                                                                    <div class="controlItems">
                                                                        <h6 class="controlsTitle1"> Align</h6>
                                                                        <button id="centerDecalButton" class="controlsBtn">
                                                                            <i class="fa fa-align-center" aria-hidden="true"></i>
                                                                        </button>
                                                                    </div>

                                                                </div>



                                                                <div class="lowerControls">

                                                                    <div class="TextSizeHandle patternSizeHandle">
                                                                        <div class="ResizePatterHandle items controlItems">
                                                                            <h6 class="title m-0">Font Size</h6>
                                                                            <div class="flex">
                                                                                <button class="minus TextDecalSizeMinus">
                                                                                    <img src="images/icons/minusIconBtnIcon.png"
                                                                                        alt="" />
                                                                                </button>
                                                                                <button class="plus TextDecalSizePlus">
                                                                                    <img src="images/icons/plusIconBtnIcon.png"
                                                                                        alt="" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                    <div class="controlItems mb-0">
                                                                        <button class=" bg-none border-none w-100 flexRow m-0 px-0 f14  " type="button" data-bs-toggle="collapse" data-bs-target="#textOutlineControlsShow" aria-expanded="false" aria-controls="textOutlineControlsShow">
                                                                            Outline Settings
                                                                            <i class="fa fa-angle-right" aria-hidden="true"></i>
                                                                        </button>
                                                                        <button class=" bg-none border-none w-100 flexRow m-0 px-0 f14  justify-content-end " type="button" data-bs-toggle="collapse" data-bs-target="#textOutlineControlsShow" aria-expanded="false" aria-controls="textOutlineControlsShow">

                                                                            <i class="fa fa-eye" aria-hidden="true" id="toggleOutlineButton"></i>
                                                                        </button>

                                                                    </div>
                                                                    <div class="collapse" id="textOutlineControlsShow">
                                                                        <div class=" ">
                                                                            <div class="outline-controls">
                                                                                <div class="control-group border">
                                                                                    <label class="titlePrimary w-100 m-0 ">Outline Color:</label>
                                                                                    <div class="outlineColor text-color-palette color-palette">
                                                                                        <!-- Column 1 -->
                                                                                        <div class="colorItems">
                                                                                            <div class="palette forestGreen" data-color="#006B3F" title="PMS 350C Forest Green"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette darkGreen" data-color="#154734" title="PMS 343C Dark Green"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette dallasGreen" data-color="#007A33" title="PMS 342C Dallas Green"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette kellyGreen" data-color="#4C9F38" title="PMS 355C Kelly Green"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette neonGreen" data-color="#78D64B" title="PMS 802C Neon Green"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette missionGreen" data-color="#66B032" title="PMS 7482C Mission Green"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette lightPurple" data-color="#8E7CC3" title="PMS 265C Light Purple"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette kingsPurple" data-color="#3F2A56" title="PMS 274C Kings Purple"></div>
                                                                                        </div>

                                                                                        <!-- Column 2 -->
                                                                                        <div class="colorItems">
                                                                                            <div class="palette columbiaBlue" data-color="#B9D9EB" title="PMS 284C Columbia Blue"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette darkRoyal" data-color="#00205B" title="PMS 2766C Dark Royal"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette varsityRoyal" data-color="#3A5DAE" title="PMS 287C Varsity Royal"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette oceanBlue" data-color="#007BA7" title="PMS 3005C Ocean Blue"></div>
                                                                                        </div>
                                                                                        <div class="colorItems onlyShowInTertiary">
                                                                                            <div class="palette powderBlue" data-color="#9BCBEB" title="PMS 277C Powder Blue"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette proBlue" data-color="#1C2D8C" title="PMS 7682C Pro Blue"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette alaskaBlue" data-color="#00AEEF" title="PMS 306C Alaska Blue"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette indigoPurple" data-color="#330072" title="PMS 2695C Indigo Purple"></div>
                                                                                        </div>

                                                                                        <!-- Column 3 -->
                                                                                        <div class="colorItems">
                                                                                            <div class="palette indianaRed" data-color="#862633" title="PMS 7427C Indiana Red"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette scarletRed" data-color="#C8102E" title="PMS 186C Scarlet Red"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette universityRed" data-color="#C41E3A" title="PMS 200C University Red"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette burntOrange" data-color="#BF5700" title="PMS 1585C Burnt Orange"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette neonOrange" data-color="#FF5F00" title="PMS 811C Neon Orange"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette brightOrange" data-color="#FF6A13" title="PMS 165C Bright Orange"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette hotPink" data-color="#FF69B4" title="PMS 806C Hot Pink"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette maroon" data-color="#800000" title="PMS 7644C Maroon"></div>
                                                                                        </div>
                                                                                        <!-- Add these to your .meshColorPalette block -->

                                                                                        <div class="colorItems">
                                                                                            <div class="palette tealBlue" data-color="#007398" title="PMS 7710C Teal Blue"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette purple" data-color="#582C83" title="PMS 268C Purple"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette whiteSmoke" data-color="#F5F5F5" title="White Smoke"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette coolGrey" data-color="#8C92AC" title="Cool Grey"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette tangerine" data-color="#FFA500" title="Tangerine"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette brightYellow" data-color="#FFF700" title="Bright Yellow"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette peach" data-color="#FFDAB9" title="Peach"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette bubblegum" data-color="#FFC1CC" title="Bubblegum Pink"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette babyPink" data-color="#F4C2C2" title="Baby Pink"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette lavender" data-color="#E6E6FA" title="Lavender"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette skyBlue" data-color="#87CEEB" title="Sky Blue"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette midnightBlue" data-color="#191970" title="Midnight Blue"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette electricBlue" data-color="#7DF9FF" title="Electric Blue"></div>
                                                                                        </div>

                                                                                        <!-- Column 4 -->
                                                                                        <div class="colorItems">
                                                                                            <div class="palette yellow" data-color="#FFD100" title="PMS 116C Yellow"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette cream" data-color="#F4EBD0" title="PMS 7506C Cream"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette vintageCream" data-color="#EFE1B9" title="PMS 468C Vintage Cream"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette vegasGold" data-color="#C5B358" title="PMS 4515C Vegas Gold"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette dustGold" data-color="#B4975A" title="PMS 465C Dust Gold"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette varsityGold" data-color="#FFD700" title="PMS 7548C Varsity Gold"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette nuggetGold" data-color="#DAA520" title="PMS 874C Nugget Gold"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette michiganMaze" data-color="#FFCB05" title="PMS 7406C Michigan Maze"></div>
                                                                                        </div>

                                                                                        <!-- Column 5 -->
                                                                                        <div class="colorItems">
                                                                                            <div class="palette modGrey" data-color="#B7B1A9" title="Cool Grey 11C Mod Grey"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette proGrey" data-color="#999999" title="PMS 7543C Pro Grey"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette silver" data-color="#C0C0C0" title="PMS 421C Silver"></div>
                                                                                        </div>
                                                                                        <div class="colorItems onlyShowInTertiary">
                                                                                            <div class="palette white" data-color="#FFFFFF" title="White"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette altuva" data-color="#101820" title="PMS 426C Altuva"></div>
                                                                                        </div>
                                                                                        <div class="colorItems">
                                                                                            <div class="palette black" data-color="#000000" title="Black"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="controlItems">
                                                                                    <label class="nowrap">Outline Width:</label>
                                                                                    <div class=" ">
                                                                                        <button class="outline-minus imgIconBTn"><img src="images/icons/minusIconBtnIcon.png" alt="" class="icon2"></button>
                                                                                        <span id="outlineWidthValue">2px</span>
                                                                                        <button class="outline-plus imgIconBTn"><img src="images/icons/plusIconBtnIcon.png" alt="" class="icon2"></button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div class="TextSizeHandle patternSizeHandle">
                                                                        <div class="ResizePatterHandle items controlItems">
                                                                            <h6 class="title m-0">Pin Text</h6>
                                                                            <div class="flex">
                                                                                <div style="text-align: right;">
                                                                                    <button id="lockDecalButton">


                                                                                        <img src="images/icons/Unlock.png"
                                                                                            alt="" />
                                                                                    </button>
                                                                                    <button id="unlockDecalButton" style="display: none;">
                                                                                        <img src="images/icons/lock.png"
                                                                                            alt="" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="textFontFamily ">
                                                                        <form action="#">
                                                                            <div class="input-container NameFontFamily FontFamily controlItemsColumn controlItems m-0 ">
                                                                                <!-- <h6 class="d-block mb-2">Choose font</h6> -->
                                                                                <div class="styled-select w-100">
                                                                                    <select id="fontFamilySelect3" class="fontFamilySelect ">

                                                                                        <option value="Arial, sans-serif">Arial, sans-serif</option>
                                                                                        <option value="Impact, sans-serif">Impact, sans-serif</option>
                                                                                        <option value="'Alex Brush', cursive">'Alex Brush', cursive</option>
                                                                                        <option value="Courier New, monospace">Courier New, monospace</option>
                                                                                        <option value="Georgia, serif">Georgia, serif</option>
                                                                                        <option value="Times New Roman, serif">Times New Roman, serif</option>
                                                                                        <option value="Verdana, sans-serif">Verdana, sans-serif</option>
                                                                                        <option value="Tahoma, sans-serif">Tahoma, sans-serif</option>
                                                                                        <option value="Trebuchet MS, sans-serif">Trebuchet MS, sans-serif</option>
                                                                                        <option value="Comic Sans MS, cursive">Comic Sans MS, cursive</option>
                                                                                        <option value="Lucida Console, monospace">Lucida Console, monospace</option>
                                                                                        <option value="Palatino Linotype, serif">Palatino Linotype, serif</option>
                                                                                        <option value="Century Gothic, sans-serif">Century Gothic, sans-serif</option>
                                                                                    </select>

                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                    <div class="chooseTextTransform controlItemsColumn controlItems">
                                                                        <h6 class="title m-0">Text Style</h6>

                                                                        <div class="styleArea grid4 ">
                                                                            <span class="text-transform normal" data-transform="normal">-</span>
                                                                            <span class="text-transform lowercase" data-transform="lowercase">aa</span>
                                                                            <span class="text-transform capitalize" data-transform="capitalize">Aa</span>
                                                                            <span class="text-transform uppercase" data-transform="uppercase">AA</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="textControls controlItems">

                                                                <div class="rotate  defTextDecalItems defItems w-100">
                                                                    <label for="rotateSlider" class="f14">Rotate Text </label>
                                                                    <div class="textControl">
                                                                        <input type="range" id="rotateSlider" min="0" max="360" step="0" value="180" class="w-100">
                                                                        <span id="rotationValue">180 °</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <!-- MAIN: NUMBER -->
                                            <div class="tab-pane fade" id="textContent" role="tabpanel" aria-labelledby="textContent-tab">
                                                <!-- Number Content -->
                                                Number input here...
                                            </div>
                                        </div>
                                    </div>

                                    <div class="screenNavigateBtn">
                                        <a class="greyBtn icnBtn">
                                            <figure class="my-auto">
                                                <img src="images/Icons/arrowLeft.png" alt="">
                                            </figure> Go Back
                                        </a>
                                        <a href="" class="themeBtn icnBtn">
                                            Next <figure class="my-auto"><img src="images/Icons/arrowRightWhite.png" alt=""></figure>
                                        </a>
                                        <button class="LoadModalNow">Load Modal</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class=" col-md-8 rightSide position-relative">

                    <div id="preloader" class="preloader">
                        <div class="preloader-content">
                            <div class="preloader-spinner"></div>
                            <div class="MainContent">
                                <img src="images/logo1.png" class="mob-logo">
                                <div id="preloaderProgress" class="preloader-progress">
                                    0%
                                </div>
                                <div id="preloaderTimeRemaining" class="preloader-time">Loading...</div>
                            </div>
                        </div>
                    </div>
                    <div class="canvasControls">
                        <!-- <div class="lightAngle">
                            <label for="lightHeightSlider">Adjust Light:</label>
                            <input type="range" id="lightHeightSlider" min="0" max="10" value="0" step="0.1">
                        </div> -->

                        <div class="background-control flexColumn">
                            <label for="bgColorPicker" class="mb-2">Background Color:</label>
                            <input type="color" id="bgColorPicker" value="#eeeeee">

                        </div>
                        <div class="light-controls">
                            <div class="flexRow ">
                                <label class="  justify-content-between w-100">Light Rotation:
                                    <span id="lightRotationValue" class="angleValue">45°</span>
                                </label>
                            </div>
                            <input type="range" id="lightRotationSlider" min="0" max="360" value="45">
                            <div class="flexRow">
                                <label class=" justify-content-between w-100">Light Height:
                                    <span id="lightHeightValue" class="angleValue">5</span>
                                </label>
                            </div>
                            <input type="range" id="lightHeightSlider" min="0" max="100" value="5" step="0.1">

                            <div class="flexRow">
                                <label class=" justify-content-between w-100">Light Intensity:
                                    <span id="lightIntensityValue" class="angleValue">1</span>
                                </label>
                            </div>
                            <input type="range" id="lightIntensitySlider" min="0" max="10" value="1" step="0.1">
                        </div>
                        <div class="view-angle-controls">
                            <button class="frontAngle">Front</button>
                            <button class="backAngle">Back</button>
                            <button class="leftAngle">Left</button>
                            <button class="rightAngle">Right</button>
                        </div>
                    </div>
                    <!-- HTML -->
                    <div id="threejs-container"></div>
                    <div id="controls">
                        <button id="toggleRotationBtn"></button>
                        <button id="rotateRight">
                            <figure><img src="images/icons/moveLeft.png" alt="Rotate Right"></figure>
                        </button>
                        <button id="rotateLeft">
                            <figure><img src="images/icons/moveRight.png" alt="Rotate Left"></figure>
                        </button>
                        <button id="zoomOut">
                            <figure><img src="images/icons/zoomOut.png" alt="Zoom In"></figure>
                        </button>
                        <button id="zoomIn">
                            <figure><img src="images/icons/zoomIn.png" alt="Zoom Out"></figure>
                        </button>

                    </div>


                </div>
                <div class="row  m-auto p-0 w-100 my-4 ">

                    <div class="col-md-12">
                        <div class="innerDiv flexRow justify-content-between footSec">
                            <div class="sidebarFooter desktopView">
                                <div class="card bg-none border-none grid2">
                                    <div><span>Price/Piece : 12 USD&nbsp;</span> <br><span>Estimated delivery date: 25.07 -
                                        </span></div>
                                    <div class="offerBadge text-end">
                                        <p> 26.07.2024</p>
                                        <h6 class="f14 mb-0">10% off per piece</h6>
                                    </div>
                                </div>
                            </div>

                            <div class="saveChangeDiv">
                                <div class=" flexRow justify-content-between w-100">
                                    <div class="  flexRow ">
                                        <a href="#" class="flexRow flex_items">
                                            <figure><img src="images/icons/SaveDesignIcon.png" alt=""></figure> Save Design
                                        </a>
                                        <a href="#" class="d-flex flex_items">
                                            <figure><img src="images/icons/shareIcon.png" alt=""></figure> Share
                                        </a>
                                        <a href="#" class="d-flex flex_items">
                                            <figure><img src="images/icons/pdfDownloadIcon.png" alt=""></figure> PDF
                                        </a>
                                    </div>
                                    <div>
                                        <!-- <a href="roasterDetails.php" class="blueBtn flexRow justify-content-center ">Continue <img
                                            src="images/icons/blueBtnIcon.png" alt="">
                                    </a> -->

                                        <button class="blueBtn flexRow justify-content-center  convert_into_eps" id="continueBtnInmodel">Continue <img
                                                src="images/icons/blueBtnIcon.png" alt="">
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>


    <div class="homeMainContainer  d-none ">
        <div class="container-fluid p-0 h-100">
            <div class="row defaultScreen h-100">
                <div class="col-md-4 sideBarMain  ">
                    <div class="customHeader">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="BrandLogo">
                                <a href="index.php">
                                    <figure class="m-0">
                                        <img src="images/BrandLogo.png" alt="Company Logo" />
                                    </figure>
                                </a>
                            </div>

                            <div class="RightSide d-flex justify-content-between align-items-center">
                                <h6 class="f14">3D Configurator</h6>
                                <figure class="mx-2 mb-2">
                                    <img src="images/3dConf.png" alt="" />
                                </figure>
                            </div>
                        </div>
                    </div>

                    <div class="   sidebar_tabs tabSec p0">

                        <ul class="nav nav-pills flex-column p-0   sidebarTabs">
                            <button id="toggleBtn"><img src="images/icons/pattern.png" alt="Pattern Icon" class="tabsImgIcon"></button>

                            <li class="nav-item  ">
                                <a class="label " id="designTab" data-toggle="pill" href="#designContent">
                                    <img src="images/icons/designs.png" alt="Design Icon" class="tabsImgIcon" />
                                    Design
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="label" id="colorsTab" data-toggle="pill" href="#colorsContent">
                                    <img src="images/icons/colors.png" alt="Colors Icon" class="tabsImgIcon" />
                                    Colors
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="label" id="patternTab" data-toggle="pill" href="#patternContent">
                                    <img src="images/icons/pattern.png" alt="Pattern Icon" class="tabsImgIcon" />
                                    Fabrics
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="label" id="nameTab" data-toggle="pill" href="#textContent" data-header="Add Name">
                                    <img src="images/icons/name.png" alt="Name Icon" class="tabsImgIcon" /> Name
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="label" id="numberTab" data-toggle="pill" href="#textContent" data-header="Add Number">
                                    <img src="images/icons/number.png" alt="Number Icon" class="tabsImgIcon" /> Number
                                </a>
                            </li>
                            <li class="nav-item  ">
                                <a class="label" id="textTab" data-toggle="pill" href="#textContent" data-header="Add Text">
                                    <img src="images/icons/text.png" alt="Text Icon" class="tabsImgIcon" /> Text
                                </a>
                            </li>


                            <li class="nav-item">
                                <a class="label" id="gradientTab" data-toggle="pill" href="#gradientContent">
                                    <img src="images/icons/gradient.png" alt="Gradient Icon" class="tabsImgIcon" />
                                    Gradient
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="label" id="logoTab" data-toggle="pill" href="#logoContent">
                                    <img src="images/icons/logo.png" alt="Logo Icon" class="tabsImgIcon" /> Logo
                                </a>
                            </li>

                        </ul>
                        <div class="sidebar_content" id="sidebar">
                            <div class="tab-content sidebar_inner_content">
                                <div class="tab-pane fade show active singleTabsContent" id="designContent">

                                    <div class="flexRow justify-content-between  contentHeader" style="flex-direction: row;">
                                        <div class="">
                                            <h6 class="contentTitle label">Choose Designs</h6>
                                        </div>
                                        <div class="goBAckBtn m-0 ">
                                            <?php
                                            $cat_id = isset($_GET['cat']) ? (int)$_GET['cat'] : 1; // Change default if needed
                                            ?>
                                            <a href="product_type.php?cat=<?php echo $cat_id; ?>" class="backBtn1 m-0">
                                                <i class="fa fa-angle-left" aria-hidden="true"></i> Change Product
                                            </a>

                                        </div>
                                    </div>
                                    <div class="contentMain jerseyDesigns grid2">
                                        <?php
                                        $sql_select = "SELECT * FROM `designs` WHERE subcategory_id = $subcat ORDER BY id ASC";
                                        $rs_select = $conn->query($sql_select);

                                        while ($row_s_user = $rs_select->fetch_assoc()) {
                                            $design_id = $row_s_user['id'];
                                            $sql_colors = "SELECT c.name AS color_name
                                                                FROM `design_colors` dc
                                                                JOIN `colors` c ON dc.color_id = c.id
                                                                WHERE dc.design_id = $design_id";


                                            $rs_colors = $conn->query($sql_colors);

                                            // Initialize an array to store the colors for this design
                                            $design_colors = [];
                                            // echo "<pre>";
                                            // while ($row_color = $rs_colors->fetch_assoc()) {
                                            // print_r($row_color['color_name']);
                                            // }
                                            while ($row_color = $rs_colors->fetch_assoc()) {
                                                if (!empty($row_color['color_name'])) {
                                                    $design_colors[] = $row_color['color_name'];
                                                } else {
                                                    $design_colors[] = '';
                                                }
                                            }
                                            // Convert the design colors array to a JSON string for use in JavaScript
                                            $design_colors_json = json_encode($design_colors);

                                        ?>
                                            <div class="designsItems design-1">
                                                <figure>
                                                    <img src="admin/uploads/designs/images/<?php echo $row_s_user['image']; ?>" alt="Design 1"
                                                        data-design="<?php echo $row_s_user['modal_type']; ?>"
                                                        data-colors='<?php echo $design_colors_json; ?>'
                                                        data-modal="admin/uploads/designs/models/<?php echo $row_s_user['model']; ?>">
                                                </figure>
                                            </div>
                                        <?php
                                        }
                                        ?>
                                    </div>


                                </div>

                                <div class="tab-pane fade" id="colorsContent">
                                    <div class="season_content" id="colorsContent">
                                        <div class="subTabsContent">
                                            <div class="contentHeader">
                                                <h6 class="mb-2">Customize colors for your jersey</h6>
                                                <div style="white-space: nowrap;" class="d-none">
                                                    <label class="switch cursor">
                                                        Advance
                                                        <input type="checkbox" id="meshColorSwitch">
                                                        <span class="slider round"></span>
                                                    </label>
                                                </div>
                                            </div>


                                            <div class="contentMain">
                                                <div class="grid3 colorFaces" id="meshColorOptions" style="display: none;">
                                                    <!-- Dynamic mesh options will be inserted here -->
                                                </div>
                                                <!-- <div class="grid3 colorFaces" id="meshColorpst">
                                                <label class="colorsMeshItems part-button" data-part="front">
                                                    <input type="radio" name="meshActiveColor" value="Primary" checked>
                                                    <div class="meshActiveColor Primary" id="applyPrimary"></div>
                                                    <h6 class="meshActiveFaceName">Zone 1</h6>
                                                </label>
                                                <label class="colorsMeshItems part-button" data-part="leftSleeve">
                                                    <input type="radio" name="meshActiveColor" value="Secondary">
                                                    <div class="meshActiveColor Secondary" id="applySecondary"></div>
                                                    <h6 class="meshActiveFaceName">Zone 1</h6>
                                                </label>
                                                <label class="colorsMeshItems part-button" data-part="back">
                                                    <input type="radio" name="meshActiveColor" value="Tertiary">
                                                    <div class="meshActiveColor Tertiary" id="applyTertiary"></div>
                                                    <h6 class="meshActiveFaceName">Zone 3</h6>
                                                </label>
                                            </div> -->
                                                <!-- <div class="grid3 colorFaces" id="meshColorpst">
                                                <label class="colorsMeshItems part-button" data-part="front">
                                                    <input type="radio" name="meshActiveColor" value="Primary" checked>
                                                    <div class="meshActiveColor Primary" id="applyPrimary"></div>
                                                    <h6 class="meshActiveFaceName">Primary</h6>
                                                </label>
                                                ...
                                            </div> -->

                                                <!-- <div class="grid3 colorFaces" id="myZones">

                                                <label class="colorsMeshItems  ">
                                                    <input type="radio" name="zoneRadio" value="zone1" checked>
                                                    <div class="meshActiveColor  "></div>
                                                    <h6 class="meshActiveFaceName">Zone 1</h6>
                                                </label>
                                                <label class="colorsMeshItems  ">
                                                    <input type="radio" name="zoneRadio" value="zone2">
                                                    <div class="meshActiveColor  "></div>
                                                    <h6 class="meshActiveFaceName">Zone 2</h6>
                                                </label>
                                                <label class="colorsMeshItems  ">
                                                    <input type="radio" name="zoneRadio" value="zone3">
                                                    <div class="meshActiveColor  "></div>
                                                    <h6 class="meshActiveFaceName">Zone 3</h6>
                                                </label>
                                                <div class="subCategory zone3 ">
                                                    <label class="colorsMeshItems">
                                                        <input type="radio" name="zoneRadio" value="stripes1">
                                                        <div class="meshActiveColor"></div>
                                                        <h6 class="meshActiveFaceName">Stripes 1</h6>
                                                    </label>
                                                    <label class="colorsMeshItems">
                                                        <input type="radio" name="zoneRadio" value="stripes2">
                                                        <div class="meshActiveColor"></div>
                                                        <h6 class="meshActiveFaceName">Stripes 2</h6>
                                                    </label>
                                                    <label class="colorsMeshItems">
                                                        <input type="radio" name="zoneRadio" value="stripes3">
                                                        <div class="meshActiveColor"></div>
                                                        <h6 class="meshActiveFaceName">Stripes 3</h6>
                                                    </label>
                                                </div>

                                                <label class="colorsMeshItems  ">
                                                    <input type="radio" name="zoneRadio" value="zone4">
                                                    <div class="meshActiveColor  "></div>
                                                    <h6 class="meshActiveFaceName">Zone 4</h6>
                                                </label>
                                                <label class="colorsMeshItems  ">
                                                    <input type="radio" name="zoneRadio" value="zone5">
                                                    <div class="meshActiveColor  "></div>
                                                    <h6 class="meshActiveFaceName">Zone 5</h6>
                                                </label>
                                                <label class="colorsMeshItems  ">
                                                    <input type="radio" name="zoneRadio" value="zone6">
                                                    <div class="meshActiveColor  "></div>
                                                    <h6 class="meshActiveFaceName">Zone 6</h6>
                                                </label>

                                            </div> -->

                                                <div class="grid3 colorFaces" id="myZones">
                                                    <label class="colorsMeshItems">
                                                        <input type="radio" name="zoneRadio" value="zone1" checked>
                                                        <div class="meshActiveColor" id="colorPreview-zone1"></div>
                                                        <h6 class="meshActiveFaceName">Zone 1</h6>
                                                    </label>
                                                    <label class="colorsMeshItems">
                                                        <input type="radio" name="zoneRadio" value="zone2">
                                                        <div class="meshActiveColor" id="colorPreview-zone2"></div>
                                                        <h6 class="meshActiveFaceName">Zone 2</h6>
                                                    </label>
                                                    <label class="colorsMeshItems">
                                                        <input type="radio" name="zoneRadio" value="zone3">
                                                        <div class="meshActiveColor" id="colorPreview-zone3"></div>
                                                        <h6 class="meshActiveFaceName">Zone 3</h6>
                                                    </label>

                                                    <div class="subCategory zone3">
                                                        <label class="colorsMeshItems">
                                                            <input type="radio" name="zoneRadio" value="stripes1">
                                                            <div class="meshActiveColor" id="colorPreview-stripes1"></div>
                                                            <h6 class="meshActiveFaceName">Stripes 1</h6>
                                                        </label>
                                                        <label class="colorsMeshItems">
                                                            <input type="radio" name="zoneRadio" value="stripes2">
                                                            <div class="meshActiveColor" id="colorPreview-stripes2"></div>
                                                            <h6 class="meshActiveFaceName">Stripes 2</h6>
                                                        </label>
                                                        <label class="colorsMeshItems">
                                                            <input type="radio" name="zoneRadio" value="stripes3">
                                                            <div class="meshActiveColor" id="colorPreview-stripes3"></div>
                                                            <h6 class="meshActiveFaceName">Stripes 3</h6>
                                                        </label>
                                                    </div>

                                                    <label class="colorsMeshItems">
                                                        <input type="radio" name="zoneRadio" value="zone4">
                                                        <div class="meshActiveColor" id="colorPreview-zone4"></div>
                                                        <h6 class="meshActiveFaceName">Zone 4</h6>
                                                    </label>
                                                    <label class="colorsMeshItems">
                                                        <input type="radio" name="zoneRadio" value="zone5">
                                                        <div class="meshActiveColor" id="colorPreview-zone5"></div>
                                                        <h6 class="meshActiveFaceName">Zone 5</h6>
                                                    </label>
                                                    <label class="colorsMeshItems">
                                                        <input type="radio" name="zoneRadio" value="zone6">
                                                        <div class="meshActiveColor" id="colorPreview-zone6"></div>
                                                        <h6 class="meshActiveFaceName">Zone 6</h6>
                                                    </label>
                                                    <label class="colorsMeshItems">
                                                        <input type="radio" name="zoneRadio" value="zone7">
                                                        <div class="meshActiveColor" id="colorPreview-zone7"></div>
                                                        <h6 class="meshActiveFaceName">Zone 7</h6>
                                                    </label>
                                                    <div class="subCategory zone7">
                                                        <label class="colorsMeshItems">
                                                            <input type="radio" name="zoneRadio" value="collar1">
                                                            <div class="meshActiveColor" id="colorPreview-collar1"></div>
                                                            <h6 class="meshActiveFaceName">Collar 1</h6>
                                                        </label>
                                                        <label class="colorsMeshItems">
                                                            <input type="radio" name="zoneRadio" value="collar2">
                                                            <div class="meshActiveColor" id="colorPreview-collar2"></div>
                                                            <h6 class="meshActiveFaceName">Collar 2</h6>
                                                        </label>
                                                        <label class="colorsMeshItems">
                                                            <input type="radio" name="zoneRadio" value="collar3">
                                                            <div class="meshActiveColor" id="colorPreview-collar3"></div>
                                                            <h6 class="meshActiveFaceName">Collar 3</h6>
                                                        </label>
                                                    </div>
                                                    <label class="colorsMeshItems">
                                                        <input type="radio" name="zoneRadio" value="zone8">
                                                        <div class="meshActiveColor" id="colorPreview-zone8"></div>
                                                        <h6 class="meshActiveFaceName">Zone 8</h6>
                                                    </label>
                                                </div>


                                                <div class="MeshFaceColorPalette SinlgeColors mesh-color-palette defSection">
                                                    <div class="border">
                                                        <div id="zoneTitle" class="title titlePrimary">Choose color for Zone</div>


                                                        <div class="meshColorPalette color-palette mesh-color-palette">
                                                            <!-- Column 1 -->
                                                            <div class="colorItems">
                                                                <div class="palette forestGreen" data-color="#006B3F" title="PMS 350C Forest Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette darkGreen" data-color="#154734" title="PMS 343C Dark Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette dallasGreen" data-color="#007A33" title="PMS 342C Dallas Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette kellyGreen" data-color="#4C9F38" title="PMS 355C Kelly Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette neonGreen" data-color="#78D64B" title="PMS 802C Neon Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette missionGreen" data-color="#66B032" title="PMS 7482C Mission Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette lightPurple" data-color="#8E7CC3" title="PMS 265C Light Purple"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette kingsPurple" data-color="#3F2A56" title="PMS 274C Kings Purple"></div>
                                                            </div>

                                                            <!-- Column 2 -->
                                                            <div class="colorItems">
                                                                <div class="palette columbiaBlue" data-color="#B9D9EB" title="PMS 284C Columbia Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette darkRoyal" data-color="#00205B" title="PMS 2766C Dark Royal"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette varsityRoyal" data-color="#3A5DAE" title="PMS 287C Varsity Royal"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette oceanBlue" data-color="#007BA7" title="PMS 3005C Ocean Blue"></div>
                                                            </div>
                                                            <div class="colorItems onlyShowInTertiary">
                                                                <div class="palette powderBlue" data-color="#9BCBEB" title="PMS 277C Powder Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette proBlue" data-color="#1C2D8C" title="PMS 7682C Pro Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette alaskaBlue" data-color="#00AEEF" title="PMS 306C Alaska Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette indigoPurple" data-color="#330072" title="PMS 2695C Indigo Purple"></div>
                                                            </div>

                                                            <!-- Column 3 -->
                                                            <div class="colorItems">
                                                                <div class="palette indianaRed" data-color="#862633" title="PMS 7427C Indiana Red"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette scarletRed" data-color="#C8102E" title="PMS 186C Scarlet Red"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette universityRed" data-color="#C41E3A" title="PMS 200C University Red"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette burntOrange" data-color="#BF5700" title="PMS 1585C Burnt Orange"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette neonOrange" data-color="#FF5F00" title="PMS 811C Neon Orange"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette brightOrange" data-color="#FF6A13" title="PMS 165C Bright Orange"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette hotPink" data-color="#FF69B4" title="PMS 806C Hot Pink"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette maroon" data-color="#800000" title="PMS 7644C Maroon"></div>
                                                            </div>
                                                            <!-- Add these to your .meshColorPalette block -->

                                                            <div class="colorItems">
                                                                <div class="palette tealBlue" data-color="#007398" title="PMS 7710C Teal Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette purple" data-color="#582C83" title="PMS 268C Purple"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette whiteSmoke" data-color="#F5F5F5" title="White Smoke"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette coolGrey" data-color="#8C92AC" title="Cool Grey"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette tangerine" data-color="#FFA500" title="Tangerine"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette brightYellow" data-color="#FFF700" title="Bright Yellow"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette peach" data-color="#FFDAB9" title="Peach"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette bubblegum" data-color="#FFC1CC" title="Bubblegum Pink"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette babyPink" data-color="#F4C2C2" title="Baby Pink"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette lavender" data-color="#E6E6FA" title="Lavender"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette skyBlue" data-color="#87CEEB" title="Sky Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette midnightBlue" data-color="#191970" title="Midnight Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette electricBlue" data-color="#7DF9FF" title="Electric Blue"></div>
                                                            </div>

                                                            <!-- Column 4 -->
                                                            <div class="colorItems">
                                                                <div class="palette yellow" data-color="#FFD100" title="PMS 116C Yellow"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette cream" data-color="#F4EBD0" title="PMS 7506C Cream"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette vintageCream" data-color="#EFE1B9" title="PMS 468C Vintage Cream"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette vegasGold" data-color="#C5B358" title="PMS 4515C Vegas Gold"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette dustGold" data-color="#B4975A" title="PMS 465C Dust Gold"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette varsityGold" data-color="#FFD700" title="PMS 7548C Varsity Gold"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette nuggetGold" data-color="#DAA520" title="PMS 874C Nugget Gold"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette michiganMaze" data-color="#FFCB05" title="PMS 7406C Michigan Maze"></div>
                                                            </div>

                                                            <!-- Column 5 -->
                                                            <div class="colorItems">
                                                                <div class="palette modGrey" data-color="#B7B1A9" title="Cool Grey 11C Mod Grey"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette proGrey" data-color="#999999" title="PMS 7543C Pro Grey"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette silver" data-color="#C0C0C0" title="PMS 421C Silver"></div>
                                                            </div>
                                                            <div class="colorItems onlyShowInTertiary">
                                                                <div class="palette white" data-color="#FFFFFF" title="White"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette altuva" data-color="#101820" title="PMS 426C Altuva"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette black" data-color="#000000" title="Black"></div>
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div class="tab-pane fade" id="patternContent">
                                    <div class="season_content">
                                        <div class="FrontScreen">
                                            <div class="contentHeader">
                                                <h6>Select areas of your jersey where you want to apply
                                                    the patterns.
                                                </h6>
                                                <p class="f13 my-2 grey2">* You can come back anytime to select or deselect them.
                                                </p>
                                            </div>

                                            <div class="childMeshAppend ">
                                                <!-- Dynamic checkboxes will be inserted here -->
                                            </div>

                                            <div class="patternArea">
                                                <form class="grid3 halfSleevesPattern" id="dynamicPatternForm" style="display: grid;">
                                                    <!-- This will be populated dynamically -->
                                                </form>
                                                <label class="  part-button column2 blackBgBtn btnBlack defBtnStyle" onclick="handleNextClick()">
                                                    <input type="checkbox" id="next" />
                                                    <span class="checkmark d-none"></span>
                                                    <span class="label-text">NEXT <i class="fa fa-angle-right" aria-hidden="true"></i>
                                                    </span>
                                                </label>

                                            </div>
                                        </div>
                                        <section class="SecondScreen  ">
                                            <div class="contentHeader">
                                                <h6>Choose patterns for your jersey</h6>
                                            </div>
                                            <div class="actionHeaderDiv grid2">
                                                <div class="goBAckBtn backBtn1" onclick="handleGoBackClick()">
                                                    <a href="#" class="backBtn1">
                                                        <i class="fa fa-angle-left" aria-hidden="true"></i>
                                                        Go Back</a>
                                                </div>
                                            </div>
                                            <div class="divider"></div>
                                            <div class="PatternsMainDiv">
                                                <br>
                                                <div class="SectionTitle">Patterns</div>
                                                <div class="border defSection patternImagesArea">
                                                    <div class="AllDifferentPatterns grid4">
                                                        <!-- <div class="patternsItems" data-image="images/Patterns/pattern3.png">
                                                            <img src="images/Patterns/pattern3.png" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div> -->
                                                        <div class="patternsItems" data-image="images/Patterns/pattern.svg">
                                                            <img src="images/Patterns/pattern.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/demodemo.svg">
                                                            <img src="images/Patterns/demodemo.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/svg3.svg">
                                                            <img src="images/Patterns/svg3.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/svg2.svg">
                                                            <img src="images/Patterns/svg2.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/svg1.svg">
                                                            <img src="images/Patterns/svg1.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/svg4.svg">
                                                            <img src="images/Patterns/svg4.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/svg5.svg">
                                                            <img src="images/Patterns/svg5.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>

                                                        <div class="patternsItems" data-image="images/Patterns/svg7.svg">
                                                            <img src="images/Patterns/svg7.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/svg8.svg">
                                                            <img src="images/Patterns/svg8.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/svg9.svg">
                                                            <img src="images/Patterns/svg9.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/svg10.svg">
                                                            <img src="images/Patterns/svg10.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>

                                                        <div class="patternsItems" data-image="images/Patterns/svg12.svg">
                                                            <img src="images/Patterns/svg12.svg" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>

                                                        <!-- <div class="patternsItems" data-image="images/Patterns/pattern4.png">
                                                            <img src="images/Patterns/pattern4.png" class="PatternImg w-100" alt="Pattern Item 1">
                                                        </div>


                                                        <div class="patternsItems" data-image="images/Patterns/patternsItems1.png">
                                                            <img src="images/Patterns/patternsItems1.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/R-Sleeve.png">
                                                            <img src="images/Patterns/R-Sleeve.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/pattern3.png">
                                                            <img src="images/Patterns/pattern3.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/pattern4.png">
                                                            <img src="images/Patterns/pattern4.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/pattern5.png">
                                                            <img src="images/Patterns/pattern5.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/pattern6.png">
                                                            <img src="images/Patterns/pattern6.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/pattern7.png">
                                                            <img src="images/Patterns/pattern7.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/pattern8.png">
                                                            <img src="images/Patterns/pattern8.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/pattern9.png">
                                                            <img src="images/Patterns/pattern9.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/pattern10.png">
                                                            <img src="images/Patterns/pattern10.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/pattern11.png">
                                                            <img src="images/Patterns/pattern11.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div>
                                                        <div class="patternsItems" data-image="images/Patterns/pattern12.png">
                                                            <img src="images/Patterns/pattern12.png" class="PatternImg w-100" alt="Pattern Item">
                                                        </div> -->



                                                    </div>
                                                </div>

                                                <div class="border svgColorPickerContainer" style="margin: 0;">
                                                    <div class="title titlePrimary mt-0" id="titlePrimary">Choose color for Pattern</div>
                                                    <div class="patternColorPallet  color-palette   ">
                                                        <div class="colorItems">
                                                            <div class="palette forestGreen" data-color="#006B3F" title="PMS 350C Forest Green"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette darkGreen" data-color="#154734" title="PMS 343C Dark Green"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette dallasGreen" data-color="#007A33" title="PMS 342C Dallas Green"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette kellyGreen" data-color="#4C9F38" title="PMS 355C Kelly Green"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette neonGreen" data-color="#78D64B" title="PMS 802C Neon Green"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette missionGreen" data-color="#66B032" title="PMS 7482C Mission Green"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette lightPurple" data-color="#8E7CC3" title="PMS 265C Light Purple"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette kingsPurple" data-color="#3F2A56" title="PMS 274C Kings Purple"></div>
                                                        </div>

                                                        <!-- Column 2 -->
                                                        <div class="colorItems">
                                                            <div class="palette columbiaBlue" data-color="#B9D9EB" title="PMS 284C Columbia Blue"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette darkRoyal" data-color="#00205B" title="PMS 2766C Dark Royal"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette varsityRoyal" data-color="#3A5DAE" title="PMS 287C Varsity Royal"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette oceanBlue" data-color="#007BA7" title="PMS 3005C Ocean Blue"></div>
                                                        </div>
                                                        <div class="colorItems onlyShowInTertiary">
                                                            <div class="palette powderBlue" data-color="#9BCBEB" title="PMS 277C Powder Blue"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette proBlue" data-color="#1C2D8C" title="PMS 7682C Pro Blue"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette alaskaBlue" data-color="#00AEEF" title="PMS 306C Alaska Blue"></div>
                                                        </div>
                                                        <div class="colorItems">
                                                            <div class="palette indigoPurple" data-color="#330072" title="PMS 2695C Indigo Purple"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="patternsControls mt-3">

                                                    <div class="rotate defItems">
                                                        <div class="d-flex justify-content-between">
                                                            <label for="rotateSlider">Opacity </label>
                                                            <p> <span id="OpacityValue">100</span>°</p>
                                                        </div>
                                                        <input type="range" id="Opacity" min="0" max="100" step="0" value="180" class="w-100">
                                                    </div>
                                                    <div class="rotate defItems pattern-control">
                                                        <div class="d-flex justify-content-between">
                                                            <label for="patternScale">Pattern Scale: </label>
                                                            <p> <span id="patternScaleValue">100%</span></p>
                                                        </div>
                                                        <input type="range" id="patternScale" min="10" max="200" value="100" class="w-100">
                                                    </div>

                                                </div>
                                                <button id="applyPatternButton" class="btnBlack defBtnStyle w-100" type="button">APPLY</button>

                                            </div>
                                        </section>
                                    </div>

                                </div>
                                <div class="tab-pane fade textDecal" id="textContent">
                                    <div class="season_content" id="textContent">
                                        <div class="textDecalFirstScreen" id="screen1">
                                            <div class="contentHeader">
                                                <h6>Add Text</h6>
                                            </div>
                                            <div class="input-container">
                                                <label for="decalText2" class="sp">Enter text to display on the
                                                    jersey.</label>
                                                <input type="text" id="textInput" placeholder="Enter your text here" />

                                                <div class="grid2">
                                                    <button id="updateTextButton" class="updateTxt btnBlack2 defBtnStyle">UPDATE</button>
                                                    <button id="applyTextButton" class="btnBlack defBtnStyle">APPLY</button>


                                                </div>
                                            </div>
                                            <div class="TextinusMeshesItems" id="screen4">
                                                <div class="appliedDecalsList" id="appliedDecalsList">
                                                    <!-- Dynamic text/image decal entries will appear here -->
                                                </div>
                                            </div>

                                        </div>
                                        <div class="textDecalSecondScreen  " id="screen2" style="display: none;">


                                            <!-- For text decal placement -->
                                            <div class="decalsPlacementsMeshes">

                                                <div class="contentHeader">
                                                    <h6 class="placement-header" id="textPlacement">Please Choose Text Placements</h6>
                                                    <h6 class="placement-header" id="namePlacement">Please Choose Name Placements</h6>
                                                    <h6 class="placement-header" id="numberPlacement">Please Choose Number Placements</h6>
                                                </div>

                                                <div class="selectArea grid2" id="dynamicMeshButtons">

                                                    <!-- Dynamic text placement buttons will be inserted here -->
                                                </div>
                                            </div>
                                        </div>
                                        <div class="textDecalThirdScreen  " id="screen3" style="display: none;">
                                            <div class="decalControls NameThirdScreen textDecalControls ">
                                                <div class="flexRow justify-content-between  contentHeader">
                                                    <div class="">
                                                        <h6 class="contentTitle label">Text in use</h6>
                                                    </div>
                                                    <div class="goBAckBtn m-0 ">
                                                        <a href="#" id="goBackButton" class="backBtn1 m-0">
                                                            <i class="fa fa-angle-left" aria-hidden="true"></i> Go Back
                                                        </a>
                                                    </div>
                                                </div>
                                                <h6 class="noteText mb-2"> "Quick Unselect: Just Double-Click"</h6>
                                                <div class="textMeshes">

                                                    <div class="grid2 " id="border-buttons">
                                                        <div class="textMeshesItems">
                                                            <h6 class="meshItemsTitle">Text</h6>

                                                            <button id="deleteTextButton" class="deleteBtn deleteDecalIcon" style="background: none; border:none;">
                                                                <figure id="bottomLeftButton" class="bottomLeftButton">
                                                                    <img src="images/icons/deletIcon.png" alt="deleteDecalIcon"
                                                                        class="textMeshesItemsIcon TextRemoveValue">
                                                                </figure>
                                                            </button>

                                                            <div class="textDecalMesh">
                                                                <h3 class="decalText"> </h3>
                                                            </div>
                                                        </div>
                                                        <div class="textMeshesItems">
                                                            <h6 class="meshItemsTitle">Color</h6>
                                                            <div class="colorUse bg-none border-none w-100 flexRow m-0 px-0 f14 " type="button" data-bs-toggle="collapse" data-bs-target="#textColorControlsShow" aria-expanded="false" aria-controls="textColorControlsShow">

                                                                <div class="colorPicker"></div>
                                                            </div>

                                                        </div>

                                                    </div>
                                                </div>


                                                <div class="controlItems mb-0">
                                                    <button class=" bg-none border-none w-100 flexRow m-0 px-0 f14 " type="button" data-bs-toggle="collapse" data-bs-target="#textColorControlsShow" aria-expanded="false" aria-controls="textColorControlsShow">
                                                        Change Text Color
                                                    </button>
                                                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                                                </div>

                                                <div class="collapse" id="textColorControlsShow">
                                                    <div class="textColorPalette border input-container chooseColor  m-0 " data-decal-id="decal2">
                                                        <label class="titlePrimary w-100 m-0 ">Choose Color:</label>
                                                        <div class=" text-color-palette color-palette">
                                                            <!-- Column 1 -->
                                                            <div class="colorItems">
                                                                <div class="palette forestGreen" data-color="#006B3F" title="PMS 350C Forest Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette darkGreen" data-color="#154734" title="PMS 343C Dark Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette dallasGreen" data-color="#007A33" title="PMS 342C Dallas Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette kellyGreen" data-color="#4C9F38" title="PMS 355C Kelly Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette neonGreen" data-color="#78D64B" title="PMS 802C Neon Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette missionGreen" data-color="#66B032" title="PMS 7482C Mission Green"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette lightPurple" data-color="#8E7CC3" title="PMS 265C Light Purple"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette kingsPurple" data-color="#3F2A56" title="PMS 274C Kings Purple"></div>
                                                            </div>

                                                            <!-- Column 2 -->
                                                            <div class="colorItems">
                                                                <div class="palette columbiaBlue" data-color="#B9D9EB" title="PMS 284C Columbia Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette darkRoyal" data-color="#00205B" title="PMS 2766C Dark Royal"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette varsityRoyal" data-color="#3A5DAE" title="PMS 287C Varsity Royal"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette oceanBlue" data-color="#007BA7" title="PMS 3005C Ocean Blue"></div>
                                                            </div>
                                                            <div class="colorItems onlyShowInTertiary">
                                                                <div class="palette powderBlue" data-color="#9BCBEB" title="PMS 277C Powder Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette proBlue" data-color="#1C2D8C" title="PMS 7682C Pro Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette alaskaBlue" data-color="#00AEEF" title="PMS 306C Alaska Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette indigoPurple" data-color="#330072" title="PMS 2695C Indigo Purple"></div>
                                                            </div>

                                                            <!-- Column 3 -->
                                                            <div class="colorItems">
                                                                <div class="palette indianaRed" data-color="#862633" title="PMS 7427C Indiana Red"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette scarletRed" data-color="#C8102E" title="PMS 186C Scarlet Red"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette universityRed" data-color="#C41E3A" title="PMS 200C University Red"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette burntOrange" data-color="#BF5700" title="PMS 1585C Burnt Orange"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette neonOrange" data-color="#FF5F00" title="PMS 811C Neon Orange"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette brightOrange" data-color="#FF6A13" title="PMS 165C Bright Orange"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette hotPink" data-color="#FF69B4" title="PMS 806C Hot Pink"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette maroon" data-color="#800000" title="PMS 7644C Maroon"></div>
                                                            </div>
                                                            <!-- Add these to your .meshColorPalette block -->

                                                            <div class="colorItems">
                                                                <div class="palette tealBlue" data-color="#007398" title="PMS 7710C Teal Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette purple" data-color="#582C83" title="PMS 268C Purple"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette whiteSmoke" data-color="#F5F5F5" title="White Smoke"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette coolGrey" data-color="#8C92AC" title="Cool Grey"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette tangerine" data-color="#FFA500" title="Tangerine"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette brightYellow" data-color="#FFF700" title="Bright Yellow"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette peach" data-color="#FFDAB9" title="Peach"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette bubblegum" data-color="#FFC1CC" title="Bubblegum Pink"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette babyPink" data-color="#F4C2C2" title="Baby Pink"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette lavender" data-color="#E6E6FA" title="Lavender"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette skyBlue" data-color="#87CEEB" title="Sky Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette midnightBlue" data-color="#191970" title="Midnight Blue"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette electricBlue" data-color="#7DF9FF" title="Electric Blue"></div>
                                                            </div>

                                                            <!-- Column 4 -->
                                                            <div class="colorItems">
                                                                <div class="palette yellow" data-color="#FFD100" title="PMS 116C Yellow"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette cream" data-color="#F4EBD0" title="PMS 7506C Cream"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette vintageCream" data-color="#EFE1B9" title="PMS 468C Vintage Cream"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette vegasGold" data-color="#C5B358" title="PMS 4515C Vegas Gold"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette dustGold" data-color="#B4975A" title="PMS 465C Dust Gold"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette varsityGold" data-color="#FFD700" title="PMS 7548C Varsity Gold"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette nuggetGold" data-color="#DAA520" title="PMS 874C Nugget Gold"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette michiganMaze" data-color="#FFCB05" title="PMS 7406C Michigan Maze"></div>
                                                            </div>

                                                            <!-- Column 5 -->
                                                            <div class="colorItems">
                                                                <div class="palette modGrey" data-color="#B7B1A9" title="Cool Grey 11C Mod Grey"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette proGrey" data-color="#999999" title="PMS 7543C Pro Grey"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette silver" data-color="#C0C0C0" title="PMS 421C Silver"></div>
                                                            </div>
                                                            <div class="colorItems onlyShowInTertiary">
                                                                <div class="palette white" data-color="#FFFFFF" title="White"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette altuva" data-color="#101820" title="PMS 426C Altuva"></div>
                                                            </div>
                                                            <div class="colorItems">
                                                                <div class="palette black" data-color="#000000" title="Black"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="TextDecalControls">

                                                    <div class="controlItems">
                                                        <h6 class="controlsTitle1">Center Align</h6>
                                                        <button id="centerDecalButton" class="controlsBtn">
                                                            <i class="fa fa-align-center" aria-hidden="true"></i>
                                                        </button>
                                                    </div>

                                                </div>



                                                <div class="lowerControls">

                                                    <div class="TextSizeHandle patternSizeHandle">
                                                        <div class="ResizePatterHandle items controlItems">
                                                            <h6 class="title m-0">Font Size</h6>
                                                            <div class="flex">
                                                                <button class="minus TextDecalSizeMinus">
                                                                    <img src="images/icons/minusIconBtnIcon.png"
                                                                        alt="" />
                                                                </button>
                                                                <button class="plus TextDecalSizePlus">
                                                                    <img src="images/icons/plusIconBtnIcon.png"
                                                                        alt="" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div class="controlItems mb-0">
                                                        <button class=" bg-none border-none w-100 flexRow m-0 px-0 f14  " type="button" data-bs-toggle="collapse" data-bs-target="#textOutlineControlsShow" aria-expanded="false" aria-controls="textOutlineControlsShow">
                                                            Outline Settings
                                                            <i class="fa fa-angle-right" aria-hidden="true"></i>
                                                        </button>
                                                        <button class=" bg-none border-none w-100 flexRow m-0 px-0 f14  justify-content-end " type="button" data-bs-toggle="collapse" data-bs-target="#textOutlineControlsShow" aria-expanded="false" aria-controls="textOutlineControlsShow">

                                                            <i class="fa fa-eye" aria-hidden="true" id="toggleOutlineButton"></i>
                                                        </button>

                                                    </div>
                                                    <div class="collapse" id="textOutlineControlsShow">
                                                        <div class=" ">
                                                            <div class="outline-controls">
                                                                <div class="control-group border">
                                                                    <label class="titlePrimary w-100 m-0 ">Outline Color:</label>
                                                                    <div class="outlineColor text-color-palette color-palette">
                                                                        <!-- Column 1 -->
                                                                        <div class="colorItems">
                                                                            <div class="palette forestGreen" data-color="#006B3F" title="PMS 350C Forest Green"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette darkGreen" data-color="#154734" title="PMS 343C Dark Green"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette dallasGreen" data-color="#007A33" title="PMS 342C Dallas Green"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette kellyGreen" data-color="#4C9F38" title="PMS 355C Kelly Green"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette neonGreen" data-color="#78D64B" title="PMS 802C Neon Green"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette missionGreen" data-color="#66B032" title="PMS 7482C Mission Green"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette lightPurple" data-color="#8E7CC3" title="PMS 265C Light Purple"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette kingsPurple" data-color="#3F2A56" title="PMS 274C Kings Purple"></div>
                                                                        </div>

                                                                        <!-- Column 2 -->
                                                                        <div class="colorItems">
                                                                            <div class="palette columbiaBlue" data-color="#B9D9EB" title="PMS 284C Columbia Blue"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette darkRoyal" data-color="#00205B" title="PMS 2766C Dark Royal"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette varsityRoyal" data-color="#3A5DAE" title="PMS 287C Varsity Royal"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette oceanBlue" data-color="#007BA7" title="PMS 3005C Ocean Blue"></div>
                                                                        </div>
                                                                        <div class="colorItems onlyShowInTertiary">
                                                                            <div class="palette powderBlue" data-color="#9BCBEB" title="PMS 277C Powder Blue"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette proBlue" data-color="#1C2D8C" title="PMS 7682C Pro Blue"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette alaskaBlue" data-color="#00AEEF" title="PMS 306C Alaska Blue"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette indigoPurple" data-color="#330072" title="PMS 2695C Indigo Purple"></div>
                                                                        </div>

                                                                        <!-- Column 3 -->
                                                                        <div class="colorItems">
                                                                            <div class="palette indianaRed" data-color="#862633" title="PMS 7427C Indiana Red"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette scarletRed" data-color="#C8102E" title="PMS 186C Scarlet Red"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette universityRed" data-color="#C41E3A" title="PMS 200C University Red"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette burntOrange" data-color="#BF5700" title="PMS 1585C Burnt Orange"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette neonOrange" data-color="#FF5F00" title="PMS 811C Neon Orange"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette brightOrange" data-color="#FF6A13" title="PMS 165C Bright Orange"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette hotPink" data-color="#FF69B4" title="PMS 806C Hot Pink"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette maroon" data-color="#800000" title="PMS 7644C Maroon"></div>
                                                                        </div>
                                                                        <!-- Add these to your .meshColorPalette block -->

                                                                        <div class="colorItems">
                                                                            <div class="palette tealBlue" data-color="#007398" title="PMS 7710C Teal Blue"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette purple" data-color="#582C83" title="PMS 268C Purple"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette whiteSmoke" data-color="#F5F5F5" title="White Smoke"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette coolGrey" data-color="#8C92AC" title="Cool Grey"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette tangerine" data-color="#FFA500" title="Tangerine"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette brightYellow" data-color="#FFF700" title="Bright Yellow"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette peach" data-color="#FFDAB9" title="Peach"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette bubblegum" data-color="#FFC1CC" title="Bubblegum Pink"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette babyPink" data-color="#F4C2C2" title="Baby Pink"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette lavender" data-color="#E6E6FA" title="Lavender"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette skyBlue" data-color="#87CEEB" title="Sky Blue"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette midnightBlue" data-color="#191970" title="Midnight Blue"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette electricBlue" data-color="#7DF9FF" title="Electric Blue"></div>
                                                                        </div>

                                                                        <!-- Column 4 -->
                                                                        <div class="colorItems">
                                                                            <div class="palette yellow" data-color="#FFD100" title="PMS 116C Yellow"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette cream" data-color="#F4EBD0" title="PMS 7506C Cream"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette vintageCream" data-color="#EFE1B9" title="PMS 468C Vintage Cream"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette vegasGold" data-color="#C5B358" title="PMS 4515C Vegas Gold"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette dustGold" data-color="#B4975A" title="PMS 465C Dust Gold"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette varsityGold" data-color="#FFD700" title="PMS 7548C Varsity Gold"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette nuggetGold" data-color="#DAA520" title="PMS 874C Nugget Gold"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette michiganMaze" data-color="#FFCB05" title="PMS 7406C Michigan Maze"></div>
                                                                        </div>

                                                                        <!-- Column 5 -->
                                                                        <div class="colorItems">
                                                                            <div class="palette modGrey" data-color="#B7B1A9" title="Cool Grey 11C Mod Grey"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette proGrey" data-color="#999999" title="PMS 7543C Pro Grey"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette silver" data-color="#C0C0C0" title="PMS 421C Silver"></div>
                                                                        </div>
                                                                        <div class="colorItems onlyShowInTertiary">
                                                                            <div class="palette white" data-color="#FFFFFF" title="White"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette altuva" data-color="#101820" title="PMS 426C Altuva"></div>
                                                                        </div>
                                                                        <div class="colorItems">
                                                                            <div class="palette black" data-color="#000000" title="Black"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="controlItems">
                                                                    <label class="nowrap">Outline Width:</label>
                                                                    <div class=" ">
                                                                        <button class="outline-minus imgIconBTn"><img src="images/icons/minusIconBtnIcon.png" alt="" class="icon2"></button>
                                                                        <span id="outlineWidthValue">2px</span>
                                                                        <button class="outline-plus imgIconBTn"><img src="images/icons/plusIconBtnIcon.png" alt="" class="icon2"></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="TextSizeHandle patternSizeHandle">
                                                        <div class="ResizePatterHandle items controlItems">
                                                            <h6 class="title m-0">Pin Text</h6>
                                                            <div class="flex">
                                                                <div style="text-align: right;">
                                                                    <button id="lockDecalButton">


                                                                        <img src="images/icons/Unlock.png"
                                                                            alt="" />
                                                                    </button>
                                                                    <button id="unlockDecalButton" style="display: none;">
                                                                        <img src="images/icons/lock.png"
                                                                            alt="" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="textFontFamily ">
                                                        <form action="#">
                                                            <div class="input-container NameFontFamily FontFamily controlItemsColumn controlItems ">
                                                                <h6 class="d-block mb-2">Choose font</h6>
                                                                <div class="styled-select w-100">
                                                                    <select id="fontFamilySelect3" class="fontFamilySelect ">
                                                                        <option value="Arial, sans-serif">Arial, sans-serif</option>
                                                                        <option value="Impact, sans-serif">Impact, sans-serif</option>
                                                                        <option value="'Alex Brush', cursive">'Alex Brush', cursive</option>
                                                                        <option value="Courier New, monospace">Courier New, monospace</option>
                                                                        <option value="Georgia, serif">Georgia, serif</option>
                                                                        <option value="Times New Roman, serif">Times New Roman, serif</option>
                                                                        <option value="Verdana, sans-serif">Verdana, sans-serif</option>
                                                                        <option value="Tahoma, sans-serif">Tahoma, sans-serif</option>
                                                                        <option value="Trebuchet MS, sans-serif">Trebuchet MS, sans-serif</option>
                                                                        <option value="Comic Sans MS, cursive">Comic Sans MS, cursive</option>
                                                                        <option value="Lucida Console, monospace">Lucida Console, monospace</option>
                                                                        <option value="Palatino Linotype, serif">Palatino Linotype, serif</option>
                                                                        <option value="Century Gothic, sans-serif">Century Gothic, sans-serif</option>
                                                                    </select>

                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>

                                                    <div class="chooseTextTransform controlItemsColumn controlItems">
                                                        <h6>Text Style</h6>

                                                        <div class="styleArea grid4 ">

                                                            <span class="text-transform capitalize" data-transform="capitalize">Capitalize</span>

                                                            <span class="text-transform lowercase" data-transform="lowercase">Lowercase</span>

                                                            <span class="text-transform uppercase" data-transform="uppercase">Uppercase</span>

                                                            <span class="text-transform normal" data-transform="normal">Normal</span>

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div class="textControls">


                                                <div class="rotate defItems">
                                                    <div class="flexRow justify-content-between">
                                                        <label for="rotateSlider" class="f14">Rotate Text </label>
                                                        <p class="m-0"> <span id="rotationValue">180</span>°</p>
                                                    </div>
                                                    <input type="range" id="rotateSlider" min="0" max="360" step="0" value="180" class="w-100">
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="tab-pane fade" id="gradientContent">
                                    <div class="season_content" id="gradientContent">
                                        <div class="contentHeader">
                                            <h6>Choose gradient.</h6>
                                        </div>
                                        <div class="gradeientMEsh gradientFirstScreen">

                                            <form class="gradientFaces halfSleeveGradient grid3    colorFaces ">

                                            </form>
                                            <button class="ShowGradientSecondScreen btnBlack defBtnStyle w-100 mt-3 mx-0">Next <i class="fa fa-angle-right" aria-hidden="true"></i></button>

                                        </div>

                                        <div class="gradientSecondScreen" style="display: none;">
                                            <div class="goBAckToGradientFirstScreen goBAckBtn">
                                                <a href="#" class="goBAckBtn backBtn1"> <i class="fa fa-angle-left" aria-hidden="true"></i> Go Back</a>
                                            </div>

                                            <div class="gradientColorAdjust border">
                                                <h6 class="titlePrimary m-0" id="titleFront">Please Choose Two Colors </h6>
                                                <div class="selectGradientColors">
                                                    <div class="firstSelectColor colorBox"></div>
                                                    <div class="secondSelectColor colorBox"></div>
                                                </div>
                                            </div>

                                            <div class="input-container chooseColor border p-0 " data-decal-id="decal2">
                                                <label for="decalNumber" class="titlePrimary m-0">Choose Color</label>
                                                <div class="gradient-palette">
                                                    <!-- Column 1 -->
                                                    <label class="forestGreen"><input type="checkbox" class="color-checkbox" value="#006B3F"></label>
                                                    <label class="darkGreen"><input type="checkbox" class="color-checkbox" value="#154734"></label>
                                                    <label class="dallasGreen"><input type="checkbox" class="color-checkbox" value="#007A33"></label>
                                                    <label class="kellyGreen"><input type="checkbox" class="color-checkbox" value="#4C9F38"></label>
                                                    <label class="neonGreen"><input type="checkbox" class="color-checkbox" value="#78D64B"></label>
                                                    <label class="missionGreen"><input type="checkbox" class="color-checkbox" value="#66B032"></label>
                                                    <label class="lightPurple"><input type="checkbox" class="color-checkbox" value="#8E7CC3"></label>
                                                    <label class="kingsPurple"><input type="checkbox" class="color-checkbox" value="#3F2A56"></label>

                                                    <!-- Column 2 -->
                                                    <label class="columbiaBlue"><input type="checkbox" class="color-checkbox" value="#B9D9EB"></label>
                                                    <label class="darkRoyal"><input type="checkbox" class="color-checkbox" value="#00205B"></label>
                                                    <label class="varsityRoyal"><input type="checkbox" class="color-checkbox" value="#3A5DAE"></label>
                                                    <label class="oceanBlue"><input type="checkbox" class="color-checkbox" value="#007BA7"></label>
                                                    <label class="powderBlue"><input type="checkbox" class="color-checkbox" value="#9BCBEB"></label>
                                                    <label class="proBlue"><input type="checkbox" class="color-checkbox" value="#1C2D8C"></label>
                                                    <label class="alaskaBlue"><input type="checkbox" class="color-checkbox" value="#00AEEF"></label>
                                                    <label class="indigoPurple"><input type="checkbox" class="color-checkbox" value="#330072"></label>

                                                    <!-- Column 3 -->
                                                    <label class="indianaRed"><input type="checkbox" class="color-checkbox" value="#862633"></label>
                                                    <label class="scarletRed"><input type="checkbox" class="color-checkbox" value="#C8102E"></label>
                                                    <label class="universityRed"><input type="checkbox" class="color-checkbox" value="#C41E3A"></label>
                                                    <label class="burntOrange"><input type="checkbox" class="color-checkbox" value="#BF5700"></label>
                                                    <label class="neonOrange"><input type="checkbox" class="color-checkbox" value="#FF5F00"></label>
                                                    <label class="brightOrange"><input type="checkbox" class="color-checkbox" value="#FF6A13"></label>
                                                    <label class="hotPink"><input type="checkbox" class="color-checkbox" value="#FF69B4"></label>
                                                    <label class="maroon"><input type="checkbox" class="color-checkbox" value="#800000"></label>
                                                    <label class="tealBlue"><input type="checkbox" class="color-checkbox" value="#007398"></label>
                                                    <label class="purple"><input type="checkbox" class="color-checkbox" value="#582C83"></label>
                                                    <label class="whiteSmoke"><input type="checkbox" class="color-checkbox" value="#F5F5F5"></label>
                                                    <label class="coolGrey"><input type="checkbox" class="color-checkbox" value="#8C92AC"></label>
                                                    <label class="tangerine"><input type="checkbox" class="color-checkbox" value="#FFA500"></label>
                                                    <label class="brightYellow"><input type="checkbox" class="color-checkbox" value="#FFF700"></label>
                                                    <label class="peach"><input type="checkbox" class="color-checkbox" value="#FFDAB9"></label>
                                                    <label class="bubblegum"><input type="checkbox" class="color-checkbox" value="#FFC1CC"></label>
                                                    <label class="babyPink"><input type="checkbox" class="color-checkbox" value="#F4C2C2"></label>
                                                    <label class="lavender"><input type="checkbox" class="color-checkbox" value="#E6E6FA"></label>
                                                    <label class="skyBlue"><input type="checkbox" class="color-checkbox" value="#87CEEB"></label>
                                                    <label class="midnightBlue"><input type="checkbox" class="color-checkbox" value="#191970"></label>
                                                    <label class="electricBlue"><input type="checkbox" class="color-checkbox" value="#7DF9FF"></label>

                                                    <!-- Column 4 -->
                                                    <label class="yellow"><input type="checkbox" class="color-checkbox" value="#FFD100"></label>
                                                    <label class="cream"><input type="checkbox" class="color-checkbox" value="#F4EBD0"></label>
                                                    <label class="vintageCream"><input type="checkbox" class="color-checkbox" value="#EFE1B9"></label>
                                                    <label class="vegasGold"><input type="checkbox" class="color-checkbox" value="#C5B358"></label>
                                                    <label class="dustGold"><input type="checkbox" class="color-checkbox" value="#B4975A"></label>
                                                    <label class="varsityGold"><input type="checkbox" class="color-checkbox" value="#FFD700"></label>
                                                    <label class="nuggetGold"><input type="checkbox" class="color-checkbox" value="#DAA520"></label>
                                                    <label class="michiganMaze"><input type="checkbox" class="color-checkbox" value="#FFCB05"></label>

                                                    <!-- Column 5 -->
                                                    <label class="modGrey"><input type="checkbox" class="color-checkbox" value="#B7B1A9"></label>
                                                    <label class="proGrey"><input type="checkbox" class="color-checkbox" value="#999999"></label>
                                                    <label class="silver"><input type="checkbox" class="color-checkbox" value="#C0C0C0"></label>
                                                    <label class="white"><input type="checkbox" class="color-checkbox" value="#FFFFFF"></label>
                                                    <label class="altuva"><input type="checkbox" class="color-checkbox" value="#101820"></label>
                                                    <label class="black"><input type="checkbox" class="color-checkbox" value="#000000"></label>
                                                </div>
                                            </div>





                                            <div class="gradientColorAdjust">
                                                <h6 class="f14 mb-2">Change Angle </h6>

                                                <div class="gradient-controls">
                                                    <div class="gradient-slider defItems">
                                                        <div class="flexRow">
                                                            <label>Angle: </label>
                                                            <span id="gradientAngleValue">0°</span>
                                                        </div>
                                                        <input type="range" id="gradientAngle" min="0" max="360" value="0">
                                                    </div>
                                                    <h6 class="f14 mb-2">Change Scale </h6>

                                                    <div class="gradient-slider defItems">
                                                        <label>Scale: <span id="gradientScaleValue">1.0</span></label>
                                                        <input type="range" id="gradientScale" min="0.1" max="2" step="0.1" value="1.0">
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <div class="tab-pane fade" id="logoContent">
                                    <div class="season_content" id="logoContent">
                                        <div class="logoUploadSection">
                                            <div class="contentHeader">
                                                <h6>Logo</h6>
                                            </div>
                                            <div class="uploadLogoMainDiv position-relative mt-2">
                                                <div class="logoFirstScreen" id="logoFirstScreen">
                                                    <label for="fileInput" class="uploadLabel">Upload</label>
                                                    <form class="uploadLogoForm">
                                                        <div class="custom-file-input">
                                                            <input type="file" id="fileInput" accept="image/*" />
                                                            <label for="fileInput" class="custom-file-label"> </label>
                                                            <button type="button" class="submitFrom">Browse</button>
                                                        </div>
                                                    </form>
                                                    <div class="note f13">
                                                        * Files such as PNG, SVG, etc., are accepted. We also support
                                                        other
                                                        common image formats for your convenience.
                                                    </div>


                                                </div>


                                                <div class="logoSecondScreen decalsPlacementsMeshes  " style="display: none;" id="logoSecondScreen">
                                                    <div class="goBAckBtn  backBtn1 backToFirstScreen">
                                                        <h6 class="noteText"> "Quick Unselect: Just Double-Click"</h6>
                                                        <a href="#" class="backBtn1 ">
                                                            <figure>
                                                                <img
                                                                    src="images/icons/arrowLeft.png" alt="Arrow Left" />
                                                            </figure>
                                                            Go
                                                            Back
                                                        </a>
                                                    </div>
                                                    <div class="textMeshesItems">
                                                        <h6 class="meshItemsTitle grey2">Uploaded Logos</h6>
                                                        <button id="deleteImageButton" class="deleteDecalIcon" style="background: none; border:none;">
                                                            <figure class="bottomLeftButton">
                                                                <img src="images/icons/deletIcon.png" alt="deleteDecalIcon"
                                                                    class="textMeshesItemsIcon TextRemoveValue" style="width: 15px;">
                                                            </figure>
                                                        </button>
                                                        <br>
                                                        <div class="text-center UploadImgArea">
                                                            <figure class="text-center d-flex my-0" style="position: relative; width: 100%;">
                                                                <img src="" alt="Uploaded Image Preview" class="uploadImgPreview" id="uploadedImagePreview"
                                                                    style="max-width: 100%; max-height: 100%; display: none;">
                                                                <div id="imagePreviewBorder" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                                                                border: 2px dashed blue; display: none; pointer-events: none;"></div>
                                                            </figure>
                                                        </div>
                                                    </div>

                                                    <form class="uploadLogoForm" style="margin: 15px 0;">
                                                        <div class="custom-file-input">
                                                            <input type="file" id="fileInput" accept="image/*">
                                                            <button type="button" class="btnBlack defBtnStyle" id="applyLogoButton">Apply Logo</button>
                                                        </div>
                                                    </form>
                                                </div>

                                                <div class="logoThirdScreen" style="display: none;">
                                                    <div class="decalsPlacementsMeshes">
                                                        <div class="contentHeader">
                                                            <h6>Please Choose Logo Placements</h6>
                                                        </div>
                                                        <div class="selectArea  " id="ImagePlacementsMeshes" style="display: none;">
                                                            <div id="dynamicImageMeshButtons" class="selectArea grid2"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="logoFourthScreen" style="display: none;" id="logoFourthScreen">

                                                    <!-- <div class="outline-controls">
                                                            <h4>Outline Settings</h4>
                                                            <div class="control-group">
                                                                <label>Outline Width:</label>
                                                                <button class="outline-minus-image">-</button>
                                                                <span id="outlineWidthValueImage">2px</span>
                                                                <button class="outline-plus-image">+</button>
                                                            </div>
                                                            <div class="control-group">
                                                                <label>Outline Color:</label>
                                                                <div class="outlineColorImage  text-color-palette color-palette">
                                                                    <div class="palette whiteSmoke" data-color="#F5F5F5"></div>
                                                                    <div class="palette green2" data-color="#16521F"></div>
                                                                    <div class="palette black" data-color="#1C1C1C"></div>
                                                                    <div class="palette teal" data-color="#008080"></div>
                                                                    <div class="palette green" data-color="#00FF00"></div>
                                                                    <div class="palette pink" data-color="#FFC0CB"></div>
                                                                </div>
                                                            </div>
                                                            <button id="toggleOutlineButton">Toggle Outline</button>
                                                        </div> -->

                                                    <div class="resize defItems">
                                                        <div class="d-flex justify-content-between">
                                                            <label for="resizeImgSlider">Resize Image</label>
                                                            <span id="resizeValue">50%</span>
                                                        </div>
                                                        <input type="range" class="w-100 mt-2" id="resizeImgSlider" min="10" max="200" step="1" value="50">
                                                    </div>
                                                    <div class="rotate defItems">
                                                        <div class="d-flex justify-content-between">

                                                            <label for="rotateImgSlider">Rotate Image</label>
                                                            <span id="rotateImgValue">0°</span>
                                                        </div>
                                                        <input type="range" class="w-100 mt-2" id="rotateImgSlider" min="0" max="360" step="1" value="0">
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="appliedDecalsList" id="appliedDecalsListImg">
                                        <!-- Dynamic text/image decal entries will appear here -->
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
                <div class=" col-md-8 rightSide position-relative">
                    <!-- <button class="exportVectorBtn  " id="exportVectorBtn">EXPORT EPS </button> -->
                    <!-- 
                    <div id="preloader">
                        <div class="loader"></div>
                        <img src="images/logo1.png" class="mob-logo">
                        <div class="progress-container">
                            <div class="progress-bar"></div>
                            <div class="progress-text">0%</div>
                        </div>
                    </div> -->
                    <div id="preloader" class="preloader">
                        <div class="preloader-content">
                            <div class="preloader-spinner"></div>
                            <div class="MainContent">
                                <img src="images/logo1.png" class="mob-logo">
                                <div id="preloaderProgress" class="preloader-progress">
                                    0%
                                </div>
                                <div id="preloaderTimeRemaining" class="preloader-time">Loading...</div>
                            </div>
                        </div>
                    </div>
                    <!-- HTML -->
                    <div class="undo-redo-controls">
                        <button id="undoButton" title="Undo (Ctrl+Z)">
                            <figure class="my-0"><img src="images/icons/Undo.png" alt=""></figure>
                        </button>
                        <button id="redoButton" title="Redo (Ctrl+Y)">
                            <figure class="my-0"><img src="images/icons/redo.png" alt=""></figure>
                        </button>
                    </div>
                    <div class="canvasControls">
                        <!-- <div class="lightAngle">
                            <label for="lightHeightSlider">Adjust Light:</label>
                            <input type="range" id="lightHeightSlider" min="0" max="10" value="0" step="0.1">
                        </div> -->

                        <div class="background-control flexColumn">
                            <label for="bgColorPicker" class="mb-2">Background Color:</label>
                            <input type="color" id="bgColorPicker" value="#eeeeee">

                        </div>
                        <div class="light-controls">
                            <div class="flexRow ">
                                <label class="  justify-content-between w-100">Light Rotation:
                                    <span id="lightRotationValue" class="angleValue">45°</span>
                                </label>
                            </div>
                            <input type="range" id="lightRotationSlider" min="0" max="360" value="45">
                            <div class="flexRow">
                                <label class=" justify-content-between w-100">Light Height:
                                    <span id="lightHeightValue" class="angleValue">5</span>
                                </label>
                            </div>
                            <input type="range" id="lightHeightSlider" min="0" max="100" value="5" step="0.1">

                            <div class="flexRow">
                                <label class=" justify-content-between w-100">Light Intensity:
                                    <span id="lightIntensityValue" class="angleValue">1</span>
                                </label>
                            </div>
                            <input type="range" id="lightIntensitySlider" min="0" max="10" value="1" step="0.1">
                        </div>
                    </div>
                    <div id="decalControls" style="display: none; position: absolute; pointer-events: all;">
                        <div class="drag-handle resize" title="Resize">↔</div>
                        <div class="drag-handle rotate" title="Rotate">↻</div>
                        <div class="drag-handle lock" title="Lock/Unlock">🔒</div>
                        <div class="drag-handle remove" title="Remove Decal">✕</div>
                    </div>
                    <div class="view-angle-controls">
                        <button class="frontAngle">Front</button>
                        <button class="backAngle">Back</button>
                        <button class="leftAngle">Left</button>
                        <button class="rightAngle">Right</button>
                    </div>
                    <div id="threejs-container"></div>
                    <div id="controls">
                        <button id="toggleRotationBtn"></button>
                        <button id="rotateRight">
                            <figure><img src="images/icons/moveLeft.png" alt="Rotate Right"></figure>
                        </button>
                        <button id="rotateLeft">
                            <figure><img src="images/icons/moveRight.png" alt="Rotate Left"></figure>
                        </button>
                        <button id="zoomOut">
                            <figure><img src="images/icons/zoomOut.png" alt="Zoom In"></figure>
                        </button>
                        <button id="zoomIn">
                            <figure><img src="images/icons/zoomIn.png" alt="Zoom Out"></figure>
                        </button>

                    </div>
                    <div class="arrowdirection">
                        <figure>
                            <img src="images/icons/rotate.png" alt="">
                        </figure>
                    </div>

                </div>
                <div class="row  m-auto p-0 w-100 my-4 ">

                    <div class="col-md-12">
                        <div class="innerDiv flexRow justify-content-between footSec">
                            <div class="sidebarFooter desktopView">
                                <div class="card bg-none border-none grid2">
                                    <div><span>Price/Piece : 12 USD&nbsp;</span> <br><span>Estimated delivery date: 25.07 -
                                        </span></div>
                                    <div class="offerBadge text-end">
                                        <p> 26.07.2024</p>
                                        <h6 class="f14 mb-0">10% off per piece</h6>
                                    </div>
                                </div>
                            </div>

                            <div class="saveChangeDiv">
                                <div class=" flexRow justify-content-between w-100">
                                    <div class="  flexRow ">
                                        <a href="#" class="flexRow flex_items">
                                            <figure><img src="images/icons/SaveDesignIcon.png" alt=""></figure> Save Design
                                        </a>
                                        <a href="#" class="d-flex flex_items">
                                            <figure><img src="images/icons/shareIcon.png" alt=""></figure> Share
                                        </a>
                                        <a href="#" class="d-flex flex_items">
                                            <figure><img src="images/icons/pdfDownloadIcon.png" alt=""></figure> PDF
                                        </a>
                                    </div>
                                    <div>
                                        <!-- <a href="roasterDetails.php" class="blueBtn flexRow justify-content-center ">Continue <img
                                            src="images/icons/blueBtnIcon.png" alt="">
                                    </a> -->

                                        <button class="blueBtn flexRow justify-content-center  convert_into_eps" id="continueBtnInmodel">Continue <img
                                                src="images/icons/blueBtnIcon.png" alt="">
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>


    <form id="imagePostForm" method="POST" action="roasterDetails.php">
        <input type="hidden" name="frontImage" id="frontImageInput">
        <input type="hidden" name="backImage" id="backImageInput">
        <input type="hidden" name="leftImage" id="leftImageInput">
        <input type="hidden" name="rightImage" id="rightImageInput">
        <input type="hidden" name="logoImage" id="logoImageInput">
    </form>

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
    <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/geometries/DecalGeometry.js"></script>
    <!-- Jquery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
        integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
        crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.activity-indicator/1.0.0/jquery.activity-indicator.min.js"
        integrity="sha512-vIgIa++fkxuAQ95xP3yHzA33Z+iwePLCFeeMcIOqmHhTEAvfBoFap1nswEwU/xE/o4oW0putZ6dbY7JS1emkdQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <!-- <script type="module" src="js/jerseyVar.js"></script> -->
    <script type="module" src="js/decals.js"></script>
    <script type="module" src="js/useful.js"></script>

    <!-- <script type="module" src="js/DesignMain.js"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js"></script>


    <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js"></script>

    <script>
        document.querySelectorAll('.ShowGradientSecondScreen').forEach(button => {
            button.addEventListener('click', function() {
                // Hide Screen 3
                document.querySelector('.gradientFirstScreen').style.display = 'none';
                // Show gradientSecondScreen
                document.querySelector('.gradientSecondScreen').style.display = 'block';
            });
        });
        document.querySelectorAll('.goBAckToGradientFirstScreen').forEach(button => {
            button.addEventListener('click', function() {
                // Hide Screen 3
                document.querySelector('.gradientSecondScreen').style.display = 'none';
                // Show gradientSecondScreen
                document.querySelector('.gradientFirstScreen').style.display = 'block';
            });
        });
    </script>

    <script>
        function handleNextClick() {
            document.querySelector('.FrontScreen').style.display = 'none';
            document.querySelector('.SecondScreen').style.display = 'block';
        }

        function handleGoBackClick() {
            document.querySelector('#patternContent .SecondScreen').style.display = 'none';
            document.querySelector('#patternContent .FrontScreen').style.display = 'block';
        }
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelector('.SecondScreen').style.display = 'none';
        });
    </script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Get all design images
            const designImages = document.querySelectorAll('.designsItems img');

            // Get all color palette divs
            const colorPalettes = document.querySelectorAll('.color-palette .palette');

            // Loop through each design image
            designImages.forEach(function(img) {
                img.addEventListener('click', function() {
                    // Get the color mappings for the selected design
                    const colorMappings = JSON.parse(img.getAttribute('data-colors'));

                    // Reset the color palette (hide all colors)
                    colorPalettes.forEach(function(palette) {
                        palette.style.display = 'none'; // Hide all colors initially
                    });

                    // Show only the colors related to the selected design
                    colorPalettes.forEach(function(palette) {
                        if (colorMappings.includes(palette.getAttribute('data-color'))) {
                            palette.style.display = 'block'; // Show the matching colors
                        }
                    });
                });
            });
        });

        $('#meshColorSwitch').on('click', function() {
            $('#meshColorOptions').toggle();
            $('#meshColorpst').toggle();
        });
    </script>

    <script>
        const lockButton = document.getElementById('lockDecalButton');
        const unlockButton = document.getElementById('unlockDecalButton');

        lockButton.addEventListener('click', () => {
            lockButton.style.display = 'none';
            unlockButton.style.display = 'inline-block';
        });

        unlockButton.addEventListener('click', () => {
            unlockButton.style.display = 'none';
            lockButton.style.display = 'inline-block';
        });
    </script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const nameTab = document.getElementById('nameTab');
            const numberTab = document.getElementById('numberTab');

            const contentHeader = document.querySelector('#textContent .textDecalFirstScreen .subTabsTitle');
            const inputLabel = document.querySelector('#textContent .input-container label.sp');
            const textInput = document.querySelector('#textContent #textInput');

            function resetScreens() {
                document.getElementById('screen2')?.style && (document.getElementById('screen2').style.display = 'none');
                document.getElementById('screen3')?.style && (document.getElementById('screen3').style.display = 'none');
                document.getElementById('screen1').style.display = 'block';

                if (typeof activeTextDecalIndex !== 'undefined') activeTextDecalIndex = -1;
                if (typeof activeImageDecalIndex !== 'undefined') activeImageDecalIndex = -1;
                if (typeof isTextMoving !== 'undefined') isTextMoving = false;
                if (typeof isImageMoving !== 'undefined') isImageMoving = false;
                if (typeof controls !== 'undefined') controls.enabled = true;
                document.body.style.cursor = "";
            }

            nameTab.addEventListener('click', function() {
                resetScreens();
                contentHeader.textContent = 'Add Name';
                inputLabel.textContent = 'Enter name to display on the jersey.';
                textInput.placeholder = 'Enter your name here';
                textInput.value = '';
            });

            numberTab.addEventListener('click', function() {
                resetScreens();
                contentHeader.textContent = 'Add Number';
                inputLabel.textContent = 'Enter number to display on the jersey.';
                textInput.placeholder = 'Enter your number here';
                textInput.value = '';
            });
        });
    </script>




    <script>
        document.getElementById('toggleBtn').addEventListener('click', function() {
            document.getElementById('sidebar').classList.toggle('active');
        });
    </script>

    <!-- convert into eps file -->

    <script>
        $(document).on('click', '.convert_into_eps', function() {
            var canvasEl = document.querySelector('#threejs-container canvas');
            //  var canvas = new fabric.Canvas(canvasEl); 
            // var ctx = canvasEl.getContext('2d');
            // var dataURL = canvasEl.toDataURL('image/png');
            //  var canvas = new fabric.Canvas(canvasEl);
            //  const svgData = canvas.toSVG();

            var canvas = $('#threejs-container canvas')[0];

            // Get data URL of the canvas
            try {
                var dataURL = canvas.toDataURL('image/png');
                console.log('Canvas DataURL length:', dataURL.length);
            } catch (e) {
                console.error('Canvas is tainted by CORS:', e);
            }

            // return false ; 
            // Create SVG manually with embedded image
            var svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
                <image href="${dataURL}" width="${canvas.width}" height="${canvas.height}" />
                </svg>`;

            console.log(svg);
            return;


            $.ajax({
                url: 'epsConvert.php',
                method: 'POST',
                data: {
                    svg: svg
                },
                success: function(data) {
                    console.log(data);
                },
                error: function(xhr, status, error) {
                    console.log(error);
                }
            })

        });
    </script>

    <script>
        // Function to show the correct header based on clicked tab
        function updatePlacementHeader(tabType) {
            const headers = {
                text: document.getElementById('textPlacement'),
                name: document.getElementById('namePlacement'),
                number: document.getElementById('numberPlacement'),
            };

            // Hide all headers first
            Object.values(headers).forEach(header => {
                header.style.display = 'none';
            });

            // Show the selected one
            if (headers[tabType]) {
                headers[tabType].style.display = 'block';
            }
        }

        // Add event listeners for each relevant tab
        document.getElementById('textTab').addEventListener('click', () => updatePlacementHeader('text'));
        document.getElementById('nameTab').addEventListener('click', () => updatePlacementHeader('name'));
        document.getElementById('numberTab').addEventListener('click', () => updatePlacementHeader('number'));

        // Optional: hide all headers initially
        updatePlacementHeader(); // or pass a default like `updatePlacementHeader('name')`
    </script>
</body>

</html>