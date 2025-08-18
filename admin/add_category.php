<?php
include('../db.php');
// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Get form data
    $name = $conn->real_escape_string($_POST['name']);
    $description = $conn->real_escape_string($_POST['description']);
    $id= !empty($_POST['cat_id']) ? $_POST['cat_id'] : 0; 
    $old_src = !empty($_POST['old_src']) ? $_POST['old_src'] :  0 ; 


    if(!$id):
       $imageName = AddEditImage('image' ,$old_src); 

        // Move uploaded file
        if ($imageName) {
            // Insert data into the database
            $sql = "INSERT INTO categories (name, image, description) VALUES ('$name', '$imageName', '$description')";
            if ($conn->query($sql) === TRUE) {
                echo "Category added successfully!";                
                header("Location: ./category.php");
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        } else {
            echo "Failed to upload the image.";
        }
   
    else: 
        $img = AddEditImage('image' , $old_src);      
        if(!$img){
            echo 'Can not upload a image !'; 
            exit ; 
         }

        $update_sql = $conn->query("UPDATE  categories  SET name='$name' , description='$description' , image = '$img' where id='$id' ");
        if ($update_sql === TRUE) {
                 echo "Category updated successfully!";                
                 header("Location: ./category.php");
        }else{
                  echo "Error: " . $sql . "<br>" . $conn->error;
        }
 endif ;

    // Close the database connection
    $conn->close();

    
	exit();

}

function AddEditImage($img ,$old_src=false){

      if (isset($_FILES[$img]) && $_FILES[$img]['error'] === UPLOAD_ERR_OK) {
        $image = $_FILES[$img];
        $imageName = uniqid() . '-' . basename($image['name']);
        $targetDir = 'uploads/';
        $targetFile = $targetDir . $imageName;

        // Create the uploads directory if not exists
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        // Move uploaded file
        if (move_uploaded_file($image['tmp_name'], $targetFile)){
            $img_name = $targetDir .''.$imageName ; 
              if($old_src){
                  if(file_exists('./uploads/'.$old_src)){
                     unlink('./uploads/'.$old_src); 
                  }
              }
                return $imageName ; 
        }else{
            return false ; 
        } 

    }else{
         return $old_src ; 
    }
}
?>
