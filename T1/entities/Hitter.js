import { HitterSegment } from './HitterSegment.js';

export class Hitter {
    constructor() {
        this.colors = ["gray", "red", "yellow", "blue", "purple"];
        this.segments = [];
        this.isColliding = false;

        const startAngleInDeg = 135;
        const angleOffsetInDeg = 22.5;
        for (let i = 0; i < 5; i++) {
            const hitterSegmentNormalAngle = startAngleInDeg - i * angleOffsetInDeg;
            const hitterSegment = new HitterSegment(this.colors[i], i * 1.6 - 3.2, hitterSegmentNormalAngle);
            this.segments.push(hitterSegment);
        }
    }

    getTHREEObject() {
        return this.threeObject;
    }

    move(pointX) {
        for (let i = 0; i < 5; i++) {
            const hitterSegment = this.segments[i];
            hitterSegment.move(pointX + (i - 2) * 1.6);
        }
    }

    resetPosition() {
        this.segments.forEach(segment => {
            segment.resetPosition();
        });
    }
}