import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";

import { Brick } from './Brick.js';

export class BrickArea {
    constructor(scene) {
        let brickIndex = 0;
        this.noBricks = false;
        this.colors = ["gray", "red", "yellow", "blue", "purple", "green"];
        this.bricks = [];
        this.scene = scene;
        let linha = -38;
        for(let i = 0; i < 6; i++) {
            let material = setDefaultMaterial(this.colors[i]);
            let coluna = -21;
            let arrayLinha = [];
            for(let j = 0; j < 13; j++) {
                let brick = new Brick(material, coluna, linha, brickIndex++, this.colors[i], this.scene);
                arrayLinha.push(brick);
                coluna = coluna + 3.5; 
            }
            this.bricks.push(arrayLinha);
            linha = linha + 2.3;
        }
    }

    buildBrickArea(scene) {
        for(let i = 0; i < 6; i++) {
            for(let j = 0; j < 13; j++) {
                scene.add(this.bricks[i][j].block);
            } 
        }
    }
    
    resetBrickArea() {
        for(let i = 0; i < 6; i++) {
            for(let j = 0; j < 13; j++) {
                this.bricks[i][j].setVisible(true);
            }
        }
        this.noBricks = false;
    }

    checkEndGame() {
        let endGame = true;
        for(let i = 0; i < 6; i++) {
            for(let j = 0; j < 13; j++) {
                if(this.bricks[i][j].visible === true) {
                    endGame = false;
                    break;
                }
            }
            if(endGame === false) {
                break;
            }
        }
        if(endGame === true) {
            this.noBricks = true;
        }
    }



}