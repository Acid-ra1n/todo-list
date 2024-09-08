var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var shapes = []; 

// Create 10 shapes moving down
for (var i = 0; i < 50; i++) {
  shapes[i] = {
    x: i * 60,
    y: 0, 
    width: 3, 
    height: 200, 
    speed: 2 
  };
}

// Create 10 shapes moving up in between the above shapes
for (var i = 0; i < 50; i+=2) {
  shapes[i] = {
    x: i * 60, 
    y: 0, 
    width: 3,
    height: 200, 
    speed: -2 
  };
}

function drawShape() {
  // Clears canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < shapes.length; i++) {
    // Draws a styled shape
    var shape = shapes[i];
    ctx.beginPath();
    ctx.rect(shape.x, shape.y, shape.width, shape.height);
    ctx.fillStyle = "limegreen";
    ctx.fill();
    ctx.closePath();

    // Moving the shapes either up or down
    shape.y += shape.speed;

    // If the shape has reached the bottom of the canvas, reset y position to top of the canvas
    if(shape.y > canvas.height && shape.speed > 0) {
      shape.y = 0; 
    }

    // If the shape has reached the top of the canvas, reset y position to bottom of the canvas
    if(shape.y < 0 && shape.speed < 0) {
      shape.y = canvas.height;
    }
  }
}

// Every ten milliseconds, function is called to draw shapes
setInterval(drawShape, 10);