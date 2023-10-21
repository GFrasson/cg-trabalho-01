import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";
export class Brick {
    constructor(material, posX, posY, index, color, scene, secondColor) {
        this.id = index;
        this.scene = scene;
        this.cubeGeometry = new THREE.BoxGeometry(3.6, 2, 2);
        this.block = new THREE.Mesh(this.cubeGeometry, material);
        this.block.position.set(posX, 1.0, posY);
        this.visible = true;
        this.color = color;
        this.secondColor = secondColor;
        this.boundingBox = new THREE.Box3().setFromObject(this.block);        
        this.life = 2;
        this.block.material.transparent = true;
    }

    setVisible(visible) {
        if(visible == true) {
            this.scene.add(this.block);
            this.block.material.opacity = 1;
            this.visible = true;
        }else {
            this.life -= 1;
            if(this.life <= 0) {
                this.visible = false;
                this.scene.remove(this.block);
            }else {
                this.block.material.opacity = 0.8;
                this.block.material.color.set(this.secondColor);
            }
        }
    }
}