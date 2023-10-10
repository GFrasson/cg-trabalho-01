import { CSG } from '../../libs/other/CSGMesh.js'    
import * as THREE from  'three'; 
import {initRenderer, 
    setDefaultMaterial,
} from "../../libs/util/util.js";

export class HitterCSG {
    constructor(scene) {
        let auxMat = new THREE.Matrix4();
        let material1 = setDefaultMaterial();
        let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 12), material1)
        let cylinderMesh = new THREE.Mesh( new THREE.CylinderGeometry(6, 6, 2, 20))
        let hitterMesh;
        let csgObject, cubeCSG, cylinderCSG

        // cubeMesh.position.set(0, 0, 0)
        scene.add(cubeMesh)
        cylinderMesh.position.set(4, -0.5, 0.0)
        cylinderMesh.matrixAutoUpdate = false;
        cylinderMesh.updateMatrix();
        scene.add(cylinderMesh)
        cylinderCSG = CSG.fromMesh(cylinderMesh)
        cubeCSG = CSG.fromMesh(cubeMesh)   
        csgObject = cubeCSG.intersect(cylinderCSG) // Execute intersection
        hitterMesh = CSG.toMesh(csgObject, auxMat)
        hitterMesh.material = new THREE.MeshPhongMaterial({color: 'red'})
        hitterMesh.position.set(0, 0, 2.0)
        hitterMesh.rotation.y = Math.PI / -2;
        hitterMesh.position.set(0, 2, 0.0)
        //scene.add(hitterMesh)
    }

    // getPosition() {
    //     return this.segments[2].getTHREEObject().position;
    // }

    // move(pointX) {
    //     for (let i = 0; i < 5; i++) {
    //         const hitterSegment = this.segments[i];
    //         hitterSegment.move(pointX + (i - 2) * 2.5);
    //     }
    // }

    // resetPosition() {
    //     this.segments.forEach(segment => {
    //         segment.resetPosition();
    //     });
    // }
}