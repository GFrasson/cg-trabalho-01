import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";
export class BrickArea {
    constructor() {
        const material = setDefaultMaterial("green"); 
        this.cubeGeometry = new THREE.BoxGeometry(46, 2, 18);
        this.blockArea = new THREE.Mesh(this.cubeGeometry, material);
        this.blockArea.position.set(0.0, 2.0, -30);
    }
}