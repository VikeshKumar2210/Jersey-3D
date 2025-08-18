document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("threejs-container");
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("threejs-container");
    if (!container) {
        console.error("Container element not found!");
        return;
    }
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableRotate = true;
    controls.target.set(0, 0, 0);
    // Restrict rotation
    const patternScaleValueSpan = document.getElementById('patternScaleValue');

    controls.maxPolarAngle = Math.PI / 2; // Limit to 90 degrees (top)
    controls.minPolarAngle = 0.4; // Limit to 0 degrees (bottom)
    // Limit zoom
    controls.maxDistance = 25; // Set maximum zoom out distance
    controls.minDistance = 5; // Set minimum zoom in distance
    let gradientMeshes = {}; // Store gradient information for each mesh
    let gradientColor1 = null; // First gradient color
    let gradientColor2 = null; // Second gradient color
    let gradientAngle = 0; // Gradient angle in degrees
    let gradientScale = 1.0; // Gradient scale
    // from here light
    // Create a simple ambient light and directional light
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    // Add hemisphere light (sky color, ground color, intensity)
    const hemisphereLight = new THREE.HemisphereLight(0x404040, 0x404040, 1);
    hemisphereLight.position.set(0, 2, 0);
    scene.add(hemisphereLight);
    // Add directional lights from multiple directions
    const directionalLight1 = new THREE.DirectionalLight(0x404040, 1);
    directionalLight1.position.set(1, 1, 1).normalize();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-1, 1, -1).normalize();
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight3.position.set(0, -1, 0).normalize();
    scene.add(directionalLight3);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 6, 1).normalize();
    scene.add(directionalLight);
    // from here light
    let model = null;
    let meshes = { primary: [], secondary: [], tertiary: [] };
    let selectedColorCategory = "Plane";
    let checkedCheckboxes = [];
    const COLORS = {
        primary: 0xf50a3,
        secondary: 0xf50a3,
        tertiary: 0xf50a3,
    };
    let rotationProgress = 0; // Track rotation progress
    const rotationSpeed = 0.07; // Speed of rotation

    function processMeshes(model, colorMappings) {
        model.traverse((child) => {
            if (child.isMesh) {
                // Check if the mesh has a mapping in colorMappings
                const colorHex = colorMappings[child.name]; // Get the color from the mappings

                if (colorHex) {
                    child.userData.colorCategory = child.name; // Assign the name as category or other logic
                    // Create a material with the mapped color
                    child.material = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(colorHex), // Use the color from colorMappings
                        side: THREE.DoubleSide,
                    });

                    // Add mesh to the corresponding category
                    if (!meshes[child.name]) {
                        meshes[child.name] = [];
                    }
                    meshes[child.name].push(child);

                    console.log(`Applied color ${colorHex} to mesh: ${child.name}`);
                } else {
                    console.warn(`No color mapping found for mesh: ${child.name}`);
                }
            }
        });
    }

    const designColors = {
        halfSleeves: {
            primary: 0x0a322a, // Example color for Design1
            secondary: 0x0a322a,
            tertiary: 0x0a322a,
        },
        fullSleeves: {
            primary: 0xF5F5F5, // Example color for Design2
            secondary: 0x16521F,
            tertiary: 0x1C1C1C,
        },
        Design1: {
            primary: 0xF5F5F5, // Example color for Design2
            secondary: 0x16521F,
            tertiary: 0x1C1C1C,
        },
        Design2: {
            primary: 0xFFB81C, // Example color for Design2
            secondary: 0x1C1C1C,
            tertiary: 0x1C1C1C,
        },
        Design3: {
            primary: 0x16521F, // Example color for Design2
            secondary: 0xF5F5F5,
        },

        // Add more designs and their corresponding colors here
    };
    const loader = new THREE.GLTFLoader();
    function loadModel(url, colorMappings, modelType) {

        clearPreviousModel(); // Clear previous model and decals
        // Hide all forms initially

        document.querySelectorAll('.patternMesh form').forEach(form => {
            form.style.display = 'none';
        });
        document.querySelectorAll('.gradeientMEsh form').forEach(form => {
            form.style.display = 'none';
        });
        // Show the relevant form based on the model type
        // Inside loadModel function, update this section:
        if (modelType === "halfSleeves") {
            document.querySelector('.halfSleevesPattern').style.display = 'grid';
            document.querySelector('.halfSleeveGradient').style.display = 'grid';
            // Update default colors for halfSleeves
            Object.assign(COLORS, designColors.halfSleeves);

        } else if (modelType === "fullSleeves") {
            document.querySelector('.fullSleevePattern').style.display = 'grid';
            document.querySelector('.fullSleeveGradient').style.display = 'grid';
            // Update default colors for fullSleeves
            Object.assign(COLORS, designColors.fullSleeves);
        }

        console.log(`Loading model from URL: ${url}`);

        // Remove the existing model if it exists
        if (model) {
            scene.remove(model);
            model = null;

        }

        const meshColorGroups = {
            Primary: [],
            Secondary: [],
            Tertiary: []
        };



        function updateMeshColor(selectedMesh, selectedColor) {
            // Fetch the mesh object by name
            const mesh = model.getObjectByName(selectedMesh);

            if (mesh && mesh.material) {
                // Ensure the material supports color changes
                if (mesh.material.color) {
                    // Update the color of the mesh material
                    mesh.material.color.set(selectedColor);
                    mesh.material.needsUpdate = true; // Ensure the material updates
                } else {
                    console.warn(`Material for mesh "${selectedMesh}" does not support color changes.`);
                }
            } else {
                if (!meshColorGroups[selectedMesh]) return;

                meshColorGroups[selectedMesh].forEach(meshName => {
                    const mesh = model.getObjectByName(meshName);
                    if (mesh && mesh.material) {
                        mesh.material.color.set(selectedColor);
                    }
                });
            }
        }


        document.querySelectorAll('.meshColorPalette .palette').forEach(palette => {
            palette.addEventListener('click', (e) => {
                const selectedColor = e.target.dataset.color;
                const activeMeshRadio = document.querySelector('input[name="meshActiveColor"]:checked');
                if (!activeMeshRadio) return;

                const selectedMesh = activeMeshRadio.value;
                updateMeshColor(selectedMesh, selectedColor);

                const colorPreview = document.getElementById(`apply${selectedMesh}`);
                if (colorPreview) {
                    colorPreview.style.backgroundColor = selectedColor;
                }
            });
        });
        // Text color palette event listener - modified to only affect text
        document.querySelectorAll('.textColorPalette .palette').forEach(colorElement => {
            colorElement.addEventListener('click', (event) => {
                selectedTextColor = event.target.dataset.color;

                // Update the text color preview
                document.querySelector('.colorPicker').style.backgroundColor = selectedTextColor;

                if (activeTextDecalIndex >= 0) {
                    textDecals[activeTextDecalIndex].color = selectedTextColor;
                    updateMeshTextureWithAllDecals();
                }
                console.log("Current text color:", selectedTextColor);
            });
        });
        // Event listener for radio buttons to toggle active group
        document.querySelectorAll('input[name="meshActiveColor"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const activeGroup = e.target.value;

                // Show the title for the selected group and hide others
                ['Primary', 'Secondary', 'Tertiary'].forEach(group => {
                    document.getElementById(`title${group}`).style.display = group === activeGroup ? 'block' : 'none';
                });
            });
        });

        function assignMeshGroupsByColorFrequency(meshColors) {
            const colorFrequency = {};

            // Calculate the frequency of each color
            for (const meshName in meshColors) {
                const color = meshColors[meshName];
                if (!colorFrequency[color]) {
                    colorFrequency[color] = [];
                }
                colorFrequency[color].push(meshName);
            }

            // Sort colors by frequency
            const sortedColors = Object.keys(colorFrequency).sort((a, b) => colorFrequency[b].length - colorFrequency[a].length);

            // Assign meshes to groups based on sorted colors
            meshColorGroups.Primary = colorFrequency[sortedColors[0]] || [];
            meshColorGroups.Secondary = colorFrequency[sortedColors[1]] || [];
            meshColorGroups.Tertiary = colorFrequency[sortedColors[2]] || [];

            console.log("Assigned Mesh Groups:", meshColorGroups);
        }

        function populateMeshList(meshColors) {
            const meshColorOptions = document.getElementById('meshColorOptions');
            meshColorOptions.innerHTML = ''; // Clear previous options

            // Loop through each mesh and create a radio button with a label
            Object.keys(meshColors).forEach((meshName, index) => {
                const color = meshColors[meshName];
                const id = `meshOption-${index}`;

                const label = document.createElement('label');
                label.className = 'colorsMeshItems part-button';
                label.dataset.part = meshName;

                label.innerHTML = `
                    <input type="radio" name="meshActiveColor" value="${meshName}" id="${id}" ${index === 0 ? 'checked' : ''}>
                    <div class="meshActiveColor" style="background-color: ${color};" id="apply${meshName}"></div>
                    <h6 class="meshActiveFaceName">${meshName}</h6>
                `;

                meshColorOptions.appendChild(label);
            });

            // Add event listeners to handle color changes
            document.querySelectorAll('input[name="meshActiveColor"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const selectedMesh = e.target.value;
                    console.log(`Selected mesh: ${selectedMesh}`);
                });
            });
        }

        loader.load(url, function (gltf) {
            model = gltf.scene;
            model.name = modelType; // Set the model name to the modelType

            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            // Adjust model position
            model.position.sub(center);
            model.position.y -= size.y / 1003;

            const maxDim = Math.max(size.x, size.y, size.z);
            const cameraDistance = maxDim * 8; // Adjust multiplier for distance
            camera.position.set(center.x, center.y, center.z + cameraDistance);
            camera.lookAt(center);

            let fv = 1 * Math.atan(maxDim / (1 * cameraDistance)) * (180 / Math.PI);
            camera.fov = fv + cameraDistance - 4;
            camera.updateProjectionMatrix();

            const meshColors = {}; // Object to store mesh names and their corresponding colors

            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    const material = child.material;
                    if (material && material.color) {
                        const colorHex = material.color.getHexString();
                        meshColors[child.name] = `#${colorHex}`;
                    } else {
                        meshColors[child.name] = "No color property";
                    }
                }
            });

            console.log("Mesh Colors:", meshColors);
            const meshNames = Object.keys(meshColors);
            populatePatternForm(meshNames);

            // ADD THIS LINE TO INITIALIZE GRADIENT FORM
            populateGradientForm(meshNames);

            // Assign mesh groups dynamically based on color frequency
            assignMeshGroupsByColorFrequency(meshColors);
            populateMeshList(meshColors);

            processMeshes(model, meshColors);
            addInitialDecals();
            scene.add(model);

            let loadedTextures = 0;
            let totalTextures = 0;

            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    if (child.material.map) {
                        totalTextures++;
                        child.material.map.addEventListener("load", function () {
                            loadedTextures++;
                            if (loadedTextures === totalTextures) {
                                preloader.style.display = "none";
                                content.style.display = "block";
                            }
                        });
                    } else {
                        loadedTextures++;
                    }
                }
            });

            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
        });
    }
    function clearPreviousModel() {
        // Remove the existing model
        if (model) {
            scene.remove(model);
            model = null;
        }
    }
    function addInitialDecals() {
        console.log("Adding initial decals");
        // Iterate over all meshes and add decals as needed
        Object.keys(meshes).forEach((category) => {
            meshes[category].forEach(mesh => {
                // Example: createTextDecal(mesh);
                // Ensure you have logic to add decals for each relevant mesh
            });
        });
    }
    document.querySelectorAll('input[name="meshActiveColor"]').forEach((input) => {
        input.addEventListener("change", function () {
            selectedColorCategory = this.value;
            const newColor = document.getElementById("colorPicker").value; // Assuming you have a color picker
            updateColor(selectedColorCategory, newColor);
        });
    });

    // Mesh mappings for Design3
    const design3Mappings = {
        Plane: "primary",
        Plane_1: "secondary",
    };
    function updateColor(category, color) {
        if (meshes[category]) {
            meshes[category].forEach((mesh) => {
                mesh.material.color.set(color);
            });
        }
    }
    // Example usage
    updateColor("secondary", "#ff00ff"); // Update secondary category color
    updateColor("tertiary", "#00ffff"); // Update tertiary category color
    // Declare a global variable to store the selected mesh name


    const radioButtons = document.querySelectorAll(
        'input[name="meshActiveColor"]'
    );
    radioButtons.forEach((radio) => {
        radio.addEventListener("change", function () {
            if (model) {
                const selectedMesh = model.getObjectByName(this.value);
                if (selectedMesh) {
                    selectedColors.color1 = this.dataset.color1 || "#FF0000";
                    selectedColors.color2 = this.dataset.color2 || "#FFFF00";

                }
            }
        });
    });


    function populatePatternForm(meshNames) {
        const form = document.getElementById('dynamicPatternForm');
        form.innerHTML = ''; // Clear existing content

        // Create a mapping of mesh names to display names
        const displayNames = {
            'Plane': 'Plane',
            'Plane_1': 'Plane_1',
            'Plane_2': 'Plane_2',
            'Plane_3': 'Plane_3',
            'Plane_4': 'Plane_4'
        };

        // Initialize selectedPatternParts with all mesh names set to false
        selectedPatternParts = {};
        meshNames.forEach(meshName => {
            selectedPatternParts[meshName] = false;

            const displayName = displayNames[meshName] || meshName;

            const label = document.createElement('label');
            label.className = 'checkbox-button part-button';
            label.dataset.part = meshName;

            label.innerHTML = `
                <input type="checkbox" id="${meshName}">
                <span class="checkmark"></span>
                <span class="label-text">${displayName}</span>
            `;

            form.appendChild(label);
        });

        // Add event listeners to the new checkboxes
        document.querySelectorAll('#dynamicPatternForm input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const part = this.id;
                selectedPatternParts[part] = this.checked;
                console.log(`Pattern part ${part} ${this.checked ? 'selected' : 'deselected'}`);

                if (!this.checked) {
                    removePatternFromPart(part);
                }

                showPatternPreview();
            });
        });
    }

    function updateSelectedColors() {
        if (checkedCheckboxes.length === 2) {
            selectedColors.color1 = checkedCheckboxes[0].value;
            selectedColors.color2 = checkedCheckboxes[1].value;
        } else if (checkedCheckboxes.length === 1) {
            selectedColors.color1 = checkedCheckboxes[0].value;
            selectedColors.color2 = selectedColors.color1;
        } else {
            selectedColors.color1 = "#FF0000";
            selectedColors.color2 = "#FFFF00";
        }
        updateGradient(
            selectedColors.color1,
            selectedColors.color2,
            gradientAngle,
            gradientScale
        );
    }

    const colorCheckboxes = document.querySelectorAll(".color-checkbox");
    colorCheckboxes.forEach((checkbox) => {
        checkbox.style.display = "none";
    });

    colorCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            if (this.checked) {
                if (checkedCheckboxes.length >= 2) {
                    checkedCheckboxes[0].checked = false;
                    checkedCheckboxes.shift();
                }
                checkedCheckboxes.push(this);
            } else {
                checkedCheckboxes = checkedCheckboxes.filter((cb) => cb !== this);
            }
            colorCheckboxes.forEach((cb) => {
                cb.style.display = cb.checked ? "inline-block" : "none";
            });
            updateSelectedColors();
        });
    });

    document.querySelectorAll(".designsItems img").forEach((img) => {
        img.addEventListener("click", function () {
            const design = this.dataset.design;
            const colormappingsRaw = this.dataset.colorMappings || '{}'; // Default to empty object
            let colormappings = {};

            try {
                colormappings = JSON.parse(colormappingsRaw);
            } catch (error) {
                console.error("Error parsing colormappings:", colormappingsRaw, error);
            }

            const modal = this.dataset.modal || '';
            console.log("Color mappings:", colormappings);

            // Example loadModel logic
            if (design === "Design1") {
                loadModel(modal, design1Mappings, design);
            } else if (design === "Design2") {
                loadModel(modal, design2Mappings, design);
            } else {
                loadModel(modal, design3Mappings, design);
            }

        });
    });
    // 

    // Create OrbitControls for camera interaction
    controls.enableDamping = true; // Add smooth damping (inertia)
    controls.dampingFactor = 0.04; // Damping inertia factor (lower = more smooth)
    controls.rotateSpeed = 0.6; // Rotation speed (default is 1)
    controls.enablePan = true; // Disable panning if you only want rotation
    controls.minDistance = 4; // Minimum zoom distance
    controls.maxDistance = 6; // Maximum zoom distance
    controls.maxPolarAngle = Math.PI * 0.9; // Limit vertical rotation (prevent flipping)
    let currentFontSize = 28; // Default font size

    // Get the buttons for resizing the font
    const minusButton = document.querySelector('.TextDecalSizeMinus');
    const plusButton = document.querySelector('.TextDecalSizePlus');

    // Event listener for decreasing the font size
    minusButton.addEventListener('click', () => {
        if (currentFontSize > 10 && activeTextDecalIndex >= 0) {
            currentFontSize -= 10;
            textDecals[activeTextDecalIndex].fontSize = currentFontSize;
            updateMeshTextureWithAllDecals(); // Changed from updateMeshTextureWithAllTexts()
            updateActiveDecalBounds();
        }
    });
    // Do the same for plusButton
    let isTextSelected = false;
    let textBoundingBox = {
        original: null,  // Stores the original bounds (relative to texture center)
        current: null    // Stores the current bounds (with offset applied)
    };
    // Event listener for increasing the font size
    plusButton.addEventListener('click', () => {
        if (activeTextDecalIndex >= 0) {
            currentFontSize += 10;
            textDecals[activeTextDecalIndex].fontSize = currentFontSize;
            updateMeshTextureWithAllDecals(); // Changed from updateMeshTextureWithAllTexts()
            updateActiveDecalBounds();
        }
    });
    // Function to create a texture from the input text
    function createTextTexture(text, color = selectedTextColor, fontFamily = 'Arial', isSelected = false) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;

        // Clear canvas
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Set text style
        context.font = `${currentFontSize}px ${fontFamily}`;
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Measure text
        const textWidth = context.measureText(text).width;
        const textHeight = currentFontSize;

        // Draw text at center
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        // Draw border only if selected
        if (isSelected) {
            context.strokeStyle = 'red';
            context.lineWidth = 1;
            context.setLineDash([5, 3]);
            context.strokeRect(
                canvas.width / 2 - textWidth / 2 - 10,
                canvas.height / 2 - textHeight / 2 - 5,
                textWidth + 20,
                textHeight + 10
            );
        }

        // Create texture
        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = false;
        texture.center.set(0.5, 0.5);

        return { texture };

        // Calculate bounds (normalized 0-1)
        const bounds = {
            x: (canvas.width / 2 - textWidth / 2) / canvas.width,
            y: (canvas.height / 2 - textHeight / 2) / canvas.height,
            width: textWidth / canvas.width,
            height: textHeight / canvas.height
        };

        return { texture, bounds };
    }

    // Get the resize slider and value display
    const resizeImgSlider = document.getElementById('resizeImgSlider');
    const resizeValueSpan = document.getElementById('resizeValue');

    // Event listener for image resizing
    resizeImgSlider.addEventListener('input', (event) => {
        const scaleValue = event.target.value / 50; // Convert 10-200 range to 0.2-4.0 scale
        resizeValueSpan.textContent = `${event.target.value}%`;

        if (activeImageDecalIndex >= 0) {
            imageDecals[activeImageDecalIndex].scale = scaleValue;
            console.log(`Resizing image ${activeImageDecalIndex} to scale ${scaleValue.toFixed(2)}`);
            updateMeshTextureWithAllDecals();
        }
    });

    async function createImageTexture(imageFile, isSelected = false) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const context = canvas.getContext('2d');

            // Fill with white background
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);

            const img = new Image();
            img.onload = function () {
                // Calculate dimensions (same as before)
                let width = img.width;
                let height = img.height;
                const maxDimension = 100;

                if (width > height) {
                    height = (maxDimension / width) * height;
                    width = maxDimension;
                } else {
                    width = (maxDimension / height) * width;
                    height = maxDimension;
                }

                // Draw image centered
                const x = (canvas.width - width) / 2;
                const y = (canvas.height - height) / 2;
                context.drawImage(img, x, y, width, height);

                // Draw border only if selected
                if (isSelected) {
                    context.strokeStyle = 'blue';
                    context.lineWidth = 1;
                    context.setLineDash([5, 3]);
                    context.strokeRect(x - 5, y - 5, width + 10, height + 10);
                }

                // Create texture
                const texture = new THREE.CanvasTexture(canvas);
                texture.flipY = false;
                texture.center.set(0.5, 0.5);

                resolve({
                    texture, bounds: {
                        x: x / canvas.width,
                        y: y / canvas.height,
                        width: width / canvas.width,
                        height: height / canvas.height,
                        originalWidth: width,
                        originalHeight: height
                    }, originalImage: img
                });
            };
            img.src = URL.createObjectURL(imageFile);
        });
    }



    const patternScaleSlider = document.getElementById('patternScale');
    const opacitySlider = document.getElementById('Opacity');
    let currentPatternScale = 1.0; // Default scale (100%)

    // Event listener for pattern scale
    patternScaleSlider.addEventListener('input', (event) => {
        const scaleValue = event.target.value;
        patternScaleValueSpan.textContent = `${scaleValue}%`;
        currentPatternScale = scaleValue / 100; // Convert 10-200 to 0.1-2.0 scale

        // Update all pattern decals with the new scale
        updateAllPatternDecalsScale();
    });
    function updateAllPatternDecalsScale() {
        // Update scale for all pattern decals
        patternDecals.forEach(decal => {
            if (decal.isFullCoverage) {
                decal.scale = currentPatternScale;
            }
        });

        // Update the textures
        updateAllMeshTextures();
    }

    // Get the elements 
    const fileInput = document.getElementById('fileInput');
    const uploadedImagePreview = document.getElementById('uploadedImagePreview');

    // Trigger file input when button is clicked
    fileInput.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            pendingImageFile = file;
            // Show preview
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedImagePreview.src = e.target.result;
                uploadedImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    // Get the preview border element
    const imagePreviewBorder = document.getElementById('imagePreviewBorder');

    // Function to update the image preview with selection border
    function updateImagePreview() {
        if (activeImageDecalIndex >= 0 && activeImageDecalIndex < imageDecals.length) {
            const activeDecal = imageDecals[activeImageDecalIndex];

            // Show the preview image if it exists
            if (activeDecal.image) {
                uploadedImagePreview.src = activeDecal.image.src;
                uploadedImagePreview.style.display = 'block';
                imagePreviewBorder.style.display = 'block';

                // Apply any transformations (scale, rotation) to the preview
                // You can add more styling here to match the decal's properties
                uploadedImagePreview;
            }
        } else {
            // Hide the border when no image is selected
            imagePreviewBorder.style.display = 'none';
        }
    }

    async function applyImageToSelectedMesh(imageFile, uv) {
        if (!imageFile || !selectedMesh) return;

        try {
            const { texture, bounds, originalImage } = await createImageTexture(imageFile);
            const offsetX = uv.x - 0.5;
            const offsetY = uv.y - 0.5;

            const newDecal = {
                image: originalImage,
                offset: new THREE.Vector2(offsetX, offsetY),
                rotation: 0,
                scale: 1.0,
                mesh: selectedMesh,
                uuid: THREE.MathUtils.generateUUID(),
                bounds: bounds,
                isLocked: false
            };

            imageDecals.push(newDecal);
            updateMeshTextureWithAllDecals();

            // Set as active decal
            activeImageDecalIndex = imageDecals.length - 1;
            activeTextDecalIndex = -1;
            updateImagePreview();

            // Reset sliders
            resizeImgSlider.value = 50;
            resizeValueSpan.textContent = '50%';
            rotateImgSlider.value = 0;
            rotateImgValueSpan.textContent = '0°';

            console.log(`Added image to ${selectedMesh.name} at position x:${uv.x.toFixed(2)}, y:${uv.y.toFixed(2)}`);
        } catch (error) {
            console.error("Error applying image:", error);
        }
    }
    // Pattern variables 
    let patternDecals = [];
    let activePatternDecalIndex = -1;
    let selectedPatternImage = null;
    let selectedPatternParts = {
        front: false,
        back: false,
        leftSleeve: false,
        rightSleeve: false,
        collar: false
    };
    // Add these new variables at the top
    let patternPreviewTimeout = null;
    let currentPatternPreview = null;
    let currentPatternOpacity = 1.0; // Default opacity (100%)

    // Modify the pattern selection event listeners
    document.querySelectorAll('.patternsItems').forEach(item => {
        item.addEventListener('click', function () {
            // Remove active class from all pattern items
            document.querySelectorAll('.patternsItems').forEach(i => {
                i.classList.remove('active');
            });

            // Add active class to clicked item
            this.classList.add('active');

            // Store the selected pattern image path
            selectedPatternImage = this.dataset.image;
            console.log("Selected pattern:", selectedPatternImage);

            // Show preview of the selected pattern
            showPatternPreview();
        });
    });
    // Event listener for pattern opacity
    opacitySlider.addEventListener('input', (event) => {
        const opacityValue = event.target.value;
        opacityValueSpan.textContent = `${opacityValue}%`;
        currentPatternOpacity = opacityValue / 100; // Convert 0-100 to 0.0-1.0

        // Update all pattern decals with the new opacity
        updateAllPatternDecalsOpacity();
    });

    function updateAllPatternDecalsOpacity() {
        // Update opacity for all pattern decals
        patternDecals.forEach(decal => {
            decal.opacity = currentPatternOpacity;
        });

        // Update the textures for all affected meshes
        const affectedMeshes = new Set();
        patternDecals.forEach(decal => affectedMeshes.add(decal.mesh));

        affectedMeshes.forEach(mesh => {
            if (mesh) {
                updateMeshTextureForMesh(mesh);
            }
        });
    }
    // Update text button
    document.getElementById('updateTextButton').addEventListener('click', updateActiveTextDecal);
    function updateActiveTextDecal() {
        // Check if there's an active text decal selected
        if (activeTextDecalIndex < 0 || activeTextDecalIndex >= textDecals.length) {
            console.log("No active text decal to update");
            return;
        }

        // Get the new text from the input field
        const newText = document.getElementById('textInput').value.trim();
        if (!newText) {
            console.log("No text entered");
            return;
        }

        // Update the active text decal
        textDecals[activeTextDecalIndex].text = newText;

        // Update the display text
        document.querySelector('.decalText').textContent = newText;

        // Update the texture
        updateMeshTextureWithAllDecals();

        console.log(`Updated text decal ${activeTextDecalIndex} to: "${newText}"`);
    }
    // New function to show pattern preview
    function showPatternPreview() {
        // Clear any pending preview timeout
        if (patternPreviewTimeout) {
            clearTimeout(patternPreviewTimeout);
        }

        // Remove previous preview if exists
        if (currentPatternPreview) {
            patternDecals = patternDecals.filter(d => !d.isPreview);
            updateAllMeshTextures();
            currentPatternPreview = null;
        }

        // Only show preview if we have a selected pattern and at least one part selected
        const selectedParts = Object.keys(selectedPatternParts).filter(part => selectedPatternParts[part]);
        if (!selectedPatternImage || selectedParts.length === 0) return;

        // Add preview after a small delay (to avoid flickering during rapid selection)
        patternPreviewTimeout = setTimeout(() => {
            applyPatternPreview(selectedParts);
        }, 300);
    }

    function updateAllMeshTextures() {
        // Get all unique meshes that have decals
        const allMeshes = new Set();
        textDecals.forEach(d => allMeshes.add(d.mesh));
        imageDecals.forEach(d => allMeshes.add(d.mesh));
        patternDecals.forEach(d => allMeshes.add(d.mesh));

        // Update each mesh
        allMeshes.forEach(mesh => {
            if (mesh) {
                updateMeshTextureForMesh(mesh);
            }
        });
    }



    function populateGradientForm(meshNames) {
        const gradientContainer = document.querySelector('.gradeientMEsh .gradientFaces');
        gradientContainer.innerHTML = ''; // Clear existing content

        // Create a mapping of mesh names to display names
        const displayNames = {
            'Plane': 'Front',
            'Plane_1': 'Right Sleeve',
            'Plane_2': 'Left Sleeve',
            'Plane_3': 'Back',
            'Plane_4': 'Collar'
        };

        meshNames.forEach(meshName => {
            const displayName = displayNames[meshName] || meshName;

            const label = document.createElement('label');
            label.className = 'colorsMeshItems part-button';
            label.dataset.part = meshName;

            label.innerHTML = `
                <input type="radio" name="gradientMesh" value="${meshName}">
                <div class="meshActiveColor" id="gradientPreview-${meshName}"></div>
                <h6 class="meshActiveFaceName">${displayName}</h6>
            `;

            gradientContainer.appendChild(label);
        });

        // Add event listeners to gradient mesh selection
        document.querySelectorAll('input[name="gradientMesh"]').forEach(radio => {
            radio.addEventListener('change', function () {
                applyGradientToSelectedMesh();
            });
        });
    }


    // Add this to your DOMContentLoaded event listener
    // Replace your existing gradient color checkbox code with this:
    document.querySelectorAll('.gradient-palette input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            // Get all checked boxes
            const checkedBoxes = Array.from(document.querySelectorAll('.gradient-palette input[type="checkbox"]:checked'));

            // Limit to 2 selections
            if (checkedBoxes.length > 2) {
                this.checked = false;
                return;
            }

            // Update gradient colors
            if (checkedBoxes.length === 2) {
                gradientColor1 = checkedBoxes[0].value;
                gradientColor2 = checkedBoxes[1].value;
            } else if (checkedBoxes.length === 1) {
                gradientColor1 = checkedBoxes[0].value;
                gradientColor2 = checkedBoxes[0].value; // Same color for both
            } else {
                gradientColor1 = null;
                gradientColor2 = null;
            }

            applyGradientToSelectedMesh();
        });
    });
    function applyGradientToSelectedMesh() {
        const selectedMeshName = document.querySelector('input[name="gradientMesh"]:checked')?.value;
        if (!selectedMeshName || !gradientColor1 || !gradientColor2) return;

        const mesh = model.getObjectByName(selectedMeshName);
        if (!mesh) return;

        // Create gradient texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        // Store gradient info on the mesh


        mesh.userData.gradient = {
            color1: gradientColor1,
            color2: gradientColor2,
            angle: gradientAngle,
            scale: gradientScale
        };
        // Create gradient
        const angleRad = THREE.MathUtils.degToRad(gradientAngle);
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const length = Math.sqrt(centerX * centerX + centerY * centerY) * gradientScale;

        const gradient = ctx.createLinearGradient(
            centerX - cos * length,
            centerY - sin * length,
            centerX + cos * length,
            centerY + sin * length
        );

        gradient.addColorStop(0, gradientColor1);
        gradient.addColorStop(1, gradientColor2);

        // Apply gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create texture
        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = false;

        // Apply to mesh
        mesh.material.map = texture;
        mesh.material.needsUpdate = true;

        // Store gradient info
        gradientMeshes[selectedMeshName] = {
            color1: gradientColor1,
            color2: gradientColor2,
            angle: gradientAngle,
            scale: gradientScale
        };
        updateMeshTextureForMesh(mesh);
        // Update preview
        document.getElementById(`gradientPreview-${selectedMeshName}`).style.background =
            `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`;
        // Update the mesh texture to include both gradient and any existing patterns

    }

    // Add these to your DOMContentLoaded event listener
    document.getElementById('gradientAngle').addEventListener('input', function (e) {
        gradientAngle = parseInt(e.target.value);
        document.getElementById('gradientAngleValue').textContent = gradientAngle + '°';
        applyGradientToSelectedMesh();
    });

    document.getElementById('gradientScale').addEventListener('input', function (e) {
        gradientScale = parseFloat(e.target.value);
        document.getElementById('gradientScaleValue').textContent = gradientScale.toFixed(1);
        applyGradientToSelectedMesh();
    });



    // Add these at the bottom of your code with other event listeners
    document.getElementById('lockDecalButton').addEventListener('click', lockActiveDecal);
    document.getElementById('unlockDecalButton').addEventListener('click', unlockActiveDecal);

    function lockActiveDecal() {
        if (activeTextDecalIndex >= 0) {
            textDecals[activeTextDecalIndex].isLocked = true;
            console.log(`Locked text decal ${activeTextDecalIndex}`);
            updateMeshTextureWithAllDecals();
        }
        else if (activeImageDecalIndex >= 0) {
            imageDecals[activeImageDecalIndex].isLocked = true;
            console.log(`Locked image decal ${activeImageDecalIndex}`);
            updateMeshTextureWithAllDecals();
        }
    }

    function unlockActiveDecal() {
        if (activeTextDecalIndex >= 0) {
            textDecals[activeTextDecalIndex].isLocked = false;
            console.log(`Unlocked text decal ${activeTextDecalIndex}`);
            updateMeshTextureWithAllDecals();
        }
        else if (activeImageDecalIndex >= 0) {
            imageDecals[activeImageDecalIndex].isLocked = false;
            console.log(`Unlocked image decal ${activeImageDecalIndex}`);
            updateMeshTextureWithAllDecals();
        }
    }



    // New function to apply pattern preview
    function applyPatternPreview(selectedParts) {
        // Clear any pending preview timeout
        if (patternPreviewTimeout) {
            clearTimeout(patternPreviewTimeout);
        }

        // Remove previous preview if exists
        if (currentPatternPreview) {
            patternDecals = patternDecals.filter(d => !d.isPreview);
            updateAllMeshTextures();
            currentPatternPreview = null;
        }

        // Only show preview if we have a selected pattern and at least one part selected
        if (!selectedPatternImage || selectedParts.length === 0) return;

        // Add preview after a small delay
        patternPreviewTimeout = setTimeout(() => {
            // Load the pattern image
            const img = new Image();
            img.crossOrigin = "anonymous";

            img.onload = function () {
                // Create preview decals for each selected part
                selectedParts.forEach(part => {
                    const mesh = model.getObjectByName(part);
                    if (!mesh) {
                        console.warn(`Mesh not found: ${part}`);
                        return;
                    }

                    // Create canvas with pattern
                    const canvas = document.createElement('canvas');
                    canvas.width = 512;
                    canvas.height = 512;
                    const ctx = canvas.getContext('2d');

                    const pattern = ctx.createPattern(img, 'repeat');
                    ctx.globalAlpha = currentPatternOpacity;
                    ctx.fillStyle = pattern;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.globalAlpha = 1.0;

                    const texture = new THREE.CanvasTexture(canvas);
                    texture.flipY = false;
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;

                    const previewDecal = {
                        image: img,
                        offset: new THREE.Vector2(0, 0),
                        rotation: 0,
                        scale: currentPatternScale,
                        mesh: mesh,
                        uuid: THREE.MathUtils.generateUUID(),
                        bounds: {
                            x: 0,
                            y: 0,
                            width: 1,
                            height: 1,
                            originalWidth: canvas.width,
                            originalHeight: canvas.height
                        },
                        isFullCoverage: true,
                        isPreview: true,
                        opacity: currentPatternOpacity
                    };

                    patternDecals.push(previewDecal);
                    currentPatternPreview = previewDecal;
                });

                updateAllMeshTextures();
                console.log("Pattern preview shown on selected parts");
            };

            img.src = selectedPatternImage;
        }, 300);
    }

    // Modify the checkbox event listeners to show preview when parts are selected
    document.querySelectorAll('.patternArea input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const part = this.id;
            selectedPatternParts[part] = this.checked;
            console.log(`Pattern part ${part} ${this.checked ? 'selected' : 'deselected'}`);

            // If unchecking, remove pattern from this part
            if (!this.checked) {
                removePatternFromPart(part);
            }

            // Show preview when parts change
            showPatternPreview();
        });
    });
    function applyPatternToSelectedParts() {
        if (!selectedPatternImage) {
            alert("Please select a pattern first");
            return;
        }

        const selectedParts = Object.keys(selectedPatternParts).filter(part => selectedPatternParts[part]);
        if (selectedParts.length === 0) {
            alert("Please select at least one part");
            return;
        }

        // First remove any existing patterns from these parts
        selectedParts.forEach(part => {
            removePatternFromPart(part);
        });

        // Remove any preview
        if (currentPatternPreview) {
            patternDecals = patternDecals.filter(d => !d.isPreview);
            currentPatternPreview = null;
        }

        // Load the pattern image
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = function () {
            selectedParts.forEach(part => {
                const mesh = model.getObjectByName(part);
                if (!mesh) {
                    console.warn(`Mesh not found: ${part}`);
                    return;
                }

                // Create canvas with pattern
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;
                const ctx = canvas.getContext('2d');

                const pattern = ctx.createPattern(img, 'repeat');
                ctx.globalAlpha = currentPatternOpacity;
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 1.0;

                const texture = new THREE.CanvasTexture(canvas);
                texture.flipY = false;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;

                const newDecal = {
                    image: img,
                    offset: new THREE.Vector2(0, 0),
                    rotation: 0,
                    scale: currentPatternScale,
                    mesh: mesh,
                    uuid: THREE.MathUtils.generateUUID(),
                    bounds: {
                        x: 0, y: 0, width: 1, height: 1,
                        originalWidth: 512, originalHeight: 512
                    },
                    isFullCoverage: true,
                    opacity: currentPatternOpacity
                };

                patternDecals.push(newDecal);
            });

            updateAllMeshTextures();
            console.log(`Applied pattern to ${selectedParts.join(', ')}`);
            selectedParts.forEach(part => {
                const mesh = model.getObjectByName(part);
                if (mesh) updateMeshTextureForMesh(mesh);
            });
        };

        img.src = selectedPatternImage;
    }
    // New function to remove pattern from a specific part
    function removePatternFromPart(part) {
        const mesh = model.getObjectByName(part);
        if (!mesh) {
            console.warn(`Mesh not found: ${part}`);
            return;
        }

        // Remove all pattern decals from this mesh
        patternDecals = patternDecals.filter(decal => decal.mesh !== mesh);

        // Update the texture
        updateMeshTextureForMesh(mesh);

        console.log(`Removed pattern from ${part}`);
    }
    // Add this helper function to update texture for a specific mesh
    function updateMeshTextureForMesh(mesh) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;

        // 1. Clear canvas with white background
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw gradient background if exists (this is the key fix)
        if (mesh.userData.gradient) {
            const gradient = mesh.userData.gradient;
            const angleRad = THREE.MathUtils.degToRad(gradient.angle);
            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const length = Math.sqrt(centerX * centerX + centerY * centerY) * gradient.scale;

            const canvasGradient = context.createLinearGradient(
                centerX - cos * length,
                centerY - sin * length,
                centerX + cos * length,
                centerY + sin * length
            );

            canvasGradient.addColorStop(0, gradient.color1);
            canvasGradient.addColorStop(1, gradient.color2);

            context.fillStyle = canvasGradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 3. Draw patterns (with transparency)
        const meshPatternDecals = patternDecals.filter(decal => decal.mesh === mesh);
        meshPatternDecals.forEach(decal => {
            context.save();
            if (decal.isFullCoverage) {
                const pattern = context.createPattern(decal.image, 'repeat');
                context.globalAlpha = decal.opacity;
                context.fillStyle = pattern;

                // Apply pattern scaling
                const patternScale = 1 / decal.scale;
                const patternTransform = new DOMMatrix();
                patternTransform.scaleSelf(patternScale, patternScale);

                if (typeof pattern.setTransform === 'function') {
                    pattern.setTransform(patternTransform);
                }

                context.fillRect(0, 0, canvas.width, canvas.height);
                context.globalAlpha = 1.0;
            }
            context.restore();
        });

        // 4. Draw images
        const meshImageDecals = imageDecals.filter(decal => decal.mesh === mesh);
        meshImageDecals.forEach(decal => {
            context.save();
            const isSelected = (activeImageDecalIndex >= 0 && imageDecals[activeImageDecalIndex].uuid === decal.uuid);

            const centerX = canvas.width / 2 + (decal.offset.x * canvas.width);
            const centerY = canvas.height / 2 + (decal.offset.y * canvas.height);

            context.translate(centerX, centerY);
            context.rotate(decal.rotation);
            context.scale(decal.scale, decal.scale);
            context.translate(-centerX, -centerY);

            const width = decal.bounds.originalWidth * decal.scale;
            const height = decal.bounds.originalHeight * decal.scale;
            const x = centerX - width / 2;
            const y = centerY - height / 2;

            // Draw image
            context.drawImage(decal.image, x, y, width, height);

            // Draw border if selected
            if (isSelected) {
                context.save();
                context.globalAlpha = 1.0;
                context.strokeStyle = 'blue';
                context.lineWidth = 1;
                context.setLineDash([5, 3]);
                context.strokeRect(x - 5, y - 5, width + 10, height + 10);
                context.restore();
            }
            context.restore();
        });

        // 5. Draw texts
        const meshTextDecals = textDecals.filter(decal => decal.mesh === mesh);
        meshTextDecals.forEach(decal => {
            context.save();
            const isSelected = (activeTextDecalIndex >= 0 && textDecals[activeTextDecalIndex].uuid === decal.uuid);

            context.font = `${decal.fontSize}px ${decal.fontFamily}`;
            context.fillStyle = decal.color;
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            const centerX = canvas.width / 2 + (decal.offset.x * canvas.width);
            const centerY = canvas.height / 2 + (decal.offset.y * canvas.height);

            context.translate(centerX, centerY);
            context.rotate(decal.rotation);
            context.translate(-centerX, -centerY);

            // Draw text
            context.fillText(decal.text, centerX, centerY);

            // Draw border if selected
            if (isSelected) {
                context.save();
                context.globalAlpha = 1.0;
                const textWidth = context.measureText(decal.text).width;
                const textHeight = decal.fontSize;

                context.strokeStyle = 'red';
                context.lineWidth = 1;
                context.setLineDash([5, 3]);
                context.strokeRect(
                    centerX - textWidth / 2 - 10,
                    centerY - textHeight / 2 - 5,
                    textWidth + 20,
                    textHeight + 10
                );
                context.restore();
            }
            context.restore();
        });

        // Update the mesh texture
        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = false;
        texture.center.set(0.5, 0.5);

        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
    }
    // Add event listener for apply pattern button
    document.getElementById('applyPatternButton').addEventListener('click', applyPatternToSelectedParts);

    function updateMeshTextureWithAllDecals() {
        if (!selectedMesh) return;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;

        // 1. Clear canvas with white background
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);


        // 2. Draw gradient background if exists
        if (selectedMesh.userData.gradient) {
            const gradient = selectedMesh.userData.gradient;
            const angleRad = THREE.MathUtils.degToRad(gradient.angle);
            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const length = Math.sqrt(centerX * centerX + centerY * centerY) * gradient.scale;

            const canvasGradient = context.createLinearGradient(
                centerX - cos * length,
                centerY - sin * length,
                centerX + cos * length,
                centerY + sin * length
            );

            canvasGradient.addColorStop(0, gradient.color1);
            canvasGradient.addColorStop(1, gradient.color2);

            context.fillStyle = canvasGradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }


        // Get all decals for this mesh
        const meshTextDecals = textDecals.filter(decal => decal.mesh === selectedMesh);
        const meshImageDecals = imageDecals.filter(decal => decal.mesh === selectedMesh);
        const meshPatternDecals = patternDecals.filter(decal => decal.mesh === selectedMesh);

        // Draw patterns first with their current opacity
        meshPatternDecals.forEach(decal => {
            context.save();
            if (decal.isFullCoverage) {
                const pattern = context.createPattern(decal.image, 'repeat');
                context.globalAlpha = decal.opacity; // Use the stored opacity
                context.fillStyle = pattern;

                // Apply pattern scaling
                const patternScale = 1 / decal.scale;
                const patternTransform = new DOMMatrix();
                patternTransform.scaleSelf(patternScale, patternScale);

                if (typeof pattern.setTransform === 'function') {
                    pattern.setTransform(patternTransform);
                }

                context.fillRect(0, 0, canvas.width, canvas.height);
            }
            context.restore();
        });

        // Draw images with borders if selected
        meshImageDecals.forEach(decal => {
            context.save();
            const isSelected = (activeImageDecalIndex >= 0 && imageDecals[activeImageDecalIndex].uuid === decal.uuid);

            const centerX = canvas.width / 2 + (decal.offset.x * canvas.width);
            const centerY = canvas.height / 2 + (decal.offset.y * canvas.height);

            context.translate(centerX, centerY);
            context.rotate(decal.rotation);
            context.scale(decal.scale, decal.scale);
            context.translate(-centerX, -centerY);

            const width = decal.bounds.originalWidth * decal.scale;
            const height = decal.bounds.originalHeight * decal.scale;
            const x = centerX - width / 2;
            const y = centerY - height / 2;

            // Draw image
            context.drawImage(decal.image, x, y, width, height);

            // Draw border if selected (with full opacity)
            if (isSelected) {
                context.save(); // Save current state
                context.globalAlpha = 1.0; // Ensure border is fully opaque
                context.strokeStyle = 'blue';
                context.lineWidth = 1;
                context.setLineDash([5, 3]);
                context.strokeRect(x - 5, y - 5, width + 10, height + 10);
                context.restore(); // Restore previous state
            }
            context.restore();
        });

        // Draw texts with borders if selected
        meshTextDecals.forEach(decal => {
            context.save();
            const isSelected = (activeTextDecalIndex >= 0 && textDecals[activeTextDecalIndex].uuid === decal.uuid);

            context.font = `${decal.fontSize}px ${decal.fontFamily}`;
            context.fillStyle = decal.color;
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            const centerX = canvas.width / 2 + (decal.offset.x * canvas.width);
            const centerY = canvas.height / 2 + (decal.offset.y * canvas.height);

            context.translate(centerX, centerY);
            context.rotate(decal.rotation);
            context.translate(-centerX, -centerY);

            // Draw text
            context.fillText(decal.text, centerX, centerY);

            // Draw border if selected (with full opacity)
            if (isSelected) {
                context.save(); // Save current state
                context.globalAlpha = 1.0; // Ensure border is fully opaque
                const textWidth = context.measureText(decal.text).width;
                const textHeight = decal.fontSize;

                context.strokeStyle = 'red';
                context.lineWidth = 1;
                context.setLineDash([5, 3]);
                context.strokeRect(
                    centerX - textWidth / 2 - 10,
                    centerY - textHeight / 2 - 5,
                    textWidth + 20,
                    textHeight + 10
                );
                context.restore(); // Restore previous state
            }
            context.restore();
        });

        // Update the mesh texture
        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = false;
        texture.center.set(0.5, 0.5);

        selectedMesh.material.map = texture;
        selectedMesh.material.needsUpdate = true;
    }
    // Get the rotation slider and value display
    const rotateImgSlider = document.getElementById('rotateImgSlider');
    const rotateImgValueSpan = document.getElementById('rotateImgValue');

    // Event listener for image rotation
    rotateImgSlider.addEventListener('input', (event) => {
        const rotationValue = event.target.value;
        rotateImgValueSpan.textContent = `${rotationValue}°`;

        if (activeImageDecalIndex >= 0) {
            imageDecals[activeImageDecalIndex].rotation = THREE.MathUtils.degToRad(rotationValue);
            console.log(`Rotating image ${activeImageDecalIndex} to ${rotationValue}°`);
            updateMeshTextureWithAllDecals();
        }
    });
    function updateActiveImageDecalBounds() {
        if (activeImageDecalIndex < 0 || !selectedMesh) return;

        const activeDecal = imageDecals[activeImageDecalIndex];
        const canvasWidth = 512;
        const canvasHeight = 512;

        // Calculate scaled dimensions
        const scaledWidth = activeDecal.bounds.originalWidth * activeDecal.scale;
        const scaledHeight = activeDecal.bounds.originalHeight * activeDecal.scale;

        // Calculate center position (0.5 is center in normalized coords)
        const centerX = 0.5 + activeDecal.offset.x;
        const centerY = 0.5 + activeDecal.offset.y;

        // Calculate bounds (normalized 0-1)
        imageBoundingBox.original = {
            x: (canvasWidth / 2 - scaledWidth / 2) / canvasWidth,
            y: (canvasHeight / 2 - scaledHeight / 2) / canvasHeight,
            width: scaledWidth / canvasWidth,
            height: scaledHeight / canvasHeight
        };

        // Current bounds with offset - corrected calculation
        imageBoundingBox.current = {
            x: centerX - imageBoundingBox.original.width / 2,
            y: centerY - imageBoundingBox.original.height / 2,
            width: imageBoundingBox.original.width,
            height: imageBoundingBox.original.height
        };

        console.log(`Active image bounds: x=${imageBoundingBox.current.x.toFixed(2)}, y=${imageBoundingBox.current.y.toFixed(2)}, w=${imageBoundingBox.current.width.toFixed(2)}, h=${imageBoundingBox.current.height.toFixed(2)}`);
    }
    let textClickOffset = new THREE.Vector2();
    // Flag to check if text can be applied
    let isReadyToApplyText = false; // Flag to track if we're ready to place text
    let pendingText = null; // Store the text for placement
    let textWorldPosition = new THREE.Vector3();
    let isTextMoving = false; // Flag to track whether the text is being moved
    let textDecals = []; // Array to store all text decals
    let selectedMesh = null; // Declare  mesh Selected variable

    // Variables to track the current selected mesh and stored text
    let textToApply = null;
    // Add event listener to select mesh by mouse click
    document.addEventListener('click', selectMeshUnderMouse);
    // Function to apply text texture to selected mesh  
    let textTextures = [];
    let selectedTextColor = '#000000'; // Default color is black

    // Modify your click event listener to check for text clicks
    document.addEventListener('click', (event) => {
        // Skip if we're moving existing decals
        if (isTextMoving || isImageMoving) return;

        // Handle new placements
        const mouse = getNormalizedMousePosition(event);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(model.children, true);

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const uv = intersects[0].uv;

            if (isReadyToPlaceImage && pendingImageFile) {
                applyImageToSelectedMesh(pendingImageFile, uv);
                resetImagePlacementMode();
            }
            else if (isReadyToApplyText && pendingText) {
                applyTextToSelectedMesh(pendingText, uv);
                resetTextPlacementMode();
            }
        }
    });
    // Update all mesh selection buttons
    document.querySelectorAll('.selectArea button').forEach(button => {
        button.addEventListener('click', function () {
            const meshName = this.classList.contains('Plane') ? 'Plane' :
                this.classList.contains('Plane_1') ? 'Plane_1' :
                    this.classList.contains('Plane_4') ? 'Plane_4' :
                        'Plane_3';

            selectedMesh = model.getObjectByName(meshName);
            const centerUV = new THREE.Vector2(0.5, 0.5); // Center placement

            if (isReadyToPlaceImage && pendingImageFile) {
                applyImageToSelectedMesh(pendingImageFile, centerUV);
                resetImagePlacementMode();
            }
            else if (isReadyToApplyText && pendingText) {
                applyTextToSelectedMesh(pendingText, centerUV);
                resetTextPlacementMode();
            }

            console.log(`Selected ${meshName} for placement`);
        });
    });
    function resetImagePlacementMode() {
        isReadyToPlaceImage = false;
        pendingImageFile = null;
        document.body.classList.remove('cursor-active');
    }

    function resetTextPlacementMode() {
        isReadyToApplyText = false; // Reset the flag
        pendingText = null; // Clear pending text
        document.body.classList.remove('cursor-active'); // Reset cursor
    }
    // Add event listeners to the color palette items
    const colorPalette = document.querySelectorAll('.palette');
    const colorPicker = document.querySelector('.colorPicker'); // Get the color preview element

    colorPalette.forEach(colorElement => {
        colorElement.addEventListener('click', (event) => {
            selectedTextColor = event.target.dataset.color;

            // Update the color preview
            colorPicker.style.backgroundColor = selectedTextColor;

            if (activeTextDecalIndex >= 0) {
                textDecals[activeTextDecalIndex].color = selectedTextColor;
                updateMeshTextureWithAllDecals();
            }
            console.log("Current text color:", selectedTextColor);
        });
    });

    // Modify your applyTextToSelectedMesh function to store original bounds
    function applyTextToSelectedMesh(text, uv) {
        if (!text || !selectedMesh) return; // Check if text and mesh are valid

        const fontFamily = document.getElementById('fontFamilySelect3').value; // Get font family

        // Calculate offset from center based on UV coordinates
        const offsetX = uv.x - 0.5; // Convert to offset from center
        const offsetY = uv.y - 0.5;

        const newDecal = {
            text: text,
            color: selectedTextColor,
            fontFamily: fontFamily,
            fontSize: currentFontSize,
            offset: new THREE.Vector2(offsetX, offsetY),
            rotation: 0,
            mesh: selectedMesh,
            uuid: THREE.MathUtils.generateUUID(),
            isLocked: false // Add this new property
        };

        textDecals.push(newDecal); // Add the new decal to the array
        updateMeshTextureWithAllDecals(); // Update the mesh texture

        activeTextDecalIndex = textDecals.length - 1; // Set the active decal index
        document.querySelector('.decalText').textContent = text; // Update the display text
        console.log(`Added text "${text}" to ${selectedMesh.name} at position x:${uv.x.toFixed(2)}, y:${uv.y.toFixed(2)}`);
    }
    // New function to composite all texts onto the mesh texture
    function updateMeshTextureWithAllTexts() {
        if (!selectedMesh) return;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;

        // Clear canvas with white background
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw all texts that belong to this mesh
        const meshDecals = textDecals.filter(decal => decal.mesh === selectedMesh);

        meshDecals.forEach(decal => {
            context.save(); // Save the current context state

            // Set text style
            context.font = `${decal.fontSize}px ${decal.fontFamily}`;
            context.fillStyle = decal.color;
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            // Calculate position with offset
            const centerX = canvas.width / 2 + (decal.offset.x * canvas.width);
            const centerY = canvas.height / 2 + (decal.offset.y * canvas.height);

            // Apply rotation
            context.translate(centerX, centerY);
            context.rotate(decal.rotation);
            context.translate(-centerX, -centerY);

            // Draw the text
            context.fillText(decal.text, centerX, centerY);

            // Draw selection border if this is the active decal
            if (decal.uuid === textDecals[activeTextDecalIndex]?.uuid) {
                const textWidth = context.measureText(decal.text).width;
                const textHeight = decal.fontSize;

                context.strokeStyle = 'red';
                context.lineWidth = 1;
                context.setLineDash([5, 3]);
                context.strokeRect(
                    centerX - textWidth / 2 - 10,
                    centerY - textHeight / 2 - 5,
                    textWidth + 20,
                    textHeight + 10
                );
            }

            context.restore(); // Restore the context state
        });

        // Update the mesh texture
        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = false;
        texture.center.set(0.5, 0.5);

        selectedMesh.material.map = texture;
        selectedMesh.material.needsUpdate = true;

        // Update bounds for the active decal
        if (activeTextDecalIndex >= 0) {
            updateActiveDecalBounds();
        }
    }

    // Update the bounds calculation for the active decal
    function updateActiveDecalBounds() {
        if (activeTextDecalIndex < 0 || !selectedMesh) return;

        const activeDecal = textDecals[activeTextDecalIndex];
        const canvasWidth = 512;
        const canvasHeight = 512;

        // Measure text dimensions
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempContext.font = `${activeDecal.fontSize}px ${activeDecal.fontFamily}`;
        const textWidth = tempContext.measureText(activeDecal.text).width;
        const textHeight = activeDecal.fontSize;

        // Calculate bounds (normalized 0-1)
        textBoundingBox.original = {
            x: (canvasWidth / 2 - textWidth / 2) / canvasWidth,
            y: (canvasHeight / 2 - textHeight / 2) / canvasHeight,
            width: textWidth / canvasWidth,
            height: textHeight / canvasHeight
        };

        // Update current bounds with offset
        textBoundingBox.current = {
            x: 0.5 + (textBoundingBox.original.x - 0.5) + activeDecal.offset.x,
            y: 1 - (0.5 + (textBoundingBox.original.y - 0.5) + activeDecal.offset.y) - textBoundingBox.original.height,
            width: textBoundingBox.original.width,
            height: textBoundingBox.original.height
        };
    }
    // Add this helper function to update bounds when texture moves
    function updateTextBounds(offset) {
        if (!textBoundingBox.original) return;

        textBoundingBox.current = {
            x: 0.5 + textBoundingBox.original.x + offset.x,
            y: 1 - (0.5 + textBoundingBox.original.y + offset.y) - textBoundingBox.original.height, // Invert Y-axis
            width: textBoundingBox.original.width,
            height: textBoundingBox.original.height
        };
    }

    function logTexturePosition() {
        if (selectedMesh && selectedMesh.material.map) {
            // Log the texture offset
            const textureOffset = selectedMesh.material.map.offset;
            console.log('Texture Offset Position:', textureOffset);
        }
    }





    // Function to move the text based on the stored texture information
    function moveTextByOffset(offset) {
        // Find the last applied texture and its position
        const lastText = textTextures[textTextures.length - 1];

        if (lastText) {
            const texture = lastText.texture;
            const mesh = lastText.mesh;

            // Calculate the new position based on the offset
            texture.offset.x += offset.x;
            texture.offset.y += offset.y;

            // Update the texture
            mesh.material.map.needsUpdate = true;
        }
    }

    // Function to handle rotation of a specific text
    function rotateText(rotationValue) {
        if (selectedMesh && selectedMesh.material.map) {
            const textureRotation = THREE.MathUtils.degToRad(rotationValue);

            // Set texture center to the center of the texture
            selectedMesh.material.map.center.set(0.5, 0.5);

            // Apply the rotation
            selectedMesh.material.map.rotation = textureRotation;
            selectedMesh.material.needsUpdate = true;
        }
    }


    // Function to delete the last text applied
    function deleteLastText() {
        // Remove the last applied text
        const lastText = textTextures.pop();

        if (lastText) {
            // Reset the mesh material if no other texts are applied
            if (textTextures.length === 0) {
                lastText.mesh.material.map = null;
                lastText.mesh.material.needsUpdate = true;
            }
        }
    }

    function calculateUVCoordinates(point, mesh) {
        const geometry = mesh.geometry;
        const position = geometry.attributes.position;
        const uv = geometry.attributes.uv;

        // Local space to world space
        const inverseMatrix = mesh.matrixWorld.clone().invert();
        const localPoint = point.clone().applyMatrix4(inverseMatrix);

        // Find the closest vertex to the click point
        let closestDistance = Infinity;
        let closestUV = new THREE.Vector2();

        for (let i = 0; i < position.count; i++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(position, i);
            const distance = vertex.distanceTo(localPoint);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestUV.set(uv.getX(i), uv.getY(i));  // Store the UV coordinates
            }
        }

        // Adjust the Y-coordinate for top/bottom regions
        const adjustedUV = new THREE.Vector2(closestUV.x, 1 - closestUV.y); // Flip the Y-axis
        return adjustedUV;
    }


    // Handle apply text button click
    document.getElementById('applyTextButton').addEventListener('click', () => {
        const inputText = document.getElementById('textInput').value.trim(); // Trim whitespace
        if (inputText) {
            pendingText = inputText; // Store the text for placement
            isReadyToApplyText = true; // Set the flag to true
            isReadyToApplyImage = false; // Disable image placement mode
            document.body.classList.add('cursor-active'); // Change cursor to active
        } else {
            console.log('No text entered'); // Log if no text is entered
            alert('Please enter some text before applying.'); // Alert the user
        }
    });
    // Function to get the currently  mesh Selected based on button clicks
    function getSelectedMesh() {
        return selectedMesh;
    }

    // Function to select mesh via buttons
    function selectMeshFromButton(meshName) {
        selectedMesh = model.getObjectByName(meshName);

        if (isReadyToApplyText && pendingText) {
            const centerUV = new THREE.Vector2(0.5, 0.5);
            applyTextToSelectedMesh(pendingText, centerUV);
            isReadyToApplyText = false;
            pendingText = null;
            document.body.classList.remove('cursor-active');
        }
        else if (isReadyToApplyImage && pendingImageFile) {
            const centerUV = new THREE.Vector2(0.5, 0.5);
            applyImageToSelectedMesh(pendingImageFile, centerUV);
            isReadyToApplyImage = false;
            document.body.classList.remove('cursor-active');
        }

        console.log(`Selected mesh from button: ${selectedMesh ? selectedMesh.name : 'None'}`);
    }
    // Button event listeners to select different meshes
    document.getElementById('frontButton').addEventListener('click', () => {
        selectMeshFromButton('Plane');
    });

    document.getElementById('backButton').addEventListener('click', () => {
        selectMeshFromButton('Plane_1');
    });

    document.getElementById('leftSleeveButton').addEventListener('click', () => {
        selectMeshFromButton('Plane_4');
    });

    document.getElementById('rightSleeveButton').addEventListener('click', () => {
        selectMeshFromButton('Plane_3');
    });

    // Variables to store the original position of the text
    let originalTextPosition = new THREE.Vector3();
    // Add a variable to store the last click UV coordinates
    let lastClickUV = null;
    // Function to handle mesh selection
    function selectMeshUnderMouse(event) {
        const canvasRect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
            -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        let intersects = raycaster.intersectObjects(model.children, true);

        if (intersects.length > 0) {
            selectedMesh = intersects[0].object;
            lastClickUV = intersects[0].uv; // Store the UV coordinates
            console.log('Mesh selected by click:', selectedMesh.name, 'at UV:', lastClickUV);
        }
    }
    let pendingImageFile = null; // Store the uploaded image file
    let isReadyToPlaceImage = false; // Flag for image placement mode

    document.getElementById('applyLogoButton').addEventListener('click', () => {
        if (pendingImageFile) {
            isReadyToPlaceImage = true;
            isReadyToApplyText = false; // Disable text placement mode
            document.body.classList.add('cursor-active');
            console.log('Ready to place image - click on mesh or select area');
        } else {
            console.log('No image selected');
        }
    });


    // Mouse down event - unchanged
    document.addEventListener('mousedown', (event) => {
        const mouse = getNormalizedMousePosition(event);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(model.children, true);
        let decalClicked = false;

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const uv = intersects[0].uv;

            // First check image decals (search all meshes)
            for (let i = imageDecals.length - 1; i >= 0; i--) {
                const decal = imageDecals[i];
                // Remove mesh check - decal can be on any mesh
                const bounds = {
                    x: 0.5 + decal.offset.x - (decal.bounds.width * decal.scale / 2),
                    y: 0.5 + decal.offset.y - (decal.bounds.height * decal.scale / 2),
                    width: decal.bounds.width * decal.scale,
                    height: decal.bounds.height * decal.scale
                };

                if (uv.x >= bounds.x && uv.x <= bounds.x + bounds.width &&
                    uv.y >= bounds.y && uv.y <= bounds.y + bounds.height) {

                    activeTextDecalIndex = -1;
                    activeImageDecalIndex = i;
                    selectedMesh = clickedMesh; // Update selected mesh to the one clicked on
                    decalClicked = true;

                    isImageMoving = true;
                    isImageSelected = true;
                    controls.enabled = false;
                    document.body.style.cursor = "grabbing";

                    imageClickOffset.set(
                        uv.x - (bounds.x + bounds.width / 2),
                        uv.y - (bounds.y + bounds.height / 2)
                    );
                    updateImagePreview();
                    updateAllMeshTextures();
                    break;
                }
            }

            // Then check text decals (search all meshes)
            if (!decalClicked) {
                for (let i = textDecals.length - 1; i >= 0; i--) {
                    const decal = textDecals[i];
                    // Remove mesh check - decal can be on any mesh
                    const tempCanvas = document.createElement('canvas');
                    const tempContext = tempCanvas.getContext('2d');
                    tempContext.font = `${decal.fontSize}px ${decal.fontFamily}`;
                    const textWidth = tempContext.measureText(decal.text).width;
                    const textHeight = decal.fontSize;

                    const bounds = {
                        x: 0.5 + decal.offset.x - (textWidth / 512 / 2),
                        y: 0.5 + decal.offset.y - (textHeight / 512 / 2),
                        width: textWidth / 512,
                        height: textHeight / 512
                    };

                    if (uv.x >= bounds.x && uv.x <= bounds.x + bounds.width &&
                        uv.y >= bounds.y && uv.y <= bounds.y + bounds.height) {

                        activeTextDecalIndex = i;
                        activeImageDecalIndex = -1;
                        selectedMesh = clickedMesh; // Update selected mesh to the one clicked on
                        decalClicked = true;

                        isTextMoving = true;
                        isTextSelected = true;
                        controls.enabled = false;
                        document.body.style.cursor = "grabbing";

                        textClickOffset.set(
                            uv.x - (bounds.x + bounds.width / 2),
                            uv.y - (bounds.y + bounds.height / 2)
                        );

                        // Update color preview
                        document.querySelector('.colorPicker').style.backgroundColor = decal.color;
                        document.querySelector('.decalText').textContent = decal.text;

                        updateAllMeshTextures();
                        break;
                    }
                }
            }

            // If clicked on mesh but not on any decal
            if (!decalClicked) {
                selectedMesh = clickedMesh;
                isTextMoving = false;
                isImageMoving = false;
                controls.enabled = true;
                document.body.style.cursor = "";
            }
        }
    });

    // Mouse move event - fixed movement directions
    document.addEventListener('mousemove', (event) => {
        if (isTextMoving && isTextSelected && activeTextDecalIndex >= 0) {
            if (textDecals[activeTextDecalIndex].isLocked) {
                console.log("Text decal is locked - cannot move");
                return;
            }

            const mouse = getNormalizedMousePosition(event);
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(model.children, true);
            if (intersects.length === 0) return;

            const uv = intersects[0].uv;
            const activeDecal = textDecals[activeTextDecalIndex];
            const newMesh = intersects[0].object;

            // Only update if mesh has changed
            if (activeDecal.mesh !== newMesh) {
                // Store the current mesh to update later
                const oldMesh = activeDecal.mesh;

                // Update the decal's mesh reference
                activeDecal.mesh = newMesh;

                // Force update of both old and new meshes
                updateMeshTextureForMesh(oldMesh);
                updateMeshTextureForMesh(newMesh);
            }

            // Get current mouse position
            const currentMouseX = uv.x;
            const currentMouseY = uv.y;

            if (!this.lastMouseX) this.lastMouseX = currentMouseX;
            if (!this.lastMouseY) this.lastMouseY = currentMouseY;

            const deltaX = currentMouseX - this.lastMouseX;
            const deltaY = currentMouseY - this.lastMouseY;

            activeDecal.offset.x += deltaX;
            activeDecal.offset.y += deltaY;

            this.lastMouseX = currentMouseX;
            this.lastMouseY = currentMouseY;

            // Update only the current mesh (the new one if changed)
            updateMeshTextureForMesh(activeDecal.mesh);
            updateActiveDecalBounds();
        }
        else if (isImageMoving && isImageSelected && activeImageDecalIndex >= 0) {
            if (imageDecals[activeImageDecalIndex].isLocked) {
                console.log("Image decal is locked - cannot move");
                return;
            }

            const mouse = getNormalizedMousePosition(event);
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(model.children, true);
            if (intersects.length === 0) return;

            const uv = intersects[0].uv;
            const activeDecal = imageDecals[activeImageDecalIndex];
            const newMesh = intersects[0].object;

            // Only update if mesh has changed
            if (activeDecal.mesh !== newMesh) {
                // Store the current mesh to update later
                const oldMesh = activeDecal.mesh;

                // Update the decal's mesh reference
                activeDecal.mesh = newMesh;

                // Force update of both old and new meshes
                updateMeshTextureForMesh(oldMesh);
                updateMeshTextureForMesh(newMesh);
            }

            const newX = uv.x - imageClickOffset.x;
            const newY = uv.y - imageClickOffset.y;

            activeDecal.offset.x = newX - 0.5;
            activeDecal.offset.y = newY - 0.5;

            // Update only the current mesh (the new one if changed)
            updateMeshTextureForMesh(activeDecal.mesh);
            updateActiveImageDecalBounds();
        }
    });
    // Mouse up event - unchanged
    document.addEventListener('mouseup', () => {
        if (isTextSelected) {
            this.lastMouseX = null;
            this.lastMouseY = null;
            document.body.style.cursor = "";
            controls.enabled = true;
            isTextMoving = false;
        }
        if (isImageSelected) {
            this.lastMouseX = null;
            this.lastMouseY = null;
            document.body.style.cursor = "";
            controls.enabled = true;
            isImageMoving = false;
        }
        isTextSelected = false;
        isTextMoving = false;
        isImageSelected = false;
        isImageMoving = false;
    });
    // Updated bounds calculation helper
    function calculateDecalBounds(decal) {
        const canvasWidth = 512;
        const canvasHeight = 512;

        // Measure text
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempContext.font = `${decal.fontSize}px ${decal.fontFamily}`;
        const textWidth = tempContext.measureText(decal.text).width;
        const textHeight = decal.fontSize;

        // Calculate center position
        const centerX = 0.5 + decal.offset.x;
        const centerY = 0.5 + decal.offset.y;

        // Return bounds in correct coordinate space
        return {
            x: centerX - (textWidth / canvasWidth) / 2,
            y: centerY - (textHeight / canvasHeight) / 2,
            width: textWidth / canvasWidth,
            height: textHeight / canvasHeight
        };
    }

    // fontFamilySelect  
    const fontFamilySelect = document.getElementById('fontFamilySelect3');
    let activeTextDecalIndex = -1; // Track which text is currently selected

    // Event listener to handle font family change
    fontFamilySelect.addEventListener('change', (event) => {
        if (activeTextDecalIndex >= 0) {
            textDecals[activeTextDecalIndex].fontFamily = event.target.value;
            updateMeshTextureWithAllDecals(); // Changed from updateMeshTextureWithAllTexts()
            updateActiveDecalBounds();
        }
    });



    // custom CSS class for cursor 
    document.styleSheets[0].insertRule(`
    .cursor-active {
        cursor: url('plus-cursor.png'), auto;
    }
`, 0);

    // Event listener to apply text via mouse click
    document.addEventListener("click", (event) => {
        if (isTextMoving || isImageMoving) return;

        const canvasRect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
            -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(model.children, true);

        if (intersects.length > 0) {
            selectedMesh = intersects[0].object;
            const uv = intersects[0].uv;

            if (isReadyToApplyText && pendingText) {
                applyTextToSelectedMesh(pendingText, uv);
                isReadyToApplyText = false;
                pendingText = null;
                document.body.classList.remove('cursor-active');
            }
            else if (isReadyToApplyImage && pendingImageFile) {
                applyImageToSelectedMesh(pendingImageFile, uv);
                isReadyToApplyImage = false;
                document.body.classList.remove('cursor-active');
            }
        }
    });

    // roateText 
    // Get the slider and the span where the rotation value is displayed
    const rotateSlider = document.getElementById('rotateSlider');
    const rotationValueSpan = document.getElementById('rotationValue');

    // In your text rotation slider:
    rotateSlider.addEventListener('input', (event) => {
        const rotationValue = event.target.value;
        rotationValueSpan.textContent = rotationValue;

        if (activeTextDecalIndex >= 0) {
            textDecals[activeTextDecalIndex].rotation = THREE.MathUtils.degToRad(rotationValue);
            updateMeshTextureWithAllDecals(); // Changed from updateMeshTextureWithAllTexts()
        }
    });

    // roateText 

    // borderButtons  
    const deleteButton = document.getElementById('bottomLeftButton');

    // Action flags 
    let isFixed = false;
    let isDeleting = false;
    const opacityValueSpan = document.getElementById('OpacityValue');


    let isReadyToApplyImage = false; // Flag for image placement mode

    let imageDecals = []; // Array to store all image decals
    let activeImageDecalIndex = -1; // Track which image is currently selected
    let isImageMoving = false; // Flag to track whether the image is being moved
    let isImageSelected = false; // Flag to track if an image is selected
    let imageClickOffset = new THREE.Vector2(); // Store click offset for images
    let imageBoundingBox = {
        original: null,
        current: null
    };
    deleteButton.addEventListener('click', () => {
        // First check if we're deleting a pattern
        const patternToDelete = patternDecals.find(d => d.mesh === selectedMesh);
        if (patternToDelete) {
            console.log("Deleting pattern decal");
            patternDecals = patternDecals.filter(d => d.uuid !== patternToDelete.uuid);
            updateAllMeshTextures();
            return;
        }

        if (activeTextDecalIndex >= 0) {
            console.log(`Deleting text decal ${activeTextDecalIndex}`);
            textDecals.splice(activeTextDecalIndex, 1);
            activeTextDecalIndex = -1;
            isTextSelected = false;
        }
        else if (activeImageDecalIndex >= 0) {
            console.log(`Deleting image decal ${activeImageDecalIndex}`);
            imageDecals.splice(activeImageDecalIndex, 1);
            activeImageDecalIndex = -1;
            isImageSelected = false;
            // Clear the preview when deleting
            uploadedImagePreview.style.display = 'none';
            imagePreviewBorder.style.display = 'none';
        }

        // Update the texture
        if (selectedMesh) {
            if (textDecals.filter(d => d.mesh === selectedMesh).length > 0 ||
                imageDecals.filter(d => d.mesh === selectedMesh).length > 0) {
                updateAllMeshTextures();
            } else {
                // No more decals on this mesh - clear the texture
                selectedMesh.material.map = null;
                selectedMesh.material.needsUpdate = true;
            }
        }
    });
    // borderButtons 

    // Helper function to get normalized mouse position (you already have this)
    function getNormalizedMousePosition(event) {
        const canvasRect = renderer.domElement.getBoundingClientRect();
        return new THREE.Vector2(
            ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
            -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1
        );
    }
    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        renderer.render(scene, camera);
        // Perform a one-time rotation

        if (model) {
            if (rotationProgress < Math.PI * 2) {
                // Rotate 360 degrees (2 * PI radians)
                model.rotation.y += rotationSpeed;
                rotationProgress += rotationSpeed;
            }
        }

        // Update the light's position based on the model's rotation
        if (model) {
            const lightDistance = 1; // Adjust distance as needed
            const modelRotationY = model.rotation.y;
            directionalLight.position.set(
                Math.cos(modelRotationY) * lightDistance, // x
                5, // y
                Math.sin(modelRotationY) * lightDistance // z
            );
        }


    }
    animate();
});
