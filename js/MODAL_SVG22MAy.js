document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("threejs-container");
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("threejs-container");
    if (!container) {
        console.error("Container element not found!");
        return;
    }
    const scene = new THREE.Scene();
    let backgroundColor = 0xeeeeee; // Default color
    scene.background = new THREE.Color(backgroundColor);
    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        1000,
    );
    camera.position.set(0, 1, 5);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableRotate = true;
    controls.target.set(0, 0, 0);
    // Restrict rotation
    const patternScaleValueSpan = document.getElementById("patternScaleValue");

    controls.maxPolarAngle = Math.PI / 2; // Limit to 90 degrees (top)
    controls.minPolarAngle = 0.4; // Limit to 0 degrees (bottom)

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
    // Screen toggle functionality
    document.getElementById('applyTextButton').addEventListener('click', function () {
        // Hide Screen 1
        document.getElementById('screen1').style.display = 'none';
        // Show Screen 2
        document.getElementById('screen2').style.display = 'block';
    });

    // Mesh side buttons
    document.querySelectorAll('.meshSideBtn').forEach(button => {
        button.addEventListener('click', function () {
            // Hide Screen 2
            document.getElementById('screen2').style.display = 'none';
            // Show Screen 3
            document.getElementById('screen3').style.display = 'block';
        });
    });
    function showTextEditingScreen() {
        // Hide all screens first
        document.getElementById('screen1').style.display = 'none';
        document.getElementById('screen2').style.display = 'none';
        document.getElementById('screen3').style.display = 'none';

        // Show only screen 3
        document.getElementById('screen3').style.display = 'block';
    }

    // Add this event listener to handle color changes
    document.getElementById('bgColorPicker').addEventListener('input', function (e) {
        // Convert hex color string to Three.js color
        backgroundColor = new THREE.Color(e.target.value).getHex();
        scene.background.setHex(backgroundColor);

        // Optional: update other elements that might need to match
        updateLightingForNewBackground();
    });
    // Add this to your existing color palette event listeners
    document.querySelectorAll('.background-palette .palette').forEach(palette => {
        palette.addEventListener('click', (e) => {
            const color = e.target.dataset.color;
            scene.background = new THREE.Color(color);

            // Update the color picker value to match
            document.getElementById('bgColorPicker').value = color.startsWith('#') ? color : `#${color}`;
        });
    });
    // Optional helper function to adjust lighting based on background
    function updateLightingForNewBackground() {
        const brightness = scene.background.getStyle().match(/\d+/g).reduce((a, b) => a + parseInt(b), 0) / 3;

        // Adjust ambient light intensity based on background brightness
        ambientLight.intensity = brightness > 128 ? 0.4 : 0.7;

        // Adjust other lights if needed
        directionalLight.intensity = brightness > 128 ? 0.6 : 0.9;
    }


    // Go back buttons
    document.querySelectorAll('.goBAckBtn').forEach(button => {
        button.addEventListener('click', function () {
            // Hide Screen 3
            document.getElementById('screen3').style.display = 'none';
            // Show Screen 1
            document.getElementById('screen1').style.display = 'block';
        });
    });
    function processMeshes(model, colorMappings) {
        model.traverse((child) => {
            if (child.isMesh) {
                const colorHex = colorMappings[child.name];
                if (colorHex) {
                    child.userData.colorCategory = child.name;

                    // Create gradient texture
                    const gradientTexture = createGradientTexture(colorHex, colorHex);

                    // Create material with the gradient texture
                    child.material = new THREE.MeshStandardMaterial({
                        map: gradientTexture,
                        side: THREE.DoubleSide,
                    });

                    // Store gradient info
                    child.userData.gradient = {
                        color1: colorHex,
                        color2: colorHex,
                        angle: 0,
                        scale: 1.0,
                    };

                    // Add to mesh collection
                    if (!meshes[child.name]) {
                        meshes[child.name] = [];
                    }
                    meshes[child.name].push(child);
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
            primary: 0xf5f5f5, // Example color for Design2
            secondary: 0x16521f,
            tertiary: 0x1c1c1c,
        },
        Design1: {
            primary: 0xf5f5f5, // Example color for Design2
            secondary: 0x16521f,
            tertiary: 0x1c1c1c,
        },
        Design2: {
            primary: 0xffb81c, // Example color for Design2
            secondary: 0x1c1c1c,
            tertiary: 0x1c1c1c,
        },
        Design3: {
            primary: 0x16521f, // Example color for Design2
            secondary: 0xf5f5f5,
        },

        // Add more designs and their corresponding colors here
    };
    let currentModelFilename = null; // Track the current model filename
    const loader = new THREE.GLTFLoader();

    // Load a default model when the page loads
    function loadDefaultModel() {
        // Choose one of your models as the default
        const defaultModelUrl = "assets/models/Modal2FullSleeves.glb";
        const defaultModelType = "halfSleeves"; // or whatever type it is
        const defaultColorMappings = {
            Plane: "primary",
            Plane_1: "secondary"
        };

        loadModel(defaultModelUrl, defaultColorMappings, defaultModelType);
    }
    function loadModel(url, colorMappings, modelType) {
        currentModelType = modelType; // Store the current model type
        currentModelFilename = url.split('/').pop();
        clearPreviousModel(); // Clear previous model and decals
        // Hide all forms initially

        document.querySelectorAll(".patternMesh form").forEach((form) => {
            form.style.display = "none";
        });
        document.querySelectorAll(".gradeientMEsh form").forEach((form) => {
            form.style.display = "none";
        });
        // Show the relevant form based on the model type
        // Inside loadModel function, update this section:
        if (modelType === "halfSleeves") {
            document.querySelector(".halfSleevesPattern").style.display = "grid";
            document.querySelector(".halfSleeveGradient").style.display = "grid";
            // Update default colors for halfSleeves
            Object.assign(COLORS, designColors.halfSleeves);
        } else if (modelType === "fullSleeves") {
            document.querySelector(".fullSleevePattern").style.display = "grid";
            document.querySelector(".fullSleeveGradient").style.display = "grid";
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
            Tertiary: [],
        };

        function updateMeshColor(selectedMesh, selectedColor) {
            // If this is a group name (Primary/Secondary/Tertiary)
            if (
                selectedMesh === "Primary" ||
                selectedMesh === "Secondary" ||
                selectedMesh === "Tertiary"
            ) {
                // Update all meshes in this group
                const meshGroup = meshColorGroups[selectedMesh];
                if (meshGroup) {
                    meshGroup.forEach((meshName) => {
                        const mesh = model.getObjectByName(meshName);
                        if (mesh && mesh.userData.gradient) {
                            mesh.userData.gradient.color1 = selectedColor;
                            mesh.userData.gradient.color2 = selectedColor;
                            updateMeshTextureForMesh(mesh);
                        }
                    });
                }
            } else {
                // Else it's an individual mesh
                const mesh = model.getObjectByName(selectedMesh);
                if (mesh && mesh.userData.gradient) {
                    mesh.userData.gradient.color1 = selectedColor;
                    mesh.userData.gradient.color2 = selectedColor;
                    updateMeshTextureForMesh(mesh);
                }
            }

            // Update the color preview for the selected mesh in both sections
            const colorPreviewPrimary = document.getElementById("applyPrimary");
            const colorPreviewSecondary = document.getElementById("applySecondary");
            const colorPreviewTertiary = document.getElementById("applyTertiary");

            // Update the primary, secondary, and tertiary previews based on the selected mesh
            if (selectedMesh === "Primary") {
                if (colorPreviewPrimary) {
                    colorPreviewPrimary.style.backgroundColor = selectedColor;
                }
                // Also update the static preview
                const staticPrimary = document.querySelector("#meshColorpst .Primary");
                if (staticPrimary) {
                    staticPrimary.style.backgroundColor = selectedColor;
                }
            } else if (selectedMesh === "Secondary") {
                if (colorPreviewSecondary) {
                    colorPreviewSecondary.style.backgroundColor = selectedColor;
                }
                // Also update the static preview
                const staticSecondary = document.querySelector(
                    "#meshColorpst .Secondary",
                );
                if (staticSecondary) {
                    staticSecondary.style.backgroundColor = selectedColor;
                }
            } else if (selectedMesh === "Tertiary") {
                if (colorPreviewTertiary) {
                    colorPreviewTertiary.style.backgroundColor = selectedColor;
                }
                // Also update the static preview
                const staticTertiary = document.querySelector(
                    "#meshColorpst .Tertiary",
                );
                if (staticTertiary) {
                    staticTertiary.style.backgroundColor = selectedColor;
                }
            }

            // Also update the dynamic mesh options
            const dynamicColorPreview = document.getElementById(
                `apply${selectedMesh}`,
            );
            if (dynamicColorPreview) {
                dynamicColorPreview.style.backgroundColor = selectedColor;
            }
        }
        document
            .querySelectorAll(".meshColorPalette .palette")
            .forEach((palette) => {
                palette.addEventListener("click", (e) => {
                    const selectedColor = e.target.dataset.color;
                    const activeMeshRadio = document.querySelector(
                        'input[name="meshActiveColor"]:checked',
                    );
                    if (!activeMeshRadio) return;

                    const selectedMesh = activeMeshRadio.value;
                    updateMeshColor(selectedMesh, selectedColor);

                    // Update the color preview - for both individual meshes and groups
                    if (
                        selectedMesh === "Primary" ||
                        selectedMesh === "Secondary" ||
                        selectedMesh === "Tertiary"
                    ) {
                        // Update all previews in this group
                        const meshGroup = meshColorGroups[selectedMesh];
                        if (meshGroup) {
                            meshGroup.forEach((meshName) => {
                                const colorPreview = document.getElementById(
                                    `apply${meshName}`,
                                );
                                if (colorPreview) {
                                    colorPreview.style.backgroundColor = selectedColor;
                                }
                            });
                        }
                    } else {
                        // Update individual mesh preview
                        const colorPreview = document.getElementById(
                            `apply${selectedMesh}`,
                        );
                        if (colorPreview) {
                            colorPreview.style.backgroundColor = selectedColor;
                        }
                    }
                });
            });
        // Text color palette event listener - modified to only affect text
        document.querySelectorAll(".textColorPalette .palette").forEach((colorElement) => {
            colorElement.addEventListener("click", (event) => {
                // Ensure the color is properly formatted
                selectedTextColor = event.target.dataset.color;
                if (!selectedTextColor.startsWith('#')) {
                    selectedTextColor = `#${selectedTextColor}`;
                }

                // Update the text color preview
                document.querySelector(".colorPicker").style.backgroundColor = selectedTextColor;

                if (activeTextDecalIndex >= 0) {
                    textDecals[activeTextDecalIndex].color = selectedTextColor;
                    updateMeshTextureWithAllDecals();
                }
                console.log("Current text color:", selectedTextColor);
            });
        });
        // Event listener for radio buttons to toggle active group
        document
            .querySelectorAll('input[name="meshActiveColor"]')
            .forEach((radio) => {
                radio.addEventListener("change", (e) => {
                    const activeGroup = e.target.value;

                    // Show the title for the selected group and hide others
                    ["Primary", "Secondary", "Tertiary"].forEach((group) => {
                        document.getElementById(`title${group}`).style.display =
                            group === activeGroup ? "block" : "none";
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
            const sortedColors = Object.keys(colorFrequency).sort(
                (a, b) => colorFrequency[b].length - colorFrequency[a].length,
            );

            // Assign meshes to groups based on sorted colors
            meshColorGroups.Primary = colorFrequency[sortedColors[0]] || [];
            meshColorGroups.Secondary = colorFrequency[sortedColors[1]] || [];
            meshColorGroups.Tertiary = colorFrequency[sortedColors[2]] || [];

            console.log("Assigned Mesh Groups:", meshColorGroups);
        }

        function populateMeshList(meshColors) {
            const meshColorOptions = document.getElementById("meshColorOptions");
            meshColorOptions.innerHTML = ""; // Clear previous options

            // Add group options first
            ["Primary", "Secondary", "Tertiary"].forEach((group) => {
                const label = document.createElement("label");
                label.className = "colorsMeshItems part-button";
                label.dataset.part = group;

                label.innerHTML = `
                      <input type="radio" name="meshActiveColor" value="${group}" id="group-${group}">
                      <div class="meshActiveColor" id="apply${group}"></div>
                      <h6 class="meshActiveFaceName">${group} Group</h6>
                  `;

                meshColorOptions.appendChild(label);
            });

            // Then add individual mesh options
            Object.keys(meshColors).forEach((meshName, index) => {
                const color = meshColors[meshName];
                const id = `meshOption-${index}`;

                const label = document.createElement("label");
                label.className = "colorsMeshItems part-button";
                label.dataset.part = meshName;

                label.innerHTML = `
                      <input type="radio" name="meshActiveColor" value="${meshName}" id="${id}">
                      <div class="meshActiveColor" style="background-color: ${color};" id="apply${meshName}"></div>
                      <h6 class="meshActiveFaceName">${meshName}</h6>
                  `;

                meshColorOptions.appendChild(label);
            });

            // Initialize group colors based on first mesh in each group
            ["Primary", "Secondary", "Tertiary"].forEach((group) => {
                if (meshColorGroups[group] && meshColorGroups[group].length > 0) {
                    const firstMesh = model.getObjectByName(meshColorGroups[group][0]);
                    if (firstMesh && firstMesh.userData.gradient) {
                        // Update both static and dynamic previews
                        const colorPreview = document.getElementById(`apply${group}`);
                        if (colorPreview) {
                            colorPreview.style.backgroundColor =
                                firstMesh.userData.gradient.color1;
                        }

                        // Update static preview
                        const staticPreview = document.querySelector(
                            `#meshColorpst .${group}`,
                        );
                        if (staticPreview) {
                            staticPreview.style.backgroundColor =
                                firstMesh.userData.gradient.color1;
                        }
                    }
                }
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
            model.traverse(child => {
                if (child.isMesh && child.geometry.attributes.uv) {
                    console.log(`UVs for ${child.name}:`);
                    const uv = child.geometry.attributes.uv;
                    for (let i = 0; i < Math.min(10, uv.count); i++) {
                        console.log(`  Vertex ${i}: (${uv.getX(i).toFixed(2)}, ${uv.getY(i).toFixed(2)})`);
                    }
                }
            });
            console.log("Mesh Colors:", meshColors);
            const meshNames = Object.keys(meshColors);
            populatePatternForm(meshNames);
            populateImagePlacementButtons();
            // ADD THIS LINE TO INITIALIZE GRADIENT FORM
            populateGradientForm(meshNames);
            populateMeshButtons(meshNames); // Add this line
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

    function populateImagePlacementButtons() {
        const imageContainer = document.getElementById("dynamicImageMeshButtons");
        imageContainer.innerHTML = ""; // Clear existing buttons

        if (!currentModelType || !currentModelFilename || !modelMeshConfigs[currentModelType]) {
            console.warn("No mesh configuration found for model:", currentModelType, currentModelFilename);
            return;
        }

        // Get the specific configuration for this model
        const modelConfig = modelMeshConfigs[currentModelType][currentModelFilename];
        if (!modelConfig) {
            console.warn("No specific configuration found for model:", currentModelFilename);
            return;
        }

        const meshConfig = modelConfig.placementMeshes;

        // Check which meshes actually exist in the model
        const availableMeshes = {};
        Object.keys(meshConfig).forEach(meshName => {
            if (model.getObjectByName(meshName)) {
                availableMeshes[meshName] = meshConfig[meshName];
            }
        });

        // Create buttons only for meshes that exist in the model
        Object.entries(availableMeshes).forEach(([meshName, config]) => {
            const imageButton = document.createElement("button");
            imageButton.className = `${meshName} meshSide imageMeshBtn`;
            imageButton.id = `${meshName}ImageButton`;
            imageButton.dataset.mesh = meshName;

            imageButton.innerHTML = `
                <figure>
                    <img src="https://backend.tboxlabs.com/assets/img/custom_data/spized/standard_positions/781001_6_jersey_level3_front_center_0001.png" alt="${config.displayName}">
                </figure>
                ${config.displayName}
            `;

            imageButton.addEventListener("click", function () {
                selectMeshFromButton(meshName, 'image');
            });

            imageContainer.appendChild(imageButton);
        });

        // Hide the container if no placement meshes are available
        document.getElementById("ImagePlacementsMeshes").style.display =
            Object.keys(availableMeshes).length > 0 ? 'grid' : 'none';
    }


    function clearPreviousModel() {
        // Remove the existing model
        if (model) {
            scene.remove(model);
            model = null;
        }
    }
    // Add this button to your HTML
    document.getElementById('centerDecalButton').addEventListener('click', () => {
        if (activeTextDecalIndex >= 0) {
            const decal = textDecals[activeTextDecalIndex];
            decal.offset.set(0, 0); // Center the decal
            updateMeshTextureWithAllDecals();
            console.log(`Text decal centered at position: x=${decal.offset.x.toFixed(2)}, y=${decal.offset.y.toFixed(2)}`);
        } else if (activeImageDecalIndex >= 0) {
            const decal = imageDecals[activeImageDecalIndex];
            decal.offset.set(0, 0); // Center the decal
            updateMeshTextureWithAllDecals();
            // Log the centered position
            console.log(`Image decal centered at position: x=${decal.offset.x.toFixed(2)}, y=${decal.offset.y.toFixed(2)}`);

            updateActiveImageDecalBounds();
            console.log(`Image bounds after centering:`, imageBoundingBox.current);
        }
    });

    document.querySelectorAll(".text-transform").forEach((span) => {
        span.addEventListener("click", function () {
            const transformType = this.dataset.transform;

            if (activeTextDecalIndex >= 0) {
                const activeDecal = textDecals[activeTextDecalIndex];

                applyTextTransformation(activeDecal, transformType);

                highlightActiveStyle(this); // Highlight the active style

                updateMeshTextureWithAllDecals(); // Update the mesh texture
            }
        });
    });

    function applyTextTransformation(decal, transformType) {
        switch (transformType) {
            case "capitalize":
                decal.text = decal.text.charAt(0).toUpperCase() + decal.text.slice(1);

                break;

            case "lowercase":
                decal.text = decal.text.toLowerCase();

                break;

            case "uppercase":
                decal.text = decal.text.toUpperCase();

                break;

            case "italic":
                decal.fontFamily = "Italic"; // Change to an italic font if available

                break;

            case "normal":
                decal.fontFamily = "Normal"; // Change back to normal font

                break;

            default:
                break;
        }
    }
    // Function to highlight the active style

    function highlightActiveStyle(selectedSpan) {
        document.querySelectorAll(".text-transform").forEach((span) => {
            span.classList.remove("active"); // Remove active class from all
        });

        selectedSpan.classList.add("active"); // Add active class to the selected span
    }
    // Rotation and Zoom Controls
    const rotateRightBtn = document.getElementById("rotateRight");
    const rotateLeftBtn = document.getElementById("rotateLeft");
    const zoomInBtn = document.getElementById("zoomIn");
    const zoomOutBtn = document.getElementById("zoomOut");
    // Rotation variables
    let isRotating = false;
    let rotationDirection = 0; // -1 for left, 1 for right, 0 for stop
    let rotationDamping = 0.95; // Damping factor for smooth stop

    // Zoom variables
    const zoomSpeed = 0.1; // Reduced zoom speed for smoother zoom
    const minZoom = 3; // Minimum zoom distance
    const maxZoom = 15; // Maximum zoom distance
    let targetZoom = controls.distance; // Current zoom level
    const zoomDamping = 0.1; // Damping factor for smooth zoom
    // Rotation controls
    // Rotation controls
    rotateRightBtn.addEventListener("mousedown", () => {
        isRotating = true;
        rotationDirection = -1; // Negative for right rotation (matches natural direction)
        controls.autoRotate = false;
    });

    rotateRightBtn.addEventListener("mouseup", () => {
        isRotating = false;
    });

    rotateRightBtn.addEventListener("mouseleave", () => {
        isRotating = false;
    });

    rotateLeftBtn.addEventListener("mousedown", () => {
        isRotating = true;
        rotationDirection = 1; // Positive for left rotation
        controls.autoRotate = false;
    });

    rotateLeftBtn.addEventListener("mouseup", () => {
        isRotating = false;
    });

    rotateLeftBtn.addEventListener("mouseleave", () => {
        isRotating = false;
    });

    // Zoom controls - updated implementation
    zoomInBtn.addEventListener("mousedown", () => {
        targetZoom = Math.max(controls.distance - zoomSpeed, minZoom);
    });

    zoomOutBtn.addEventListener("mousedown", () => {
        targetZoom = Math.min(controls.distance + zoomSpeed, maxZoom);
    });

    // Remove the conflicting click event listeners
    zoomInBtn.onclick = null;
    zoomOutBtn.onclick = null;
    // Zoom controls
    zoomInBtn.addEventListener("click", () => {
        if (controls.distance > minZoom) {
            controls.distance -= zoomSpeed;
            controls.update();
        }
    });

    zoomOutBtn.addEventListener("click", () => {
        if (controls.distance < maxZoom) {
            controls.distance += zoomSpeed;
            controls.update();
        }
    });

    function addInitialDecals() {
        console.log("Adding initial decals");
        // Iterate over all meshes and add decals as needed
        Object.keys(meshes).forEach((category) => {
            meshes[category].forEach((mesh) => {
                // Example: createTextDecal(mesh);
                // Ensure you have logic to add decals for each relevant mesh
            });
        });
    }
    document
        .querySelectorAll('input[name="meshActiveColor"]')
        .forEach((input) => {
            input.addEventListener("change", function () {
                selectedColorCategory = this.value;
                const newColor = document.getElementById("colorPicker").value; // Assuming you have a color picker
                updateColor(selectedColorCategory, newColor);
            });
        });

    function createGradientTexture(color1, color2) {
        const canvas = document.createElement("canvas");

        canvas.width = 512;

        canvas.height = 512;

        const ctx = canvas.getContext("2d");

        // Create gradient

        const gradient = ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height,
        );

        gradient.addColorStop(0, color1);

        gradient.addColorStop(1, color2);

        // Fill with gradient

        ctx.fillStyle = gradient;

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create texture

        const texture = new THREE.CanvasTexture(canvas);

        texture.flipY = false;

        return texture;
    }

    // Mesh mappings for Design3
    const design3Mappings = {
        Plane: "primary",
        Plane_1: "secondary",
    };
    function updateColor(category, color) {
        if (meshes[category]) {
            meshes[category].forEach((mesh) => {
                // Create a new gradient texture with the updated color

                const gradientTexture = createGradientTexture(color, color);

                mesh.material.map = gradientTexture;

                mesh.material.needsUpdate = true; // Ensure the material updates
            });
        }
    }
    // Example usage
    updateColor("secondary", "#ff00ff"); // Update secondary category color
    updateColor("tertiary", "#00ffff"); // Update tertiary category color
    // Declare a global variable to store the selected mesh name

    const radioButtons = document.querySelectorAll(
        'input[name="meshActiveColor"]',
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
        const form = document.getElementById("dynamicPatternForm");
        form.innerHTML = ""; // Clear existing content

        // Create a mapping of mesh names to display names
        const displayNames = {
            Plane: "Plane",
            Plane_1: "Plane_1",
            Plane_2: "Plane_2",
            Plane_3: "Plane_3",
            Plane_4: "Plane_4",
        };

        // Initialize selectedPatternParts with all mesh names set to false
        selectedPatternParts = {};
        meshNames.forEach((meshName) => {
            selectedPatternParts[meshName] = false;

            const displayName = displayNames[meshName] || meshName;

            const label = document.createElement("label");
            label.className = "checkbox-button part-button";
            label.dataset.part = meshName;

            label.innerHTML = `
                  <input type="checkbox" id="${meshName}">
                  <span class="checkmark"></span>
                  <span class="label-text">${displayName}</span>
              `;

            form.appendChild(label);
        });

        // Add event listeners to the new checkboxes
        document
            .querySelectorAll('#dynamicPatternForm input[type="checkbox"]')
            .forEach((checkbox) => {
                checkbox.addEventListener("change", function () {
                    const part = this.id;
                    selectedPatternParts[part] = this.checked;
                    console.log(
                        `Pattern part ${part} ${this.checked ? "selected" : "deselected"}`,
                    );

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
            gradientScale,
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
    // Initialize an array to hold selected colors
    function updateGradientColorPreview(color1, color2) {
        const firstColorBox = document.querySelector('.firstSelectColor');
        const secondColorBox = document.querySelector('.secondSelectColor');

        // Ensure colors have # prefix
        const formattedColor1 = color1.startsWith('#') ? color1 : `#${color1}`;
        const formattedColor2 = color2.startsWith('#') ? color2 : `#${color2}`;

        firstColorBox.style.backgroundColor = formattedColor1;
        secondColorBox.style.backgroundColor = formattedColor2;
    }

    document.querySelectorAll(".designsItems img").forEach((img) => {
        img.addEventListener("click", function () {
            // Remove active class from all design items
            document.querySelectorAll(".designsItems").forEach(item => {
                item.classList.remove("active");
            });

            // Add active class to clicked item
            this.closest('.designsItems').classList.add("active");

            const design = this.dataset.design;
            const colormappingsRaw = this.dataset.colorMappings || "{}";
            let colormappings = {};

            try {
                colormappings = JSON.parse(colormappingsRaw);
            } catch (error) {
                console.error("Error parsing colormappings:", colormappingsRaw, error);
            }

            const modal = this.dataset.modal || "";
            console.log("Color mappings:", colormappings);

            // Only load the new model if a modal URL is provided
            if (modal) {
                if (design === "Design1") {
                    loadModel(modal, design1Mappings, design);
                } else if (design === "Design2") {
                    loadModel(modal, design2Mappings, design);
                } else {
                    loadModel(modal, design3Mappings, design);
                }
            } else {
                console.log("No model URL provided, keeping current model");
            }
        });
    });
    //

    // Create OrbitControls for camera interaction
    controls.enableDamping = true; // Add smooth damping (inertia)
    controls.dampingFactor = 0.04; // Damping inertia factor (lower = more smooth)
    controls.rotateSpeed = 0.6; // Rotation speed (default is 1)
    controls.enablePan = true; // Disable panning if you only want rotation
    // Limit zoom
    controls.minDistance = 4; // Minimum zoom distance
    controls.maxDistance = 6; // Maximum zoom distance
    controls.maxPolarAngle = Math.PI * 0.9; // Limit vertical rotation (prevent flipping)
    let currentFontSize = 28; // Default font size

    // Get the buttons for resizing the font
    const minusButton = document.querySelector(".TextDecalSizeMinus");
    const plusButton = document.querySelector(".TextDecalSizePlus");

    // Event listener for decreasing the font size
    minusButton.addEventListener("click", () => {
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
        original: null, // Stores the original bounds (relative to texture center)
        current: null, // Stores the current bounds (with offset applied)
    };
    // Event listener for increasing the font size
    plusButton.addEventListener("click", () => {
        if (activeTextDecalIndex >= 0) {
            currentFontSize += 10;
            textDecals[activeTextDecalIndex].fontSize = currentFontSize;
            updateMeshTextureWithAllDecals(); // Changed from updateMeshTextureWithAllTexts()
            updateActiveDecalBounds();
        }
    });
    // Function to create a texture from the input text
    function createTextTexture(
        text,
        color = selectedTextColor,
        fontFamily = "Arial",
        isSelected = false,
    ) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 512;
        canvas.height = 512;

        // Clear canvas with transparent background
        context.fillStyle = "rgba(0, 0, 0, 0)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Set text style - ensure color is properly formatted
        context.font = `${currentFontSize}px ${fontFamily}`;
        context.fillStyle = color.startsWith('#') ? color : `#${color}`; // Ensure proper color format
        context.textAlign = "center";
        context.textBaseline = "middle";

        // Measure text
        const textWidth = context.measureText(text).width;
        const textHeight = currentFontSize;

        // Draw text at center
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        // Draw border only if selected
        if (isSelected) {
            context.strokeStyle = "red";
            context.lineWidth = 1;
            context.setLineDash([5, 3]);
            context.strokeRect(
                canvas.width / 2 - textWidth / 2 - 10,
                canvas.height / 2 - textHeight / 2 - 5,
                textWidth + 20,
                textHeight + 10,
            );
        }

        // Create texture
        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = false;
        texture.center.set(0.5, 0.5);

        return { texture };
    }

    // Get the resize slider and value display
    const resizeImgSlider = document.getElementById("resizeImgSlider");
    const resizeValueSpan = document.getElementById("resizeValue");

    // Event listener for image resizing
    resizeImgSlider.addEventListener("input", (event) => {
        const scaleValue = event.target.value / 50; // Convert 10-200 range to 0.2-4.0 scale
        resizeValueSpan.textContent = `${event.target.value}%`;

        if (activeImageDecalIndex >= 0) {
            imageDecals[activeImageDecalIndex].scale = scaleValue;
            console.log(
                `Resizing image ${activeImageDecalIndex} to scale ${scaleValue.toFixed(2)}`,
            );
            updateMeshTextureWithAllDecals();
        }
    });

    async function createImageTexture(imageFile, isSelected = false) {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 512;
            const context = canvas.getContext("2d");

            // Fill with white background
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);

            const img = new Image();
            img.onload = function () {
                // Calculate dimensions (same as before)
                let width = img.width;
                let height = img.height;
                const maxDimension = 40;

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
                    context.strokeStyle = "blue";
                    context.lineWidth = 1;
                    context.setLineDash([5, 3]);
                    context.strokeRect(x - 5, y - 5, width + 10, height + 10);
                }

                // Create texture
                const texture = new THREE.CanvasTexture(canvas);
                texture.flipY = false;
                texture.center.set(0.5, 0.5);

                resolve({
                    texture,
                    bounds: {
                        x: x / canvas.width,
                        y: y / canvas.height,
                        width: width / canvas.width,
                        height: height / canvas.height,
                        originalWidth: width,
                        originalHeight: height,
                    },
                    originalImage: img,
                });
            };
            img.src = URL.createObjectURL(imageFile);
        });
    }

    const patternScaleSlider = document.getElementById("patternScale");
    const opacitySlider = document.getElementById("Opacity");
    let currentPatternScale = 1.0; // Default scale (100%)

    // Event listener for pattern scale
    patternScaleSlider.addEventListener("input", (event) => {
        const scaleValue = event.target.value;
        patternScaleValueSpan.textContent = `${scaleValue}%`;
        currentPatternScale = scaleValue / 100; // Convert 10-200 to 0.1-2.0 scale

        // Update all pattern decals with the new scale
        updateAllPatternDecalsScale();
    });
    function updateAllPatternDecalsScale() {
        // Update scale for all pattern decals
        patternDecals.forEach((decal) => {
            if (decal.isFullCoverage) {
                decal.scale = currentPatternScale;
            }
        });

        // Update the textures
        updateAllMeshTextures();
    }

    // Get the elements
    const fileInput = document.getElementById("fileInput");
    const uploadedImagePreview = document.getElementById("uploadedImagePreview");

    // Trigger file input when button is clicked
    fileInput.addEventListener("click", () => {
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            pendingImageFile = file;
            // Show preview
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedImagePreview.src = e.target.result;
                uploadedImagePreview.style.display = "block";

                // Hide first screen, show second screen
                document.querySelector('.logoFirstScreen').style.display = 'none';
                document.querySelector('.logoSecondScreen').style.display = 'block';
                document.querySelector('.logoSecondScreen .uploadLogoForm').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    // Get the preview border element
    const imagePreviewBorder = document.getElementById("imagePreviewBorder");

    // Function to update the image preview with selection border
    function updateImagePreview() {
        if (
            activeImageDecalIndex >= 0 &&
            activeImageDecalIndex < imageDecals.length
        ) {
            const activeDecal = imageDecals[activeImageDecalIndex];

            // Show the preview image if it exists
            if (activeDecal.image) {
                uploadedImagePreview.src = activeDecal.image.src;
                uploadedImagePreview.style.display = "block";
                imagePreviewBorder.style.display = "block";

                // Apply any transformations (scale, rotation) to the preview
                // You can add more styling here to match the decal's properties
                uploadedImagePreview;
            }
        } else {
            // Hide the border when no image is selected
            imagePreviewBorder.style.display = "none";
        }
    }

    let currentModelType = null
    // Add this near your other model configurations
    const modelMeshConfigs = {
        // For halfSleeves models (can have different configurations)
        halfSleeves: {
            'Modal2FullSleeves.glb': {
                placementMeshes: {
                    Plane: { displayName: "Front", image: "front.png" },
                    Plane_1: { displayName: "Back", image: "back.png" },
                    Plane_4: { displayName: "Left Sleeve", image: "sleeve.png" },
                    Plane_5: { displayName: "Right Sleeve", image: "sleeve.png" }
                }
            },
            'abcdef.glb': {
                placementMeshes: {
                    Plane_2: { displayName: "Front", image: "front.png" },
                    Plane_3: { displayName: "Back", image: "back.png" },
                    Plane_6: { displayName: "Left Sleeve", image: "back.png" },
                    Plane_7: { displayName: "Right Sleeve", image: "back.png" }
                }
            },
            'vikesh.glb': {
                placementMeshes: {
                    Front: { displayName: "Front", image: "front.png" },
                    Back: { displayName: "Back", image: "back.png" },
                    Left_Arm: { displayName: "Left_Arm", image: "sleeve.png" },
                    Right_Arm: { displayName: "Right_Arm", image: "sleeve.png" }
                }
            },
            'yshirt.glb': {
                placementMeshes: {
                    Plane: { displayName: "Front", image: "front.png" },
                    Plane_1: { displayName: "Back", image: "back.png" },
                    Plane_2: { displayName: "Sleeves", image: "sleeve.png" }
                }
            },
            'colorshirt.glb': {
                placementMeshes: {
                    Plane: { displayName: "Main", image: "front.png" }
                }
            }
        },
        // For fullSleeves models
        fullSleeves: {
            'rhBasketball-Slam-Dunk.glb': {
                placementMeshes: {
                    Plane_1: { displayName: "Front", image: "front.png" },
                    Plane_2: { displayName: "Back", image: "back.png" },
                    Plane_3: { displayName: "Left Sleeve", image: "sleeve.png" },
                    Plane_3: { displayName: "Right Sleeve", image: "sleeve.png" }
                }
            }
        },
        // For Design3 models
        Design3: {
            'Modal3.glb': {
                placementMeshes: {
                    Plane: { displayName: "Front", image: "front.png" },
                    Plane_1: { displayName: "Back", image: "back.png" }
                }
            },
            'Basketball-Slam-Dunk.glb': {
                placementMeshes: {
                    Plane: { displayName: "Main", image: "front.png" }
                }
            }
        },
        // For HockeyDesign1 models
        HockeyDesign1: {
            'HockeyShirt2.glb': {
                placementMeshes: {
                    Plane: { displayName: "Front", image: "front.png" },
                    Plane_1: { displayName: "Back", image: "back.png" }
                }
            },
            'colorshirt.glb': {
                placementMeshes: {
                    Plane: { displayName: "Main", image: "front.png" }
                }
            }
        }
    };

    async function applyImageToSelectedMesh(imageFile, uv) {
        if (!imageFile || !selectedMesh) return;

        try {
            const { texture, bounds, originalImage } = await createImageTexture(imageFile);

            // Calculate offset from center (0.5, 0.5)
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
                isLocked: false,
            };

            imageDecals.push(newDecal);
            updateMeshTextureWithAllDecals();

            // Set as active decal
            activeImageDecalIndex = imageDecals.length - 1;
            activeTextDecalIndex = -1;
            updateImagePreview();

            // Reset sliders
            resizeImgSlider.value = 50;
            resizeValueSpan.textContent = "50%";
            rotateImgSlider.value = 0;
            rotateImgValueSpan.textContent = "0°";

            // Hide third screen, show fourth screen
            document.querySelector('.logoThirdScreen').style.display = 'none';
            document.querySelector('.logoSecondScreen .uploadLogoForm').style.display = 'none';
            document.querySelector('.logoFourthScreen').style.display = 'block';
            document.querySelector('.logoSecondScreen').style.display = 'block';

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
        collar: false,
    };
    // Add these new variables at the top
    let patternPreviewTimeout = null;
    let currentPatternPreview = null;
    let currentPatternOpacity = 1.0; // Default opacity (100%)

    // Modify the pattern selection event listeners
    document.querySelectorAll(".patternsItems").forEach((item) => {
        item.addEventListener("click", function () {
            // Remove active class from all pattern items
            document.querySelectorAll(".patternsItems").forEach((i) => {
                i.classList.remove("active");
            });

            // Add active class to clicked item
            this.classList.add("active");

            // Store the selected pattern image path
            selectedPatternImage = this.dataset.image;
            console.log("Selected pattern:", selectedPatternImage);

            // Show preview of the selected pattern
            showPatternPreview();
        });
    });
    // Event listener for pattern opacity
    opacitySlider.addEventListener("input", (event) => {
        const opacityValue = event.target.value;
        opacityValueSpan.textContent = `${opacityValue}%`;
        currentPatternOpacity = opacityValue / 100; // Convert 0-100 to 0.0-1.0

        // Update all pattern decals with the new opacity
        updateAllPatternDecalsOpacity();
    });

    function updateAllPatternDecalsOpacity() {
        // Update opacity for all pattern decals
        patternDecals.forEach((decal) => {
            decal.opacity = currentPatternOpacity;
        });

        // Update the textures for all affected meshes
        const affectedMeshes = new Set();
        patternDecals.forEach((decal) => affectedMeshes.add(decal.mesh));

        affectedMeshes.forEach((mesh) => {
            if (mesh) {
                updateMeshTextureForMesh(mesh);
            }
        });
    }
    // Update text button
    document
        .getElementById("updateTextButton")
        .addEventListener("click", updateActiveTextDecal);
    function updateActiveTextDecal() {
        // Check if there's an active text decal selected
        if (activeTextDecalIndex < 0 || activeTextDecalIndex >= textDecals.length) {
            console.log("No active text decal to update");
            return;
        }

        // Get the new text from the input field
        const newText = document.getElementById("textInput").value.trim();
        if (!newText) {
            console.log("No text entered");
            return;
        }

        // Update the active text decal
        textDecals[activeTextDecalIndex].text = newText;

        // Update the display text
        document.querySelector(".decalText").textContent = newText;

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
            patternDecals = patternDecals.filter((d) => !d.isPreview);
            updateAllMeshTextures();
            currentPatternPreview = null;
        }

        // Only show preview if we have a selected pattern and at least one part selected
        const selectedParts = Object.keys(selectedPatternParts).filter(
            (part) => selectedPatternParts[part],
        );
        if (!selectedPatternImage || selectedParts.length === 0) return;

        // Add preview after a small delay (to avoid flickering during rapid selection)
        patternPreviewTimeout = setTimeout(() => {
            applyPatternPreview(selectedParts);
        }, 300);
    }


    // Define target angles for each view
    const VIEW_ANGLES = {
        front: 0,
        back: Math.PI,
        left: Math.PI / 2,
        right: -Math.PI / 2
    };

    // Smooth rotation variables
    let targetRotationY = 0;
    let currentRotationY = 0;
    // Add event listeners for angle buttons
    const cameraPositions = {
        front: { x: 0, y: 1, z: 5, angle: 0 },
        back: { x: 0, y: 1, z: -5, angle: Math.PI },
        left: { x: -5, y: 1, z: 0, angle: Math.PI / 2 },
        right: { x: 5, y: 1, z: 0, angle: -Math.PI / 2 }
    };
    // Add event listeners for view angle buttons
    document.querySelectorAll('.view-angle-controls button').forEach(button => {
        button.addEventListener('click', function () {
            const view = this.classList[0]; // Get the class name (e.g., 'frontAngle')
            const position = cameraPositions[view.replace('Angle', '')]; // Get the corresponding camera position
            if (position) {
                // Set camera position
                camera.position.set(position.x, position.y, position.z);
                camera.lookAt(0, 0, 0); // Look at the center of the scene
                controls.update(); // Update controls to reflect the new camera 
                // Re-enable after a short delay (when animation is likely complete)
                setTimeout(() => {
                    controls.enabled = true;
                }, 1000);
            }
        });
    });


    function updateAllMeshTextures() {
        // Get all unique meshes that have decals
        const allMeshes = new Set();
        textDecals.forEach((d) => allMeshes.add(d.mesh));
        imageDecals.forEach((d) => allMeshes.add(d.mesh));
        patternDecals.forEach((d) => allMeshes.add(d.mesh));

        // Update each mesh
        allMeshes.forEach((mesh) => {
            if (mesh) {
                updateMeshTextureForMesh(mesh);
            }
        });
    }


    function populateMeshButtons(meshNames) {
        const textContainer = document.getElementById("dynamicMeshButtons");
        const imageContainer = document.getElementById("dynamicImageMeshButtons");

        // Clear existing buttons
        textContainer.innerHTML = "";
        imageContainer.innerHTML = "";

        if (!currentModelType || !currentModelFilename || !modelMeshConfigs[currentModelType]) {
            console.warn("No mesh configuration found for model:", currentModelType, currentModelFilename);
            return;
        }

        // Get the specific configuration for this model
        const modelConfig = modelMeshConfigs[currentModelType][currentModelFilename];
        if (!modelConfig) {
            console.warn("No specific configuration found for model:", currentModelFilename);
            return;
        }

        const meshConfig = modelConfig.placementMeshes;

        // Check which meshes actually exist in the model
        const availableMeshes = {};
        Object.keys(meshConfig).forEach(meshName => {
            if (model.getObjectByName(meshName)) {
                availableMeshes[meshName] = meshConfig[meshName];
            }
        });

        // Create buttons for text placement
        Object.entries(availableMeshes).forEach(([meshName, config]) => {
            const textButton = document.createElement("button");
            textButton.className = `${meshName} meshSide meshSideBtn`;
            textButton.id = `${meshName}TextButton`;
            textButton.dataset.mesh = meshName;

            textButton.innerHTML = `
                <figure>
                  <img src="https://backend.tboxlabs.com/assets/img/custom_data/spized/standard_positions/781001_6_jersey_level3_front_center_0001.png" alt="">
                </figure>
                ${config.displayName}
            `;

            textButton.addEventListener("click", function () {
                selectMeshFromButton(meshName, 'text');
                document.getElementById('screen2').style.display = 'none';
                document.getElementById('screen3').style.display = 'block';
            });

            textContainer.appendChild(textButton);
        });

        // Create buttons for image placement (same meshes but different container)
        Object.entries(availableMeshes).forEach(([meshName, config]) => {
            const imageButton = document.createElement("button");
            imageButton.className = `${meshName} meshSide imageMeshBtn`;
            imageButton.id = `${meshName}ImageButton`;
            imageButton.dataset.mesh = meshName;

            imageButton.innerHTML = `
                <figure>
                    <img src="https://backend.tboxlabs.com/assets/img/custom_data/spized/standard_positions/781001_6_jersey_level3_front_center_0001.png" alt="">
                </figure>
                ${config.displayName}
            `;

            imageButton.addEventListener("click", function () {
                selectMeshFromButton(meshName, 'image');
            });

            imageContainer.appendChild(imageButton);
        });
    }

    function populateGradientForm(meshNames) {
        const gradientContainer = document.querySelector(
            ".gradeientMEsh .gradientFaces",
        );
        gradientContainer.innerHTML = ""; // Clear existing content

        // Create a mapping of mesh names to display names
        const displayNames = {
            Plane: "Front",
            Plane_1: "Right Sleeve",
            Plane_2: "Left Sleeve",
            Plane_3: "Back",
            Plane_4: "Collar",
        };

        meshNames.forEach((meshName) => {
            const displayName = displayNames[meshName] || meshName;

            const label = document.createElement("label");
            label.className = "colorsMeshItems part-button";
            label.dataset.part = meshName;

            label.innerHTML = `
                  <input type="radio" name="gradientMesh" value="${meshName}">
                  <div class="meshActiveColor" id="gradientPreview-${meshName}"></div>
                  <h6 class="meshActiveFaceName">${displayName}</h6>
              `;

            gradientContainer.appendChild(label);
        });

        // Add event listeners to gradient mesh selection
        document.querySelectorAll('input[name="gradientMesh"]').forEach((radio) => {
            radio.addEventListener("change", function () {
                applyGradientToSelectedMesh();
            });
        });
    }

    // Add this to your DOMContentLoaded event listener
    // Replace your existing gradient color checkbox code with this:
    document.querySelectorAll('.gradient-palette input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            // Get all checked boxes
            const checkedBoxes = Array.from(
                document.querySelectorAll('.gradient-palette input[type="checkbox"]:checked'),
            );

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

            // Update the color preview boxes
            updateGradientColorPreview(gradientColor1 || '#ffffff', gradientColor2 || '#ffffff');

            applyGradientToSelectedMesh();
        });
    });
    function applyGradientToSelectedMesh() {
        const selectedMeshName = document.querySelector(
            'input[name="gradientMesh"]:checked',
        )?.value;
        if (!selectedMeshName || !gradientColor1 || !gradientColor2) return;

        const mesh = model.getObjectByName(selectedMeshName);
        if (!mesh) return;

        // Create gradient texture
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        // Store gradient info on the mesh

        mesh.userData.gradient = {
            color1: gradientColor1,
            color2: gradientColor2,
            angle: gradientAngle,
            scale: gradientScale,
        };
        // Create gradient
        const angleRad = THREE.MathUtils.degToRad(gradientAngle);
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const length =
            Math.sqrt(centerX * centerX + centerY * centerY) * gradientScale;

        const gradient = ctx.createLinearGradient(
            centerX - cos * length,
            centerY - sin * length,
            centerX + cos * length,
            centerY + sin * length,
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
            scale: gradientScale,
        };
        updateMeshTextureForMesh(mesh);
        // Update preview
        document.getElementById(
            `gradientPreview-${selectedMeshName}`,
        ).style.background =
            `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`;
        // Update the mesh texture to include both gradient and any existing patterns
    }

    // Add double-click event listener for decal selection
    // In the double-click event listener for decal selection:
    document.addEventListener('dblclick', (event) => {
        if (isTextMoving || isImageMoving) return;

        const mouse = getNormalizedMousePosition(event);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(model.children, true);

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const uv = intersects[0].uv;

            // First check image decals
            for (let i = imageDecals.length - 1; i >= 0; i--) {
                const decal = imageDecals[i];
                if (decal.mesh !== clickedMesh) continue;

                const bounds = {
                    x: 0.5 + decal.offset.x - (decal.bounds.width * decal.scale) / 2,
                    y: 0.5 + decal.offset.y - (decal.bounds.height * decal.scale) / 2,
                    width: decal.bounds.width * decal.scale,
                    height: decal.bounds.height * decal.scale
                };

                if (uv.x >= bounds.x && uv.x <= bounds.x + bounds.width &&
                    uv.y >= bounds.y && uv.y <= bounds.y + bounds.height) {
                    // Toggle selection
                    if (activeImageDecalIndex === i) {
                        activeImageDecalIndex = -1;
                        // Hide image screens when deselecting
                        document.querySelector('.logoSecondScreen').style.display = 'none';
                        document.querySelector('.logoFourthScreen').style.display = 'none';
                        document.querySelector('.logoFirstScreen').style.display = 'block';
                    } else {
                        activeImageDecalIndex = i;
                        activeTextDecalIndex = -1;
                        // Show image editing screens when selecting
                        document.querySelector('.logoFirstScreen').style.display = 'none';
                        document.querySelector('.logoSecondScreen').style.display = 'block';
                        document.querySelector('.logoFourthScreen').style.display = 'block';
                    }
                    updateMeshTextureWithAllDecals();
                    updateImagePreview();
                    return;
                }
            }

            // Then check text decals (existing code remains the same)
            for (let i = textDecals.length - 1; i >= 0; i--) {
                const decal = textDecals[i];
                if (decal.mesh !== clickedMesh) continue;

                const tempCanvas = document.createElement('canvas');
                const tempContext = tempCanvas.getContext('2d');
                tempContext.font = `${decal.fontSize}px ${decal.fontFamily}`;
                const textWidth = tempContext.measureText(decal.text).width;
                const textHeight = decal.fontSize;

                const bounds = {
                    x: 0.5 + decal.offset.x - textWidth / 512 / 2,
                    y: 0.5 + decal.offset.y - textHeight / 512 / 2,
                    width: textWidth / 512,
                    height: textHeight / 512
                };

                if (uv.x >= bounds.x && uv.x <= bounds.x + bounds.width &&
                    uv.y >= bounds.y && uv.y <= bounds.y + bounds.height) {
                    // Toggle selection
                    if (activeTextDecalIndex === i) {
                        activeTextDecalIndex = -1;
                        document.getElementById('screen3').style.display = 'none';
                        document.getElementById('screen1').style.display = 'block';
                    } else {
                        activeTextDecalIndex = i;
                        activeImageDecalIndex = -1;
                        // Hide image screens when selecting text
                        document.querySelector('.logoSecondScreen').style.display = 'none';
                        document.querySelector('.logoFourthScreen').style.display = 'none';
                        showTextEditingScreen();
                    }
                    updateMeshTextureWithAllDecals();
                    return;
                }
            }

            // If clicked on mesh but not on any decal, deselect all
            activeTextDecalIndex = -1;
            activeImageDecalIndex = -1;
            // Show first screen when clicking on empty area
            document.getElementById('screen1').style.display = 'block';
            document.getElementById('screen3').style.display = 'none';
            document.querySelector('.logoSecondScreen').style.display = 'none';
            document.querySelector('.logoFourthScreen').style.display = 'none';
            updateMeshTextureWithAllDecals();
        }
    });
    // Add these to your DOMContentLoaded event listener
    document
        .getElementById("gradientAngle")
        .addEventListener("input", function (e) {
            gradientAngle = parseInt(e.target.value);
            document.getElementById("gradientAngleValue").textContent =
                gradientAngle + "°";
            applyGradientToSelectedMesh();
        });

    document
        .getElementById("gradientScale")
        .addEventListener("input", function (e) {
            gradientScale = parseFloat(e.target.value);
            document.getElementById("gradientScaleValue").textContent =
                gradientScale.toFixed(1);
            applyGradientToSelectedMesh();
        });

    // Add these at the bottom of your code with other event listeners
    document
        .getElementById("lockDecalButton")
        .addEventListener("click", lockActiveDecal);
    document
        .getElementById("unlockDecalButton")
        .addEventListener("click", unlockActiveDecal);

    function lockActiveDecal() {
        if (activeTextDecalIndex >= 0) {
            textDecals[activeTextDecalIndex].isLocked = true;
            console.log(`Locked text decal ${activeTextDecalIndex}`);
            updateMeshTextureWithAllDecals();
        } else if (activeImageDecalIndex >= 0) {
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
        } else if (activeImageDecalIndex >= 0) {
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
            patternDecals = patternDecals.filter((d) => !d.isPreview);
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
                selectedParts.forEach((part) => {
                    const mesh = model.getObjectByName(part);
                    if (!mesh) {
                        console.warn(`Mesh not found: ${part}`);
                        return;
                    }

                    // Create canvas with pattern
                    const canvas = document.createElement("canvas");
                    canvas.width = 512;
                    canvas.height = 512;
                    const ctx = canvas.getContext("2d");

                    const pattern = ctx.createPattern(img, "repeat");
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
                            originalHeight: canvas.height,
                        },
                        isFullCoverage: true,
                        isPreview: true,
                        opacity: currentPatternOpacity,
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
    document
        .querySelectorAll('.patternArea input[type="checkbox"]')
        .forEach((checkbox) => {
            checkbox.addEventListener("change", function () {
                const part = this.id;
                selectedPatternParts[part] = this.checked;
                console.log(
                    `Pattern part ${part} ${this.checked ? "selected" : "deselected"}`,
                );

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

        const selectedParts = Object.keys(selectedPatternParts).filter(
            (part) => selectedPatternParts[part],
        );
        if (selectedParts.length === 0) {
            alert("Please select at least one part");
            return;
        }

        // First remove any existing patterns from these parts
        selectedParts.forEach((part) => {
            removePatternFromPart(part);
        });

        // Remove any preview
        if (currentPatternPreview) {
            patternDecals = patternDecals.filter((d) => !d.isPreview);
            currentPatternPreview = null;
        }

        // Load the pattern image
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = function () {
            selectedParts.forEach((part) => {
                const mesh = model.getObjectByName(part);
                if (!mesh) {
                    console.warn(`Mesh not found: ${part}`);
                    return;
                }

                // Create canvas with pattern
                const canvas = document.createElement("canvas");
                canvas.width = 512;
                canvas.height = 512;
                const ctx = canvas.getContext("2d");

                const pattern = ctx.createPattern(img, "repeat");
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
                        x: 0,
                        y: 0,
                        width: 1,
                        height: 1,
                        originalWidth: 512,
                        originalHeight: 512,
                    },
                    isFullCoverage: true,
                    opacity: currentPatternOpacity,
                };

                patternDecals.push(newDecal);
            });

            updateAllMeshTextures();
            console.log(`Applied pattern to ${selectedParts.join(", ")}`);
            selectedParts.forEach((part) => {
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
        patternDecals = patternDecals.filter((decal) => decal.mesh !== mesh);

        // Update the texture
        updateMeshTextureForMesh(mesh);

        console.log(`Removed pattern from ${part}`);
    }
    // Add this helper function to update texture for a specific mesh
    function updateMeshTextureForMesh(mesh) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
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
            const length =
                Math.sqrt(centerX * centerX + centerY * centerY) * gradient.scale;

            const canvasGradient = context.createLinearGradient(
                centerX - cos * length,
                centerY - sin * length,
                centerX + cos * length,
                centerY + sin * length,
            );

            canvasGradient.addColorStop(0, gradient.color1);
            canvasGradient.addColorStop(1, gradient.color2);

            context.fillStyle = canvasGradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 3. Draw patterns (with transparency)
        const meshPatternDecals = patternDecals.filter(
            (decal) => decal.mesh === mesh,
        );
        meshPatternDecals.forEach((decal) => {
            context.save();
            if (decal.isFullCoverage) {
                const pattern = context.createPattern(decal.image, "repeat");
                context.globalAlpha = decal.opacity;
                context.fillStyle = pattern;

                // Apply pattern scaling
                const patternScale = 1 / decal.scale;
                const patternTransform = new DOMMatrix();
                patternTransform.scaleSelf(patternScale, patternScale);

                if (typeof pattern.setTransform === "function") {
                    pattern.setTransform(patternTransform);
                }

                context.fillRect(0, 0, canvas.width, canvas.height);
                context.globalAlpha = 1.0;
            }
            context.restore();
        });

        // 4. Draw images
        const meshImageDecals = imageDecals.filter((decal) => decal.mesh === mesh);
        meshImageDecals.forEach((decal) => {
            context.save();
            const isSelected =
                activeImageDecalIndex >= 0 &&
                imageDecals[activeImageDecalIndex].uuid === decal.uuid;

            const centerX = canvas.width / 2 + decal.offset.x * canvas.width;
            const centerY = canvas.height / 2 + decal.offset.y * canvas.height;

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
                context.strokeStyle = "blue";
                context.lineWidth = 1;
                context.setLineDash([5, 3]);
                context.strokeRect(x - 5, y - 5, width + 10, height + 10);
                context.restore();
            }
            context.restore();
        });

        // 5. Draw texts
        const meshTextDecals = textDecals.filter((decal) => decal.mesh === mesh);
        // Inside the text decal rendering section:
        meshTextDecals.forEach((decal) => {
            context.save();
            const isSelected = activeTextDecalIndex >= 0 &&
                textDecals[activeTextDecalIndex].uuid === decal.uuid;

            const centerX = canvas.width / 2 + decal.offset.x * canvas.width;
            const centerY = canvas.height / 2 + decal.offset.y * canvas.height;

            context.translate(centerX, centerY);
            context.rotate(decal.rotation);
            context.translate(-centerX, -centerY);

            // Set font
            context.font = `${decal.fontSize}px ${decal.fontFamily}`;
            context.textAlign = "center";
            context.textBaseline = "middle";

            // Draw outline if enabled
            if (decal.hasOutline && decal.outlineWidth > 0) {
                context.strokeStyle = decal.outlineColor;
                context.lineWidth = decal.outlineWidth;
                context.lineJoin = "round";
                context.miterLimit = 2;
                context.strokeText(decal.text, centerX, centerY);
            }

            // Draw main text
            context.fillStyle = decal.color;
            context.fillText(decal.text, centerX, centerY);

            // Draw selection border if selected
            if (isSelected) {
                context.save();
                context.globalAlpha = 1.0;
                const textWidth = context.measureText(decal.text).width;
                const textHeight = decal.fontSize;

                context.strokeStyle = "red";
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
    document
        .getElementById("applyPatternButton")
        .addEventListener("click", applyPatternToSelectedParts);

    function updateMeshTextureWithAllDecals() {
        if (!selectedMesh) return;

        // Create a new canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 512;
        canvas.height = 512;

        // 1. First draw the gradient if it exists
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
        } else {
            // Default white background if no gradient
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 2. Draw patterns (with their current opacity)
        const meshPatternDecals = patternDecals.filter((decal) => decal.mesh === selectedMesh);
        meshPatternDecals.forEach((decal) => {
            context.save();
            if (decal.isFullCoverage) {
                const pattern = context.createPattern(decal.image, "repeat");
                context.globalAlpha = decal.opacity;
                context.fillStyle = pattern;

                // Apply pattern scaling
                const patternScale = 1 / decal.scale;
                const patternTransform = new DOMMatrix();
                patternTransform.scaleSelf(patternScale, patternScale);

                if (typeof pattern.setTransform === "function") {
                    pattern.setTransform(patternTransform);
                }

                context.fillRect(0, 0, canvas.width, canvas.height);
                context.globalAlpha = 1.0;
            }
            context.restore();
        });

        // 3. Draw images
        const meshImageDecals = imageDecals.filter((decal) => decal.mesh === selectedMesh);
        meshImageDecals.forEach((decal) => {
            context.save();
            const isSelected = activeImageDecalIndex >= 0 &&
                imageDecals[activeImageDecalIndex].uuid === decal.uuid;

            const centerX = canvas.width / 2 + decal.offset.x * canvas.width;
            const centerY = canvas.height / 2 + decal.offset.y * canvas.height;

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
                context.strokeStyle = "blue";
                context.lineWidth = 1;
                context.setLineDash([5, 3]);
                context.strokeRect(x - 5, y - 5, width + 10, height + 10);
                context.restore();
            }
            context.restore();
        });

        // 4. Draw texts
        // Inside updateMeshTextureWithAllDecals(), in the text drawing section:
        const meshTextDecals = textDecals.filter((decal) => decal.mesh === selectedMesh);
        meshTextDecals.forEach((decal) => {
            context.save();
            const isSelected = activeTextDecalIndex >= 0 &&
                textDecals[activeTextDecalIndex].uuid === decal.uuid;

            const centerX = canvas.width / 2 + decal.offset.x * canvas.width;
            const centerY = canvas.height / 2 + decal.offset.y * canvas.height;

            context.translate(centerX, centerY);
            context.rotate(decal.rotation);
            context.translate(-centerX, -centerY);

            // Set font
            context.font = `${decal.fontSize}px ${decal.fontFamily}`;
            context.textAlign = "center";
            context.textBaseline = "middle";

            // Draw outline if enabled
            if (decal.hasOutline && decal.outlineWidth > 0) {
                context.strokeStyle = decal.outlineColor;
                context.lineWidth = decal.outlineWidth;
                context.lineJoin = "round";
                context.miterLimit = 2;

                // Draw outline by stroking the text
                context.strokeText(decal.text, centerX, centerY);
            }

            // Draw main text
            context.fillStyle = decal.color;
            context.fillText(decal.text, centerX, centerY);

            // Draw selection border if selected
            if (isSelected) {
                context.save();
                context.globalAlpha = 1.0;
                const textWidth = context.measureText(decal.text).width;
                const textHeight = decal.fontSize;

                context.strokeStyle = "red";
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

        selectedMesh.material.map = texture;
        selectedMesh.material.needsUpdate = true;
    }

    // Outline width controls
    // Outline width controls
    document.querySelector('.outline-minus').addEventListener('click', () => {
        if (activeTextDecalIndex >= 0) {
            const decal = textDecals[activeTextDecalIndex];
            decal.outlineWidth = Math.max(0, decal.outlineWidth - 1);
            document.getElementById('outlineWidthValue').textContent = `${decal.outlineWidth}px`;
            updateMeshTextureWithAllDecals();
        }
    });

    document.querySelector('.outline-plus').addEventListener('click', () => {
        if (activeTextDecalIndex >= 0) {
            const decal = textDecals[activeTextDecalIndex];
            decal.outlineWidth = Math.min(10, decal.outlineWidth + 1);
            document.getElementById('outlineWidthValue').textContent = `${decal.outlineWidth}px`;
            updateMeshTextureWithAllDecals();
        }
    });

    // Outline color palette
    document.querySelectorAll('.outlineColor .palette').forEach(palette => {
        palette.addEventListener('click', (e) => {
            if (activeTextDecalIndex >= 0) {
                const decal = textDecals[activeTextDecalIndex];
                decal.outlineColor = e.target.dataset.color;
                decal.hasOutline = true; // Enable outline when color is selected
                updateMeshTextureWithAllDecals();
            }
        });
    });

    // Toggle outline button
    document.getElementById('toggleOutlineButton').addEventListener('click', () => {
        if (activeTextDecalIndex >= 0) {
            const decal = textDecals[activeTextDecalIndex];
            decal.hasOutline = !decal.hasOutline;
            updateMeshTextureWithAllDecals();
        }
    });

    // Get the rotation slider and value display
    const rotateImgSlider = document.getElementById("rotateImgSlider");
    const rotateImgValueSpan = document.getElementById("rotateImgValue");

    // Event listener for image rotation
    rotateImgSlider.addEventListener("input", (event) => {
        const rotationValue = event.target.value;
        rotateImgValueSpan.textContent = `${rotationValue}°`;

        if (activeImageDecalIndex >= 0) {
            imageDecals[activeImageDecalIndex].rotation =
                THREE.MathUtils.degToRad(rotationValue);
            console.log(
                `Rotating image ${activeImageDecalIndex} to ${rotationValue}°`,
            );
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
            height: scaledHeight / canvasHeight,
        };

        // Current bounds with offset - corrected calculation
        imageBoundingBox.current = {
            x: centerX - imageBoundingBox.original.width / 2,
            y: centerY - imageBoundingBox.original.height / 2,
            width: imageBoundingBox.original.width,
            height: imageBoundingBox.original.height,
        };

        console.log(
            `Active image bounds: x=${imageBoundingBox.current.x.toFixed(2)}, y=${imageBoundingBox.current.y.toFixed(2)}, w=${imageBoundingBox.current.width.toFixed(2)}, h=${imageBoundingBox.current.height.toFixed(2)}`,
        );
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
    document.addEventListener("click", selectMeshUnderMouse);
    // Function to apply text texture to selected mesh
    let textTextures = [];
    let selectedTextColor = "#000000"; // Default color is black

    // Modify your click event listener to check for text clicks
    document.addEventListener("click", (event) => {
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
            } else if (isReadyToApplyText && pendingText) {
                applyTextToSelectedMesh(pendingText, uv);
                resetTextPlacementMode();
            }
        }
    });
    // Update all mesh selection buttons
    document.querySelectorAll(".selectArea button").forEach((button) => {
        button.addEventListener("click", function () {
            const meshName = this.classList.contains("Plane")
                ? "Plane"
                : this.classList.contains("Plane_1")
                    ? "Plane_1"
                    : this.classList.contains("Plane_4")
                        ? "Plane_4"
                        : "Plane_3";

            selectedMesh = model.getObjectByName(meshName);
            const centerUV = new THREE.Vector2(0.5, 0.5);

            if (isReadyToPlaceImage && pendingImageFile) {
                applyImageToSelectedMesh(pendingImageFile, centerUV);
                resetImagePlacementMode();
            } else if (isReadyToApplyText && pendingText) {
                applyTextToSelectedMesh(pendingText, centerUV);
                resetTextPlacementMode();
                // Screen transition is now handled in applyTextToSelectedMesh
            }

            console.log(`Selected ${meshName} for placement`);
        });
    });
    function resetImagePlacementMode() {
        isReadyToPlaceImage = false;
        pendingImageFile = null;
        document.body.classList.remove("cursor-active");
    }

    function resetTextPlacementMode() {
        isReadyToApplyText = false; // Reset the flag
        pendingText = null; // Clear pending text
        document.body.classList.remove("cursor-active"); // Reset cursor
    }


    // Modify your applyTextToSelectedMesh function to store original bounds
    function applyTextToSelectedMesh(text, uv) {
        if (!text || !selectedMesh) return;

        const fontFamily = document.getElementById("fontFamilySelect3").value;

        // Calculate offset from center (0.5, 0.5 is texture center)
        const offsetX = uv.x - 0.5;
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
            isLocked: false,
            // Initialize outline properties with defaults
            outlineWidth: 2,
            outlineColor: "#000000",
            hasOutline: false
        };

        textDecals.push(newDecal);
        updateMeshTextureWithAllDecals();

        activeTextDecalIndex = textDecals.length - 1;
        document.querySelector(".decalText").textContent = text;

        // Always show screen 3 when text is placed
        showTextEditingScreen();
        console.log(`Applying decal at UV: ${uv.x.toFixed(2)}, ${uv.y.toFixed(2)} to mesh: ${selectedMesh.name}`);
    }
    // New function to composite all texts onto the mesh texture
    function updateMeshTextureWithAllTexts() {
        if (!selectedMesh) return;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 512;
        canvas.height = 512;

        // Clear canvas with white background
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw all texts that belong to this mesh
        const meshDecals = textDecals.filter(
            (decal) => decal.mesh === selectedMesh,
        );

        meshDecals.forEach((decal) => {
            context.save(); // Save the current context state

            // Set text style
            context.font = `${decal.fontSize}px ${decal.fontFamily}`;
            context.fillStyle = decal.color;
            context.textAlign = "center";
            context.textBaseline = "middle";

            // Calculate position with offset
            const centerX = canvas.width / 2 + decal.offset.x * canvas.width;
            const centerY = canvas.height / 2 + decal.offset.y * canvas.height;

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

                context.strokeStyle = "red";
                context.lineWidth = 1;
                context.setLineDash([5, 3]);
                context.strokeRect(
                    centerX - textWidth / 2 - 10,
                    centerY - textHeight / 2 - 5,
                    textWidth + 20,
                    textHeight + 10,
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
        const tempCanvas = document.createElement("canvas");
        const tempContext = tempCanvas.getContext("2d");
        tempContext.font = `${activeDecal.fontSize}px ${activeDecal.fontFamily}`;
        const textWidth = tempContext.measureText(activeDecal.text).width;
        const textHeight = activeDecal.fontSize;

        // Calculate bounds (normalized 0-1)
        textBoundingBox.original = {
            x: (canvasWidth / 2 - textWidth / 2) / canvasWidth,
            y: (canvasHeight / 2 - textHeight / 2) / canvasHeight,
            width: textWidth / canvasWidth,
            height: textHeight / canvasHeight,
        };

        // Update current bounds with offset
        textBoundingBox.current = {
            x: 0.5 + (textBoundingBox.original.x - 0.5) + activeDecal.offset.x,
            y:
                1 -
                (0.5 + (textBoundingBox.original.y - 0.5) + activeDecal.offset.y) -
                textBoundingBox.original.height,
            width: textBoundingBox.original.width,
            height: textBoundingBox.original.height,
        };
    }
    // Add this helper function to update bounds when texture moves
    function updateTextBounds(offset) {
        if (!textBoundingBox.original) return;

        textBoundingBox.current = {
            x: 0.5 + textBoundingBox.original.x + offset.x,
            y:
                1 -
                (0.5 + textBoundingBox.original.y + offset.y) -
                textBoundingBox.original.height, // Invert Y-axis
            width: textBoundingBox.original.width,
            height: textBoundingBox.original.height,
        };
    }

    function logTexturePosition() {
        if (selectedMesh && selectedMesh.material.map) {
            // Log the texture offset
            const textureOffset = selectedMesh.material.map.offset;
            console.log("Texture Offset Position:", textureOffset);
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
                closestUV.set(uv.getX(i), uv.getY(i)); // Store the UV coordinates
            }
        }

        // Adjust the Y-coordinate for top/bottom regions
        const adjustedUV = new THREE.Vector2(closestUV.x, 1 - closestUV.y); // Flip the Y-axis
        return adjustedUV;
    }

    // Handle apply text button click
    document.getElementById("applyTextButton").addEventListener("click", () => {
        const inputText = document.getElementById("textInput").value.trim();
        if (inputText) {
            pendingText = inputText;
            isReadyToApplyText = true;
            isReadyToPlaceImage = false;
            document.body.classList.add("cursor-active");

            // Show text placement buttons
            document.getElementById('screen1').style.display = 'none';
            document.getElementById('screen2').style.display = 'block';
        } else {
            alert("Please enter some text before applying.");
        }
    });
    // Function to get the currently  mesh Selected based on button clicks
    function getSelectedMesh() {
        return selectedMesh;
    }

    // 3. When mesh is selected (either by button or click), show fourth screen
    function selectMeshFromButton(meshName, decalType = 'image') {
        selectedMesh = model.getObjectByName(meshName);

        if (decalType === 'image' && isReadyToPlaceImage && pendingImageFile) {
            const uv = getFrontFacingUV(selectedMesh, camera);
            applyImageToSelectedMesh(pendingImageFile, uv);

            // Hide third screen, show fourth screen
            document.querySelector('.logoThirdScreen').style.display = 'none';
            document.querySelector('.logoFourthScreen').style.display = 'block';
        }
    }

    // Function to select mesh via buttons
    function selectMeshFromButton(meshName, decalType = 'text') {
        selectedMesh = model.getObjectByName(meshName);

        if (!selectedMesh) {
            console.error(`Mesh ${meshName} not found in model`);
            return;
        }

        // Calculate the mesh center in world space
        const box = new THREE.Box3().setFromObject(selectedMesh);
        const center = new THREE.Vector3();
        box.getCenter(center);



        // Get UV coordinates that face the camera
        const uv = getFrontFacingUV(selectedMesh, camera);

        if (decalType === 'image' && isReadyToPlaceImage && pendingImageFile) {
            applyImageToSelectedMesh(pendingImageFile, uv);
            resetImagePlacementMode();
        }
        else if (decalType === 'text' && isReadyToApplyText && pendingText) {
            applyTextToSelectedMesh(pendingText, uv);
            resetTextPlacementMode();
        }

        console.log(`Selected ${meshName} (${decalType}) at UV: ${uv.x.toFixed(2)}, ${uv.y.toFixed(2)}`);

        // Highlight button
        const selector = decalType === 'text' ?
            '#dynamicMeshButtons button' : '#dynamicImageMeshButtons button';
        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mesh === meshName);
        });
    }

    function getFrontFacingUV(mesh, camera) {
        const box = new THREE.Box3().setFromObject(mesh);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(
            new THREE.Vector2(0, 0), // Center of screen
            camera
        );
        // Find intersection with this specific mesh
        const intersects = raycaster.intersectObject(mesh, true);
        if (intersects.length > 0) {
            // Return UV coordinates of the front-facing face
            return intersects[0].uv;
        }
        // Fallback to center UV if no intersection found
        return new THREE.Vector2(0.5, 0.5);
    }

    // JavaScript 
    // Set initial light position
    directionalLight.position.set(1, 1, 1);
    // Event listener for light height adjustment
    lightHeightSlider.addEventListener("input", function () {
        const lightHeight = parseFloat(this.value);

        // Update the height of all lights
        ambientLight.position.y = lightHeight; // Update ambient light height
        hemisphereLight.position.y = lightHeight; // Update hemisphere light height
        directionalLight1.position.y = lightHeight; // Update directional light 1 height
        directionalLight2.position.y = lightHeight; // Update directional light 2 height
        directionalLight3.position.y = lightHeight; // Update directional light 3 height
        directionalLight.position.y = lightHeight; // Update main directional light height
        // Optional: Log the new light heights for debugging
        console.log(`Updated light heights to: ${lightHeight}`);
    });
    function updateLightPositions() {
        const targetHeight = parseFloat(lightHeightSlider.value);

        // Smoothly transition the height of all lights
        ambientLight.position.y += (targetHeight - ambientLight.position.y) * 0.1;
        hemisphereLight.position.y += (targetHeight - hemisphereLight.position.y) * 0.1;
        directionalLight1.position.y += (targetHeight - directionalLight1.position.y) * 0.1;
        directionalLight2.position.y += (targetHeight - directionalLight2.position.y) * 0.1;
        directionalLight3.position.y += (targetHeight - directionalLight3.position.y) * 0.1;
        directionalLight.position.y += (targetHeight - directionalLight.position.y) * 0.1;
    }
    // Call this function in your animation loop
    function animate() {
        requestAnimationFrame(animate);
        updateLightPosition(); // Update light position
        renderer.render(scene, camera);
    }


    function calculateMeshCenterUV(mesh) {
        if (!mesh || !mesh.geometry) return new THREE.Vector2(0.5, 0.5);

        const geometry = mesh.geometry;
        if (!geometry.attributes.uv) return new THREE.Vector2(0.5, 0.5);

        const uvAttribute = geometry.attributes.uv;
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        // Calculate the bounds of the UV coordinates
        for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i);
            const v = uvAttribute.getY(i);

            minX = Math.min(minX, u);
            maxX = Math.max(maxX, u);
            minY = Math.min(minY, v);
            maxY = Math.max(maxY, v);
        }

        // Calculate center, handling flipped UVs
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // Return normalized center (0.5, 0.5 would be exact center of texture)
        return new THREE.Vector2(centerX, 1 - centerY); // Flip Y-axis
    }




    // Variables to store the original position of the text
    let originalTextPosition = new THREE.Vector3();
    // Add a variable to store the last click UV coordinates
    let lastClickUV = null;
    // Function to handle mesh selection
    function selectMeshUnderMouse(event) {
        const canvasRect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
            -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1,
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        let intersects = raycaster.intersectObjects(model.children, true);

        if (intersects.length > 0) {
            selectedMesh = intersects[0].object;
            lastClickUV = intersects[0].uv; // Store the UV coordinates
            console.log(
                "Mesh selected by click:",
                selectedMesh.name,
                "at UV:",
                lastClickUV,
            );
        }
    }
    let pendingImageFile = null; // Store the uploaded image file
    let isReadyToPlaceImage = false; // Flag for image placement mode
    // 2. When apply button is clicked, show third screen
    document.getElementById("applyLogoButton").addEventListener("click", () => {
        if (pendingImageFile) {
            isReadyToPlaceImage = true;
            document.body.classList.add("cursor-active");

            // Hide second screen, show third screen
            document.querySelector('.logoSecondScreen').style.display = 'none';
            document.querySelector('.logoThirdScreen').style.display = 'block';
        }
    });
    // Mouse down event - unchanged
    document.addEventListener("mousedown", (event) => {
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
                const bounds = {
                    x: 0.5 + decal.offset.x - (decal.bounds.width * decal.scale) / 2,
                    y: 0.5 + decal.offset.y - (decal.bounds.height * decal.scale) / 2,
                    width: decal.bounds.width * decal.scale,
                    height: decal.bounds.height * decal.scale,
                };

                if (
                    uv.x >= bounds.x &&
                    uv.x <= bounds.x + bounds.width &&
                    uv.y >= bounds.y &&
                    uv.y <= bounds.y + bounds.height
                ) {
                    activeTextDecalIndex = -1;
                    activeImageDecalIndex = i;
                    selectedMesh = clickedMesh;
                    decalClicked = true;

                    isImageMoving = true;
                    isImageSelected = true;
                    controls.enabled = false;
                    document.body.style.cursor = "grabbing";

                    imageClickOffset.set(
                        uv.x - (bounds.x + bounds.width / 2),
                        uv.y - (bounds.y + bounds.height / 2),
                    );
                    updateImagePreview();
                    updateAllMeshTextures();
                    // Show image editing screens
                    document.querySelector('.logoFirstScreen').style.display = 'none';
                    document.querySelector('.logoSecondScreen').style.display = 'block';
                    document.querySelector('.logoFourthScreen').style.display = 'block';
                    break;
                }
            }

            // Then check text decals (search all meshes)
            if (!decalClicked) {
                for (let i = textDecals.length - 1; i >= 0; i--) {
                    const decal = textDecals[i];
                    const tempCanvas = document.createElement("canvas");
                    const tempContext = tempCanvas.getContext("2d");
                    tempContext.font = `${decal.fontSize}px ${decal.fontFamily}`;
                    const textWidth = tempContext.measureText(decal.text).width;
                    const textHeight = decal.fontSize;

                    const bounds = {
                        x: 0.5 + decal.offset.x - textWidth / 512 / 2,
                        y: 0.5 + decal.offset.y - textHeight / 512 / 2,
                        width: textWidth / 512,
                        height: textHeight / 512,
                    };

                    if (
                        uv.x >= bounds.x &&
                        uv.x <= bounds.x + bounds.width &&
                        uv.y >= bounds.y &&
                        uv.y <= bounds.y + bounds.height
                    ) {
                        activeTextDecalIndex = i;
                        activeImageDecalIndex = -1;
                        selectedMesh = clickedMesh;
                        decalClicked = true;

                        isTextMoving = true;
                        isTextSelected = true;
                        controls.enabled = false;
                        document.body.style.cursor = "grabbing";

                        textClickOffset.set(
                            uv.x - (bounds.x + bounds.width / 2),
                            uv.y - (bounds.y + bounds.height / 2),
                        );

                        // Update color preview
                        document.querySelector(".colorPicker").style.backgroundColor =
                            decal.color;
                        document.querySelector(".decalText").textContent = decal.text;

                        // Always show screen 3 when text decal is clicked
                        showTextEditingScreen();

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
    document.addEventListener("mousemove", (event) => {
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
        } else if (isImageMoving && isImageSelected && activeImageDecalIndex >= 0) {
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
    document.addEventListener("mouseup", () => {
        if (isTextSelected) {
            this.lastMouseX = null;
            this.lastMouseY = null;
            document.body.style.cursor = "";
            controls.enabled = false;
            isTextMoving = false;
        }
        if (isImageSelected) {
            this.lastMouseX = null;
            this.lastMouseY = null;
            document.body.style.cursor = "";
            controls.enabled = false;
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
        const tempCanvas = document.createElement("canvas");
        const tempContext = tempCanvas.getContext("2d");
        tempContext.font = `${decal.fontSize}px ${decal.fontFamily}`;
        const textWidth = tempContext.measureText(decal.text).width;
        const textHeight = decal.fontSize;

        // Calculate center position
        const centerX = 0.5 + decal.offset.x;
        const centerY = 0.5 + decal.offset.y;

        // Return bounds in correct coordinate space
        return {
            x: centerX - textWidth / canvasWidth / 2,
            y: centerY - textHeight / canvasHeight / 2,
            width: textWidth / canvasWidth,
            height: textHeight / canvasHeight,
        };
    }

    // fontFamilySelect
    const fontFamilySelect = document.getElementById("fontFamilySelect3");
    let activeTextDecalIndex = -1; // Track which text is currently selected

    // Event listener to handle font family change
    fontFamilySelect.addEventListener("change", (event) => {
        if (activeTextDecalIndex >= 0) {
            textDecals[activeTextDecalIndex].fontFamily = event.target.value;
            updateMeshTextureWithAllDecals(); // Changed from updateMeshTextureWithAllTexts()
            updateActiveDecalBounds();
        }
    });

    // custom CSS class for cursor
    document.styleSheets[0].insertRule(
        `
      .cursor-active {
          cursor: url('plus-cursor.png'), auto;
      }
  `,
        0,
    );

    // Event listener to apply text via mouse click
    document.addEventListener("click", (event) => {
        if (isTextMoving || isImageMoving) return;

        const canvasRect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
            -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1,
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(model.children, true);

        if (intersects.length > 0) {
            selectedMesh = intersects[0].object;
            const uv = intersects[0].uv;

            if (isReadyToPlaceImage && pendingImageFile) {
                const mouse = getNormalizedMousePosition(event);
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(model.children, true);

                if (intersects.length > 0) {
                    selectedMesh = intersects[0].object;
                    const uv = intersects[0].uv;
                    applyImageToSelectedMesh(pendingImageFile, uv);

                    // Hide third screen, show fourth screen
                    document.querySelector('.logoThirdScreen').style.display = 'none';
                    document.querySelector('.logoFourthScreen').style.display = 'block';
                }
            } else if (isReadyToPlaceImage && pendingImageFile) {
                applyImageToSelectedMesh(pendingImageFile, uv);
                isReadyToPlaceImage = false;
                document.body.classList.remove("cursor-active");
            }
        }
    });

    document.querySelectorAll('.backToFirstScreen').forEach(button => {
        button.addEventListener('click', function () {
            // Hide Screen 3
            document.querySelector('.logoFourthScreen').style.display = 'none';
            document.querySelector('.logoSecondScreen').style.display = 'none';
            // Show Screen 1
            document.querySelector('.logoFirstScreen').style.display = 'block';

        });
    });
    // roateText
    // Get the slider and the span where the rotation value is displayed
    const rotateSlider = document.getElementById("rotateSlider");
    const rotationValueSpan = document.getElementById("rotationValue");

    // In your text rotation slider:
    rotateSlider.addEventListener("input", (event) => {
        const rotationValue = event.target.value;
        rotationValueSpan.textContent = rotationValue;

        if (activeTextDecalIndex >= 0) {
            textDecals[activeTextDecalIndex].rotation =
                THREE.MathUtils.degToRad(rotationValue);
            updateMeshTextureWithAllDecals(); // Changed from updateMeshTextureWithAllTexts()
        }
    });

    // roateText

    // borderButtons
    const deleteButton = document.getElementById("bottomLeftButton");

    // Action flags
    let isFixed = false;
    let isDeleting = false;
    const opacityValueSpan = document.getElementById("OpacityValue");

    let isReadyToApplyImage = false; // Flag for image placement mode

    let imageDecals = []; // Array to store all image decals
    let activeImageDecalIndex = -1; // Track which image is currently selected
    let isImageMoving = false; // Flag to track whether the image is being moved
    let isImageSelected = false; // Flag to track if an image is selected
    let imageClickOffset = new THREE.Vector2(); // Store click offset for images
    let imageBoundingBox = {
        original: null,
        current: null,
    };
    deleteButton.addEventListener("click", () => {
        // First check if we're deleting a text decal
        if (activeTextDecalIndex >= 0) {
            console.log(`Deleting text decal ${activeTextDecalIndex}`);
            textDecals.splice(activeTextDecalIndex, 1);
            activeTextDecalIndex = -1;
            isTextSelected = false;

            // Hide Screen 3 and show Screen 1 when text decal is deleted
            document.getElementById('screen3').style.display = 'none';
            document.getElementById('screen1').style.display = 'block';

            updateMeshTextureWithAllDecals(); // Update only the decals
        }
        // Then check if we're deleting an image decal
        else if (activeImageDecalIndex >= 0) {
            console.log(`Deleting image decal ${activeImageDecalIndex}`);
            imageDecals.splice(activeImageDecalIndex, 1);
            activeImageDecalIndex = -1;
            isImageSelected = false;
            // Clear the preview when deleting
            uploadedImagePreview.style.display = "none";
            imagePreviewBorder.style.display = "none";
            // Redirect to logo first screen after deletion
            document.querySelector('.logoFourthScreen').style.display = 'none';
            document.querySelector('.logoSecondScreen').style.display = 'none';
            document.querySelector('.logoFirstScreen').style.display = 'block';

            updateMeshTextureWithAllDecals(); // Update only the decals
        }
        // Finally check if we're deleting a pattern
        else {
            const patternToDelete = patternDecals.find((d) => d.mesh === selectedMesh);
            if (patternToDelete) {
                console.log("Deleting pattern decal");
                patternDecals = patternDecals.filter((d) => d.uuid !== patternToDelete.uuid);
                updateMeshTextureForMesh(selectedMesh); // Update the mesh texture
            }
        }
    });
    // Delete Text Decal Button
    document.getElementById("deleteTextButton").addEventListener("click", () => {
        if (activeTextDecalIndex >= 0) {
            console.log(`Deleting text decal ${activeTextDecalIndex}`);
            textDecals.splice(activeTextDecalIndex, 1);
            activeTextDecalIndex = -1;
            isTextSelected = false;

            // Hide Screen 3 and show Screen 1 when text decal is deleted
            document.getElementById('screen3').style.display = 'none';
            document.getElementById('screen1').style.display = 'block';

            updateMeshTextureWithAllDecals();
            console.log("Text decal deleted");
        } else {
            console.log("No text decal selected to delete");
        }
    });

    // Delete Image Decal Button
    document.getElementById("deleteImageButton").addEventListener("click", () => {
        if (activeImageDecalIndex >= 0) {
            console.log(`Deleting image decal ${activeImageDecalIndex}`);
            imageDecals.splice(activeImageDecalIndex, 1);
            activeImageDecalIndex = -1;
            isImageSelected = false;

            // Clear the preview when deleting
            uploadedImagePreview.style.display = "none";
            imagePreviewBorder.style.display = "none";

            updateMeshTextureWithAllDecals();
            console.log("Image decal deleted");

            // Redirect to logo first screen after deletion
            document.querySelector('.logoFourthScreen').style.display = 'none';
            document.querySelector('.logoSecondScreen').style.display = 'none';
            document.querySelector('.logoFirstScreen').style.display = 'block';
        } else {
            console.log("No image decal selected to delete");
        }
    });
    // borderButtons

    // Helper function to get normalized mouse position (you already have this)
    function getNormalizedMousePosition(event) {
        const canvasRect = renderer.domElement.getBoundingClientRect();
        return new THREE.Vector2(
            ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
            -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1,
        );
    }
    loadDefaultModel();
    function exportAsSVG() {
        const svgRenderer = new THREE.SVGRenderer();
        svgRenderer.setSize(container.clientWidth, container.clientHeight);
        svgRenderer.render(scene, camera);

        const svgString = svgRenderer.domElement.outerHTML;
        downloadSVG(svgString, 'model.svg');
    }

    function downloadSVG(svgString, filename) {
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }  // Add this near your other utility functions
    function exportAsVector() {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '0';
        loadingIndicator.style.left = '0';
        loadingIndicator.style.width = '100%';
        loadingIndicator.style.height = '100%';
        loadingIndicator.style.backgroundColor = 'rgba(0,0,0,0.7)';
        loadingIndicator.style.display = 'flex';
        loadingIndicator.style.justifyContent = 'center';
        loadingIndicator.style.alignItems = 'center';
        loadingIndicator.style.zIndex = '1000';
        loadingIndicator.innerHTML = '<div style="color:white;font-size:24px;">Generating vector file...</div>';
        document.body.appendChild(loadingIndicator);

        // Use setTimeout to allow UI to update
        setTimeout(() => {
            try {
                // Create a high-resolution canvas
                const exportScale = 2; // Balance between quality and performance
                const canvas = document.createElement('canvas');
                canvas.width = container.clientWidth * exportScale;
                canvas.height = container.clientHeight * exportScale;
                const context = canvas.getContext('2d');

                // Store original renderer size
                const originalSize = {
                    width: renderer.domElement.width,
                    height: renderer.domElement.height
                };

                // Temporarily increase renderer resolution
                renderer.setSize(canvas.width, canvas.height);
                camera.aspect = canvas.width / canvas.height;
                camera.updateProjectionMatrix();

                // Render the scene
                renderer.render(scene, camera);

                // Draw to our canvas
                context.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);

                // Convert to SVG
                let svg;
                if (typeof C2S !== 'undefined') {
                    // Using canvas-to-svg library if available
                    const svgRenderer = new C2S(canvas.width, canvas.height);
                    svgRenderer.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
                    svg = svgRenderer.getSerializedSvg();
                } else {
                    // Fallback to simple SVG wrapper if library not available
                    const svgData = canvas.toDataURL('image/png');
                    svg = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
                        <image href="${svgData}" width="${canvas.width}" height="${canvas.height}"/>
                    </svg>
                `;
                }

                // Restore original renderer size
                renderer.setSize(originalSize.width, originalSize.height);
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();

                // Download the SVG
                downloadSVG(svg, 'customized-design.svg');

            } catch (error) {
                console.error('Export failed:', error);
                alert('Export failed. Please try again.');
            } finally {
                // Remove loading indicator
                document.body.removeChild(loadingIndicator);
            }
        }, 100);
    }

    // Update your export button
    document.getElementById('exportVectorBtn').addEventListener('click', function () {
        // You could add options here for SVG vs EPS
        exportAsVector();
    });
    function exportGeometryAsSVG() {
        let svgPaths = '';

        // Traverse all meshes in the scene
        scene.traverse(function (object) {
            if (object.isMesh) {
                const geometry = object.geometry;
                const position = geometry.attributes.position;
                const matrix = object.matrixWorld;

                // Convert 3D geometry to 2D paths
                for (let i = 0; i < position.count; i++) {
                    const vertex = new THREE.Vector3().fromBufferAttribute(position, i);
                    vertex.applyMatrix4(matrix);

                    // Project 3D point to 2D
                    vertex.project(camera);

                    // Convert to SVG coordinates
                    const x = (vertex.x * 0.5 + 0.5) * container.clientWidth;
                    const y = (-vertex.y * 0.5 + 0.5) * container.clientHeight;

                    // Add to path
                    if (i === 0) {
                        svgPaths += `M${x},${y}`;
                    } else {
                        svgPaths += `L${x},${y}`;
                    }
                }

                svgPaths += 'Z '; // Close path
            }
        });

        const svg = `
    <svg width="${container.clientWidth}" height="${container.clientHeight}" xmlns="http://www.w3.org/2000/svg">
      <path d="${svgPaths}" fill="none" stroke="black" stroke-width="1"/>
    </svg>
  `;
 
    }
    document.getElementById('exportVectorBtn').addEventListener('click', exportGeometryAsSVG);
    function animate() {
        requestAnimationFrame(animate);

        // Smooth rotation to target angle
        if (Math.abs(targetRotationY - currentRotationY) > 0.01) {
            currentRotationY += (targetRotationY - currentRotationY) * rotationSpeed;
            model.rotation.y = currentRotationY;
        }

        // Existing rotation handling (keep this for your other rotation controls)
        if (isRotating) {
            model.rotation.y += rotationSpeed * rotationDirection;
            currentRotationY = model.rotation.y;
            targetRotationY = currentRotationY; // Sync target with current when manually rotating
        } else if (rotationDirection !== 0) {
            model.rotation.y += rotationSpeed * rotationDirection;
            currentRotationY = model.rotation.y;
            targetRotationY = currentRotationY; // Sync target with current
            rotationDirection *= rotationDamping;
            if (Math.abs(rotationDirection) < 0.001) rotationDirection = 0;
        }

        // Rest of your existing animate function...
        // Smooth zoom handling
        if (Math.abs(controls.distance - targetZoom) > 0.01) {
            controls.distance += (targetZoom - controls.distance) * zoomDamping;
            controls.update();
        }

        // Update light positions smoothly
        updateLightPositions();
        // Update OrbitControls
        controls.update();
        renderer.render(scene, camera);

        // Update light position based on model rotation
        if (model) {
            const lightDistance = 1;
            const modelRotationY = model.rotation.y;
            directionalLight.position.set(
                Math.cos(modelRotationY) * lightDistance,
                5,
                Math.sin(modelRotationY) * lightDistance
            );
        }
    }
    animate();
});
