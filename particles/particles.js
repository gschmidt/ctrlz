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

  for (var D = 0; D < numParticles; D++) {
    var particle = particles[D];
    var x = particle.x;
    var y = particle.y;
    var vx = particle.vx;
    var vy = particle.vy;

    var distFromMouse = Math.sqrt(
      (x - curX) * (x - curX) +
      (y - curY) * (y - curY));

    var angle = Math.atan2(y - curY, x - curX);
    var proj_x = Math.cos(angle);
    var proj_y = Math.sin(angle);

    // Handle the case where the mouse button is down
    if (mouseIsDown && distFromMouse < halfWidth) {
      var r = (1 - distFromMouse / halfWidth) * 14;
      vx += proj_x * r + 0.5 - Math.random();
      vy += proj_y * r + 0.5 - Math.random()
    }

    if (distFromMouse < aBitLessThanWidth) {
      r = (1 - distFromMouse / aBitLessThanWidth) * width * 0.0014;
      vx -= proj_x * r;
      vy -= proj_y * r;
    }

    if (distFromMouse < eighthWidth) {
      distFromMouse = (1 - distFromMouse / eighthWidth) * width * .00022;
      vx += moveX * distFromMouse;
      vy += moveY * distFromMouse;
    }

    vx *= FRICTION;
    vy *= FRICTION;
    x += vx;
    y += vy;

    // clamp x to [0, width]
    if (x > width) {
      x = 0;
    } else if (x < 0) {
      x = width;
    }

    // clamp y to [0, height]
    if (y > height) {
      y = 0;
    } else if (y < 0) {
      y = height;
    }

    particle.vx = vx;
    particle.vy = vy;
    particle.x = x;
    particle.y = y;
    vx = x / width * Math.PI * 2;
    vy = y / height * Math.PI;

    var ax = -100 * Math.sin(vy) * Math.sin(vx);
    var ay = -100 * Math.cos(vy);
    var ab = -100 * Math.sin(vy) * Math.cos(vx) - 200;

    if (!(ab < -300)) {
      vx = 300 / (300 + ab);
      vy = ax * vx + width / 2;
      g = ay * vx + height / 2;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(vy, g, vx, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
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

var Particle = function () {
  this.color = "rgb(" + Math.floor(Math.random() * 255) + "," +
    Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255)
    + ")";

  this.size = this.vx = this.vy = this.x = this.y = 0;
};

window.onload = function () {
  canvas = document.getElementById("mainCanvas");
  ctx = canvas.getContext("2d");
  resize();

  for (var i = 0; i < numParticles; i++) {
    var p = new Particle;
    p.x = width * 0.5;
    p.y = height * 0.5;
    p.vx = Math.cos(i) * Math.random() * 40;
    p.vy = Math.sin(i) * Math.random() * 20;
    p.size = 2;
    particles[i] = p;
  }
  document.onmousedown = mouseDown;
  document.onmouseup = mouseUp;
  document.onmousemove = mouseMove;
  window.onresize = resize;
  resize();
  setInterval(render, 33);
};
