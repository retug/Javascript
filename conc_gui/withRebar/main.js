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
var dotMaterial = new THREE.PointsMaterial( { size: 0.5, color: 0x000000 } );

var dot = new THREE.Points( dotGeometry, dotMaterial );
console.log(dot)
dot.isReference = true
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
var allSelectedRebar = []
var allSelectedConc = []
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
    //resets the color of the rebar
    for (const pnt of allSelectedRebar) {
      pnt.material.color.setHSL( 0.0, 0.0, 0.5 );
    }
    allSelectedPnts = []
    allSelectedRebar = []
    allSelectedConc = []
    //reset the selected points array
    selectionBox.startPoint.set(
      ((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1,
      - ( event.clientY / concGui.offsetHeight )*2+1,
      0.5 );
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
      //Points
      if (allSelected[ i ].constructor.name == "Points" && allSelected[i].isReference != true && allSelected[i].isRebar != true) {
      //selected point is 0xFF7F00
        allSelected[ i ].material.color.set( 0xFF7F00);        
      }
      //Rebar
      else if (allSelected[ i ].constructor.name == "Points" && allSelected[i].isReference != true && allSelected[i].isRebar == true) {
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
        //points
        if (allSelected[ i ].constructor.name == "Points" && allSelected[i].isReference != true && allSelected[i].isRebar != true) {
          //selected point is 0xFF7F00
          allSelected[ i ].material.color.set( 0xFF7F00);        
        }
        //rebar
        else if (allSelected[ i ].constructor.name == "Points" && allSelected[i].isReference != true && allSelected[i].isRebar == true) {
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
    if (allSelected[ i ].constructor.name == "Points" && allSelected[i].isReference != true && allSelected[i].isRebar != true ) {
      console.log('you are in the points area')
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
    // filtering for rebar selected
    else if (allSelected[ i ].constructor.name == "Points" && allSelected[i].isReference != true && allSelected[i].isRebar == true ) {
      console.log('you are in the rebar area')
      allSelectedRebar.push(allSelected[i])
      allSelected[ i ].material.color.set( 0xFF7F00);
      let table = document.getElementById("rebarData")
      console.log(table)
      let row = document.createElement('tr');
      let Xpnt = allSelected[ i ].geometry.attributes.position.array[0] 
      let Ypnt = allSelected[ i ].geometry.attributes.position.array[1]
      let barDiaSelected = allSelected[ i ].rebarSize
      let Xdata = document.createElement('td')
      let Ydata = document.createElement('td')
      let barData = document.createElement('td')
      var Xinput = document.createElement("input");
      var Yinput = document.createElement("input");
      var barDiainput = document.createElement("input");
      Xinput.type = "Number";
      Yinput.type = "Number";
      barDiainput.type = "Number";
      Xinput.value = Xpnt
      Yinput.value = Ypnt
      barDiainput.value = barDiaSelected
      Xdata = Xinput
      Ydata = Yinput
      barData = barDiainput
      Xdata.style ="width: 50%"
      Ydata.style ="width: 50%"
      barData.style = "width: 50%"
      row.appendChild(Xdata)
      row.appendChild(Ydata)
      row.appendChild(barData)
      table.appendChild(row)  
    }
  }
}
  else {
    //resets the points in the scene
    let temptable = document.getElementById("pointData")
    temptable.innerHTML = ''
    let rebartable = document.getElementById("rebarData")
    rebartable.innerHTML = ''
    //end reset
    selectionBox.endPoint.set(
      ((event.clientX - (window.innerWidth*1/6)) / concGui.offsetWidth)*2-1,
      - ( event.clientY / concGui.offsetHeight)*2+1,
      0.5 );

    const allSelected = selectionBox.select();

    for ( let i = 0; i < allSelected.length; i ++ ) {
      // filtering for points selected
      if (allSelected[ i ].constructor.name == "Points" && allSelected[i].isReference != true && allSelected[i].isRebar != true) {
        allSelectedPnts.push(allSelected[i])
        //selected point is 0xFF7F00
        allSelected[ i ].material.color.set( 0xFF7F00);
        //console.log(allSelectedPnts)
      }
      //this is rebar
      else if (allSelected[ i ].constructor.name == "Points" && allSelected[i].isReference != true && allSelected[i].isRebar == true) {
        allSelectedRebar.push(allSelected[i])
        //selected point is 0xFF7F00
        allSelected[ i ].material.color.set( 0xFF7F00);
        console.log(allSelectedRebar)
      }
    }
    //adding to table for Points
    allSelectedRebar = []
    for ( let i = 0; i < allSelected.length; i ++ ) {
          // filtering for points selected
      if (allSelected[ i ].constructor.name == "Points" && allSelected[i].isReference != true && allSelected[i].isRebar != true ) {
        console.log('you are in the points area')
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
      // filtering for rebar selected
      else if (allSelected[ i ].constructor.name == "Points" && allSelected[i].isReference != true && allSelected[i].isRebar == true ) {
        console.log('you are in the rebar area')
        allSelectedRebar.push(allSelected[i])
        allSelected[ i ].material.color.set( 0xFF7F00);
        let table = document.getElementById("rebarData")
        console.log(table)
        let row = document.createElement('tr');
        let Xpnt = allSelected[ i ].geometry.attributes.position.array[0] 
        let Ypnt = allSelected[ i ].geometry.attributes.position.array[1]
        let barDiaSelected = allSelected[ i ].rebarSize
        let Xdata = document.createElement('td')
        let Ydata = document.createElement('td')
        let barData = document.createElement('td')
        var Xinput = document.createElement("input");
        var Yinput = document.createElement("input");
        var barDiainput = document.createElement("input");
        Xinput.type = "Number";
        Yinput.type = "Number";
        barDiainput.type = "Number";
        Xinput.value = Xpnt
        Yinput.value = Ypnt
        barDiainput.value = barDiaSelected
        Xdata = Xinput
        Ydata = Yinput
        barData = barDiainput
        Xdata.style ="width: 50%"
        Ydata.style ="width: 50%"
        barData.style = "width: 50%"
        row.appendChild(Xdata)
        row.appendChild(Ydata)
        row.appendChild(barData)
        table.appendChild(row)  
      }
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

//delete function
document.addEventListener('keyup', function (e) {
  if (e.key == "Delete") {
    console.log("you pressed delete")
    console.log(allSelectedPnts)
    for (var pnt in allSelectedPnts) {
      console.log(pnt)
      scene.remove(allSelectedPnts[pnt]);
    }
  }
})


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

var rebarDia = {
  3: 0.375,
  4: 0.5,
  5: 0.625,
  6: 0.75,
  7: 0.875,
  8: 1.0,
  9: 1.128,
  10: 1.27,
  11: 1.41,
  14: 1.693,
  18: 2.257
}

//circle for the rebar
const sprite = new THREE.TextureLoader().load( 'disc.png' );

//add a new material for each point
function addRebar() {
  var X1 = document.getElementById( "X_Vals" ).value;
  var Y1 = document.getElementById( "Y_Vals" ).value;
  var barDia = document.getElementById( "rebar_Vals" ).value;
  var tempDotGeo = new THREE.BufferGeometry();
  tempDotGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( [X1,Y1,0], 3 ) );
  var selectedDotMaterial = new THREE.PointsMaterial( { size: rebarDia[barDia], sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true  } );
  selectedDotMaterial.color.setHSL( 0.0, 0.0, 0.5 );
  var tempDot = new THREE.Points( tempDotGeo, selectedDotMaterial );
  tempDot.isRebar = true
  tempDot.rebarSize = barDia
  scene.add( tempDot );
  console.log(tempDot)
}


document.addEventListener('keydown', function (e) {
    //replicate function, use shift key and r to trigger
    if (e.shiftKey == true && (e.key == "R" || e.key == "r")) {
      console.log('horray')
      var Xreplicate =  parseFloat(prompt("What value of X"))
      var Yreplicate =  parseFloat(prompt("What value of Y"))
      alert( "X value = " + Xreplicate + "Y value = " + Yreplicate)
      for ( const pnt of allSelectedPnts ) {
          var xcurrent = pnt.geometry.attributes.position.array[0]
          var ycurrent = pnt.geometry.attributes.position.array[1]
          console.log(xcurrent)
          var newX = xcurrent + Xreplicate
          var newY = ycurrent + Yreplicate
          var tempDotGeo = new THREE.BufferGeometry();
          tempDotGeo.setAttribute( 'position', new THREE.Float32BufferAttribute( [newX,newY,0], 3 ) );
          var selectedDotMaterial = new THREE.PointsMaterial( { size: 0.5, color: 0x00FF00 } );
          var tempDot = new THREE.Points( tempDotGeo, selectedDotMaterial );
          scene.add( tempDot ); //adds updated position
    }
  }

  })
var tbody = document.getElementById("pointData")
console.log(tbody)
//function that will update the scene point location, table on left hand side of screen
tbody.onchange = function (e) {
  e = e || window.event; // || is or
  var data = [];
  var target = e.srcElement || e.target;
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

//GUI ITEMS
function pointSelection() {
  var pointTable =  document.getElementById("pointInfo")
  var rebarTable = document.getElementById("rebarInfo")
  var concTable = document.getElementById("concInfo")
  
  pointTable.style.display = 'inline';
  rebarTable.style.display="none"
  concTable.style.display="none"
}

function rebarSelection() {
  var pointTable =  document.getElementById("pointInfo")
  var rebarTable = document.getElementById("rebarInfo")
  var concTable = document.getElementById("concInfo")
  
  pointTable.style.display="none"
  rebarTable.style.display = 'inline	';
  concTable.style.display="none"
}

function concSelection() {
  var pointTable =  document.getElementById("pointInfo")
  var rebarTable = document.getElementById("rebarInfo")
  var concTable = document.getElementById("concInfo")
  
  pointTable.style.display="none"
  rebarTable.style.display="none"
  concTable.style.display = 'inline	';
}

document.getElementById("Points").onclick = function(){
    pointSelection();
  }

document.getElementById("Rebar").onclick = function(){
    rebarSelection();
  }

document.getElementById("Conc").onclick = function(){
    concSelection();
  }

  //END GUI ITEMS

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
  document.getElementById("addRebarBtn").onclick = function(){
    addRebar();
  }
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  console.log()
}
animate();