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
// const orbit = new OrbitControls(camera.getTHREECamera(), renderer.domElement);
renderer.setSize(window.innerHeight * camera.aspectRatio, window.innerHeight);

const game = new Game();

game.getHitter().segments.forEach(segment => {
    scene.add(segment.getTHREEObject());
});

scene.add(game.getBackground().getTHREEObject());

game.getBrickArea().buildBrickArea(scene);

scene.add(game.getBall().getTHREEObject());

game.getWalls().forEach(wall => {
    scene.add(wall.getTHREEObject());
});

// Listen window size changes
window.addEventListener(
    'resize',
    () => camera.onWindowResize(renderer, window.innerHeight * camera.aspectRatio, window.innerHeight),
    false
);

// Mapeando teclado
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'Enter':
            game.toggleFullScreen();
            break;
        case 'r':
            if (game.startGame) {
                game.toggleRestartGame();
            }
            break;
        case ' ': // Space
            if (game.startGame) {
                game.togglePauseGame();
            }
            break;
        default:
            break;
    }
});


window.addEventListener('mousemove', (event) => {
    if (!game.pausedGame) {
        game.getBackground().onMouseMove(event, camera, game.getHitter());

        const ball = game.getBall();
        if (!ball.isLauched) {
            const hitterPosition = game.getHitter().getPosition();
            const ballTHREEObject = ball.getTHREEObject();
            ballTHREEObject.position.copy(hitterPosition);
            ballTHREEObject.position.z -= 2;
        }
    }
});

document.getElementById('startButton').addEventListener('click', startGame);
function startGame() {
    // Mapeando botão do mouse
    window.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            if (!game.startGame) {
                game.toggleStartGame();
            }
        }
    });

    const startingScreenDiv = document.getElementById('starting-screen');
    startingScreenDiv.style.display = 'none';
    render();
}

function render() {
    if (!game.pausedGame && game.startGame) {
        if (game.getBall().isLauched) {
            // move
            game.getBall().move();

            // boundingSphere
            game.getBall().updateBoundingSphere();

            // detect collisions
            game.getWalls().forEach(wall => {
                game.getBall().bounceWhenCollide(wall.boundingBox);

                if (wall.direction === 'bottom') {
                    wall.collisionBottomWall(game.getBall());
                }
            });

            game.getHitter().segments.forEach(hitterSegment => {
                game.getBall().bounceWhenCollideNormal(hitterSegment.boundingBox, hitterSegment.normalVector);
            });

            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 13; j++) {
                    const brick = game.getBrickArea().bricks[i][j];
                    game.getBall().bounceWhenCollide(brick.boundingBox, brick, game.getBrickArea());
                }
            }

            // check end game
            if (game.getBrickArea().noBricks && !game.pausedGame) {
                game.toggleEndGame();
            }
        }
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera.getTHREECamera()) // Render scene
}
