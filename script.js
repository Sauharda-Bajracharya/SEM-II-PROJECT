import './style.css';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const canvas = document.querySelector('canvas.webgl');
const cursorCircle = document.querySelector('.cursor-circle');

const navbarDetailsLink = document.querySelector('.navbar-right li:first-child a');
const detailsDiv = document.querySelector('.details');

navbarDetailsLink.addEventListener('click', () => {
    detailsDiv.classList.toggle('hidden');
});

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(10, sizes.width / sizes.height);
// camera.position.set(0,0,Math.max(x*3,ys*3,z*3));
scene.add(camera);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const spotLight = new THREE.AmbientLight(0xffffff);
spotLight.position.set(1, 1, 0);
scene.add(spotLight);

const newSpotLight = new THREE.DirectionalLight(0xffffff);
newSpotLight.position.set(0, 1, 0);
scene.add(newSpotLight);

const groundGeometry = new THREE.PlaneGeometry(500, 500, 1, 1);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x4D4855,
    roughness: 0.1,
    metalness: 0.9
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI * -0.5;
scene.add(ground);

let car;
gltfLoader.load('car3.glb', (gltf) => {
    car = gltf.scene;
    scene.add(car);

    const frontPosition = new THREE.Vector3();
    car.getWorldPosition(frontPosition);

    const cameraOffset = new THREE.Vector3(1.1917919260198613,0.7448141407084368, 1.7563837567213605); // Adjust the camera position if needed
    camera.position.copy(frontPosition).add(cameraOffset);

    car.position.x = 0.19; // Move the car 2 units to the right

});

const cursor = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    cursorCircle.style.left = `${x}px`;
    cursorCircle.style.top = `${y}px`;
});

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, canvas);

window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('click', onClick);

function onClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    console.log('Camera Position:', camera.position);
}

// STARS

const starPositions = [];

const numStars = 1000; 

for (let i = 0; i < numStars; i++) {
    
    const x = Math.random() * 2000 - 1000; 
    const y = Math.random() * 2000 - 1000;
    const z = Math.random() * 2000 - 1000;

    starPositions.push({ x, y, z });
}

const starSpheres = [];

const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); 

for (const position of starPositions) {
    const starGeometry = new THREE.SphereGeometry(1, 16, 16); 
    const starSphere = new THREE.Mesh(starGeometry, starMaterial);

    starSphere.position.set(position.x, position.y, position.z);

    starSpheres.push(starSphere);
    scene.add(starSphere);
}

starSpheres.forEach((starSphere) => {
    starSphere.renderOrder = -1;
});

// KEY PRESSES

window.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') {
 
        const NewCameraOffset = new THREE.Vector3(1.1917919260198613,0.7448141407084368, 1.7563837567213605);
        const lookAtPosition = new THREE.Vector3(0, 0, 0); 
        camera.position.copy(NewCameraOffset);
        camera.lookAt(lookAtPosition);

    }
});
const animate = () => {

    renderer.render(scene, camera);
    controls.update();

    requestAnimationFrame(animate);
}

animate();
