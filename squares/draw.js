// Return real in [min, max)
var rand = function (min, max) {
  return Math.random() * (max-min) + min;
};

// Return integer in [min, max]
var randInt = function (min, max) {
  return Math.floor(rand(min, max + 1));
};

var startAnimation = function () {
  var canvas = document.getElementById('thing');
  var ctx = canvas.getContext("2d");

  var x = Math.floor(randInt(25, 375));
  var y = Math.floor(randInt(25, 375));
  var vx = rand(-4, 4);
  var vy = rand(-4, 4);
  var ax = rand(-.5,.5);
  var ay = rand(-.5, .5);

  var r = randInt(0, 255);
  var g = randInt(0, 255);
  var b = randInt(0, 255);

  var i = 0;
  var doAThing = function () {
    x += vx;
    y += vy;
    vx += ax;
    vy += ay;

    i++;
    ctx.fillStyle = "rgba("  + r +
      ", " + g + ", " + b + ", " + .5*(1 - (i / 50)) + ");";
    var size = 10 * (1 - (i / 50));
    ctx.fillRect(x, y, size, size);
    if (i === 50)
      clearInterval(handle);
  };

  doAThing();
  var handle = setInterval(doAThing, 25);
};

var start = function () {
  var button = document.getElementById('go');
  button.onclick = function () {
    for (var i = 0; i < 3; i ++)
      startAnimation();
  };;
};
