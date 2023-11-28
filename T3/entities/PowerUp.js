import * as THREE from 'three';
import { game } from '../index.js';
import { Ball } from './Ball.js';

export class PowerUp {
    static lastPowerUpSpawned = null;

    constructor(initialPosition, textureFilePath) {
        this.initialPosition = initialPosition;
        this.textureFilePath = textureFilePath;
        this.direction = new THREE.Vector3(0, 0, 1).normalize();
        this.speed = 0.4;

        this.createTHREEObject();
    }

    createTHREEObject() {
        this.capsuleGeometry = new THREE.CapsuleGeometry(1, 3, 4, 20);
        this.capsuleMaterial = new THREE.MeshLambertMaterial({
            color: "white",
        });
        this.capsule = new THREE.Mesh(this.capsuleGeometry, this.capsuleMaterial);
        this.capsule.castShadow = true;
        this.capsule.receiveShadow = true;
        this.capsule.rotateZ(Math.PI / 2);
        this.capsule.position.copy(this.initialPosition);
        this.addTexture();
        this.boundingBox = new THREE.Box3().setFromObject(this.capsule);
    }

    getTHREEObject() {
        return this.capsule;
    }
    
    move() {
        this.capsule.position.z += this.direction.z * this.speed;
        this.capsule.rotateY(-0.1);        
        this.updateColor();
        this.updateBoundingBox();
        this.collisionsDetection();
    }
    
    updateBoundingBox() {
        this.boundingBox.setFromObject(this.capsule);
    }

    collisionsDetection() {
        this.collectPowerUpWhenCollideHitter();
        this.destroyPowerUpWhenCollideBottomWall();
    }

    collectPowerUpWhenCollideHitter() {
        const isCollidingWithHitter = this.checkCollisionWithHitter();
        if (!isCollidingWithHitter) {
            return;
        }

        this.collect();
    }

    collect() {
        game.deletePowerUp(this);
        this.powerUpAction();
    }

    destroyPowerUpWhenCollideBottomWall() {
        const isCollidingBottomWall = this.checkCollisionWithBottomWall();
        if (!isCollidingBottomWall) {
            return;
        }

        game.deletePowerUp(this);
    }

    checkCollisionWithHitter() {
        return this.boundingBox.intersectsSphere(game.getHitter().getBoundingSphere());
    }

    checkCollisionWithBottomWall() {
        return this.boundingBox.intersectsBox(game.getBottomWall().getBoundingBox());
    }

    static canIncreasePowerUpCounter() {
        return game.balls.length === 1 && !Ball.isDrillMode;
    }

    addTexture() {
        const object = this.getTHREEObject();
        const textureLoader = new THREE.TextureLoader();
        
        object.material.map = textureLoader.load(this.textureFilePath);
        object.material.map.wrapS = THREE.RepeatWrapping;
        object.material.map.wrapT = THREE.RepeatWrapping;
        object.material.map.minFilter = THREE.LinearFilter;
        object.material.map.magFilter = THREE.LinearFilter;
        object.material.map.rotation = -Math.PI / 2;
        object.material.map.repeat.set(9, 1);
    }

    updateColor() {}

    powerUpAction() {}
}