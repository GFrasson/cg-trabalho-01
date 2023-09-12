import * as THREE from 'three';
export class Background {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.enable( 0 );
        this.planeGeometry = new THREE.PlaneGeometry(50, window.innerHeight, 20, 20);
        this.planeMaterial = new THREE.MeshLambertMaterial();
        this.planeMaterial.side = THREE.DoubleSide;
        this.planeMaterial.transparent = true;
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.translateZ(6);
        this.plane.rotation.x = -Math.PI / 2; 
        this.plane.layers.set(0);  
    }

    onMouseMove(event, camera, hitter) {
        let windowWidth = window.innerWidth;
        let gameWidth = window.innerHeight * 0.5;
        let offsetX = (windowWidth - gameWidth) / 2;

        let pointer = new THREE.Vector2();
        pointer.x = ((event.clientX - offsetX) / gameWidth) * 2 - 1;
        this.raycaster.setFromCamera(pointer, camera.camera);
        let intersects = this.raycaster.intersectObjects([this.plane]);
        if (intersects.length > 0) 
        {
            let point = intersects[0].point;
            if(point.x > 19) {
                point.x = 19;
            }
            if(point.x < -19) {
                point.x = -19;
            }
            hitter.move(point.x);
        }
    };

}