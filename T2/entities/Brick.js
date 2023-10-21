import * as THREE from 'three';
import { game } from '../index.js';

export class Brick {
    static bricksDestroyedAtCurrentStage = 0;
    static spawnPowerUpOnBricksDestroyed = 10;

    constructor(material, posX, posY, index, color, scene, secondColor) {
        this.id = index;
        this.scene = scene;
        this.cubeGeometry = new THREE.BoxGeometry(3.6, 2, 2);
        this.block = new THREE.Mesh(this.cubeGeometry, material);
        this.block.position.set(posX, 1.0, posY);
        this.visible = true;
        this.color = color;
        this.secondColor = secondColor;
        this.boundingBox = new THREE.Box3().setFromObject(this.block);
        this.life = 2;
        this.block.material.transparent = true;
    }

    /*
            this.collidable = false;
            game.bricksAnimateDestruction.push(this);

            Brick.bricksDestroyedAtCurrentStage += 1;

            if (
                Brick.bricksDestroyedAtCurrentStage > 0 &&
                Brick.bricksDestroyedAtCurrentStage % Brick.spawnPowerUpOnBricksDestroyed === 0
            ) {
                game.addPowerUp(this.block.position);
            }

    */

    setVisible(visible) {
        if (visible == true) {
            this.scene.add(this.block);
            this.block.material.opacity = 1;
            this.visible = true;
        } else {
            this.life -= 1;
            if (this.life <= 0) {
                this.visible = false;
                game.bricksAnimateDestruction.push(this);
                Brick.bricksDestroyedAtCurrentStage += 1;
                if (
                    Brick.bricksDestroyedAtCurrentStage > 0 &&
                    Brick.bricksDestroyedAtCurrentStage % Brick.spawnPowerUpOnBricksDestroyed === 0
                ) {
                    game.addPowerUp(this.block.position);
                }
            } else {
                this.block.material.opacity = 0.8;
                this.block.material.color.set(this.secondColor);
            }
        }
    }

    animateDestructionStep() {
        const scaleDownFactor = 0.05;

        if (
            this.block.scale.x <= scaleDownFactor ||
            this.block.scale.y <= scaleDownFactor ||
            this.block.scale.z <= scaleDownFactor
        ) {
            game.deleteBrickAnimation(this);
            game.scene.remove(this.block);
            return;
        }

        this.block.scale.set(
            this.block.scale.x -= scaleDownFactor,
            this.block.scale.y -= scaleDownFactor,
            this.block.scale.z -= scaleDownFactor,
        );
    }
}