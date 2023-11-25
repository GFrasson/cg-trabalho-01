import * as THREE from 'three';
export class Background {
    constructor(scene) {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.enable(0);
        this.createTHREEObject();
        this.createSkyBox(scene);
    }

    createTHREEObject() {
        this.planeGeometry = new THREE.PlaneGeometry(50, window.innerHeight, 20, 20);
        this.planeMaterial = new THREE.MeshLambertMaterial({color: 'red'});
        this.planeMaterial.side = THREE.DoubleSide;
        this.planeMaterial.transparent = true;
        this.planeMaterial.opacity = 0;
        this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.plane.translateZ(6);
        this.plane.translateY(-0.5);
        this.plane.rotation.x = -Math.PI / 2;
        this.plane.layers.set(0);
        this.plane.receiveShadow = true;
    }

    getTHREEObject() {
        return this.plane;
    }

    onMouseMove(event, camera, hitter) {
        let windowWidth = window.innerWidth;
        let gameWidth = window.innerHeight * 0.5;
        let offsetX = (windowWidth - gameWidth) / 2;

        let pointer = new THREE.Vector2();
        pointer.x = ((event.clientX - offsetX) / gameWidth) * 2 - 1;
        this.raycaster.setFromCamera(pointer, camera.camera);
        let intersects = this.raycaster.intersectObjects([this.plane]);
        if (intersects.length > 0) {
            let point = intersects[0].point;
            if (point.x > 16.7) {
                point.x = 16.7;
            }
            if (point.x < -16.7) {
                point.x = -16.7;
            }
            hitter.move(point.x);
        }
    };

    createSkyBox(scene) {
        const materialArray = this.createMaterialArray("space");
        this.skyboxGeo = new THREE.BoxGeometry(50, 50, 50);
        this.skybox = new THREE.Mesh(this.skyboxGeo, materialArray);
        this.skybox.position.set(0, -2, 0.0)
        // this.skybox.rotation.x += 0.005;
        // this.skybox.rotation.y += 0.005;
        scene.add(this.skybox);
    }

    createPathStrings(filename) {
        const basePath = "./assets/skybox/";
        const baseFilename = basePath + filename;
        const fileType = ".png";
        const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
        const pathStings = sides.map(side => {
            return baseFilename + "_" + side + fileType;
        });
        return pathStings;
    }

    createMaterialArray(filename) {
        const skyboxImagepaths = this.createPathStrings(filename);
        const materialArray = skyboxImagepaths.map(image => {
            let texture = new THREE.TextureLoader().load(image);
            return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        });
        return materialArray;
    }

}