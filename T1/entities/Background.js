import * as THREE from 'three';
export class Background {
    constructor() {
        const windowWidth = window.innerWidth;
        this.gameWidth = window.innerHeight * 0.5;
        this.offsetX = (windowWidth - this.gameWidth) / 2;
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
        let pointer = new THREE.Vector2();
        pointer.x = ((event.clientX - this.offsetX) / this.gameWidth) * 2 - 1;
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