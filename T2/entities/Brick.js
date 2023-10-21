import * as THREE from 'three';
import { PowerUp } from './PowerUp.js';
import { game } from '../index.js';

export class Brick {
    static bricksDestroyedAtCurrentStage = 0;
    static spawnPowerUpOnBricksDestroyed = 3;

    constructor(material, posX, posY, index, color, scene) {
        this.id = index;
        this.scene = scene;
        this.cubeGeometry = new THREE.BoxGeometry(3.2, 2, 2);
        this.block = new THREE.Mesh(this.cubeGeometry, material);
        this.block.position.set(posX, 1.0, posY);
        this.visible = true;
        this.color = color;
        this.boundingBox = new THREE.Box3().setFromObject(this.block);
    }

    setVisible(visible) {
        this.visible = visible;
        if(visible) {
            this.scene.add(this.block);
        }else {
            this.scene.remove(this.block);

            Brick.bricksDestroyedAtCurrentStage += 1;

            if (
                Brick.bricksDestroyedAtCurrentStage > 0 &&
                Brick.bricksDestroyedAtCurrentStage % Brick.spawnPowerUpOnBricksDestroyed === 0
            ) {
                const powerUp = new PowerUp(this.block.position);
                game.addPowerUp(powerUp);
            }
        }
    }
}