import * as THREE from 'three';

import { Ball } from './entities/Ball.js';
import { Hitter } from './entities/Hitter.js';
import { Background } from './entities/Background.js';
import { BrickArea } from './entities/BrickArea.js';
import { Wall } from './entities/Wall.js';

export class Game {
    constructor() {
        this.hitter = new Hitter();
        this.background = new Background();
        this.brickArea = new BrickArea();
        
        const hitterInitialPosition = this.hitter.getPosition();
        const ballInitialPosition = new THREE.Vector3().copy(hitterInitialPosition);
        ballInitialPosition.z -= 2;

        this.ball = new Ball(ballInitialPosition);
        this.walls = [
            Wall.createLeftWall(),
            Wall.createRightWall(),
            Wall.createTopWall(),
            Wall.createBottomWall()
        ];

        this.pausedGame = false;
        this.startGame = false;
        this.currentStage = 1;
    }

    getHitter() {
        return this.hitter;
    }

    getBackground() {
        return this.background;
    }

    getBrickArea() {
        return this.brickArea;
    }

    getBall() {
        return this.ball;
    }

    getWalls() {
        return this.walls;
    }

    toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    togglePauseGame() {
        this.pausedGame = !this.pausedGame; // Pausando Raycaster
        if (this.pausedGame === true) {
            alert("Jogo pausado!");
        } else {
            alert("De volta ao jogo!");
        }
        // Travar movimento da bola também
    }

    toggleStartGame() {
        if (this.pausedGame === false) {
            this.startGame = true;
            this.ball.isLauched = true;
            alert("Jogo iniciado!");
        }
    }

    toggleRestartGame() {
        alert("Jogo reiniciado!");
        this.hitter.resetPosition();
        this.brickArea.resetBrickArea();
        this.ball.resetPosition();
        this.pausedGame = false;
        this.startGame = false;
    }
    
    toggleEndGame() {
        alert("FIM DE JOGO!");
        this.hitter.resetPosition();
        //brickArea.resetBrickArea();
        this.ball.resetPosition();
        this.pausedGame = true;
    }
}