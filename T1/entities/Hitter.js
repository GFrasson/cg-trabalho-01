import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";
export class Hitter {
    constructor(material) {
        this.cubes = [];
        this.boundingBoxes = [];
        this.colors = ["gray", "red", "yellow", "blue", "purple"];
        for(let i = 0; i < 5; i++) {
            let cubeGeometry = new THREE.BoxGeometry(1.6, 2, 2);
            let material = setDefaultMaterial(this.colors[i]);
            let cube = new THREE.Mesh(cubeGeometry, material);
            let boundingBox = new THREE.Box3().setFromObject(cube);
            cube.position.set(i*1.6 - 3.2, 1.0, 35.0);
            this.cubes[i] = cube;
            this.boundingBoxes[i] = boundingBox;
        }
    }

    move(pointX) {
        for (let i = 0; i < 5; i++) {
            this.cubes[i].position.set(pointX + (i - 2) * 1.6, 1.0, 40.0);
            let cubeAux = 
            this.boundingBoxes[i].setFromObject(this.cubes[i]);
        }
    }

    resetPosition() {
        for(let i = 0; i < 5; i++) {
            this.cubes[i].position.set(i*1.6 - 3.2, 1.0, 35.0);

            this.boundingBoxes[i].setFromObject(this.cubes[i]);
        }
    }
}