import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
    initRenderer,
    initDefaultBasicLight
} from "../libs/util/util.js";

import { Camera } from './entities/Camera.js';
import { Game } from './Game.js';

const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = new Camera();
const light = initDefaultBasicLight(scene);
renderer.setSize(window.innerHeight * camera.aspectRatio, window.innerHeight);

const game = new Game(camera, render, scene);
//const orbit = new OrbitControls(camera.getTHREECamera(), renderer.domElement);
game.addObjectsToScene(scene);

game.eventHandler.listenResizeEvent(renderer);
game.eventHandler.listenKeydownEvent();
game.eventHandler.listenMousemoveEvent();

game.screenHandler.listenScreenEvents();

function render() {
    game.executeStep();

    requestAnimationFrame(render);
    renderer.render(scene, camera.getTHREECamera());
}
