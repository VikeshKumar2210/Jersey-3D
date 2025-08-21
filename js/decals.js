// Add these at the top with your other variables
let loadingProgress = 0;
let loadingStartTime = null;
let loadingInterval = null;
const preloaderElement = document.getElementById("preloader");
const progressTextElement = document.getElementById("preloaderProgress");
const timeRemainingElement = document.getElementById("preloaderTimeRemaining");
let fabricTexture = null;
const textureLoader = new THREE.TextureLoader();
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
    // New lighting setup:
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(ambientLight);

    // Key Light (front)
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 0.1);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    // Fill Light (back)
    const fillLight = new THREE.DirectionalLight(0xFFFFFF, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Rim Light (side)
    const rimLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
    rimLight.position.set(-5, 5, 5);
    scene.add(rimLight);

    // Back Light (optional)
    const backLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
    backLight.position.set(0, 0, -5);
    scene.add(backLight);

    const mainLight = new THREE.DirectionalLight(0x404040, 0.8);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const selectedColors = {
        color1: "#FF0000",
        color2: "#FFFF00"
    };


    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
    directionalLight.position.set(0, 6, 1).normalize();
    scene.add(directionalLight);

    // -----------------------------------------------
    //     LET VARIABLES
    // ------------------------------------------------


    // Add this with your other event listeners
    // Add this with your other variables at the top
    let isRotationLocked = false;

    // Add this with your other event listeners
    document.getElementById('toggleRotationBtn').addEventListener('click', function () {
        isRotationLocked = !isRotationLocked;
        controls.enableRotate = !isRotationLocked;

        // Update button content
        if (isRotationLocked) {
            this.innerHTML = '<img src="images/icons/Lock.png" alt="Unlock Model">';
            this.classList.add('locked');
        } else {
            this.innerHTML = '<img src="images/icons/Unlock.png" alt="Lock Model">';
            this.classList.remove('locked');
        }

        console.log(`Model rotation ${isRotationLocked ? 'locked' : 'unlocked'}`);
    });

    // Initialize the button state on page load
    document.getElementById('toggleRotationBtn').innerHTML = '<img src="images/icons/Unlock.png" alt="Lock Model">';
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
    let currentFontSize = 60; // Default font size
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
    // let textDecals = []; // Array to store all text decals
    window.textDecals = window.textDecals || [];
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

    //let imageDecals = []; // Array to store all image decals
    window.imageDecals = window.imageDecals || [];
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
        primary: null,  // Will be set from SVG
        secondary: null, // Will be set from SVG
        tertiary: null   // Will be set from SVG
    };
    const rotationSpeed = 0.07; // Speed of rotation
    const designColors = {
        halfSleeves: {
            primary: 0xfdb515, // Example color for Design1
            secondary: 0x00003b,
            tertiary: 0xFFFFFF,
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

    // Helper function to capitalize group names
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function loadDesignFromLocalStorage() {
        const savedJSON = localStorage.getItem("savedDesign");
        const savedMeshColors = localStorage.getItem("savedMeshColors");
        if (savedMeshColors) {
            window.MESH_COLORS = JSON.parse(savedMeshColors);
        }

        try {
            if (savedJSON) {
                const saved = JSON.parse(savedJSON);
                console.log("Restoring design from localStorage:", saved);

                // Restore text decals
                window.textDecals = (saved.textDecals || []).map(d => ({
                    ...d,
                    offset: new THREE.Vector2(d.offset.x, d.offset.y),
                    mesh: model.getObjectByName(d.meshName) || null
                }));

                // Restore image decals
                window.imageDecals = (saved.imageDecals || []).map(d => {
                    const image = new Image();
                    const decal = {
                        ...d,
                        offset: new THREE.Vector2(d.offset.x, d.offset.y),
                        mesh: model.getObjectByName(d.meshName) || null,
                        image: image,
                    };
                    image.onload = () => updateMeshTextureWithAllDecals();
                    if (d.imageSrc) image.src = d.imageSrc;
                    return decal;
                });

                // Restore other state
                window.selectedTextColor = saved.selectedTextColor || "#000000";
                window.activeTextDecalIndex = saved.activeTextDecalIndex ?? -1;

                if (saved.backgroundColor) {
                    scene.background = new THREE.Color(saved.backgroundColor);
                    updateLightingForNewBackground?.();
                }

                setTimeout(() => {
                    updateMeshTextureWithAllDecals();
                    updateDecalsListUI?.();
                }, 150);
            }
            // ✅ Restore mesh COLORS from localStorage on page load
            setTimeout(() => {
                if (window.MESH_COLORS && model) {
                    model.traverse(child => {
                        if (!child.isMesh || !child.userData.pattern || !child.userData.pattern.isSvg) return;

                        const meshName = child.name;
                        const savedColor = window.MESH_COLORS[meshName];
                        if (!savedColor) return;

                        const patternData = child.userData.pattern;
                        const originalColors = patternData.originalColors || [];

                        let customizedSvg = patternData.originalSvg || patternData.svgContent;
                        patternData.originalSvg = patternData.originalSvg || patternData.svgContent;

                        originalColors.forEach(originalColor => {
                            const regex = new RegExp(`(${originalColor}|${originalColor.toLowerCase()}|${originalColor.toUpperCase()})`, 'g');
                            customizedSvg = customizedSvg.replace(regex, savedColor);
                        });

                        const parser = new DOMParser();
                        const svgDoc = parser.parseFromString(customizedSvg, "image/svg+xml");
                        const svgElement = svgDoc.querySelector('svg');

                        let svgWidth = parseFloat(svgElement.getAttribute('width') || svgElement.viewBox.baseVal.width || 1024);
                        let svgHeight = parseFloat(svgElement.getAttribute('height') || svgElement.viewBox.baseVal.height || 1024);

                        const svgBlob = new Blob([customizedSvg], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(svgBlob);

                        const img = new Image();
                        img.onload = function () {
                            const canvas = document.createElement("canvas");
                            canvas.width = svgWidth;
                            canvas.height = svgHeight;
                            const ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                            const baseTexture = new THREE.CanvasTexture(canvas);
                            baseTexture.flipY = false;
                            child.userData.pattern.baseTexture = baseTexture;

                            updateMeshTextureForMesh(child);
                            URL.revokeObjectURL(url);
                        };
                        img.src = url;
                    });
                }
            }, 300);

        } catch (e) {
            console.warn("❌ Failed to restore design from localStorage:", e);
        }
    }

    function updateZoneColorPreviews() {
        // Merge both zone and subzone maps
        const allZones = { ...zoneColorGroupMap, ...subZoneColorGroupMap };

        for (const zone in allZones) {
            const meshMap = allZones[zone];
            const meshNames = Object.keys(meshMap);

            let finalColor = null;

            // Check if any mesh has a color assigned
            for (const mesh of meshNames) {
                if (window.MESH_COLORS && window.MESH_COLORS[mesh]) {
                    finalColor = window.MESH_COLORS[mesh];
                    break;
                }
            }

            if (finalColor) {
                const previewBox = document.getElementById(`colorPreview-${zone}`);
                if (previewBox) {
                    previewBox.style.backgroundColor = finalColor;
                }
            }
        }
    }



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
    document.querySelectorAll('.background-palette .palette').forEach(palette => {
        palette.addEventListener('click', (e) => {
            const color = e.target.dataset.color;
            scene.background = new THREE.Color(color);
            document.getElementById('bgColorPicker').value = color.startsWith('#') ? color : `#${color}`;
            updateLightingForNewBackground();
            saveDesignToLocalStorage(); // ✅ Save updated background color
        });
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
        'Tri_V-neck_1_stripe_5New3.glb': {
            // neck_1_stripe_5New2
            Plane087_1: "assets/ModalPatterns/modal7/InsidePatch.svg", // Neck Inside Patch
            Plane087: "assets/ModalPatterns/modal7/JOGStripe.svg", // Neck Inside Stripe
            Plane003: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Front Part
            Plane026: "assets/ModalPatterns/modal7/BlueSquare.svg", // Front Middle
            Plane003_1: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Front Hem
            Plane032: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Back Part
            Plane026_3: "assets/ModalPatterns/modal7/BlueSquare.svg", // Back Middle
            Plane032_10: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Back Hem
            Plane032_7: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // LS upper
            base_stripe_5___right: "assets/ModalPatterns/modal7/BlueSquare.svg", // LS Middle
            Plane032_8: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // LS lower
            Plane032_5: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // RS upper
            base_stripe_5___left: "assets/ModalPatterns/modal7/BlueSquare.svg", // LS Middle 
            Plane032_6: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // RS lower
            Plane064_1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Left
            Plane032_1: "assets/ModalPatterns/modal7/yellowSquareFinal.svg", // Shoulder second Layer
            Plane032_2: "assets/ModalPatterns/modal7/whiteSquareFinal.svg", // Shoulder Third White Layer
            Plane064: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Right
            Plane064_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Back
            Triangle_V__neck_1_stripes_type1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Collar 1
            jersey_for_triangle_V_neck_collar: "assets/ModalPatterns/modal7/BlueSquare.svg", // Neck Inner
            Plane032_3: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Upper
            Plane026_1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Left Under arm Middle
            Plane032_9: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Middle
            Plane032_4: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Right Under arm Upper
            Plane026_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Left Under arm Middle
            Plane032_11: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Middle

        },
        'triangleVNeckWithoutLaceStripes_0.5-1-2-1-0.5.glb': {
            Plane087_1: "assets/ModalPatterns/modal7/InsidePatch.svg", // Neck Inside Patch
            Plane003: "assets/ModalPatterns/modal7/ArtBoardNew.svg", //Front Part
            Plane059: "assets/ModalPatterns/modal7/whiteSquare.svg", // Front Middle White
            Plane059_1: "assets/ModalPatterns/modal7/yellowSquare.svg", // Front Middle Yellow1
            Plane059_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Front Middle Blue
            Plane059_3: "assets/ModalPatterns/modal7/yellowSquare.svg", // Front Middle Yellow2
            Plane059_4: "assets/ModalPatterns/modal7/whiteSquare.svg", // Front Middle White
            Plane003_1: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Front Hem


            Plane032: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Back Part
            Plane057: "assets/ModalPatterns/modal7/whiteSquare.svg", // Back Middle White
            Plane057_1: "assets/ModalPatterns/modal7/yellowSquare.svg", // Back Middle Yellow1
            Plane057_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Back Middle Blue
            Plane057_3: "assets/ModalPatterns/modal7/yellowSquare.svg", // Back Middle Yellow2
            Plane057_4: "assets/ModalPatterns/modal7/whiteSquare.svg", // Back Middle White
            Plane032_8: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Back Hem


            Plane032_6: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // LS upper 
            Plane060: "assets/ModalPatterns/modal7/whiteSquare.svg", // LS  Middle White
            Plane060_1: "assets/ModalPatterns/modal7/yellowSquare.svg", // LS  Middle Yellow1
            Plane060_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // LS  Middle Blue
            Plane060_3: "assets/ModalPatterns/modal7/yellowSquare.svg", // LS  Middle Yellow2
            Plane060_4: "assets/ModalPatterns/modal7/whiteSquare.svg", // LS  Middle White
            Plane086_1: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // LS lower


            Plane032_5: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // RS upper 
            Plane061: "assets/ModalPatterns/modal7/whiteSquare.svg", // RS White Upper
            Plane061_1: "assets/ModalPatterns/modal7/yellowSquare.svg", // RS Yellow Middle1    
            Plane061_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // RS Blue Middle  
            Plane061_3: "assets/ModalPatterns/modal7/yellowSquare.svg", // RS Yellow Middle2   
            Plane061_4: "assets/ModalPatterns/modal7/whiteSquare.svg", // RS White Upper
            Plane086: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // RS lower


            Plane064_1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Left
            Plane064_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Middle
            Plane064: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Right
            Plane032_1: "assets/ModalPatterns/modal7/yellowSquareFinal.svg", // Shoulder second Layer
            Plane032_2: "assets/ModalPatterns/modal7/whiteSquare.svg", // Shoulder Third White Layer

            Triangle_V__neck_1_stripes_type1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Collar 1
            jersey_for_triangle_V_neck_collar: "assets/ModalPatterns/modal7/BlueSquare.svg", // Neck Inner


            Plane032_3: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Upper
            Plane058: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Left Under arm White Upper
            Plane058_1: "assets/ModalPatterns/modal7/yellowSquare.svg", //  Left Under arm Yellow Middle1    
            Plane058_2: "assets/ModalPatterns/modal7/BlueSquare.svg", //  Left Under arm Blue Middle  
            Plane058_3: "assets/ModalPatterns/modal7/yellowSquare.svg", //  Left Under arm Yellow Middle2   
            Plane058_4: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Left Under arm White Upper
            Plane032_7: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Hem


            Plane032_4: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Right Under arm Upper
            Plane056: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Right Under arm White Upper
            Plane056_1: "assets/ModalPatterns/modal7/yellowSquare.svg", //  Right Under arm Yellow Middle1    
            Plane056_2: "assets/ModalPatterns/modal7/BlueSquare.svg", //  Right Under arm Blue Middle  
            Plane056_3: "assets/ModalPatterns/modal7/yellowSquare.svg", //  Right Under arm Yellow Middle2   
            Plane056_4: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Right Under arm White Upper
            Plane032_9: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Right Under arm Hem 

        },
        'V-neckStripes_5.glb': {
            // neck_1_stripe_5New2
            Plane087_1: "assets/ModalPatterns/modal7/InsidePatch.svg", // Neck Inside Patch
            Plane087: "assets/ModalPatterns/modal7/JOGStripe.svg", // Neck Inside Stripe

            V_neck_1_stripe: "assets/ModalPatterns/modal7/BlueSquare.svg", // Collaar
            Plane066: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Front Part
            Plane026: "assets/ModalPatterns/modal7/BlueSquare.svg", // Front Middle
            Plane066_1: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Front Hem


            Plane032: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Back Part
            Plane026_3: "assets/ModalPatterns/modal7/BlueSquare.svg", // Back Middle
            Plane032_8: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Back Hem


            Plane032_6: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // LS upper
            base_stripe_5___right: "assets/ModalPatterns/modal7/BlueSquare.svg", // LS Middle
            Plane086_1: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // LS lower
            Plane032_5: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // RS upper
            base_stripe_5___left: "assets/ModalPatterns/modal7/BlueSquare.svg", // RS Middle 
            Plane086: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // RS lower

            Plane064_1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Left
            Plane032_1: "assets/ModalPatterns/modal7/yellowSquareFinal.svg", // Shoulder second Layer
            Plane032_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Third White Layer
            Plane064: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Right
            Plane064_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Back
            Triangle_V__neck_1_stripes_type1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Collar 1
            jersey_for_triangle_V_neck_collar: "assets/ModalPatterns/modal7/BlueSquare.svg", // Neck Inner
            Plane032_3: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Upper
            Plane026_1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Left Under arm Middle
            Plane032_9: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Middle
            Plane032_4: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Right Under arm Upper
            Plane026_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Left Under arm Middle
            Plane032_11: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Middle

        },
        'triangleVNeckWithoutLaceStripes_5.glb': {
            Plane003: "assets/ModalPatterns/modal8/ArtBoardNew.svg",
            Plane003_1: "assets/ModalPatterns/modal8/ArtBoardNew.svg",
        },

        'triangleVNeckWithoutLaceStripes_2-3.glb': {
            Plane003: "assets/ModalPatterns/modal8/ArtBoardNew.svg",
            Plane003_1: "assets/ModalPatterns/modal8/ArtBoardNew.svg",
        },

        'triangleVNeckWithoutLaceStripes_2-1-2.glb': {
            Plane003: "assets/ModalPatterns/modal8/ArtBoardNew.svg",
            Plane003_1: "assets/ModalPatterns/modal8/ArtBoardNew.svg",
        },

        'triangleVNeckWithoutLaceStripes_131.glb': {
            Plane003: "assets/ModalPatterns/modal8/ArtBoardNew.svg",
            Plane003_1: "assets/ModalPatterns/modal8/ArtBoardNew.svg",
        },

        'triangleVNeckWithoutLaceStripes_1.5-2-1.5.glb': {
            Plane003: "assets/ModalPatterns/modal8/ArtBoardNew.svg",
            Plane003_1: "assets/ModalPatterns/modal8/ArtBoardNew.svg",
        },

        // V-NECK MODELS 
        'V-neckStripes_0.5-1-2-1-0.5.glb': {
            Plane066: "assets/ModalPatterns/modal7/ArtBoardNew.svg", //Front Part
            Plane059: "assets/ModalPatterns/modal7/whiteSquare.svg", // Front Middle White
            Plane059_1: "assets/ModalPatterns/modal7/yellowSquare.svg", // Front Middle Yellow1
            Plane059_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Front Middle Blue
            Plane059_3: "assets/ModalPatterns/modal7/yellowSquare.svg", // Front Middle Yellow2
            Plane059_4: "assets/ModalPatterns/modal7/whiteSquare.svg", // Front Middle White
            Plane066_1: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Front Hem


            Plane032: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Back Part
            Plane057: "assets/ModalPatterns/modal7/whiteSquare.svg", // Back Middle White
            Plane057_1: "assets/ModalPatterns/modal7/yellowSquare.svg", // Back Middle Yellow1
            Plane057_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Back Middle Blue
            Plane057_3: "assets/ModalPatterns/modal7/yellowSquare.svg", // Back Middle Yellow2
            Plane057_4: "assets/ModalPatterns/modal7/whiteSquare.svg", // Back Middle White
            Plane032_8: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Back Hem


            Plane032_6: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // LS upper 
            Plane060: "assets/ModalPatterns/modal7/whiteSquare.svg", // LS  Middle White
            Plane060_1: "assets/ModalPatterns/modal7/yellowSquare.svg", // LS  Middle Yellow1
            Plane060_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // LS  Middle Blue
            Plane060_3: "assets/ModalPatterns/modal7/yellowSquare.svg", // LS  Middle Yellow2
            Plane060_4: "assets/ModalPatterns/modal7/whiteSquare.svg", // LS  Middle White
            Plane086_1: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // LS lower


            Plane032_5: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // RS upper 
            Plane061: "assets/ModalPatterns/modal7/whiteSquare.svg", // RS White Upper
            Plane061_1: "assets/ModalPatterns/modal7/yellowSquare.svg", // RS Yellow Middle1    
            Plane061_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // RS Blue Middle  
            Plane061_3: "assets/ModalPatterns/modal7/yellowSquare.svg", // RS Yellow Middle2   
            Plane061_4: "assets/ModalPatterns/modal7/whiteSquare.svg", // RS White Upper
            Plane086: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // RS lower


            Plane064_1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Left
            Plane064_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Middle
            Plane064: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Right
            Plane032_1: "assets/ModalPatterns/modal7/yellowSquareFinal.svg", // Shoulder second Layer
            Plane032_2: "assets/ModalPatterns/modal7/whiteSquare.svg", // Shoulder Third White Layer

            V_neck_1_stripe: "assets/ModalPatterns/modal7/BlueSquare.svg", // Collar 1
            Plane087_1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Neck Inner
            Plane087_1: "assets/ModalPatterns/modal7/InsidePatch.svg", // Neck Inside Patch

            Plane032_3: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Upper
            Plane058: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Left Under arm White Upper
            Plane058_1: "assets/ModalPatterns/modal7/yellowSquare.svg", //  Left Under arm Yellow Middle1    
            Plane058_2: "assets/ModalPatterns/modal7/BlueSquare.svg", //  Left Under arm Blue Middle  
            Plane058_3: "assets/ModalPatterns/modal7/yellowSquare.svg", //  Left Under arm Yellow Middle2   
            Plane058_4: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Left Under arm White Upper
            Plane032_7: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Hem


            Plane032_4: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Right Under arm Upper
            Plane056: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Right Under arm White Upper
            Plane056_1: "assets/ModalPatterns/modal7/yellowSquare.svg", //  Right Under arm Yellow Middle1    
            Plane056_2: "assets/ModalPatterns/modal7/BlueSquare.svg", //  Right Under arm Blue Middle  
            Plane056_3: "assets/ModalPatterns/modal7/yellowSquare.svg", //  Right Under arm Yellow Middle2   
            Plane056_4: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Right Under arm White Upper
            Plane032_9: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Right Under arm Hem





        },
        // V-NECK MODELS 

        // Tri- V-neck with Lace Neck
        'triV-neckWithLace_stripes_1.5-2-1.5.glb': {
            Plane067: "assets/ModalPatterns/modal7/ArtBoardNew.svg", //Front Part
            Plane040: "assets/ModalPatterns/modal7/whiteSquare.svg", // Front Middle White 
            Plane040_1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Front Middle Blue 
            Plane040_2: "assets/ModalPatterns/modal7/whiteSquare.svg", // Front Middle White
            Plane067_1: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Front Hem


            Plane084: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Back Part
            Plane024: "assets/ModalPatterns/modal7/whiteSquare.svg", // Back Middle White 
            Plane024_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Back Middle Blue 
            Plane024_1: "assets/ModalPatterns/modal7/whiteSquare.svg", // Back Middle White
            Plane084_8: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Back Hem


            Plane084_6: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // LS upper 
            Plane041: "assets/ModalPatterns/modal7/whiteSquare.svg", // LS  Middle White 
            Plane041_1: "assets/ModalPatterns/modal7/BlueSquare.svg", // LS  Middle Blue 
            Plane041_2: "assets/ModalPatterns/modal7/whiteSquare.svg", // LS  Middle White
            Plane086_1: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // LS lower


            Plane084_5: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // RS upper 
            Plane042: "assets/ModalPatterns/modal7/whiteSquare.svg", // RS White Upper   
            Plane042_1: "assets/ModalPatterns/modal7/BlueSquare.svg", // RS Blue Middle    
            Plane042: "assets/ModalPatterns/modal7/whiteSquare.svg", // RS White Upper
            Plane086: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // RS lower


            Plane083_1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Left
            Plane083_2: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Middle
            Plane083: "assets/ModalPatterns/modal7/BlueSquare.svg", // Shoulder Right
            Plane084_1: "assets/ModalPatterns/modal7/yellowSquareFinal.svg", // Shoulder second Layer
            Plane084_2: "assets/ModalPatterns/modal7/whiteSquare.svg", // Shoulder Third White Layer

            lace_neck_with_triangle_1_stripe_type1: "assets/ModalPatterns/modal7/BlueSquare.svg", // Collar 1
            jersey_for_triangle_V_neck_collar: "assets/ModalPatterns/modal7/BlueSquare.svg", // Neck Inner
            BézierCircle003: "assets/ModalPatterns/modal7/BlueSquare.svg", //White Lace
            Plane088_1: "assets/ModalPatterns/modal7/InsidePatch.svg", // Neck Inside Patch

            Plane084_3: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Upper
            Plane030: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Left Under arm White Upper    
            Plane030_1: "assets/ModalPatterns/modal7/BlueSquare.svg", //  Left Under arm Blue Middle   
            Plane030_2: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Left Under arm White Upper
            Plane084_7: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Left Under arm Hem


            Plane084_4: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Right Under arm Upper
            Plane020: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Right Under arm White Upper   
            Plane020_1: "assets/ModalPatterns/modal7/BlueSquare.svg", //  Right Under arm Blue Middle   
            Plane020_2: "assets/ModalPatterns/modal7/whiteSquare.svg", //  Right Under arm White Upper
            Plane084_9: "assets/ModalPatterns/modal7/ArtBoardNew.svg", // Right Under arm Hem





        },
        // V-NECK MODELS
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
                const displayName = getMeshDisplayName(child.name, currentModelFilename);

                const colorHex = colorMappings[child.name];

                // Check if this model has predefined SVG patterns
                const modelPatterns = modelSvgPatterns[currentModelFilename];

                if (modelPatterns && modelPatterns[child.name]) {
                    // Load SVG pattern with original colors first
                    loadSvgPatternForMesh(child, modelPatterns[child.name], colorMappings);
                } else if (colorHex) {
                    // Fall back to gradient if no SVG pattern
                    child.userData.colorCategory = child.name;
                    // For non-SVG meshes, create a solid color material
                    child.material = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(colorHex),
                        side: THREE.DoubleSide,
                    });
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

                // Add to mesh collection (still add all meshes to the collection)
                if (!meshes[child.name]) {
                    meshes[child.name] = [];
                }
                meshes[child.name].push(child);
            }
        });
    }

    //Code by aman 
    document.getElementById('continueBtnInmodel').addEventListener('click', async () => {
        updateSvgPatternColors();
        setViewfront('frontAngle'); // Set initial view to front
        const svgDoc = document.implementation.createDocument("http://www.w3.org/2000/svg", "svg", null);
        const svgRoot = svgDoc.documentElement;
        svgRoot.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgRoot.setAttribute("width", "6000");
        svgRoot.setAttribute("height", "6000");
        svgRoot.setAttribute("viewBox", "0 0 6000 6000");
        document.getElementById("preloader").style.display = "flex";
        document.getElementById("preloaderProgress").style.display = "none";
        const defs = svgDoc.createElementNS("http://www.w3.org/2000/svg", "defs");
        svgRoot.appendChild(defs);

        const usedMeshes = meshes || {};
        const cellSize = 400;
        const cols = 2;
        let count = 0;

        const COLOR_MAPPING = {
            "#fdb515": "primary",   // Original red
            "#00003b": "secondary", // Original dark blue
            "#FFFFFF": "tertiary",  // White
            "white": "tertiary"     // Also map color name "white"
        };

        function updateSingleMeshSvg(mesh, meshName) {
            const pattern = mesh.userData?.pattern;
            if (!pattern || !pattern.svgContent) return;

            let customizedSvg = pattern.svgContent;
            const originalColors = pattern.originalColors || [];

            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(customizedSvg, "image/svg+xml");
            const svgElement = svgDoc.querySelector('svg');

            const meshColor = MESH_COLORS?.[meshName]; // ✅ Get color for this mesh
            if (!meshColor) return;

            // ✅ Update <style> tags (if any)
            const styleNode = svgDoc.querySelector("style");
            if (styleNode) {
                let styleText = styleNode.textContent;
                originalColors.forEach(originalColor => {
                    const regex = new RegExp(originalColor, 'gi');
                    styleText = styleText.replace(regex, meshColor);
                });
                styleNode.textContent = styleText;
            }

            // ✅ Update inline SVG fill/stroke
            svgElement.querySelectorAll("*").forEach(el => {
                ["fill", "stroke"].forEach(attr => {
                    const value = el.getAttribute(attr);
                    if (!value) return;

                    const normalizedValue = value.toLowerCase().replace("#", "");
                    const isOriginal = originalColors.some(orig => orig.toLowerCase().replace("#", "") === normalizedValue);

                    if (isOriginal) {
                        el.setAttribute(attr, meshColor);
                    }
                });
            });

            const serializer = new XMLSerializer();
            customizedSvg = serializer.serializeToString(svgDoc);
            pattern.customizedSvg = customizedSvg;
        }



        for (const meshName in usedMeshes) {
            const meshList = usedMeshes[meshName];
            if (!Array.isArray(meshList) || !meshList[0]) continue;
            const mesh = meshList[0];
            const pattern = mesh.userData?.pattern;

            if (!pattern || (!pattern.customizedSvg && !pattern.svgContent)) continue;

            updateSingleMeshSvg(mesh, meshName);// <- updates pattern.customizedSvg internally
            const svgContent = pattern.customizedSvg || pattern.svgContent;
            const parser = new DOMParser();
            const meshSvgDoc = parser.parseFromString(svgContent, "image/svg+xml");
            const meshSvg = meshSvgDoc.documentElement;

            meshSvg.querySelectorAll("clipPath").forEach(el => el.remove());
            // Extract viewBox info
            const viewBox = meshSvg.getAttribute("viewBox") || "0 0 1024 1024";
            const [vx, vy, vw, vh] = viewBox.split(" ").map(Number);

            // Calculate scale to fit within cell
            const scale = Math.min(cellSize / vw, cellSize / vh);


            // Calculate position
            const col = count % cols;
            const row = Math.floor(count / cols);
            const tx = col * cellSize;
            const ty = row * cellSize;

            const group = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute(
                "transform",
                `translate(${tx}, ${ty}) scale(${scale}) translate(${-vx}, ${-vy})`
            );

            Array.from(meshSvg.childNodes).forEach(child => {
                if (child.nodeType === 1 || child.nodeType === 3) {
                    group.appendChild(child.cloneNode(true));
                }
            });

            svgRoot.appendChild(group);

            const gradientInfo = gradientMeshes[meshName];
            if (gradientInfo) {
                const { color1, color2, angle, scale } = gradientInfo;

                const gradientId = `gradient-${meshName}`;
                const linearGrad = svgDoc.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
                linearGrad.setAttribute("id", gradientId);
                linearGrad.setAttribute("gradientUnits", "userSpaceOnUse");

                // Gradient direction (scaled to 1024x1024 mesh texture size)
                const rad = (angle * Math.PI) / 180;
                const cx = 512;
                const cy = 512;
                const length = 512 * scale; // gradientScale from your UI
                const dx = Math.cos(rad) * length;
                const dy = Math.sin(rad) * length;

                linearGrad.setAttribute("x1", cx - dx);
                linearGrad.setAttribute("y1", cy - dy);
                linearGrad.setAttribute("x2", cx + dx);
                linearGrad.setAttribute("y2", cy + dy);

                const stop1 = svgDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
                stop1.setAttribute("offset", "0%");
                stop1.setAttribute("stop-color", color1);

                const stop2 = svgDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
                stop2.setAttribute("offset", "100%");
                stop2.setAttribute("stop-color", color2);

                linearGrad.appendChild(stop1);
                linearGrad.appendChild(stop2);
                defs.appendChild(linearGrad);

                // ✅ Apply the gradient fill to all shapes inside this group
                group.querySelectorAll("path, polygon").forEach(shape => {
                    shape.removeAttribute("class");
                    shape.setAttribute("fill", `url(#${gradientId})`);
                });

                console.log("Applied gradient", gradientId, "to mesh:", meshName);
            }

            count++;

            (window.textDecals || []).forEach(decal => {
                if (decal.meshName !== meshName) return;

                const text = svgDoc.createElementNS("http://www.w3.org/2000/svg", "text");

                const x = (0.5 + decal.offset.x) * vw;
                const y = (0.5 + decal.offset.y) * vh;

                text.textContent = decal.text;
                text.setAttribute("x", x.toFixed(2));
                text.setAttribute("y", y.toFixed(2));
                text.setAttribute("font-size", decal.fontSize || 40);
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("font-family", decal.fontFamily || "Arial, sans-serif");

                text.setAttribute("stroke", decal.outlineColor || "#000000");
                text.setAttribute("stroke-width", decal.outlineWidth || 2);
                text.setAttribute("paint-order", "stroke fill");  // Stroke below fill
                text.setAttribute("stroke-linejoin", "round");

                text.setAttribute("fill", decal.color || "#000");

                if (decal.rotation) {
                    const angleDeg = decal.rotation * 180 / Math.PI;
                    text.setAttribute("transform", `rotate(${angleDeg}, ${x}, ${y})`);
                }

                group.appendChild(text); // ✅ Add to same group as mesh
            });

            (window.imageDecals || []).forEach(decal => {

                if (decal.mesh?.name !== meshName) return;

                const canvas = document.createElement("canvas");
                canvas.width = decal.image.width;
                canvas.height = decal.image.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(decal.image, 0, 0);
                const base64 = canvas.toDataURL("image/png");

                const baseWidth = decal.bounds?.width ?? 0.1;
                const baseHeight = decal.bounds?.height ?? 0.1;
                const scale = decal.scale ?? 1;
                const svgGroupScale = scale;

                const texWidth = baseWidth * scale;
                const texHeight = baseHeight * scale;

                const centerX = vw * (0.5 + decal.offset.x);
                const centerY = vh * (0.5 + decal.offset.y);

                // const width = vw * texWidth+300;
                // const height = vh * texHeight+300;

                const width = vw * baseWidth * scale * svgGroupScale;
                const height = vh * baseHeight * scale * svgGroupScale;

                const image = svgDoc.createElementNS("http://www.w3.org/2000/svg", "image");
                image.setAttributeNS("http://www.w3.org/1999/xlink", "href", base64);
                image.setAttribute("x", centerX - width / 2);
                image.setAttribute("y", centerY - height / 2);
                image.setAttribute("width", width);
                image.setAttribute("height", height);
                image.setAttribute("preserveAspectRatio", "xMidYMid meet");

                if (decal.rotation) {
                    const angle = (decal.rotation * 180) / Math.PI;
                    image.setAttribute("transform", `rotate(${angle}, ${centerX}, ${centerY})`);
                }
                group.appendChild(image); // ✅ Append inside the mesh group
            });
        }

        // ✅ Export SVG
        const serializer = new XMLSerializer();
        const finalSvgString = serializer.serializeToString(svgRoot);
        const svgBlob = new Blob([finalSvgString], { type: 'image/svg+xml' });

        // Convert SVG to base64
        const svgReader = new FileReader();
        svgReader.onloadend = function () {
            const svgBase64 = svgReader.result.split(',')[1];

            // 2. EPS Conversion using Ajax
            const formData = new FormData();
            formData.append('svg', svgBlob, 'design.svg');
            const epsBase64 = " ";
            appendAndSubmitForm(svgBase64, epsBase64);
            // $.ajax({
            //     url: 'epsConvert.php',
            //     method: 'POST',
            //     data: formData,
            //     processData: false,
            //     contentType: false,
            //     xhrFields: { responseType: 'blob' },
            //     success: function (epsBlob) {
            //         const epsReader = new FileReader();
            //         epsReader.onloadend = function () {
            //             const epsBase64 = epsReader.result.split(',')[1];
            //             appendAndSubmitForm(svgBase64, epsBase64);
            //         };
            //         epsReader.readAsDataURL(epsBlob);
            //     },
            //     error: function (xhr) {
            //         alert('EPS conversion failed: ' + xhr.responseText);
            //     }
            // });
        };
        svgReader.readAsDataURL(svgBlob);
    });

    function appendAndSubmitForm(svgBase64, epsBase64) {
        console.log(svgBase64, epsBase64);
        const form = document.getElementById('imagePostForm');

        // Remove old SVG/EPS if any
        ['svgFile', 'epsFile'].forEach(id => {
            const old = document.getElementById(id);
            if (old) old.remove();
        });

        // Append new inputs
        const svgInput = document.createElement("input");
        svgInput.type = "hidden";
        svgInput.name = "svgFile";
        svgInput.id = "svgFile";
        svgInput.value = svgBase64;
        form.appendChild(svgInput);

        const epsInput = document.createElement("input");
        epsInput.type = "hidden";
        epsInput.name = "epsFile";
        epsInput.id = "epsFile";
        epsInput.value = epsBase64;
        form.appendChild(epsInput);

        captureModelView('front', (frontImage) => {
            captureModelView('back', (backImage) => {
                captureModelView('left', (leftImage) => {
                    captureModelView('right', (rightImage) => {
                        document.getElementById("frontImageInput").value = frontImage;
                        document.getElementById("backImageInput").value = backImage;
                        document.getElementById("leftImageInput").value = leftImage;
                        document.getElementById("rightImageInput").value = rightImage;
                    });
                });
            });
        });

        // Submit the form
        form.submit();
    }

    function captureModelView(view, callback) {
        const model = window.mainModel; // Your loaded 3D model
        const scene = window.scene;     // Your main Three.js scene
        const camera = window.camera;   // Your existing camera
        const renderer = window.renderer; // Your initialized WebGLRenderer

        if (!model || !scene || !camera || !renderer) {
            console.error("Required objects are not available");
            return;
        }

        const originalRotation = model.rotation.y;
        const originalFov = camera.fov;
        // Set view
        if (view === 'front') {
            model.rotation.y = 0;
        } else if (view === 'back') {
            model.rotation.y = Math.PI; // 180 degrees
        } else if (view === 'left') {
            model.rotation.y = Math.PI / 2; // 90°
        } else if (view === 'right') {
            model.rotation.y = -Math.PI / 2; // -90°
        }

        // Render and get image
        camera.fov = originalFov * (1 + 0.1); // Adjust FOV for better view
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);
        const image = renderer.domElement.toDataURL('image/png');
        camera.fov = originalFov;
        // Restore original rotation
        model.rotation.y = originalRotation;

        // Return the image through callback
        callback(image);
    }


    function setViewfront(view) {
        console.log(`Switching to view: ${view}`);
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
    }
    // code by aman end hare

    // Add this function to update the preloader
    function updatePreloader(progress) {
        loadingProgress = progress;
        const progressPercentage = Math.round(progress * 100);

        // Update progress text
        if (progressTextElement) {
            progressTextElement.textContent = `${progressPercentage}%`;
        }

        // Calculate estimated time remaining
        if (loadingStartTime && timeRemainingElement) {
            const currentTime = Date.now();
            const elapsedTime = (currentTime - loadingStartTime) / 1000; // in seconds
            const estimatedTotalTime = elapsedTime / progress;
            const remainingTime = estimatedTotalTime - elapsedTime;

            // Format time remaining
            if (remainingTime > 60) {
                const minutes = Math.floor(remainingTime / 60);
                const seconds = Math.floor(remainingTime % 60);
                timeRemainingElement.textContent = `~${minutes}m ${seconds}s remaining`;
            } else {
                timeRemainingElement.textContent = `~${Math.ceil(remainingTime)}s remaining`;
            }
        }
    }
    // Add this function to show the preloader
    function showPreloader() {
        loadingProgress = 0;
        loadingStartTime = Date.now();
        if (preloaderElement) {
            preloaderElement.style.display = "flex";
        }
        updatePreloader(0);

        // Clear any existing interval
        if (loadingInterval) {
            clearInterval(loadingInterval);
        }

        // Set up interval to update time remaining
        loadingInterval = setInterval(() => {
            if (loadingProgress < 1) {
                updatePreloader(loadingProgress);
            }
        }, 500);
    }

    // Add this function to hide the preloader
    function hidePreloader() {
        if (preloaderElement) {
            preloaderElement.style.display = "none";
        }
        if (loadingInterval) {
            clearInterval(loadingInterval);
            loadingInterval = null;
        }
    }
    let svgLoadProgress = 0;
    let svgResourcesLoaded = 0;
    let svgTotalResources = 0;
    let svgLoadingInterval = null;

    // Modify the loadSvgPatternForMesh function to return a promise
    async function loadSvgPatternForMesh(mesh, svgPath, colorMappings) {
        try {
            const response = await fetch(svgPath);
            const svgContent = await response.text();

            // Extract original colors from SVG
            const originalColors = extractColorsFromSVG(svgContent);
            // Store the original SVG content and texture
            mesh.userData.pattern = {
                isSvg: true,
                svgPath: svgPath,
                svgContent: svgContent,
                originalColors: originalColors,
                colorGroup: colorMappings[mesh.name] || 'primary',
                isFullCoverage: true,
                baseTexture: null
            };

            // Create SVG element to get dimensions
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
            const svgElement = svgDoc.querySelector('svg');

            // Get SVG dimensions
            let svgWidth = parseFloat(svgElement.getAttribute('width')) || svgElement.viewBox.baseVal.width || 1024;
            let svgHeight = parseFloat(svgElement.getAttribute('height')) || svgElement.viewBox.baseVal.height || 1024;

            // Create and store the base texture
            const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            return new Promise((resolve) => {
                const img = new Image();
                img.onload = function () {
                    // Create canvas with dynamic dimensions matching SVG
                    const canvas = document.createElement("canvas");
                    canvas.width = svgWidth;
                    canvas.height = svgHeight;
                    const ctx = canvas.getContext("2d");

                    // Draw SVG to canvas
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Create and store base texture
                    const baseTexture = new THREE.CanvasTexture(canvas);
                    baseTexture.flipY = false;
                    mesh.userData.pattern.baseTexture = baseTexture;

                    // Initial texture update
                    updateMeshTextureForMesh(mesh);
                    URL.revokeObjectURL(url);
                    resolve(); // Resolve the promise when done
                };
                img.onerror = (error) => {
                    console.error(`Error loading SVG image for ${mesh.name}:`, error);
                    resolve(); // Still resolve to prevent hanging
                };
                img.src = url;
            });
        } catch (error) {
            console.error(`Error loading SVG pattern for ${mesh.name}:`, error);
            // Fallback to solid color
            const defaultColor = COLORS[colorMappings[mesh.name]] || "#FFFFFF";
            mesh.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(defaultColor),
                side: THREE.DoubleSide,
            });
            return Promise.resolve(); // Return resolved promise
        }
    }
    // Create a global cache for gradients
    const gradientCache = new Map();
    const patternCache = new Map();

    function updateMeshTextureForMesh(mesh, options = {}) {
        const { skipGradientUpdate = false } = options;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 1024;
        canvas.height = 1024;

        const ctx = canvas.getContext("2d");
        if (mesh.userData.fabricCanvas) {
            ctx.drawImage(mesh.userData.fabricCanvas, 0, 0);
        }
        // 1. ✅ Fabric texture as base layer
        if (fabricTexture && fabricTexture.image) {
            const fabricPattern = ctx.createPattern(fabricTexture.image, "repeat");
            const fabricScale = 0.5;
            const fabricTransform = new DOMMatrix().scaleSelf(fabricScale, fabricScale);
            if (typeof fabricPattern.setTransform === "function") {
                fabricPattern.setTransform(fabricTransform);
            }
            ctx.fillStyle = fabricPattern;
            ctx.globalAlpha = 0.4;   // or 0.3–0.5 depending on desired strength
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;   // reset for next layers

        } else {
            // Fallback white background
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 2. ✅ Draw SVG pattern with alpha (makes fabric slightly visible)
        if (mesh.userData.pattern && mesh.userData.pattern.baseTexture) {
            const baseImage = mesh.userData.pattern.baseTexture.image;
            // --- (a) Step 1: Create mask from full-opacity SVG for correct color match
            if (!mesh.userData.primaryMaskCanvas) {
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                const tempCtx = tempCanvas.getContext("2d");

                tempCtx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

                const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                const maskCanvas = document.createElement("canvas");
                maskCanvas.width = canvas.width;
                maskCanvas.height = canvas.height;
                const maskCtx = maskCanvas.getContext("2d");

                const primaryColor = (mesh.userData.pattern?.currentPrimaryHex || "#fdb515").toLowerCase();

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const hex = rgbToHex(r, g, b);
                    if (hex.toLowerCase() === primaryColor) {
                        const x = (i / 4) % canvas.width;
                        const y = Math.floor((i / 4) / canvas.width);
                        maskCtx.fillStyle = "white";
                        maskCtx.fillRect(x, y, 1, 1);
                    }
                }

                mesh.userData.primaryMaskCanvas = maskCanvas;
            }

            // --- (b) Step 2: Draw SVG on real canvas with transparency
            ctx.globalAlpha = 0.7;
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            // ctx.globalAlpha = 0.8;


            // 3. 🎯 Create primary mask if not cached
            if (!mesh.userData.primaryMaskCanvas) {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                const maskCanvas = document.createElement("canvas");
                maskCanvas.width = canvas.width;
                maskCanvas.height = canvas.height;
                const maskCtx = maskCanvas.getContext("2d");

                const primaryColor = (mesh.userData.pattern?.currentPrimaryHex || "#fdb515").toLowerCase();

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const hex = rgbToHex(r, g, b);
                    if (hex.toLowerCase() === primaryColor) {
                        const x = (i / 4) % canvas.width;
                        const y = Math.floor((i / 4) / canvas.width);
                        maskCtx.fillStyle = "white";
                        maskCtx.fillRect(x, y, 1, 1);
                    }
                }
                mesh.userData.primaryMaskCanvas = maskCanvas;
            }
        }

        // 4. ✅ Gradient fill on primary region
        if (mesh.userData.gradient && !skipGradientUpdate) {
            const gradient = mesh.userData.gradient;
            const cacheKey = `${mesh.uuid}_${gradient.angle}_${gradient.scale}_${gradient.color1}_${gradient.color2}`;
            context.globalAlpha = 0.8;
            if (!gradientCache.has(cacheKey)) {
                const gradientCanvas = document.createElement("canvas");
                gradientCanvas.width = canvas.width;
                gradientCanvas.height = canvas.height;
                const gradientCtx = gradientCanvas.getContext("2d");

                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const length = Math.sqrt(centerX * centerX + centerY * centerY) * gradient.scale;
                const angleRad = THREE.MathUtils.degToRad(gradient.angle);

                const canvasGradient = gradientCtx.createLinearGradient(
                    centerX - Math.cos(angleRad) * length,
                    centerY - Math.sin(angleRad) * length,
                    centerX + Math.cos(angleRad) * length,
                    centerY + Math.sin(angleRad) * length
                );

                function applyAlpha(hexColor, alpha) {
                    const r = parseInt(hexColor.slice(1, 3), 16);
                    const g = parseInt(hexColor.slice(3, 5), 16);
                    const b = parseInt(hexColor.slice(5, 7), 16);
                    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                }

                // Use transparent gradient colors
                canvasGradient.addColorStop(0, applyAlpha(gradient.color1, 0.5)); // 50% visible
                canvasGradient.addColorStop(1, applyAlpha(gradient.color2, 0.5)); // 50% visible

                gradientCtx.fillStyle = canvasGradient;
                gradientCtx.fillRect(0, 0, canvas.width, canvas.height);

                if (mesh.userData.primaryMaskCanvas) {
                    gradientCtx.save();
                    gradientCtx.globalCompositeOperation = "destination-in";
                    gradientCtx.drawImage(mesh.userData.primaryMaskCanvas, 0, 0);
                    gradientCtx.restore();
                }

                gradientCache.set(cacheKey, gradientCanvas);
            }

            ctx.drawImage(gradientCache.get(cacheKey), 0, 0);
        }

        // 5. ✅ Pattern decals (masked to primary area)
        const meshPatternDecals = patternDecals.filter(d => d.mesh === mesh && !d.isSvg);
        meshPatternDecals.forEach(decal => {
            context.globalAlpha = 0.8;
            if (decal.isFullCoverage) {
                const cacheKey = `${mesh.uuid}_${decal.uuid}_${decal.scale}_${decal.opacity}`;

                if (patternCache.has(cacheKey)) {
                    ctx.drawImage(patternCache.get(cacheKey), 0, 0);
                    return;
                }

                const patternCanvas = document.createElement("canvas");
                patternCanvas.width = canvas.width;
                patternCanvas.height = canvas.height;
                const patternCtx = patternCanvas.getContext("2d");

                const pattern = patternCtx.createPattern(decal.image, "repeat");
                const patternScale = 1 / decal.scale;
                const patternTransform = new DOMMatrix().scaleSelf(patternScale, patternScale);

                if (typeof pattern.setTransform === "function") {
                    pattern.setTransform(patternTransform);
                }

                patternCtx.fillStyle = pattern;
                patternCtx.globalAlpha = decal.opacity;
                patternCtx.fillRect(0, 0, canvas.width, canvas.height);
                patternCtx.globalAlpha = 1.0;

                if (mesh.userData.primaryMaskCanvas) {
                    patternCtx.save();
                    patternCtx.globalCompositeOperation = "destination-in";
                    patternCtx.drawImage(mesh.userData.primaryMaskCanvas, 0, 0);
                    patternCtx.restore();
                }

                patternCache.set(cacheKey, patternCanvas);
                ctx.drawImage(patternCanvas, 0, 0);
            }
        });

        // 6. ✅ Image decals (always top, full opacity)
        const meshImageDecals = imageDecals.filter(d => d.mesh === mesh);
        meshImageDecals.forEach(decal => {
            context.save();

            // Force top-layer drawing
            context.globalAlpha = 1.0;
            context.globalCompositeOperation = "source-over";

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

            context.drawImage(decal.image, x, y, width, height);

            if (isSelected) {
                context.save();
                context.globalAlpha = 1.0;
                context.strokeStyle = "transparent"; // or a visible color if you want
                context.lineWidth = 1;
                context.setLineDash([5, 3]);
                context.strokeRect(x - 5, y - 5, width + 10, height + 10);
                context.restore();
            }
            context.restore();
        });

        // 7. ✅ Text decals (always top, full opacity)
        const meshTextDecals = textDecals.filter(d => d.mesh === mesh);
        meshTextDecals.forEach(decal => {
            context.save();

            // Force top-layer drawing
            context.globalAlpha = 1.0;
            context.globalCompositeOperation = "source-over";

            const isSelected = activeTextDecalIndex >= 0 &&
                textDecals[activeTextDecalIndex].uuid === decal.uuid;

            const centerX = canvas.width / 2 + decal.offset.x * canvas.width;
            const centerY = canvas.height / 2 + decal.offset.y * canvas.height;

            context.translate(centerX, centerY);
            context.rotate(decal.rotation);
            context.translate(-centerX, -centerY);

            context.font = `${decal.fontSize}px ${decal.fontFamily}`;
            context.textAlign = "center";
            context.textBaseline = "middle";

            if (decal.hasOutline && decal.outlineWidth > 0) {
                context.strokeStyle = decal.outlineColor;
                context.lineWidth = decal.outlineWidth;
                context.lineJoin = "round";
                context.miterLimit = 2;
                context.strokeText(decal.text, centerX, centerY);
            }

            context.fillStyle = decal.color;
            context.fillText(decal.text, centerX, centerY);

            if (isSelected) {
                context.save();
                context.globalAlpha = 1.0;
                const textWidth = context.measureText(decal.text).width;
                const textHeight = decal.fontSize;

                context.strokeStyle = "transparent"; // or highlight color if needed
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


        // 8. ✅ Final texture assignment
        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = false;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
    }

    // Helper function to convert RGB to hex
    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }
    function updateRadioPreview(zoneOrSubzone, group = "primary") {
        const color = COLORS[group];
        const hexColor = typeof color === 'number'
            ? `#${color.toString(16).padStart(6, '0')}`
            : (color.startsWith('#') ? color : `#${color}`);

        const previewDiv = document.getElementById(`colorPreview-${zoneOrSubzone}`);
        if (previewDiv) {
            previewDiv.style.backgroundColor = hexColor;
        }
    }

    // // Zone to mesh mapping
    const zoneMeshMap = {
        zone1: ["Plane003", "Plane032", "Plane032_3", "Plane032_4"],
        zone2: ["Plane003_1", "Plane032_10", "Plane032_11", "Plane032_9"],
        zone3: ["base_stripe_5___left", "Plane026", "base_stripe_5___right", "Plane026_3", "Plane026_1", "Plane026_2"],
        zone4: ["Plane032_5", "Plane032_7"],
        zone5: ["Plane032_6", "Plane032_8"],
        zone6: ["Plane064", "Plane064_1", "Plane064_2"],
        zone7: ["Triangle_V__neck_1_stripes_type1",],
        zone8: ["jersey_for_triangle_V_neck_collar"],
        // zone9: ["Plane032_4", "Plane032_3", "Plane032_11", "Plane032_9"],

    };
    const modalZoneConfig = {
        "Tri_V-neck_1_stripe_5New3.glb": {
            zoneMeshMap: {
                zone1: ["Plane003", "Plane032", "Plane032_3", "Plane032_4"],
                zone2: ["Plane003_1", "Plane032_10", "Plane032_11", "Plane032_9"],
                zone3: ["base_stripe_5___left", "Plane026", "base_stripe_5___right", "Plane026_3", "Plane026_1", "Plane026_2"],
                zone4: ["Plane032_5", "Plane032_7"],
                zone5: ["Plane032_6", "Plane032_8"],
                zone6: ["Plane064", "Plane064_2", "Plane064_1", "Plane032_1", "Plane032_2"],
                zone7: ["Triangle_V__neck_1_stripes_type1"],
                zone8: ["jersey_for_triangle_V_neck_collar"],
                // zone9: ["Plane032_4", "Plane032_3", "Plane032_11", "Plane032_9"],
            },
            zoneColorGroupMap: {
                zone1: { "Plane003": "primary", "Plane032": "primary", "Plane032_3": "primary", "Plane032_4": "primary" },
                zone2: { "Plane003_1": "primary", "Plane032_10": "primary", "Plane032_11": "primary", "Plane032_9": "primary" },
                zone3: { "base_stripe_5___left": "secondary", "Plane026": "secondary", "base_stripe_5___right": "secondary", "Plane026_3": "secondary", "Plane026_1": "secondary", "Plane026_2": "secondary" },
                zone4: { "Plane032_5": "primary", "Plane032_7": "primary" },
                zone5: { "Plane032_6": "primary", "Plane032_8": "primary" },
                zone6: { "Plane064": "secondary", "Plane064_1": "secondary", "Plane064_2": "secondary", "Plane032_1": "primary", "Plane032_2": "tertiary" },
                zone7: { "Triangle_V__neck_1_stripes_type1": "secondary" },
                zone8: { "jersey_for_triangle_V_neck_collar": "secondary" },
                // zone9: { "Plane032_4": "primary", "Plane032_3": "primary", "Plane032_11": "primary", "Plane032_9": "primary" }
            },
            subZoneColorGroupMap: {
                stripes1: { "base_stripe_5___left": "secondary", "Plane026": "secondary", "base_stripe_5___right": "secondary", "Plane026_3": "secondary", "Plane026_1": "secondary", "Plane026_2": "secondary" },
                collar1: { "Triangle_V__neck_1_stripes_type1": "secondary" },
                Shoulder1: { "Plane064": "secondary", "Plane064_2": "secondary", "Plane064_1": "secondary" },
                Shoulder2: { "Plane032_1": "primary" },
                Shoulder3: { "Plane032_2": "tertiary" },

            }
        },
        // "V-neckStripes_5.glb": {
        //     zoneMeshMap: {
        //         zone1: ["Plane066", "Plane032"],
        //         zone2: ["Plane066_1", "Plane032_8"],
        //         zone3: ["base_stripe_5___left", "Plane026", "base_stripe_5___right", "Plane026_3",],
        //         zone4: ["Plane032_5", "Plane032_6"],
        //         zone5: ["Plane086", "Plane086_1"],
        //         zone6: ["Plane064", "Plane064_2", "Plane064_1", "Plane032_1", "Plane032_2"],
        //         zone7: ["V_neck_1_stripe"],
        //         // zone8: ["Plane026_1", "Plane026_2"],
        //         zone9: ["Plane032_4", "Plane032_9", "Plane032_3", "Plane032_7"],
        //     },
        //     zoneColorGroupMap: {
        //         zone1: { "Plane066": "primary", "Plane032": "primary" },
        //         zone2: { "Plane066_1": "primary", "Plane032_8": "primary" },
        //         zone3: { "base_stripe_5___left": "secondary", "Plane026": "secondary", "base_stripe_5___right": "secondary", "Plane026_3": "secondary", },
        //         zone4: { "Plane032_5": "primary", "Plane032_6": "primary" },
        //         zone5: { "Plane086": "primary", "Plane086_1": "primary" },
        //         zone6: { "Plane064": "secondary", "Plane064_1": "secondary", "Plane064_2": "secondary", "Plane032_1": "primary", "Plane032_2": "tertiary" },
        //         zone7: { "V_neck_1_stripe": "secondary" },
        //         // zone8: { "Plane026_1": "secondary", "Plane026_2": "secondary" },
        //         zone9: { "Plane032_4": "primary", "Plane032_9": "primary", "Plane032_3": "primary", "Plane032_7": "primary" }
        //     },
        //     subZoneColorGroupMap: {
        //         stripes1: { "base_stripe_5___left": "secondary", "Plane026": "secondary", "base_stripe_5___right": "secondary", "Plane026_3": "secondary", "Plane026_1": "secondary",  "Plane026_2": "secondary" },
        //         collar1: { "V_neck_1_stripe": "secondary" },
        //         Shoulder1: { "Plane064": "secondary", "Plane064_2": "secondary", "Plane064_1": "secondary" },
        //         Shoulder2: { "Plane032_1": "primary" },
        //         Shoulder3: { "Plane032_2": "tertiary" },

        //     }
        // },
        // // Add mappings for other modal GLB files here (use their mesh/zone structure)
        // // For example:
        // "triV-neckWithLace_stripes_1.5-2-1.5.glb": {
        //     zoneMeshMap: {
        //         zone1: ["Plane067", "Plane084"],
        //         zone2: ["Plane067_1", "Plane084_8"],
        //         zone3: ["Plane042", "Plane040", "Plane041", "Plane042_1", "Plane040_1", "Plane041_1", "Plane042_2", "Plane040_2", "Plane041_2"],
        //         zone4: ["Plane084_5", "Plane084_6"],
        //         zone5: ["Plane086_1", "Plane086"],
        //         zone6: ["Plane064", "Plane064_1", "Plane064_2", "Plane032_1"],
        //         zone7: ["lace_neck_with_triangle_1_stripe_type1"],
        //         zone8: ["jersey_for_triangle_V_neck_collar"],
        //         zone9: ["Plane084_3", "Plane084_7", "Plane084_9", "Plane084_4"],
        //         zone10: ["BézierCircle003",],
        //     },
        //     zoneColorGroupMap: {
        //         zone1: { "Plane067": "primary", "Plane084": "primary" },
        //         zone2: { "Plane067_1": "primary", "Plane084_8": "primary" },
        //         zone3: {
        //             "Plane042": "tertiary", "Plane040": "tertiary", "Plane041": "tertiary",
        //             "Plane042_1": "secondary", "Plane040_1": "secondary", "Plane041_1": "secondary",
        //             "Plane042_2": "tertiary", "Plane040_2": "tertiary", "Plane041_2": "tertiary",
        //         },
        //         zone4: { "Plane084_5": "primary", "Plane084_6": "primary" },
        //         zone5: { "Plane086_1": "primary", "Plane086": "primary" },
        //         zone6: { "Plane064": "secondary", "Plane064_1": "secondary", "Plane064_2": "secondary", "Plane032_1": "primary", "Plane032_2": "tertiary" },

        //         zone7: { "lace_neck_with_triangle_1_stripe_type1": "secondary" },
        //         zone8: { "jersey_for_triangle_V_neck_collar": "secondary" },
        //         zone9: { "Plane084_3": "primary", "Plane084_7": "Primary", "Plane084_9": "Primary", "Plane084_4": "Primary" },
        //         zone10: { "BézierCircle003": "secondary" },
        //     },
        //     subZoneColorGroupMap: {
        //         stripes1: { "Plane042": "tertiary", "Plane040": "tertiary", "Plane041": "tertiary", },
        //         stripes2: { "Plane042_1": "secondary", "Plane040_1": "secondary", "Plane041_1": "secondary", },
        //         stripes3: { "Plane042_2": "tertiary", "Plane040_2": "tertiary", "Plane041_2": "tertiary" },
        //         collar1: { "lace_neck_with_triangle_1_stripe_type1": "secondary" },
        //         Shoulder1: { "Plane064": "secondary", "Plane064_1": "secondary", "Plane064_2": "secondary" },
        //         Shoulder2: { "Plane032_1": "primary" },
        //         Shoulder3: { "Plane032_2": "tertiary" },
        //     }
        // }
        // ...
    };


    // Zone + Mesh to Color Group (Primary/Secondary/Tertiary)
    const zoneColorGroupMap = {
        zone1: {
            "Plane003": "primary",
            "Plane032": "primary",
            "Plane032_3": "primary",
            "Plane032_4": "primary"
        },
        zone2: {
            "Plane003_1": "primary",
            "Plane032_10": "primary",
            "Plane032_11": "primary",
            "Plane032_9": "primary"
        },
        zone3: {
            "base_stripe_5___left": "secondary",
            "Plane026": "secondary",
            "base_stripe_5___right": "secondary",
            "Plane026_3": "secondary",
            "Plane026_1": "secondary",
            "Plane026_2": "secondary",
        },
        zone4: {
            "Plane032_5": "primary",
            "Plane032_7": "primary",
        },
        zone5: {
            "Plane032_6": "primary",
            "Plane032_8": "primary",
        },
        zone6: {
            "Plane064": "secondary",
            "Plane064_1": "secondary",
            "Plane064_2": "secondary",
        },
        zone7: {
            "Triangle_V__neck_1_stripes_type1": "secondary",
        },
        zone8: {
            "jersey_for_triangle_V_neck_collar": "secondary",
        },
        zone9: {
            "Plane032_4": "primary",
            "Plane032_3": "primary",
            "Plane032_11": "primary",
            "Plane032_9": "primary",
        }

        // Add others as needed
    };


    const subZoneColorGroupMap = {
        stripes1: {
            "base_stripe_5___left": "secondary",
            "Plane026": "secondary",
            "base_stripe_5___right": "secondary",
            "Plane026_3": "secondary",
            "Plane026_1": "secondary",
            "Plane026_2": "secondary",
        },

        collar1: { // Color 2
            "Triangle_V__neck_1_stripes_type1": "secondary",
        },

        Shoulder1: { "Plane064": "secondary", "Plane064_2": "secondary", "Plane064_1": "secondary" },
        Shoulder2: { "Plane032_1": "primary" },
        Shoulder3: { "Plane032_2": "tertiary" },

    };
    const subzoneMap = {
        zone3: {
            radio: document.querySelector('input[value="zone3"]'),
            subCategoryDiv: document.querySelector('.subCategory.zone3'),
            defaultSub: "stripes1"
        },
        zone6: {
            radio: document.querySelector('input[value="zone6"]'),
            subCategoryDiv: document.querySelector('.subCategory.zone6'),
            defaultSub: "Shoulder1"
        },
        zone7: {
            radio: document.querySelector('input[value="zone7"]'),
            subCategoryDiv: document.querySelector('.subCategory.zone7'),
            defaultSub: "collar1"
        }
    };

    // 🔁 Build a quick reverse lookup: subzone -> parentZone
    const subzoneToZoneMap = {
        stripes1: "zone3",
        stripes2: "zone3",
        stripes3: "zone3",
        collar1: "zone7",
        collar2: "zone7",
        collar3: "zone7",
        Shoulder1: "zone6",
        Shoulder2: "zone6",
        Shoulder3: "zone6",
    };

    function blinkSubzoneMeshes(subzone) {
        const meshColorMap = activeZoneConfig.subZoneColorGroupMap[subzone] || {};
        const meshesToBlink = Object.keys(meshColorMap);
        const blinkDuration = 5000; // 5 seconds
        const blinkSpeed = 500; // Update every 50ms for smooth transition
        const startTime = Date.now();

        // Store original states
        meshesToBlink.forEach(meshName => {
            model.traverse(child => {
                if (!child.isMesh || child.name !== meshName) return;

                if (!child.userData.originalState) {
                    child.userData.originalState = {
                        color: child.material.color.clone(),
                        emissive: child.material.emissive ? child.material.emissive.clone() : null,
                        emissiveIntensity: child.material.emissiveIntensity || 0
                    };
                }
            });
        });

        const blinkIntervalId = setInterval(() => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= blinkDuration) {
                clearInterval(blinkIntervalId);
                // Restore original states
                meshesToBlink.forEach(meshName => {
                    model.traverse(child => {
                        if (!child.isMesh || child.name !== meshName || !child.userData.originalState) return;

                        const { color, emissive, emissiveIntensity } = child.userData.originalState;
                        child.material.color.copy(color);
                        if (emissive && child.material.emissive) {
                            child.material.emissive.copy(emissive);
                            child.material.emissiveIntensity = emissiveIntensity;
                        }
                        delete child.userData.originalState;
                    });
                });
                return;
            }

            // Smooth pulsing effect using sine wave
            const pulse = 0.5 * (1 + Math.sin(elapsed * 0.005 * Math.PI * 2)); // 0-1 oscillation
            const blinkColor = new THREE.Color(0x2DDEED).lerp(new THREE.Color(0xFFFFFF), pulse);
            const emissiveIntensity = pulse * 0.5; // Subtle emissive effect

            meshesToBlink.forEach(meshName => {
                model.traverse(child => {
                    if (!child.isMesh || child.name !== meshName) return;

                    // Apply the pulsing color
                    child.material.color.copy(blinkColor);

                    // Add subtle emissive effect for fabric glow
                    if (child.material.emissive) {
                        child.material.emissive.setHex(0x2DDEED);
                        child.material.emissiveIntensity = emissiveIntensity;
                    }

                    // Enhance fabric appearance by modifying roughness slightly
                    if (child.material.roughness !== undefined) {
                        child.material.roughness = THREE.MathUtils.lerp(0.7, 0.4, pulse);
                    }
                });
            });
        }, blinkSpeed);
    }

    function blinkZoneMeshes(zone) {
        const meshesToBlink = activeZoneConfig.zoneMeshMap[zone] || [];
        const blinkDuration = 3000; // 5 seconds
        const blinkSpeed = 500; // Update every 50ms for smooth transition
        const startTime = Date.now();

        // Store original states
        meshesToBlink.forEach(meshName => {
            model.traverse(child => {
                if (!child.isMesh || child.name !== meshName) return;

                if (!child.userData.originalState) {
                    child.userData.originalState = {
                        color: child.material.color.clone(),
                        emissive: child.material.emissive ? child.material.emissive.clone() : null,
                        emissiveIntensity: child.material.emissiveIntensity || 0,
                        roughness: child.material.roughness || 0.7
                    };
                }
            });
        });

        const blinkIntervalId = setInterval(() => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= blinkDuration) {
                clearInterval(blinkIntervalId);
                // Restore original states
                meshesToBlink.forEach(meshName => {
                    model.traverse(child => {
                        if (!child.isMesh || child.name !== meshName || !child.userData.originalState) return;

                        const { color, emissive, emissiveIntensity, roughness } = child.userData.originalState;
                        child.material.color.copy(color);
                        if (emissive && child.material.emissive) {
                            child.material.emissive.copy(emissive);
                            child.material.emissiveIntensity = emissiveIntensity;
                        }
                        if (child.material.roughness !== undefined) {
                            child.material.roughness = roughness;
                        }
                        delete child.userData.originalState;
                    });
                });
                return;
            }

            // Smooth pulsing effect using sine wave
            const pulse = 0.5 * (1 + Math.sin(elapsed * 0.005 * Math.PI * 2)); // 0-1 oscillation
            const blinkColor = new THREE.Color(0x2DDEED).lerp(new THREE.Color(0xFFFFFF), pulse);
            const emissiveIntensity = pulse * 0.5; // Subtle emissive effect

            meshesToBlink.forEach(meshName => {
                model.traverse(child => {
                    if (!child.isMesh || child.name !== meshName) return;

                    // Apply the pulsing color
                    child.material.color.copy(blinkColor);

                    // Add subtle emissive effect for fabric glow
                    if (child.material.emissive) {
                        child.material.emissive.setHex(0x2DDEED);
                        child.material.emissiveIntensity = emissiveIntensity;
                    }

                    // Enhance fabric appearance by modifying roughness
                    if (child.material.roughness !== undefined) {
                        child.material.roughness = THREE.MathUtils.lerp(0.7, 0.4, pulse);
                    }
                });
            });
        }, blinkSpeed);
    }
    let activeZone = "zone1"; // default
    const zoneSvgColorMap = {};  // stores: zone -> mesh -> group -> color
    // ✅ Main zone radio handling
    document.querySelectorAll('input[name="zoneRadio"]').forEach((radio) => {
        radio.addEventListener("change", () => {
            const selected = radio.value;
            activeZone = selected;
            const parentZone = subzoneToZoneMap[selected];
            if (parentZone) {
                updateZoneTitle(parentZone, selected);
            } else {
                updateZoneTitle(selected);
            }

            for (const [zoneKey, { radio: zoneRadio, subCategoryDiv, defaultSub }] of Object.entries(subzoneMap)) {
                const isParentZone = selected === zoneKey;
                const isChildSubzone = subzoneToZoneMap[selected] === zoneKey;

                if (isParentZone || isChildSubzone) {
                    if (subCategoryDiv) subCategoryDiv.style.display = "grid";
                    if (zoneRadio) zoneRadio.disabled = true;

                    if (isParentZone) {
                        blinkZoneMeshes(zoneKey);

                        setTimeout(() => {
                            const defaultSubRadio = document.querySelector(`input[value="${defaultSub}"]`);
                            if (defaultSubRadio) defaultSubRadio.checked = true;

                            activeZone = defaultSub;
                            blinkSubzoneMeshes(defaultSub);
                            applySubzoneColor(defaultSub);
                            updateZoneTitle(zoneKey, defaultSub);
                        }, 100);

                        return;
                    }
                } else {
                    if (subCategoryDiv) subCategoryDiv.style.display = "none";
                    if (zoneRadio) zoneRadio.disabled = false;
                }
            }

            if (!subzoneToZoneMap[selected]) {
                blinkZoneMeshes(selected);
                updateSvgPatternColors(); // Changed from applyZoneColor(selected)
            }
        });
    });

    // ✅ Subzone radios (like collar1, stripes2, etc.)
    document.querySelectorAll('.subCategory input[type="radio"]').forEach((subRadio) => {
        subRadio.addEventListener("change", () => {
            const subzone = subRadio.value;
            activeZone = subzone;

            const parentZone = subzoneToZoneMap[subzone];
            if (!parentZone) return;

            updateZoneTitle(parentZone, subzone);
            blinkSubzoneMeshes(subzone);
            applySubzoneColor(subzone);
        });
    });

    function updateZoneTitle(zone, subzone = null) {
        const titleDiv = document.getElementById("zoneTitle");
        if (!titleDiv) return;

        const zoneLabel = document.querySelector(`input[value="${zone}"]`)?.closest("label")?.querySelector(".meshActiveFaceName")?.textContent?.trim() || zone;
        const subzoneLabel = subzone
            ? document.querySelector(`input[value="${subzone}"]`)?.closest("label")?.querySelector(".meshActiveFaceName")?.textContent?.trim()
            : null;

        titleDiv.textContent = subzoneLabel ? `Choose color for ${zoneLabel} – ${subzoneLabel}` : `Choose color for ${zoneLabel}`;
    }

    function applySubzoneColor(subzone) {
        const meshColorMap = activeZoneConfig.subZoneColorGroupMap[subzone] || {};
        const meshNames = Object.keys(meshColorMap);

        model.traverse(child => {
            if (!child.isMesh || !child.userData.pattern || !child.userData.pattern.isSvg) return;

            const meshName = child.name;
            if (!meshNames.includes(meshName)) return;

            const patternData = child.userData.pattern;
            const originalColors = patternData.originalColors;

            let customizedSvg = patternData.originalSvg || patternData.svgContent;
            patternData.originalSvg = patternData.originalSvg || patternData.svgContent;

            const newColorMap = {};
            originalColors.forEach(originalColor => {
                const normalized = originalColor.toLowerCase().replace('#', '');
                const COLOR_MAPPING = {
                    "#fdb515": "primary",
                    "#00003b": "secondary",
                    "#FFFFFF": "tertiary",
                    "white": "tertiary"
                };

                let group = null;
                for (const [key, val] of Object.entries(COLOR_MAPPING)) {
                    if (normalized === key.replace('#', '').toLowerCase()) {
                        group = val;
                        break;
                    }
                }

                const expectedGroup = meshColorMap[meshName];
                if (group && group === expectedGroup) {
                    updateRadioPreview(subzone, group);


                    let replacementColor = MESH_COLORS[meshName] || COLORS[group];
                    if (typeof replacementColor === 'number') {
                        replacementColor = `#${replacementColor.toString(16).padStart(6, '0')}`;
                    }
                    if (!replacementColor.startsWith('#')) {
                        replacementColor = `#${replacementColor}`;
                    }

                    newColorMap[group] = replacementColor.toLowerCase();

                    const colorRegex = new RegExp(`(${originalColor}|${originalColor.toLowerCase()}|${originalColor.toUpperCase()})`, 'g');
                    customizedSvg = customizedSvg.replace(colorRegex, replacementColor);
                }
            });

            child.userData.pattern.currentColorMap = newColorMap;

            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(customizedSvg, "image/svg+xml");
            const svgElement = svgDoc.querySelector('svg');

            let svgWidth = parseFloat(svgElement.getAttribute('width') || svgElement.viewBox.baseVal.width || 1024);
            let svgHeight = parseFloat(svgElement.getAttribute('height') || svgElement.viewBox.baseVal.height || 1024);

            const svgBlob = new Blob([customizedSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                canvas.width = svgWidth;
                canvas.height = svgHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const baseTexture = new THREE.CanvasTexture(canvas);
                baseTexture.flipY = false;
                child.userData.pattern.baseTexture = baseTexture;

                updateMeshTextureForMesh(child);
                URL.revokeObjectURL(url);
            };
            img.src = url;
        });
    }

    function updateSvgPatternColors() {
        if (!model) return;

        const COLOR_MAPPING = {
            "#fdb515": "primary",   // Original red
            "#00003b": "secondary", // Original dark blue
            "#FFFFFF": "tertiary",  // White
            "white": "tertiary",
            "#ffffff": "tertiary"   // Added lowercase white
        };

        const getColorHex = (color) => {
            if (typeof color === 'string') {
                return color.startsWith('#') ? color : `#${color}`;
            } else if (typeof color === 'number') {
                return `#${color.toString(16).padStart(6, '0')}`;
            }
            return "#000000"; // Default fallback
        };

        console.log("Current color settings:");
        console.log(`Primary: ${getColorHex(COLORS.primary)}`);
        console.log(`Secondary: ${getColorHex(COLORS.secondary)}`);
        console.log(`Tertiary: ${getColorHex(COLORS.tertiary)}`);

        // Debug log for tertiary color
        console.log('Tertiary color value:', COLORS.tertiary);
        console.log('Tertiary color type:', typeof COLORS.tertiary);
        console.log('Tertiary color after getColorHex:', getColorHex(COLORS.tertiary));

        const zoneMeshes = activeZoneConfig.zoneMeshMap[activeZone] || [];
        const meshColorMap = activeZoneConfig.zoneColorGroupMap[activeZone] || {};

        if (!zoneSvgColorMap[activeZone]) zoneSvgColorMap[activeZone] = {};

        model.traverse(child => {
            if (!child.isMesh || !child.userData.pattern || !child.userData.pattern.isSvg) return;

            const meshName = child.name;
            if (!zoneMeshes.includes(meshName)) return;

            const patternData = child.userData.pattern;
            const originalColors = patternData.originalColors;

            // Start fresh from original unmodified SVG
            let customizedSvg = patternData.originalSvg || patternData.svgContent;
            patternData.originalSvg = patternData.originalSvg || patternData.svgContent;

            // Update only active zone's mapping
            const newColorMap = {};

            originalColors.forEach(originalColor => {
                const normalizedOriginal = originalColor.toLowerCase().replace('#', '');
                let group = null;

                for (const [mapColor, grp] of Object.entries(COLOR_MAPPING)) {
                    if (normalizedOriginal === mapColor.replace('#', '').toLowerCase()) {
                        group = grp;
                        break;
                    }
                }

                const meshGroup = meshColorMap[meshName];
                const isAllowed = meshGroup === group;

                if (group && isAllowed) {
                    let replacementColor = MESH_COLORS[meshName] || COLORS[group];

                    // Ensure proper color format using getColorHex
                    replacementColor = getColorHex(replacementColor);

                    newColorMap[group] = replacementColor.toLowerCase();
                    console.log(`✅ ${group} color assigned to ${meshName} in ${activeZone}: ${replacementColor}`);
                    updateRadioPreview(activeZone, group);
                } else {
                    console.log(`⚠️ ${originalColor} skipped for ${meshName} in ${activeZone}`);
                }
            });

            // Save the new color map to the zone
            if (!zoneSvgColorMap[activeZone][meshName]) {
                zoneSvgColorMap[activeZone][meshName] = {};
            }
            Object.assign(zoneSvgColorMap[activeZone][meshName], newColorMap);

            // 🔁 Now merge all zone maps
            // 🆕 Only use active zone's color map for this mesh
            const mergedColorMap = zoneSvgColorMap[activeZone][meshName] || {};

            // 🖌️ Now apply merged colors to original SVG
            originalColors.forEach(originalColor => {
                const normalizedOriginal = originalColor.toLowerCase().replace('#', '');
                let group = null;

                for (const [mapColor, grp] of Object.entries(COLOR_MAPPING)) {
                    if (normalizedOriginal === mapColor.replace('#', '').toLowerCase()) {
                        group = grp;
                        break;
                    }
                }

                if (group && mergedColorMap[group]) {
                    const replacementColor = mergedColorMap[group];
                    const colorRegex = new RegExp(`(${originalColor}|${originalColor.toLowerCase()}|${originalColor.toUpperCase()})`, 'g');
                    customizedSvg = customizedSvg.replace(colorRegex, replacementColor);
                }
            });

            child.userData.pattern.currentColorMap = mergedColorMap;
            child.userData.pattern.currentPrimaryHex = mergedColorMap.primary || "#fdb515";

            // Update mesh texture
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(customizedSvg, "image/svg+xml");
            const svgElement = svgDoc.querySelector('svg');

            let svgWidth = parseFloat(svgElement.getAttribute('width') || svgElement.viewBox.baseVal.width || 1024);
            let svgHeight = parseFloat(svgElement.getAttribute('height') || svgElement.viewBox.baseVal.height || 1024);

            const svgBlob = new Blob([customizedSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                canvas.width = svgWidth;
                canvas.height = svgHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const baseTexture = new THREE.CanvasTexture(canvas);
                baseTexture.flipY = false;
                child.userData.pattern.baseTexture = baseTexture;

                updateMeshTextureForMesh(child);
                URL.revokeObjectURL(url);
            };
            img.src = url;
        });
    }
    function extractColorsFromSVG(svgContent) {
        const colors = new Set();

        // 1. Extract from direct attributes
        const directAttributes = svgContent.match(/(fill|stroke)="([^"]*)"/g) || [];
        directAttributes.forEach(attr => {
            const value = attr.split('"')[1];
            if (isValidColor(value)) colors.add(value);
        });

        // 2. Extract from style attributes
        const styleBlocks = svgContent.match(/style="([^"]*)"/g) || [];
        styleBlocks.forEach(style => {
            const declarations = style.split(';');
            declarations.forEach(decl => {
                if (decl.includes('fill:') || decl.includes('stroke:')) {
                    const value = decl.split(':')[1].trim();
                    if (isValidColor(value)) colors.add(value);
                }
            });
        });

        // 3. Extract from CSS style tags (basic support)
        const styleTags = svgContent.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || [];
        styleTags.forEach(tag => {
            const rules = tag.match(/[^{}]*\{[^{}]*\}/g) || [];
            rules.forEach(rule => {
                const fillMatch = rule.match(/fill:\s*([^;}]*)/);
                const strokeMatch = rule.match(/stroke:\s*([^;}]*)/);

                if (fillMatch && isValidColor(fillMatch[1].trim())) {
                    colors.add(fillMatch[1].trim());
                }
                if (strokeMatch && isValidColor(strokeMatch[1].trim())) {
                    colors.add(strokeMatch[1].trim());
                }
            });
        });

        return Array.from(colors);
    }

    function isValidColor(value) {
        return value && !['none', 'inherit', 'currentColor', 'transparent'].includes(value) &&
            (value.startsWith('#') ||
                value.startsWith('rgb(') ||
                value.startsWith('rgba(') ||
                /^[a-z]+$/i.test(value)); // Named colors
    }

    // Load a default model when the page loads
    function loadDefaultModel() {
        // Show preloader when starting to load default model
        document.getElementById("preloader").style.display = "flex";

        const defaultModelUrl = "assets/models/Tri_V-neck_1_stripe_5New3.glb";
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
    let activeZoneConfig = null;

    function loadModel(url, colorMappings, modelType) {
        console.log(`Loading model: ${url}, type: ${modelType}`);

        // Clear previous model and event listeners
        if (isLoadingModel) return;
        isLoadingModel = true;

        document.getElementById("preloader").style.display = "flex";
        updatePreloader(0); // start fresh at 0%
        saveState();
        clearPreviousModel();

        // Show preloader when starting to load

        currentModelType = modelType; // Store the current model type
        currentModelType = modelType;
        currentModelFilename = url.split('/').pop(); // Clear previous model and decals
        // Hide all forms initially
        activeZoneConfig = modalZoneConfig[currentModelFilename];
        if (!activeZoneConfig) activeZoneConfig = modalZoneConfig["Tri_V-neck_1_stripe_5New3.glb"];
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

        // Hide all forms initially
        document.querySelectorAll(".patternMesh form, .gradeientMEsh form").forEach((form) => {
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
            Object.assign(COLORS, designColors.halfSleeves);
        } else if (modelType === "fullSleeves") {
            document.querySelector(".fullSleevePattern").style.display = "grid";
            document.querySelector(".fullSleeveGradient").style.display = "grid";
            Object.assign(COLORS, designColors.fullSleeves);
        }

        // console.log(`Loading model from URL: ${url}`);

        // Remove the existing model if it exists
        if (model) {
            scene.remove(model);
            model = null;
        }

        // Track loading progress
        let resourcesLoaded = 0;
        let totalResources = 1; // Start with 1 for the main model
        resourcesLoaded = 0;
        totalResources = 1; // model itself
        svgResourcesLoaded = 0;
        svgTotalResources = 0;
        saveState();
        clearPreviousModel();

        const meshColorGroups = {
            Primary: [],
            Secondary: [],
            Tertiary: [],
        };
        // Function to update progress
        function updateResourceProgress() {
            resourcesLoaded++;
            const progress = Math.min(resourcesLoaded / totalResources, 1); // 🔹 clamp to 1
            updatePreloader(progress * 0.9); // Reserve 10% for final setup
        }

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
        // Radio button change handler
        document.querySelectorAll('input[name="meshActiveColor"]').forEach((radio) => {
            radio.addEventListener("change", () => {
                const selected = document.querySelector('input[name="meshActiveColor"]:checked').value;
                const allItems = document.querySelectorAll(".meshColorPalette .colorItems");

                allItems.forEach(item => {
                    const isTertiaryOnly = item.classList.contains("onlyShowInTertiary");

                    if (selected === "Tertiary") {
                        item.style.display = isTertiaryOnly ? "block" : "none";
                    } else {
                        item.style.display = "block";
                    }
                });
            });
        });


        document.querySelectorAll(".meshColorPalette .colorItems .palette").forEach((palette) => {
            palette.addEventListener("click", (e) => {
                const activeMeshRadio = document.querySelector('input[name="zoneRadio"]:checked');
                const activeZone = activeMeshRadio.value;

                const selectedColor = e.target.dataset.color;

                const isSubzone = subZoneColorGroupMap[activeZone] !== undefined;

                const meshColorMap = isSubzone
                    ? subZoneColorGroupMap[activeZone]
                    : zoneColorGroupMap[activeZone] || {};

                let zoneMeshes = isSubzone
                    ? Object.keys(meshColorMap)
                    : zoneMeshMap[activeZone] || [];

                console.log('palette zoneMeshes =>>>>', zoneMeshes);
                console.log('palette activeZone =>>>>', activeZone);

                const groupsToUpdate = new Set();

                zoneMeshes.forEach(meshName => {
                    const group = meshColorMap[meshName];
                    if (group) {
                        window.MESH_COLORS = window.MESH_COLORS || {};

                        zoneMeshes.forEach(meshName => {
                            const group = meshColorMap[meshName];
                            if (group) {
                                COLORS[group] = selectedColor;
                                MESH_COLORS[meshName] = selectedColor; // ✅ Save per-mesh color
                                groupsToUpdate.add(group);
                            }
                        });
                        groupsToUpdate.add(group);
                    }
                });

                console.log('COLORS here =>', COLORS);

                // Update color previews
                groupsToUpdate.forEach(group => {
                    const preview = document.getElementById(`apply${capitalize(group)}`);
                    if (preview) preview.style.backgroundColor = selectedColor;

                    const staticPreview = document.querySelector(`#meshColorpst .${capitalize(group)}`);
                    if (staticPreview) staticPreview.style.backgroundColor = selectedColor;

                    updateRadioPreview(activeZone, group);
                });

                // ✅ Save COLORS object to localStorage
                localStorage.setItem("savedMeshColors", JSON.stringify(MESH_COLORS));
                saveDesignToLocalStorage?.(); // Optional if you're already saving everything

                // Trigger SVG update
                if (isSubzone) {
                    applySubzoneColor(activeZone);
                } else {
                    updateSvgPatternColors();
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
        loader.load(
            url,
            async function (gltf) {
                // Model loaded
                updateResourceProgress();

                model = gltf.scene;
                window.mainModel = model;
                window.scene = scene;
                window.camera = camera;
                window.renderer = renderer;
                isLoadingModel = false;
                document.addEventListener('click', selectMeshUnderMouse);
                model.name = modelType;

                const box = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3();
                const center = new THREE.Vector3();
                box.getSize(size);
                box.getCenter(center);

                model.position.sub(center);
                model.position.y -= size.y / 1003;

                const maxDim = Math.max(size.x, size.y, size.z);
                const cameraDistance = maxDim * 10;
                camera.position.set(center.x, center.y, center.z + cameraDistance);
                camera.lookAt(center);

                let fv = 1 * Math.atan(maxDim / (1 * cameraDistance)) * (180 / Math.PI);
                camera.fov = Math.min(75, Math.max(7, fv + cameraDistance - 35));
                camera.updateProjectionMatrix();
                camera.up.set(0, 1, 0);

                // Count textures to load
                totalResources = 1; // Reset to 1 (model)
                gltf.scene.traverse((child) => {
                    if (child.isMesh && child.material && child.material.map) {
                        totalResources++;
                    }
                });

                resourcesLoaded = 1; // Model is loaded

                // Apply fabric texture if available
                if (fabricTexture) {
                    applyFabricTextureToModel();
                }

                const meshColors = {};
                const meshNames = [];

                gltf.scene.traverse(child => {
                    if (child.isMesh) {
                        meshNames.push(child.name);
                        if (child.material && child.material.color) {
                            meshColors[child.name] = `#${child.material.color.getHexString()}`;
                        } else {
                            meshColors[child.name] = "No color property";
                        }

                        // Track texture loading
                        if (child.material && child.material.map) {
                            if (child.material.map.image && child.material.map.image.complete) {
                                updateResourceProgress();
                            } else {
                                child.material.map.onUpdate = updateResourceProgress;
                            }
                        }
                    }
                });

                populatePatternForm(meshNames);
                populateImagePlacementButtons();
                populateGradientForm(meshNames);
                populateMeshButtons(meshNames);

                assignMeshGroupsByColorFrequency(meshColors);
                populateMeshList(meshColors);

                processMeshes(model, meshColors);
                addInitialDecals();
                scene.add(model);

                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();

                // Final setup (last 10% of progress)
                // Count SVG resources
                svgTotalResources = 0;
                const svgPromises = [];

                gltf.scene.traverse(child => {
                    if (child.isMesh && modelSvgPatterns[currentModelFilename]?.[child.name]) {
                        svgTotalResources++;
                        const promise = loadSvgPatternForMesh(
                            child,
                            modelSvgPatterns[currentModelFilename][child.name],
                            meshColors
                        ).then(() => {
                            // Update SVG progress
                            // While loading SVGs
                            svgResourcesLoaded++;
                            const svgProgress = Math.min(svgResourcesLoaded / svgTotalResources, 1); // 🔹 clamp
                            updatePreloader(0.5 + (svgProgress * 0.5));

                        });
                        svgPromises.push(promise);
                    }
                });

                // If no SVGs, immediately complete
                if (svgTotalResources === 0) {
                    updatePreloader(1);
                    setTimeout(() => hidePreloader(), 300);
                } else {
                    // Show preloader for SVGs
                    updatePreloader(0.5);
                }
                loadDesignFromLocalStorage();
                // Wait for all SVGs to load
                await Promise.all(svgPromises);

                // Final progress update
                // ✅ Always finish at exactly 100%
                updatePreloader(1);
                setTimeout(() => hidePreloader(), 300);

                setTimeout(() => {
                    updateSvgPatternColors();
                    updateZoneColorPreviews();
                }, 300);
            },
            // Progress callback
            function (xhr) {
                const percent = xhr.loaded / (xhr.total || 1);
                updatePreloader(percent * 0.5); // Model loading is 50% of total progress
                console.log((percent * 100) + '% loaded');
            },
            // Error callback
            function (error) {
                console.error('Error loading model:', error);
                isLoadingModel = false;
                hidePreloader();

                alert("Failed to load the model. Please try again.");

                if (undoStack.length > 0) {
                    applyState(undoStack[undoStack.length - 1]);
                } else {
                    loadDefaultModel();
                }
            }
        );

        updateUndoRedoButtons();
    }

    // Unified mapping: collar + style + stripe -> model url + type + colorMappings
    const modelMap = {
        collar1: { // V-Neck
            style1: {
                stripe1: {
                    url: "assets/models/triangleVNeckWithoutLaceStripes_0.5-1-2-1-0.5.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                },
                stripe2: {
                    url: "assets/models/Tri_V-neck_1_stripe_5New3.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                },
                stripe3: {
                    url: "assets/models/triangleVNeckWithoutLaceStripes_2-3.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                },
                stripe4: {
                    url: "assets/models/triangleVNeckWithoutLaceStripes_2-1-2.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                },
                stripe5: {
                    url: "assets/models/triangleVNeckWithoutLaceStripes_131.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                },
                stripe6: {
                    url: "assets/models/triangleVNeckWithoutLaceStripes_1.5-2-1.5.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                }
                // continue stripe4, stripe5, stripe6 if needed
            }
        },
        collar2: { // Lace Neck
            style2: {
                stripe1: {
                    url: "assets/models/triV-neckWithLace_stripes_1.5-2-1.5.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                },
            }
        },
        collar3: { // V Neck Without Patch
            style3: {
                stripe1: {
                    url: "assets/models/V-neckStripes_5.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                },
                stripe2: {
                    url: "assets/models/V-neckStripes_5.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                },
                stripe3: {
                    url: "assets/models/V-neckStripes_2-3.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                },
                stripe4: {
                    url: "assets/models/V-neckStripes_2-1-2.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                },
                stripe5: {
                    url: "assets/models/V-neckStripes_131.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                },
                stripe6: {
                    url: "assets/models/V-neckStripes_1.5-2-1.5.glb",
                    type: "halfSleeves",
                    colorMappings: { Plane: "primary", Plane_1: "secondary" }
                }
                // continue stripe4, stripe5, stripe6 if needed
            }
        }
    };

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
                    <img src="images/decalPlacements/BackNumber.png" alt="${config.displayName}">
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

    let selectedCollar = null;
    let selectedStyle = null;
    let selectedStripe = null;
    let pendingModelConfig = null; // ✅ store model config until user clicks button

    const loadButton = document.querySelector(".LoadModalNow");
    if (loadButton) {
        loadButton.style.display = "none"; // Hide button initially
        loadButton.addEventListener("click", () => {
            if (pendingModelConfig) {
                console.log("▶️ Loading model:", pendingModelConfig);
                loadModel(
                    pendingModelConfig.url,
                    pendingModelConfig.colorMappings,
                    pendingModelConfig.type
                );
                pendingModelConfig = null; // reset after loading
                loadButton.style.display = "none"; // hide button again
            }
        });
    }

    // Collar selection
    document.querySelectorAll("#collarForms input[type=checkbox]").forEach(input => {
        input.addEventListener("change", () => {
            selectedCollar = input.value;
            console.log("Collar selected:", selectedCollar);
        });
    });

    // Style selection
    document.querySelectorAll("#jerseyStyleForm input[type=checkbox]").forEach(input => {
        input.addEventListener("change", () => {
            selectedStyle = input.value;
            console.log("Style selected:", selectedStyle);
        });
    });

    // Stripes selection → only stores model, shows button
    document.querySelectorAll("#jerseyStripesForm input[type=checkbox]").forEach(input => {
        input.addEventListener("change", () => {
            selectedStripe = input.value;
            console.log("Stripe selected:", selectedStripe);

            if (selectedCollar && selectedStyle && selectedStripe) {
                const config = modelMap[selectedCollar]?.[selectedStyle]?.[selectedStripe];
                if (config) {
                    pendingModelConfig = config; // ✅ store model for later
                    console.log("✅ Model stored, waiting for Load Modal button:", config);
                    loadButton.style.display = "inline-block"; // show button
                } else {
                    console.warn("⚠️ No model defined for:", selectedCollar, selectedStyle, selectedStripe);
                    pendingModelConfig = null;
                    loadButton.style.display = "none";
                }
            }
        });
    });


    function applyZoneColor(zone) {
        const meshColorMap = activeZoneConfig.zoneColorGroupMap[zone] || {};
        const meshNames = Object.keys(meshColorMap);

        model.traverse(child => {
            if (!child.isMesh || !child.userData.pattern || !child.userData.pattern.isSvg) return;

            const meshName = child.name;
            if (!meshNames.includes(meshName)) return;

            const patternData = child.userData.pattern;
            const originalColors = patternData.originalColors;

            let customizedSvg = patternData.originalSvg || patternData.svgContent;
            patternData.originalSvg = patternData.originalSvg || patternData.svgContent;

            const newColorMap = {};
            originalColors.forEach(originalColor => {
                const normalized = originalColor.toLowerCase().replace('#', '');
                const COLOR_MAPPING = {
                    "#fdb515": "primary",
                    "#00003b": "secondary",
                    "#FFFFFF": "tertiary",
                    "white": "tertiary"
                };

                let group = null;
                for (const [key, val] of Object.entries(COLOR_MAPPING)) {
                    if (normalized === key.replace('#', '').toLowerCase()) {
                        group = val;
                        break;
                    }
                }

                const expectedGroup = meshColorMap[meshName];
                if (group && group === expectedGroup) {
                    updateRadioPreview(zone, group);

                    let replacementColor = MESH_COLORS[meshName] || COLORS[group];
                    if (typeof replacementColor === 'number') {
                        replacementColor = `#${replacementColor.toString(16).padStart(6, '0')}`;
                    }
                    if (!replacementColor.startsWith('#')) {
                        replacementColor = `#${replacementColor}`;
                    }

                    newColorMap[group] = replacementColor.toLowerCase();

                    const colorRegex = new RegExp(`(${originalColor}|${originalColor.toLowerCase()}|${originalColor.toUpperCase()})`, 'g');
                    customizedSvg = customizedSvg.replace(colorRegex, replacementColor);
                }
            });

            child.userData.pattern.currentColorMap = newColorMap;

            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(customizedSvg, "image/svg+xml");
            const svgElement = svgDoc.querySelector('svg');

            let svgWidth = parseFloat(svgElement.getAttribute('width') || svgElement.viewBox.baseVal.width || 1024);
            let svgHeight = parseFloat(svgElement.getAttribute('height') || svgElement.viewBox.baseVal.height || 1024);

            const svgBlob = new Blob([customizedSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                canvas.width = svgWidth;
                canvas.height = svgHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const baseTexture = new THREE.CanvasTexture(canvas);
                baseTexture.flipY = false;
                child.userData.pattern.baseTexture = baseTexture;

                updateMeshTextureForMesh(child);
                URL.revokeObjectURL(url);
            };
            img.src = url;
        });
    }
    function loadDynamicModel(collar, style, stripe) {
        const config = modelMap[collar]?.[style]?.[stripe];
        if (!config) {
            console.warn("No model defined for:", collar, style, stripe);
            return;
        }

        console.log(`🔄 Loading dynamic model: ${collar} + ${style} + ${stripe}`);
        loadModel(config.url, config.colorMappings, config.type);
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
    // Add this new function to apply fabric texture
    function applyFabricTextureToModel() {
        model.traverse((child) => {
            if (!child.isMesh) return;

            // Keep userData
            const ud = child.userData || (child.userData = {});

            // ✅ If a custom fabric was set for this mesh, use it; else use global polyester
            const baseMap = ud.customFabricTexture || fabricTexture;

            if (!child.material || !child.material.isMeshStandardMaterial) {
                child.material = new THREE.MeshStandardMaterial({
                    map: baseMap,
                    roughness: 0.9,
                    metalness: 0.2,
                    side: THREE.DoubleSide,
                    transparent: true,
                    alphaTest: 0.001
                });
            } else {
                child.material.map = baseMap;
                child.material.needsUpdate = true;
            }

            if (baseMap) baseMap.needsUpdate = true;
        });

        // Keep your existing compositor/decals pipeline
        updateAllMeshTextures();
    }


    // Load fabric texture
    textureLoader.load('images/Patterns/polyester-fabric.jpg', function (texture) {
        fabricTexture = texture;
        fabricTexture.wrapS = fabricTexture.wrapT = THREE.RepeatWrapping;
        fabricTexture.repeat.set(2, 2);
        fabricTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        if (model) {
            applyFabricTextureToModel(); // ✅ now respects per-mesh overrides
        }
    });

    function setFabricTexture(path) {
        textureLoader.load(path, function (texture) {
            fabricTexture = texture;

            if (model) {
                model.traverse(mesh => {
                    if (mesh.isMesh) {
                        updateFabricForMesh(mesh);            // update base only
                        updateMeshTextureForMesh(mesh, {});   // rebuild with new fabric under
                    }
                });
            }
        });
    }
    // Example mapping (adjust per model)
    const fabricZoneMeshMap = {
        Base: [
            "Plane003",
            "Plane032",
            "Plane026",
            "Plane026_1",
            "Plane026_2",
            "Plane026_3",
            "base_stripe_5___left",
            "base_stripe_5___right",
            "jersey_for_triangle_V_neck_collar",
            "Triangle_V__neck_1_stripes_type1",
            "Plane087",
            "Plane087_1",
            "Plane003_1",
            "Plane032_1",
            "Plane032_2",
            "Plane032_5",
            "Plane032_6",
            "Plane032_7",
            "Plane032_8",
            "Plane032_9",
            "Plane032_10",
            "Plane032_11"
        ],
        Shoulder: ["Plane064_1", "Plane064_2", "Plane064"],
        Mesh: ["Plane032_3", "Plane032_4"],
        // SubZone1: ["StripeMesh1"],
        // SubZone2: ["StripeMesh2"],
        // SubZone3: ["StripeMesh3"],
        // SubZone4: ["StripeMesh4"]
    };
    let activeFabricZone = null;

    document.querySelectorAll('input[name="fabric"]').forEach(input => {
        input.addEventListener("change", e => {
            activeFabricZone = e.target.value; // "Base", "Shoulder", "SubZone1" etc
            console.log("Selected zone:", activeFabricZone);
        });
    });


    function updateFabricForMesh(mesh) {
        if (!mesh.userData.fabricCanvas) {
            mesh.userData.fabricCanvas = document.createElement("canvas");
            mesh.userData.fabricCanvas.width = 1024;
            mesh.userData.fabricCanvas.height = 1024;
        }

        const ctx = mesh.userData.fabricCanvas.getContext("2d");
        ctx.clearRect(0, 0, 1024, 1024);

        if (fabricTexture && fabricTexture.image) {
            const pattern = ctx.createPattern(fabricTexture.image, "repeat");
            const scale = 0.5;
            const transform = new DOMMatrix().scaleSelf(scale, scale);
            if (pattern.setTransform) pattern.setTransform(transform);

            ctx.fillStyle = pattern;
            ctx.globalAlpha = 0.35; // subtle base
            ctx.fillRect(0, 0, 1024, 1024);
            ctx.globalAlpha = 1;
        } else {
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, 1024, 1024);
        }
    }

    document.querySelectorAll('input[name="fabricMaterial[]"]').forEach(input => {
        input.addEventListener("change", e => {
            if (!activeFabricZone) {
                console.warn("⚠ Please select a zone first (Base/Shoulder/Mesh/SubZone).");
                return;
            }

            if (e.target.checked) {
                let fabricPath = "";

                switch (e.target.value) {
                    case "fabric1": fabricPath = "images/Patterns/AirKnitProMax.png"; break;
                    case "fabric2": fabricPath = "images/Patterns/AirKnitPro.png"; break;
                    case "fabric3": fabricPath = "images/Patterns/Concave.png"; break;
                    case "fabric4": fabricPath = "images/Patterns/fabric_denim.jpg"; break;
                    default: fabricPath = "images/Patterns/polyester-fabric.jpg";
                }

                textureLoader.load(fabricPath, texture => {
                    fabricTexture = texture;
                    fabricTexture.wrapS = fabricTexture.wrapT = THREE.RepeatWrapping;
                    fabricTexture.repeat.set(2, 2);

                    // 👉 Only apply to meshes of selected zone
                    if (fabricZoneMeshMap[activeFabricZone]) {
                        fabricZoneMeshMap[activeFabricZone].forEach(meshName => {
                            const mesh = model.getObjectByName(meshName);
                            if (mesh) {
                                updateFabricForMesh(mesh);          // redraw fabric canvas
                                updateMeshTextureForMesh(mesh, {}); // rebuild full texture
                            }
                        });
                    }
                });
            }
        });
    });


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
        const allowedPatternMeshes = ['Mesh', 'Plane002_1', 'Plane002_6', 'Plane002_4'];
        const form = document.getElementById("dynamicPatternForm");
        form.innerHTML = ""; // Clear existing content

        const modelConfig = modelMeshConfigs[currentModelType]?.[currentModelFilename] || {};
        let meshesToShow = modelConfig.patternMeshes || meshNames;

        // ✅ Filter only allowed meshes
        meshesToShow = meshesToShow.filter(mesh => allowedPatternMeshes.includes(mesh));

        selectedPatternParts = {};

        meshesToShow.forEach((meshName) => {
            if (!meshNames.includes(meshName)) return;

            selectedPatternParts[meshName] = false;

            const displayName = getMeshDisplayName(meshName, currentModelFilename);

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

        document.querySelectorAll('#dynamicPatternForm input[type="checkbox"]').forEach((checkbox) => {
            checkbox.addEventListener("change", function () {
                const part = this.id;
                selectedPatternParts[part] = this.checked;
                console.log(`Pattern part ${part} ${this.checked ? "selected" : "deselected"}`);

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
    controls.dampingFactor = 0.09; // Damping inertia factor (lower = more smooth)
    controls.rotateSpeed = 1; // Rotation speed (default is 1)
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
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            canvas.width = 1024; // Increased resolution
            canvas.height = 1024;
            const context = canvas.getContext("2d");

            // Fill with white background
            context.fillStyle = "#FFFFFF";
            context.fillRect(0, 0, canvas.width, canvas.height);
            const reader = new FileReader();
            reader.onload = function (event) {

                const img = new Image();
                img.onload = function () {
                    // Calculate dimensions to maintain aspect ratio
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
                        imageSrc: event.target.result // ✅ return base64
                    });
                };
                img.src = URL.createObjectURL(imageFile);
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
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
    // Add this to your modelMeshConfigs
    const modelMeshConfigs = {
        halfSleeves: {
            'Tri_V-neck_1_stripe_5New3.glb': {
                placementMeshes: {
                    Plane003: {
                        displayName: "Front",
                        uvCorrection: { x: 0, y: 0 },
                        textPosition: { x: 0.7, y: 0.2 }, // Text position
                        imagePosition: { x: 0.27, y: 0.21 }  // Image position
                    },
                    Plane032: {
                        displayName: "Back",
                        uvCorrection: { x: 0, y: 0 },
                        textPosition: { x: 0.5, y: 0.4 },
                        imagePosition: { x: 0.5, y: 0.6 }
                    },
                    Plane064_1: {
                        displayName: "L-Shoulder",
                        uvCorrection: { x: 0, y: -0.2 },
                        textPosition: { x: 0.5, y: 0.6 },
                        imagePosition: { x: 0.38, y: 0.56 }
                    },
                    Plane064: {
                        displayName: "R-Shoulder",
                        uvCorrection: { x: 0, y: -0.2 },
                        textPosition: { x: 0.5, y: 0.6 },
                        imagePosition: { x: 0.61, y: 0.57 }
                    },
                    Plane032_5: {
                        displayName: "Right Sleeve",
                        uvCorrection: { x: 0, y: -0.2 },
                        textPosition: { x: 0.5, y: 0.5 },
                        imagePosition: { x: 0.5, y: 0.5 }
                    },
                    Plane032_7: {
                        displayName: "Left Sleeve",
                        uvCorrection: { x: 0, y: -0.2 },
                        textPosition: { x: 0.5, y: 0.5 },
                        imagePosition: { x: 0.5, y: 0.5 }
                    },
                    patternMeshes: ['Mesh', 'Plane002_1', 'Mesh_17', 'Mesh_18',], // Only these will show in pattern form
                    gradientMeshes: ['Mesh', 'Plane002_1', 'Mesh_17', 'Mesh_18',], // Only these will show in gradient form

                }
            },

        },
        // Other model types...
    };
    // Add this near your other model configurations
    const modelDisplayNames = {
        // For Modal2FullSleeves.glb model
        'Tri_V-neck_1_stripe_5New3.glb': {
            'Plane003': "Front",
            'Plane032': "Back",
            'Plane064_1': "L-Shoulder",
            'Plane064': "R-Shoulder",
            'Plane032_5': "R-Sleeve",
            'Plane032_7': "R-Sleeve",
        },
        // Add mappings for other models as needed
        'Modal2FullSleeves.glb': {
            'Plane': "Front",
            'Plane_1': "Back",
            'Plane_4': "Left Sleeve"
        },
        // Default mappings for any model not specifically configured
        '_default': {
            'Plane': "Front",
            'Plane_1': "Back",
            'Plane_2': "Sleeves",
            'Plane_3': "Collar"
        }
    };

    // Add this function to handle tab changes
    function handleTabChange(activeTab) {
        const meshButtonsContainer = document.getElementById("dynamicMeshButtons");
        const imageButtonsContainer = document.getElementById("dynamicImageMeshButtons");

        const allMeshButtons = meshButtonsContainer?.querySelectorAll('button') || [];
        const allImageButtons = imageButtonsContainer?.querySelectorAll('button') || [];

        // Hide all buttons from both containers first
        allMeshButtons.forEach(button => {
            button.style.display = 'none';
        });
        allImageButtons.forEach(button => {
            button.style.display = 'none';
        });

        switch (activeTab) {
            case 'textTab':
                // Show only Plane003 for text (from dynamicMeshButtons)
                const textButton = meshButtonsContainer.querySelector('.Mesh');
                if (textButton) textButton.style.display = 'block';
                break;

            case 'numberTab':
                // Show Plane003_2, Plane003_3, and Plane003_1 (from dynamicMeshButtons)
                const numberButtons = meshButtonsContainer.querySelectorAll('.Plane032, .Plane032_7, .Plane032_5');
                numberButtons.forEach(button => {
                    button.style.display = 'block';
                });
                break;

            case 'nameTab':
                // Show only Plane003_1 for name (from dynamicMeshButtons)
                const nameButton = meshButtonsContainer.querySelector('.Plane032');
                if (nameButton) nameButton.style.display = 'block';
                break;

            case 'logoTab':
                // Show Plane003 and Plane003_4 from dynamicImageMeshButtons
                const logoButtons = imageButtonsContainer.querySelectorAll('.Plane003, .Plane064_1, .Plane064');
                logoButtons.forEach(button => {
                    button.style.display = 'block';
                });
                break;

            default:
                // Show all buttons from both containers
                allMeshButtons.forEach(button => {
                    button.style.display = 'block';
                });
                allImageButtons.forEach(button => {
                    button.style.display = 'block';
                });
        }
    }


    // Add event listeners for tab changes
    document.querySelectorAll('.sidebarTabs .nav-item a').forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.id;
            handleTabChange(tabId);
        });
    });

    // Initialize with default tab
    handleTabChange('designTab');
    function getMeshDisplayName(meshName, modelFilename) {
        // First try to get the specific mapping for this model
        const modelMapping = modelDisplayNames[modelFilename] || {};

        // If found in model-specific mapping, return it
        if (modelMapping[meshName]) {
            return modelMapping[meshName];
        }

        // Otherwise try the default mapping
        const defaultMapping = modelDisplayNames['_default'] || {};
        if (defaultMapping[meshName]) {
            return defaultMapping[meshName];
        }

        // If no mapping found, return the original name
        return meshName;
    }
    async function applyImageToSelectedMesh(imageFile, uv, scop = null, rotationDeg = 0) {
        saveState();
        if (!imageFile || !selectedMesh) return;

        try {
            const { texture, bounds, originalImage, imageSrc } = await createImageTexture(imageFile);
            const addedScop = scop || 1.0;

            const modelConfig = modelMeshConfigs[currentModelType]?.[currentModelFilename];
            let customPosition = { x: 0.5, y: 0.5 };
            if (modelConfig?.placementMeshes?.[selectedMesh.name]?.imagePosition) {
                customPosition = modelConfig.placementMeshes[selectedMesh.name].imagePosition || customPosition;
            }

            const usePosition = uv || customPosition;
            const offsetX = usePosition.x - 0.5;
            const offsetY = usePosition.y - 0.5;

            // ✅ convert degrees → radians once here
            const rotationRad = THREE.MathUtils.degToRad(rotationDeg);

            const newDecal = {
                image: originalImage,
                imageSrc,
                offset: new THREE.Vector2(offsetX, offsetY),
                rotation: rotationRad,        // Three.js/internal use (radians)
                rotationDeg: rotationDeg,     // for UI/state (degrees)
                scale: addedScop,
                mesh: selectedMesh,
                meshName: selectedMesh.name,
                uuid: THREE.MathUtils.generateUUID(),
                bounds: bounds,
                isLocked: false,
            };

            window.imageDecals.push(newDecal);
            updateMeshTextureWithAllDecals();
            updateDecalsListUI();
            activeImageDecalIndex = imageDecals.length - 1;
            activeTextDecalIndex = -1;
            updateImagePreview();
            saveDesignToLocalStorage();

            // ✅ reflect the starting rotation (in degrees) in your UI
            rotateImgSlider.value = rotationDeg;
            rotateImgValueSpan.textContent = `${rotationDeg}°`;

            // reset size UI only
            resizeImgSlider.value = 50;
            resizeValueSpan.textContent = "50%";

            resetImagePlacementMode();

            document.querySelector('.logoThirdScreen').style.display = 'none';
            document.querySelector('.logoSecondScreen .uploadLogoForm').style.display = 'none';
            document.querySelector('.logoFourthScreen').style.display = 'block';
            document.querySelector('.logoSecondScreen').style.display = 'block';

            console.log(`Added image to ${selectedMesh.name} at ${rotationDeg}°, x:${usePosition.x.toFixed(2)}, y:${usePosition.y.toFixed(2)}`);
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
                ctx.globalAlpha = 0.8;

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
            ctx.globalAlpha = 0.8;

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
        front: { x: 0, y: 0, z: 6, angle: 0 },
        back: { x: 0, y: 0, z: -6, angle: Math.PI },
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
    const meshImageMap = {
        // For text placement
        "Mesh": "images/decalPlacements/FrontLogo.png",

        // For number placement
        "Mesh_3": "images/decalPlacements/RightSleeveNumber.png",
        "Plane032_7": "images/decalPlacements/LeftSleeveNumber.png",
        "Plane032_5": "images/decalPlacements/RightSleeveNumber.png",
        "Plane032": "images/decalPlacements/BackNumber.png",

        // For name placement
        "Plane032": "images/decalPlacements/BackName.png",

        // For logo placement
        "Plane064_1": "images/decalPlacements/LeftShoulderLogo.png",
        "Plane064": "images/decalPlacements/RightShoulderLogo.png",
        "Plane003": "images/decalPlacements/FrontLogo.png",

        // Fallback default
        "default": "images/decalPlacements/default.png"
    };

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
            const displayName = getMeshDisplayName(meshName, currentModelFilename);

            const textButton = document.createElement("button");
            textButton.className = `${meshName} meshSide meshSideBtn`;
            textButton.id = `${meshName}TextButton`;
            textButton.dataset.mesh = meshName;

            textButton.innerHTML = `
<figure>
    <img src="${meshImageMap[meshName] || 'images/decalPlacements/default.png'}" alt="${displayName}">
</figure>
${displayName}
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
            const displayName = getMeshDisplayName(meshName, currentModelFilename);

            const imageButton = document.createElement("button");
            imageButton.className = `${meshName} meshSide imageMeshBtn`;
            imageButton.id = `${meshName}ImageButton`;
            imageButton.dataset.mesh = meshName;

            imageButton.innerHTML = `
            <figure>
<img src="${meshImageMap[meshName] || 'images/decalPlacements/default.png'}" alt="${displayName}">

            </figure>
            ${displayName}
        `;

            imageButton.addEventListener("click", function () {
                selectMeshFromButton(meshName, 'image');
            });

            imageContainer.appendChild(imageButton);
        });
    }

    function populateGradientForm(meshNames) {
        const allowedGradientMeshes = ['Mesh', 'Plane032', 'Plane032_7', 'Mesh_11', 'Plane032_5', 'Mesh_16', 'Mesh_1', 'Mesh_6'];
        const gradientContainer = document.querySelector(".gradeientMEsh .gradientFaces");
        gradientContainer.innerHTML = ""; // Clear existing content

        const modelConfig = modelMeshConfigs[currentModelType]?.[currentModelFilename] || {};
        let meshesToShow = modelConfig.gradientMeshes || meshNames;

        // ✅ Filter only allowed meshes
        meshesToShow = meshesToShow.filter(mesh => allowedGradientMeshes.includes(mesh));

        meshesToShow.forEach((meshName) => {
            if (!meshNames.includes(meshName)) return;

            const displayName = getMeshDisplayName(meshName, currentModelFilename);

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
            updateGradientColorPreview(gradientColor1 || '#FFFFFF', gradientColor2 || '#FFFFFF');

            applyGradientToSelectedMesh();
        });
    });
    function updateGradient() {
        updateMeshTextureForMesh(COLOR_MAPPING);
    }
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

        // Update the mesh texture to include both SVG pattern and gradient
        updateMeshTextureForMesh(mesh);
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
    }


    // Add double-click event listener for decal selection
    document.addEventListener('dblclick', (event) => {
        if (isTextMoving || isImageMoving) return;

        let decalClicked = false; // Track if we clicked a decal

        const mouse = getNormalizedMousePosition(event);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(model.children, true)
            .filter(intersect => isFrontFacing(intersect, camera));

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const uv = intersects[0].uv;

            // 1. First check image decals
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
                    decalClicked = true;

                    // Toggle image decal selection
                    if (activeImageDecalIndex === i) {
                        // Deselect image - show logoFirstScreen
                        activeImageDecalIndex = -1;
                        document.querySelector('#logoFirstScreen').style.display = 'block';
                        document.querySelector('.logoSecondScreen').style.display = 'none';
                        document.querySelector('.logoFourthScreen').style.display = 'none';
                    } else {
                        // Select image - show editing screens
                        activeImageDecalIndex = i;
                        activeTextDecalIndex = -1;
                        document.querySelector('#logoFirstScreen').style.display = 'none';
                        document.querySelector('.logoSecondScreen').style.display = 'block';
                        document.querySelector('.logoFourthScreen').style.display = 'block';
                    }
                    updateMeshTextureWithAllDecals();
                    updateImagePreview();
                    break;
                }
            }

            // 2. Then check text decals if no image decal was clicked
            if (!decalClicked) {
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
                        decalClicked = true;

                        // Toggle text decal selection
                        if (activeTextDecalIndex === i) {
                            // Deselect text - show screen1
                            activeTextDecalIndex = -1;
                            document.getElementById('screen1').style.display = 'block';
                            document.getElementById('screen3').style.display = 'none';
                        } else {
                            // Select text - show editing screen
                            activeTextDecalIndex = i;
                            activeImageDecalIndex = -1;
                            showTextEditingScreen();
                        }
                        updateMeshTextureWithAllDecals();
                        break;
                    }
                }
            }

            // 3. If clicked on mesh but not on any decal, deselect all
            if (!decalClicked) {
                activeTextDecalIndex = -1;
                activeImageDecalIndex = -1;
                // Show appropriate first screens
                document.getElementById('screen1').style.display = 'block';
                document.getElementById('screen3').style.display = 'none';
                document.querySelector('#logoFirstScreen').style.display = 'block';
                document.querySelector('.logoSecondScreen').style.display = 'none';
                document.querySelector('.logoFourthScreen').style.display = 'none';
                updateMeshTextureWithAllDecals();
            }
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
                    ctx.globalAlpha = 0.8;

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
                ctx.globalAlpha = 0.8;

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

            // Only apply pattern if this is a primary part
            if (mesh.userData.pattern?.colorGroup === 'primary') {
                // Create canvas with pattern
                const canvas = document.createElement("canvas");
                canvas.width = 1024;
                canvas.height = 1024;
                const ctx = canvas.getContext("2d");

                // Draw base pattern first (only primary parts)
                if (mesh.userData.pattern?.baseTexture) {
                    ctx.drawImage(mesh.userData.pattern.baseTexture.image, 0, 0, canvas.width, canvas.height);
                }

                const pattern = ctx.createPattern(img, "repeat");
                ctx.globalAlpha = currentPatternOpacity;
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = 0.8;

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
                    isSVG: false,
                    onlyOnPrimary: true // New flag to indicate this pattern should only affect primary parts
                };

                patternDecals.push(newDecal);
            }
        });

        updateAllMeshTextures();
        console.log(`Applied image pattern to primary parts of ${selectedParts.join(", ")}`);
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

            function applyAlpha(hexColor, alpha) {
                const r = parseInt(hexColor.slice(1, 3), 16);
                const g = parseInt(hexColor.slice(3, 5), 16);
                const b = parseInt(hexColor.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }

            // Use transparent gradient colors
            canvasGradient.addColorStop(0, applyAlpha(gradient.color1, 0.5)); // 50% visible
            canvasGradient.addColorStop(1, applyAlpha(gradient.color2, 0.5)); // 50% visible

            context.fillStyle = canvasGradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            // Default white background if no gradient
            context.fillStyle = "#FFFFFF";
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 2. Draw patterns (with their current opacity)
        const meshPatternDecals = patternDecals.filter(decal =>
            decal.mesh === selectedMesh && decal.uuid // Ensure decal still exists
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
                context.globalAlpha = 0.8;
            }
            context.restore();
        });

        // 3. Draw images
        const meshImageDecals = imageDecals.filter((decal) => decal.mesh === selectedMesh && decal.uuid);
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
                context.globalAlpha = 0.8;
                context.strokeStyle = "transparent";
                context.lineWidth = 1;
                context.setLineDash([5, 3]);
                context.strokeRect(x - 5, y - 5, width + 10, height + 10);
                context.restore();
            }
            context.restore();
        });

        // 4. Draw texts
        // Inside updateMeshTextureWithAllDecals(), in the text drawing section:
        const meshTextDecals = textDecals.filter((decal) => decal.mesh === selectedMesh && decal.uuid);
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
                context.globalAlpha = 0.8;
                const textWidth = context.measureText(decal.text).width;
                const textHeight = decal.fontSize;

                context.strokeStyle = "transparent";
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
        // This will now properly preserve the base pattern
        updateMeshTextureForMesh(selectedMesh);
    }

    function ensureProperUVs(mesh) {
        const geometry = mesh.geometry;
        if (!geometry.attributes.uv) {
            // Create UVs if they don't exist
            const uvs = [];
            const positions = geometry.attributes.position;

            for (let i = 0; i < positions.count; i++) {
                uvs.push(0, 0); // Default UVs
            }

            geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        }

        // Normalize UVs to ensure they cover 0-1 range
        const uv = geometry.attributes.uv;
        let minU = Infinity, maxU = -Infinity;
        let minV = Infinity, maxV = -Infinity;

        for (let i = 0; i < uv.count; i++) {
            const u = uv.getX(i);
            const v = uv.getY(i);

            minU = Math.min(minU, u);
            maxU = Math.max(maxU, u);
            minV = Math.min(minV, v);
            maxV = Math.max(maxV, v);
        }

        // If UVs are not in 0-1 range, normalize them
        if (minU < 0 || maxU > 1 || minV < 0 || maxV > 1) {
            const rangeU = maxU - minU;
            const rangeV = maxV - minV;

            for (let i = 0; i < uv.count; i++) {
                uv.setX(i, (uv.getX(i) - minU) / rangeU);
                uv.setY(i, (uv.getY(i) - minV) / rangeV);
            }

            uv.needsUpdate = true;
        }
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
        saveDesignToLocalStorage();
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

    // Add this helper function to check if a face is front-facing
    function isFrontFacing(intersect, camera) {
        // Get the face normal in world space
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(intersect.object.matrixWorld);
        const normal = intersect.face.normal.clone().applyMatrix3(normalMatrix).normalize();

        // Get camera direction to intersection point
        const cameraDirection = new THREE.Vector3().subVectors(
            intersect.point,
            camera.position
        ).normalize();

        // If dot product is negative, it's front-facing
        return normal.dot(cameraDirection) < 0;
    }
    // Modify your click event listener to check for text clicks
    document.addEventListener('click', (event) => {
        if (isTextMoving || isImageMoving) return;
        if (!model) return;

        const mouse = getNormalizedMousePosition(event);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(model.children, true)
            .filter(intersect => isFrontFacing(intersect, camera));

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
    function applyTextToSelectedMesh(text, uv, overrideFontSize = null, overrideFontFamily = null, overridecolor = null) {
        if (!text || !selectedMesh) return;
        const fontFamily = overrideFontFamily || document.getElementById("fontFamilySelect3").value;
        const fontSize = overrideFontSize || currentFontSize;
        const colorcust = overridecolor || selectedTextColor;

        // Get the model configuration for the current model
        const modelConfig = modelMeshConfigs[currentModelType]?.[currentModelFilename];
        let customPosition = { x: 0.5, y: 0.5 }; // Default center position

        if (modelConfig && modelConfig.placementMeshes && modelConfig.placementMeshes[selectedMesh.name]) {
            customPosition = modelConfig.placementMeshes[selectedMesh.name].textPosition || customPosition;
        }

        // Use either the custom position or the clicked position
        const usePosition = uv || customPosition;
        const offsetX = usePosition.x - 0.5;
        const offsetY = usePosition.y - 0.5;

        const newDecal = {
            text: text,
            color: colorcust,
            fontFamily: fontFamily,
            fontSize: fontSize,
            offset: new THREE.Vector2(offsetX, offsetY),
            rotation: 0,
            mesh: selectedMesh,
            meshName: selectedMesh.name, // ✅ Add this line
            uuid: THREE.MathUtils.generateUUID(),
            isLocked: false,
            outlineWidth: 2,
            outlineColor: "#000000",
            hasOutline: false
        };

        window.textDecals.push(newDecal);
        activeTextDecalIndex = textDecals.length - 1;
        updateMeshTextureWithAllDecals();
        updateDecalsListUI(); // ✅ Add this
        document.querySelector(".decalText").textContent = text;

        // Reset placement mode
        resetTextPlacementMode();

        // Always show screen 3 when text is placed
        showTextEditingScreen();
        saveDesignToLocalStorage();
        console.log(`Applying decal at position: x=${usePosition.x.toFixed(2)}, y=${usePosition.y.toFixed(2)} to mesh: ${selectedMesh.name}`);
    }

    function updateDecalsListUI() {
        const listContainer = document.getElementById("appliedDecalsListImg");
        listContainer.innerHTML = '';

        // Create the wrapper
        const wrapper = document.createElement("div");
        wrapper.className = "activeImgLogos grid2";

        // Helper: build logosItems block
        function createLogosItem(positionName, uuid, type, isText, textContent, imageSrc) {
            const item = document.createElement("div");
            item.className = "logosItems";

            item.innerHTML = `
            <div class="upper flexRow justify-content-between">
                <p class="logoPosition my-auto">${positionName}</p>
                <figure class="bottomLeftButton my-auto">
                    <img src="images/icons/deletIcon.png" 
                         alt="deleteDecalIcon" 
                         class="textMeshesItemsIcon TextRemoveValue delete-decal-btn" 
                         data-type="${type}" data-uuid="${uuid}" 
                         style="width: 15px;">
                </figure>
            </div>
            <figure class="m-auto mainLogo">
                ${isText
                    ? `<p Class="activeDecal">${textContent}</p>`
                    : `<img src="${imageSrc || 'images/icons/defLogo.png'}" alt="decalPreview">`
                }
            </figure>
        `;
            return item;
        }

        // Loop through text decals
        window.textDecals?.forEach((decal) => {
            if (!decal || !decal.uuid) return;
            let meshLabel = getMashName(`${decal.meshName}`);
            const item = createLogosItem(meshLabel, decal.uuid, "text", true, decal.text, null);
            wrapper.appendChild(item);
        });

        // Loop through image decals
        window.imageDecals?.forEach((decal) => {
            if (!decal || !decal.uuid) return;
            let meshLabel = getMashName(decal.mesh?.name || "Unknown Mesh");
            const item = createLogosItem(meshLabel, decal.uuid, "image", false, null, decal.imageSrc);
            wrapper.appendChild(item);
        });

        // Append the wrapper into container
        listContainer.appendChild(wrapper);

        // Add delete event listeners
        listContainer.querySelectorAll(".delete-decal-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const type = btn.getAttribute("data-type");
                const uuid = btn.getAttribute("data-uuid");
                deleteDecalByUUID(type, uuid);
            });
        });
    }


    function deleteDecalByUUID(type, uuid) {
        let meshToUpdate = null;

        if (type === "text") {
            const index = window.textDecals.findIndex(d => d.uuid === uuid);
            if (index !== -1) {
                // Store mesh reference before deletion
                meshToUpdate = window.textDecals[index].mesh;
                window.textDecals.splice(index, 1);

                // Update active index if needed
                if (activeTextDecalIndex === index) {
                    activeTextDecalIndex = -1;
                    document.querySelector(".decalText").textContent = "";
                } else if (activeTextDecalIndex > index) {
                    activeTextDecalIndex--;
                }
            }
        }
        else if (type === "image") {
            const index = window.imageDecals.findIndex(d => d.uuid === uuid);
            if (index !== -1) {
                // Store mesh reference before deletion
                meshToUpdate = window.imageDecals[index].mesh;
                window.imageDecals.splice(index, 1);

                // Update active index if needed
                if (activeImageDecalIndex === index) {
                    activeImageDecalIndex = -1;
                } else if (activeImageDecalIndex > index) {
                    activeImageDecalIndex--;
                }
            }
        }

        // Update the specific mesh that had the decal
        if (meshToUpdate) {
            updateMeshTextureForMesh(meshToUpdate);
        }

        // Refresh UI
        updateDecalsListUI();
        saveDesignToLocalStorage();
    }

    function getMashName(meshName) {

        switch (meshName) {
            case "Plane032":
                return "Back";
                break;
            case "Plane003":
                return "Front";
                break;
            case "Plane032_7":
                return "Left";
                break;
            case "Plane032_5":
                return "Right";
                break;
            case "Plane064_1":
                return "Shoulder Left";
                break;
            case "Plane064":
                return "Shoulder Right";
                break;
        }
    }
    // New function to composite all texts onto the mesh texture
    function updateMeshTextureWithAllTexts() {
        if (!selectedMesh) return;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 1024;
        canvas.height = 1024;

        // Clear canvas with white background
        context.fillStyle = "#FFFFFF";
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

                context.strokeStyle = "transparent";
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

    let currentTextMode = "text"; // default mode (can be 'text', 'name', 'number')

    document.getElementById("textTab").addEventListener("click", () => {
        currentTextMode = "text1";
    });

    document.getElementById("nameTab").addEventListener("click", () => {
        currentTextMode = "name";
    });

    document.getElementById("numberTab").addEventListener("click", () => {
        currentTextMode = "number";
    });


    // Function to select mesh via buttons
    function selectMeshFromButton(meshName, decalType = 'text') {
        selectedMesh = findMeshByName(model, meshName);
        let colornewcust = selectedTextColor;

        if (!selectedMesh) {
            console.error(`Mesh ${meshName} not found in model`);
            return;
        }
        // Get the model configuration for the current model
        const modelConfig = modelMeshConfigs[currentModelType]?.[currentModelFilename];

        if (decalType === 'text' && isReadyToApplyText && pendingText) {
            let customPosition = { x: 0.5, y: 0.5 }; // Default for text
            let meshName = null;

            let fontSize = currentFontSize;
            let fontFamily = document.getElementById("fontFamilySelect3").value;
            console.log(`Applying text to mesh: ${selectedMesh.name} with font size: ${currentTextMode}`);
            if (currentTextMode === "name" && selectedMesh.name == "Plane032") {
                meshName = "Plane032";
                customPosition = { x: 0.25, y: 0.15 };
                fontSize = 50;
                colornewcust = '#fffff';
                fontFamily = "Impact";
                currentFontSize = fontSize;
                document.getElementById("fontFamilySelect3").value = fontFamily;
                setViewfront('backAngle');
            } else if (currentTextMode === "number" && selectedMesh.name == "Plane032") {
                meshName = "Plane032";
                customPosition = { x: 0.25, y: 0.25 };
                fontSize = 150;
                colornewcust = '#fffff';
                fontFamily = "Impact";
                currentFontSize = fontSize;
                document.getElementById("fontFamilySelect3").value = fontFamily;
                setViewfront('backAngle');
            } else if (currentTextMode === "number" && selectedMesh.name == "Plane032_5") {
                meshName = "Plane032_5";
                customPosition = { x: 0.63, y: 0.63 };
                fontSize = 80;
                colornewcust = '#fffff';
                fontFamily = "Impact";
                currentFontSize = fontSize;
                document.getElementById("fontFamilySelect3").value = fontFamily;
                setViewfront('rightAngle');
            }
            else if (currentTextMode === "number" && selectedMesh.name == "Plane032_7") {
                meshName = "Plane032_7";
                customPosition = { x: 0.65, y: 0.23 };
                fontSize = 80;
                colornewcust = '#fffff';
                fontFamily = "Impact";
                currentFontSize = fontSize;
                document.getElementById("fontFamilySelect3").value = fontFamily;
                setViewfront('leftAngle');
            } else if (currentTextMode === "text1" && selectedMesh.name == "Mesh") {
                meshName = "Mesh";
                customPosition = { x: 0.64, y: 0.16 };
                fontSize = 40;
                colornewcust = '#fffff';
                fontFamily = "Arial";
                currentFontSize = fontSize;
                document.getElementById("fontFamilySelect3").value = fontFamily;
                setViewfront('frontAngle');
            } else {
                if (modelConfig?.placementMeshes?.[meshName]?.textPosition) {
                    customPosition = modelConfig.placementMeshes[meshName].textPosition;
                }
            }


            applyTextToSelectedMesh(pendingText, customPosition, fontSize, fontFamily, colornewcust);
            //resetTextPlacementMode();
        }
        else if (decalType === 'image' && isReadyToPlaceImage && pendingImageFile) {
            let customPosition = { x: 0.5, y: 0.5 };
            let scop = 1.0;
            let rotationDeg = 0; // ✅ degrees now

            if (modelConfig?.placementMeshes?.[meshName]?.imagePosition) {
                customPosition = modelConfig.placementMeshes[meshName].imagePosition;
            }

            // ✅ per-mesh overrides in DEGREES
            if (selectedMesh.name == "Plane003") {
                scop = 1.2;
                rotationDeg = 0;          // was Math.PI / 4
                setViewfront('frontAngle');
            } else if (selectedMesh.name == "Plane064") {
                scop = 0.6;
                rotationDeg = 141;          // was Math.PI / 2
                setViewfront('rightAngle');
            } else if (selectedMesh.name == "Plane064_1") {
                scop = 0.6;
                rotationDeg = 227;         // was -Math.PI / 2
                setViewfront('leftAngle');
            }

            applyImageToSelectedMesh(pendingImageFile, customPosition, scop, rotationDeg);
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
    // Improved selectMeshUnderMouse function
    function selectMeshUnderMouse(event) {
        if (!model) return;

        const mouse = getNormalizedMousePosition(event);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // Get all intersects with strict front-facing check
        const intersects = raycaster.intersectObjects(model.children, true)
            .filter(intersect => {
                // Skip if no face information
                if (!intersect.face) return false;

                // Strict front-facing check
                return isFrontFacing(intersect, camera);
            });

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const uv = intersects[0].uv;

            // Only proceed if this is truly the front side
            selectedMesh = clickedMesh;
            lastClickUV = uv;
            console.log("Mesh selected from front side:", clickedMesh.name);
        }
        saveDesignToLocalStorage();
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

        // Filter for front-facing intersects only
        const intersects = raycaster.intersectObjects(model.children, true)
            .filter(intersect => isFrontFacing(intersect, camera));
        let decalClicked = false;

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const uv = intersects[0].uv;

            // First check image decals (search all meshes)
            for (let i = imageDecals.length - 1; i >= 0; i--) {
                const decal = imageDecals[i];
                // 🔒 Only allow selection on the same mesh the decal is applied to
                if (decal.mesh !== clickedMesh) continue;
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
                    // 🔒 Only allow selection on the same mesh
                    if (decal.mesh !== clickedMesh) continue;

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
        if (!model) return; // 🔒 Prevent crash until model is loaded

        const mouse = getNormalizedMousePosition(event);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(model.children, true);
        if (intersects.length === 0) return;

        const intersect = intersects[0];
        const uv = intersect.uv;
        const intersectedMesh = intersect.object;

        // === TEXT DECAL MOVEMENT ===
        if (isTextMoving && isTextSelected && activeTextDecalIndex >= 0) {
            const activeDecal = textDecals[activeTextDecalIndex];

            if (activeDecal.isLocked) {
                console.log("Text decal is locked - cannot move");
                return;
            }

            if (activeDecal.mesh !== intersectedMesh) return;

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

            updateMeshTextureForMesh(activeDecal.mesh);
            updateActiveDecalBounds();
        }

        // === IMAGE DECAL MOVEMENT ===
        else if (isImageMoving && isImageSelected && activeImageDecalIndex >= 0) {
            const activeDecal = imageDecals[activeImageDecalIndex];

            if (activeDecal.isLocked) {
                console.log("Image decal is locked - cannot move");
                return;
            }

            if (!this.hasSavedMovementState) {
                saveState();
                this.hasSavedMovementState = true;
            }

            if (activeDecal.mesh !== intersectedMesh) return;

            const newX = uv.x - imageClickOffset.x;
            const newY = uv.y - imageClickOffset.y;

            activeDecal.offset.x = newX - 0.5;
            activeDecal.offset.y = newY - 0.5;

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
        let meshToUpdate = null;

        // First check if we're deleting a text decal
        if (activeTextDecalIndex >= 0) {
            console.log(`Deleting text decal ${activeTextDecalIndex}`);
            meshToUpdate = textDecals[activeTextDecalIndex].mesh;
            textDecals.splice(activeTextDecalIndex, 1);
            activeTextDecalIndex = -1;
            isTextSelected = false;

            document.getElementById('screen3').style.display = 'none';
            document.getElementById('screen1').style.display = 'block';
            document.getElementById('updateTextButton').style.display = 'none';
            updateMeshTextureWithAllDecals();
        }
        // Then check if we're deleting an image decal
        else if (activeImageDecalIndex >= 0) {
            saveState();
            console.log(`Deleting image decal ${activeImageDecalIndex}`);
            meshToUpdate = imageDecals[activeImageDecalIndex].mesh;
            imageDecals.splice(activeImageDecalIndex, 1);
            activeImageDecalIndex = -1;
            isImageSelected = false;

            uploadedImagePreview.style.display = "none";
            imagePreviewBorder.style.display = "none";
            document.querySelector('.logoFourthScreen').style.display = 'none';
            document.querySelector('.logoSecondScreen').style.display = 'none';
            document.querySelector('.logoFirstScreen').style.display = 'block';

            updateMeshTextureWithAllDecals();
        }
        // Finally check if we're deleting a pattern
        else {
            const patternToDelete = patternDecals.find((d) => d.mesh === selectedMesh);
            if (patternToDelete) {
                console.log("Deleting pattern decal");
                patternDecals = patternDecals.filter((d) => d.uuid !== patternToDelete.uuid);
                updateMeshTextureForMesh(selectedMesh);
            }
        }

        // ✅ REFRESH sidebar list after deletion
        updateDecalsListUI();
        saveDesignToLocalStorage(); // Optional: persist updated state
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

function saveDesignToLocalStorage() {
    const data = {
        textDecals: window.textDecals.map(d => ({
            ...d,
            mesh: undefined,
        })),
        imageDecals: window.imageDecals.map(d => ({
            ...d,
            mesh: undefined,
            image: undefined,
            imageSrc: d.imageSrc || null,
        })),
        selectedTextColor: window.selectedTextColor,
        activeTextDecalIndex: window.activeTextDecalIndex,
        backgroundColor: `#${scene.background.getHexString()}`,
    };

    localStorage.setItem("savedDesign", JSON.stringify(data));
}
