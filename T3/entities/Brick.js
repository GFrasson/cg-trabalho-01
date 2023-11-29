import * as THREE from 'three';
import { Game } from '../Game.js';
import { PowerUp } from './PowerUp.js';

export class Brick {
    static bricksDestroyedAtCurrentStage = 0;
    static spawnPowerUpOnBricksDestroyed = 10;

    constructor(material, posX, posY, index, color, scene, secondColor, initialLife, indestructible) {
        this.id = index;
        this.scene = scene;
        this.cubeGeometry = new THREE.BoxGeometry(3.6, 2, 2);
        this.block = new THREE.Mesh(this.cubeGeometry, material);
        this.block.castShadow = true;
        this.block.receiveShadow = true;
        this.block.position.set(posX, 1.0, posY);
        this.visible = true;
        this.color = color;
        this.secondColor = secondColor;
        this.boundingBox = new THREE.Box3().setFromObject(this.block);
        this.initialLife = initialLife;
        this.life = this.initialLife;
        this.block.material.transparent = true;
        this.indestructible = indestructible;
    }

    getTHREEObject() {
        return this.block;
    }

    setVisible(visible) {
        if (visible === true) {
            if(this.indestructible === 1){
                var textureLoader = new THREE.TextureLoader();
                var brickwall = textureLoader.load('../../assets/textures/brickwall.jpg');
                let material = new THREE.MeshLambertMaterial({color: "gold"});
                this.block.material = material;
                this.block.material.map = brickwall;
                return;
            }
            this.visible = true;
            this.scene.add(this.block);
            this.block.material.opacity = 1;
            this.life = this.initialLife;
            this.block.material.color.set(this.color);
        } else {
            if(this.indestructible === 1){
                const collisionSound = document.getElementById('collisionSoundBrick2');
                collisionSound.currentTime = 0;
                collisionSound.play();
                let material = new THREE.MeshLambertMaterial({color: "gold"});
                this.block.material = material;
                return;
            }
            this.life -= 1;
            const collisionSound = document.getElementById('collisionSoundBrick1');
            collisionSound.currentTime = 0;
            collisionSound.play();
            if (this.life <= 0) {
                this.visible = false;
                Game.getInstance().bricksAnimateDestruction.push(this);

                if (!PowerUp.canIncreasePowerUpCounter()) {
                    return;
                }

                Brick.bricksDestroyedAtCurrentStage += 1;
                if (
                    Brick.bricksDestroyedAtCurrentStage > 0 &&
                    Brick.bricksDestroyedAtCurrentStage % Brick.spawnPowerUpOnBricksDestroyed === 0
                ) {
                    Game.getInstance().addPowerUp(this.block.position);
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
            Game.getInstance().deleteBrickAnimation(this);
            Game.getInstance().scene.remove(this.block);
            return;
        }

        this.block.scale.set(
            this.block.scale.x -= scaleDownFactor,
            this.block.scale.y -= scaleDownFactor,
            this.block.scale.z -= scaleDownFactor,
        );
    }
}