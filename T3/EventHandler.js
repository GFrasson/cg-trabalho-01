import { onWindowResize } from "../libs/util/util.js";
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

export class EventHandler {
    constructor(game, camera, renderer) {
        this.game = game;
        this.orbit = new OrbitControls(camera.camera, renderer.domElement);
        this.orbit.enabled = false;

        this.camera = camera;
        this.camera.resetCamera();
    }

    listenMousedownEvent() {
        window.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                if (!this.game.startGame) {
                    this.game.toggleStartGame();
                } else if (!this.game.getBall().isLauched) {
                    this.game.getBall().launch(() => this.game.startTimerToUpdateBallSpeed());
                }
            }
        });
    }

    listenMousemoveEvent() {
        window.addEventListener('mousemove', (event) => {
            if (!this.game.pausedGame) {
                //this.game.getBackground().onMouseMove(event, this.game.getCamera(), this.game.getHitter());

                const ball = this.game.getBall();
                if (!ball.isLauched) {
                    const hitterPosition = this.game.getHitter().getPosition();
                    const ballTHREEObject = ball.getTHREEObject();
                    ballTHREEObject.position.copy(hitterPosition);
                    ballTHREEObject.position.z -= 2;
                }
            }
        });
    }

    listenKeydownEvent() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'Enter':
                    this.game.toggleFullScreen();
                    break;
                case 'r':
                    if (this.game.startGame && this.orbit.enabled === false) {
                        this.game.toggleRestartGame();
                    }
                    break;
                case ' ': // Space
                    if (this.game.gameScreen && this.orbit.enabled === false) {
                        this.game.togglePauseGame();
                    }
                    break;
                case 'g':
                    if(this.orbit.enabled === false) {
                        this.game.nextStage();
                    }
                    break;
                case 'w':
                    this.game.getCamera().getTHREECamera().position.z -= 1;
                    this.game.getCamera().getTHREECamera().updateProjectionMatrix();

                    break;
                case 'a':
                    this.game.getCamera().getTHREECamera().position.y -= 1;
                    this.game.getCamera().getTHREECamera().updateProjectionMatrix();

                    break;
                case 's':
                    this.game.getCamera().getTHREECamera().position.z += 1;
                    this.game.getCamera().getTHREECamera().updateProjectionMatrix();

                    break;
                case 'd':
                    this.game.getCamera().getTHREECamera().position.y += 1;
                    this.game.getCamera().getTHREECamera().updateProjectionMatrix();

                    break;
                case 'o':
                    if(this.orbit.enabled === false) {
                        this.orbit.enabled = true;
                        this.game.pausedGame = true;                                              
                    }else {
                        this.orbit.enabled = false;
                        this.game.pausedGame = false;
                        this.camera.resetCamera();
                    }
                    break;
                default:
                    break;
            }
        });
    }

    listenResizeEvent(renderer) {
        window.addEventListener(
            'resize',
            () => onWindowResize(this.game.getCamera().getTHREECamera(), renderer),
            false
        );
    }
}
