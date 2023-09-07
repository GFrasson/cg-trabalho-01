import * as THREE from 'three';
export class Hitter {
    constructor(material) {
        this.cubeGeometry = new THREE.BoxGeometry(8, 2, 2);
        this.cube = new THREE.Mesh(this.cubeGeometry, material);
        this.width = 40.0;
        this.height = 2.0;
        this.cube.position.set(0.0, this.height, this.width);
        this.boundingBox = new THREE.Box3().setFromObject(this.cube);
    }

    move(pointX) {
        this.cube.position.set(pointX, this.height, this.width);
        this.boundingBox.setFromObject(this.cube);
    }

    resetPosition() {
        this.cube.position.set(0.0, this.height, this.width);
    }
}