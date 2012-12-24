var rand = function (min, max) {
  return Math.random() * (max-min) + min;
};

// Return integer in [min, max]
var randInt = function (min, max) {
  return Math.floor(rand(min, max + 1));
};

///////////////////////////////////////////////////////////////////////////////

var camera, scene, renderer;
var meshes = [];

var start = function () {
  init();
  addCube();
  animate();
};

var init = function() {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

};

var addCube = function () {
  var geometry, material, mesh;
  geometry = new THREE.CubeGeometry( 200, 200, 200 );
  material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

  mesh = new THREE.Mesh( geometry, material );
  mesh.position.x = rand(-300, 300);
  mesh.position.y = rand(-300, 300);
  scene.add(mesh);
  meshes.push(mesh);
};

var last = null;
var elapsed = 0;

var lastAddition = 0;
function animate() {
  // note: three.js includes requestAnimationFrame shim
  requestAnimationFrame( animate );

  var now = (+ new Date)/1000;
  if (last === null)
    last = now;
  var since = (now - last);
  last = now;
  elapsed += since;

  for (var i = 0; i < meshes.length; i++) {
    var mesh = meshes[i];
    mesh.rotation.x += 1 * since;
    mesh.rotation.y += 2 * since;
  };

  if (! lastAddition)
    lastAddition = now;
  if (now - lastAddition > 1) {
    lastAddition += 1;
    addCube();
  }

  renderer.render( scene, camera );
};
