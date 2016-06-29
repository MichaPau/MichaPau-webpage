
var baseWidth = 50;
var maxIterations = 9;
var yNoise = 0;
var hue, saturation, brightness;
var hueFrom;
var hueTo;
var hueStep;
var treeOpacity = 255;

var noiseValue = 0.0;
var noiseIncr = 0.002;


//hue calculation - Hue(E) = ( Hue(B)*y/a + Hue(A)*(1-y/a) ) * (x/a)  +  ( Hue(D)*y/a + Hue(C)*(1-y/a) ) * (1-x/a)
//from - http://stackoverflow.com/questions/1106959/how-do-i-calculate-a-four-colour-gradient
function setup () {
  var canvas = createCanvas(400, 400);
  canvas.parent("canvasContainer");

  background(0);
  //smooth();
  colorMode(HSB, 360, 100, 100);
 
  hueFrom = 180;
  hueTo = 240;

  hueStep = (hueTo - hueFrom)/(maxIterations+1);
  saturation = 100;
  brightness = 80;
  
  frameRate(60);
}

function draw() {
  background(0, 0, 0, 0.2);
  maxIterations = map(noise(yNoise), 0, 1, 7, 9);
  //maxIterations = 4;
  var mX, mY;
 
  if(mouseX <= 0 || mouseY <= 0 || mouseX > width || mouseY > height) {
    mX = 228;
    mY = 16;
  } else {
    mX = mouseX;
    mY = mouseY;
  }
  hueFrom = map(mX, 0, width, 0, 360);
  hueTo = map(mY, 0, height, 0, 360);
  
  hueStep = (hueTo - hueFrom)/(maxIterations+1);
  
  baseWidth = map(noise(yNoise), 0, 1, 45, 80);
  
  translate(width/2 - baseWidth/2, height-2);
  
  drawSquare(baseWidth, 0, 0, 0);
  
  yNoise += 0.007;
  
  //filter(BLUR, 0.5);
  
}

function drawSquare(size, i, angle, xNoise) {
  
  var thisHue = (i*hueStep) + hueFrom;
  var nextHue = ((i+1)*hueStep) + hueFrom;
  
  //stroke(#FFFFFF);
  noStroke();
  push();
  translate(size/2, -size/2);
  //fill(nextHue, saturation, brightness);
  beginShape();
    fill(nextHue, saturation, brightness);
    vertex(-size/2, -size/2);
    vertex(size/2, -size/2);
    fill(thisHue, saturation, brightness);
    vertex(size/2, size/2);
    vertex(-size/2, size/2);
    fill(nextHue, saturation, brightness);
    vertex(-size/2, -size/2);
  endShape();
  pop();
  xNoise += 0.1;
  if(++i <= maxIterations) {
    
    var alpha = map(noise(xNoise, yNoise), 0, 1, 0, 90);
    push();
    var lAngle = radians(-alpha);
    translate(0, -size);
    rotate(lAngle);
    
    var lSize = size*cos(radians(alpha));
    drawSquare(lSize, i, alpha, xNoise+1);
    pop();
    
    push();
    var rAngle = radians(90 - alpha);
    var pX = cos(radians(360-alpha))*lSize;
    var pY = -(size + sin(radians(alpha))*lSize);
    var rSize = size*sin(radians(alpha));
    
    translate(pX, pY);
    rotate(rAngle);
 
    drawSquare(rSize, i, alpha, xNoise+2);
    pop();
    
    //triangle above
    //fill(nextHue, saturation, brightness, treeOpacity);
    //triangle(0, -size, size, -size, pX, pY);
    
    noiseValue += noiseIncr;
  }
}