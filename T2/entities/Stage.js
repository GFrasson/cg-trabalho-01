import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";

import { Brick } from './Brick.js';

export class Stage {
    constructor(stage, scene) {
        this.scene = scene;
        this.stage = stage;
        this.colors = ["lightgray", "red", "dodgerblue", "orange", "hotpink", "chartreuse"];
        this.secondColors = ["#808080", "#B22222", "#00008B", "#DAA520", "#FF1493", "#228B22"];
        this.createConfig(stage);
    }

    createConfig(stage) {
        switch (stage) {
            case 1:
                this.columns = 11;
                this.rows = 6;
                break;
            case 2:
                this.columns = 8;
                this.rows = 15;
                break;
        
            default:
                break;
        }
    }
    
    constructStage1() {
        var brickIndex = 0;
        var linha = -38;
        var bricks = [];
        for(var i = 0; i < this.rows; i++) {
            var coluna = -20;
            var arrayLinha = [];
            for(var j = 0; j < this.columns; j++) {
                let material = new THREE.MeshLambertMaterial({color: this.colors[i]});
                var brick = new Brick(material, coluna, linha, brickIndex++, this.colors[i], this.scene, this.secondColors[i]);
                arrayLinha.push(brick);
                coluna = coluna + 4; 
            }
            bricks.push(arrayLinha);
            linha = linha + 2.3;
        }

        return bricks;
    }

    constructStage2() {
        var brickIndex = 0;
        var linha = -45;
        var bricks = [];
        for(var i = 0; i < this.rows; i++) {
            var coluna = -16;
            var arrayLinha = [];
            for(var j = 0; j < this.columns; j++) {
                var material = setDefaultMaterial(this.colors[i]);
                if(j == 4) {
                    coluna = coluna + 4;  
                }
                var brick = new Brick(material, coluna, linha, brickIndex++, this.colors[i], this.scene);
                arrayLinha.push(brick);
                coluna = coluna + 4; 
                
            }
            bricks.push(arrayLinha);
            linha = linha + 2.3;
        }
        return bricks;
    }

    constructStage() {
        switch (this.stage) {
            case 1:
                return this.constructStage1();
                break;
            case 2:
                return this.constructStage2();
                break;
            default:
                return [];
                break;
        }
    }
}