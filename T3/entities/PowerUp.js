import * as THREE from 'three';
import { game } from '../index.js';

export class PowerUp {
    constructor(initialPosition) {
        this.initialPosition = initialPosition;
        this.direction = new THREE.Vector3(0, 0, 1).normalize();
        this.speed = 0.4;

        this.createTHREEObject();
    }

    createTHREEObject() {
        this.capsuleGeometry = new THREE.CapsuleGeometry(1, 3, 4, 20);
        this.capsuleMaterial = new THREE.MeshPhongMaterial({
            color: "#2E8B57",
            shininess: "200",
            specular: "rgb(255, 255, 255)"
        });
        this.capsule = new THREE.Mesh(this.capsuleGeometry, this.capsuleMaterial);
        this.capsule.castShadow = true;
        this.capsule.receiveShadow = true;
        this.capsule.rotateZ(Math.PI / 2);
        this.capsule.position.copy(this.initialPosition);
        this.boundingBox = new THREE.Box3().setFromObject(this.capsule);
    }

    getTHREEObject() {
        return this.capsule;
    }
    
    move() {
        this.capsule.translateZ(this.direction.z * this.speed);
        this.capsule.material.color.setRGB(
            Math.abs(Math.sinh(this.capsule.position.z / 5)),
            Math.abs(Math.cos(this.capsule.position.z / 5)),
            Math.abs(Math.sin(this.capsule.position.z / 5))
        );
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
        game.duplicateBall();
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
}