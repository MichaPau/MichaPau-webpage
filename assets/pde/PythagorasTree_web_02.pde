
float baseWidth = 50;
int maxIterations = 9;
float yNoise = 0;
float hue, saturation, brightness;
float hueFrom;
float hueTo;
float hueStep;
float treeOpacity = 255;

float noiseValue = 0.0;
float noiseIncr = 0.002;


//hue calculation - Hue(E) = ( Hue(B)*y/a + Hue(A)*(1-y/a) ) * (x/a)  +  ( Hue(D)*y/a + Hue(C)*(1-y/a) ) * (1-x/a)
//from - http://stackoverflow.com/questions/1106959/how-do-i-calculate-a-four-colour-gradient
void setup () {
  size(400, 400, P2D);
  background(#000000);
  smooth();
  colorMode(HSB, 360, 100, 100);
 
  hueFrom = 180;
  hueTo = 240;

  hueStep = (hueTo - hueFrom)/(maxIterations+1);
  saturation = 100;
  brightness = 80;
  
  frameRate(60);
}

void draw() {
  //fill(0, 0, 0, 70);
  //rect(0, 0, width, height);
  background(0);
  maxIterations = int(map(noise(yNoise), 0, 1, 3, 5));
  //maxIterations = 4;
  float mX, mY;
  if(mouseX == 0) {
    mX = 228;
    mY = 16;
  } else {
    mX = mouseX;
    mY = mouseY;
  }
  hueFrom = map(mX, 0, width, 0, 360);
  hueTo = map(mY, 0, height, 0, 360);
  
  hueStep = (hueTo - hueFrom)/(maxIterations+1);
  
  baseWidth = int(map(noise(yNoise), 0, 1, 45, 80));
  
  translate(width/2 - baseWidth/2, height-2);
  
  stroke(255, 255, 255);
  strokeWeight(2);
  drawSquare(baseWidth, 0, 0, 0);
  
  yNoise += 0.007;
  
  filter(BLUR, 1);
  
}

void drawSquare(float size, int i, float angle, float xNoise) {
  
  float thisHue = (i*hueStep) + hueFrom;
  float nextHue = ((i+1)*hueStep) + hueFrom;
  
  //stroke(#FFFFFF);
  noStroke();
  pushMatrix();
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
  popMatrix();
  xNoise += 0.1;
  if(++i <= maxIterations) {
    
    float alpha = map(noise(xNoise, yNoise), 0, 1, 0, 90);
    pushMatrix();
    float lAngle = radians(-alpha);
    translate(0, -size);
    rotate(lAngle);
    
    float lSize = size*cos(radians(alpha));
    drawSquare(lSize, i, alpha, xNoise+1);
    popMatrix();
    
    pushMatrix();
    float rAngle = radians(90 - alpha);
    float pX = cos(radians(360-alpha))*lSize;
    float pY = -(size + sin(radians(alpha))*lSize);
    float rSize = size*sin(radians(alpha));
    
    translate(pX, pY);
    rotate(rAngle);
 
    drawSquare(rSize, i, alpha, xNoise+2);
    popMatrix();
    
    //triangle above
    //fill(nextHue, saturation, brightness, treeOpacity);
    //triangle(0, -size, size, -size, pX, pY);
    
    noiseValue += noiseIncr;
  }
}