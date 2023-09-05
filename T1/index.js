import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
    initRenderer,
    initDefaultBasicLight,
    setDefaultMaterial,
    InfoBox,
    createGroundPlaneXZ
} from "../libs/util/util.js";

import { Ball } from './entities/Ball.js';
import { Camera } from './entities/Camera.js';
import { Hitter } from './entities/Hitter.js';
import { Background } from './entities/Background.js';
import { Brick } from './entities/Brick.js';
import { BrickArea } from './entities/BrickArea.js';

const scene = new THREE.Scene();    // Create main scene
const renderer = initRenderer();    // Init a basic renderer
const camera = new Camera();
const material = setDefaultMaterial(); // create a basic material
const light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
//const orbit = new OrbitControls(camera.getTHREECamera(), renderer.domElement); // Enable mouse rotation, pan, zoom etc.

renderer.setSize(window.innerHeight * camera.aspectRatio, window.innerHeight);

// Listen window size changes
window.addEventListener(
    'resize',
    () => camera.onWindowResize(renderer, window.innerHeight * camera.aspectRatio, window.innerHeight),
    false
);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Mapeando teclado
window.addEventListener('keydown', (event) => {  
    switch (event.key) {
        case 'Enter':
            toggleFullScreen();
            break;
        case 'r':
            alert("REINICIAR JOGO!");
            break;
        case ' ': // Space
            alert("PAUSAR JOGO!");
            break;
        default:
            break;
    }
});

// Mapeando botão do mouse
window.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        alert('INICIAR JOGO');
    }
});

// Show axes (parameter is size of each axis)
// const axesHelper = new THREE.AxesHelper(12);
// scene.add(axesHelper);

// create the ground plane
// const plane = createGroundPlaneXZ(20, 20)
// scene.add(plane);

// const ball = new Ball(material);
// scene.add(ball.sphere);

const hitter = new Hitter(material);
scene.add(hitter.cube);

const background = new Background();
scene.add(background.plane);
window.addEventListener('mousemove', (event) => {
    background.onMouseMove(event, camera, hitter);
});

const brick = new Brick(material);
scene.add(brick.block);

const brickArea = new BrickArea(material);
scene.add(brickArea.blockArea);


// Use this to show information onscreen
(
    function buildInterface() {
        const controls = new InfoBox();
        controls.add("Basic Scene");
        controls.addParagraph();
        controls.add("Use mouse to interact:");
        controls.add("* Left button to rotate");
        controls.add("* Right button to translate (pan)");
        controls.add("* Scroll to zoom in/out.");
        controls.show();
    }
)();


render();
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera.getTHREECamera()) // Render scene
}
