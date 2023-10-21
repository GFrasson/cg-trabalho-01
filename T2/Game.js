import * as THREE from 'three';

import { Ball } from './entities/Ball.js';
import { Hitter } from './entities/Hitter.js';
import { Background } from './entities/Background.js';
import { BrickArea } from './entities/BrickArea.js';
import { Wall } from './entities/Wall.js';
import { EventHandler } from './EventHandler.js';
import { ScreenHandler } from './ScreenHandler.js';
import { HitterCSG } from './entities/HitterCSG.js';
import { Stage } from './entities/Stage.js';

export class Game {
    constructor(camera, renderCallback, scene) {
        this.camera = camera;
        this.renderCallback = renderCallback;
        this.hitterCSG = new HitterCSG();
        this.currentStage = 2;
        this.stage = new Stage(this.currentStage, scene);

        this.background = new Background();
        this.brickArea = new BrickArea(scene, this.stage);
        
        const hitterInitialPosition = this.hitterCSG.getPosition();
        const ballInitialPosition = new THREE.Vector3().copy(hitterInitialPosition);
        ballInitialPosition.z -= 2;
        // ballInitialPosition.x += 2.5;

        this.ball = new Ball(ballInitialPosition);
        this.walls = [
            Wall.createLeftWall(),
            Wall.createRightWall(),
            Wall.createTopWall(),
            Wall.createBottomWall()
        ];
        
        this.gameScreen = false;
        this.pausedGame = false;
        this.startGame = false;
        
        this.eventHandler = new EventHandler(this);
        this.screenHandler = new ScreenHandler(this, this.renderCallback);
    }

    getCamera() {
        return this.camera;
    }

    getHitter() {
        return this.hitterCSG;
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

    executeStep() {
        if (!this.pausedGame && this.startGame) {
            if (this.getBall().isLauched) {
                // move
                this.getBall().move(() => this.collisionsDetection());
                
                // check end game
                if (this.getBrickArea().noBricks && !this.pausedGame) {
                    this.toggleEndGame();
                }
            }
        }
    }

    collisionsDetection() {    
        this.getWalls().forEach(wall => {
            this.getBall().bounceWhenCollide(wall.boundingBox);

            if (wall.direction === 'bottom') {
                const isCollidingBottomWall = wall.collisionBottomWall(this.getBall());
                
                if (isCollidingBottomWall) {
                    const hitterPosition = this.hitterCSG.getPosition();
                    const ballOverHitterPosition = this.getBall().getOverHitterPosition(hitterPosition);
                    this.getBall().resetPosition(ballOverHitterPosition);
                }
            }
        });
        
        this.getBall().bounceWhenCollideNormal(this.hitterCSG.boundingSphere);

        for (let i = 0; i < this.stage.rows; i++) {
            for (let j = 0; j < this.stage.columns; j++) {
                const brick = this.getBrickArea().bricks[i][j];
                this.getBall().bounceWhenCollide(brick.boundingBox, brick, this.getBrickArea());
            }
        }        
    }

    addObjectsToScene(scene) {
        scene.add(this.getBackground().getTHREEObject());
        
        this.getBrickArea().buildBrickArea(scene);
        
        scene.add(this.getBall().getTHREEObject());
        
        this.getWalls().forEach(wall => {
            scene.add(wall.getTHREEObject());
        });

        scene.add(this.hitterCSG.hitterMesh);
        scene.add(this.hitterCSG.sphere);
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
            this.screenHandler.showGamePausedScreen();
        } else {
            this.screenHandler.hideGamePausedScreen();
        }
        // Travar movimento da bola também
    }

    toggleStartGame() {
        if (this.pausedGame === false) {
            this.startGame = true;
            this.ball.isLauched = true;
        }
    }

    toggleRestartGame() {
        this.hitterCSG.resetPosition();
        this.brickArea.resetBrickArea();
        this.ball.resetPosition();
        this.pausedGame = false;
        this.startGame = false;
    }
    
    toggleEndGame() {
        this.screenHandler.showStageCompleteScreen();
        this.hitterCSG.resetPosition();
        //brickArea.resetBrickArea();
        this.ball.resetPosition();
        this.pausedGame = true;
    }

    nextStage() {
        this.currentStage += 1;
        this.hitterCSG.resetPosition();
        this.ball.resetPosition();
        // Precisa mudar para a BrickArea2 quando estiver pronta
        this.brickArea.resetBrickArea();
        this.pausedGame = false;
        this.startGame = false;
    }
}