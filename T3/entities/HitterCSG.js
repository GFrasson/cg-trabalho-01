import { CSG } from '../../libs/other/CSGMesh.js'    
import * as THREE from  'three'; 
import {initRenderer, 
    setDefaultMaterial,
    getMaxSize
} from "../../libs/util/util.js";
import {GLTFLoader} from '../../build/jsm/loaders/GLTFLoader.js';

export class HitterCSG {
    constructor(scene) {
        this.auxMat = new THREE.Matrix4();
        this.material1 = setDefaultMaterial();
        this.cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 16), this.material1)
        this.cylinderMesh = new THREE.Mesh( new THREE.CylinderGeometry(8, 8, 2, 100))
        this.hitterMesh;
        this.csgObject;
        this.cubeCSG;
        this.cylinderCSG;

        // cubeMesh.position.set(0, 0, 0)
        //scene.add(cubeMesh)
        this.cylinderMesh.position.set(7, -0.1, 0.0)
        this.cylinderMesh.matrixAutoUpdate = false;
        this.cylinderMesh.updateMatrix();
        //scene.add(cylinderMesh)
        this.cylinderCSG = CSG.fromMesh(this.cylinderMesh)
        this.cubeCSG = CSG.fromMesh(this.cubeMesh)   
        this.csgObject = this.cubeCSG.intersect(this.cylinderCSG) // Execute intersection
        this.hitterMesh = CSG.toMesh(this.csgObject, this.auxMat)
        this.hitterMesh.material = new THREE.MeshLambertMaterial({color: "#5FA1AD"});
        this.hitterMesh.position.set(0, 0, 2.0)
        this.hitterMesh.rotation.y = Math.PI / -2;
        this.hitterMesh.position.set(0, 1, 40)
        this.hitterMesh.castShadow = true;
        this.hitterMesh.receiveShadow = true;

        this.sphereGeometry = new THREE.SphereGeometry(8, 32, 16);
        this.sphereMaterial = setDefaultMaterial('red');
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.sphere.position.set(0, 1, 47)
        this.boundingSphere = new THREE.Sphere(new THREE.Vector3().copy(this.sphere.position), 8);

        //this.sphere.material.opacity = 0.5;
        this.sphere.material.opacity = 0;
        this.sphere.material.transparent = true;
        // scene.add(hitterMesh)
        // scene.add(sphere)
        
        let asset = {
            object: null,
            loaded: false,
            bb: new THREE.Box3()
        }
        this.loadGLBFile(asset, './assets/lego_spacecraft.glb', 8.0, scene);
    }

    loadGLBFile(asset, file, desiredScale, scene)
    {
        let loader = new GLTFLoader( );
        let self = this;
        loader.load( file, function ( gltf ) {
            let obj = gltf.scene;
            obj.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
            });
            obj = self.normalizeAndRescaleAsset(obj, desiredScale);
            obj = self.fixPositionAsset(obj);
            obj.updateMatrixWorld( true )
            scene.add(obj);

            // Store loaded gltf in our js object
            asset.object = gltf.scene;
            self.assetObj = asset.object;
        }, null, null);
    }

    normalizeAndRescaleAsset(obj, newScale)
    {
        var scale = getMaxSize(obj); // Available in 'utils.js'
        obj.scale.set(newScale * (1.0/scale),
                        newScale * (1.0/scale),
                        newScale * (1.0/scale));
        return obj;
    }

    fixPositionAsset(obj)
    {
        var box = new THREE.Box3().setFromObject( obj );
        obj.rotation.y += Math.PI / 90;
        obj.position.set(0, -8, 47)
        if(box > 0)
            obj.translateY(-box.min.y);
        else
            obj.translateY(-1*box.min.y);
        return obj;
    }

    getPosition() {
        return this.hitterMesh.position;
    }

    getBoundingSphere() {
        return this.boundingSphere;
    }

    move(pointX) {
        this.hitterMesh.position.set(pointX, 1, 40);
        this.sphere.position.set(pointX, 1, 47)
        this.assetObj.position.set(pointX, -8, 47)
        this.updateBoundingBox();
    }

    resetPosition() {
       this.hitterMesh.position.set(0, 1, 40)
       this.sphere.position.set(0, 1, 46.5)
       this.updateBoundingBox();
    }

    updateBoundingBox() {
        this.boundingSphere.center.copy(this.sphere.position);
    }
}