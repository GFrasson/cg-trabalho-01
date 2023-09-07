import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";
export class Brick {
    constructor(material, posX, posY, index, color) {
        this.id = index;
        this.cubeGeometry = new THREE.BoxGeometry(3.2, 2, 2);
        this.block = new THREE.Mesh(this.cubeGeometry, material);
        this.block.position.set(posX, 2.0, posY);
        this.visible = true;
        this.color = color;
        this.boundingBox = new THREE.Box3().setFromObject(this.block);        
    }

    setVisible(visible) {
        this.visible = visible;
        if(visible) {
            let material = setDefaultMaterial(this.color);
            material.opacity = 1;
            material.transparent = false;
            this.block.material = material;
            this.block.material = material;
        }else {
            let material = setDefaultMaterial();
            material.opacity = 0;
            material.transparent = true;
            this.block.material = material;
            this.block.material = material;
        }
    }
}