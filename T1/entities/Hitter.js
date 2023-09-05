import * as THREE from 'three';
export class Hitter {
    constructor(material) {
        this.cubeGeometry = new THREE.BoxGeometry(8, 2, 2);
        this.cube = new THREE.Mesh(this.cubeGeometry, material);
        this.width = 40.0;
        this.height = 2.0;
        this.cube.position.set(0.0, this.height, this.width);
    }

    move(pointX) {
        this.cube.position.set(pointX, this.height, this.width);
        //console.log("this.cube.position = ", this.cube.position)
    }
}