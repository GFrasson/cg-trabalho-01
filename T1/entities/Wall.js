import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';

export class Wall {
    constructor(width, height, depth, position) {
        this.width = width;
        this.height = height,
        this.depth = depth;
        this.position = position;
        
        this.createTHREEObject();
    }

    getTHREEObject() {
        return this.box;
    }

    createTHREEObject() {
        this.boxGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        this.boxMaterial = setDefaultMaterial('gray');
        this.box = new THREE.Mesh(this.boxGeometry, this.boxMaterial);
        this.box.position.copy(this.position);

        this.boundingBox = new THREE.Box3().setFromObject(this.box);
    }

    static createLeftWall() {
        return new Wall(2, 2, 100, new THREE.Vector3(-24, 1, 0));
    }

    static createRightWall() {
        return new Wall(2, 2, 100, new THREE.Vector3(24, 1, 0));
    }

    static createTopWall() {
        return new Wall(50, 2, 2, new THREE.Vector3(0, 1, -49));
    }
}
