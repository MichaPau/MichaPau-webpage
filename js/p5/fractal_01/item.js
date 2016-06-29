function Item(pos, radius, color, generation, p) {
  
  this.pos = pos.copy();
  this.radius = radius;
  this.colorValue = color;
  this.rotation = 0;
  this.rotationSpeed = (generation+1)/2;
  this.rotationDir = 1;
  this.generation = generation;
  //everything is linked
  this.parent = p;
  this.childs = [];

  this.rNoise = random(2000);

  this.update = function (sR) {
    //-1 rotate left, +1 rotate right, 0 don't rotate()
    //add a grater value than 1 to the mapped values so it rotates more often
    this.rotationDir = round(map(noise(this.rNoise), 0, 1, -1.4, 1.4));
    this.rotation += this.rotationSpeed * this.rotationDir;

    var angle = this.rotation;

    //the pattern is four items around the item
    for (var i = 0; i < this.childs.length; i++) {
      var posX = cos(radians(angle))*this.radius*sR;
      var posY = sin(radians(angle))*this.radius*sR;
      var posV = createVector(this.pos.x + posX, this.pos.y + posY);
      this.childs[i].pos = posV;
      this.childs[i].radius = this.radius*sR;
      angle += 90;
    }
    this.rNoise += 0.003;
  }
  this.render = function () {
    noFill();
    stroke(this.colorValue);
    push();
    translate(this.pos.x, this.pos.y);
    var rot = this.rotation;

    rotate(radians(rot));
    //Dependencies are not good - drawType is a slider in sketch.js
    //TODO - add some kind of class variable to this class
    if(drawType.value() === "CIRCLES")
      ellipse(0, 0, this.radius, this.radius);
    else
      rect(-this.radius/2, - this.radius/2, this.radius, this.radius);

    pop();
  };
}
