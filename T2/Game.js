import * as THREE from 'three';

import { Ball } from './entities/Ball.js';
import { Hitter } from './entities/Hitter.js';
import { Background } from './entities/Background.js';
import { BrickArea } from './entities/BrickArea.js';
import { Wall } from './entities/Wall.js';
import { EventHandler } from './EventHandler.js';
import { ScreenHandler } from './ScreenHandler.js';

export class Game {
    constructor(camera, renderCallback, scene) {
        this.camera = camera;
        this.renderCallback = renderCallback;
        this.scene = scene;
        this.hitter = new Hitter();
        this.background = new Background();
        this.brickArea = new BrickArea();
        
        const hitterInitialPosition = this.hitter.getPosition();
        const ballInitialPosition = new THREE.Vector3().copy(hitterInitialPosition);
        ballInitialPosition.z -= 2;
        ballInitialPosition.x += 2.5;

        this.balls = [new Ball(ballInitialPosition)];
        this.walls = [
            Wall.createLeftWall(),
            Wall.createRightWall(),
            Wall.createTopWall(),
            Wall.createBottomWall()
        ];
        this.powerUps = [];
        
        this.gameScreen = false;
        this.pausedGame = false;
        this.startGame = false;
        this.currentStage = 1;
        
        this.timeIntervalIdToUpdateBallSpeed = null;

        this.eventHandler = new EventHandler(this);
        this.screenHandler = new ScreenHandler(this, this.renderCallback);
    }

    getCamera() {
        return this.camera;
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
        return this.balls[0];
    }

    getWalls() {
        return this.walls;
    }

    executeStep() {
        if (!this.pausedGame && this.startGame) {
            if (this.getBall().isLauched) {
                // move
                this.getBall().move(() => this.collisionsDetection());

                // move power ups
                this.powerUps.forEach(powerUp => {
                    powerUp.move();
                });
    
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
                    const hitterPosition = this.hitter.getPosition();
                    const ballOverHitterPosition = this.getBall().getOverHitterPosition(hitterPosition);
                    this.getBall().resetPosition(ballOverHitterPosition);
                }
            }
        });

        this.getHitter().segments.forEach(hitterSegment => {
            this.getBall().bounceWhenCollideNormal(hitterSegment.boundingBox, hitterSegment.normalVector);
        });

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 13; j++) {
                const brick = this.getBrickArea().bricks[i][j];
                this.getBall().bounceWhenCollide(brick.boundingBox, brick, this.getBrickArea());
            }
        }

        this.powerUps.forEach(powerUp => {
            powerUp.collectPowerUpWhenCollideHitter(this.getHitter().getBoundingSphere());
        })
    }

    addObjectsToScene(scene) {
        this.getHitter().segments.forEach(segment => {
            scene.add(segment.getTHREEObject());
        });

        scene.add(this.getBackground().getTHREEObject());
        
        this.getBrickArea().buildBrickArea(scene);
        
        scene.add(this.getBall().getTHREEObject());
        
        this.getWalls().forEach(wall => {
            scene.add(wall.getTHREEObject());
        });
    }

    addPowerUp(powerUp) {
        this.powerUps.push(powerUp);
        this.scene.add(powerUp.getTHREEObject());
    }

    deletePowerUp(powerUp) {
        this.powerUps = this.powerUps.filter(currentPowerUp => currentPowerUp !== powerUp);
        powerUp.getTHREEObject().parent.remove(powerUp);
    }

    duplicateBall() {
        if (this.balls.length === 1) {
            const originalBall = this.getBall();

            const newBall = new Ball(originalBall.getTHREEObject().position);

            newBall.setSpeed(originalBall.speed);
            newBall.setIsLaunched(originalBall.isLauched);

            const newBallDirection = new THREE.Vector3().copy(originalBall.direction);
            newBallDirection.x += 0.2;
            newBallDirection.normalize();
            newBall.setDirection(newBallDirection);
            
            this.balls.push(newBall);
        }
    }

    startTimerToUpdateBallSpeed() {
        const timeDelayToCheckSpeedUpdateInMilliseconds = 50;
        const timeIntervalId = setInterval(
            () => this.getBall().updateSpeed(timeDelayToCheckSpeedUpdateInMilliseconds, this.pausedGame, timeIntervalId), 
            timeDelayToCheckSpeedUpdateInMilliseconds
        );
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
            this.getBall().launch(() => this.startTimerToUpdateBallSpeed());
        }
    }

    toggleRestartGame() {
        this.hitter.resetPosition();
        this.brickArea.resetBrickArea();
        this.getBall().resetPosition();
        this.pausedGame = false;
        this.startGame = false;
    }
    
    toggleEndGame() {
        this.screenHandler.showStageCompleteScreen();
        this.hitter.resetPosition();
        //brickArea.resetBrickArea();
        this.getBall().resetPosition();
        this.pausedGame = true;
    }

    nextStage() {
        this.currentStage += 1;
    }
}