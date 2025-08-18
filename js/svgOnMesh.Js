document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("threejs-container");
    const content = document.getElementById("threejs-container");
    if (!container) {
        console.error("Container element not found!");
        return;
    }
    const scene = new THREE.Scene();
    let backgroundColor = 0xeeeeee; // Default color
    scene.background = new THREE.Color(backgroundColor);
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000,
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
    document.getElementById("preloader").style.display = "none";

    controls.maxPolarAngle = Math.PI / 2; // Limit to 90 degrees (top)
    controls.minPolarAngle = 0.4; // Limit to 0 degrees (bottom)
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white ambient light
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x404040, 1);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);


    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 6, 1).normalize();
    scene.add(directionalLight);

    // -----------------------------------------------
    //     LET VARIABLES
    // ------------------------------------------------

    let gradientMeshes = {}; // Store gradient information for each mesh
    let gradientColor1 = null; // First gradient color
    let gradientColor2 = null; // Second gradient color
    let gradientAngle = 0; // Gradient angle in degrees
    let gradientScale = 1.0; // Gradient scale

    let model = null;
    let meshes = { primary: [], secondary: [], tertiary: [] };
    let selectedColorCategory = "Plane";
    let checkedCheckboxes = [];
    let rotationProgress = 0; // Track rotation progress
    let currentModelFilename = null; // Track the current model filename
    let isLoadingModel = false;
    let isRotating = false;
    let rotationDirection = 0; // -1 for left, 1 for right, 0 for stop
    let rotationDamping = 0.95; // Damping factor for smooth stop 
    let isZooming = false;
    let zoomDirection = 0; // -1 for zoom out, 1 for zoom in
    let currentFontSize = 28; // Default font size
    // Do the same for plusButton
    let isTextSelected = false;
    let textBoundingBox = {
        original: null, // Stores the original bounds (relative to texture center)
        current: null, // Stores the current bounds (with offset applied)
    };
    let currentPatternScale = 1.0; // Default scale (100%)
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
    let targetRotationY = 0;
    let currentRotationY = 0;
    let selectedPatternColor = "#1c538e"; // Default color
    let selectedPatternIsSVG = false;

    let lightDistance = 5;
    let lightHeight = 5;
    let lightRotation = 45; // degrees
    let lightIntensity = 1;
    let textClickOffset = new THREE.Vector2();
    let isReadyToApplyText = false; // Flag to track if we're ready to place text
    let pendingText = null; // Store the text for placement
    let textWorldPosition = new THREE.Vector3();
    let isTextMoving = false; // Flag to track whether the text is being moved
    let textDecals = []; // Array to store all text decals
    let selectedMesh = null; // Declare  mesh Selected variable
    let textToApply = null;
    let textTextures = [];
    let selectedTextColor = "#000000"; // Default color is black
    let originalTextPosition = new THREE.Vector3();
    // Add a variable to store the last click UV coordinates
    let lastClickUV = null;
    let pendingImageFile = null; // Store the uploaded image file
    let isReadyToPlaceImage = false; // Flag for image placement mode
    let activeTextDecalIndex = -1; // Track which text is currently selected
    let isFixed = false;
    let isDeleting = false;
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
    // -----------------------------------------------
    //     const VARIABLES
    // ------------------------------------------------
    const loader = new THREE.GLTFLoader();

    const COLORS = {
        primary: 0xf50a3,
        secondary: 0xf50a3,
        tertiary: 0xf50a3,
    };
    const rotationSpeed = 0.07; // Speed of rotation
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
    const rotateRightBtn = document.getElementById("rotateRight");
    const rotateLeftBtn = document.getElementById("rotateLeft");
    const zoomSpeed = 0.008; // Adjust this value for faster/slower zoom
    const zoomDamping = 0.95; // Damping factor for smooth stop
    // Zoom controls
    const zoomInBtn = document.getElementById("zoomIn");
    const zoomOutBtn = document.getElementById("zoomOut");
    const radioButtons = document.querySelectorAll(
        'input[name="meshActiveColor"]',
    );
    // Get the resize slider and value display
    const resizeImgSlider = document.getElementById("resizeImgSlider");
    const resizeValueSpan = document.getElementById("resizeValue");
    const patternScaleSlider = document.getElementById("patternScale");
    const opacitySlider = document.getElementById("Opacity");
    // Get the elements
    const fileInput = document.getElementById("fileInput");
    const uploadedImagePreview = document.getElementById("uploadedImagePreview");
    // Get the preview border element
    const imagePreviewBorder = document.getElementById("imagePreviewBorder");
    const VIEW_ANGLES = {
        front: 0,
        back: Math.PI,
        left: Math.PI / 2,
        right: -Math.PI / 2
    };
    const rotateImgSlider = document.getElementById("rotateImgSlider");
    const rotateImgValueSpan = document.getElementById("rotateImgValue");
    const lightRotationSlider = document.getElementById("lightRotationSlider");
    const lightRotationValue = document.getElementById("lightRotationValue");
    const lightHeightSlider = document.getElementById("lightHeightSlider");
    const lightHeightValue = document.getElementById("lightHeightValue");
    const lightIntensitySlider = document.getElementById("lightIntensitySlider");
    const lightIntensityValue = document.getElementById("lightIntensityValue");
    const deleteButton = document.getElementById("bottomLeftButton");

    const fontFamilySelect = document.getElementById("fontFamilySelect3");
    const opacityValueSpan = document.getElementById("OpacityValue");
    // Add this at the very beginning of your code (before DOMContentLoaded)
    const consoleToggle = {
        enabled: true, // Set to false to disable all console logs
        originalConsole: { ...console }, // Store original console methods

        init: function () {
            if (!this.enabled) {
                // Override all console methods
                const methods = ['log', 'warn', 'error', 'info', 'debug', 'table', 'group', 'groupEnd', 'time', 'timeEnd'];
                methods.forEach(method => {
                    console[method] = function () { };
                });
            }
        },

        toggle: function (state) {
            this.enabled = state;
            if (state) {
                // Restore original console methods
                Object.keys(this.originalConsole).forEach(key => {
                    console[key] = this.originalConsole[key];
                });
            } else {
                // Disable all console methods
                Object.keys(console).forEach(key => {
                    console[key] = function () { };
                });
            }
        }
    };

    // Initialize the console toggle
    consoleToggle.init();
    // Example of how to add a toggle button in your UI:
    // const consoleToggleBtn = document.createElement('button ');
    // consoleToggleBtn.textContent = 'Toggle Console';
    // consoleToggleBtn.addEventListener('click', () => {
    //     consoleToggle.enabled = !consoleToggle.enabled;
    //     consoleToggle.toggle(consoleToggle.enabled);
    //     console.log(`Console logging ${consoleToggle.enabled ? 'enabled' : 'disabled'}`);
    // });
    // document.body.appendChild(consoleToggleBtn);
    // -----------------------------------------------
    //     const VARIABLES
    // ------------------------------------------------




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
        if (activeTextDecalIndex >= 0) {
            document.getElementById('updateTextButton').style.display = 'block';
        } else {
            document.getElementById('updateTextButton').style.display = 'none';
        }
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

    function updateUndoRedoButtons() {
        const undoButton = document.getElementById('undoButton');
        const redoButton = document.getElementById('redoButton');

        // Disable undo button if nothing to undo
        undoButton.disabled = undoStack.length === 0;

        // Disable redo button if nothing to redo
        redoButton.disabled = redoStack.length === 0;
    }
    // Add this near your other model configurations
    const modelSvgPatterns = {
        'Modal2FullSleeves.glb': {
            Plane: "assets/ModalPatterns/modal1/front.svg",
            Plane_1: "assets/ModalPatterns/modal1/back.svg",
            Plane_2: "assets/ModalPatterns/modal1/left_sleeve.svg",
            Plane_3: "assets/ModalPatterns/modal1/right_sleeve.svg",
            // Add more mappings as needed
        },
        // Add patterns for other models if needed
    };
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
                console.log(`Mesh Name: ${child.name}`);
                const colorHex = colorMappings[child.name];

                // Check if this model has predefined SVG patterns
                const modelPatterns = modelSvgPatterns[currentModelFilename];

                if (modelPatterns && modelPatterns[child.name]) {
                    // Load SVG pattern for this mesh
                    loadSvgPatternForMesh(child, modelPatterns[child.name]);
                } else if (colorHex) {
                    // Fall back to gradient if no SVG pattern
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
                }

                // Add to mesh collection
                if (!meshes[child.name]) {
                    meshes[child.name] = [];
                }
                meshes[child.name].push(child);
            }
        });
    }

    function loadSvgPatternForMesh(mesh, svgPath) {
        fetch(svgPath)
            .then(response => response.text())
            .then(svgContent => {
                // Create a pattern from the SVG
                const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(svgBlob);

                const img = new Image();
                img.onload = function () {
                    // Create canvas with pattern
                    const canvas = document.createElement("canvas");
                    canvas.width = 1024;
                    canvas.height = 1024;
                    const ctx = canvas.getContext("2d");

                    // Create pattern
                    const pattern = ctx.createPattern(img, "repeat");
                    ctx.fillStyle = pattern;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Create texture
                    const texture = new THREE.CanvasTexture(canvas);
                    texture.flipY = false;

                    // Apply to mesh
                    mesh.material = new THREE.MeshStandardMaterial({
                        map: texture,
                        side: THREE.DoubleSide,
                    });

                    // Store pattern info
                    mesh.userData.pattern = {
                        isSvg: true,
                        svgPath: svgPath,
                        svgContent: svgContent
                    };

                    URL.revokeObjectURL(url);
                };
                img.src = url;
            })
            .catch(error => {
                console.error(`Error loading SVG pattern for ${mesh.name}:`, error);
                // Fall back to default color if SVG fails to load
                const defaultColor = colorMappings[mesh.name] || "#ffffff";
                const gradientTexture = createGradientTexture(defaultColor, defaultColor);
                mesh.material = new THREE.MeshStandardMaterial({
                    map: gradientTexture,
                    side: THREE.DoubleSide,
                });
            });
    }

    // Load a default model when the page loads
    function loadDefaultModel() {
        // Show preloader when starting to load default model
        document.getElementById("preloader").style.display = "flex";

        const defaultModelUrl = "assets/models/Modal2FullSleeves.glb";
        const defaultModelType = "halfSleeves";
        const defaultColorMappings = {
            Plane: "primary",
            Plane_1: "secondary"
        };
        // Add active class to the default design item
        document.querySelectorAll(".designsItems img").forEach(img => {
            if (img.dataset.modal && img.dataset.modal.includes("Modal2FullSleeves.glb")) {
                img.closest('.designsItems').classList.add("active");
            }
        });
        loadModel(defaultModelUrl, defaultColorMappings, defaultModelType);
    }
    function loadModel(url, colorMappings, modelType) {
        console.log(`Loading model: ${url}, type: ${modelType}`);

        // Clear previous model and event listeners
        if (isLoadingModel) return;
        isLoadingModel = true;

        document.getElementById("preloader").style.display = "flex";
        saveState();
        clearPreviousModel();

        // Show preloader when starting to load

        currentModelType = modelType; // Store the current model type
        currentModelType = modelType;
        currentModelFilename = url.split('/').pop(); // Clear previous model and decals
        // Hide all forms initially

        // Remove active class from all design items
        document.querySelectorAll(".designsItems").forEach(item => {
            item.classList.remove("active");
        });
        // Add active class to the corresponding design item
        document.querySelectorAll(".designsItems img").forEach(img => {
            if (img.dataset.modal && img.dataset.modal.includes(currentModelFilename)) {
                img.closest('.designsItems').classList.add("active");
            }
        });
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
            console.log(`Applying color ${selectedColor} to ${selectedMesh}`);

            // If this is a group name (Primary/Secondary/Tertiary)
            if (["Primary", "Secondary", "Tertiary"].includes(selectedMesh)) {
                console.log(`Processing group: ${selectedMesh}`);
                const meshGroup = meshColorGroups[selectedMesh];
                if (meshGroup) {
                    console.log(`Found ${meshGroup.length} meshes in group`);
                    meshGroup.forEach((meshName) => {
                        console.log(`Processing mesh: ${meshName}`);
                        const mesh = model?.getObjectByName(meshName);
                        if (mesh && mesh.userData.gradient) {
                            console.log(`Updating gradient for ${meshName}`);
                            mesh.userData.gradient.color1 = selectedColor;
                            mesh.userData.gradient.color2 = selectedColor;
                            updateMeshTextureForMesh(mesh);
                        } else {
                            console.log(`Mesh ${meshName} not found or has no gradient`);
                        }
                    });
                } else {
                    console.log(`No mesh group found for ${selectedMesh}`);
                }
            } else {
                // Individual mesh
                console.log(`Processing individual mesh: ${selectedMesh}`);
                const mesh = model?.getObjectByName(selectedMesh);
                if (mesh && mesh.userData.gradient) {
                    console.log(`Updating gradient for ${selectedMesh}`);
                    mesh.userData.gradient.color1 = selectedColor;
                    mesh.userData.gradient.color2 = selectedColor;
                    updateMeshTextureForMesh(mesh);
                } else {
                    console.log(`Mesh ${selectedMesh} not found or has no gradient`);
                }
            }

            // Update the color preview for the selected mesh in both sections with null checks
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
                const staticSecondary = document.querySelector("#meshColorpst .Secondary");
                if (staticSecondary) {
                    staticSecondary.style.backgroundColor = selectedColor;
                }
            } else if (selectedMesh === "Tertiary") {
                if (colorPreviewTertiary) {
                    colorPreviewTertiary.style.backgroundColor = selectedColor;
                }
                // Also update the static preview
                const staticTertiary = document.querySelector("#meshColorpst .Tertiary");
                if (staticTertiary) {
                    staticTertiary.style.backgroundColor = selectedColor;
                }
            }

            // Also update the dynamic mesh options
            const dynamicColorPreview = document.getElementById(`apply${selectedMesh}`);
            if (dynamicColorPreview) {
                dynamicColorPreview.style.backgroundColor = selectedColor;
            }
        }
        document.querySelectorAll(".meshColorPalette .palette").forEach((palette) => {
            palette.addEventListener("click", (e) => {
                const selectedColor = e.target.dataset.color;
                const activeMeshRadio = document.querySelector(
                    'input[name="meshActiveColor"]:checked',
                );
                if (!activeMeshRadio) return;

                const selectedMesh = activeMeshRadio.value;
                updateMeshColor(selectedMesh, selectedColor);
                // Save state after color change
                saveState();
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
                saveState(); // Save state before color change
                selectedTextColor = event.target.dataset.color;
                if (!selectedTextColor.startsWith('#')) {
                    selectedTextColor = `#${selectedTextColor}`;
                }
                document.querySelector(".colorPicker").style.backgroundColor = selectedTextColor;
                if (activeTextDecalIndex >= 0) {
                    textDecals[activeTextDecalIndex].color = selectedTextColor;
                    updateMeshTextureWithAllDecals();
                }
            });
        });
        // Event listener for radio buttons to toggle active group
        // Add event listener to radio buttons to toggle active group
        document.querySelectorAll('input[name="meshActiveColor"]').forEach((radio) => {
            radio.addEventListener("change", (e) => {
                const activeGroup = e.target.value;

                // Show the title for the selected group and hide others
                ["Primary", "Secondary", "Tertiary"].forEach((group) => {
                    const titleElement = document.getElementById(`title${group}`);
                    if (titleElement) {
                        titleElement.style.display = group === activeGroup ? "block" : "none";
                    }
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
                (a, b) => colorFrequency[b].length - colorFrequency[a].length
            );

            // Assign meshes to groups based on sorted colors
            meshColorGroups.Primary = colorFrequency[sortedColors[0]] || [];
            meshColorGroups.Secondary = colorFrequency[sortedColors[1]] || [];
            meshColorGroups.Tertiary = colorFrequency[sortedColors[2]] || [];

            console.log("Assigned Mesh Groups:", JSON.stringify(meshColorGroups, null, 2));
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

            console.log(`Model loaded: ${url}`);
            // Your existing success handler
            isLoadingModel = false;
            model = gltf.scene;
            isLoadingModel = false;
            document.addEventListener('click', selectMeshUnderMouse);
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
            camera.fov = Math.min(75, Math.max(7, fv + cameraDistance - 35)); // Clamp values
            camera.updateProjectionMatrix();
            camera.up.set(0, 1, 0); // Explicitly set Y-up

            const meshColors = {}; // Object to store mesh names and their corresponding colors
            let texturesToLoad = 0;
            let texturesLoaded = 0;

            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    const material = child.material;
                    if (material && material.color) {
                        const colorHex = material.color.getHexString();
                        meshColors[child.name] = `#${colorHex}`;
                        texturesToLoad++;

                    } else {
                        meshColors[child.name] = "No color property";
                    }
                }
            });
            // Function to check if all textures are loaded
            function checkTexturesLoaded() {
                texturesLoaded++;
                if (texturesLoaded >= texturesToLoad) {
                    // All textures loaded, hide preloader
                    document.getElementById("preloader").style.display = "none";
                    console.log("All textures loaded, hiding preloader");
                }
            }
            // Second pass to process meshes and track texture loading
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    const material = child.material;
                    if (material && material.color) {
                        const colorHex = material.color.getHexString();
                        meshColors[child.name] = `#${colorHex}`;
                    } else {
                        meshColors[child.name] = "No color property";
                    }

                    // Track texture loading
                    if (material && material.map) {
                        if (material.map.image && material.map.image.complete) {
                            checkTexturesLoaded();
                        } else {
                            material.map.onUpdate = checkTexturesLoaded;
                        }
                    }
                }
            });
            // Add this debug log:
            console.log("Model children:", model.children.map(c => c.name));
            // If no textures to load, hide preloader immediately
            if (texturesToLoad === 0) {
                document.getElementById("preloader").style.display = "none";
                console.log("No textures to load, hiding preloader");
            }

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
                if (child.isMesh && child.material && child.material.map) {
                    totalTextures++;

                    // Use texture.onUpdate instead of addEventListener("load"), which might not fire properly
                    if (child.material.map.image && child.material.map.image.complete) {
                        // Already loaded
                        loadedTextures++;
                    } else {
                        child.material.map.onUpdate = () => {
                            loadedTextures++;
                            checkIfAllTexturesLoaded();
                        };
                    }
                }
            });

            function checkIfAllTexturesLoaded() {
                if (loadedTextures === totalTextures) {
                    // All textures loaded, now hide the preloader
                    document.getElementById("preloader").style.display = "none";
                }
            }
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
        },
            // Progress callback
            function (xhr) {
                console.log((xhr.loaded / (xhr.total || 1) * 100) + '% loaded');
            },
            // Error callback
            function (error) {
                console.error('Error loading model:', error);
                isLoadingModel = false;
                document.getElementById("preloader").style.display = "none";

                // Show error message to user
                alert("Failed to load the model. Please try again.");

                // Attempt to restore previous state
                if (undoStack.length > 0) {
                    applyState(undoStack[undoStack.length - 1]);
                } else {
                    // If no undo state, reload default model
                    loadDefaultModel();
                }
            });
        updateUndoRedoButtons();
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

    // UNDO REDO 
    // Add these at the top with your other global variables
    let undoStack = [];
    let redoStack = [];
    let currentState = null;
    let isUndoRedoInProgress = false;
    const MAX_UNDO_STEPS = 50;

    // Function to capture the current state of the editor
    function captureState() {
        // Make sure we store just the filename, not full path
        const modelFilename = currentModelFilename ?
            currentModelFilename.split('/').pop() :
            null;
        if (isUndoRedoInProgress) return;

        const state = {

            model: currentModelFilename,
            modelType: currentModelType,
            meshes: {},
            textDecals: textDecals.map(decal => ({
                text: decal.text,
                color: decal.color,
                fontFamily: decal.fontFamily,
                fontSize: decal.fontSize,
                offset: decal.offset.clone(),
                rotation: decal.rotation,
                mesh: decal.mesh?.name || null,
                uuid: decal.uuid,
                isLocked: decal.isLocked,
                outlineWidth: decal.outlineWidth,
                outlineColor: decal.outlineColor,
                hasOutline: decal.hasOutline
            })),
            imageDecals: imageDecals.map(decal => ({
                image: decal.image.src, // Store the image source
                offset: decal.offset.clone(),
                rotation: decal.rotation,
                scale: decal.scale,
                mesh: decal.mesh?.name || null,
                uuid: decal.uuid,
                isLocked: decal.isLocked,
                bounds: {
                    x: decal.bounds.x,
                    y: decal.bounds.y,
                    width: decal.bounds.width,
                    height: decal.bounds.height,
                    originalWidth: decal.bounds.originalWidth,
                    originalHeight: decal.bounds.originalHeight
                }
            })),
            patternDecals: JSON.parse(JSON.stringify(patternDecals)),
            gradientMeshes: JSON.parse(JSON.stringify(gradientMeshes)),
            backgroundColor: backgroundColor,
            cameraPosition: camera.position.clone(),
            cameraRotation: camera.rotation.clone(),
            controlsTarget: controls.target.clone(),
            lightSettings: {
                rotation: lightRotation,
                height: lightHeight,
                intensity: lightIntensity
            },
            currentPatternScale: currentPatternScale,
            currentPatternOpacity: currentPatternOpacity,
            selectedPatternColor: selectedPatternColor,
            selectedPatternImage: selectedPatternImage,
            selectedPatternIsSVG: selectedPatternIsSVG,
            selectedPatternParts: JSON.parse(JSON.stringify(selectedPatternParts)),
            activeTextDecalIndex: activeTextDecalIndex,
            activeImageDecalIndex: activeImageDecalIndex,
            selectedTextColor: selectedTextColor,
            currentFontSize: currentFontSize,
            // Add model-specific data
            modelConfig: {
                colorMappings: getCurrentColorMappings(),
                design: currentModelType
            }
        };

        // Capture mesh-specific data
        if (model) {
            model.traverse(child => {
                if (child.isMesh && child.userData.gradient) {
                    state.meshes[child.name] = {
                        gradient: JSON.parse(JSON.stringify(child.userData.gradient)),
                        material: child.material.uuid
                    };
                }
            });
        }

        return state;
    }

    function getCurrentColorMappings() {
        const mappings = {};
        if (model) {
            model.traverse(child => {
                if (child.isMesh && child.material && child.material.color) {
                    mappings[child.name] = `#${child.material.color.getHexString()}`;
                }
            });
        }
        return mappings;
    }

    // Function to save state to undo stack
    function saveState() {
        const newState = captureState();

        // Don't save if identical to current state
        if (currentState && JSON.stringify(currentState) === JSON.stringify(newState)) {
            return;
        }

        if (currentState) {
            undoStack.push(currentState);
            if (undoStack.length > MAX_UNDO_STEPS) {
                undoStack.shift();
            }
        }

        currentState = newState;
        redoStack = []; // Clear redo stack when new action is performed

        updateUndoRedoButtons(); // Update button states
    }

    // Function to apply a state
    function applyState(state) {
        if (!state) return;
        isUndoRedoInProgress = true;

        // First clear existing decals
        textDecals = [];
        imageDecals = [];
        patternDecals = [];
        // Remove active class from all design items
        document.querySelectorAll(".designsItems").forEach(item => {
            item.classList.remove("active");
        });
        // Restore basic properties
        selectedTextColor = state.selectedTextColor || "#000000";
        currentFontSize = state.currentFontSize || 28;
        activeTextDecalIndex = state.activeTextDecalIndex || -1;
        activeImageDecalIndex = state.activeImageDecalIndex || -1;

        // Restore model if changed
        if (state.model && state.model !== currentModelFilename) {
            const modelPath = `assets/models/${state.model}`;
            // Find and activate the corresponding design item
            document.querySelectorAll(".designsItems img").forEach(img => {
                if (img.dataset.modal && img.dataset.modal.includes(state.model)) {
                    img.closest('.designsItems').classList.add("active");
                }
            });
            // Verify the model exists before trying to load
            fetch(modelPath)
                .then(response => {
                    if (response.ok) {
                        loadModel(modelPath, state.modelConfig.colorMappings, state.modelConfig.design);
                    } else {
                        console.warn("Model file not found, loading default");
                        loadDefaultModel();
                    }
                })
                .catch(error => {
                    console.error("Error verifying model:", error);
                    loadDefaultModel();
                });
        }

        // Restore background
        scene.background = new THREE.Color(state.backgroundColor);

        // Restore camera and controls
        camera.position.copy(state.cameraPosition);
        camera.rotation.copy(state.cameraRotation);
        controls.target.copy(state.controlsTarget);

        // Restore lights
        lightRotation = state.lightSettings.rotation;
        lightHeight = state.lightSettings.height;
        lightIntensity = state.lightSettings.intensity;
        updateLightPosition();
        mainLight.intensity = lightIntensity;

        // Restore text decals
        textDecals = state.textDecals.map(decalData => {
            const decal = {
                text: decalData.text,
                color: decalData.color,
                fontFamily: decalData.fontFamily,
                fontSize: decalData.fontSize,
                offset: new THREE.Vector2(decalData.offset.x, decalData.offset.y),
                rotation: decalData.rotation,
                mesh: model ? model.getObjectByName(decalData.mesh) : null,
                uuid: decalData.uuid,
                isLocked: decalData.isLocked,
                outlineWidth: decalData.outlineWidth,
                outlineColor: decalData.outlineColor,
                hasOutline: decalData.hasOutline
            };
            return decal;
        });

        // Restore image decals
        const imageLoadPromises = state.imageDecals.map(decalData => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const decal = {
                        image: img,
                        offset: new THREE.Vector2(decalData.offset.x, decalData.offset.y),
                        rotation: decalData.rotation,
                        scale: decalData.scale,
                        mesh: model ? model.getObjectByName(decalData.mesh) : null,
                        uuid: decalData.uuid,
                        isLocked: decalData.isLocked,
                        bounds: {
                            x: decalData.bounds.x,
                            y: decalData.bounds.y,
                            width: decalData.bounds.width,
                            height: decalData.bounds.height,
                            originalWidth: decalData.bounds.originalWidth,
                            originalHeight: decalData.bounds.originalHeight
                        }
                    };
                    imageDecals.push(decal);
                    resolve();
                };
                img.src = decalData.image;
            });
        });

        // Wait for all images to load before continuing
        Promise.all(imageLoadPromises).then(() => {
            // Restore pattern decals
            patternDecals = JSON.parse(JSON.stringify(state.patternDecals));

            // Restore pattern settings
            currentPatternScale = state.currentPatternScale;
            currentPatternOpacity = state.currentPatternOpacity;
            selectedPatternColor = state.selectedPatternColor;
            selectedPatternImage = state.selectedPatternImage;
            selectedPatternIsSVG = state.selectedPatternIsSVG;
            selectedPatternParts = JSON.parse(JSON.stringify(state.selectedPatternParts));

            // Restore mesh gradients
            if (model) {
                model.traverse(child => {
                    if (child.isMesh && state.meshes[child.name]) {
                        child.userData.gradient = state.meshes[child.name].gradient;
                        updateMeshTextureForMesh(child);
                    }
                });
            }

            // Update UI elements to match state
            updateUIFromState();

            // Update any pattern preview
            if (selectedPatternImage) {
                showPatternPreview();
            }

            // Update all textures
            updateAllMeshTextures();
            isUndoRedoInProgress = false;
        });
    }
    // Function to update UI elements from state
    function updateUIFromState() {
        // Update active decal selections
        if (activeTextDecalIndex >= 0 && activeTextDecalIndex < textDecals.length) {
            const decal = textDecals[activeTextDecalIndex];
            document.getElementById("textInput").value = decal.text;
            document.querySelector(".colorPicker").style.backgroundColor = decal.color;
            document.querySelector(".decalText").textContent = decal.text;
            rotateSlider.value = THREE.MathUtils.radToDeg(decal.rotation);
            document.getElementById("rotationValue").textContent = Math.round(THREE.MathUtils.radToDeg(decal.rotation));
        }

        if (activeImageDecalIndex >= 0 && activeImageDecalIndex < imageDecals.length) {
            const decal = imageDecals[activeImageDecalIndex];
            resizeImgSlider.value = decal.scale * 50;
            document.getElementById("resizeValue").textContent = Math.round(decal.scale * 100);
            rotateImgSlider.value = THREE.MathUtils.radToDeg(decal.rotation);
            document.getElementById("rotateImgValue").textContent = Math.round(THREE.MathUtils.radToDeg(decal.rotation));
            updateImagePreview();
        }

        // Update light controls
        lightRotationSlider.value = lightRotation;
        lightRotationValue.textContent = lightRotation + "°";
        lightHeightSlider.value = lightHeight;
        lightHeightValue.textContent = lightHeight;
        lightIntensitySlider.value = lightIntensity;
        lightIntensityValue.textContent = lightIntensity;

        // Update pattern controls
        patternScaleSlider.value = currentPatternScale * 100;
        patternScaleValueSpan.textContent = Math.round(currentPatternScale * 100) + "%";
        opacitySlider.value = currentPatternOpacity * 100;
        opacityValueSpan.textContent = Math.round(currentPatternOpacity * 100) + "%";
    }

    // Undo function
    function undo() {
        if (undoStack.length === 0) return;
        const state = undoStack.pop();
        redoStack.push(captureState());
        applyState(state);
        updateUndoRedoButtons(); // Update button states after undo
    }

    function redo() {
        if (redoStack.length === 0) return;
        const state = redoStack.pop();
        undoStack.push(captureState());
        applyState(state);
        updateUndoRedoButtons(); // Update button states after redo
    }
    updateUndoRedoButtons();
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undo();
        } else if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redo();
        }
    });
    // Add these with your other event listeners
    document.getElementById('undoButton').addEventListener('click', undo);
    document.getElementById('redoButton').addEventListener('click', redo);
    // UNDO REDO 

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
            saveState(); // Save state before centering
            const decal = textDecals[activeTextDecalIndex];
            // Calculate visual center for the specific mesh
            const visualCenter = calculateVisualCenterUV(decal.mesh);
            decal.offset.set(visualCenter.x - 0.5, visualCenter.y - 0.5);
            updateMeshTextureWithAllDecals();
            console.log(`Text decal centered at position: x=${decal.offset.x.toFixed(2)}, y=${decal.offset.y.toFixed(2)}`);
        } else if (activeImageDecalIndex >= 0) {
            const decal = imageDecals[activeImageDecalIndex];
            // Calculate visual center for the specific mesh
            const visualCenter = calculateVisualCenterUV(decal.mesh);
            decal.offset.set(visualCenter.x - 0.5, visualCenter.y - 0.5);
            updateMeshTextureWithAllDecals();
            console.log(`Image decal centered at position: x=${decal.offset.x.toFixed(2)}, y=${decal.offset.y.toFixed(2)}`);
            updateActiveImageDecalBounds();
        }
    });

    document.querySelectorAll(".text-transform").forEach((span) => {
        span.addEventListener("click", function () {
            if (activeTextDecalIndex >= 0) {
                saveState(); // Save state before transform
                const transformType = this.dataset.transform;
                applyTextTransformation(textDecals[activeTextDecalIndex], transformType);
                highlightActiveStyle(this);
                updateMeshTextureWithAllDecals();
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




    // Zoom in
    zoomInBtn.addEventListener("mousedown", () => {
        isZooming = true;
        zoomDirection = 1;
        controls.autoRotate = false;
    });

    zoomInBtn.addEventListener("mouseup", () => {
        isZooming = false;
        zoomDirection = 0;
    });

    zoomInBtn.addEventListener("mouseleave", () => {
        isZooming = false;
        zoomDirection = 0;
    });

    // Zoom out
    zoomOutBtn.addEventListener("mousedown", () => {
        isZooming = true;
        zoomDirection = -1;
        controls.autoRotate = false;
    });

    zoomOutBtn.addEventListener("mouseup", () => {
        isZooming = false;
        zoomDirection = 0;
    });

    zoomOutBtn.addEventListener("mouseleave", () => {
        isZooming = false;
        zoomDirection = 0;
    });
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

    function createGradientTexture(color1, color2) {
        const canvas = document.createElement("canvas");

        canvas.width = 1024;

        canvas.height = 1024;

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
            // Save state before changing design
            saveState();

            // Add loading state
            document.getElementById("preloader").style.display = "flex";

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
            // Only add active class if a modal URL is provided
            if (modal) {
                this.closest('.designsItems').classList.add("active");
            }
            // Only load the new model if a modal URL is provided
            if (modal) {
                // Clear previous model first
                clearPreviousModel();
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
    controls.dampingFactor = 0.06; // Damping inertia factor (lower = more smooth)
    controls.rotateSpeed = 0.6; // Rotation speed (default is 1)
    controls.enablePan = true; // Disable panning if you only want rotation
    // Limit zoom
    controls.minDistance = 4; // Minimum zoom distance
    controls.maxDistance = 25; // Maximum zoom distance
    controls.maxPolarAngle = Math.PI * 0.9; // Limit vertical rotation (prevent flipping)

    // Get the buttons for resizing the font
    const minusButton = document.querySelector(".TextDecalSizeMinus");
    const plusButton = document.querySelector(".TextDecalSizePlus");

    // Event listener for decreasing the font size
    minusButton.addEventListener("click", () => {
        if (currentFontSize > 10 && activeTextDecalIndex >= 0) {
            saveState(); // Save state before size change
            currentFontSize -= 10;
            textDecals[activeTextDecalIndex].fontSize = currentFontSize;
            updateMeshTextureWithAllDecals();
            updateActiveDecalBounds();
        }
    });

    plusButton.addEventListener("click", () => {
        if (activeTextDecalIndex >= 0) {
            saveState(); // Save state before size change
            currentFontSize += 10;
            textDecals[activeTextDecalIndex].fontSize = currentFontSize;
            updateMeshTextureWithAllDecals();
            updateActiveDecalBounds();
        }
    });

    // Event listener for image resizing
    resizeImgSlider.addEventListener("input", (event) => {
        const scaleValue = event.target.value / 50; // Convert 10-200 range to 0.2-4.0 scale
        resizeValueSpan.textContent = `${event.target.value}%`;
        if (activeImageDecalIndex >= 0) {
            saveState(); // Save state before resizing
            imageDecals[activeImageDecalIndex].scale = scaleValue;
            console.log(`Resizing image ${activeImageDecalIndex} to scale ${scaleValue.toFixed(2)}`);
            updateMeshTextureWithAllDecals();
        }
    });

    async function createImageTexture(imageFile, isSelected = false) {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            canvas.width = 1024; // Increased resolution
            canvas.height = 1024;
            const context = canvas.getContext("2d");

            // Fill with white background
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);

            const img = new Image();
            img.onload = function () {
                // Calculate dimensions to maintain aspect ratio
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

                // Create texture with better filtering
                const texture = new THREE.CanvasTexture(canvas);
                texture.flipY = false;
                texture.center.set(0.5, 0.5);
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.generateMipmaps = true;
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

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



    // Event listener for pattern scale
    patternScaleSlider.addEventListener("input", (event) => {
        saveState(); // Save state before scale change
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
                    Plane: {
                        displayName: "Front",
                        uvCorrection: { x: 0, y: 0 } // No correction needed
                    },
                    Plane_1: {
                        displayName: "Back",
                        uvCorrection: { x: 0, y: 0 }
                    },
                    Plane_4: {
                        displayName: "Left Sleeve",
                        uvCorrection: { x: 0, y: -0.2 } // Adjust sleeve vertical position
                    }
                }
            },
            'abcdef.glb': {
                placementMeshes: {
                    Plane_2: { displayName: "Front", image: "front.png", targetAngle: 0 },
                    Plane_3: { displayName: "Back", image: "back.png", targetAngle: Math.PI },
                    Plane_6: { displayName: "Left Sleeve", image: "back.png", targetAngle: -Math.PI / 2 },
                    Plane_7: { displayName: "Right Sleeve", image: "back.png", targetAngle: Math.PI / 2 }
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
                    // Plane_1: { displayName: "Front", image: "back.png" },
                    Plane: { displayName: "Back", image: "front.png" },
                }
            },
            'anikaMamModal.glb': {
                placementMeshes: {
                    Plane_3: { displayName: "Front", image: "front.png", targetAngle: 0 },
                    Plane_4: { displayName: "Back", image: "back.png", targetAngle: Math.PI },
                    Plane_5: { displayName: "Left Sleeve", image: "back.png", targetAngle: -Math.PI / 2 },
                    Plane_6: { displayName: "Right Sleeve", image: "back.png", targetAngle: Math.PI / 2 }
                }
            },
        },
        // For fullSleeves models
        fullSleeves: {
            'rhBasketball-Slam-Dunk.glb': {
                placementMeshes: {
                    Plane_1: { displayName: "Front", image: "front.png" },
                    Plane_2: { displayName: "Back", image: "back.png" },
                    Plane_3: { displayName: "Left Sleeve", image: "sleeve.png" },
                    Plane_3: { displayName: "Right Sleeve", image: "sleeve.png" }
                },
                'anikaMamModal.glb': {
                    placementMeshes: {
                        Plane_3: { displayName: "Front", image: "front.png", targetAngle: 0 },
                        Plane_4: { displayName: "Back", image: "back.png", targetAngle: Math.PI },
                        Plane_5: { displayName: "Left Sleeve", image: "back.png", targetAngle: -Math.PI / 2 },
                        Plane_6: { displayName: "Right Sleeve", image: "back.png", targetAngle: Math.PI / 2 }
                    }
                },
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
            },
            'anikaMamModal.glb': {
                placementMeshes: {
                    Plane_3: { displayName: "Front", image: "front.png", targetAngle: 0 },
                    Plane_4: { displayName: "Back", image: "back.png", targetAngle: Math.PI },
                    Plane_5: { displayName: "Left Sleeve", image: "back.png", targetAngle: -Math.PI / 2 },
                    Plane_6: { displayName: "Right Sleeve", image: "back.png", targetAngle: Math.PI / 2 }
                }
            },
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
            },
            'anikaMamModal.glb': {
                placementMeshes: {
                    Plane_3: { displayName: "Front", image: "front.png", targetAngle: 0 },
                    Plane_4: { displayName: "Back", image: "back.png", targetAngle: Math.PI },
                    Plane_5: { displayName: "Left Sleeve", image: "back.png", targetAngle: -Math.PI / 2 },
                    Plane_6: { displayName: "Right Sleeve", image: "back.png", targetAngle: Math.PI / 2 }
                }
            },
        }
    };

    async function applyImageToSelectedMesh(imageFile, uv) {
        saveState(); // Add this at the start
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

            // Reset placement mode
            resetImagePlacementMode();

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



    // Modify the pattern selection event listeners
    // Modify your pattern selection event listeners
    document.querySelectorAll(".patternsItems").forEach((item) => {
        item.addEventListener("click", function () {
            // Remove active class from all pattern items
            document.querySelectorAll(".patternsItems").forEach((i) => {
                i.classList.remove("active");
            });

            // Add active class to clicked item
            this.classList.add("active");

            // Store the selected pattern image path and type
            const patternSrc = this.dataset.image;
            const isSVG = patternSrc.endsWith('.svg');

            if (isSVG) {
                // For SVG patterns, we'll load the raw SVG content
                fetch(patternSrc)
                    .then(response => response.text())
                    .then(svgContent => {
                        selectedPatternImage = svgContent;
                        selectedPatternIsSVG = true;
                        console.log("Selected SVG pattern loaded");
                        showPatternPreview();
                    });
            } else {
                // For regular images
                selectedPatternImage = patternSrc;
                selectedPatternIsSVG = false;
                console.log("Selected image pattern");
                showPatternPreview();
            }
        });
    });
    // Event listener for pattern opacity
    opacitySlider.addEventListener("input", (event) => {
        saveState(); // Save state before opacity change

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
    document.getElementById("updateTextButton").addEventListener("click", updateActiveTextDecal);
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
            (part) => selectedPatternParts[part]
        );
        if (!selectedPatternImage || selectedParts.length === 0) return;

        // Hide color picker container since we're using the palette

        // Add preview after a small delay
        patternPreviewTimeout = setTimeout(() => {
            if (selectedPatternIsSVG) {
                // Use the current selected color (defaults to #1c538e)
                const svgWithCustomColor = customizeSVGColor(selectedPatternImage, selectedPatternColor);
                applySVGPreview(selectedParts, svgWithCustomColor);
            } else {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = function () {
                    applyImagePreview(selectedParts, img);
                };
                img.src = selectedPatternImage;
            }
        }, 100);
    }

    function applySVGPreview(selectedParts, svgContent) {
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = function () {
            selectedParts.forEach((part) => {
                const mesh = model.getObjectByName(part);
                if (!mesh) {
                    console.warn(`Mesh not found: ${part}`);
                    return;
                }

                // Create canvas with pattern
                const canvas = document.createElement("canvas");
                canvas.width = 1024;
                canvas.height = 1024;
                const ctx = canvas.getContext("2d");

                const pattern = ctx.createPattern(img, "repeat");
                ctx.globalAlpha = currentPatternOpacity;
                ctx.fillStyle = pattern;

                // Apply pattern scaling
                const patternScale = 1 / currentPatternScale;
                const patternTransform = new DOMMatrix();
                patternTransform.scaleSelf(patternScale, patternScale);

                if (typeof pattern.setTransform === "function") {
                    pattern.setTransform(patternTransform);
                }

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
                    isSVG: true,
                    svgContent: svgContent
                };

                patternDecals.push(previewDecal);
                currentPatternPreview = previewDecal;
            });

            updateAllMeshTextures();
            console.log("SVG pattern preview shown on selected parts");
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }

    function applyImagePreview(selectedParts, img) {
        // Your existing image preview code
        selectedParts.forEach((part) => {
            const mesh = model.getObjectByName(part);
            if (!mesh) {
                console.warn(`Mesh not found: ${part}`);
                return;
            }

            // Create canvas with pattern
            const canvas = document.createElement("canvas");
            canvas.width = 1024;
            canvas.height = 1024;
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
                isSVG: false
            };

            patternDecals.push(previewDecal);
            currentPatternPreview = previewDecal;
        });

        updateAllMeshTextures();
        console.log("Pattern preview shown on selected parts");
    }



    // Add event listeners for angle buttons
    const cameraPositions = {
        front: { x: 0, y: 0, z: 5, angle: 0 },
        back: { x: 0, y: 1, z: -5, angle: Math.PI },
        right: { x: -5, y: 1, z: 0, angle: Math.PI / 2 },
        left: { x: 5, y: 1, z: 0, angle: -Math.PI / 2 }
    };
    // Add event listeners for view angle buttons
    document.querySelectorAll('.view-angle-controls button').forEach(button => {
        button.addEventListener('click', function () {
            const view = this.classList[0]; // Get the class name (e.g., 'frontAngle')
            const position = cameraPositions[view.replace('Angle', '')]; // Get the corresponding camera position

            if (position && model) {
                // Calculate distance based on model size
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const distance = maxDim * 1.5; // Adjust multiplier as needed

                // Set camera position with dynamic distance
                camera.position.set(
                    position.x * distance,
                    position.y * distance,
                    position.z * distance
                );

                camera.lookAt(0, 0, 0); // Look at the center of the scene
                controls.update(); // Update controls

                // Re-enable after a short delay
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
            Plane: "Plane",
            Plane_1: "Plane_1",
            Plane_2: "Plane_2",
            Plane_3: "Plane_3",
            Plane_4: "Plane_4",
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
        canvas.width = 1024;
        canvas.height = 1024;
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
        // Save state after gradient change
        saveState();
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
                if (!decalClicked) {
                    activeTextDecalIndex = -1;
                    document.getElementById('updateTextButton').style.display = 'none';
                }
                if (uv.x >= bounds.x && uv.x <= bounds.x + bounds.width &&
                    uv.y >= bounds.y && uv.y <= bounds.y + bounds.height) {
                    // Toggle selection
                    if (activeTextDecalIndex === i) {
                        activeTextDecalIndex = -1;
                        document.getElementById('screen3').style.display = 'none';
                        document.getElementById('screen1').style.display = 'block';
                        document.getElementById('updateTextButton').style.display = 'none'; // Hide button
                    } else {
                        activeTextDecalIndex = i;
                        activeImageDecalIndex = -1;
                        showTextEditingScreen();
                        document.getElementById('updateTextButton').style.display = 'block'; // Show button
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
                    x: 0.5 + decal.offset.x - textWidth / 1024 / 2,
                    y: 0.5 + decal.offset.y - textHeight / 1024 / 2,
                    width: textWidth / 1024,
                    height: textHeight / 1024
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
    document.getElementById("gradientAngle").addEventListener("input", function (e) {
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
    document.getElementById("lockDecalButton").addEventListener("click", lockActiveDecal);
    document.getElementById("unlockDecalButton").addEventListener("click", unlockActiveDecal);

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
                    canvas.width = 1024;
                    canvas.height = 1024;
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
    document.querySelectorAll('.patternArea input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            saveState();
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
        saveState(); // Save state before applying pattern
        if (!selectedPatternImage) {
            alert("Please select a pattern first");
            return;
        }

        const selectedParts = Object.keys(selectedPatternParts).filter(
            (part) => selectedPatternParts[part]
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

        if (selectedPatternIsSVG) {
            // Process SVG pattern
            const svgWithCustomColor = customizeSVGColor(selectedPatternImage, selectedPatternColor);
            applySVGPattern(selectedParts, svgWithCustomColor);
        } else {
            // Process regular image pattern
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function () {
                applyImagePattern(selectedParts, img);
            };
            img.src = selectedPatternImage;
        }

    }


    function customizeSVGColor(svgContent, color) {
        // Replace all stroke colors in the SVG
        return svgContent.replace(/stroke="[^"]*"/g, `stroke="${color}"`);
    }
    // Add this near your other color palette event listeners
    document.querySelectorAll('.patternColorPallet .palette').forEach(palette => {
        palette.addEventListener('click', (e) => {
            saveState(); // Save state before color change
            if (!selectedPatternImage || !selectedPatternIsSVG) return;
            // Get the selected color from the palette
            selectedPatternColor = e.target.dataset.color;

            // Recolor all SVG pattern decals with the new color
            patternDecals.forEach(decal => {
                if (decal.isSVG) {
                    const svgWithCustomColor = customizeSVGColor(decal.svgContent, selectedPatternColor);

                    // Create new image with updated color
                    const svgBlob = new Blob([svgWithCustomColor], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(svgBlob);

                    const img = new Image();
                    img.onload = function () {
                        decal.image = img;
                        updateMeshTextureForMesh(decal.mesh);
                        URL.revokeObjectURL(url);
                    };
                    img.src = url;
                }
            });

            // Also update the preview if showing an SVG pattern
            if (currentPatternPreview && currentPatternPreview.isSVG) {
                showPatternPreview();
            }
        });
    });
    function applySVGPattern(selectedParts, svgContent) {
        // Create an image from the SVG content
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = function () {
            selectedParts.forEach((part) => {
                const mesh = model.getObjectByName(part);
                if (!mesh) {
                    console.warn(`Mesh not found: ${part}`);
                    return;
                }

                // Create canvas with pattern
                const canvas = document.createElement("canvas");
                canvas.width = 1024;
                canvas.height = 1024;
                const ctx = canvas.getContext("2d");

                const pattern = ctx.createPattern(img, "repeat");
                ctx.globalAlpha = currentPatternOpacity;
                ctx.fillStyle = pattern;

                // Apply pattern scaling
                const patternScale = 1 / currentPatternScale;
                const patternTransform = new DOMMatrix();
                patternTransform.scaleSelf(patternScale, patternScale);

                if (typeof pattern.setTransform === "function") {
                    pattern.setTransform(patternTransform);
                }

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
                        originalWidth: 1024,
                        originalHeight: 1024,
                    },
                    isFullCoverage: true,
                    opacity: currentPatternOpacity,
                    isSVG: true,
                    svgContent: svgContent // Store original SVG content for re-coloring
                };

                patternDecals.push(newDecal);
            });

            updateAllMeshTextures();
            console.log(`Applied SVG pattern to ${selectedParts.join(", ")}`);
        };
        img.src = url;
    }

    function applyImagePattern(selectedParts, img) {
        selectedParts.forEach((part) => {
            const mesh = model.getObjectByName(part);
            if (!mesh) {
                console.warn(`Mesh not found: ${part}`);
                return;
            }

            // Create canvas with pattern (same as your existing code)
            const canvas = document.createElement("canvas");
            canvas.width = 1024;
            canvas.height = 1024;
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
                    originalWidth: 1024,
                    originalHeight: 1024,
                },
                isFullCoverage: true,
                opacity: currentPatternOpacity,
                isSVG: false
            };

            patternDecals.push(newDecal);
        });

        updateAllMeshTextures();
        console.log(`Applied image pattern to ${selectedParts.join(", ")}`);
    }



    // New function to remove pattern from a specific part
    function removePatternFromPart(part) {
        saveState(); // Save state before removing pattern

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
        canvas.width = 1024;
        canvas.height = 1024;
        // Check if this mesh has an SVG pattern
        if (mesh.userData.pattern && mesh.userData.pattern.isSvg) {
            // Reapply the SVG pattern (this ensures it stays even when other decals are added)
            loadSvgPatternForMesh(mesh, mesh.userData.pattern.svgPath);
            return;
        }

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
        canvas.width = 1024;
        canvas.height = 1024;

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
    document.querySelector('.outline-minus').addEventListener('click', () => {
        if (activeTextDecalIndex >= 0) {
            saveState(); // Save state before outline change
            const decal = textDecals[activeTextDecalIndex];
            decal.outlineWidth = Math.max(0, decal.outlineWidth - 1);
            document.getElementById('outlineWidthValue').textContent = `${decal.outlineWidth}px`;
            updateMeshTextureWithAllDecals();
        }
    });

    document.querySelector('.outline-plus').addEventListener('click', () => {
        if (activeTextDecalIndex >= 0) {
            saveState(); // Save state before outline change
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
                saveState(); // Save state before outline change
                const decal = textDecals[activeTextDecalIndex];
                decal.outlineColor = e.target.dataset.color;
                decal.hasOutline = true;
                updateMeshTextureWithAllDecals();
            }
        });
    });

    document.getElementById('toggleOutlineButton').addEventListener('click', () => {
        if (activeTextDecalIndex >= 0) {
            saveState(); // Save state before outline change
            const decal = textDecals[activeTextDecalIndex];
            decal.hasOutline = !decal.hasOutline;
            updateMeshTextureWithAllDecals();
        }
    });

    // Event listener for image rotation
    rotateImgSlider.addEventListener("input", (event) => {
        const rotationValue = event.target.value;
        rotateImgValueSpan.textContent = `${rotationValue}°`;
        if (activeImageDecalIndex >= 0) {
            saveState(); // Save state before rotation
            imageDecals[activeImageDecalIndex].rotation = THREE.MathUtils.degToRad(rotationValue);
            console.log(`Rotating image ${activeImageDecalIndex} to ${rotationValue}°`);
            updateMeshTextureWithAllDecals();
        }
    });

    function updateActiveImageDecalBounds() {
        if (activeImageDecalIndex < 0 || !selectedMesh) return;

        const activeDecal = imageDecals[activeImageDecalIndex];
        const canvasWidth = 1024;
        const canvasHeight = 1024;

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



    function updateLightPosition() {
        // Convert rotation to radians
        const radians = THREE.MathUtils.degToRad(lightRotation);

        // Calculate position in a circle around the model
        const x = Math.cos(radians) * lightDistance;
        const z = Math.sin(radians) * lightDistance;

        // Set the light position
        mainLight.position.set(x, lightHeight, z);

        // Make the light look at the center of the scene
        mainLight.lookAt(0, 0, 0);


    }

    // Rotation slider
    lightRotationSlider.addEventListener("input", function () {
        lightRotation = parseFloat(this.value);
        lightRotationValue.textContent = lightRotation + "°";
        updateLightPosition();
    });

    // Height slider
    lightHeightSlider.addEventListener("input", function () {
        lightHeight = parseFloat(this.value);
        lightHeightValue.textContent = lightHeight;
        updateLightPosition();
    });

    // Intensity slider
    lightIntensitySlider.addEventListener("input", function () {
        lightIntensity = parseFloat(this.value);
        lightIntensityValue.textContent = lightIntensity;
        mainLight.intensity = lightIntensity;
    });

    // Initial light position update
    updateLightPosition();



    // Flag to check if text can be applied

    // Variables to track the current selected mesh and stored text
    // Add event listener to select mesh by mouse click
    document.addEventListener("click", selectMeshUnderMouse);
    // Function to apply text texture to selected mesh

    // Modify your click event listener to check for text clicks
    document.addEventListener("click", (event) => {
        // Skip if we're moving existing decals
        if (isTextMoving || isImageMoving) return;
        if (!model) return; // Add this check at the start of your click handler
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
        document.body.style.cursor = ""; // Ensure cursor is reset to default
        controls.enabled = true; // Re-enable controls
    }

    function resetTextPlacementMode() {
        isReadyToApplyText = false;
        pendingText = null;
        document.body.classList.remove("cursor-active");
        document.body.style.cursor = ""; // Ensure cursor is reset to default
        controls.enabled = true; // Re-enable controls
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

        // Reset placement mode
        resetTextPlacementMode();

        // Always show screen 3 when text is placed
        showTextEditingScreen();
        console.log(`Applying decal at UV: ${uv.x.toFixed(2)}, ${uv.y.toFixed(2)} to mesh: ${selectedMesh.name}`);
    }
    // New function to composite all texts onto the mesh texture
    function updateMeshTextureWithAllTexts() {
        if (!selectedMesh) return;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 1024;
        canvas.height = 1024;

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
        const canvasWidth = 1024;
        const canvasHeight = 1024;

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
        // Find mesh by name (case insensitive, with fallbacks)
        selectedMesh = findMeshByName(model, meshName);

        if (!selectedMesh) {
            console.error(`Mesh ${meshName} not found in model`);
            return;
        }

        // Calculate the true visual center of the mesh
        const uv = calculateVisualCenterUV(selectedMesh);

        if (decalType === 'text' && isReadyToApplyText && pendingText) {
            applyTextToSelectedMesh(pendingText, uv);
            resetTextPlacementMode(); // Reset cursor and placement mode
        }
        else if (decalType === 'image' && isReadyToPlaceImage && pendingImageFile) {
            applyImageToSelectedMesh(pendingImageFile, uv);
            resetImagePlacementMode(); // Reset cursor and placement mode
        }
    }
    function calculateVisualCenterUV(mesh) {
        if (!mesh.geometry.attributes.uv) return new THREE.Vector2(0.5, 0.5);

        // Get the geometry's bounding box in world space
        const box = new THREE.Box3().setFromObject(mesh);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Convert world position to UV coordinates
        const uv = findClosestUV(mesh, center);

        // Special handling for sleeves and other wrapped parts
        if (mesh.name.toLowerCase().includes('sleeve')) {
            // For sleeves, we want to center horizontally but keep vertical position
            return new THREE.Vector2(0.5, uv.y);
        }

        return uv;
    }

    function findClosestUV(mesh, worldPosition) {
        const geometry = mesh.geometry;
        const position = geometry.attributes.position;
        const uv = geometry.attributes.uv;

        // Transform world position to mesh local space
        const inverseMatrix = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
        const localPosition = worldPosition.clone().applyMatrix4(inverseMatrix);

        // Find closest vertex
        let closestDistance = Infinity;
        let closestUV = new THREE.Vector2(0.5, 0.5);

        for (let i = 0; i < position.count; i++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(position, i);
            const distance = vertex.distanceTo(localPosition);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestUV.set(uv.getX(i), uv.getY(i));
            }
        }

        return closestUV;
    }
    // Helper function to robustly find meshes
    function findMeshByName(model, name) {
        // Try exact match first
        let mesh = model.getObjectByName(name);
        if (mesh) return mesh;

        // Try case insensitive
        model.traverse(child => {
            if (child.isMesh && child.name.toLowerCase() === name.toLowerCase()) {
                mesh = child;
            }
        });

        return mesh;
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

    // Call this function in your animation loop
    function animate() {
        requestAnimationFrame(animate);

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

    // Function to handle mesh selection
    function selectMeshUnderMouse(event) {
        if (!model) return; // Add this check
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
                    document.getElementById('updateTextButton').style.display = 'block'; // Show button
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
                        x: 0.5 + decal.offset.x - textWidth / 1024 / 2,
                        y: 0.5 + decal.offset.y - textHeight / 1024 / 2,
                        width: textWidth / 1024,
                        height: textHeight / 1024,
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
            // Only save state on first movement to avoid too many states
            if (!this.hasSavedMovementState) {
                saveState();
                this.hasSavedMovementState = true;
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
        const canvasWidth = 1024;
        const canvasHeight = 1024;

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

    // Event listener to handle font family change
    fontFamilySelect.addEventListener("change", (event) => {
        if (activeTextDecalIndex >= 0) {
            saveState(); // Save state before font change
            textDecals[activeTextDecalIndex].fontFamily = event.target.value;
            updateMeshTextureWithAllDecals();
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
        if (!model) return; // Add this check
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
        if (activeTextDecalIndex >= 0) {
            saveState(); // Save state before rotation
            const rotationValue = event.target.value;
            rotationValueSpan.textContent = rotationValue;
            textDecals[activeTextDecalIndex].rotation = THREE.MathUtils.degToRad(rotationValue);
            updateMeshTextureWithAllDecals();
        }
    });

    // roateText

    // borderButtons

    // Action flags



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
            document.getElementById('updateTextButton').style.display = 'none'; // Hide button
            updateMeshTextureWithAllDecals(); // Update only the decals
        }
        // Then check if we're deleting an image decal
        else if (activeImageDecalIndex >= 0) {
            saveState(); // Save state before deletion
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
            saveState(); // Save state before deletion
            console.log(`Deleting text decal ${activeTextDecalIndex}`);
            textDecals.splice(activeTextDecalIndex, 1);
            activeTextDecalIndex = -1;
            isTextSelected = false;

            // Hide Screen 3 and show Screen 1 when text decal is deleted
            document.getElementById('screen3').style.display = 'none';
            document.getElementById('screen1').style.display = 'block';
            document.getElementById('updateTextButton').style.display = 'none'; // Hide button
            updateMeshTextureWithAllDecals();
            console.log("Text decal deleted");
        } else {
            console.log("No text decal selected to delete");
        }
    });

    // Delete Image Decal Button
    document.getElementById("deleteImageButton").addEventListener("click", () => {
        if (activeImageDecalIndex >= 0) {
            saveState(); // Save state before deletion
            console.log(`Deleting image decal ${activeImageDecalIndex}`);
            imageDecals.splice(activeImageDecalIndex, 1);
            activeImageDecalIndex = -1;
            isImageSelected = false;
            // Clear the preview when deleting
            uploadedImagePreview.style.display = "none";
            imagePreviewBorder.style.display = "none";
            updateMeshTextureWithAllDecals(); // Update only the decals
            console.log("Image decal deleted");
            // Redirect to logo first screen after deletion
            document.querySelector('.logoFourthScreen').style.display = 'none';
            document.querySelector('.logoSecondScreen').style.display = 'none';
            document.querySelector('.logoFirstScreen').style.display = 'block';
        } else {
            console.log("No image decal selected to delete");
        }
    })
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



    function animate() {
        requestAnimationFrame(animate);

        // Handle zooming
        if (isZooming) {
            // Calculate new distance
            let newDistance = camera.position.distanceTo(controls.target);
            newDistance *= (1 - (zoomSpeed * zoomDirection));

            // Apply zoom by moving camera along its current direction
            const direction = new THREE.Vector3()
                .subVectors(camera.position, controls.target)
                .normalize();

            // Calculate new position
            const newPosition = new THREE.Vector3()
                .copy(controls.target)
                .add(direction.multiplyScalar(newDistance));

            camera.position.copy(newPosition);
        }

        // Rest of your existing animation code...
        if (Math.abs(targetRotationY - currentRotationY) > 0.01) {
            currentRotationY += (targetRotationY - currentRotationY) * rotationSpeed;
            model.rotation.y = currentRotationY;
        }

        if (isRotating) {
            model.rotation.y += rotationSpeed * rotationDirection;
            currentRotationY = model.rotation.y;
            targetRotationY = currentRotationY;
        } else if (rotationDirection !== 0) {
            model.rotation.y += rotationSpeed * rotationDirection;
            currentRotationY = model.rotation.y;
            targetRotationY = currentRotationY;
            rotationDirection *= rotationDamping;
            if (Math.abs(rotationDirection) < 0.001) rotationDirection = 0;
        }

        // Update light positions smoothly


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
