<?php
include('../db.php');
// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
   $id= $_POST['id']; 
   $sql = $conn->query("DELETE FROM categories  Where id='$id'");
   echo json_encode(['status'=>200 , 'delete'=>$sql]);  
   exit ;     
}

?>