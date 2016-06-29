var pattern;
var aStep = 0;
//GUI Elements
var drawType;

function setup() {

	//Create some GUI elements
	createP("Chaos clockwork").addClass("title").parent("canvasContainer");

	//Need a variable for the canvas - we want the mousePressed only triggered for the canvas and not for the other GUI elements
	var myCanvas = createCanvas(640, 360);
	myCanvas.parent("canvasContainer");
	myCanvas.mousePressed(canvasMousePressed);

	createP("Click to reset rotation values.").parent("canvasContainer");;

	drawType = createRadio().parent("canvasContainer");;
	drawType.option("Squares", "SQUARES");
	drawType.option("Circles", "CIRCLES");
	drawType.value("SQUARES");

	//inital things
	noFill();
	aStep = 0;
	pattern = new Pattern();
	pattern.items = [];
	pattern.startAngle = 0;

	//create the root element
	pattern.create(createVector(0, 0), 150, 255, 0, null);

}

//clear the rotation values for all elements in the pattern
function canvasMousePressed() {
	pattern.clearRotation();
	return false;
}
function draw() {
	//minimal trace effect alpha value
	background(0, 90);
	//come to the center
	translate(width/2, height/2);

	//pulsate in/out the hole pattern with setting the root element size differently
	pattern.items[0].radius = map(sin(radians(aStep)), -1, 1, 75, 500);
	pattern.update();
	pattern.render();
	//sin already has an acceleration effect - so increment only a step value
	aStep+=0.25;
}
