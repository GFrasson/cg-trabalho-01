import { CSG } from '../../libs/other/CSGMesh.js'    
import * as THREE from  'three'; 
import {initRenderer, 
    setDefaultMaterial,
} from "../../libs/util/util.js";

export class HitterCSG {
    constructor(scene) {
        this.auxMat = new THREE.Matrix4();
        this.material1 = setDefaultMaterial();
        this.cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 16), this.material1)
        this.cylinderMesh = new THREE.Mesh( new THREE.CylinderGeometry(8, 8, 2, 100))
        this.hitterMesh;
        this.csgObject;
        this.cubeCSG;
        this.cylinderCSG;

        // cubeMesh.position.set(0, 0, 0)
        //scene.add(cubeMesh)
        this.cylinderMesh.position.set(7, -0.1, 0.0)
        this.cylinderMesh.matrixAutoUpdate = false;
        this.cylinderMesh.updateMatrix();
        //scene.add(cylinderMesh)
        this.cylinderCSG = CSG.fromMesh(this.cylinderMesh)
        this.cubeCSG = CSG.fromMesh(this.cubeMesh)   
        this.csgObject = this.cubeCSG.intersect(this.cylinderCSG) // Execute intersection
        this.hitterMesh = CSG.toMesh(this.csgObject, this.auxMat)
        this.hitterMesh.material = new THREE.MeshPhongMaterial({color: 'red'})
        this.hitterMesh.position.set(0, 0, 2.0)
        this.hitterMesh.rotation.y = Math.PI / -2;
        this.hitterMesh.position.set(0, 2, 40)

        this.boundingSphere = new THREE.Sphere(new THREE.Vector3().copy(this.hitterMesh.position), 8);
        this.sphereGeometry = new THREE.SphereGeometry(8, 32, 16);
        this.sphereMaterial = setDefaultMaterial('red');
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.sphere.position.set(0, 2, 47)
        //this.sphere.material.opacity = 0.5;
        this.sphere.material.opacity = 0;
        this.sphere.material.transparent = true;
        // scene.add(hitterMesh)
        // scene.add(sphere)
    }

    getPosition() {
        return this.hitterMesh.position;
    }

    move(pointX) {
        this.hitterMesh.position.set(pointX, 2, 40);
        this.sphere.position.set(pointX, 2, 47)
        this.updateBoundingBox();
    }

    resetPosition() {
       this.hitterMesh.position.set(0, 2, 40)
    }

    updateBoundingBox() {
        this.boundingSphere.center.copy(this.sphere.position);
    }
}