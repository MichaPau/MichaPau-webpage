function Population (srcData) {
  this.sourceData = srcData;
  this.populationCount = 30;
  this.population = [];
  this.matingPool = [];
  this.mutationRate = 0.1;
  this.generations = 0;
  //sort by totaFitness of the item
  this.populationCompare = function (a, b) {
    if(a.totalFitness > b.totalFitness) {return -1;}
    if(a.totalFitness < b.totalFitness) {return 1;}
    return 0;
  };
  //initial generation
  this.makeGeneration = function () {
    this.population = [];

    for (var i = 0; i < this.populationCount; i++) {
      var paintMap = new PaintMap(this.sourceData);
      paintMap.createSpots();
      paintMap.calcFitness();
      this.population.push(paintMap);
    }

    this.generations++;
    this.population.sort(this.populationCompare);

  };
  //same as Daniels example
  this.selection = function () {
    this.matingPool = [];
    var maxFitness = this.getMaxFitness();

    for (var i = 0; i < this.population.length; i++) {
      var fitnessNormal = map(this.population[i].totalFitness, 0, maxFitness, 0, 1);
      var n = floor(fitnessNormal * 5);
      for (var j = 0; j < n; j++) {
        this.matingPool.push(this.population[i]);
      }
    }
  };
  //slight adaption of daniels reproduction
  this.reproduction = function() {
    // Refill the population with children from the mating pool
    for (var i = 0; i < this.population.length; i++) {
      // Sping the wheel of fortune to pick two parents
      var m = floor(random(this.matingPool.length));
      var d = floor(random(this.matingPool.length));
      // Pick two parents
      var mom = this.matingPool[m];
      var dad = this.matingPool[d];

      // Mate their genes
      var child = mom.crossover(dad);
      // Mutate their genes
      child.mutate(this.mutationRate);
      child.calcFitness();
      if(child.totalFitness === child.spotCount) {
        child.createSpots();
      }
      // Fill the new population with the new child
      this.population[i] = child;
    }

    this.generations++;
    this.population.sort(this.populationCompare);

  };
  //display the grey-scale color maps besides the original image
  this.display = function (xPos, yPos) {
    for (var i = 0; i < this.population.length; i++) {
      //this.population[i].calcFitness();
      this.population[i].displayColors(xPos, yPos+(i*22));
    }
  };

  this.drawSpots = function(xPos, yPos) {
    for (var i = this.population.length - 1; i >= 0; i--) {
      //this.population[i].calcFitness();
      this.population[i].displayMe(xPos, yPos);
    }
  };
  //it's sorted by fitness so
  this.getFittest = function () {
    return this.population[0];
  };
  this.getMaxFitness = function() {
    var record = 0;
    for (var i = 0; i < this.population.length; i++) {
      if (this.population[i].totalFitness > record) {
        record = this.population[i].totalFitness;
      }
    }
    return record;
  };

}
