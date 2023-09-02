import * as THREE from 'three';

export class Camera {
    constructor() {
        this.initialPosition = new THREE.Vector3(0, 100, 0);

        this.orthoSize = 100;
        this.aspectRatio = 1 / 2;

        this.right = this.orthoSize * this.aspectRatio / 2;
        this.left = -this.orthoSize * this.aspectRatio / 2;
        this.top =  this.orthoSize / 2;
        this.bottom = -this.orthoSize / 2;
        this.near = 0.1;
        this.far = 1000;

        this.camera = new THREE.OrthographicCamera(this.left, this.right, this.top, this.bottom, this.near, this.far);
        this.camera.position.copy(this.initialPosition);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        
        this.camera.layers.enable( 0 );
    }

    getTHREECamera() {
        return this.camera;
    }

    onWindowResize(renderer, rendererWidth, rendererHeight) {
        this.camera.left = this.left;
        this.camera.right = this.right;
        this.camera.top = this.top;
        this.camera.bottom = this.bottom;

        this.camera.updateProjectionMatrix();
        renderer.setSize(rendererWidth, rendererHeight);
    }
}
