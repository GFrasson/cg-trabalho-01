import * as THREE from 'three';

export class Camera {
    constructor() {
        this.initialPosition = new THREE.Vector3(0, 110, 0);
        this.lookAt = new THREE.Vector3(0, 0, 0);

        this.aspectRatio = 1 / 2;
        this.near = 0.1;
        this.far = 500;
        this.fov = 49;

        this.camera = new THREE.PerspectiveCamera(this.fov, this.aspectRatio, this.near, this.far);
        this.camera.position.copy(this.initialPosition);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        
        this.camera.layers.enable(0);
    }

    getTHREECamera() {
        return this.camera;
    }

    onWindowResize(renderer, rendererWidth, rendererHeight) {
        this.camera.updateProjectionMatrix();
        renderer.setSize(rendererWidth, rendererHeight);
    }
}
