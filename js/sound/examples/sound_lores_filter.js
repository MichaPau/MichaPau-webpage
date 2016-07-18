var bufferSize = 2048;
var drawOutput = new Array(bufferSize);

//custom
var playing = true;
var phasorFlag = false;

//maxiLib
var maxiAudio = new maximJs.maxiAudio();
var clock = new maximJs.maxiClock();
var pitchFilter = new maximJs.maxiFilter();
var waveFilter = new maximJs.maxiFilter();

var osc1 = new maximJs.maxiOsc();
var osc2 = new maximJs.maxiOsc();
var osc3 = new maximJs.maxiOsc();
var osc4 = new maximJs.maxiOsc();
var osc5 = new maximJs.maxiOsc();
var osc6 = new maximJs.maxiOsc();

var value1Slider, value2Slider, value3Slider, value4Slider;
value1Slider = document.getElementById("value1Slider"); //cutoff Hz.
value2Slider = document.getElementById("value2Slider"); //resonance
value3Slider = document.getElementById("value3Slider"); //phasor freq
value4Slider = document.getElementById("value4Slider"); //phasor multiplier

initVisual(document.querySelector("#drawCanvas"), document.querySelector("#fftCanvas"), 600, 200, bufferSize);


maxiAudio.init();
console.log("after init:"+bufferSize);
maxiAudio.setBufferSize(bufferSize);
console.log("after setBufferSize");
maxiAudio.outputIsArray(true, 2);


clock.setTicksPerBeat(4);
clock.setTempo(120); //beats per minute
var fft = new maximJs.maxiFFT();
fft.setup(bufferSize, 512, 256);

var freq = 120;
var freqs = [200, 300, 400, 300, 120, 540, 300, 270, 180];
var counter = 0;

maxiAudio.play = function () {

  var wave;
  clock.ticker();
  if(clock.tick) {

    freq = freqs[counter%8];
    counter++;
  }

  if (playing) {

    var res = parseFloat(value2Slider.value);
    var lf = pitchFilter.lopass(freq, 0.05);

    if(phasorFlag) {
      var pTime = parseFloat(value3Slider.value);
      var pMulti = parseFloat(value4Slider.value);
      wave = waveFilter.lores(osc1.sawn(lf), 100 + osc2.phasor(pTime)*pMulti, res);
    } else {
      var cutoff = parseFloat(value1Slider.value);

      wave = waveFilter.lores(osc1.sawn(lf), cutoff, res);
    }
    //limit to -1 1 comment if not wanted
    wave = Math.min(Math.max(wave, -1), 1);


    if (fft.process(wave)) {
      fft.magsToDB();
    }
    setDrawOutput(wave);

  } else {
    wave = 0.0;
  }
  //this.output = o;
  maxiAudio.output[0] = wave;
  maxiAudio.output[1] = wave;
};


//helper
var map = function(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};
function togglePlay() {
  playing = !playing;
}
function changeValue(id, outId, value) {
  var inst = document.getElementById(id);
  inst.stepUp(value);
  document.getElementById(outId).value = inst.value;
}
function togglePhasor(input) {
  if(input.value === "fix") {
    phasorFlag = false;
    document.getElementById("cutoffDiv").style.display = "flex";
    document.getElementById("phasorDiv").style.display = "none";
  } else {
    phasorFlag = true;
    document.getElementById("cutoffDiv").style.display = "none";
    document.getElementById("phasorDiv").style.display = "flex";
  }
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
