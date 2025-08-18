<?php
    $current_page = basename($_SERVER['PHP_SELF']);
?>

<div class="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
    <ul class="navbar-nav">
    <li class="nav-item">
        <a class="nav-link active bg-gradient-dark text-white" href="dashboard.html">
        <i class="material-symbols-rounded opacity-5">dashboard</i>
        <span class="nav-link-text ms-1">Dashboard</span>
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark  <?=$current_page == 'category.php' ? 'active' : ''?>" href="category.php">
        <i class="material-symbols-rounded opacity-5">table_view</i>
        <span class="nav-link-text ms-1">Category </span>
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark <?=$current_page == 'sub_category.php' ? 'active' : ''?> " href="sub_category.php">
        <i class="material-symbols-rounded opacity-5">table_view</i>
        <span class="nav-link-text ms-1">Sub Category </span>
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark <?=$current_page == 'designs.php' ? 'active' : ''?> " href="designs.php">
        <i class="material-symbols-rounded opacity-5">table_view</i>
        <span class="nav-link-text ms-1">Designs </span>
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark <?=$current_page == 'pattern.php' ? 'active' : ''?>" href="pattern.php">
        <i class="material-symbols-rounded opacity-5">receipt_long</i>
        <span class="nav-link-text ms-1">Pattern</span>
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark" href="virtual-reality.html">
        <i class="material-symbols-rounded opacity-5">view_in_ar</i>
        <span class="nav-link-text ms-1">Virtual Reality</span>
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark" href="rtl.html">
        <i class="material-symbols-rounded opacity-5">format_textdirection_r_to_l</i>
        <span class="nav-link-text ms-1">RTL</span>
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark" href="notifications.html">
        <i class="material-symbols-rounded opacity-5">notifications</i>
        <span class="nav-link-text ms-1">Notifications</span>
        </a>
    </li>
    <li class="nav-item mt-3">
        <h6 class="ps-4 ms-2 text-uppercase text-xs text-dark font-weight-bolder opacity-5">Account pages</h6>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark" href="profile.html">
        <i class="material-symbols-rounded opacity-5">person</i>
        <span class="nav-link-text ms-1">Profile</span>
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark" href="sign-in.html">
        <i class="material-symbols-rounded opacity-5">login</i>
        <span class="nav-link-text ms-1">Sign In</span>
        </a>
    </li>
    <li class="nav-item">
        <a class="nav-link text-dark" href="sign-up.html">
        <i class="material-symbols-rounded opacity-5">assignment</i>
        <span class="nav-link-text ms-1">Sign Up</span>
        </a>
    </li>
    </ul>
</div>