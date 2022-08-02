import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import { SelectionBox } from 'https://unpkg.com/three@0.126.1/examples/jsm/interactive/SelectionBox.js';
import { SelectionHelper } from 'https://unpkg.com/three@0.126.1/examples/jsm/interactive/SelectionHelper.js';

const concGui = document.querySelector('#concGui');
console.log(concGui)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, concGui.offsetWidth/concGui.offsetHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('canvas')
})

scene.background = new THREE.Color( 0xffffff );
//sets the size of the the 3d window might need to be modified.
// the minus 250 is to remove our node side heading



renderer.setSize(concGui.offsetWidth, concGui.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)
//document.getElementById("GUI").appendChild(renderer.domElement)

//////////this the region of the dot///////////////
var dotGeometry = new THREE.BufferGeometry();
dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [0,0,0], 3 ) );
var dotMaterial = new THREE.PointsMaterial( { size: 0.5, color: 0x00FF00 } );
var dot = new THREE.Points( dotGeometry, dotMaterial );
scene.add( dot );
/////////////////////////////end dot///////////////

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, -1, 5)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -5)
scene.add(backLight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableRotate = false;

console.log(OrbitControls)
camera.position.z = 50

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const size = 20;
const divisions = 20;

const gridHelper = new THREE.GridHelper( size, divisions );
gridHelper.rotation.x=Math.PI/2; //gets grid oriented in XY axis
scene.add( gridHelper );

renderer.render( scene, camera );

const selectionBox = new SelectionBox( camera, scene );
const helper = new SelectionHelper(selectionBox, renderer, 'selectBox' );


document.addEventListener( 'pointerdown', function ( event ) {

  for ( const item of selectionBox.collection ) {

    item.material.emissive.set( 0x000000 );

  }
// #1 1/6 for coordinates on left hand side of screen
  selectionBox.startPoint.set(
    ((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1,
    - ( event.clientY / concGui.offsetHeight )*2+1,
    0.5 );
    //
    console.log(((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1)
    console.log(-( event.clientY / concGui.offsetHeight )*2+1)
} );

document.addEventListener( 'pointermove', function ( event ) {

  if ( helper.isDown ) {

    for ( let i = 0; i < selectionBox.collection.length; i ++ ) {

      selectionBox.collection[ i ].material.emissive.set( 0x000000 );

    }

    selectionBox.endPoint.set(
      //#2
      ((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1,
      - ( event.clientY / concGui.offsetHeight )*2+1,
      0.5 );
      //
      //console.log(((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth) * 2 - 1)
      //console.log(-( event.clientY / concGui.offsetHeight ))

    const allSelected = selectionBox.select();

    for ( let i = 0; i < allSelected.length; i ++ ) {

      allSelected[ i ].material.emissive.set( 0xffffff );

    }

  }

} );

document.addEventListener( 'pointerup', function ( event ) {

  //#3
  selectionBox.endPoint.set(
    ((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1,
    - ( event.clientY / concGui.offsetHeight)*2+1,
    0.5 );

  const allSelected = selectionBox.select();
  //
  //console.log(((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth) * 2 - 1)
  //console.log(-( event.clientY / concGui.offsetHeight ))
  console.log(allSelected)

  for ( let i = 0; i < allSelected.length; i ++ ) {
    allSelected[ i ].material.color.set( 0xFF7F00);

  }

} );

// add point function
function addPoint() {
  var X1 = document.getElementById( "X_Vals" ).value;
  var Y1 = document.getElementById( "Y_Vals" ).value;
  var tempDotGeo = new THREE.BufferGeometry();
  tempDotGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( [X1,Y1,0], 3 ) );
  var tempDot = new THREE.Points( tempDotGeo, dotMaterial );
  scene.add( tempDot );
}
// end point function


function animate() {
  var X = document.getElementById( "X_Vals" ).value;
  var Y = document.getElementById( "Y_Vals" ).value;
  //rendering the moving point on the screen, might need an id to filter
  dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [X,Y,0], 3 ) );
  document.getElementById("addPointBtn").onclick = function(){
    addPoint();
  }

  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  
}
animate();
