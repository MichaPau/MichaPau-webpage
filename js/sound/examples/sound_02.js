var bufferSize = 2048;
var drawOutput = new Array(bufferSize);

//custom
var playing = true;

//maxiLib
var maxiAudio = new maximJs.maxiAudio();
var carrierClock = new maximJs.maxiClock();
var modClock = new maximJs.maxiClock();
var indexClock = new maximJs.maxiClock();
var switchClock = new maximJs.maxiClock();

var osc1 = new maximJs.maxiOsc();
var osc2 = new maximJs.maxiOsc();
var osc3 = new maximJs.maxiOsc();
var osc4 = new maximJs.maxiOsc();
var osc5 = new maximJs.maxiOsc();

initVisual(document.querySelector("#drawCanvas"), document.querySelector("#fftCanvas"), 600, 200, bufferSize);


maxiAudio.init();
maxiAudio.setBufferSize(bufferSize);
maxiAudio.outputIsArray(true, 2);


//set up some clocks
carrierClock.setTicksPerBeat(4);
carrierClock.setTempo(60); //beats per minute
switchClock.setTicksPerBeat(1);
switchClock.setTempo(5); //beats per minute
modClock.setTicksPerBeat(1);
modClock.setTempo(60); //beats per minute
indexClock.setTicksPerBeat(1);
indexClock.setTempo(20); //beats per minute

var fft = new maximJs.maxiFFT();
fft.setup(bufferSize, 512, 256);

//init the st
var carrier = 79;
var freqs = [200, 300, 400, 300, 120, 540, 300, 270]; //still using mikes melody from the video - but I like it
//var saws = [440, 440, 440, 800, 800, 300, 440, 400];
var saws = [196, 196, 196, 293, 293, 1975, 196, 185]; //some interuptions of the main melody
var f = freqs[0];
var mIndexes = [400, 1000, 1500, 600];
var mods = [78, 81];
var mod = mods[0];
var mCounter = 0;
var iCounter = 0;
var fCounter = 0;
var mIndex = mIndexes[0];
var switchFlag = false;
maxiAudio.play = function () {

  var output, wave, melody;

  //all together
  carrierClock.ticker();
  modClock.ticker();
  indexClock.ticker();
  switchClock.ticker();

  //actually its not the carrier but the melody
  //for that thick it switches the melody line and waveform
  //sets a new tempo that the normaly melody is longer than the ugly sound
  if(carrierClock.tick) {
    if(!switchFlag) {
      switchClock.setTempo(5);
      f = freqs[++fCounter%8];
    } else {
      switchClock.setTempo(10);
      f = saws[++fCounter%8];
    }
  }
  //sets the modulator frequency - one up or down the frequency to have a vibrato
  if(modClock.tick) {
    mod = mods[++mCounter%2];
  }
  //sets the mosulator index
  if(indexClock.tick) {
    mIndex = mIndexes[++iCounter%4];
  }
  //tick the switch and switch the tick
  if(switchClock.tick) {
    switchFlag = !switchFlag;
    fCounter = 0;
  }
  if (playing) {
    //creates some kind of bass line modulation
    wave = osc2.sinewave(carrier + osc3.sinewave(mod)*mIndex);
    melody = osc1.sinewave(f);
    if(!switchFlag) {

    } else {
      melody += osc4.square(f)*0.2;
      melody *= 0.5;
    }

    output = (wave + melody)/2;
    //output = map(output, -2.0, 2.0, -0.5, 0.5);
    if (fft.process(output)) {
      fft.magsToDB();
    }
    setDrawOutput(output);

  } else {
    output = 0.0;
  }
  //this.output = o;
  maxiAudio.output[0] = output;
  maxiAudio.output[1] = output;
};

//helper
var map = function(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};
function togglePlay() {
  playing = !playing;
}


//visual0.3
var canvas;
var fftCanvas;
var context;
var fftContext;
var counter;
var spacing;
var canvasWidth;
var canvasHeight;
var bSize;
var outputValue = 0;
function initVisual(c, fftc, width, height, bS) {

  bSize = bS || 1024;
  drawOutput = new Array(bSize);
  canvas = c;
  fftCanvas = fftc;
  canvasWidth = width;
  canvasHeight = height;

  context = canvas.getContext("2d");
  fftContext = fftCanvas.getContext("2d");

  canvas.setAttribute("width", canvasWidth);
  canvas.setAttribute("height", canvasHeight);

  fftCanvas.setAttribute("width", canvasWidth);
  fftCanvas.setAttribute("height", canvasHeight);

  spacing = canvasWidth / bSize;

  counter = 0;

  window.requestAnimationFrame(draw);
  //setInterval(draw, 10);
}

function setDrawOutput(output) {
  counter++;
  outputValue = output;
  drawOutput[counter%bSize] = output;
}
function draw() {
  context.clearRect(0,0, canvasWidth, canvasHeight);
  context.strokeStyle = "#007FFF";
  context.beginPath();
  context.moveTo(i*spacing, canvasHeight/2+(drawOutput[0]*canvasHeight/4));

  for (var i=1;i<bufferSize;i++) {
    context.lineTo(i*spacing, canvasHeight/2+(drawOutput[i]*canvasHeight/4));
  }

  var drawOutputValue = Math.abs(outputValue);
  var rectWidth = canvasWidth - 40;
  var outWidth = Math.min(rectWidth*drawOutputValue, rectWidth);
  context.stroke();
  context.closePath();
  context.strokeStyle = "#FFFFFF";
  context.strokeRect(20, canvasHeight - 20, canvasWidth - 40, 10);
  if (drawOutputValue <= 0.5) {
    context.fillStyle = "#00FF00";
  } else if (drawOutputValue > 1.0) {
    context.fillStyle = "#FF0000";
  } else {
    var g = context.createLinearGradient(0, 0, outWidth, 0);
    var gStop = 1 - (Math.min(drawOutputValue, 1) - 0.5);
    var oStop;
    if (drawOutputValue <= 1) {
      oStop = 1;
    }

    g.addColorStop(gStop, "#00FF00");
    g.addColorStop(oStop, "#FFA500");
    context.fillStyle = g;
  }

  context.fillRect(20, canvasHeight - 20, outWidth, 10);
  context.strokeText("Output: " + parseFloat(outputValue).toFixed(2), 20, canvasHeight - 25);


  //spectrum
  fftContext.clearRect(0,0, canvasWidth, canvasHeight);

  for (var i = 0; i < bSize/2; i++) {
    fftContext.beginPath();
    fftContext.strokeStyle = "#FF0000";
    fftContext.moveTo(i*spacing*2, canvasHeight-2);
    fftContext.lineTo(i*spacing*2, canvasHeight-2-fft.getMagnitude(i));
    fftContext.stroke();
    fftContext.closePath();
  }


  window.requestAnimationFrame(draw);
}
