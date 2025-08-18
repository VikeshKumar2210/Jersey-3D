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

document.getElementById("applyPatternButton")
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
            context.strokeStyle = "white";
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

            context.strokeStyle = "white";
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
// Event listener for pattern scale
patternScaleSlider.addEventListener("input", (event) => {
    saveState(); // Save state before scale change
    const scaleValue = event.target.value;
    patternScaleValueSpan.textContent = `${scaleValue}%`;
    currentPatternScale = scaleValue / 100; // Convert 10-200 to 0.1-2.0 scale

    // Update all pattern decals with the new scale
    updateAllPatternDecalsScale();
});