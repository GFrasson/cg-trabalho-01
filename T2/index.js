import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {
    initRenderer,
    initDefaultBasicLight,
    SecondaryBox,
    createLightSphere,
    createGroundPlane
} from "../libs/util/util.js";

import { Camera } from './entities/Camera.js';
import { Game } from './Game.js';
import { Ball } from './entities/Ball.js';

const scene = new THREE.Scene();
const camera = new Camera();
const light = initDefaultBasicLight(scene);

// const renderer = initRenderer();
// renderer.setSize(window.innerHeight * camera.aspectRatio, window.innerHeight);
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type  = THREE.VSMShadowMap; 

let renderer = new THREE.WebGLRenderer();
  document.getElementById("webgl-output").appendChild( renderer.domElement );  
  renderer.setSize(window.innerHeight * camera.aspectRatio, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type  = THREE.VSMShadowMap; // default
  renderer.setClearColor(new THREE.Color("rgb(0, 0, 0)"));


//   var groundPlane = createGroundPlane(window.innerHeight * camera.aspectRatio, window.innerHeight); 
//   groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
// scene.add(groundPlane);

  //var lightPosition = new THREE.Vector3(2.0, 1.2, 0.0);
var lightPosition = new THREE.Vector3(50, 20, -50);
var lightSphere = createLightSphere(scene, 1, 10, 10, lightPosition);

var dirLight = new THREE.DirectionalLight("rgb(255,255,255)");
dirLight.position.copy(lightPosition);
dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 256;
dirLight.shadow.mapSize.height = 256;
dirLight.shadow.camera.near = .1;
dirLight.shadow.camera.far = window.innerHeight;
dirLight.shadow.camera.left = -50;
dirLight.shadow.camera.right = 50;
dirLight.shadow.camera.bottom = -50;
dirLight.shadow.camera.top = 50;
dirLight.shadow.bias = -0.0005;  
dirLight.shadow.bias = -0.00010; 

dirLight.shadow.radius = 4.5;
scene.add(dirLight);


export const game = new Game(camera, render, scene);

let orbit = new OrbitControls(camera.camera, renderer.domElement);


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
