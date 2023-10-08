import * as THREE from  'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer,
        initCamera, 
        initDefaultBasicLight,
        createGroundPlane,
        onWindowResize} from "../libs/util/util.js";

import { CSG } from '../libs/other/CSGMesh.js'        

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 40)");
var camera = initCamera(new THREE.Vector3(4, -8, 8)); // Init camera in this position
   camera.up.set( 0, 0, 1 );

window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
initDefaultBasicLight(scene, true, new THREE.Vector3(12, -15, 20), 28, 1024) ;	

var groundPlane = createGroundPlane(20, 20); // width and height (x, y)
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

var trackballControls = new TrackballControls( camera, renderer.domElement );

// To be used in the interface
let mesh2;

buildInterface();
buildObjects();
render();

function buildObjects()
{
   let auxMat = new THREE.Matrix4();
   
   // Base objects
   let cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2))
   let cylinderMesh = new THREE.Mesh( new THREE.CylinderGeometry(0.85, 0.85, 2, 20))

   // CSG holders
   let csgObject, cubeCSG, cylinderCSG

   // Object 2 - Cube INTERSECT Cylinder
   cylinderMesh.position.set(1.5, -0.5, 0.0)
   updateObject(cylinderMesh)
   cylinderCSG = CSG.fromMesh(cylinderMesh)
   cubeCSG = CSG.fromMesh(cubeMesh)   
   csgObject = cubeCSG.intersect(cylinderCSG) // Execute intersection
   mesh2 = CSG.toMesh(csgObject, auxMat)
   mesh2.material = new THREE.MeshPhongMaterial({color: 'lightblue'})
   mesh2.position.set(0, 0, 2.0)
   mesh2.rotation.y = Math.PI / 2;
   scene.add(mesh2)
}

function updateObject(mesh)
{
   mesh.matrixAutoUpdate = false;
   mesh.updateMatrix();
}

function buildInterface()
{
  var controls = new function ()
  {
    this.wire = false;
    
    this.onWireframeMode = function(){
       mesh2.material.wireframe = this.wire;               
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'wire', false)
    .name("Wireframe")
    .onChange(function(e) { controls.onWireframeMode() });
}

function render()
{
  stats.update(); // Update FPS
  trackballControls.update();
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}
