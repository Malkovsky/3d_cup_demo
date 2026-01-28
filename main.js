import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

// Camera setup - FOV 50°, position (0, 3, 8)
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 3, 8);

// Renderer setup
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// OrbitControls setup with damping and zoom limits
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;
controls.maxDistance = 15;
controls.target.set(0, 1.5, 0);
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight2.position.set(-5, 5, -5);
scene.add(directionalLight2);

// Texture loader
const textureLoader = new THREE.TextureLoader();
const loadingIndicator = document.getElementById('loadingIndicator');

// Cup mesh and handle variables
let cupMesh;
let handleMesh;
let isLoading = false;

// Load default QR texture and create cup
function createCup(texturePath) {
    console.log('[DEBUG] createCup called with texture:', texturePath);
    
    // Prevent concurrent loads
    if (isLoading) {
        console.log('Already loading a texture, please wait...');
        return;
    }
    
    isLoading = true;
    loadingIndicator.style.display = 'flex';
    
    textureLoader.load(
        texturePath,
        (texture) => {
            console.log('[DEBUG] Texture loaded successfully');
            // Configure texture wrapping
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.repeat.set(2, 1);  // This shows the full image twice, each occupying half circumference
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            
            // Remove old cup and handle if they exist
            if (cupMesh) {
                scene.remove(cupMesh);
                cupMesh.geometry.dispose();
                if (Array.isArray(cupMesh.material)) {
                    cupMesh.material.forEach(mat => {
                        if (mat.map) mat.map.dispose(); // Dispose texture
                        mat.dispose();
                    });
                } else {
                    if (cupMesh.material.map) cupMesh.material.map.dispose(); // Dispose texture
                    cupMesh.material.dispose();
                }
            }
            
            if (handleMesh) {
                scene.remove(handleMesh);
                handleMesh.geometry.dispose();
                handleMesh.material.dispose();
            }
            
            // Create straight cylinder geometry (same radius top and bottom)
            const geometry = new THREE.CylinderGeometry(1.0, 1.0, 2.25, 64, 1, false);
            
            // Create materials array: [side, top, bottom]
            // Only the side (index 0) gets the texture
            const sideMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                metalness: 0.1,
                roughness: 0.6
            });
            
            const capMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.1,
                roughness: 0.6
            });
            
            const materials = [
                sideMaterial,  // Side of cylinder
                capMaterial,   // Top cap
                capMaterial    // Bottom cap
            ];
            
            console.log('[DEBUG] Materials array created:', materials.length, 'materials');
            console.log('[DEBUG] Geometry groups:', geometry.groups);
            
            // Create cup mesh
            cupMesh = new THREE.Mesh(geometry, materials);
            cupMesh.position.y = 0.875;
            scene.add(cupMesh);
            console.log('[DEBUG] Cup mesh created and added to scene');
            
            // Create handle using torus geometry
            const handleGeometry = new THREE.TorusGeometry(0.4, 0.1, 16, 32, Math.PI);
            const handleMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.1,
                roughness: 0.6
            });
            handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
            
            // Position and rotate handle on the side of the cup
            handleMesh.position.set(0.0, 0.8, 1);  // Move outward so ends attach to cylinder
            handleMesh.rotation.x = Math.PI / 2;  // Rotate on X-axis instead of Y
            handleMesh.rotation.y = Math.PI / 2;
            scene.add(handleMesh);
            
            isLoading = false;
            loadingIndicator.style.display = 'none';
            
            // Clean up blob URL if applicable
            if (texturePath.startsWith('blob:')) {
                URL.revokeObjectURL(texturePath);
            }
        },
        undefined,
        (error) => {
            console.error('Error loading texture:', error);
            isLoading = false;
            loadingIndicator.style.display = 'none';
            
            // Clean up blob URL on error too
            if (texturePath.startsWith('blob:')) {
                URL.revokeObjectURL(texturePath);
            }
            
            // Better error message
            let errorMessage = 'Error loading texture. ';
            if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Please check the file format and try again.';
            }
            alert(errorMessage);
        }
    );
}

// Initialize with default QR texture
createCup('/3d_cup_demo/qr_verbose_white.png');

// Image upload handler
const uploadButton = document.getElementById('uploadButton');
const imageUpload = document.getElementById('imageUpload');
const fileName = document.getElementById('fileName');

uploadButton.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
        alert('File size must be less than 10MB.');
        return;
    }
    
    // Display file name
    fileName.textContent = file.name;
    
    // Create object URL and load texture
    const imageUrl = URL.createObjectURL(file);
    createCup(imageUrl);
    
    // Reset input to allow re-uploading the same file
    event.target.value = '';
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Render scene
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

// Fetch GitHub star count
fetch('https://api.github.com/repos/malkovsky/3d_cup_demo')
    .then(response => response.json())
    .then(data => {
        const starsElement = document.getElementById('github-stars');
        if (starsElement && data.stargazers_count !== undefined) {
            starsElement.textContent = `★ ${data.stargazers_count}`;
        }
    })
    .catch(error => {
        console.log('Could not fetch GitHub stars:', error);
        // Keep default star icon if fetch fails
    });
