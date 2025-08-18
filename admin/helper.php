<?php
class helper{
     

    function AddEditImage($img , $old_src=false , $dir=false){
         

         if (isset($_FILES[$img]) && $_FILES[$img]['error'] === UPLOAD_ERR_OK) {
        $image = $_FILES[$img];
        $imageName = uniqid() . '-' . basename($image['name']);
        $targetDir =  $dir ? $dir : 'uploads/';
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
}



?>