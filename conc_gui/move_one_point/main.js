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

const size = 10;
const divisions = 10;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

renderer.render( scene, camera );

function animate() {
  var X = document.getElementById( "X_Vals" ).value;
  var Y = document.getElementById( "Y_Vals" ).value;
  dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [X,Y,0], 3 ) );
  

  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}


animate();