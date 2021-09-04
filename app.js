// Imports
import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import * as dat from 'dat.gui';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';

// Configuracion basica
let gui = undefined;
let size = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

// Paleta de colores
const palette = {
  bgColor: '#34495e', // CSS String
};

let plane = undefined;
let spotLight;

// Variables generales
let countCube = undefined;
let countSphere = undefined;
let countAmbientLight = undefined;
let countDireccionalLight = undefined;
let countPointLight = undefined;
let countSpotLight = undefined

let GUIFolderCube = 1;
let GUIFolderSphere = 1;
let GUIFolderAmbientLight = 1;
let GUIFolderDireccionalLight = 1;
let GUIFolderPointLight = 1;
let GUIFolderSpotLight = 1

// Arreglos de objetos
const objectsCube = [];
const objectsSphere = [];
const objectsAmbientLight = [];
const objectsDireccionalLight = [];
const objectsPointLight = [];
const objectsSpotLight = [];

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};

export function reset() {
  scene.children = [];
  renderer.setSize(0, 0, true);
  countCube = 0;
  GUIFolderCube = 1;
  scene.children = [];
  renderer.setSize(0, 0, true);
  countSphere = 0;
  GUIFolderSphere = 1;
  countAmbientLight = 0;
  GUIFolderAmbientLight = 1;
}
  



export function main(optionSize) {
  reset();
  // Configuracion inicial
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(palette.bgColor, 1);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 15;
  camera.position.y = 15;
  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

  // Controls
  new OrbitControls(camera, renderer.domElement);

  // Plano por defecto
  defaultPlane(optionSize);

  // GUI
  loadGUI();

  // Light
  setupLights();

  // Render
  animate();
}

//
function defaultPlane(size) {
  const geometry = new THREE.PlaneGeometry(size, size, size, size);
  const material = new THREE.MeshBasicMaterial({
    color: '#f1c40f',
    side: THREE.DoubleSide,
    wireframe: true,
  });
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  plane.receiveShadow = true;
  plane.rotation.x = Math.PI / 2;
}

//
function loadGUI() {
  cleanGUI();
  gui = new dat.GUI();
  gui.open();
}


// Limpia el GUI
export function cleanGUI() {
  const dom = document.querySelector('.dg.main');
  if (dom) dom.remove();
}

//
function setupLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

}

function animate() {
  requestAnimationFrame(animate);
  updateElements();
  renderer.render(scene, camera);
}

function updateElements() {
  _updateCubes();
   _updateSpheres();
  _updateAmbientLights();
  _updateDireccionalLights();
  _updatePointLights();
  _updateSpotLights();
}

export function createCubeGeneric() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0xffaec0,
    wireframe: false,
    
  });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);
  objectsCube.push(cube);
  cube.position.y = 0.5;
  cube.castShadow = true;
  cube.receiveShadow = true;

  cube.GUIcube = _cubeObject();
  _createCubeGUI(cube.GUIcube);

  countCube = countCube + 1;
}


function _cubeObject() {
  var GUIcube = {
    material: 'Basic',
    materialColor: 0xffaec0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    posX: 0,
    posY: 0.5,
    posZ: 0,
  };

  return GUIcube;
}



function _createCubeGUI(GUIcube) {
  const folder = gui.addFolder('Cube ' + GUIFolderCube);
  // Material
  folder.addColor(GUIcube, 'materialColor');
  folder.add(GUIcube, 'material', ['Basic', 'Phong', 'Lambert']);

  // Escala
  folder.add(GUIcube, 'scaleX');
  folder.add(GUIcube, 'scaleY');
  folder.add(GUIcube, 'scaleZ');

  // Posicion
  folder.add(GUIcube, 'posX');
  folder.add(GUIcube, 'posY');
  folder.add(GUIcube, 'posZ');

  GUIFolderCube = GUIFolderCube + 1;
}

function _updateCubes() {
  Object.keys(objectsCube).forEach((i) => {
    const cubeSelected = objectsCube[i];
    //Material cubo
    cubeSelected.GUIcube.material == 'Basic'
      ? (cubeSelected.material = new THREE.MeshBasicMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : cubeSelected.GUIcube.material == 'Lambert'
      ? (cubeSelected.material = new THREE.MeshLambertMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }))
      : (cubeSelected.material = new THREE.MeshPhongMaterial({
          color: cubeSelected.GUIcube.materialColor,
        }));

    //Escalar cubo
    cubeSelected.geometry = new THREE.BoxGeometry(
      cubeSelected.GUIcube.scaleX,
      cubeSelected.GUIcube.scaleY,
      cubeSelected.GUIcube.scaleZ,
    );

    //Posición
    cubeSelected.position.x = cubeSelected.GUIcube.posX;
    cubeSelected.position.y = cubeSelected.GUIcube.posY;
    cubeSelected.position.z = cubeSelected.GUIcube.posZ;
  });
}

 
  
 // CREANDO LA ESFERA

 export function createSphereGeneric() {
  const SphereGeometry = new THREE.SphereGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0xffaec0,
    wireframe: false,
  });
  const sphere = new THREE.Mesh(SphereGeometry, material);

  scene.add(sphere);
  objectsSphere.push(sphere);
  sphere.position.y = 0.5;
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  sphere.GUIsphere = _SphereObject();
  _createSphereGUI(sphere.GUIsphere);

  countSphere = countSphere + 1;
}


function _SphereObject() {
  var GUIsphere = {
    material: 'Basic',
    materialColor: 0xffaec0,
    radius: 1,
    posX: 0,
    posY: 0.5,
    posZ: 0,
    RotX: 1,
    RotY: 1,
    RotZ: 1,
  };

  return GUIsphere;
}

function _createSphereGUI(GUIsphere) {
  const folder = gui.addFolder('Sphere ' + GUIFolderSphere);
  // MATERIAL DE LA ESFERA
  folder.addColor(GUIsphere, 'materialColor');
  folder.add(GUIsphere, 'material', ['Basic', 'Phong', 'Lambert']);

  // ESCALA DE LA ESFERA
  folder.add(GUIsphere, 'radius', 1, Math.PI * 2);

  // POSICION DE LA ESFERA
  folder.add(GUIsphere, 'posX', -6, Math.PI * 2);
  folder.add(GUIsphere, 'posY', 0.5, Math.PI * 2);
  folder.add(GUIsphere, 'posZ', -6, Math.PI * 2);

  
  folder.add(GUIsphere, 'RotX', -5, Math.PI * 2);
  folder.add(GUIsphere, 'RotY', -5, Math.PI * 2);
  folder.add(GUIsphere, 'RotZ', -5, Math.PI * 2);

  GUIFolderSphere = GUIFolderSphere + 1;
}

function _updateSpheres() {
  Object.keys(objectsSphere).forEach((i) => {
    const SphereSelected = objectsSphere[i];
    //material esfera
    SphereSelected.GUIsphere.material == 'Basic'
      ? (SphereSelected.material = new THREE.MeshBasicMaterial({
          color: SphereSelected.GUIsphere.materialColor,
        }))
      : SphereSelected.GUIsphere.material == 'Lambert'
      ? (SphereSelected.material = new THREE.MeshLambertMaterial({
          color: SphereSelected.GUIsphere.materialColor,
        }))
      : (SphereSelected.material = new THREE.MeshPhongMaterial({
          color: SphereSelected.GUIsphere.materialColor,
        }));

    //Escalar esfera
    SphereSelected.Geometry = new THREE.SphereGeometry(
      SphereSelected.GUIsphere.radius,
    );

    //Posición esfera
    SphereSelected.position.x = SphereSelected.GUIsphere.posX;
    SphereSelected.position.y = SphereSelected.GUIsphere.posY;
    SphereSelected.position.z = SphereSelected.GUIsphere.posZ;

    //Rotacion esfera
    SphereSelected.rotation.x = SphereSelected.GUIsphere.RotX;
    SphereSelected.rotation.y = SphereSelected.GUIsphere.RotY;
    SphereSelected.rotation.z = SphereSelected.GUIsphere.RotZ;

  });
}


//  Creacion de Luz DE DIRECCION EN EL PLANO

  export function createDireccionalLightGeneric() {
  const DireccionalLight = new THREE.DirectionalLight(0xA71F8B); 
  DireccionalLight.position.set( 0, 1, 0 );
  DireccionalLight.castShadow = true;

  objectsDireccionalLight.push(DireccionalLight)

scene.add( DireccionalLight );
DireccionalLight.GUIDireccionalLight = _DireccionalLightObject();
_createDireccionalLightGUI(DireccionalLight.GUIDireccionalLight);

countDireccionalLight = countDireccionalLight + 1;
  }

  function _DireccionalLightObject() {
  var GUIDireccionalLight = {
    color: 0xFFFAF0,
    intensity: 1,
    castShadow: true,
    posX: 0,
    posY: 1,
    posZ: 0,
    };
  
  return GUIDireccionalLight;
  }

  function _createDireccionalLightGUI(GUIDireccionalLight) {
    const folder = gui.addFolder('DirectionalLight ' + GUIFolderDireccionalLight);
  
    folder.addColor(GUIDireccionalLight, 'color');
    folder.add(GUIDireccionalLight, 'intensity', 0, 1);
    // Posicion
    folder.add(GUIDireccionalLight, 'posX', -6, Math.PI * 2);
    folder.add(GUIDireccionalLight, 'posY', 0, Math.PI * 2);
    folder.add(GUIDireccionalLight, 'posZ', -6, Math.PI * 2);
    
    GUIFolderDireccionalLight = GUIFolderDireccionalLight + 1;
    }

  function _updateDireccionalLights()    {
      Object.keys(objectsDireccionalLight).forEach((i) => {
        const DireccionalLightSelected = objectsDireccionalLight[i];
      
        DireccionalLightSelected.color.setHex(DireccionalLightSelected.GUIDireccionalLight.color);
        DireccionalLightSelected.intensity = DireccionalLightSelected.GUIDireccionalLight.intensity;
        

            //Posición
        DireccionalLightSelected.position.x = DireccionalLightSelected.GUIDireccionalLight.posX;
        DireccionalLightSelected.position.y = DireccionalLightSelected.GUIDireccionalLight.posY;
        DireccionalLightSelected.position.z = DireccionalLightSelected.GUIDireccionalLight.posZ;
      });
      }

        // creacion de la luz ambiente en el plano

      export function createAmbientLightGeneric() {
        const AmbientLight = new THREE.AmbientLight(0xA71F8B); 
        scene.add( AmbientLight );
      
        objectsAmbientLight.push(AmbientLight)
      
      AmbientLight.GUIAmbientLight = _AmbientLightObject();
      _createAmbientLightGUI(AmbientLight.GUIAmbientLight);
      
      countAmbientLight = countAmbientLight + 1;
      }
      
      
      function _AmbientLightObject() {
      var GUIAmbientLight = {
        color: 0xFFFAF0,
        intensity: 1,
        };
      
      return GUIAmbientLight;
      }
      
      function _createAmbientLightGUI(GUIAmbientLight) {
      const folder = gui.addFolder('AmbientLight ' + GUIFolderAmbientLight);
      folder.addColor(GUIAmbientLight, 'color');
      folder.add(GUIAmbientLight, 'intensity', 0, 1);
      
      GUIFolderAmbientLight = GUIFolderAmbientLight + 1;
      }
      
      
      function _updateAmbientLights()    {
      Object.keys(objectsAmbientLight).forEach((i) => {
        const AmbientLightSelected = objectsAmbientLight[i];
      
        AmbientLightSelected.color.setHex(AmbientLightSelected.GUIAmbientLight.color);
        AmbientLightSelected.intensity = AmbientLightSelected.GUIAmbientLight.intensity;
        
      });
      }
      

// Creacion de Point Light en el plano

export function createPointLightGeneric() {
  const PointLight = new THREE.PointLight(0xA71F8B, 2, 100 ); 
  PointLight.position.set( 4, 4, 4 );
  scene.add( PointLight );
  objectsPointLight.push(PointLight)
  
  

PointLight.GUIPointLight = _PointLightObject();
_createPointLightGUI(PointLight.GUIPointLight);

countPointLight = countPointLight + 1;
}


function _PointLightObject() {
var GUIPointLight = {
 color: 0xFFFAF0,
 intensity: 1,
 posX: 2,
 posY: 2,
 posZ: 2,
 decay: 1,
 distance: 0,
  };

return GUIPointLight;
}

function _createPointLightGUI(GUIPointLight) {
const folder = gui.addFolder('PointLight ' + GUIFolderPointLight);

folder.addColor(GUIPointLight, 'color');
folder.add(GUIPointLight, 'intensity', 0, 1);
folder.add(GUIPointLight, 'posX', -5, Math.PI * 2);
folder.add(GUIPointLight, 'posY', -4, Math.PI * 2);
folder.add(GUIPointLight, 'posZ', -6, Math.PI * 2);
folder.add(GUIPointLight, 'decay', 0, 1);
folder.add(GUIPointLight, 'distance', 0, 2);

GUIFolderPointLight = GUIFolderPointLight + 1;
}


function _updatePointLights()    {
Object.keys(objectsPointLight).forEach((i) => {
 const PointLightSelected = objectsPointLight[i];

  PointLightSelected.color.setHex(PointLightSelected.GUIPointLight.color);
  PointLightSelected.intensity = PointLightSelected.GUIPointLight.intensity;
  PointLightSelected.position.x = PointLightSelected.GUIPointLight.posX;
  PointLightSelected.position.y = PointLightSelected.GUIPointLight.posY;
  PointLightSelected.position.z = PointLightSelected.GUIPointLight.posZ;
  PointLightSelected.decay = PointLightSelected.GUIPointLight.decay;
  PointLightSelected.distance = PointLightSelected.GUIPointLight.distance;
 
});
}


export function createSpotLightGeneric() {
  const SpotLight = new THREE.SpotLight(0xA71F8B, 1); 
  SpotLight.position.set(0, 15, 0);
  SpotLight.angle = Math.PI / 4;
  SpotLight.penumbra = 0.1;
  SpotLight.decay = 2;
  SpotLight.distance = 200;
  SpotLight.castShadow = true;


  objectsSpotLight.push(SpotLight)
  scene.add(SpotLight);


SpotLight.GUISpotLight = _SpotLightObject();
_createSpotLightGUI(SpotLight.GUISpotLight);

countSpotLight = countSpotLight + 1;
 }

  function  _SpotLightObject() {
  var GUISpotLight = {
    color: 0xFFFAF0,
    intensity: 1,
    castShadow: true,
    posX: 0,
    posY: 10,
    posZ: 0,
    angle: Math.PI / 4,
    penumbra: 0.1,
    decay: 2,
    distance: 200,
    };
  
  return GUISpotLight;
  }

  function _createSpotLightGUI(GUISpotLight) {
    const folder = gui.addFolder('SpotLight ' + GUIFolderSpotLight);
  
    folder.addColor(GUISpotLight, 'color');
    folder.add(GUISpotLight, 'intensity', 0, 1);
    folder.add(GUISpotLight, 'penumbra', 0, 1);
    folder.add(GUISpotLight, 'decay', 1, 2);
    
    folder.add(GUISpotLight, 'posX', -6, Math.PI * 2);
    folder.add(GUISpotLight, 'posY', 0, Math.PI * 2);
    folder.add(GUISpotLight, 'posZ', -6, Math.PI * 2);
    folder.add(GUISpotLight, 'angle', Math.PI / 4, Math.PI / 2);
    
    GUIFolderSpotLight = GUIFolderSpotLight + 1;
    }


    function _updateSpotLights()    {
      Object.keys(objectsSpotLight).forEach((i) => {
        const SpotLightSelected = objectsSpotLight[i];
      
        SpotLightSelected.color.setHex(SpotLightSelected.GUISpotLight.color);
        SpotLightSelected.intensity = SpotLightSelected.GUISpotLight.intensity;
        SpotLightSelected.penumbra = SpotLightSelected.GUISpotLight.penumbra;
        SpotLightSelected.decay = SpotLightSelected.GUISpotLight.decay;
        

            //Posición
        SpotLightSelected.position.x = SpotLightSelected.GUISpotLight.posX;
        SpotLightSelected.position.y = SpotLightSelected.GUISpotLight.posY;
        SpotLightSelected.position.z = SpotLightSelected.GUISpotLight.posZ;
        SpotLightSelected.angle = SpotLightSelected.GUISpotLight.angle;
      });
      }
