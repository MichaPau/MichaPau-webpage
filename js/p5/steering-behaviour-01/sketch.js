
var flies;
var flocType;
var windCheck;
var wind;
function setup() {
	var c = createCanvas(640, 400);
	c.parent("canvasContainer");
	
	//some gui elements
	flocType = createRadio();
	flocType.option("Lonliest is brightest", 1);
	flocType.option("Most crowded is brightest", 2);
	flocType.value(1);
	flocType.parent("radioContainer");
	
	windCheck = createCheckbox("Add wind force", false);
	windCheck.parent("guiContainer");
	
	wind = new WindForce();
	
	flies = [];
	for(var i = 0; i < 55; i++) {
		var f = new FireFly(random(width), random(height), random(255));
		flies.push(f);
	}  
}

function draw() {
	background(0, 90);
	//console.log(flocType.value());
	var fValue = flocType.value();

	//console.log(fValue);
	var flee = false;
	if(mouseIsPressed) {
		var mVector = createVector(mouseX, mouseY);
		fill("#FF0000");
		ellipse(mVector.x, mVector.y, 10, 10);
		flee = true;
	}
	
	if(windCheck.checked()) {
		wind.update();
		wind.display();
	}
  for(var i = 0; i < flies.length; i++) {
  	//
  	
  	flies[i].calcBrightness(flies, fValue);
  	if(flee === true) flies[i].flee(mVector);
		flies[i].flock(flies);
		flies[i].update();
		if(windCheck.checked()) flies[i].applyForce(wind.getForce());
		flies[i].borders();
		flies[i].render();
	}  
}