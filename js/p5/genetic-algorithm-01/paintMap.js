function PaintMap () {

  //number of spots in each map
  this.spotCount = 20;
  //some constraints
  this.spotMaxWidth = 30;
  this.spotMaxHeight = 30;
  this.spotMinWidth = 1;
  this.spotMinHeight = 1;
  this.totalFitness = 0;
  this.colorTolerance = 5;
  //draw it with some tolerance (1 == max)
  this.drawTolerance = 0.6;

  this.spots = [];

  this.fitnessCompare = function (a, b) {
    if(a.fitness > b.fitness) {return -1;}
    if(a.fitness < b.fitness) {return 1;}
    return 0;
  };

  //create random spots
  this.createSpots = function () {
    this.spots = [];

    for(var i = 0; i < this.spotCount; i++) {
      var cR = new ColorRect();

      cR.w = round(random(this.spotMinWidth, this.spotMaxWidth));
      cR.h = round(random(this.spotMinHeight, this.spotMaxHeight));
      cR.x = round(random(cR.w/2, img.width - cR.w/2));
      cR.y = round(random(cR.h/2, img.height - cR.h/2));

      cR.brightness = round(random(0, 256));
      this.spots.push(cR);

    }
  };

  //mutate
  this.mutate = function (rate) {
    for (var i = 0; i < this.spots.length; i++) {
      if(random(1) < rate) {
        var cR = new ColorRect();
        //only mutate when not perfect score
        if(this.spots[i].fitness < 1) {

          cR.w = round(random(this.spotMinWidth, this.spotMaxWidth));
          cR.h = round(random(this.spotMinHeight, this.spotMaxHeight));
          cR.x = round(random(cR.w/2, img.width - cR.w/2));
          cR.y = round(random(cR.h/2, img.height - cR.h/2));
          cR.brightness = round(random(0, 256));

          cR.mutated = true;
          this.spots[i] = cR;
        } else {
          this.spots[i].mutated = false;
        }
      } else {
        this.spots[i].mutated = false;
      }
    }//end for
  };
  //calculate fitness
  this.calcFitness = function () {
    this.totalFitness = 0
    for (var i = 0; i < this.spots.length; i++) {
      var item = this.spots[i];
      item.fitness = 0;
      var count = 0;
      for(var y = item.y; y < item.y+item.h; y++) {
        for(var x = item.x; x < item.x+item.w; x++) {
          //var loc = (x + y*img.width)*4; //it's the same actually
          var loc = (y*4)*img.width+x*4;
          //get the average of the rgb value to get its brightness(grey-scale) value
          var b = (img.pixels[loc] + img.pixels[loc+1] + img.pixels[loc+2])/3;
          if(Math.abs(round(b) - item.brightness) <= this.colorTolerance) {
            count++
          } else {
            count--;
          }
        }
      }
      //map between not one pixels match and all pixels match
      item.fitness = map(count, -(item.w*item.h), (item.w*item.h), 0, 1);
      this.totalFitness += item.fitness;
      //life is adaption - so let them adapt
      if(item.fitness < item.drawTolerance) {
        var newB = this.brightness + round(random(-20, 20));
        this.brightness = Math.min(Math.max(newB, 0), 255);
      }
    }
  };
  //crossover wich random break point
  this.crossover = function (dadMap) {
    var breakIndex = floor(random(1, this.spotCount -1));

    var childMap = new PaintMap();
    childMap.spots = this.spots.slice(0, breakIndex);
    childMap.spots = childMap.spots.concat(dadMap.spots.slice(breakIndex));

    for (var i = 0; i < childMap.spots.length; i++) {
      var childSpot = childMap.spots[i];

    }
    return childMap;
  };
  //this random one didn't work very well
  this.crossover2 = function (dadMap) {

    var childMap = new PaintMap();
    for(var i = 0; i < 10; i++) {
      childMap.spots[i] = this.spots[round(random(0, 19))];
      childMap.spots[i+10] = dadMap.spots[round(random(0, 19))];
    }
    return childMap;
  };

  //show the color/grey-scale map for each item in the population
  this.displayColors = function (xPos, yPos) {
    var dim = 9;
    stroke(0);
    strokeWeight(1);
    for (var i = 0; i < this.spots.length; i++) {
      var item = this.spots[i];
      //bold border if fitness is perfect - red when mutated
      if(item.fitness === 1) { strokeWeight(2) } else {strokeWeight(1)}
      if(!item.mutated) { stroke(0); } else { stroke("#FF0000"); }
      fill(item.brightness);
      rect(xPos + i*dim, yPos, dim, dim);
    }
    fill(0);
    stroke(0);
    strokeWeight(1);
    textAlign(LEFT, CENTER);
    text(this.totalFitness, xPos + dim*this.spots.length + 2, yPos + dim/2);

  };

  this.displayMe = function (xPos, yPos) {

    if(this.totalFitness > 1) {
      for (var j = 0; j < this.spots.length; j++) {
        var spot = this.spots[j];
        if(spot.fitness > this.drawTolerance) {

          noStroke();
          fill(spot.brightness);
          //random ellipse or rectangle
          (random(-1, 1) <= 0) ? ellipse(xPos + spot.x, yPos + spot.y, spot.w, spot.h) : rect(xPos + spot.x - spot.w/2, yPos + spot.y - spot.h/2, spot.w, spot.h);

          spot.drawCount++;

          //if it's show let it die and reincarnate
          spot.incarnateMe(this.spotMinWidth, this.spotMinHeight, this.spotMaxWidth, this.spotMaxHeight);
        }
      }
    }
  };
}

//this object is actually the DNA
function ColorRect () {
  this.x;
  this.y;
  this.width;
  this.height;
  this.brightness;
  this.fitness;
  this.drawCount = 0;
  this.mutated = false;

  //it can reincarnate itself - call it blasphemy - but it's more practical
  this.incarnateMe = function (minWidth, minHeight, maxWidth, maxHeight) {
    //console.log("incarnateMe");
    this.w = round(random(minWidth, maxWidth));
    this.h = round(random(minHeight, maxHeight));
    this.x = round(random(0, img.width - this.w));
    this.y = round(random(0, img.height - this.h));

    this.brightness = round(random(0, 256));
    this.mutated = false;
  }
  //debuging algorithms like gentic ones are actually kinda hard to debug
  this.logInfo = function () {
    console.log(this.x + ", " + this.y + " - " + this.w + ", " + this.h);
  }
}
