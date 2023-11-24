import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
    SecondaryBox
} from "../libs/util/util.js";

import { Camera } from './entities/Camera.js';
import { Game } from './Game.js';
import { Ball } from './entities/Ball.js';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
document.getElementById("webgl-output").appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.setClearColor(new THREE.Color("rgb(0, 0, 0)"));

const camera = new Camera();

const ambientLight = new THREE.AmbientLight('white', 0.45);
scene.add(ambientLight);

const directionalLightPosition = new THREE.Vector3(22, 50, -40);
const directionalLight = new THREE.DirectionalLight('white', 0.6);
directionalLight.position.copy(directionalLightPosition);
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 110;
directionalLight.shadow.camera.left = -45;
directionalLight.shadow.camera.right = 45;
directionalLight.shadow.camera.bottom = -40;
directionalLight.shadow.camera.top = 40;
directionalLight.shadow.bias = -0.0005;
directionalLight.shadow.radius = 1.0;

scene.add(directionalLight);

renderer.setSize(window.innerHeight * camera.aspectRatio, window.innerHeight);

const orbit = new OrbitControls( camera.getTHREECamera(), renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

export const game = new Game(camera, render, scene);

game.addObjectsToScene(scene);

game.eventHandler.listenResizeEvent(renderer);
game.eventHandler.listenKeydownEvent();
game.eventHandler.listenMousemoveEvent();

game.screenHandler.listenScreenEvents();

const ballSpeedSecondaryBox = new SecondaryBox();
ballSpeedSecondaryBox.changeStyle('rgba(100,100,255,0.3)', 'white', '20px');
ballSpeedSecondaryBox.changeMessage('Ball speed: 0');

function render() {
    game.executeStep();
    ballSpeedSecondaryBox.changeMessage(`Ball speed: ${Ball.speed}`);

    requestAnimationFrame(render);
    renderer.render(scene, camera.getTHREECamera());
}
