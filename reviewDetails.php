<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jog 3D Configurator (Review Details)</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <!-- <link rel="stylesheet" href="style/main.css"> -->
    <!-- <link rel="stylesheet" href="style/default.css"> -->
    <link rel="stylesheet" href="style/root.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="icon" type="image/x-icon" href="images/jogLogo2.png">
    <link href="https://fonts.googleapis.com/css2?family=Bella:wght@400;700&display=swap" rel="stylesheet">

    <style>
        .itemName {
            font-size: 17px;
        }

        .itemsDetails {
            width: 50%;
            padding: 5px 20px;
        }

        .itemsDetails a {
            color: #274183;
            padding-right: 20px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: underline !important;
        }

        .divTitle {
            margin: 0 0 20px 0;

        }

        .blueBtn {
            background: #2F50A3;
            padding: 8px;
            text-align: center;
            color: #FFF;
            transition: 0.8s ease;
            margin-top: 20px;
            border: 2px solid #2F50A3;
        }

        .blueBtn:hover {
            color: #2F50A3;
            background: #FFF;

        }

        #roasterDetailsPopup .modal-dialog {
            max-width: 60%;
        }

        #roasterDetailsPopup .modal-header {
            background: #222222;
            display: inline;
            color: #fff;
        }

        .close {
            position: absolute;
            right: 20px;
            background: #eee;
            top: 20px;
            border: none;
            padding: 0 10px;
            width: 30px;
            height: 30px;
        }

        .closeModalBtn {
            background: #222;
            color: #FFF;
            font-size: 14px;
            border-radius: 2px;
            padding: 5px 15px;
        }

        .saveModalBtn {
            background: #2F50A3;
            color: #FFF;
            font-size: 14px;
            border-radius: 2px;
            padding: 5px 15px;
        }

        .ReviewDetailsMain table th,
        td {
            font-size: 14px;
            padding: 5px 20px;
            border: none;
        }

        .ReviewDetailsMain .leftSide {
            position: relative;
        }

        .ReviewDetailsMain .leftSide .border-none {
            position: sticky;
            top: 180px;
            z-index: 100px;
        }

        .ReviewDetailsMain .quantitySize td,
        .ReviewDetailsMain .quantitySize th {

            border: 1px solid #DDDDDD
        }

        .ReviewDetailsMain table {
            border: 1px solid #DDDDDD
        }

        .roasterDetailsTable {
            margin: 20px 0;
        }

        .roasterDetailsTable tbody {
            background: #F9F9F9;
        }



        .roasterDetailsTable select,
        .roasterDetailsTable select option {
            cursor: pointer !important;
        }

        td {
            padding: 7px 20px !important;
            vertical-align: middle;
        }



        #addRowButton {
            background: #FFFFFF;
            padding: 8px;
            border: none;
        }

        .deleteRowButton {
            border: none;
            background: none;
        }

        .ReviewDetailsMain .rightSide table input {
            width: 140px;
            height: 50px;
            padding: 10px;
            text-transform: capitalize;
        }
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

    <section class="generatePO">
        <div class="container">
            <div class="row">
                <div class="col-md-8 m-auto">

                    <!-- PDF 1 -->
                    <div class="innerDiv">
                        <div class="step1 stepsItems">
                            <div class="upperHead">
                                <figure class="logo my-auto">
                                    <img src="images/logo1.png" alt="">
                                </figure>
                            </div>
                            <div class="stepNavigate">
                                <h6>Style <span class="styleName">The Premier Hockey Jersey</span></h6>
                            </div>
                            <div class="modelAngleView grid4">
                                <figure>
                                    <img src="images/main/frontAngle.png" alt="">
                                </figure>
                                <figure>
                                    <img src="images/main/backAngle.png" alt="">
                                </figure>
                                <figure>
                                    <img src="images/main/leftAngle.png" alt="">
                                </figure>
                                <figure>
                                    <img src="images/main/rightAngle.png" alt="">
                                </figure>
                            </div>
                            <div class="tableArea fabricDetails">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Fabric Details</th>
                                            <th scope="col">Collar</th>
                                            <th scope="col">Stripes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h6> <span>Base</span> Dura Light Plus</h6>
                                                <h6> <span>Shoulder</span>Dura Light</h6>

                                            </td>
                                            <td>
                                                <h6> <span>Style</span>Lace Neck with Triangle</h6>
                                            </td>
                                            <td>
                                                <h6> <span>Main Body</span>1-2-1</h6>
                                                <h6> <span>Left Sleeve</span>1-2-1</h6>
                                                <h6> <span>Right Sleeve</span>1-2-1</h6>
                                            </td>

                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <div class="tableArea ColorDetails">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col" colspan="2">Color Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h6 class="tableDataStyle2">
                                                    <span>Upper Base</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> PMS 200C UNIVERSITY RED
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6 class="tableDataStyle2 justify-content-end">
                                                    <span>Base Stripe 1</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> PMS 542C NC BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <h6 class="tableDataStyle2">
                                                    <span>Lower Hem</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> PMS 200C UNIVERSITY RED
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6 class="tableDataStyle2 justify-content-end">
                                                    <span>Base Stripe 2</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> PMS 542C NC BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <h6 class="tableDataStyle2">
                                                    <span>Right Upper Sleeve</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> PMS 7540C KNIGHTS GREY
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6 class="tableDataStyle2 justify-content-end">
                                                    <span>Base Stripe 3</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> PMS 542C NC BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <h6 class="tableDataStyle2">
                                                    <span>Right Lower Sleeve</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> PMS 7540C KNIGHTS GREY
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6 class="tableDataStyle2 justify-content-end">
                                                    <span>Collar 1</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> DARK NAVY
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <h6 class="tableDataStyle2">
                                                    <span>Left Upper Sleeve</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> DARK NAVY
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6 class="tableDataStyle2 justify-content-end">
                                                    <span>Collar 2</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> DARK NAVY
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <h6 class="tableDataStyle2">
                                                    <span>Left Lower Sleeve</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> DARK NAVY
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6 class="tableDataStyle2 justify-content-end">
                                                    <span>Shoulder Yoke</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> DARK NAVY
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <h6 class="tableDataStyle2">
                                                    <span>Sleeve Stripe 1</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> PMS 542C NC BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <h6 class="tableDataStyle2">
                                                    <span>Sleeve Stripe 2</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> PMS 542C NC BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                            <td></td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <h6 class="tableDataStyle2">
                                                    <span>Sleeve Stripe 3</span>
                                                    <div class="colorArea">
                                                        <span class="ColorApply activeColor"></span> PMS 542C NC BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                            <td></td>
                                        </tr>



                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- PDF 2 -->
                    <div class="innerDiv ">
                        <div class="step2 stepsItems">
                            <div class="upperHead">
                                <figure class="logo my-auto">
                                    <img src="images/logo1.png" alt="">
                                </figure>
                            </div>
                            <div class="stepNavigate">
                                <h6>Style <span class="styleName">The Premier Hockey Jersey</span></h6>
                            </div>
                            <div class="tableArea numberDetails">
                                <h5 class="tableFor">Number Details</h5>
                                <table class="table">
                                    <thead>
                                        <tr class="thead2">
                                            <th scope="col">Placement</th>
                                            <th scope="col">Size</th>
                                            <th scope="col">Font</th>
                                            <th scope="col">Fill</th>
                                            <th scope="col">Outline</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h6 class="fw6"> Front-Chest </h6>
                                            </td>
                                            <td>4.00"H X 5.00"W</td>
                                            <td>Spantaran</td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow ">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 class="fw6"> Back </h6>
                                            </td>
                                            <td>4.00"H X 5.00"W</td>
                                            <td>Spantaran</td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow ">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 class="fw6"> Left Sleeve</h6>
                                            </td>
                                            <td>4.00"H X 5.00"W</td>
                                            <td>Spantaran</td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow ">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 class="fw6"> Right Sleeve</h6>
                                            </td>
                                            <td>4.00"H X 5.00"W</td>
                                            <td>Spantaran</td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow ">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="tableArea nameDetails">
                                <h5 class="tableFor">Name Details</h5>
                                <table class="table">
                                    <thead>
                                        <tr class="thead2">
                                            <th scope="col">Placement</th>
                                            <th scope="col">Size</th>
                                            <th scope="col">Font</th>
                                            <th scope="col">Fill</th>
                                            <th scope="col">Outline</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h6 class="fw6"> Front-Chest </h6>
                                            </td>
                                            <td>4.00"H X 5.00"W</td>
                                            <td>Spantaran</td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow ">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 class="fw6"> Back </h6>
                                            </td>
                                            <td>4.00"H X 5.00"W</td>
                                            <td>Spantaran</td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow ">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 class="fw6"> Left Sleeve</h6>
                                            </td>
                                            <td>4.00"H X 5.00"W</td>
                                            <td>Spantaran</td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow ">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 class="fw6"> Right Sleeve</h6>
                                            </td>
                                            <td>4.00"H X 5.00"W</td>
                                            <td>Spantaran</td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow ">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                            <td>
                                                <h6>
                                                    <div class="colorArea flexRow">
                                                        <span class="ColorApply activeColor"></span> BLUE
                                                    </div>
                                                </h6>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="grid2">
                                <div class="tableArea shoulderYokeLogo LogoPlacement">
                                    <h5 class="tableFor">Shoulder Yoke Logo</h5>
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <figure><img src="images/main/shoulderLogo.png" alt=""></figure>
                                                    <h6 class=" ">
                                                        <span>Placement</span>
                                                        Shoulder left & Right
                                                    </h6>
                                                    <h6 class=" ">
                                                        <span>Size</span>
                                                        4.00"H X 5.00"W
                                                    </h6>
                                                    <h6 class=" ">
                                                        <span>Name</span>
                                                        Liberty Logo.svg
                                                    </h6>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="tableArea frontBackLogo LogoPlacement">
                                    <h5 class="tableFor">Back Logo</h5>
                                    <table class="table">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <figure><img src="images/main/frontLogo.png" alt=""></figure>
                                                    <h6 class=" ">
                                                        <span>Placement</span>
                                                        Shoulder left & Right
                                                    </h6>
                                                    <h6 class=" ">
                                                        <span>Size</span>
                                                        4.00"H X 5.00"W
                                                    </h6>
                                                    <h6 class=" ">
                                                        <span>Name</span>
                                                        Liberty Logo.svg
                                                    </h6>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>


                    <!-- PDF 3 -->
                    <div class="innerDiv ">
                        <div class="step3 stepsItems">
                            <div class="upperHead">
                                <figure class="logo my-auto">
                                    <img src="images/logo1.png" alt="">
                                </figure>
                            </div>
                            <div class="stepNavigate">
                                <h6>Style <span class="styleName">The Premier Hockey Jersey</span></h6>
                            </div>
                            <div class="tableArea numberDetails">
                                <h5 class="tableFor">Roster Details</h5>
                                <table class="table">
                                    <thead>
                                        <tr class="thead2">
                                            <th scope="col">Player Name</th>
                                            <th scope="col">Size</th>
                                            <th scope="col">Jersey No.</th>
                                            <th scope="col">Color</th>
                                            <th scope="col">QTY</th>
                                            <th scope="col">C or A</th>
                                            <th scope="col">Flag</th>
                                            <th scope="col">Name For Packing</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>John</td>
                                            <td>YXS-38</td>
                                            <td>10</td>
                                            <td>Red</td>
                                            <td>1</td>
                                            <td>A</td>
                                            <td>-</td>
                                            <td>✔</td>
                                        </tr>
                                        <tr>
                                            <td>Emma</td>
                                            <td>YM-40</td>
                                            <td>8</td>
                                            <td>Blue</td>
                                            <td>2</td>
                                            <td>B</td>
                                            <td>✔</td>
                                            <td>-</td>
                                        </tr>
                                        <tr>
                                            <td>Liam</td>
                                            <td>YL-42</td>
                                            <td>12</td>
                                            <td>Green</td>
                                            <td>3</td>
                                            <td>C</td>
                                            <td>-</td>
                                            <td>-</td>
                                        </tr>
                                        <tr>
                                            <td>Sophia</td>
                                            <td>XS-36</td>
                                            <td>9</td>
                                            <td>Yellow</td>
                                            <td>4</td>
                                            <td>A</td>
                                            <td>✔</td>
                                            <td>✔</td>
                                        </tr>
                                        <tr>
                                            <td>Noah</td>
                                            <td>S-38</td>
                                            <td>15</td>
                                            <td>Black</td>
                                            <td>5</td>
                                            <td>B</td>
                                            <td>-</td>
                                            <td>✔</td>
                                        </tr>
                                        <tr>
                                            <td>Ava</td>
                                            <td>M-40</td>
                                            <td>7</td>
                                            <td>White</td>
                                            <td>6</td>
                                            <td>C</td>
                                            <td>✔</td>
                                            <td>-</td>
                                        </tr>
                                        <tr>
                                            <td>Ethan</td>
                                            <td>L-42</td>
                                            <td>13</td>
                                            <td>Purple</td>
                                            <td>7</td>
                                            <td>A</td>
                                            <td>-</td>
                                            <td>-</td>
                                        </tr>
                                        <tr>
                                            <td>Isabella</td>
                                            <td>XL-44</td>
                                            <td>11</td>
                                            <td>Orange</td>
                                            <td>8</td>
                                            <td>B</td>
                                            <td>✔</td>
                                            <td>✔</td>
                                        </tr>
                                        <tr>
                                            <td>James</td>
                                            <td>XXL-46</td>
                                            <td>14</td>
                                            <td>Pink</td>
                                            <td>9</td>
                                            <td>C</td>
                                            <td>-</td>
                                            <td>-</td>
                                        </tr>
                                        <tr>
                                            <td>Charlotte</td>
                                            <td>3XL-48</td>
                                            <td>6</td>
                                            <td>Teal</td>
                                            <td>10</td>
                                            <td>A</td>
                                            <td>✔</td>
                                            <td>-</td>
                                        </tr>
                                        <tr>
                                            <td>Oliver</td>
                                            <td>4XL-50</td>
                                            <td>5</td>
                                            <td>Maroon</td>
                                            <td>11</td>
                                            <td>B</td>
                                            <td>-</td>
                                            <td>✔</td>
                                        </tr>
                                        <tr>
                                            <td>Mia</td>
                                            <td>5XL-52</td>
                                            <td>4</td>
                                            <td>Grey</td>
                                            <td>12</td>
                                            <td>C</td>
                                            <td>-</td>
                                            <td>-</td>
                                        </tr>
                                    </tbody>

                                    <tfoot>
                                        <tr>
                                            <td colspan="8">Total QTY : 11</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="ReviewDetailsMain d-none">
        <div class="container">
            <div class="row">
                <div class="col-md-7 leftSide">
                    <div class="card border-none bg-none">
                        <h6 ITEMS class="divTitle">
                            YOUR ITEMS
                        </h6>
                        <div class="items d-flex ">
                            <figure class="m-0"><img src="images/AllProducts/product1.png" alt="" class="designImg">
                            </figure>
                            <div class="itemsDetails">
                                <h5 class="itemName ">Premier Jerseys</h5>
                                <p class="itemDesc sp">Classic Cut and Sew Jersey with twill appliques</p>
                                <a href="#" data-toggle="modal" data-target="#roasterDetailsPopup">Roster details</a>
                                <a href="#">Preview 3d Jersey</a>
                                <div class="threeDots">
                                    <figure>
                                        <img src="images/icons/threeDot.png" alt="" class="toggleButton">
                                    </figure>
                                    <button class="deleteButton" style="display: none;">Delete</button>
                                </div>

                            </div>
                        </div>
                        <a href="#" class="blueBtn">Submit
                        </a>
                    </div>
                </div>
                <div class="col-md-5 rightSide">
                    <div class="card border-none bg-none">
                        <h6 ITEMS class="divTitle">
                            SUMMARY <img src="images/icons/shirt.png" alt="" class="iconImg">
                        </h6>
                        <div class="card border-none">
                            <table class="table  table-striped table-bordered table-hover">
                                <tbody>
                                    <tr>
                                        <th colspan="2" style="padding-left: 20px;">GARMENT INFO</th>
                                    </tr>
                                    <tr>
                                        <td scope="row" style="width: 50%;">Sport</td>
                                        <td>Hockey</td>
                                    </tr>
                                    <tr>
                                        <td scope="row" style="width: 50%;">Product Type</td>
                                        <td>Premier Jersey</td>
                                    </tr>
                                    <tr>
                                        <td scope="row" style="width: 50%;">Fabric</td>
                                        <td>Polyester</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="table  table-striped table-bordered table-hover">
                                <tbody>
                                    <tr>
                                        <th colspan="2" style="padding-left: 20px;">COLOR</th>
                                    </tr>
                                    <tr>
                                        <td scope="row" style="width: 50%;">Primary</td>
                                        <td>
                                            <div class="d-flex gap-2">
                                                <div class="color"
                                                    style="background: #1BBEC6;  width: 20px;    height: 20px;">
                                                </div>
                                                <div> ( BRIGHT CYAN )</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td scope="row" style="width: 50%;">Secondary</td>
                                        <td>
                                            <div class="d-flex gap-2">
                                                <div class="color"
                                                    style="background: #A21D27;  width: 20px;    height: 20px;">
                                                </div>
                                                <div>
                                                    ( CRIMSON RED )
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td scope="row" style="width: 50%;">Tertiary</td>
                                        <td>
                                            <div class="d-flex gap-2">
                                                <div class="color"
                                                    style="background: #060606;  width: 20px;    height: 20px;">
                                                </div>
                                                <div>
                                                    ( RICH BLACK )
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                            <table class="table  table-striped table-bordered table-hover">
                                <tbody>
                                    <tr>
                                        <th colspan="3" style="padding-left: 20px;">LOGO PLACEMENT</th>
                                    </tr>
                                    <tr>
                                        <td scope="row">Front Chest</td>
                                        <td><input type="text" id="name" name="name" required></td>
                                        <td>
                                            <div class="d-flex gap-2">
                                                <div class="color"
                                                    style="background: #1A1617;  width: 20px;    height: 20px;">
                                                </div>
                                                <div> ( CHARCOAL BLACK )</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Back Center</td>
                                        <td><input type="text" id="name" name="name" required></td>
                                        <td>
                                            <div class="d-flex gap-2">
                                                <div class="color"
                                                    style="background: #EA4423;  width: 20px;    height: 20px;">
                                                </div>
                                                <div> ( BRIGHT CYAN )</div>
                                            </div>
                                        </td>
                                    </tr>


                                </tbody>
                            </table>
                            <table class="table  table-striped table-bordered table-hover">
                                <tbody>
                                    <tr>
                                        <th colspan="3" style="padding-left: 20px;">ROSTER DECORATION</th>
                                    </tr>
                                    <tr>
                                        <td scope="row">Shoulders</td>
                                        <td><input type="text" id="name" name="name" required></td>
                                        <td>
                                            <div class="d-flex gap-2">
                                                <div class="color"
                                                    style="background: #1A1617;  width: 20px;    height: 20px;">
                                                </div>
                                                <div> ( CHARCOAL BLACK )</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td scope="row">Back Center</td>
                                        <td><input type="text" id="name" name="name" required></td>
                                        <td>
                                            <div class="d-flex gap-2">
                                                <div class="color"
                                                    style="background: #EA4423;  width: 20px;    height: 20px;">
                                                </div>
                                                <div> ( BRIGHT CYAN )</div>
                                            </div>
                                        </td>
                                    </tr>


                                </tbody>
                            </table>

                        </div>
                        <div class="quantitySize">
                            <h6 ITEMS class="divTitle">
                                QUANTITY & SIZE REVIEW
                            </h6>
                            <table class="table table-bordered table-hover">
                                <thead class="thead-dark">
                                    <tr>
                                        <th scope="col" class="text-center">Size</th>
                                        <th scope="col" class="text-center">M</th>
                                        <th scope="col" class="text-center">L</th>
                                        <th scope="col" class="text-center">XL</th>
                                        <th scope="col" class="text-center">XXL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row" class="text-center">QTY</th>
                                        <td scope="row" class="text-center">10</td>
                                        <td scope="row" class="text-center">5</td>
                                        <td scope="row" class="text-center">2</td>
                                        <td scope="row" class="text-center">3</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" colspan="4" style="padding-left: 45px;">Total</th>

                                        <td scope="row" class="text-center">20</td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
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
    <div class="modal fade" id="roasterDetailsPopup" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title whiteText" id="roasterDetailsPopupLabel">ROSTER DETAILS</h5>

                    <p class="sp whiteText m-0">Edit the details if necessary.</p>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <table class="table table-striped table-bordered table-hover" id="playerTable">
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
                                <td>John</td>
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
                                <td>Paul</td>
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
                                <td>Smith</td>
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
                                <td>Tame</td>
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
                                <td><input type="text" id="name" name="name" required class="w-100"></td>
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
                                            src="images/icons/addRowBtn.png" alt="" class="iconImg"></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn closeModalBtn " data-dismiss="modal">Close</button>
                    <button type="button" class="btn saveModalBtn ">Save changes</button>
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
        // Event listener for toggling the delete button
        document.querySelectorAll('.toggleButton').forEach(img => {
            img.addEventListener('click', function() {
                const deleteButton = img.closest('.threeDots').querySelector('.deleteButton');
                if (deleteButton.style.display === 'none' || deleteButton.style.display === '') {
                    deleteButton.style.display = 'block'; // Show button
                } else {
                    deleteButton.style.display = 'none'; // Hide button
                }
            });
        });
    </script>
</body>

</html>