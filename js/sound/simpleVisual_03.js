//visual0.3
var canvas;
var fftCanvas;
var context;
var fftContext;
var counter;
var spacing;
var canvasWidth;
var canvasHeight;
var bSize;
var outputValue = 0;
function initVisual(c, fftc, width, height, bS) {

  bSize = bS || 1024;
  drawOutput = new Array(bSize);
  canvas = c;
  fftCanvas = fftc;
  canvasWidth = width;
  canvasHeight = height;

  context = canvas.getContext("2d");
  fftContext = fftCanvas.getContext("2d");

  canvas.setAttribute("width", canvasWidth);
  canvas.setAttribute("height", canvasHeight);

  fftCanvas.setAttribute("width", canvasWidth);
  fftCanvas.setAttribute("height", canvasHeight);

  spacing = canvasWidth / bSize;

  counter = 0;

  window.requestAnimationFrame(draw);
  //setInterval(draw, 10);
}

function setDrawOutput(output) {
  counter++;
  outputValue = output;
  drawOutput[counter%bSize] = output;
}
function draw() {
  context.clearRect(0,0, canvasWidth, canvasHeight);
  context.strokeStyle = "#007FFF";
  context.beginPath();
  context.moveTo(i*spacing, canvasHeight/2+(drawOutput[0]*canvasHeight/4));

  for (var i=1;i<bufferSize;i++) {
    context.lineTo(i*spacing, canvasHeight/2+(drawOutput[i]*canvasHeight/4));
  }

  var drawOutputValue = Math.abs(outputValue);
  var rectWidth = canvasWidth - 40;
  var outWidth = Math.min(rectWidth*drawOutputValue, rectWidth);
  context.stroke();
  context.closePath();
  context.strokeStyle = "#FFFFFF";
  context.strokeRect(20, canvasHeight - 20, canvasWidth - 40, 10);
  if (drawOutputValue <= 0.5) {
    context.fillStyle = "#00FF00";
  } else if (drawOutputValue > 1.0) {
    context.fillStyle = "#FF0000";
  } else {
    var g = context.createLinearGradient(0, 0, outWidth, 0);
    var gStop = 1 - (Math.min(drawOutputValue, 1) - 0.5);
    var oStop;
    if (drawOutputValue <= 1) {
      oStop = 1;
    }

    g.addColorStop(gStop, "#00FF00");
    g.addColorStop(oStop, "#FFA500");
    context.fillStyle = g;
  }

  context.fillRect(20, canvasHeight - 20, outWidth, 10);
  context.strokeText("Output: " + parseFloat(outputValue).toFixed(2), 20, canvasHeight - 25);

  //context.strokeText("Frequency: " + parseFloat(f).toFixed(2), canvasWidth - 120, canvasHeight - 25);


  //spectrum
  fftContext.clearRect(0,0, canvasWidth, canvasHeight);

  for (var i = 0; i < bSize/2; i++) {
    fftContext.beginPath();
    fftContext.strokeStyle = "#FF0000";
    fftContext.moveTo(i*spacing*2, canvasHeight-2);
    fftContext.lineTo(i*spacing*2, canvasHeight-2-fft.getMagnitude(i));
    fftContext.stroke();
    fftContext.closePath();
  }


  window.requestAnimationFrame(draw);
}
