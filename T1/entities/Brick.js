import * as THREE from 'three';
export class Brick {
    constructor(material) {
        this.cubeGeometry = new THREE.BoxGeometry(3, 2, 2);
        this.block = new THREE.Mesh(this.cubeGeometry, material);
        this.width = 40.0;
        this.height = 2.0;
        this.block.position.set(3.0, this.height, this.width);
    }
}