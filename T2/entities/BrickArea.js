import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";

import { Brick } from './Brick.js';

export class BrickArea {
    constructor(scene, stage) {
        let brickIndex = 0;
        this.noBricks = false;
        this.bricks = [];
        this.scene = scene;
        this.stage = stage;
    }

    buildBrickArea(scene) {
        this.bricks = this.stage.constructStage();
        for(let i = 0; i < this.stage.rows; i++) {
            for(let j = 0; j < this.stage.columns; j++) {
                scene.add(this.bricks[i][j].block);
            } 
        }
    }
    
    resetBrickArea() {
        for(let i = 0; i < this.stage.rows; i++) {
            for(let j = 0; j < this.stage.columns; j++) {
                this.bricks[i][j].setVisible(true);
            }
        }
        this.noBricks = false;
    }

    checkEndGame() {
        let endGame = true;
        for(let i = 0; i < this.stage.rows; i++) {
            for(let j = 0; j < this.stage.columns; j++) {
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