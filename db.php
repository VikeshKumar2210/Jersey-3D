  <?php
if (session_status() == PHP_SESSION_NONE) {
	session_start();
}

ini_set('display_errors', 1);
error_reporting(~0);

date_default_timezone_set("Asia/Bangkok");


/*$serverName = "localhost";
	$userName = "marnrood";
	$userPassword = "442105";
	$dbName = "whitty99_online_services";
	
	//$dbName2 = "inventory";
	$dbName3 = "internal";*/


$serverName = "localhost";
$userName = "root";
$userPassword = "";
$dbName = "3djersey";
//$dbName2 = "whitty99_inventory";
$dbName3 = "3djersey";


$conn = new mysqli($serverName, $userName, $userPassword, $dbName);

$conn3 = new mysqli($serverName, $userName, $userPassword, $dbName3);

mysqli_set_charset($conn, "utf8");



//---======= Permission in Production Schedule =======---

if ($conn->connect_errno) {
	echo $conn->connect_error;
	exit;
} else {
}
