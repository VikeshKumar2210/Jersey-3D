<?php
include('../../../db.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];

    // Fetch design data
    $sql = "SELECT * FROM `designs` WHERE `id` = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $design = $result->fetch_assoc();

    if ($design) {
        // Fetch all available colors
        $sql_colors = "SELECT * FROM `colors`";
        $result_colors = $conn->query($sql_colors);

        // Fetch colors assigned to the current design
        $sql_assigned_colors = "SELECT `color_id` FROM `design_colors` WHERE `design_id` = ?";
        $stmt_assigned = $conn->prepare($sql_assigned_colors);
        $stmt_assigned->bind_param("i", $id);
        $stmt_assigned->execute();
        $result_assigned_colors = $stmt_assigned->get_result();

        // Store assigned colors in an array
        $assigned_colors = [];
        while ($row = $result_assigned_colors->fetch_assoc()) {
            $assigned_colors[] = $row['color_id'];
        }
        ?>
        <form id="editDesignForm" enctype="multipart/form-data">
            <div class="modal-body">
                <!-- Design Name -->
                <div class="input-group input-group-outline my-3">
                    <label class="form-label">Design Name</label>
                    <input type="text" class="form-control" name="name" value="<?= htmlspecialchars($design['name']) ?>" required>
                    <input type="hidden" class="form-control" name="id" value="<?= htmlspecialchars($id) ?>" required>
                </div>

                <!-- Design Image -->
                <div class="input-group input-group-outline my-3">
                    <label class="form-label">Design Image</label>
                    <input type="file" class="form-control" name="image" accept="image/*">
                </div>

                <!-- GLB Model -->
                <div class="input-group input-group-outline my-3">
                    <label class="form-label">3D Model (GLB File)</label>
                    <input type="file" class="form-control" name="model" accept=".glb">
                </div>

                <!-- Design Price -->
                <div class="input-group input-group-outline my-3">
                    <label class="form-label">Price</label>
                    <input type="number" step="0.01" class="form-control" name="price" value="<?= $design['price'] ?>" required>
                </div>

                <!-- Modal Type -->
                <div class="input-group input-group-static mb-4">
                    <label for="modalType" class="ms-0">Modal Type</label>
                    <select class="form-control" name="modal_type" id="modalType" required>
                        <option value="halfSleeves" <?= $design['modal_type'] === 'halfSleeves' ? 'selected' : '' ?>>Half Sleeves</option>
                        <option value="fullSleeves" <?= $design['modal_type'] === 'fullSleeves' ? 'selected' : '' ?>>Full Sleeves</option>
                        <option value="HockeyDesign1" <?= $design['modal_type'] === 'HockeyDesign1' ? 'selected' : '' ?>>HockeyDesign1</option>
                    </select>
                </div>

                <!-- Subcategory -->
                <div class="input-group input-group-static mb-4">
                    <label for="subcategory" class="ms-0">Subcategory</label>
                    <select class="form-control" name="subcategory_id" id="subcategory" required>
                        <?php
                        $sql_subcategories = "SELECT * FROM `subcategories`";
                        $result_subcategories = $conn->query($sql_subcategories);
                        while ($row = $result_subcategories->fetch_assoc()) {
                            $selected = $row['id'] == $design['subcategory_id'] ? 'selected' : '';
                            echo "<option value='{$row['id']}' $selected>{$row['name']}</option>";
                        }
                        ?>
                    </select>
                </div>

                <!-- Colors -->
                <div class="input-group my-3">
                    <label class="form-label">Colors</label>
                    <div class="form-check">
                        <?php while ($color = $result_colors->fetch_assoc()) { ?>
                            <div>
                                <input type="checkbox" class="form-check-input" name="colors[]" value="<?= $color['id'] ?>" 
                                    <?= in_array($color['id'], $assigned_colors) ? 'checked' : '' ?>>
                                <label class="form-check-label"><?= htmlspecialchars($color['name']) ?></label>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn bg-gradient-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn bg-gradient-primary">Save changes</button>
            </div>
        </form>
        <?php
    } else {
        echo "Design not found!";
    }
}
?>
