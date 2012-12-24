var canvas, ctx;
var width = 1000, height = 560;
var numParticles = 550;
var particles = [];
var FRICTION = 0.96;

var curX, curY;
var lastX = 0, lastY = 0;

var mouseIsDown = false;

function render() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(8,8,12,.75)";
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  var moveX = curX - lastX;
  var moveY = curY - lastY;
  lastX = curX;
  lastY = curY;

  var halfWidth = width / 2;
  var eighthWidth = width / 8;
  var aBitLessThanWidth = width / 1.15;

  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];

    var distFromMouse = Math.sqrt(
      (p.x - curX) * (p.x - curX) +
      (p.y - curY) * (p.y - curY));

    var angle = Math.atan2(p.y - curY, p.x - curX);
    var proj_x = Math.cos(angle);
    var proj_y = Math.sin(angle);

    // If the mouse button is down, and the particle is close to the
    // mouse, accelerate the particle away from the mouse. The closer
    // to the mouse, the greater the acceleration.
    if (mouseIsDown && distFromMouse < halfWidth) {
      var r = (1 - distFromMouse / halfWidth) * 14;
      p.vx += proj_x * r + 0.5 - Math.random();
      p.vy += proj_y * r + 0.5 - Math.random();
    }

    // Accelerate all particles toward the mouse. (The closer they are
    // to the mouse, the greater the acceleration.) Particles that are
    // super far from the mouse, though, aren't affected.
    if (distFromMouse < aBitLessThanWidth) {
      var r = (1 - distFromMouse / aBitLessThanWidth) * width * 0.0014;
      p.vx -= proj_x * r;
      p.vy -= proj_y * r;
    }

    // If a particle is fairly close to the mouse, then accelerate it
    // in the same direction as recent mouse movement. The faster the
    // movement, and the closer the particle was to the mouse, the
    // greater the acceleration.
    if (distFromMouse < eighthWidth) {
      var r = (1 - distFromMouse / eighthWidth) * width * .00022;
      p.vx += moveX * r;
      p.vy += moveY * r;
    }

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


    // looks like a final nonlinear projection of the dots?
    var tx = p.x / width * Math.PI * 2;
    var ty = p.y / height * Math.PI;
    var ab = -100 * Math.sin(ty) * Math.cos(tx) - 200;
    if (!(ab < -300)) {
      var ax = -100 * Math.sin(ty) * Math.sin(tx);
      var ay = -100 * Math.cos(ty);
      var r = 300 / (300 + ab);
      var sx = ax * r + width / 2;
      var sy = ay * r + height / 2;

      // Draw a dot of radius r at (sx, sy) in p.color.
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
/*
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
*/


  }
};

function resize() {
  width = document.documentElement.clientWidth;
  height = document.documentElement.clientHeight;
  canvas.width = width;
  canvas.height = height;
};

function mouseMove(evt) {
  evt = evt ? evt : window.event;
  curX = lastX = evt.pageX;
  curY = lastY = evt.pageY;
  document.onmousemove = mouseMove2;
};

function mouseMove2(evt) {
  evt = evt ? evt : window.event;
  curX = evt.pageX;
  curY = evt.pageY;
};

function mouseDown() {
  mouseIsDown = true;
  return false;
};

function mouseUp() {
  mouseIsDown = false;
  return false;
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

window.onload = function () {
  canvas = document.getElementById("mainCanvas");
  ctx = canvas.getContext("2d");
  resize();

/*
  for (var i = 0; i < numParticles; i++) {
    var p = new Particle(
      // cos/sin give the initial burst a circular shape?
      width * 0.5,
      height * 0.5,
      Math.cos(i) * Math.random() * 40,
      Math.sin(i) * Math.random() * 20
    );
    particles.push(p);
  }
*/

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

  document.onmousedown = mouseDown;
  document.onmouseup = mouseUp;
  document.onmousemove = mouseMove;
  window.onresize = resize;
  resize();
  setInterval(render, 33);
};
