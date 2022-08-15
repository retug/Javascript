import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import { SelectionBox } from 'https://unpkg.com/three@0.126.1/examples/jsm/interactive/SelectionBox.js';
import { SelectionHelper } from 'https://unpkg.com/three@0.126.1/examples/jsm/interactive/SelectionHelper.js';

const concGui = document.querySelector('#concGui');

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, concGui.offsetWidth/concGui.offsetHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('canvas')
})

scene.background = new THREE.Color( 0xffffff );

renderer.setSize(concGui.offsetWidth, concGui.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)

//////////this the region of the dot///////////////
var dotGeometry = new THREE.BufferGeometry();
dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [0,0,0], 3 ) );
var dotMaterial = new THREE.PointsMaterial( { size: 0.5, color: 0x00FF00 } );

var dot = new THREE.Points( dotGeometry, dotMaterial );
//console.log(dot.geometry.attributes.position.array[0] )

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
controls.enablePan = false;

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

//beginning comand 
//#1
var allSelectedPnts = []
//#1
document.getElementById('concGui').addEventListener( 'pointerdown', function ( event ) {
  if (event.ctrlKey) {
    console.log(allSelectedPnts)
    selectionBox.startPoint.set(
      ((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1,
      - ( event.clientY / concGui.offsetHeight )*2+1,
      0.5 );
  }
  else {
    //reset the selected nodes
    
    // reset the color of all points when control is not held down
    for ( const pnt of allSelectedPnts ) {
      pnt.material.color.set( 0x00FF00 );
    }
    allSelectedPnts = []
    //reset the selected points array
    selectionBox.startPoint.set(
      ((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1,
      - ( event.clientY / concGui.offsetHeight )*2+1,
      0.5 );
      // logs x and y position of cursor
      //console.log(((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1)
      //console.log(-( event.clientY / concGui.offsetHeight )*2+1)
  }
} );


//while mouse is moving
//#2
document.getElementById('concGui').addEventListener( 'pointermove', function ( event ) {
  if (event.ctrlKey) {
    if ( helper.isDown ) {
      selectionBox.endPoint.set(
        ((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1,
        - ( event.clientY / concGui.offsetHeight )*2+1,
        0.5 );
    }
    const allSelected = selectionBox.select()
    //this is the color for when you are mouse dragging  
    for ( let i = 0; i < allSelected.length; i ++ ) {
      if (allSelected[ i ].constructor.name == "Points") {
      //selected point is 0xFF7F00
        allSelected[ i ].material.color.set( 0xFF7F00);        
      }
    }
  }
  else {
    if ( helper.isDown ) {
      selectionBox.endPoint.set(
        ((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1,
        - ( event.clientY / concGui.offsetHeight )*2+1,
        0.5 );
      
      const allSelected = selectionBox.select();
      //this is the color for when you are mouse dragging  
      for ( let i = 0; i < allSelected.length; i ++ ) {
        if (allSelected[ i ].constructor.name == "Points") {
          //selected point is 0xFF7F00
          allSelected[ i ].material.color.set( 0xFF7F00);        
        }
      }
    }
  }
} );   



//when you unselect the left mouse
//#3
document.getElementById('concGui').addEventListener( 'pointerup', function ( event ) {
// we are adding points to the previously constructed list
if (event.ctrlKey) {
  selectionBox.endPoint.set(
    ((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1,
    - ( event.clientY / concGui.offsetHeight)*2+1,
    0.5 );
  const allSelected = selectionBox.select();
  for ( let i = 0; i < allSelected.length; i ++ ) {
    // filtering for points selected
    if (allSelected[ i ].constructor.name == "Points") {
      allSelectedPnts.push(allSelected[i])
      //selected point is 0xFF7F00
      allSelected[ i ].material.color.set( 0xFF7F00);
      //console.log(allSelectedPnts)
      //adding to table
      let table = document.getElementById("pointData")
      let row = document.createElement('tr');
      let Xpnt = allSelected[ i ].geometry.attributes.position.array[0] 
      let Ypnt = allSelected[ i ].geometry.attributes.position.array[1]
      let Xdata = document.createElement('td')
      let Ydata = document.createElement('td')
      var Xinput = document.createElement("input");
      var Yinput = document.createElement("input");
      Xinput.type = "Number";
      Yinput.type = "Number";
      Xinput.value = Xpnt
      Yinput.value = Ypnt
      Xdata = Xinput
      Ydata = Yinput
      Xdata.style ="width: 50%"
      Ydata.style ="width: 50%"
      row.appendChild(Xdata)
      row.appendChild(Ydata)
      table.appendChild(row)  
    }
  }
}
  else {
    //resets the points in the scene
    let temptable = document.getElementById("pointData")
    temptable.innerHTML = ''
    //end reset
    selectionBox.endPoint.set(
      ((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1,
      - ( event.clientY / concGui.offsetHeight)*2+1,
      0.5 );

    const allSelected = selectionBox.select();

    for ( let i = 0; i < allSelected.length; i ++ ) {
      // filtering for points selected
      if (allSelected[ i ].constructor.name == "Points") {
        allSelectedPnts.push(allSelected[i])
        //selected point is 0xFF7F00
        allSelected[ i ].material.color.set( 0xFF7F00);
        //console.log(allSelectedPnts)
      }
    }
    //adding to table
    for ( const pnt of allSelectedPnts ) {
        let table = document.getElementById("pointData")
        let row = document.createElement('tr');
        let Xpnt = pnt.geometry.attributes.position.array[0] 
        let Ypnt = pnt.geometry.attributes.position.array[1]
        let Xdata = document.createElement('td')
        let Ydata = document.createElement('td')
        var Xinput = document.createElement("input");
        var Yinput = document.createElement("input");
        Xinput.type = "Number";
        Yinput.type = "Number";
        Xinput.value = Xpnt
        Yinput.value = Ypnt
        Xdata = Xinput
        Ydata = Yinput
        Xdata.style ="width: 50%"
        Ydata.style ="width: 50%"
        row.appendChild(Xdata)
        row.appendChild(Ydata)
        table.appendChild(row)  
      }
    }
} );    
//making Concrete Shape
function addConcGeo() {
  const x = 0, y = 0;

  const concShape = new THREE.Shape();
  concShape.currentPoint = allSelectedPnts[0]
  for (const [index, pnt] of allSelectedPnts.entries()) {
    if (index < allSelectedPnts.length-1) {
      var x_values = pnt.geometry.attributes.position.array[0]
      console.log(x_values)
      
      var starting = new THREE.Vector2(pnt.geometry.attributes.position.array[0], pnt.geometry.attributes.position.array[1])
      console.log(starting)
      concShape.currentPoint = starting   
      concShape.lineTo(allSelectedPnts[index].geometry.attributes.position.array[0], allSelectedPnts[index].geometry.attributes.position.array[1])
    }
    else {
      var starting = new THREE.Vector2(allSelectedPnts[index].geometry.attributes.position.array[0], allSelectedPnts[index].geometry.attributes.position.array[1])
      concShape.currentPoint = starting
      concShape.lineTo(allSelectedPnts[0].geometry.attributes.position.array[0], allSelectedPnts[0].geometry.attributes.position.array[1])   
    }
  }

  const geometry = new THREE.ShapeGeometry( concShape );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const mesh = new THREE.Mesh( geometry, material ) ;
  scene.add( mesh );
}

//add a new material for each point
function addPoint() {
  var X1 = document.getElementById( "X_Vals" ).value;
  var Y1 = document.getElementById( "Y_Vals" ).value;
  var tempDotGeo = new THREE.BufferGeometry();
  tempDotGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( [X1,Y1,0], 3 ) );
  var selectedDotMaterial = new THREE.PointsMaterial( { size: 0.5, color: 0x00FF00 } );
  var tempDot = new THREE.Points( tempDotGeo, selectedDotMaterial );
  scene.add( tempDot );
  
}

var tbody = document.getElementById("pointData")
console.log(tbody)
//function that will update the scene point location, table on left hand side of screen
tbody.onchange = function (e) {
  e = e || window.event; // || is or
  var data = [];
  var target = e.srcElement || e.target;
  const selectionBox = new SelectionBox( camera, scene );
  const helper = new SelectionHelper(selectionBox, renderer, 'selectBox' );
  while (target && target.nodeName !== "TR") {
      target = target.parentNode;
  }
  if (target) {
      var cells = target.getElementsByTagName("input");
      var ind = target.rowIndex - 1
      var x_pnt = cells[0].value
      var y_pnt = cells[1].value
      for (var i = 0; i < cells.length; i++) {
          data.push(cells[i].value);
      }
      //must remove old point and make a new one for selection box to register update
      scene.remove(allSelectedPnts[ind])
      var tempDotGeo = new THREE.BufferGeometry();
      tempDotGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( [x_pnt,y_pnt,0], 3 ) );
      var selectedDotMaterial = new THREE.PointsMaterial( { size: 0.5, color: 0xFF7F00 } );
      var tempDot = new THREE.Points( tempDotGeo, selectedDotMaterial );
      scene.add( tempDot ); //adds updated position
      allSelectedPnts[ind]=tempDot
  }
};



let frame = 0
function animate() {
  frame += 0.1
  var X = document.getElementById( "X_Vals" ).value;
  var Y = document.getElementById( "Y_Vals" ).value;
  //rendering the moving point on the screen, might need an id to filter
  dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [X,Y,0], 3 ) );
  dot.geometry.attributes.position.needsUpdate = true;
  document.getElementById("addPointBtn").onclick = function(){
    addPoint();
  }


  document.getElementById("addPolyBtn").onclick = function(){
    addConcGeo();
  }
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  console.log()
}
animate();