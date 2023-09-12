import * as THREE from 'three';
import { setDefaultMaterial } from "../../libs/util/util.js";

export class HitterSegment {
    constructor(color, initialXPosition, normalVectorAngleInDeg) {
        this.color = color;
        this.initialXPosition = initialXPosition;
        this.yPosition = 1.0;
        this.zPosition = 40.0;
        this.setNormalVector(normalVectorAngleInDeg);
        this.createTHREEObject();
    }

    createTHREEObject() {
        this.cubeGeometry = new THREE.BoxGeometry(2.5, 2, 2);
        this.material = setDefaultMaterial(this.color);
        this.cube = new THREE.Mesh(this.cubeGeometry, this.material);
        this.cube.position.set(this.initialXPosition, this.yPosition, this.zPosition);
        this.boundingBox = new THREE.Box3().setFromObject(this.cube);
    }

    getTHREEObject() {
        return this.cube;
    }

    setNormalVector(normalVectorAngleInDeg) {
        const normalVectorAngleInRad = THREE.MathUtils.degToRad(normalVectorAngleInDeg);
        const normalVectorX = Math.round(Math.cos(normalVectorAngleInRad) * 100) / 100;
        const normalVectorZ = Math.round(Math.sin(normalVectorAngleInRad) * -1 * 100) / 100;
        this.normalVector = new THREE.Vector3(normalVectorX, 0.0, normalVectorZ);
    }

    move(xPosition) {
        this.cube.position.set(xPosition, this.yPosition, this.zPosition);
        this.updateBoundingBox();
    }

    resetPosition() {
        this.cube.position.set(this.initialXPosition, this.yPosition, this.zPosition);
        this.updateBoundingBox();
    }

    updateBoundingBox() {
        this.boundingBox.setFromObject(this.cube);
    }
}
