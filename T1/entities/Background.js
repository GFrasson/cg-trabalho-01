import * as THREE from 'three';
export class Background {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.enable( 0 );
        this.planeGeometry = new THREE.PlaneGeometry(50, window.innerHeight, 20, 20);
        this.planeMaterial = new THREE.MeshLambertMaterial();
        this.planeMaterial.side = THREE.DoubleSide;
        this.planeMaterial.transparent = true;
        this.planeMaterial.opacity = 0.6;
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.translateZ(6);
        this.plane.rotation.x = -Math.PI / 2; 
        this.plane.layers.set(0);  
        this.plane.material.color.set("blue"); 
    }

    onMouseMove(event, camera, hitter) {
        let pointer = new THREE.Vector2();
        const centerX = window.innerWidth / 2;
        const gameWidth = window.innerHeight * camera.aspectRatio;

        pointer.x = (event.clientX - centerX) / gameWidth * 2;
        //console.log("pointerx", pointer.x)
        this.raycaster.setFromCamera(pointer, camera.camera);
        let intersects = this.raycaster.intersectObjects([this.plane]);
        if (intersects.length > 0) 
        {
            let point = intersects[0].point;
            if(point.x > 21) {
                point.x = 21;
            }
            if(point.x < -21) {
                point.x = -21;
            }
            //console.log("point = ", point)
            hitter.move(point.x);
        }
    };

}