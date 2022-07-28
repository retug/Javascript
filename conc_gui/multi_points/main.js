import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

scene.background = new THREE.Color( 0xffffff );
//sets the size of the the 3d window might need to be modified.
// the minus 250 is to remove our node side heading
renderer.setSize(innerWidth-250, innerHeight)
document.getElementById("GUI").appendChild(renderer.domElement)

///////////////////////////////////////////////////
///////////////// create spehere //////////////////
///////////////////////////////////////////////////
const geometry = new THREE.SphereGeometry( 15, 32, 16 );
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
  color: 0xff8c69,
})
const sphere = new THREE.Mesh( geometry, planeMaterial );
//scene.add( sphere );

///////////////////////////////////////////////////
//////////////// end sphere ///////////////////////
///////////////////////////////////////////////////

///////////////////////////////////////////////////
//////////this the region of the dot///////////////
///////////////////////////////////////////////////

var dotGeometry = new THREE.BufferGeometry();
dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [0,0,0], 3 ) );
var dotMaterial = new THREE.PointsMaterial( { size: 0.5, color: 0x00FF00 } );
var dot = new THREE.Points( dotGeometry, dotMaterial );
scene.add( dot );


///////////////////////////////////////////////////
/////////////////////////////end dot///////////////
///////////////////////////////////////////////////

console.log(dot)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, -1, 5)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -5)
scene.add(backLight)

new OrbitControls(camera, renderer.domElement)
camera.position.z = 50

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const size = 20;
const divisions = 20;

const gridHelper = new THREE.GridHelper( size, divisions );
gridHelper.rotation.x=Math.PI/2;
scene.add( gridHelper );

renderer.render( scene, camera );

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
  dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [X,Y,0], 3 ) );
  document.getElementById("addPointBtn").onclick = function(){
    addPoint();
  }

  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  
}
animate();
