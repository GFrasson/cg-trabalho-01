import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';

export class Ball {
    constructor(initialPosition) {
        this.initialPosition = initialPosition;
        this.radius = 1;
        this.speed = 0.6;
        this.direction = new THREE.Vector3(1.0, 0.0, -1.0).normalize();
        this.lastReflectionNormalVector = null;
        this.isLauched = false;
        this.createTHREEObject();
    }

    getTHREEObject() {
        return this.sphere;
    }

    createTHREEObject() {
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 32, 16);
        this.sphereMaterial = setDefaultMaterial('teal');
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.sphere.position.copy(this.initialPosition);
        this.boundingSphere = new THREE.Sphere(new THREE.Vector3().copy(this.sphere.position), this.radius);
    }

    move() {
        this.sphere.translateX(this.direction.x * this.speed);
        this.sphere.translateZ(this.direction.z * this.speed);
    }

    updateBoundingSphere() {
        this.boundingSphere.center.copy(this.sphere.position);
    }

    bounceWhenCollide(collidedObjectBoundingBox, brick = null, brickArea = null) {
        const collisionWithBoundingBox = this.checkCollisionWithBoundingBox(collidedObjectBoundingBox);
        if (!collisionWithBoundingBox) {
            return
        }

        const normalVectorFromCollidedFace = this.getNormalVectorFromCollidedFace(collidedObjectBoundingBox);
        if (!normalVectorFromCollidedFace) {
            return;
        }

        const hasReflected = this.hasReflectedToNormalVector(normalVectorFromCollidedFace);
        if (hasReflected) {
            return;
        }

        if (this.lastReflectionNormalVector !== null && normalVectorFromCollidedFace.equals(this.lastReflectionNormalVector)) {
            console.log('d');
            return;
        }

        if (brick !== null) {
            if (brick.visible) {
                brick.setVisible(false);

                if (brickArea !== null) {
                    brickArea.checkEndGame();
                }
            } else {
                return;
            }
        }

        this.bounce(normalVectorFromCollidedFace);
    }

    
    bounceWhenCollideNormal(boundingBox, normalVector) {
        const collisionWithBoundingBox = this.checkCollisionWithBoundingBox(boundingBox);
        if (!collisionWithBoundingBox) {
            return;
        }

        if (!this.isMovingDown()) {
            return;
        }

        this.bounce(normalVector);
        this.fixTrajectory();       
    }

    isMovingDown() {
        return this.direction.z > 0;
    }

    fixTrajectory() {
        const maxAngle = 160;
        const minAngle = 180 - maxAngle;
        const maxAngleRad = THREE.MathUtils.degToRad(maxAngle);
        const directionMaxAngle = Math.round(Math.sin(maxAngleRad) * -1 * 100) / 100;

        if (this.direction.z > directionMaxAngle) {
            const angle = this.direction.x < 0 ? maxAngle : minAngle;
            const angleRad = THREE.MathUtils.degToRad(angle);
            
            this.direction.z = Math.round(Math.sin(angleRad) * -1 * 100) / 100;
            this.direction.x = Math.round(Math.cos(angleRad) * 100) / 100;
        }
    }

    checkCollisionWithBoundingBox(boundingBox) {
        return this.boundingSphere.intersectsBox(boundingBox);
    }

    getNormalVectorFromCollidedFace(collidedObjectBoundingBox) {
        const sphereCenter = new THREE.Vector3().copy(this.sphere.position);

        const collidedObjectCenter = new THREE.Vector3();
        collidedObjectBoundingBox.getCenter(collidedObjectCenter);

        const collidedObjectSize = new THREE.Vector3();
        collidedObjectBoundingBox.getSize(collidedObjectSize);

        const collidedObjectLeftWallX = collidedObjectCenter.x - (collidedObjectSize.x / 2);
        const collidedObjectRightWallX = collidedObjectCenter.x + (collidedObjectSize.x / 2);
        const collidedObjectTopWallZ = collidedObjectCenter.z - (collidedObjectSize.z / 2);
        const collidedObjectBottomWallZ = collidedObjectCenter.z + (collidedObjectSize.z / 2);

        if (sphereCenter.z <= collidedObjectTopWallZ && this.direction.z > 0) {
            return new THREE.Vector3(0, 0, -1);
        } else if (sphereCenter.z >= collidedObjectBottomWallZ && this.direction.z < 0) {
            return new THREE.Vector3(0, 0, 1);
        } else if (sphereCenter.x <= collidedObjectLeftWallX && this.direction.x > 0) {
            return new THREE.Vector3(-1, 0, 0);
        } else if (sphereCenter.x >= collidedObjectRightWallX && this.direction.x < 0) {
            return new THREE.Vector3(1, 0, 0);
        }
    }

    hasReflectedToNormalVector(normalVector) {
        const axes = ['x', 'z'];
        let normalVectorPointingToAxis = '';

        for (let i = 0; i < axes.length; i++) {
            const axis = axes[i];

            if (normalVector[axis] !== 0) {
                normalVectorPointingToAxis = axis;
                break;
            }
        }

        const hasReflected = normalVector[normalVectorPointingToAxis] > 0 && this.direction[normalVectorPointingToAxis] > 0 ||
            normalVector[normalVectorPointingToAxis] < 0 && this.direction[normalVectorPointingToAxis] < 0

        return hasReflected;
    }

    bounce(normalVector) {
        this.direction = this.direction.reflect(normalVector); 
        this.lastReflectionNormalVector = normalVector;
    }

    changeNormalAngle(originalNormal, angleInRadians) {
        const newX = Math.cos(angleInRadians);
        const newZ = Math.sin(angleInRadians);
        const newY = originalNormal.getComponent(1);
        const newNormal = new THREE.Vector3(newX, newY, newZ);

        return newNormal;
    }

    getOverHitterPosition(hitterPosition) {
        const ballOverHitterPosition = new THREE.Vector3().copy(hitterPosition);
        ballOverHitterPosition.z -= 2;
        ballOverHitterPosition.x += 2.5;

        return ballOverHitterPosition;
    }

    resetPosition(newPosition = null) {
        this.sphere.position.copy(newPosition || this.initialPosition);
        this.updateBoundingSphere();

        this.direction = new THREE.Vector3(1.0, 0.0, -1.0).normalize();
        this.isLauched = false;
        this.lastReflectionNormalVector = null;
    }
}
