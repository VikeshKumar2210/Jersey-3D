<?php
// Include database connection
include('../db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and get form data
    $name = $conn->real_escape_string($_POST['name']);
    $subcategory_id = (int)$_POST['subcategory_id'];
    $price = (float)$_POST['price'];
    $modal_type = $conn->real_escape_string($_POST['modal_type']);

    $colors = $_POST['colors']; // Array of selected color IDs
    $new_colors = trim($_POST['new_colors']); 

    // Handle image upload
    $image_name = basename($_FILES['image']['name']);
    $image_path = "uploads/designs/images/" . $image_name;
    if (!move_uploaded_file($_FILES['image']['tmp_name'], $image_path)) {
        die("Error uploading image.");
    }

    // Handle model upload
    $model_name = basename($_FILES['model']['name']);
    $model_path = "uploads/designs/models/" . $model_name;
    if (!move_uploaded_file($_FILES['model']['tmp_name'], $model_path)) {
        die("Error uploading model.");
    }

    // Insert data into `designs` table
    $sql_insert = "INSERT INTO `designs` (`subcategory_id`, `name`, `image`, `model`, `price`, `modal_type`, `insert_date`, `updated_date`)
                   VALUES ('$subcategory_id', '$name', '$image_name', '$model_name', '$price', '$modal_type', NOW(), NOW())";
    $conn->query($sql_insert);
    $design_id = $conn->insert_id; // Get the ID of the newly inserted design

    // Check if new colors are provided
    if (!empty($new_colors)) {
        // Split the comma-separated colors into an array
        $new_colors_array = array_map('trim', explode(',', $new_colors));

        foreach ($new_colors_array as $color_name) {
            if (!empty($color_name)) {
                // Check if the color already exists in the database
                $sql_check_color = "SELECT id FROM `colors` WHERE `name` = '$color_name'";
                $result_check_color = $conn->query($sql_check_color);

                if ($result_check_color->num_rows > 0) {
                    // Use the existing color ID
                    $row = $result_check_color->fetch_assoc();
                    $new_color_id = $row['id'];
                } else {
                    // Insert the new color into the database
                    $sql_new_color = "INSERT INTO `colors` (`name`) VALUES ('$color_name')";
                    $conn->query($sql_new_color);
                    $new_color_id = $conn->insert_id;
                }

                // Add the new color ID to the colors array
                $colors[] = $new_color_id;
            }
        }
    }

    // Insert selected and new colors into the design_colors table
    foreach ($colors as $color_id) {
        $sql_design_colors = "INSERT INTO `design_colors` (`design_id`, `color_id`) VALUES ('$design_id', '$color_id')";
        $conn->query($sql_design_colors);
    }

    // Redirect or show success message
    header("Location: designs.php?success=1");

}
?>
