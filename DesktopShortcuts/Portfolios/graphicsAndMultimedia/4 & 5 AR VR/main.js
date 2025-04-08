import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { BoxLineGeometry } from 'three/addons/geometries/BoxLineGeometry.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';

let container;
let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let room;
let instructionsPanel;
let instructionsPanelShown = false; // Track if instructions have been shown
let fpsCounter; // FPS counter element
let isAR = false; // Track if we're in AR mode

const clock = new THREE.Clock();

let selectedObject = null;
let selectedController = null;
let controllerPreviousPosition = new THREE.Vector3();
let controllerVelocity = new THREE.Vector3();

init();
animate();

function init() {
    container = document.getElementById('container');

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    // Camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.set(0, 1.6, 3);

    // Room
    room = new THREE.LineSegments(
        new BoxLineGeometry(6, 6, 6, 10, 10, 10),
        new THREE.LineBasicMaterial({ color: 0x808080 })
    );
    room.geometry.translate(0, 3, 0);
    scene.add(room);

    // Add some objects to the scene
    addObjects();

    // Add instructions panel (initially hidden)
    createInstructionsPanel();
    
    // Add FPS counter
    createFPSCounter();

    // Light
    scene.add(new THREE.HemisphereLight(0x606060, 0x404040));
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    // VR Button
    const vrButton = document.getElementById('vr-button');
    vrButton.addEventListener('click', () => {
        // Only append the VR button if it hasn't been created yet
        if (!document.querySelector('.VRButton')) {
            const enterVR = VRButton.createButton(renderer);
            document.body.appendChild(enterVR);
            enterVR.click(); // Auto-click to enter VR
            
            // Hide the info panel once VR is initiated
            document.getElementById('info').style.display = 'none';
        }
    });
    
    // AR Button
    const arButton = document.getElementById('ar-button');
    arButton.addEventListener('click', () => {
        if (!document.querySelector('.ARButton')) {
            isAR = true;
            // Make scene background transparent for AR
            scene.background = null;
            
            const enterAR = ARButton.createButton(renderer);
            document.body.appendChild(enterAR);
            enterAR.click(); // Auto-click to enter AR
            
            // Hide the info panel once AR is initiated
            document.getElementById('info').style.display = 'none';
        }
    });

    // Controllers
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    scene.add(controller2);

    // Controller Models
    const controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    // Controller helper
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
    ]);

    const line = new THREE.Line(geometry);
    line.name = 'line';
    line.scale.z = 5;

    controller1.add(line.clone());
    controller2.add(line.clone());

    // Window resize handler
    window.addEventListener('resize', onWindowResize);
}

function addObjects() {
    // Add some colorful cubes floating in the space
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    
    for (let i = 0; i < 20; i++) {
        const material = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            roughness: 0.7,
            metalness: 0.0
        });
        
        const object = new THREE.Mesh(geometry, material);
        
        object.position.x = Math.random() * 4 - 2;
        object.position.y = Math.random() * 4 + 0.5;
        object.position.z = Math.random() * 4 - 2;
        
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        
        object.scale.setScalar(Math.random() * 0.5 + 0.3);
        
        object.userData.velocity = new THREE.Vector3(
            Math.random() * 0.01 - 0.005,
            Math.random() * 0.01 - 0.005,
            Math.random() * 0.01 - 0.005
        );
        
        room.add(object);
    }
}

function createInstructionsPanel() {
    // Create a canvas for the instructions text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    
    // Fill background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    context.strokeStyle = '#ffffff';
    context.lineWidth = 5;
    context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Add text
    context.fillStyle = '#ffffff';
    context.font = '24px Arial';
    context.textAlign = 'center';
    
    const instructions = [
        "HOW TO PLAY",
        "",
        "• Use the trigger button to grab boxes",
        "• Throw boxes by releasing the trigger",
        "• Try to catch boxes with your controllers",
        "• Watch boxes bounce off the walls",
        "",
        "Have fun in VR!"
    ];
    
    let y = 80;
    instructions.forEach(line => {
        context.fillText(line, canvas.width / 2, y);
        y += line === "" ? 30 : 45;
    });
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    // Create panel
    const geometry = new THREE.PlaneGeometry(1.5, 1.5);
    instructionsPanel = new THREE.Mesh(geometry, material);
    instructionsPanel.position.set(0, 1.6, -2);
    instructionsPanel.visible = false; // Hide initially
    scene.add(instructionsPanel);
}

function createFPSCounter() {
    // Create a canvas for the FPS counter
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;
    
    // Fill background
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    context.strokeStyle = '#ffffff';
    context.lineWidth = 2;
    context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    // Create panel
    const geometry = new THREE.PlaneGeometry(0.3, 0.15);
    fpsCounter = new THREE.Mesh(geometry, material);
    fpsCounter.visible = false; // Only visible in VR
    scene.add(fpsCounter);
    
    // Store context reference for updating
    fpsCounter.userData.context = context;
    fpsCounter.userData.texture = texture;
    fpsCounter.userData.fps = 0;
    fpsCounter.userData.frames = 0;
    fpsCounter.userData.prevTime = performance.now();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onSelectStart() {
    this.userData.isSelecting = true;
    
    // Check if there's an object to grab
    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(this.matrixWorld);
    
    const raycaster = new THREE.Raycaster();
    raycaster.ray.origin.setFromMatrixPosition(this.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    
    const intersects = raycaster.intersectObjects(room.children);
    
    if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        selectedController = this;
        selectedObject.material.emissive.set(0x333333);
        // Store the object's own velocity while being held
        selectedObject.userData.previousVelocity = selectedObject.userData.velocity.clone();
        selectedObject.userData.velocity.set(0, 0, 0);
        
        // Store controller position for velocity calculation
        controllerPreviousPosition.setFromMatrixPosition(this.matrixWorld);
        controllerVelocity.set(0, 0, 0);
    }
}

function onSelectEnd() {
    this.userData.isSelecting = false;
    
    // Release the grabbed object
    if (selectedObject && selectedController === this) {
        selectedObject.material.emissive.set(0x000000);
        
        // Apply controller velocity to the object (for throwing)
        selectedObject.userData.velocity.copy(controllerVelocity);
        
        // Scale up the thrown velocity for better effect
        selectedObject.userData.velocity.multiplyScalar(5);
        
        selectedObject = null;
        selectedController = null;
    }
}

function handleController(controller) {
    // Update position of held object
    if (selectedObject && selectedController === controller) {
        // Get controller's world position
        const controllerWorldPosition = new THREE.Vector3();
        controller.getWorldPosition(controllerWorldPosition);
        
        // Calculate controller velocity
        controllerVelocity.copy(controllerWorldPosition).sub(controllerPreviousPosition);
        controllerPreviousPosition.copy(controllerWorldPosition);
        
        // Position the object in front of the controller
        const offsetDistance = 0.5; // Distance in front of controller
        const controllerDirection = new THREE.Vector3(0, 0, -1);
        controllerDirection.applyQuaternion(controller.quaternion);
        controllerDirection.multiplyScalar(offsetDistance);
        
        // Set the object position
        selectedObject.position.copy(controllerWorldPosition).add(controllerDirection);
        
        // Match the controller rotation
        selectedObject.quaternion.copy(controller.quaternion);
    }
}

function updateFPSCounter() {
    if (!fpsCounter || !fpsCounter.visible) return;
    
    // Update FPS calculation
    fpsCounter.userData.frames++;
    const time = performance.now();
    
    if (time >= fpsCounter.userData.prevTime + 1000) {
        fpsCounter.userData.fps = Math.round((fpsCounter.userData.frames * 1000) / (time - fpsCounter.userData.prevTime));
        fpsCounter.userData.prevTime = time;
        fpsCounter.userData.frames = 0;
        
        // Update canvas
        const context = fpsCounter.userData.context;
        
        // Clear canvas
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        
        // Add border
        context.strokeStyle = '#ffffff';
        context.lineWidth = 2;
        context.strokeRect(5, 5, context.canvas.width - 10, context.canvas.height - 10);
        
        // Add FPS text
        context.fillStyle = '#ffffff';
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`${fpsCounter.userData.fps} FPS`, context.canvas.width / 2, context.canvas.height / 2);
        
        // Update texture
        fpsCounter.userData.texture.needsUpdate = true;
    }
}

function animate() {
    renderer.setAnimationLoop(render);
}

function fadeOutInstructions() {
    if (instructionsPanel && instructionsPanel.material.opacity > 0) {
        instructionsPanel.material.opacity -= 0.01;
        setTimeout(fadeOutInstructions, 50);
    } else if (instructionsPanel) {
        instructionsPanel.visible = false;
        instructionsPanel.material.opacity = 1;
    }
}

function render() {
    // Show instructions panel when in VR/AR, but only if it hasn't been shown before
    if (renderer.xr.isPresenting) {
        // Show and position FPS counter in VR/AR
        if (fpsCounter && !fpsCounter.visible) {
            fpsCounter.visible = true;
        }
        
        // Position FPS counter at bottom right of user view
        if (fpsCounter && fpsCounter.visible) {
            // Position relative to camera
            const cameraDirection = new THREE.Vector3(0, 0, -1);
            cameraDirection.applyQuaternion(camera.quaternion);
            
            // Position counter in bottom right corner of view
            fpsCounter.position.copy(camera.position);
            fpsCounter.position.add(new THREE.Vector3(0.4, -0.3, -1).applyQuaternion(camera.quaternion));
            
            // Make counter face the user
            fpsCounter.lookAt(camera.position);
            
            // Update FPS display
            updateFPSCounter();
        }
        
        // Instructions panel logic
        if (instructionsPanel && !instructionsPanelShown) {
            if (!instructionsPanel.visible) {
                instructionsPanel.visible = true;
                instructionsPanelShown = true; // Mark as shown
                
                // Position in front of the user
                const distance = isAR ? -1 : -2; // Closer in AR
                instructionsPanel.position.set(0, 1.6, distance);
                
                // Make the panel face the user
                instructionsPanel.lookAt(camera.position);
                
                // After 10 seconds, fade out the instructions
                setTimeout(() => {
                    fadeOutInstructions();
                }, 10000);
            }
        }
    }
    
    handleController(controller1);
    handleController(controller2);
    
    const delta = clock.getDelta();
    
    // Animate objects
    room.children.forEach(object => {
        if (object.userData.velocity && object !== selectedObject) {
            object.position.x += object.userData.velocity.x;
            object.position.y += object.userData.velocity.y;
            object.position.z += object.userData.velocity.z;
            
            // Rotate cubes
            object.rotation.x += 0.005;
            object.rotation.y += 0.01;
            
            // Bounce off the room walls
            if (Math.abs(object.position.x) > 2.5) {
                object.userData.velocity.x = -object.userData.velocity.x;
            }
            
            if (object.position.y < 0.5 || object.position.y > 5.5) {
                object.userData.velocity.y = -object.userData.velocity.y;
            }
            
            if (Math.abs(object.position.z) > 2.5) {
                object.userData.velocity.z = -object.userData.velocity.z;
            }
            
            // Reset emissive property
            if (object.material) {
                object.material.emissive.b *= 0.95;
            }
        }
    });
    
    renderer.render(scene, camera);
}