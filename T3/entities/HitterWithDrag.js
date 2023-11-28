import { CSG } from '../../libs/other/CSGMesh.js'
import * as THREE from 'three';
import {
    initRenderer,
    setDefaultMaterial,
    getMaxSize
} from "../../libs/util/util.js";
import { DragControls } from '../../build/jsm/controls/DragControls.js'
import { GLTFLoader } from '../../build/jsm/loaders/GLTFLoader.js';

export class HitterWithDrag {
    constructor(scene, camera, renderer) {
        this.auxMat = new THREE.Matrix4();
        this.material1 = setDefaultMaterial();
        this.cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 16), this.material1)
        this.cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 2, 100))
        this.hitterMesh;
        this.csgObject;
        this.cubeCSG;
        this.cylinderCSG;

        this.cylinderMesh.position.set(7, -0.1, 0.0)
        this.cylinderMesh.matrixAutoUpdate = false;
        this.cylinderMesh.updateMatrix();

        this.cylinderCSG = CSG.fromMesh(this.cylinderMesh)
        this.cubeCSG = CSG.fromMesh(this.cubeMesh)
        this.csgObject = this.cubeCSG.intersect(this.cylinderCSG)
        this.hitterMesh = CSG.toMesh(this.csgObject, this.auxMat)

     
        this.texture = new THREE.TextureLoader().load('../../assets/textures/displacement/Stylized_blocks_001_roughness.jpg');
        
        this.constructTexture(scene);

        this.hitterMesh.material = new THREE.MeshPhongMaterial({
            color: "#5FA1AD",
            shininess: "10",
            specular: "rgb(255, 255, 255)"
        });

        this.hitterMesh.position.set(0, 0, 2.0)
        this.hitterMesh.rotation.y = Math.PI / -2;
        this.hitterMesh.position.set(0, 1, 40)
        this.hitterMesh.castShadow = true;
        this.hitterMesh.receiveShadow = true;

        this.sphereGeometry = new THREE.SphereGeometry(8, 32, 16);
        this.sphereMaterial = setDefaultMaterial('gray');
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
        this.sphere.position.set(0, 1, 47)
        this.boundingSphere = new THREE.Sphere(new THREE.Vector3().copy(this.sphere.position), 8);
        this.sphere.material.opacity = 0.3;
        this.sphere.material.transparent = true;

        let asset = {
            object: null,
            loaded: false,
            bb: new THREE.Box3()
        }
        this.loadGLBFile(asset, './assets/lego_spacecraft.glb', 8.0, scene);

        this.dragControl = new DragControls([this.sphere], camera, renderer.domElement);
        var self = this;
        this.dragControl.addEventListener('drag', function (event) {
            var posX = event.object.position.x;
            if (posX > 16.7) {
                posX = 16.7;
            }
            if (posX < -16.7) {
                posX = -16.7;
            }
            self.move(posX);
        });
    }

    constructTexture(scene) {
        let v = [
            -7.5, -2.0, 0.0, // 0
            -6.0, -0.5, 0.0, // 1
            -4.5, 0.5, 0.0,  // 2 
            -2.5, 1.5, 0.0,  // 3 
            -1.0,  2.0, 0.0, // 4 
             0.0, -2.0, 0.0, // 5 MEIO
             1.0,  2.0, 0.0, // 6 
             2.5,  1.5, 0.0, // 7 
             4.5,  0.5, 0.0, // 8 
             6.0, -0.5, 0.0, // 9
             7.5, -2.0, 0.0, // 10 
            ];
               
          
            // Create the triangular faces
            // In this example we have 3 triangular faces
            let f =  [
              0, 1, 5,
              1, 2, 5,
              2, 3, 5,
              3, 4 ,5,
              4, 6, 5,
              6, 7, 5,
              7, 8, 5,
              8, 9, 5,
              9, 10, 5, 
            ];
          
            const n = v;
          
            var vertices = new Float32Array( v );
            var normals = new Float32Array( n );  
            var indices = new Uint32Array( f );

            let geometry = new THREE.BufferGeometry();
          
            geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) ); 
            geometry.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) ); 
            geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
            geometry.computeVertexNormals(); 
          
            let material = new THREE.MeshPhongMaterial({color:"rgb(255,255,255)"});
            material.side =  THREE.DoubleSide; 
            material.flatShading = true;
            const mesh = new THREE.Mesh( geometry, material );
            mesh.rotation.x = Math.PI / -2;
            mesh.position.set(0, 2, 40)
            this.setTexture(mesh);
            scene.add(mesh);
gi
    }

    loadGLBFile(asset, file, desiredScale, scene) {
        let loader = new GLTFLoader();
        let self = this;
        loader.load(file, function (gltf) {
            let obj = gltf.scene;
            obj.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            obj = self.normalizeAndRescaleAsset(obj, desiredScale);
            obj = self.fixPositionAsset(obj);
            obj.updateMatrixWorld(true)
            scene.add(obj);

            asset.object = gltf.scene;
            self.assetObj = asset.object;
        }, null, null);
    }

    normalizeAndRescaleAsset(obj, newScale) {
        var scale = getMaxSize(obj);
        obj.scale.set(newScale * (1.0 / scale),
            newScale * (1.0 / scale),
            newScale * (1.0 / scale));
        return obj;
    }

    fixPositionAsset(obj) {
        var box = new THREE.Box3().setFromObject(obj);
        obj.rotation.y += Math.PI / 90;
        obj.position.set(0, 0, 47)
        if (box > 0)
            obj.translateY(-box.min.y);
        else
            obj.translateY(-1 * box.min.y);
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
        if (this.assetObj !== undefined) {
            this.assetObj.position.set(pointX, -8, 47)
        }
        this.updateBoundingBox();
    }

    resetPosition() {
        this.hitterMesh.position.set(0, 1, 40)
        this.sphere.position.set(0, 1, 46.5)
        this.updateBoundingBox();
        if (this.assetObj !== undefined) {
            this.assetObj.position.set(0, -8, 47)
        }
    }

    updateBoundingBox() {
        this.boundingSphere.center.copy(this.sphere.position);
    }

    setTexture(mesh) {
        let geometry = mesh.geometry;
        let material = mesh.material;
      
        // You must set an individual UV coordinate for each vertex of your scene
        // Learn more here:
        // https://discoverthreejs.com/book/first-steps/textures-intro/
        var uvCoords = [
        0.0, 0.0,   // 0
        0.2, 0.5,   // 1
        0.4, 0.0,   // 2
        0.6, 0.5,   // 3
        0.8, 0.0,   // 4
        1.0, 0.5,   // 5 (MEIO)
        0.8, 0.0,   // 6
        0.6, 0.5,   // 7
        0.4, 0.0,   // 8
        0.2, 0.5,   
        0.0, 0.0]; 
      
        geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvCoords), 2 ) );
      
        // Load the texture and set to the material of the mesh
        let texture = new THREE.TextureLoader().load('../../assets/textures/displacement/Stylized_blocks_001_roughness.jpg');
        material.map =  texture;
    }


}