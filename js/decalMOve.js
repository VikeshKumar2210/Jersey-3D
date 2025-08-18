document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("threejs-container");

    const preloader = document.getElementById("preloader");

    const progressBar = document.querySelector(".progress-bar");

    const progressText = document.querySelector(".progress-text");
    const content = document.getElementById("threejs-container");
    if (!container) {
        console.error("Container element not found!");
        return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    let originalDecalSize; // Store the original size of the decal
    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    const designSettings = {
        Design1: {
            position: new THREE.Vector3(0, -3.8, 0),
            cameraPosition: new THREE.Vector3(0, 2, 7),
            fov: 18
        },
        Design2: {
            position: new THREE.Vector3(0, -3.7, 0),
            cameraPosition: new THREE.Vector3(0, 1, 6),
            fov: 21
        },
        Design3: {
            position: new THREE.Vector3(0, -2.7, 0),
            cameraPosition: new THREE.Vector3(0, 1, 5),
            fov: 19
        }
    };
    const designModelMappings = {

        Design1: "assets/models/Modal2FullSleeves.glb",

        Design2: "assets/models/abcdef.glb",

        Design3: "assets/models/Modal3.glb",

    };

    function createImageDecal() {

        // Assuming you have a way to get the size of the decal when creating it

        const decalSize = new THREE.Vector3(0.2, 0.2, 2); // Example size

        const imageDecalMesh = new THREE.Mesh(

            imageDecalGeometry,

            imageDecalMaterial

        );


        // Store the size in userData

        imageDecalMesh.userData.size = decalSize;


        // Add to the scene and your array

        scene.add(imageDecalMesh);

        imageDecalMeshes.push(imageDecalMesh);

    }
    camera.position.set(0, 1, 5);
    let decals = {
        text: {
            text: "",

            fontSize: 20,

            color: "#FFFFFF",

            fontFamily: "Arial",
        },

        number: {
            text: "",

            fontSize: 20,

            color: "#FFFFFF",

            fontFamily: "Arial",
        },

        name: {
            text: "",

            fontSize: 20,

            color: "#FFFFFF",

            fontFamily: "Arial",
        },
    };
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.target.set(0, 0, 0);
    // Restrict rotation

    controls.maxPolarAngle = Math.PI / 2; // Limit to 90 degrees (top)

    controls.minPolarAngle = 0.4; // Limit to 0 degrees (bottom)


    // Limit zoom

    controls.maxDistance = 10; // Set maximum zoom out distance

    controls.minDistance = 5; // Set minimum zoom in distance

    const ambientLight = new THREE.AmbientLight(0xeeeeee); // Ambient light color
    ambientLight.intensity = 0.5; // Increase intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Increase intensity
    directionalLight.position.set(5, 1, 15).normalize(); // Position of the light
    scene.add(directionalLight);

    let imageDecalMeshes = [];
    let textDecalMeshes = [];
    let patternDecalMeshes = [];
    let model = null;
    let meshes = { primary: [], secondary: [], tertiary: [] };
    let selectedColorCategory = "Plane";
    let checkedCheckboxes = [];
    let selectedMeshName = null;
    let currentButton = null;
    let patternDecalOpacity = 1;
    let patternDecalAngle = 0;
    let patternDecalScale = 1;
    let currentFontSize = 20; // Default font size in pixels
    let selectedTextColor = "#FFFFFF"; // Default color
    let tempText = "";
    let tempPosition = new THREE.Vector3(0, 0, 0);
    let tempSize = new THREE.Vector3(8, 8, 2);
    let tempRotation = new THREE.Euler(0, 0, 0);
    // Gradient controls
    const angleSlider = document.getElementById("gradientAngle");
    const scaleSlider = document.getElementById("gradientScale");
    const angleValue = document.getElementById("angleValue");
    const scaleValue = document.getElementById("scaleValue");
    let currentDecalPosition = new THREE.Vector3(); // Variable to hold the current position of the decal

    const rotateLeftButton = document.getElementById("rotateLeft");
    const rotateRightButton = document.getElementById("rotateRight");
    const zoomInButton = document.getElementById("zoomIn");
    const zoomOutButton = document.getElementById("zoomOut");
    const COLORS = {
        primary: 0xf50a3,
        secondary: 0xf50a3,
        tertiary: 0xf50a3,
    };

    let rotationProgress = 0; // Track rotation progress
    const rotationSpeed = 0.07; // Speed of rotation
    // Gradient functionality variables
    let gradientAngle = 45;
    let gradientScale = 1;
    let selectedColors = {
        color1: "#FF0000",
        color2: "#FFFF00",
    };

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

    // function processMeshes(model, colorMappings) {
    //     model.traverse((child) => {
    //         if (child.isMesh) {
    //             //console.log("Found mesh:", child.name); // Log each found mesh
    //             const category = colorMappings[child.name];
    //             if (category) {
    //                 child.userData.colorCategory = category;
    //                 const color = COLORS[category] || new THREE.Color("gray");
    //                 child.material = new THREE.MeshStandardMaterial({
    //                     color: color,
    //                     side: THREE.DoubleSide,
    //                 });

    //                 // Add mesh to the corresponding category
    //                 if (!meshes[category]) {
    //                     meshes[category] = [];
    //                 }
    //                 meshes[category].push(child);
    //                 //console.log("Processed mesh:", child.name);
    //             } else {
    //                 console.warn(`No mapping found for mesh: ${child.name}`);
    //             }
    //         }
    //     });
    // }
    fileInput?.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) {
            console.error("No file selected");
            return; // Exit if no file is selected
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            convertPNGToSVG(e.target.result, function (svgData) {
                addImageDecal(svgData);
            });
        };
        reader.readAsDataURL(file);
    });
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
    // NAME DECAL
    // Create separate variables for each decal

    let textDecalText = "";
    let textDecalFontSize = 20;
    let textDecalColor = "#FFFFFF";
    let textDecalFontFamily = "Arial";
    let nameDecalText = "";
    let nameDecalFontSize = 20;
    let nameDecalColor = "#FFFFFF";

    let numberDecalColor = "#FFFFFF";
    let nameDecalFontFamily = "Arial";
    let numberDecalText = "";
    let numberDecalFontSize = 20;

    let numberDecalFontFamily = "Arial";
    document
        .getElementById("addTextButton1")
        .addEventListener("click", function () {
            decals.name.text = document.getElementById("decalText1").value;

            if (!decals.name.text.trim()) {
                console.error("No name entered for name decal!");

                return;
            }

            createNameDecal();

            tempText = nameDecalText; // Set tempText here

            tempPosition = new THREE.Vector3(0, 0.8, 0);

            tempSize = new THREE.Vector3(1.6, 1.6, 5);

            tempRotation = new THREE.Euler(0, 0, 0);

            console.log(
                "Configuration set from Button 1:",
                tempText,
                tempPosition,
                tempSize,
                tempRotation
            );

            // Update the nameDecalColor variable here

            nameDecalColor = document.getElementById("nameDecalColor").value;
        });

    // Function to create a name decal
    function createNameDecal() {
        if (!model) {
            console.error("Model is not loaded.");
            return;
        }

        const nameDecalText = decals.name.text;
        const nameDecalFontSize = decals.name.fontSize;

        createSVGTextTexture(nameDecalText, nameDecalColor, nameDecalFontFamily, nameDecalFontSize)
            .then((nameTexture) => {
                let targetMeshName = model.name.includes("Design2") ? "Plane_2" : "Plane"; // Use Plane_4 for Design2
                const targetMesh = model.getObjectByName(targetMeshName);
                if (!targetMesh) {
                    console.error(`Mesh with name "${targetMeshName}" not found.`);
                    return;
                }

                const adjustedPosition = new THREE.Vector3(0, 0.4, 0);
                const nameDecalGeometry = new THREE.DecalGeometry(targetMesh, adjustedPosition, new THREE.Euler(0, 0, 0), new THREE.Vector3(1.6, 1.6, 5));

                const nameDecalMaterial = new THREE.MeshBasicMaterial({
                    map: nameTexture,
                    depthTest: false,
                    depthWrite: false,
                    side: THREE.frontSide,
                    transparent: true,
                });

                const nameDecalMesh = new THREE.Mesh(nameDecalGeometry, nameDecalMaterial);
                scene.add(nameDecalMesh);
                nameDecalMesh.renderOrder = 2;

                nameDecalMesh.userData = {
                    type: "name",
                    text: nameDecalText,
                    fontSize: nameDecalFontSize,
                    fontFamily: nameDecalFontFamily,
                    color: nameDecalColor,
                    decalId: "decal2",
                    size: new THREE.Vector3(1.6, 1.6, 5)
                };

                textDecalMeshes.push(nameDecalMesh);
            });
    }
    // Function to create a text decal
    // Function to create a text decal
    function createTextDecal() {
        if (!model) {
            console.error("Model is not loaded.");
            return;
        }

        const textDecalText = decals.text.text;
        const textDecalFontSize = decals.text.fontSize;

        createSVGTextTexture(textDecalText, textDecalColor, textDecalFontFamily, textDecalFontSize)
            .then((textTexture) => {
                let targetMeshName;

                // Determine the target mesh based on the active design model
                if (model.name.includes("Design2")) {
                    targetMeshName = "Plane_2"; // Use Plane_2 for Design2
                } else {
                    targetMeshName = "Plane"; // Default to Plane for other designs
                }

                const targetMesh = model.getObjectByName(targetMeshName); // Get the target mesh
                if (!targetMesh) {
                    console.error(`Mesh with name "${targetMeshName}" not found.`);
                    return;
                }

                const adjustedPosition = new THREE.Vector3(0, 0.3, 0);
                const textDecalGeometry = new THREE.DecalGeometry(targetMesh, adjustedPosition, new THREE.Euler(0, 0, 0), new THREE.Vector3(1.5, 1.5, 5));

                const textDecalMaterial = new THREE.MeshBasicMaterial({
                    map: textTexture,
                    depthTest: false,
                    depthWrite: false,
                    side: THREE.frontSide, // Change this to DoubleSide if needed
                    transparent: true,
                });

                const textDecalMesh = new THREE.Mesh(textDecalGeometry, textDecalMaterial);
                scene.add(textDecalMesh);
                textDecalMesh.renderOrder = 2; // Set render order to 1 for decals

                // Set the size in userData
                textDecalMesh.userData = {
                    type: "text",
                    text: textDecalText,
                    fontSize: textDecalFontSize,
                    fontFamily: textDecalFontFamily,
                    color: textDecalColor,
                    decalId: "decal1",
                    size: new THREE.Vector3(1.5, 1.5, 5) // Ensure size is defined
                };

                textDecalMeshes.push(textDecalMesh);
            });
    }
    // Function to create a number decal
    // Function to create a number decal
    function createNumberDecal() {
        if (!model) {
            console.error("Model is not loaded.");
            return;
        }

        const numberDecalText = decals.number.text;
        const numberDecalFontSize = decals.number.fontSize;

        createSVGTextTexture(numberDecalText, numberDecalColor, numberDecalFontFamily, numberDecalFontSize)
            .then((numberTexture) => {
                let targetMeshName = model.name.includes("Design2") ? "Plane_3" : "Plane_1"; // Use Plane_5 for Design2
                const targetMesh = model.getObjectByName(targetMeshName);
                if (!targetMesh) {
                    console.error(`Mesh with name "${targetMeshName}" not found.`);
                    return;
                }

                const adjustedPosition = new THREE.Vector3(0, 0.4, 0);
                const numberDecalGeometry = new THREE.DecalGeometry(targetMesh, adjustedPosition, new THREE.Euler(0, Math.PI, 0), new THREE.Vector3(1.5, 1.5, 5));

                const numberDecalMaterial = new THREE.MeshBasicMaterial({
                    map: numberTexture,
                    depthTest: false,
                    depthWrite: false,
                    side: THREE.frontSide,
                    transparent: true,
                });

                const numberDecalMesh = new THREE.Mesh(numberDecalGeometry, numberDecalMaterial);
                scene.add(numberDecalMesh);
                numberDecalMesh.renderOrder = 2;

                numberDecalMesh.userData = {
                    type: "number",
                    text: numberDecalText,
                    fontSize: numberDecalFontSize,
                    fontFamily: numberDecalFontFamily,
                    color: numberDecalColor,
                    decalId: "decal3",
                    size: new THREE.Vector3(1.5, 1.5, 5)
                };

                textDecalMeshes.push(numberDecalMesh);
            });
    }
    // TEXT DECAL


    // 
    let selectedMesh = null; // Declare  mesh Selected variable

    // Function to create a texture from the input text
    function createTextTexture(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 512;
        canvas.height = 512;

        // Create text on the canvas
        context.font = '38px Arial';
        context.fillStyle = 'white'; // Text color
        context.fillText(text, 180, 150);

        // Create a texture from the canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.flipY = false; // Ensure the texture is not flipped vertically
        return texture;
    }
    // Handle apply text button click
    document.getElementById('applyTextButton').addEventListener('click', () => {
        const inputText = document.getElementById('textInput').value;
        const texture = createTextTexture(inputText);

        // Apply the texture to the  mesh Selected
        selectedMesh = getSelectedMesh(); // Function to get the currently  mesh Selected
        if (selectedMesh) {
            selectedMesh.material.map = texture;
            selectedMesh.material.needsUpdate = true; // Update the material to use the new texture
            console.log(`Applied text "${inputText}" to mesh: ${selectedMesh.name}`);
        } else {
            console.log('No mesh selected to apply text.');
        }
    });
    // Function to get the currently  mesh Selected based on button clicks
    function getSelectedMesh() {
        return selectedMesh;
    }
    // Add event listeners for mesh selection buttons
    document.getElementById('frontButton').addEventListener('click', () => {
        selectedMesh = model.getObjectByName('Plane'); // Replace with actual mesh name
        console.log(' mesh Selected:', selectedMesh ? selectedMesh.name : 'None');
    });

    document.getElementById('leftSleeveButton').addEventListener('click', () => {
        selectedMesh = model.getObjectByName('Plane_4'); // Replace with actual mesh name
        console.log(' mesh Selected:', selectedMesh ? selectedMesh.name : 'None');
    });

    // Variables to store the original position of the text
    let originalTextPosition = new THREE.Vector3();
    // 

    document
        .getElementById("addTextButton2")
        .addEventListener("click", function () {
            decals.text.text = document.getElementById("decalText2").value;

            if (!decals.text.text.trim()) {
                console.error("No text entered for text decal!");

                return;
            }

            // Call function to create text decal

            createTextDecal();

            tempText = textDecalText; // Set tempText here

            tempPosition = new THREE.Vector3(0, 0.3, 0);

            tempSize = new THREE.Vector3(1.5, 1.5, 5);

            tempRotation = new THREE.Euler(0, 0, 0);

            console.log(
                "Configuration set from Button 2:",
                tempText,
                tempPosition,
                tempSize,
                tempRotation
            );
        });
    // NUMBER DECAL
    document
        .getElementById("addTextButton3")
        .addEventListener("click", function () {
            decals.number.text = document.getElementById("decalText3").value;

            if (!decals.number.text.trim()) {
                console.error("No number entered for number decal!");

                return;
            }

            // Call function to create number decal

            createNumberDecal();

            tempText = numberDecalText; // Set tempText here
            tempPosition = new THREE.Vector3(0, 0.4, 0);
            tempSize = new THREE.Vector3(1.5, 1.5, 5);
            tempRotation = new THREE.Euler(0, 0, 0);
            console.log(
                "Configuration set from Button 3:",
                tempText,
                tempPosition,
                tempSize,
                tempRotation
            );
        });
    async function addImageDecal(imageUrl, meshName) {
        if (!model) {
            console.error("Model is not loaded yet.");
            return;
        }

        const textureLoader = new THREE.TextureLoader();
        const texture = await new Promise((resolve, reject) => {
            textureLoader.load(
                imageUrl,
                (loadedTexture) => {
                    resolve(loadedTexture);
                },
                undefined,
                reject
            );
        });

        let targetMeshName = model.name.includes("Design2") ? "Plane_2" : meshName; // Use Plane_6 for Design2
        const targetMesh = model.getObjectByName(targetMeshName);
        if (!targetMesh) {
            console.error(`Mesh with name "${targetMeshName}" not found.`);
            return;
        }

        let lastDecalPosition = decalPosition.clone();
        let lastDecalSize = new THREE.Vector3(0.5, 0.5, 2);

        imageDecalMeshes = imageDecalMeshes.filter(decal => {
            if (decal.userData.meshName === targetMeshName) {
                lastDecalPosition.copy(decal.position);
                lastDecalSize.copy(decal.userData.size);
                scene.remove(decal);
                return false;
            }
            return true;
        });

        const imageDecalGeometry = new THREE.DecalGeometry(
            targetMesh,
            lastDecalPosition,
            new THREE.Euler(0, 0, 0),
            lastDecalSize
        );

        const imageDecalMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            depthTest: false,
            depthWrite: false,
            side: THREE.frontSide,
            transparent: true,
        });

        const imageDecalMesh = new THREE.Mesh(imageDecalGeometry, imageDecalMaterial);
        imageDecalMesh.userData = {
            meshName: targetMeshName,
            size: lastDecalSize
        };

        scene.add(imageDecalMesh);
        imageDecalMeshes.push(imageDecalMesh);
    }
    // Function to resize the selected decal


    document
        .querySelectorAll('.decalsItems input[type="radio"]')
        .forEach((radio) => {
            radio.addEventListener("change", function () {
                const meshName = this.getAttribute("data-mesh-name"); // Ensure this is set correctly in HTML

                if (!meshName) {
                    console.error("Mesh name is undefined!"); // Add this line to check if meshName is undefined

                    return; // Exit if no mesh name is found
                }

                handleImageMeshClick(meshName); // Call your function with the valid mesh name
            });
        });
    function handleImageMeshClick(meshName) {
        console.log(`Selected mesh name: ${meshName}`);
        if (!model) {
            console.error("Model is not loaded yet.");
            return;
        }

        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        console.log(file); // Check if a file is selected

        // Find the currently selected radio button
        const selectedRadio = document.querySelector(
            `.decalsItems input[type="radio"][data-mesh-name="${meshName}"]`
        );

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log(`File read successfully, URL: ${e.target.result}`);
                // Call the function to add the decal
                addImageDecal(e.target.result, meshName);

                // Uncheck the selected radio button after upload
                if (selectedRadio) {
                    selectedRadio.checked = false; // Uncheck the currently selected radio button
                }
            };
            reader.readAsDataURL(file);
        } else {
            console.error("No file selected");
        }
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
    function meshNameToCategory(name) {
        // Map specific mesh names to their categories
        const nameToCategory = {
            Plane: "primary",
            Plane_1: "secondary",
            Plane_2: "secondary",
            Plane_3: "tertiary",
            Plane_4: "primary",
        };

        // Default category
        return nameToCategory[name] || "primary";
    }
    document
        .querySelectorAll(".text-color-palette .color-button")
        .forEach((button) => {
            button.addEventListener("click", function () {
                const decalId = this.closest(
                    ".textMeshesItems, .NumberMeshesItems, .NameMeshesItems"
                ).dataset.decalId;

                const color = this.dataset.color;

                updateTextDecalsColor(decalId, color);
            });
        });

    function adjustFontSize(amount, decalType) {
        decals[decalType].fontSize += amount;

        if (decals[decalType].fontSize < 10) decals[decalType].fontSize = 10; // Minimum size

        if (decals[decalType].fontSize > 500) decals[decalType].fontSize = 500; // Maximum size

        updateTextDecalsFontSize(decalType);
    }
    // Function to handle font family changes
    function handleFontFamilyChange(event, decalType) {
        const selectedFontFamily = event.target.value;

        console.log("Selected font family:", selectedFontFamily);

        // Update existing text decals with the new font family

        updateTextDecalsFont(selectedFontFamily, decalType);
    }
    // Function to get the current decal mesh
    function getDecalMesh(decalType) {
        let decalId;

        switch (decalType) {
            case "text":
                decalId = "decal1";
                break;
            case "number":
                decalId = "decal3";
                break;
            case "name":
                decalId = "decal2";
                break;
            default:
                throw new Error(`Invalid decal type: ${decalType}`);
        }

        return textDecalMeshes.find((decal) => decal.userData.decalId === decalId);
    }
    async function updateTextDecalsFontSize(decalType) {

        const decalMesh = getDecalMesh(decalType); // Function to get the current decal mesh


        if (decalMesh) {

            const newTexture = await createSVGTextTexture(

                decals[decalType].text,

                decals[decalType].color,

                decals[decalType].fontFamily,

                decals[decalType].fontSize

            );


            // Preserve the flip state

            if (decalMesh.userData.isFlipped) {

                newTexture.wrapS = THREE.RepeatWrapping;

                newTexture.wrapT = THREE.RepeatWrapping;

                newTexture.repeat.set(-1, 1); // Flip the texture horizontally

            }


            decalMesh.material.map = newTexture;

            decalMesh.material.needsUpdate = true;

        }

    }
    async function updateTextDecalsColor(decalId, color) {

        let decalType;

        switch (decalId) {

            case "decal1":

                decalType = "text";

                break;

            case "decal2":

                decalType = "name";

                break;

            case "decal3":

                decalType = "number";

                break;

            default:

                console.error(`Invalid decal ID: ${decalId}`);

                return;

        }


        const decalMesh = getDecalMesh(decalType);


        if (decalMesh) {

            decalMesh.material.color.set(color);

            decalMesh.material.needsUpdate = true;


            // Update the color variable for the specific decal

            if (decalId === "decal1") {

                textDecalColor = color;

            } else if (decalId === "decal2") {

                nameDecalColor = color;

            } else if (decalId === "decal3") {

                numberDecalColor = color;

            }


            // Preserve the flip state

            if (decalMesh.userData.isFlipped) {

                decalMesh.material.map.wrapS = THREE.RepeatWrapping;

                decalMesh.material.map.wrapT = THREE.RepeatWrapping;

                decalMesh.material.map.repeat.set(-1, 1); // Flip the texture horizontally

            }

        } else {

            console.error(`No decal found with ID ${decalId}.`);

        }

    }

    async function updateTextDecalsFont(decalId, fontFamily) {

        let decalType;

        switch (decalId) {

            case "decal1":

                decalType = "text";

                break;

            case "decal2":

                decalType = "name";

                break;

            case "decal3":

                decalType = "number";

                break;

            default:

                console.error(`Invalid decal ID: ${decalId}`);

                return;

        }


        const decalMesh = getDecalMesh(decalType);


        if (decalMesh) {

            // Update the font family of the decal mesh

            decals[decalType].fontFamily = fontFamily;


            // Create a new texture with the updated font family

            const newTexture = await createSVGTextTexture(

                decals[decalType].text,

                decals[decalType].color,

                decals[decalType].fontFamily,

                decals[decalType].fontSize

            );


            // Preserve the flip state

            if (decalMesh.userData.isFlipped) {

                newTexture.wrapS = THREE.RepeatWrapping;

                newTexture.wrapT = THREE.RepeatWrapping;

                newTexture.repeat.set(-1, 1); // Flip the texture horizontally

            }


            decalMesh.material.map = newTexture;

            decalMesh.material.needsUpdate = true;

        } else {

            console.error(`No decal found with ID ${decalId}.`);

        }

    }

    async function createSVGTextTexture(text, color, fontFamily, fontSize) {
        return new Promise((resolve, reject) => {
            const svgNamespace = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNamespace, "svg");
            const textElement = document.createElementNS(svgNamespace, "text");
            svg.setAttribute("width", 512);
            svg.setAttribute("height", 512);

            textElement.setAttribute("x", "50%");
            textElement.setAttribute("y", "50%");
            textElement.setAttribute("dominant-baseline", "middle");
            textElement.setAttribute("text-anchor", "middle");
            textElement.setAttribute("font-size", fontSize);
            textElement.setAttribute("font-weight", "900");
            textElement.setAttribute("fill", color);
            textElement.setAttribute("font-family", fontFamily);

            textElement.textContent = text;
            svg.appendChild(textElement);

            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 512;

            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                const texture = new THREE.CanvasTexture(canvas);
                resolve(texture);
            };
            img.onerror = reject;
            img.src = "data:image/svg+xml;base64," + btoa(svgData);
        });
    }
    // Add event listeners for all font family select elements with the class 'fontFamilySelect'
    document.querySelectorAll(".fontFamilySelect").forEach((selectElement) => {
        selectElement.addEventListener("change", function () {
            const selectedFontFamily = this.value;
            const decalId = this.dataset.decalId; // Get the decal ID from the select element's dataset

            if (!decalId) {
                console.error(
                    "Decal ID is not set for this font family select element."
                );
                return;
            }

            updateTextDecalsFont(decalId, selectedFontFamily); // Update the font for the specific decal
        });
    });
    document.querySelectorAll(".color-palette .palette").forEach((palette) => {
        palette.addEventListener("click", function () {
            const color = new THREE.Color(getComputedStyle(this).backgroundColor);

            const decalId = this.closest(".textMeshesItems").dataset.decalId;

            updateTextDecalsColor(decalId, color);
            if (this.closest(".textMeshesItems").dataset.decalId === "decal1") {
                textDecalColor = color;
            } else if (
                this.closest(".textMeshesItems").dataset.decalId === "decal2"
            ) {
                nameDecalColor = color;
            } else if (
                this.closest(".textMeshesItems").dataset.decalId === "decal3"
            ) {
                numberDecalColor = color;
            }
        });
    });
    // Update the event listeners for the plus and minus buttons to pass the decalId

    // Example usage for size buttons

    document
        .querySelector(".TextDecalSizeMinus")
        .addEventListener("click", function () {
            adjustFontSize(-5, "text");
        });

    document
        .querySelector(".TextDecalSizePlus")
        .addEventListener("click", function () {
            adjustFontSize(5, "text");
        });

    document
        .querySelector(".NumberSizeMinus")
        .addEventListener("click", function () {
            adjustFontSize(-10, "number");
        });

    document
        .querySelector(".NumberSizePlus")
        .addEventListener("click", function () {
            adjustFontSize(10, "number");
        });
    document
        .querySelector(".NameDecalSizeMinus")
        .addEventListener("click", function () {
            adjustFontSize(-5, "name");
        });

    document
        .querySelector(".NameDecalSizeplus")
        .addEventListener("click", function () {
            adjustFontSize(5, "name");
        });

    document
        .querySelector(".NameDecalSizeMinus")
        .addEventListener("click", function () {
            adjustFontSize(-5, "decal2"); // Decrease font size by 2 pixels for decal2
            console.log(`Font size decreased for decal2`);
        });

    document
        .querySelector(".NameDecalSizeplus")
        .addEventListener("click", function () {
            adjustFontSize(5, "decal2"); // Increase font size by 2 pixels for decal2
            console.log(`Font size increased for decal2`);
        });

    // Function to simulate loading progress
    // function simulateLoading() {
    //     let progress = 0;

    //     const interval = setInterval(() => {
    //         progress += 20; // Increase progress by 10%

    //         progressBar.style.width = progress + "%";

    //         progressText.textContent = progress + "%";

    //         if (progress >= 100) {
    //             clearInterval(interval);

    //             // Simulate loading completion

    //             setTimeout(() => {
    //                 // Hide the preloader only when the 3D model is fully loaded

    //                 if (model) {
    //                     preloader.style.display = "none"; // Hide the preloader
    //                 }
    //             }, 500); // Short delay before hiding
    //         }
    //     }, 500); // Update progress every 500ms
    // }
    // simulateLoading();
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

        } else if (modelType === "Design1") {

            document.querySelector('.Design1pattern').style.display = 'grid';
            document.querySelector('.Design1Gradient').style.display = 'grid';
            // Update default colors for Design1
            Object.assign(COLORS, designColors.Design1);

        } else if (modelType === "Design2") {
            document.querySelector('.Design2pattern').style.display = 'grid';
            document.querySelector('.Design2Gradient').style.display = 'grid';
            // Update default colors for Design2
            Object.assign(COLORS, designColors.Design2);

        } else if (modelType === "Design3") {

            document.querySelector('.Design3pattern').style.display = 'grid';
            document.querySelector('.Design3Gradient').style.display = 'grid';
            // Update default colors for Design3
            Object.assign(COLORS, designColors.Design3);
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


        // Function to update the mesh material color
        // function updateMeshColor(group, colorHex) {
        //     if (!meshColorGroups[group]) return;

        //     meshColorGroups[group].forEach(meshName => {
        //         const mesh = model.getObjectByName(meshName);
        //         if (mesh && mesh.material) {
        //             mesh.material.color.set(colorHex);
        //         }
        //     });
        // }
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

        // Event listener for color palette
        // document.querySelectorAll('.color-palette .palette').forEach(palette => {
        //     palette.addEventListener('click', (e) => {
        //         const selectedColor = e.target.dataset.color;

        //         // Find which group is currently active (Primary, Secondary, or Tertiary)
        //         const activeGroup = document.querySelector('input[name="meshActiveColor"]:checked').value;

        //         // Update the mesh colors for the selected group
        //         updateMeshColor(activeGroup, selectedColor);

        //         // Update the title to reflect the selected group and color
        //         console.log(`Selected color: ${selectedColor} for group: ${activeGroup}`);
        //         document.getElementById(`apply${activeGroup}`).style.background = selectedColor;
        //     });
        // });
        document.querySelectorAll('.color-palette .palette').forEach(palette => {
            palette.addEventListener('click', (e) => {
                const selectedColor = e.target.dataset.color; // e.g., "#ff0000"

                // Get the currently selected mesh
                const activeMeshRadio = document.querySelector('input[name="meshActiveColor"]:checked');
                if (!activeMeshRadio) {
                    console.warn("No mesh is currently selected.");
                    return;
                }

                const selectedMesh = activeMeshRadio.value;

                // Update the color of the selected mesh
                updateMeshColor(selectedMesh, selectedColor);

                // Update the UI color preview
                const colorPreview = document.getElementById(`apply${selectedMesh}`);
                if (colorPreview) {
                    colorPreview.style.backgroundColor = selectedColor;
                }
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
            model.position.y -= size.y / 33;

            const maxDim = Math.max(size.x, size.y, size.z);
            const cameraDistance = maxDim * 7; // Adjust multiplier for distance
            camera.position.set(center.x, center.y, center.z + cameraDistance);
            camera.lookAt(center);

            let fv = 1 * Math.atan(maxDim / (1 * cameraDistance)) * (180 / Math.PI);
            camera.fov = fv + cameraDistance - 7;
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

    document.querySelectorAll(".models").forEach((modelLink) => {
        modelLink.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default anchor behavior

            const modelType = this.getAttribute("data-model");
            let modelUrl;
            let colorMappings;

            if (modelType === "fullSleeves") {
                modelUrl = "assets/models/Modal2FullSleeves.glb";
                colorMappings = model2Mappings; // Use design2Mappings for full sleeves
            } else if (modelType === "halfSleeves") {
                modelUrl = "assets/models/Modal1.glb";
                colorMappings = model1Mappings; // Use design1Mappings for half sleeves
            } else if (modelType === "design1") {
                modelUrl = "assets/models/Design1Model.glb"; // Replace with actual model path
                colorMappings = design1Mappings;
            } else if (modelType === "design2") {
                modelUrl = "assets/models/Design2Model.glb"; // Replace with actual model path
                colorMappings = design2Mappings;
            } else if (modelType === "design3") {
                modelUrl = "assets/models/Design3Model.glb"; // Replace with actual model path
                colorMappings = design3Mappings;
            }

            if (modelUrl && colorMappings) {
                loadModel(modelUrl, colorMappings, modelType); // Pass modelType here
            }
        });
    });
    function clearPreviousModel() {
        // Remove all decals from the scene
        imageDecalMeshes.forEach(decal => scene.remove(decal));
        textDecalMeshes.forEach(decal => scene.remove(decal));
        patternDecalMeshes.forEach(decal => scene.remove(decal));

        // Clear the arrays
        imageDecalMeshes = [];
        textDecalMeshes = [];
        patternDecalMeshes = [];

        // Remove the existing model
        if (model) {
            scene.remove(model);
            model = null;
        }
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
    // Define mappings for models
    const model1Mappings = {
        Plane: "primary",
        Plane_1: "secondary",
        Plane_2: "secondary",
        Plane_3: "tertiary",
        Plane_4: "primary",
    };

    const model2Mappings = {
        Plane: "primary",
        Plane_1: "primary",
        Plane_2: "secondary",
        Plane_3: "secondary",
        Plane_4: "secondary",
        Plane_5: "secondary",
        Plane_6: "tertiary",
        Plane_7: "tertiary",
        Plane_8: "secondary",
    };
    // Mesh mappings for Design1
    const design1Mappings = {
        Plane: "primary",
        Plane_1: "primary",
        Plane_2: "secondary",
        Plane_3: "secondary",
        Plane_4: "secondary",
        Plane_5: "secondary",  // Ensure these lines are present
        Plane_6: "tertiary",
        Plane_7: "tertiary",
        Plane_8: "secondary",
    };

    // Mesh mappings for Design2
    const design2Mappings = {
        Plane: "secondary",
        Plane_1: "secondary",
        Plane_2: "primary", // Front
        Plane_3: "primary", // Back
        Plane_4: "tertiary", //right Shoulder
        Plane_5: "tertiary", // LEft Shoulder
        Plane_6: "primary", // rightSleeves
        Plane_7: "primary", // LeftSleeves
        Plane_8: "tertiary",
    };

    // Mesh mappings for Design3
    const design3Mappings = {
        Plane: "primary",
        Plane_1: "secondary",
    };
    // Define the camera positions and angles for each part
    angleSlider.addEventListener("input", function () {
        gradientAngle = parseFloat(this.value);
        angleValue.textContent = gradientAngle + " °";
        updateGradient(
            selectedColors.color1,
            selectedColors.color2,
            gradientAngle,
            gradientScale
        );
    });
    scaleSlider.addEventListener("input", function () {
        gradientScale = parseFloat(this.value);
        scaleValue.textContent = gradientScale.toFixed(1);
        updateGradient(
            selectedColors.color1,
            selectedColors.color2,
            gradientAngle,
            gradientScale
        );
    });
    // Define the image pattern URL
    rotateLeftButton.addEventListener("click", () => {
        if (model) {
            model.rotation.y -= Math.PI / 20; // Rotate 1 degree to the left

            patternDecalMeshes.forEach((decal) => {
                decal.rotation.y -= Math.PI / 20; // Rotate pattern decals along with the model
            });

            textDecalMeshes.forEach((decal) => {
                decal.rotation.y = model.rotation.y;
            });

            imageDecalMeshes.forEach((decal) => {
                decal.rotation.y -= Math.PI / 20; // Rotate image decals along with the model
            });
        }
    });
    rotateRightButton.addEventListener("click", () => {
        if (model) {
            model.rotation.y += Math.PI / 20; // Rotate 1 degree to the right

            patternDecalMeshes.forEach((decal) => {
                decal.rotation.y += Math.PI / 20; // Rotate pattern decals along with the model
            });

            textDecalMeshes.forEach((decal) => {
                decal.rotation.y += Math.PI / 20; // Rotate text decals along with the model
            });

            imageDecalMeshes.forEach((decal) => {
                decal.rotation.y += Math.PI / 20; // Rotate image decals along with the model
            });
        }
    });
    zoomInButton.addEventListener("click", () => {
        const direction = new THREE.Vector3(); // Create a vector to hold the direction
        camera.getWorldDirection(direction); // Get the direction the camera is facing
        camera.position.add(direction.multiplyScalar(-0.2)); // Move camera closer in the direction it's facing
    });

    zoomOutButton.addEventListener("click", () => {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction); // Get the direction the camera is facing
        camera.position.add(direction.multiplyScalar(0.2)); // Move camera away in the direction it's facing
    });

    const cameraPositions = {
        front: { x: 0, y: 0, z: 7, angle: 0 },
        back: { x: -2, y: 0, z: -7, angle: Math.PI / 12 },
        rightSleeve: { x: 0, y: 2, z: 5, angle: Math.PI / 2 },
        rightInnerStrips: { x: 2, y: 2, z: 8, angle: Math.PI / 2 },
        leftSleeve: { x: 0, y: 3, z: 5, angle: -Math.PI / 2 },
        leftShoulder: { x: -3, y: 3, z: 5, angle: -Math.PI / 2 },
        leftInnerStrips: { x: -3, y: 3, z: 5, angle: -Math.PI / 2 },
        collar: { x: 0, y: 5, z: 4, angle: 0 },
        rightShoulder: { x: 3, y: 4, z: 5, angle: Math.PI / 2 },
    };
    // Add event listeners to the buttons
    document.querySelectorAll(".part-button").forEach((button) => {
        button.addEventListener("click", function () {
            const partName = this.dataset.part;

            const cameraPosition = cameraPositions[partName];

            if (cameraPosition) {
                // Define the animation duration
                const duration = 1000; // 1 second

                // Define the animation function
                function animate() {
                    // Calculate the time elapsed since the animation started
                    const time = Date.now() - startTime;

                    // Calculate the progress of the animation
                    const progress = time / duration;

                    // Update the camera position and rotation
                    camera.position.x =
                        cameraPosition.x * progress + camera.position.x * (1 - progress);
                    camera.position.y =
                        cameraPosition.y * progress + camera.position.y * (1 - progress);
                    camera.position.z =
                        cameraPosition.z * progress + camera.position.z * (1 - progress);
                    model.rotation.y =
                        cameraPosition.angle * progress + model.rotation.y * (1 - progress);

                    // Update the camera zoom
                    camera.zoom = 0.8 * progress + camera.zoom * (1 - progress);
                    camera.updateProjectionMatrix();

                    // Update the rotation of the text decals
                    textDecalMeshes.forEach((decal) => {
                        decal.rotation.y = model.rotation.y;
                    });

                    // Update the rotation of the image decals
                    imageDecalMeshes.forEach((decal) => {
                        decal.rotation.y = model.rotation.y;
                    });
                    // Check if the animation is complete
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                }

                patternDecalMeshes.forEach((decal) => {
                    decal.position.copy(model.position);
                    decal.rotation.copy(model.rotation);
                });

                // Start the animation
                const startTime = Date.now();
                animate();
            }
        });
    });
    const meshNamesHalfSleeves = {
        front: "Plane",
        back: "Plane_3",
        leftSleeve: "Plane_1",
        rightSleeve: "Plane_2",
        collar: "Plane_4",
    };
    const meshNamesFullSleeves = {
        front: "Plane",
        back: "Plane_1",
        rightShoulder: "Plane_2",
        leftShoulder: "Plane_3",
        leftSleeve: "Plane_4",
        rightSleeve: "Plane_5",
        rightInnerStrips: "Plane_6",
        leftInnerStrips: "Plane_7",
        collar: "Plane_8",
    };
    const meshNamesDesign1 = {
        front: "Plane",
        back: "Plane_1",
        rightShoulder: "Plane_2",
        leftShoulder: "Plane_3",
        leftSleeve: "Plane_4",
        rightSleeve: "Plane_5",
        rightInnerStrips: "Plane_6",
        leftInnerStrips: "Plane_7",
        collar: "Plane_8",
    };

    const meshNamesDesign2 = {
        bottomArea: "Plane", // collar
        collar: "Plane_1", // collar
        front: "Plane_2", // Front
        Back: "Plane_3", // Back
        leftShoulder: "Plane_4", // leftShoulder
        rightShoulder: "Plane_5", // rightShoulder
        LSleeves: "Plane_6", // rightShoulder
        RSleeves: "Plane_7", // rightShoulder

    };

    const meshNamesDesign3 = {
        front: "Plane",
        frontBorder: "Plane_1",
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
    document.querySelectorAll(".decalsItems").forEach((item) => {
        item.addEventListener("click", function () {
            const meshName = this.dataset.meshName;

            const decalType = this.dataset.decalType; // Get the decal type from the dataset

            handleMeshClick(meshName, decalType);
        });
    });
    // Function to handle image mesh click
    // Function to handle mesh click

    function handleMeshClick(meshName, decalType) {
        if (!tempText) {
            console.error("No text has been entered.");

            return;
        }

        if (!model) {
            console.error("Model is not loaded.");

            return;
        }

        createSVGTextTexture(
            tempText,
            selectedTextColor,
            "Arial",
            currentFontSize
        ).then((textTexture) => {
            const targetMesh = model.getObjectByName(meshName);

            if (!targetMesh) {
                console.error(`Mesh with name "${meshName}" not found.`);

                return;
            }

            const boundingBox = new THREE.Box3().setFromObject(targetMesh);

            const center = boundingBox.getCenter(new THREE.Vector3());

            const adjustedPosition = new THREE.Vector3()
                .copy(center)
                .add(tempPosition);

            const textDecalGeometry = new THREE.DecalGeometry(
                targetMesh,

                adjustedPosition,

                tempRotation,

                tempSize
            );

            const textDecalMaterial = new THREE.MeshBasicMaterial({
                map: textTexture,
                depthTest: false,
                depthWrite: false,
                side: THREE.frontSide,
                transparent: true,
                polygonOffset: true,
                polygonOffsetFactor: 1,
                polygonOffsetUnits: 1,
            });

            // Flip the texture horizontally for specific meshes



            const textDecalMesh = new THREE.Mesh(
                textDecalGeometry,
                textDecalMaterial
            );



            textDecalMesh.userData = {
                type: "text",

                text: tempText,

                fontSize: currentFontSize,

                fontFamily: "Arial", // Default font family

                color: selectedTextColor, // Store the color

                decalId: `decal${textDecalMeshes.length + 1}`,

                isFlipped: textDecalMaterial.userData.isFlipped,
            };

            // Create a new property in the decal's userData to store the font size

            textDecalMesh.userData.fontSize = currentFontSize;

            // Add to scene

            scene.add(textDecalMesh);
            textDecalMesh.renderOrder = 2; // Set render order to 1 for decals

            textDecalMeshes.push(textDecalMesh);

            console.log("Text decal added to mesh:", meshName);

            // Clear tempText after adding

            tempText = "";
        });
    }

    document
        .querySelectorAll('input[name="decalPlacementText"]')
        .forEach((radio) => {
            radio.addEventListener("change", function () {
                const meshName = this.value;

                tempText = decals.text.text;

                selectedTextColor = textDecalColor;

                currentFontSize = decals.text.fontSize;

                handleMeshClick(meshName, "text");
            });
        });

    document
        .querySelectorAll('input[name="decalPlacementName"]')
        .forEach((radio) => {
            radio.addEventListener("change", function () {
                const meshName = this.value;

                tempText = decals.name.text;

                selectedTextColor = nameDecalColor;

                currentFontSize = decals.name.fontSize;

                handleMeshClick(meshName, "name");
            });
        });

    document
        .querySelectorAll('input[name="decalPlacementNumber"]')
        .forEach((radio) => {
            radio.addEventListener("change", function () {
                const meshName = this.value;

                tempText = decals.number.text;

                selectedTextColor = numberDecalColor;

                currentFontSize = decals.number.fontSize;

                handleMeshClick(meshName, "number");
            });
        });
    document.querySelectorAll(".textMeshesItemsIcon").forEach((icon) => {
        icon.addEventListener("click", function () {
            const decalId = this.closest(".textMeshesItems").dataset.decalId;
            console.log(`Removing decal with ID: ${decalId}`);
            removeDecal(decalId);
        });
    });
    function removeDecal(decalId) {
        console.log("Current decals before removal:", textDecalMeshes);
        const decalToRemove = textDecalMeshes.find(
            (decal) => decal.userData.decalId === decalId
        );
        if (decalToRemove) {
            scene.remove(decalToRemove);
            textDecalMeshes = textDecalMeshes.filter(
                (decal) => decal !== decalToRemove
            );
            console.log(`Decal with ID ${decalId} removed.`);
        } else {
            console.warn(`No decal found with ID ${decalId}.`);
        }
        console.log("Current decals after removal:", textDecalMeshes);
    }
    async function createSVGTextTexture(text, color, fontFamily, fontSize) {
        return new Promise((resolve, reject) => {
            const svgNamespace = "http://www.w3.org/2000/svg";

            const svg = document.createElementNS(svgNamespace, "svg");

            const textElement = document.createElementNS(svgNamespace, "text");

            svg.setAttribute("width", 512);

            svg.setAttribute("height", 512);

            textElement.setAttribute("x", "50%");

            textElement.setAttribute("y", "50%");

            textElement.setAttribute("dominant-baseline", "middle");

            textElement.setAttribute("text-anchor", "middle");

            textElement.setAttribute("font-size", fontSize); // Use dynamic font size here

            textElement.setAttribute("font-weight", "900");

            textElement.setAttribute("fill", color);

            textElement.setAttribute("font-family", fontFamily);

            textElement.textContent = text;

            svg.appendChild(textElement);

            const svgData = new XMLSerializer().serializeToString(svg);

            const canvas = document.createElement("canvas");

            canvas.width = 512;

            canvas.height = 512;

            const ctx = canvas.getContext("2d");

            const img = new Image();

            img.onload = function () {
                ctx.drawImage(img, 0, 0);

                const texture = new THREE.CanvasTexture(canvas);

                resolve(texture);
            };

            img.onerror = reject;

            img.src = "data:image/svg+xml;base64," + btoa(svgData);
        });
    }
    let meshNames = {}; // This will hold the current mesh name mapping
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
                    // selectedMesh.material = new THREE.MeshStandardMaterial({
                    //     map: createGradientTexture(
                    //         selectedColors.color1,
                    //         selectedColors.color2,
                    //         gradientAngle,
                    //         gradientScale
                    //     ),
                    //     side: THREE.DoubleSide,
                    // });
                }
            }
        });
    });

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
    // --------------------------------------------RAYCASTER ----------------------------------
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    let selectedDecal = null;
    let mouseOffset = new THREE.Vector3(); // To store the offset of the mous
    let isDecalMoving = false;
    // Create a wireframe material for the border helper
    const borderMaterial = new THREE.MeshBasicMaterial({
        wireframe: false,
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
    });
    // Function to add a border helper to a decal
    function addBorderHelper(decal) {
        const borderGeometry = new THREE.EdgesGeometry(decal.geometry);
        const borderMesh = new THREE.LineSegments(borderGeometry, borderMaterial);
        scene.add(borderMesh);
        decal.userData.borderHelper = borderMesh;
    }
    // Function to remove a border helper from a decal
    function removeBorderHelper(decal) {
        if (decal.userData.borderHelper) {
            scene.remove(decal.userData.borderHelper);
            delete decal.userData.borderHelper;
        }
    }
    // function updateColorPalette(color) {
    //     console.log("Applying color to category:", selectedColorCategory);
    //     meshes[selectedColorCategory].forEach((mesh) => {
    //         if (mesh.isMesh) {
    //             mesh.material.color.set(color);
    //         }
    //     });
    // }
    // document.querySelectorAll(".color-palette .palette").forEach((palette) => {
    //     palette.addEventListener("click", function () {
    //         const color = new THREE.Color(getComputedStyle(this).backgroundColor);
    //         updateColorPalette(color);
    //         updateRadioButtonColor(color, selectedColorCategory); // Pass the category here
    //     });
    // });

    // Add event listeners to design images

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
            // Select the correct mappings based on the design
            // let colorMappings;
            // if (design === "Design1") {
            //     colorMappings = design1Mappings;
            // } else if (design === "Design2") {
            //     colorMappings = design2Mappings;
            //     loadModel(designModelMappings.Design2, colorMappings, "Design2");
            // } else if (design === "Design3") {
            //     colorMappings = design3Mappings;
            //     loadModel(designModelMappings.Design3, colorMappings, "Design3");
            // } else {
            //     console.error(`No model mapping found for design: ${design}`);
            // }
        });
    });
    function updateColors(newColors) {
        // Update the COLORS object
        Object.assign(COLORS, newColors);

        // Update the colors of existing meshes
        Object.keys(meshes).forEach((category) => {
            meshes[category].forEach((mesh) => {
                mesh.material.color.set(COLORS[mesh.userData.colorCategory]);
            });
        });
    }
    function updateRadioButtonColor(color, category) {
        // Define a mapping of category to the corresponding class
        const categoryClassMapping = {
            primary: ".Primary",
            secondary: ".Secondary",
            tertiary: ".Tertiary",
        };

        // Get the class corresponding to the selected category
        const categoryClass = categoryClassMapping[category];

        // Select the div for the specific category and update its color
        const targetDiv = document.querySelector(
            `.colorsMeshItems ${categoryClass}`
        );
        if (targetDiv) {
            targetDiv.style.backgroundColor = color.getStyle(); // Update color for the specific category
        }
    }
    document.querySelectorAll(".patternsItems img").forEach((img) => {
        img.addEventListener("click", function () {
            const patternPath = this.src;
            handlePatternDecal(patternPath);
        });
    });
    function handlePatternDecal(patternPath) {
        // Remove existing pattern decals
        //alert(patternPath);
        patternDecalMeshes.forEach((decal) => scene.remove(decal));

        patternDecalMeshes = [];
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(patternPath, function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(patternDecalScale, patternDecalScale);

            document
                .querySelectorAll('input[type="checkbox"]')
                .forEach((checkbox) => {
                    if (checkbox.checked) {
                        const meshName = meshNames[checkbox.id];
                        alert(checkbox.id);
                        model.traverse((child) => {
                            if (child.isMesh && child.name === meshName) {
                                const mesh = child;
                                const boundingBox = new THREE.Box3().setFromObject(mesh);
                                const size = boundingBox.getSize(new THREE.Vector3());
                                const center = boundingBox.getCenter(new THREE.Vector3());

                                const patternDecalGeometry = new THREE.DecalGeometry(
                                    mesh,
                                    center,
                                    new THREE.Euler(
                                        0,
                                        0,
                                        THREE.MathUtils.degToRad(patternDecalAngle)
                                    ),
                                    size
                                );

                                const patternDecalMaterial = new THREE.MeshBasicMaterial({

                                    map: texture,

                                    depthTest: true,

                                    depthWrite: false,

                                    side: THREE.frontSide,

                                    transparent: true,

                                    opacity: patternDecalOpacity,

                                });
                                const patternDecalMesh = new THREE.Mesh(
                                    patternDecalGeometry,
                                    patternDecalMaterial
                                );
                                patternDecalMesh.renderOrder = -1;
                                scene.add(patternDecalMesh);
                                patternDecalMeshes.push(patternDecalMesh);
                                patternDecalMesh.userData.type = "pattern";
                            }
                        });
                    }
                });
        });
    }

    document
        .getElementById("patternOpacity")
        .addEventListener("input", function () {
            patternDecalOpacity = parseFloat(this.value);
            document.getElementById("opacityValue").textContent = patternDecalOpacity;
            updatePatternDecals();
        });
    document
        .getElementById("patternScale")
        .addEventListener("input", function () {
            patternDecalScale = parseFloat(this.value);
            document.getElementById("scaleValue").textContent = patternDecalScale;
            updatePatternDecals();
        });

    function updatePatternDecals() {
        patternDecalMeshes.forEach((decal) => {
            decal.material.opacity = patternDecalOpacity;
            decal.material.map.repeat.set(patternDecalScale, patternDecalScale);
            decal.material.map.needsUpdate = true;
            const mesh = decal.geometry.parameters.mesh;
            const boundingBox = new THREE.Box3().setFromObject(mesh);
            const size = boundingBox.getSize(new THREE.Vector3());
            const center = boundingBox.getCenter(new THREE.Vector3());
            // Adjust rotation and scale without overflowing
            const radians = THREE.MathUtils.degToRad(patternDecalAngle);
            decal.geometry.rotateZ(radians);
            // Recalculate the decal geometry
            decal.geometry = new THREE.DecalGeometry(
                mesh,
                center,
                mesh.rotation, // Use the mesh's current rotation
                size
            );

            // Update the decal's attributes
            decal.geometry.attributes.position.needsUpdate = true;
            decal.geometry.attributes.uv.needsUpdate = true;

            // If using a material with a map, update that too
            decal.material.map.needsUpdate = true;
        });
    }
    function createGradientTexture(color1, color2, angle, scale) {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        const gradient = ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
        );
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const radians = (angle * Math.PI) / 180;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(radians);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        ctx.drawImage(canvas, 0, 0);
        ctx.restore();

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(scale, scale);
        return texture;
    }
    function updateGradient(color1, color2, angle, scale) {
        if (model) {
            model.traverse((child) => {
                if (child.isMesh) {
                    if (child.material.map instanceof THREE.CanvasTexture) {
                        const gradientTexture = createGradientTexture(
                            color1,
                            color2,
                            angle,
                            scale
                        );
                        child.material.map = gradientTexture;
                        child.material.needsUpdate = true;
                    }
                }
            });
        }
    }
    function convertPNGToSVG(pngDataUrl, callback) {
        // Convert PNG data URL to SVG format if necessary
        // For this example, we'll use the PNG as-is
        callback(pngDataUrl);
    }
    document.addEventListener("mousedown", (event) => {
        const canvasRect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
        mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(
            [...textDecalMeshes, ...imageDecalMeshes],
            true
        );
        if (intersects.length > 0) {
            if (selectedDecal) {
                removeBorderHelper(selectedDecal);
            }
            selectedDecal = intersects[0].object;

            // Access the stored size from userData
            const originalDecalSize = selectedDecal.userData.size; // Use userData to get size

            // ... existing code ...
            addBorderHelper(selectedDecal);
            console.log("Selected decal:", selectedDecal);
            let point = intersects[0].point;
            mouseOffset.copy(selectedDecal.position).sub(point);
            document.body.style.cursor = "grabbing"; // Change to 'grabbing'
            isDecalMoving = true; // Set the flag to true
            controls.enableRotate = false; // Disable rotation while moving the decal
        }
    });
    let decalPosition = new THREE.Vector3(0, 0.4, 1); // Define decalPosition as a global variable
    // Mouse move event to handle moving decals
    document.addEventListener("mousemove", (event) => {
        if (selectedDecal) {
            const canvasRect = container.getBoundingClientRect();
            mouse.x = ((event.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
            mouse.y = -((event.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            let intersects = raycaster.intersectObjects(model.children, true);

            if (intersects.length > 0) {
                let point = intersects[0].point;
                let normal = intersects[0].face.normal;

                // Set both decalPosition and currentDecalPosition to the same initial value with a small offset
                decalPosition.copy(point.clone().add(normal.multiplyScalar(0.01)));
                currentDecalPosition.copy(decalPosition);

                // Decide which position to use for decal placement:
                // decalPosition for initial placement, currentDecalPosition for further movement
                const usePosition = currentDecalPosition; // Switch to `decalPosition` if needed

                // Create new DecalGeometry
                const decalGeometry = new THREE.DecalGeometry(
                    intersects[0].object,
                    usePosition, // Use the chosen position
                    new THREE.Euler().setFromQuaternion(camera.quaternion), // Ensure it faces the camera
                    selectedDecal.userData.size
                );

                // Dispose of the old geometry and apply the new one
                selectedDecal.geometry.dispose();
                selectedDecal.geometry = decalGeometry;
            }
        }
    });

    // Event listener for the size slider

    const sizeSlider = document.getElementById("ImagedecalSizeSlider");


    // Add an event listener to the slider

    sizeSlider.addEventListener("input", function () {

        // Calculate the new decal size based on the slider value

        const newSize = (this.value / 100) * 2; // Map the slider value to a range of 0 to 2


        // Update the decal size vector (x and y dimensions, keep z fixed)

        const decalSize = new THREE.Vector3(newSize, newSize, 2); // New size for the decal


        // Update the image decal geometry for each image decal mesh

        imageDecalMeshes.forEach((decal) => {

            const targetMesh = model.getObjectByName(decal.userData.meshName);

            if (targetMesh) {

                // Use the current position of the decal

                const currentPosition = currentDecalPosition.clone(); // Use the updated current position

                const currentRotation = decal.rotation.clone();


                // Create new DecalGeometry with updated size while preserving the current position

                const imageDecalGeometry = new THREE.DecalGeometry(

                    targetMesh,

                    currentPosition, // Use the current position

                    currentRotation, // Use the current rotation

                    decalSize // Use the updated size

                );


                // Dispose of the old geometry

                decal.geometry.dispose();


                // Update the geometry with the new one

                decal.geometry = imageDecalGeometry;


                // Update userData with the new size

                decal.userData.size.copy(decalSize); // Ensure size is defined

            }

        });

    });
    document.addEventListener("mouseup", () => {
        document.body.style.cursor = ""; // Reset to default cursor
        isDecalMoving = false; // Set the flag to false
        controls.enableRotate = true; // Enable rotation when not moving the decal
        // Remove border helper when mouse is released
        if (selectedDecal) {
            removeBorderHelper(selectedDecal);
            selectedDecal = null;
        }
    });
    // --------------------------------------------RAYCASTER ----------------------------------

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

        // Update the border helper's position, rotation, and scale
        if (selectedDecal && selectedDecal.userData.borderHelper) {
            selectedDecal.userData.borderHelper.position.copy(selectedDecal.position);
            selectedDecal.userData.borderHelper.rotation.copy(selectedDecal.rotation);
            selectedDecal.userData.borderHelper.scale.copy(selectedDecal.scale);
        }
    }
    animate();
});
