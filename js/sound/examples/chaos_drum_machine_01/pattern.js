function Pattern() {

  //limit to 4
  this.maxgenerations = 2;
  this.sizeRatio = 0.5;
  this.items = [];
  this.startAngle = 0;
  this.angleNoise = 0;

  //double sinewave to have it more often
  this.oscTypes = ["sinewave", "sinewave", "triangle", "square", "saw", "sawn", "phasor"];
  //sets the rotation value back to 0 and resets a random oscilator type
  this.clearRotation = function () {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      item.rotation = 0;
      item.rotationDir = 0;
      var oscType = round(map(random(), 0, 1, 0, this.oscTypes.length-1));
      if(i !== 0)
        item.instrument.oscType1 = this.oscTypes[oscType];
    }
  };

  //recursively create the items and add them to an array
  this.create = function (pos, radius, color, generation, p, itemPos) {
      var item = new Item(pos, radius, color, generation, p);
      item.instrument = new Instrument(25, 200, 1, 700);
      var oscType = round(map(random(), 0, 1, 0, this.oscTypes.length-1));
      item.instrument.oscType1 = this.oscTypes[oscType];
      item.frequency = (generation*75)+itemPos*10;
      item.instrument.oscVol1 = 1/(generation+1);
      if(p) {
        p.childs.push(item);
      }
      //(itemPos+1)%3 &&  itemPos%2 === 0
      this.items.push(item);
      if((++generation <= this.maxgenerations && itemPos%2 === 0) || generation === 1) {
        //four subitems for every item
        var angle = this.startAngle;
        for(var i = 0; i < 4; i++) {
          var posX = sin(radians(angle))*radius/2;
          var posY = cos(radians(angle))*radius/2;
          var posV = createVector(pos.x + posX, pos.y + posY);
          this.create(posV, radius*this.sizeRatio, color-30, generation, item, i);
          angle += 90;
        }

        item.clock = new maximJs.maxiClock();
        item.clock.setTicksPerBeat(4);
        item.clock.setTempo((item.generation+1)*40);
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
