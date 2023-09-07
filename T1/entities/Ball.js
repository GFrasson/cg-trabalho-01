import * as THREE from 'three';
import { setDefaultMaterial } from '../../libs/util/util.js';

export class Ball {
    constructor() {
        this.radius = 1;
        this.speed = 0.8;
        this.direction = new THREE.Vector3(1.0, 0.0, -1.0);
        this.lastReflectionNormalVector = null;
        this.createTHREEObject();
    }

    getTHREEObject() {
        return this.sphere;
    }

    createTHREEObject() {
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 32, 16);
        this.sphereMaterial = setDefaultMaterial('teal');
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.sphere.position.set(0.0, 1.0, 0.0);
        this.boundingSphere = new THREE.Sphere(new THREE.Vector3().copy(this.sphere.position), this.radius);        
    }

    move() {
        this.sphere.translateX(this.direction.x * this.speed);
        this.sphere.translateZ(this.direction.z * this.speed);
    }

    updateBoundingSphere() {
        this.boundingSphere.center.copy(this.sphere.position);
    }

    bounceWhenCollideNormal(boundingBox, normalVector) {
        const collisionWithBoundingBox = this.checkCollisionWithBoundingBox(boundingBox);
        if (!collisionWithBoundingBox) {
            return;
        }

        this.bounce(normalVector);
    }

    bounceWhenCollide(collidedObjectBoundingBox) {
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
            return;
        }

        this.bounce(normalVectorFromCollidedFace);
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

        if (sphereCenter.x <= collidedObjectLeftWallX && this.direction.x > 0) {
            return new THREE.Vector3(-1, 0, 0);
        } else if (sphereCenter.x >= collidedObjectRightWallX && this.direction.x < 0) {
            return new THREE.Vector3(1, 0, 0);
        } else if (sphereCenter.z <= collidedObjectTopWallZ && this.direction.z > 0) {
            return new THREE.Vector3(0, 0, -1);
        } else if (sphereCenter.z >= collidedObjectBottomWallZ && this.direction.z < 0) {
            return new THREE.Vector3(0, 0, 1);
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
}
