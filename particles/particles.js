var canvas, ctx;
var width = 1000, height = 560;
var particles = [];
var FRICTION = 0.96;

var curX = null, curY = null;
var lastX, lastY;

var mouseIsDown = false;

// p: the particle to update
// curX, curY: current position of the mouse
// moveX, moveY: how much the mouse has moved since last update
var applyMouseForces = function (p, curX, curY, moveX, moveY) {
  var distFromMouse = Math.sqrt(
    (p.x - curX) * (p.x - curX) +
    (p.y - curY) * (p.y - curY));

  // (dx, dy) is the vector from the current mouse position to this
  // particle, normalized to unit length. (The original code used
  // arctan to compute this.. sillies.)
  var dx = (p.x - curX) / distFromMouse;
  var dy = (p.y - curY) / distFromMouse;

  // If the mouse button is down, and the particle is close to the
  // mouse, accelerate the particle away from the mouse. The closer to
  // the mouse, the greater the acceleration.
  var repelRadius = width / 2;
  if (mouseIsDown && distFromMouse < repelRadius) {
    var r = (1 - distFromMouse / repelRadius) * 14;
    p.vx += dx * r + 0.5 - Math.random();
    p.vy += dy * r + 0.5 - Math.random();
  }

  // Accelerate all particles toward the mouse. (The closer they are
  // to the mouse, the greater the acceleration.) Particles that are
  // super far from the mouse, though, aren't affected.
  var gravityRadius = width / 1.15;
  if (distFromMouse < gravityRadius) {
    var r = (1 - distFromMouse / gravityRadius) * width * 0.0014;
    p.vx -= dx * r;
    p.vy -= dy * r;
  }

  // If a particle is fairly close to the mouse, then accelerate it in
  // the same direction as recent mouse movement. The faster the
  // movement, and the closer the particle was to the mouse, the
  // greater the acceleration.
  var shoveRadius = width / 8;
  if (distFromMouse < shoveRadius) {
    var r = (1 - distFromMouse / shoveRadius) * width * .00022;
    p.vx += moveX * r;
    p.vy += moveY * r;
  }
};

var render = function () {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(8,8,12,.75)";
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  if (curX !== null) {
    var moveX = curX - lastX;
    var moveY = curY - lastY;
    lastX = curX;
    lastY = curY;
  }

  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];

    // Adjust the velocity based on the various force fields in the
    // simulation (which are all based on the current mouse position.)
    if (curX !== null)
      applyMouseForces(p, curX, curY, moveX, moveY);

    // Velocity decays to zero over time.
    p.vx *= FRICTION;
    p.vy *= FRICTION;

    // Update position based on velocity.
    p.x += p.vx;
    p.y += p.vy;

    // Wrap particles around the screen (crudely)
    if (p.x > width) {
      p.x = 0;
    } else if (p.x < 0) {
      p.x = width;
    }

    if (p.y > height) {
      p.y = 0;
    } else if (p.y < 0) {
      p.y = height;
    }

    var sx = p.x;
    var sy = p.y;
    var r = 3;
    var project = true;

    if (project) {
      // Put the dots through a final nonlinear projection to make it
      // look more interesting. I haven't figured out what the
      // projection is but it looks like it projects the plane onto a
      // sphere, in such a way that a lot of space pinches together
      // around the poles, and then the sphere is collapsed back onto
      // a plane by ignoring the z component (but changing the dot
      // radius based on it.)
      var tx = p.x / width * Math.PI * 2;
      var ty = p.y / height * Math.PI;
      var ax = -100 * Math.sin(ty) * Math.sin(tx);
      var ay = -100 * Math.cos(ty);
      var az = -100 * Math.sin(ty) * Math.cos(tx) - 200;

      if (az < -300)
        continue; // skip this one

      r = 300 / (300 + az);
      sx = ax * r + width / 2;
      sy = ay * r + height / 2;
    }

    // Draw a dot of radius r at (sx, sy) in p.color.
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
};

var resize = function () {
  width = document.documentElement.clientWidth;
  height = document.documentElement.clientHeight;
  canvas.width = width;
  canvas.height = height;
};

var Particle = function (x, y, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;

  this.color = "rgb(" + Math.floor(Math.random() * 255) + "," +
    Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255)
    + ")";
};

var createExplosion = function () {
  particles = [];

  for (var i = 0; i < 550; i++) {
    var p = new Particle(
      // cos/sin give the initial burst a circular shape?
      width * 0.5,
      height * 0.5,
      Math.cos(i) * Math.random() * 40,
      Math.sin(i) * Math.random() * 20
    );
    particles.push(p);
  }
};

var createGrid = function () {
  particles = [];

  for (var x = 0; x < 25; x++) {
    for (var y = 0; y < 25; y++) {
      var p = new Particle(
        // cos/sin give the initial burst a circular shape?
        (x / 25) * width,
        (y / 25) * width,
        0,
        0
      );
      particles.push(p);
    }
  }
};

window.onload = function () {
  canvas = document.getElementById("mainCanvas");
  ctx = canvas.getContext("2d");
  window.onresize = resize;
  resize();

  canvas.onmousemove = function (evt) {
    var firstTime = (curX === null);

    curX = evt.pageX;
    curY = evt.pageY;

    if (firstTime) {
      lastX = curX;
      lastY = curY;
    }
  };

  canvas.onmousedown = function (evt) {
    mouseIsDown = true;
    return false;
  };

  canvas.onmouseup = function (evt) {
    mouseIsDown = false;
    return false;
  };

  createExplosion();
  setInterval(render, 33);
};
