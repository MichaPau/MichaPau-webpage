function FireFly (x, y, b) {
	this.position = createVector(x, y);
	this.velocity = createVector(0, 0);
	this.acceleration = createVector(0, 0);
	this.brightness = b;
	
	//this.blinkBrightness = b; //blinking not implemented
	this.r = 5;
	this.maxspeed = 3;
	this.maxforce = 0.05;
	//some noise when they wander freely
	this.xoff = 0;
	this.yoff = 0;
	
	//max radius for mutual interaction
	this.viewradius = 200;
	
	this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  };
  
  //calculates the brightness in relation of all the distances
  this.calcBrightness = function(swarm, flocType) {
  	var dAll = 0;
  	var smallest = width;
  	var biggest = 0;
  	for(var i=0; i < swarm.length; i++) {
  		var dVector = p5.Vector.sub(swarm[i].position, this.position);
  		var d = dVector.mag();
  		if(d > biggest) biggest = d;
  		if(d < smallest) smallest = d;
  		
  		dAll += d;
  	}
  	
  	if(flocType === "1") {
  		//actually this is an inversion of the original firefly alg. - the brightest here is the most lonley... 
  		this.brightness = map((dAll/swarm.length), smallest, biggest, 0, 255);
  	} else {
  		this.brightness = map((dAll/swarm.length), biggest, smallest, 0, 255);
  	}
  };
  
  this.flock = function(swarm) {
  	
  	var sepForce = this.separate(swarm);
  	var attForce = this.attract(swarm);
  	
  	//fixed seperation value
  	this.applyForce(sepForce.mult(3));
  	this.applyForce(attForce);
  };
  
  //just wander randomly
  this.wander = function () {
  	var x = map(noise(this.xoff), 0, 1, -5, 5);
  	var y = map(noise(this.yoff), 0, 1, -5, 5);
  	this.xoff += random(0.05);
  	this.yoff += random(0.05);
  	return createVector(x, y);
  	//return createVector(random(-1, 1), random(-1, 1));
  }
	this.update = function () {
		this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
	};
	this.render = function () {
		push();
		translate(this.position.x, this.position.y);
		fill(this.brightness, 255, 0, this.brightness);
		var radius = this.brightness/20;
		ellipse(0, 0, radius, radius);
		pop();
	};
	this.borders = function() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  };
  
  //simplyfied firefly algorithem https://en.wikipedia.org/wiki/Firefly_algorithm
  this.attract = function (swarm) {
  	var seekArray = [];
  	for(var i = 0; i < swarm.length; i++) {
  		var f = swarm[i];
  		var d = p5.Vector.sub(swarm[i].position, this.position).mag();
  		if(f.brightness > this.brightness && d < this.viewradius) {
  			seekArray.push(f.position);
  		}
  	}
  	
  	if(seekArray.length >= 2) {
  		var seekVector = this.meanFromArray(seekArray);
  		return this.seek(seekVector);
  	} else if (seekArray.length === 0) {
  		//i am the brightest or just lonley - I wander for my own
  		return this.wander();
  	} else {
  		return seekArray[0];
  	}
  };
  
  //from daniel's flocking example
  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
   
    desired.normalize();
    desired.mult(this.maxspeed);
   
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  };
  this.flee = function(target) {
    var desired = p5.Vector.sub(this.position, target); // A vector pointing from the location to the target
   	var d = desired.mag();
   	if(d < this.viewradius) {
	    desired.normalize();
	    desired.mult(this.maxspeed);
	   
	    var steer = p5.Vector.sub(desired, this.velocity);
	    steer.limit(this.maxforce*3); // Flee is always stronger - the urge to life
	    //return steer;
	    this.applyForce(steer);
   	}
  };
  //from daniel's flocking example
  this.separate = function(boids) {
    var desiredseparation = this.radius;
    var steer = createVector(0, 0);
    var count = 0;
    // For every boid in the system, check if it's too close
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.position, boids[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  };
  
  //returns the mean vector from an array of vectors
  this.meanFromArray = function(v) {
	
		var m;
		var vector = v[0];
		for(var i = 1; i < v.length; i++) {
			var temp = v[i].copy();
			temp.add(vector);
			m = temp.mult(0.5);
			vector = m;
		}
		return m;
	};
} 