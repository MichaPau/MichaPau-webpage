function Pattern() {

  //limit to 4
  this.maxgenerations = 4;
  this.sizeRatio = 0.5;
  this.items = [];
  this.startAngle = 0;
  this.angleNoise = 0;

  //sets the rotation value back to 0 but keeps rotation direction if any
  this.clearRotation = function () {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      item.rotation = 0;
    }
  };

  //recursively create the items and add them to an array
  this.create = function (pos, radius, color, generation, p) {
      var item = new Item(pos, radius, color, generation, p);
      if(p) {
        p.childs.push(item);
      }

      this.items.push(item);
      if(++generation <= this.maxgenerations) {
        //four subitems for every item
        var angle = this.startAngle;
        for(var i = 0; i < 4; i++) {
          var posX = sin(radians(angle))*radius/2;
          var posY = cos(radians(angle))*radius/2;
          var posV = createVector(pos.x + posX, pos.y + posY);
          this.create(posV, radius*this.sizeRatio, color-30, generation, item);
          angle += 90;
        }
      }
  };

  //just go through all items and render them
  this.render = function () {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      item.render();
    }
  };
  //just go through all items and update them
  this.update = function () {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      item.update(this.sizeRatio);
    }
  };
}
