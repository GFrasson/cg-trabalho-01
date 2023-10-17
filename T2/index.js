import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
    initRenderer,
    initDefaultBasicLight,
    SecondaryBox
} from "../libs/util/util.js";

import { Camera } from './entities/Camera.js';
import { Game } from './Game.js';

const scene = new THREE.Scene();
const renderer = initRenderer();
const camera = new Camera();
const light = initDefaultBasicLight(scene);
renderer.setSize(window.innerHeight * camera.aspectRatio, window.innerHeight);

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
    ballSpeedSecondaryBox.changeMessage(`Ball speed: ${game.getBall().speed}`);

    requestAnimationFrame(render);
    renderer.render(scene, camera.getTHREECamera());
}
