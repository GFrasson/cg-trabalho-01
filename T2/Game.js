import * as THREE from 'three';

import { Ball } from './entities/Ball.js';
import { Background } from './entities/Background.js';
import { BrickArea } from './entities/BrickArea.js';
import { Wall } from './entities/Wall.js';
import { EventHandler } from './EventHandler.js';
import { ScreenHandler } from './ScreenHandler.js';
import { HitterCSG } from './entities/HitterCSG.js';
import { Stage } from './entities/Stage.js';
import { PowerUp } from './entities/PowerUp.js';


export class Game {
    constructor(camera, renderCallback, scene) {
        this.camera = camera;
        this.renderCallback = renderCallback;
        this.scene = scene;
        this.hitterCSG = new HitterCSG();
        this.currentStage = 1;
        this.stage = new Stage(this.currentStage, scene);

        this.background = new Background();
        this.brickArea = new BrickArea(scene, this.stage);

        const hitterInitialPosition = this.hitterCSG.getPosition();
        const ballInitialPosition = new THREE.Vector3().copy(hitterInitialPosition);
        ballInitialPosition.z -= 2;

        this.balls = [new Ball(ballInitialPosition)];
        this.walls = [
            Wall.createLeftWall(),
            Wall.createRightWall(),
            Wall.createTopWall(),
            Wall.createBottomWall()
        ];
        this.powerUps = [];

        this.bricksAnimateDestruction = [];

        this.gameScreen = false;
        this.pausedGame = false;
        this.startGame = false;

        this.timeIntervalIdToUpdateBallSpeed = null;

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
        return this.balls[0];
    }

    getWalls() {
        return this.walls;
    }

    getBottomWall() {
        return this.walls[this.walls.length - 1];
    }

    executeStep() {
        if (!this.pausedGame && this.startGame) {
            if (this.getBall().isLauched) {
                // move
                this.balls.forEach(ball => {
                    ball.move();
                });

                // move power ups
                this.powerUps.forEach(powerUp => {
                    powerUp.move();
                });

                this.bricksAnimateDestruction.forEach(brick => {
                    brick.animateDestructionStep();
                });

                // check end game
                if (this.getBrickArea().noBricks && !this.pausedGame) {
                    this.toggleEndGame();
                }
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

    addPowerUp(position) {
        if (this.balls.length > 1) {
            return;
        }

        const powerUp = new PowerUp(position);

        this.powerUps.push(powerUp);
        this.scene.add(powerUp.getTHREEObject());
    }

    deletePowerUp(powerUp) {
        this.powerUps = this.powerUps.filter(currentPowerUp => currentPowerUp !== powerUp);
        this.scene.remove(powerUp.getTHREEObject());
    }

    deleteAllPowerUps() {
        this.powerUps.forEach(powerUp => {
            this.scene.remove(powerUp.getTHREEObject());
        });
        this.powerUps = [];
    }

    duplicateBall() {
        if (this.balls.length > 1) {
            return;
        }

        const originalBall = this.getBall();

        const newBall = new Ball(originalBall.getTHREEObject().position);

        newBall.setIsLaunched(originalBall.isLauched);

        const newBallDirection = new THREE.Vector3().copy(originalBall.direction);
        newBallDirection.x += 0.2;
        newBallDirection.normalize();
        newBall.setDirection(newBallDirection);

        this.balls.push(newBall);
        this.scene.add(newBall.getTHREEObject());
    }

    deleteBall(ball) {
        this.balls = this.balls.filter(currentBall => currentBall !== ball);
        this.scene.remove(ball.getTHREEObject());
    }

    deleteDuplicatedBalls() {
        if (this.balls.length === 1) {
            return;
        }

        for (let i = 1; i < this.balls.length; i++) {
            this.scene.remove(this.balls[i].getTHREEObject());
        }

        this.balls = [this.balls[0]];
    }

    deleteBrickAnimation(brick) {
        this.bricksAnimateDestruction = this.bricksAnimateDestruction.filter(currentBrick => currentBrick !== brick);
    }

    startTimerToUpdateBallSpeed() {
        const timeDelayToCheckSpeedUpdateInMilliseconds = 50;
        const timeIntervalId = setInterval(
            () => Ball.updateSpeed(timeDelayToCheckSpeedUpdateInMilliseconds, this.pausedGame, timeIntervalId),
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
        this.getHitter().resetPosition();
        this.getBrickArea().resetBrickArea();
        this.deleteAllPowerUps();
        this.deleteDuplicatedBalls();
        this.getBall().resetPosition();
        this.bricksAnimateDestruction = [];

        this.pausedGame = false;
        this.startGame = false;
    }

    toggleEndGame() {
        this.screenHandler.showStageCompleteScreen();
        this.getHitter().resetPosition();
        this.getBall().resetPosition();
        this.pausedGame = true;
    }

    nextStage() {
        if (this.currentStage !== 1) {
            return;
        }
        this.currentStage = 2;
        this.getBrickArea().deleteBrickArea();
        this.bricksAnimateDestruction = [];
        this.stage = new Stage(this.currentStage, this.scene);
        this.brickArea = new BrickArea(this.scene, this.stage);
        this.getBrickArea().buildBrickArea(this.scene);
        this.getHitter().resetPosition();
        this.deleteAllPowerUps();
        this.deleteDuplicatedBalls();
        this.getBall().resetPosition();
        this.pausedGame = false;
        this.startGame = false;
    }
}