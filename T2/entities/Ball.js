import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';
import { game } from '../index.js';
import { Brick } from './Brick.js';

export class Ball {
    static timePassedFromLaunchInMilliseconds = 0;
    static timeIntervalId = null;
    static baseSpeed = 0.6;
    static maxSpeed = Ball.baseSpeed * 2;
    static speed = Ball.baseSpeed;
    static timeToMaxSpeedInSeconds = 15;

    constructor(initialPosition) {
        this.initialPosition = initialPosition;
        this.radius = 1;
        this.direction = new THREE.Vector3(0.0, 0.0, -1.0).normalize();
        this.lastReflectionNormalVector = null;
        this.isLauched = false;
        this.lastReflectedObj = null;
        this.createTHREEObject();
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    setIsLaunched(isLaunched) {
        this.isLauched = isLaunched;
    }

    getTHREEObject() {
        return this.sphere;
    }

    createTHREEObject() {
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 32, 16);
        this.sphereMaterial = new THREE.MeshPhongMaterial
            ({
                color: "white",
                shininess: "200",
                specular: "rgb(255,255,255)"
            });
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.sphere.castShadow = true;
        this.sphere.receiveShadow = true;
        this.sphere.position.copy(this.initialPosition);
        this.boundingSphere = new THREE.Sphere(new THREE.Vector3().copy(this.sphere.position), this.radius);
    }

    move() {
        const distanceToTranslate = 0.1;
        for (let i = 0; i < Ball.speed * 10; i += distanceToTranslate * 10) {
            if (!game.balls.includes(this)) {
                break;
            }

            this.sphere.translateX(this.direction.x * distanceToTranslate);
            this.sphere.translateZ(this.direction.z * distanceToTranslate);

            this.updateBoundingSphere();
            this.collisionsDetection();
        }
    }

    updateBoundingSphere() {
        this.boundingSphere.center.copy(this.sphere.position);
    }

    collisionsDetection() {
        game.getWalls().forEach(wall => {
            if (wall.direction !== 'bottom') {
                this.bounceWhenCollide(wall.boundingBox);
            }
        });

        this.resetWhenCollideBottomWall();

        this.bounceWhenCollideNormal(game.getHitter().boundingSphere);

        for (let i = 0; i < game.stage.rows; i++) {
            for (let j = 0; j < game.stage.columns; j++) {
                const brick = game.getBrickArea().bricks[i][j];
                if (brick.visible)
                    this.bounceWhenCollide(brick.boundingBox, brick, game.getBrickArea());
            }
        }
    }


    bounceWhenCollide(collidedObjectBoundingBox, brick = null, brickArea = null) {
        const collisionWithBoundingBox = this.checkCollisionWithBoundingBox(collidedObjectBoundingBox);
        if (!collisionWithBoundingBox) {
            return
        }

        const normalVectorFromCollidedFace = this.getNormalVectorFromCollidedFace(collidedObjectBoundingBox);
        if (!normalVectorFromCollidedFace) {
            return;
        }

        const hasReflected = this.hasReflectedToNormalVector(normalVectorFromCollidedFace);
        if (hasReflected) {
            return;
        }

        if (this.lastReflectionNormalVector !== null && normalVectorFromCollidedFace.equals(this.lastReflectionNormalVector)) {
            return;
        }

        if (this.lastReflectedObj === collidedObjectBoundingBox) {
            return;
        }

        if (brick !== null) {
            if (brick.visible) {
                brick.setVisible(false);

                if (brickArea !== null) {
                    brickArea.checkEndGame();
                }
            } else {
                return;
            }
        }
        this.bounce(normalVectorFromCollidedFace, collidedObjectBoundingBox);
    }

    calculateCollisionNormal(sphere1, sphere2) {
        // Calcula a diferença entre os centros das esferas
        const center1 = sphere1.center;
        const center2 = sphere2.center;
        const collisionNormal = center1.clone().sub(center2);

        collisionNormal.normalize();

        return collisionNormal;
    }

    bounceWhenCollideNormal(boundingSphere) {
        const collisionWithBoundingSphere = this.checkCollisionWithBoundingSphere(boundingSphere);
        if (!collisionWithBoundingSphere) {
            return;
        }

        if (!this.isMovingDown()) {
            return;
        }

        if (this.boundingSphere.center.z > 42) {
            return;
        }

        if (this.lastReflectedObj === boundingSphere) {
            return;
        }

        // Calcula o vetor normal a superfície no ponto de colisão
        const normalVector = this.calculateCollisionNormal(this.boundingSphere, boundingSphere);
        this.bounce(normalVector, boundingSphere);
        this.fixTrajectory();
    }

    resetWhenCollideBottomWall() {
        const isCollidingBottomWall = this.checkCollisionWithBottomWall();
        if (!isCollidingBottomWall) {
            return;
        }

        if (game.balls.length > 1) {
            game.deleteBall(this);
            Brick.bricksDestroyedAtCurrentStage = 0;
        } else {
            const hitterPosition = game.getHitter().getPosition();
            const ballOverHitterPosition = this.getOverHitterPosition(hitterPosition);
            this.resetPosition(ballOverHitterPosition);
            game.deleteAllPowerUps();
        }
    }

    isMovingDown() {
        return this.direction.z > 0;
    }

    fixTrajectory() {
        const maxAngle = 160;
        const minAngle = 180 - maxAngle;
        const maxAngleRad = THREE.MathUtils.degToRad(maxAngle);
        const directionMaxAngle = Math.round(Math.sin(maxAngleRad) * -1 * 100) / 100;

        if (this.direction.z > directionMaxAngle) {
            const angle = this.direction.x < 0 ? maxAngle : minAngle;
            const angleRad = THREE.MathUtils.degToRad(angle);

            this.direction.z = Math.round(Math.sin(angleRad) * -1 * 100) / 100;
            this.direction.x = Math.round(Math.cos(angleRad) * 100) / 100;
        }
    }

    checkCollisionWithBoundingBox(boundingBox) {
        return this.boundingSphere.intersectsBox(boundingBox);
    }

    checkCollisionWithBoundingSphere(boundingSphere) {
        return this.boundingSphere.intersectsSphere(boundingSphere);
    }

    checkCollisionWithBottomWall() {
        return this.boundingSphere.intersectsBox(game.getBottomWall().getBoundingBox());
    }

    getNormalVectorFromCollidedFace(collidedObjectBoundingBox) {
        const sphereCenter = new THREE.Vector3().copy(this.sphere.position);

        const collidedObjectCenter = new THREE.Vector3();
        collidedObjectBoundingBox.getCenter(collidedObjectCenter);

        const collidedObjectSize = new THREE.Vector3();
        collidedObjectBoundingBox.getSize(collidedObjectSize);

        const collidedObjectLeftWallX = collidedObjectCenter.x - (collidedObjectSize.x / 2);
        const collidedObjectRightWallX = collidedObjectCenter.x + (collidedObjectSize.x / 2);
        const collidedObjectTopWallZ = collidedObjectCenter.z - (collidedObjectSize.z / 2);
        const collidedObjectBottomWallZ = collidedObjectCenter.z + (collidedObjectSize.z / 2);

        if (sphereCenter.z <= collidedObjectTopWallZ && this.direction.z > 0) {
            return new THREE.Vector3(0, 0, -1);
        } else if (sphereCenter.z >= collidedObjectBottomWallZ && this.direction.z < 0) {
            return new THREE.Vector3(0, 0, 1);
        } else if (sphereCenter.x <= collidedObjectLeftWallX && this.direction.x > 0) {
            return new THREE.Vector3(-1, 0, 0);
        } else if (sphereCenter.x >= collidedObjectRightWallX && this.direction.x < 0) {
            return new THREE.Vector3(1, 0, 0);
        }
    }

    hasReflectedToNormalVector(normalVector) {
        const axes = ['x', 'z'];
        let normalVectorPointingToAxis = '';

        for (let i = 0; i < axes.length; i++) {
            const axis = axes[i];

            if (normalVector[axis] !== 0) {
                normalVectorPointingToAxis = axis;
                break;
            }
        }

        const hasReflected = normalVector[normalVectorPointingToAxis] > 0 && this.direction[normalVectorPointingToAxis] > 0 ||
            normalVector[normalVectorPointingToAxis] < 0 && this.direction[normalVectorPointingToAxis] < 0

        return hasReflected;
    }

    bounce(normalVector, boundingBoxObj) {
        this.lastReflectedObj = boundingBoxObj;
        this.direction = this.direction.reflect(normalVector);
        this.lastReflectionNormalVector = normalVector;
    }

    changeNormalAngle(originalNormal, angleInRadians) {
        const newX = Math.cos(angleInRadians);
        const newZ = Math.sin(angleInRadians);
        const newY = originalNormal.getComponent(1);
        const newNormal = new THREE.Vector3(newX, newY, newZ);

        return newNormal;
    }

    getOverHitterPosition(hitterPosition) {
        const ballOverHitterPosition = new THREE.Vector3().copy(hitterPosition);
        ballOverHitterPosition.z -= 2;
        // ballOverHitterPosition.x += 2.5;

        return ballOverHitterPosition;
    }

    launch(startTimerToUpdateBallSpeedCallback) {
        this.isLauched = true;
        startTimerToUpdateBallSpeedCallback();
    }

    static updateSpeed(timePassedInMilliseconds, pausedGame, timeIntervalId) {
        if (pausedGame) {
            return;
        }

        Ball.timeIntervalId = timeIntervalId;

        Ball.timePassedFromLaunchInMilliseconds += timePassedInMilliseconds;
        const timePassedFromLaunchInSeconds = Ball.timePassedFromLaunchInMilliseconds / 1000;

        if (timePassedFromLaunchInSeconds >= Ball.timeToMaxSpeedInSeconds) {
            Ball.speed = Ball.maxSpeed;
            Ball.resetTimeIntervalToUpdateSpeed();
            return;
        }

        const timePassedPercent = timePassedFromLaunchInSeconds / Ball.timeToMaxSpeedInSeconds;
        const calculatedSpeed = Ball.baseSpeed + (timePassedPercent) * (Ball.maxSpeed - Ball.baseSpeed);
        Ball.speed = Number(calculatedSpeed.toFixed(2));
    }

    static resetTimeIntervalToUpdateSpeed() {
        if (Ball.timeIntervalId) {
            clearInterval(Ball.timeIntervalId);
            Ball.timeIntervalId = null;
        }
    }

    resetPosition(newPosition = null) {
        this.sphere.position.copy(newPosition || this.getOverHitterPosition(game.getHitter().getPosition()));
        this.updateBoundingSphere();

        this.direction = new THREE.Vector3(0.0, 0.0, -1.0).normalize();
        this.isLauched = false;
        Ball.timePassedFromLaunchInMilliseconds = 0;
        Ball.resetTimeIntervalToUpdateSpeed();

        Ball.speed = Ball.baseSpeed;
        this.lastReflectionNormalVector = null;
        this.lastReflectedObj = null;
    }
}
