import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";
export class Brick {
    constructor(material, posX, posY, index, color, scene) {
        this.id = index;
        this.scene = scene;
        this.cubeGeometry = new THREE.BoxGeometry(3.2, 2, 2);
        this.block = new THREE.Mesh(this.cubeGeometry, material);
        this.block.position.set(posX, 1.0, posY);
        this.visible = true;
        this.color = color;
        this.boundingBox = new THREE.Box3().setFromObject(this.block);        
    }

    setVisible(visible) {
        this.visible = visible;
        if(visible) {
            this.scene.add(this.block);
        }else {
            this.scene.remove(this.block);
        }
    }
}