<?php
// Include database connection
include('../db.php');
require 'helper.php'; 


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and get form data
    $name = $conn->real_escape_string($_POST['name']);
    $category_id = (int)$_POST['category_id'];
    $description = $conn->real_escape_string($_POST['description']);
    $id  = !empty($_POST['sub_id']) ? $_POST['sub_id'] : 0 ; 
    $old_src = !empty($_POST['old_src']) ? $_POST['old_src'] : 0; 

 
    $helper = new helper(); 
    $image_name = $helper->AddEditImage('image' , $old_src)  ;  
  
      if(!$id):
        if ($image_name) {
            // Insert data into the `subcategories` table
            $sql_insert = "INSERT INTO `subcategories` (`category_id`, `name`, `image`, `description`, `insert_date`, `updated_date`)
                           VALUES ('$category_id', '$name', '$image_name', '$description', NOW(), NOW())";

            if ($conn->query($sql_insert) === TRUE) {
                echo "Sub-category added successfully!";
                header("Location:./sub_category.php");
            } else {
                echo "Error: " . $conn->error;
            }
        } else {
            echo "Failed to upload the image.";
        }
  
    else: 
       $update_sql = $conn->query("UPDATE subcategories  SET name= '$name' , image='$image_name' , description='$description' Where id='$id'");
       if($update_sql == TRUE){
          echo 'Updated successfully'; 
          header("Location:./sub_category.php");
       }
endif ; 
    
}



?>
