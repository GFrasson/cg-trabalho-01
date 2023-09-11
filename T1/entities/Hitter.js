import * as THREE from 'three';

import { HitterSegment } from './HitterSegment.js';

export class Hitter {
    constructor() {
        // this.cubes = [];
        // this.boundingBoxes = [];
        this.colors = ["gray", "red", "yellow", "blue", "purple"];
        this.segments = [];
        this.isColliding = false;
        // this.threeObject = new THREE.Object3D();

        const startAngleInDeg = 135;
        const angleOffsetInDeg = 22.5;
        for (let i = 0; i < 5; i++) {
            // let cubeGeometry = new THREE.BoxGeometry(1.6, 2, 2);
            // let material = setDefaultMaterial(this.colors[i]);
            // let cube = new THREE.Mesh(cubeGeometry, material);
            // let boundingBox = new THREE.Box3().setFromObject(cube);
            // cube.position.set(i*1.6, 2.0, 40.0);
            // this.cubes[i] = cube;
            // this.boundingBoxes[i] = boundingBox;

            const hitterSegmentNormalAngle = startAngleInDeg - i * angleOffsetInDeg;
            console.log(hitterSegmentNormalAngle);
            const hitterSegment = new HitterSegment(this.colors[i], i * 1.6, hitterSegmentNormalAngle);
            this.segments.push(hitterSegment);
            // this.threeObject.add(hitterSegment.getTHREEObject());
        }
    }

    getTHREEObject() {
        return this.threeObject;
    }

    move(pointX) {
        for (let i = 0; i < 5; i++) {
            const hitterSegment = this.segments[i];
            hitterSegment.move(pointX + (i - 2) * 1.6);

            // hitterSegmentTHREEObject.position.set(pointX + (i - 2) * 1.6, 2.0, 40.0);
            // this.cubes[i].position.set(pointX + (i - 2) * 1.6, 2.0, 40.0);
            // this.boundingBoxes[i].setFromObject(this.cubes[i]);
        }
    }

    resetPosition() {
        this.segments.forEach(segment => {
            segment.resetPosition();
        });

        // for (let i = 0; i < 5; i++) {
            // this.cubes[i].position.set(i * 1.6, 2.0, 40.0);
            // this.boundingBoxes[i].setFromObject(this.cubes[i]);
        // }
    }
}