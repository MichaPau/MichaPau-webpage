function WindForce() {
	
	this.direction = createVector(0, 0);
	this.magnitude = 0;
	this.angle = 0;
	this.noiseA = random(1000);
	this.noiseM = random(1000);
	this.maxMag = 10;
	
	//simulate wind like force with noise values
	this.update = function () {
		
		this.angle = map(noise(this.noiseA), 0, 1, 0, 2*PI);
		this.magnitude = map(noise(this.noiseM), 0, 1, -this.maxMag/2, this.maxMag);
		
		if(this.magnitude < 0)
			this.magnitude = 0;
		
		this.direction = p5.Vector.fromAngle(this.angle);
		this.direction.normalize();
		this.noiseA += 0.005;
		this.noiseM += 0.01;
	}
	this.getForce = function () {
		var f = this.direction.copy();
		f.setMag(this.magnitude);
		return f;
	}
	this.display = function () {
		
		var dScale = 5;
		var h = this.direction.heading();
		var l = this.magnitude * dScale;
		
		//let's call it a windrose
		push();
		translate(this.maxMag*dScale/2+5, this.maxMag*dScale/2+5);
		rotate(h);
		stroke("#FFFFFF");
		noFill();
		ellipse(0, 0, this.maxMag*dScale, this.maxMag*dScale);
		line(-l/2, 0, l/2, 0);
		line(l/2, 0, l/2-(l/5), -l/5);
		line(l/2, 0, l/2-(l/5), l/5);
		pop();
	}
	
}