import * as THREE from 'three';
import {
    setDefaultMaterial
} from "../../libs/util/util.js";

import { Brick } from './Brick.js';

export class Stage {
    static totalNumberOfStages = 3;
    
    constructor(stage, scene) {
        this.scene = scene;
        this.stage = stage;
        this.colors = ["lightgray", "red", "dodgerblue", "orange", "hotpink", "chartreuse"];
        this.secondColors = ["#808080"];
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
                this.rows = 14;
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
                let initialLife = 1;
                let secondColor = null;
                if(i === 0) {
                    initialLife = 2;
                    secondColor = this.secondColors[0];
                }
                var brick = new Brick(material, coluna, linha, brickIndex++, this.colors[i], this.scene, secondColor, initialLife);
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
        var padrao = [
            [0, 3, 5, 4, 3, 5, 2, 0],
            [2, 5, 3, 1, 5, 3, 0, 2],
            [5, 4, 1, 3, 2, 0, 3, 5],
            [3, 1, 4, 5, 0, 2, 5, 3],
            [1, 3, 5, 2, 3, 5, 4, 1],
            [4, 5, 3, 0, 5, 3, 1, 4],
            [5, 2, 0, 3, 4, 1, 3, 5],
            [3, 0, 2, 5, 1, 4, 5, 3]
        ];
    
        for (var i = 0; i < this.rows; i++) {
            var coluna = -16;
            var arrayLinha = [];
            for (var j = 0; j < this.columns; j++) {
                var colorIndex = padrao[i % 8][j % 8];
                let material = new THREE.MeshLambertMaterial({ color: this.colors[colorIndex] });
    
                if (j == 4) {
                    coluna = coluna + 4;
                }
                var initialLife = 1;
                var secondColor = null;
                if(colorIndex === 0) {
                    initialLife = 2;
                    secondColor = this.secondColors[0];
                }
                var brick = new Brick(material, coluna, linha, brickIndex++, this.colors[colorIndex], this.scene, secondColor, initialLife);
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