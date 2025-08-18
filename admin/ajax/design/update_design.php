<?php
include('../../../db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get design ID
    $id = $_POST['id'];

    // Get form inputs
    $name = $_POST['name'];
    $price = $_POST['price'];
    $modal_type = $_POST['modal_type'];
    $subcategory_id = $_POST['subcategory_id'];
    $colors = isset($_POST['colors']) ? $_POST['colors'] : [];

    // Update design details
    $sql_update_design = "UPDATE `designs` SET `name` = ?, `price` = ?, `modal_type` = ?, `subcategory_id` = ? WHERE `id` = ?";
    $stmt = $conn->prepare($sql_update_design);
    $stmt->bind_param("sdssi", $name, $price, $modal_type, $subcategory_id, $id);

    if ($stmt->execute()) {
        // Update colors
        // Delete existing colors for the design
        $sql_delete_colors = "DELETE FROM `design_colors` WHERE `design_id` = ?";
        $stmt_delete_colors = $conn->prepare($sql_delete_colors);
        $stmt_delete_colors->bind_param("i", $id);
        $stmt_delete_colors->execute();

        // Insert new colors
        if (!empty($colors)) {
            $sql_insert_color = "INSERT INTO `design_colors` (`design_id`, `color_id`) VALUES (?, ?)";
            $stmt_insert_color = $conn->prepare($sql_insert_color);

            foreach ($colors as $color_id) {
                $stmt_insert_color->bind_param("ii", $id, $color_id);
                $stmt_insert_color->execute();
            }
        }

        echo json_encode(['status' => 'success', 'message' => 'Design updated successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update design.']);
    }
}
