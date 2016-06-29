
float angle;
float startAngle;
int radius;
float step;
float frequency = 0.1;
float colorWidth;
float colorCenter;


void setup() {
  size(400, 400);
  smooth(16);
  frameRate(30);
  background(0);
  stroke(255);
  strokeWeight(0.2);
 
  colorWidth = 127;
  colorCenter = 128;
  radius = 10;
  startAngle = -90;
  angle = startAngle;
  step = 0;
  
}

void draw() {
  background(0);
  translate(width/2, height/2+10);
 
 if(startAngle >= 360) {
    startAngle = 0 + (startAngle - 360);
  }
  angle = startAngle;
  float colorLen = map(startAngle, 0, 360, 0, 50);
  float red   = sin(frequency*colorLen + 0) * colorWidth + colorCenter;
  float green = sin((frequency)*colorLen + 0) * colorWidth + colorCenter;
  float blue  = sin((frequency*6)*colorLen + 0) * colorWidth + colorCenter;
  stroke(255);
  fill(red, green, blue, 15);
   
  for(int r=width/2; r >= radius; r*=0.95) {
    drawPentagon(r, angle);
    angle += step;
  }
  
  noStroke();
  fill(0);
  drawPentagon(radius-5, angle);
 
  startAngle+=0.5;
  float stepSize;
  if(mouseX != 0)
    stepSize = map(mouseX, 0, width, -1, 1);
  else 
    stepSize = 0.2;
    
  step+=stepSize;
  //step+=0.42;
   
}

void drawPentagon(float r, float _startAngle) {
  
  beginShape();
  for(int i = 0; i < 5; i++) {
    float xPos = r*cos(radians(_startAngle));
    float yPos = r*sin(radians(_startAngle));
    vertex(xPos, yPos);
    _startAngle+=72;
  }
  endShape(CLOSE);
}