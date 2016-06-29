var canvas;
var context;
var counter;
var spacing;
var canvasWidth;
var canvasHeight;
var bufferSize;
var outputValue;
var drawOutput = new Array(bufferSize);

function initVisual(c, width, height, bSize) {
	
	bufferSize = bSize || 1024;
	canvas = c;
	canvasWidth = width;
	canvasHeight = height;
	
	context = canvas.getContext("2d");
	
	canvas.setAttribute("width", canvasWidth);
	canvas.setAttribute("height", canvasHeight);
	
	spacing = canvasWidth / bufferSize;
	
	drawOutput = new Array(bufferSize);
	
	counter = 0;
	
	window.requestAnimationFrame(draw);
	//setInterval(draw, 10);
}

function setDrawOutput(output) {
	counter++;
	outputValue = output;
	drawOutput[counter%bufferSize] = output;
}
function draw() {
	context.clearRect(0,0, canvasWidth, canvasHeight);
	//context.fillStyle = "rgba(255, 255, 255, 255)";
	//context.rect(0, 0, canvasWidth, canvasHeight);
	//context.fill();
	context.beginPath();
	//context.strokeStyle="white";
	context.moveTo(i*spacing, canvasHeight/2+(drawOutput[0]*canvasHeight/4));
	for (var i=1;i<bufferSize;i++) {
		//context.moveTo(i*spacing,canvasHeight/2);
		context.lineTo(i*spacing, canvasHeight/2+(drawOutput[i]*canvasHeight/4));
	}
	
	
	context.stroke();
	context.closePath();
	context.strokeText("Output: " + parseFloat(outputValue).toFixed(2), 10, canvasHeight - 20);
	window.requestAnimationFrame(draw);
}

