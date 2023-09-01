import * as THREE from 'three';

export class Ball {
    constructor(material) {
        this.sphereGeometry = new THREE.SphereGeometry(2, 32, 16);
        this.sphere = new THREE.Mesh(this.sphereGeometry, material);
        this.sphere.position.set(0.0, 2.0, 0.0);
    }
}
