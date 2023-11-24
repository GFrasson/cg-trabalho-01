import * as THREE from 'three';
import { PowerUp } from "./PowerUp.js";
import { Ball } from "./Ball.js";

export class AddBallsPowerUp extends PowerUp {
    constructor(initialPosition) {
        super(initialPosition);
    }

    powerUpAction() {
        Ball.addTwoBalls();
    }

    updateColor() {
        const object = this.getTHREEObject();
        object.material.color.setRGB(
            Math.abs(Math.sinh(object.position.z / 5)),
            Math.abs(Math.cos(object.position.z / 5)),
            Math.abs(Math.sin(object.position.z / 5))
        );
    }

    addTexture() {
        const object = this.getTHREEObject();
        const textureLoader = new THREE.TextureLoader();

        // const vertices = new Float32Array([
        //     -1.5, 0, -1,
        //     -1.5, 0, 1,
        //     1.5, 0, 1,
        //     1.5, 0, -1,
        // ]);
        // object.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        // const uvCoordinates = new Float32Array([
        //     0, 0,
        //     0, 1,
        //     1, 1,
        //     1, 0
        // ]);
        // object.geometry.setAttribute('uv', new THREE.BufferAttribute(uvCoordinates, 2));

        return;

        object.material.map = textureLoader.load('./assets/add-balls-power-up-texture.png');
        object.material.map.wrapS = THREE.RepeatWrapping;
        object.material.map.wrapT = THREE.RepeatWrapping;
        object.material.map.minFilter = THREE.LinearFilter;
        object.material.map.magFilter = THREE.LinearFilter;
        object.material.map.rotation = -Math.PI / 2;
    }
} 