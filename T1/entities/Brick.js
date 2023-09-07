import * as THREE from 'three';
export class Brick {
    constructor(material, posX, posY, index) {
        this.id = index;
        this.cubeGeometry = new THREE.BoxGeometry(3.2, 2, 2);
        this.block = new THREE.Mesh(this.cubeGeometry, material);
        this.block.position.set(posX, 2.0, posY);
        this.visible = true;
    }

    setVisible(visible) {
        this.visible = visible;
        if(visible) {
            this.block.material.transparent = false;
            this.block.material.opacity = 1;
        }else {
            this.block.material.transparent = true;
            this.block.material.opacity = 0;
        }
    }
}