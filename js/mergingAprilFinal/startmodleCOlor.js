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
    let originalDecalSize; // Store the original size of the decal
    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);
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
