
void setup () {
   size(400, 400, P3D);
    background(#000000);
    smooth();
    colorMode(HSB, 360, 100, 100);
    
    translate(width/2 - 100, height-2);
    drawSquare(200);
}

void draw() {
  background(0);
  
  translate(width/2 - 100, height-2);
  drawSquare(200);
}

void drawSquare(float size) {
  translate(size/2, -size/2);
  fill(150, 100, 100);
  beginShape();
    vertex(-size/2, -size/2);
    vertex(size/2, -size/2);
    vertex(size/2, size/2);
    vertex(-size/2, size/2);
    vertex(-size/2, -size/2);
  endShape();
}