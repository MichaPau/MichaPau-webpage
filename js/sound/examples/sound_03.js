---
sitemap: exclude
---
var map = function(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};
//visual
var bufferSize = 2048;
var drawOutput = new Array(bufferSize);

var fft = new maximJs.maxiFFT();
fft.setup(bufferSize, 512, 256);

//custom
var playing = true;
var playHead = 0;
var beatTicks = 16;
//maxiLib
var maxiAudio = new maximJs.maxiAudio();

var maxiSample = new maximJs.maxiSample();
var maxiSample2 = new maximJs.maxiSample();
var splashSample = new maximJs.maxiSample();
var windSample = new maximJs.maxiSample();

var clock = new maximJs.maxiClock();
var melodyClock = new maximJs.maxiClock();
var debugClock = new maximJs.maxiClock();

var osc1 = new maximJs.maxiOsc();
var osc2 = new maximJs.maxiOsc();
var osc3 = new maximJs.maxiOsc();

var pitchFilter = new maximJs.maxiFilter();
var waveFilter = new maximJs.maxiFilter();

var noiseV = Math.random();
var cutoff = map(noise.simplex2(noiseV, 0), -1, 1, 200, 2000);


initVisual(document.querySelector("#drawCanvas"), document.querySelector("#fftCanvas"), 600, 200, bufferSize);

maxiAudio.init();
maxiAudio.setBufferSize(2048);
maxiAudio.outputIsArray(true, 2);

debugClock.setTicksPerBeat(1);
debugClock.setTempo(120);

clock.setTicksPerBeat(beatTicks);
clock.setTempo(30);

melodyClock.setTicksPerBeat(beatTicks);
melodyClock.setTempo(30);

maxiAudio.loadSample("{{site.baseurl}}/assets/sounds/foam-pluck.wav", maxiSample);
//maxiAudio.loadSample("assets/sounds/ruler-vibration.wav", maxiSample);
maxiAudio.loadSample("{{site.baseurl}}/assets/sounds/rubber-band2.wav", maxiSample2);
maxiAudio.loadSample("{{site.baseurl}}/assets/sounds/eel-fishing.wav", splashSample);
maxiAudio.loadSample("{{site.baseurl}}/assets/sounds/wind-howling.wav", windSample);

var wave = 0;
var freq = 120;
var freqs = [200, 300, 400, 300, 120, 540, 300, 270, 180];
var counter = 0;

var sampleOut = 0;
var sampleOut2 = 0;
var splashOut = 0;
var windOut = 0;
var sample1Gain = 0.5;
var splashSpeed = 0;
var windSpeed = 0;
maxiAudio.play = function () {

  if (playing && maxiSample.isReady && maxiSample2.isReady && splashSample.isReady && windSample.isReady) {

    clock.ticker();
    melodyClock.ticker();
    debugClock.ticker();

    if(melodyClock.tick) {
      freq = freqs[counter%8];
      counter++;
    }

    if(clock.tick) {
      if(playHead%beatTicks == 0) {
        cutoff = map(noise.simplex2(noiseV, 0), -1, 1, 200, 2000);
        noiseV += 0.05;
      }

      if(playHead%beatTicks == 0 && Math.random() > 0.75) {
        splashSpeed = map(Math.random(),0,1,0,2);
        //console.log("spashSpeed:"+splashSpeed);
        splashSample.trigger();
      }
      if(playHead%beatTicks == 9 && Math.random() > 0.75) {
        windSpeed = map(Math.random(),0,1,0,10);
        //console.log("windSpeed:"+windSpeed);
        windSample.trigger();
      }
      if(playHead%beatTicks == 0 || playHead%beatTicks == 6 || playHead%beatTicks == 10) {
        maxiSample.trigger();
      }
      if(playHead%beatTicks == 1 && Math.random() < 0.33) {
        maxiSample.trigger();
        sample1Gain = 2;
      } else {
        sample1Gain = 1;
      }
      if(playHead%beatTicks == 3 || playHead%beatTicks == 13) {
        maxiSample2.trigger();
      }
      if((playHead%beatTicks == 14 || playHead%beatTicks == 15) && Math.random() > 0.4) {
        maxiSample2.trigger();
      }
      playHead++;
    }

    sampleOut = maxiSample.playOnce() * 2;
    sampleOut2 = maxiSample2.playOnce()* 5;
    splashOut = splashSample.playOnce(splashSpeed) *0.5;
    windOut = windSample.playOnce(windSpeed) * 1;

    //wave = osc1.sinewave(220)*0.5;
    var res = 10;
    var lf = pitchFilter.lopass(freq, 0.05);
    /*var c = osc3.phasor(0.5, 0.01, 0.05);
    var lf = Math.round(pitchFilter.lopass(freq, c));
    if(debugClock.tick) {
      console.log("phasor value:"+lf);
    }*/

    //var cutoff = osc2.phasor(0.3, 100, 2000);

    wave = waveFilter.lores(osc1.sawn(lf), cutoff, res);

    o = (wave*0.5 + sampleOut + sampleOut2 + splashOut + windOut)*0.5;
    o = Math.min(Math.max(o, -1), 1);
    if (fft.process(o)) {
      fft.magsToDB();
    }
    setDrawOutput(o);

  } else {
    o = 0.0;
  }
  //this.output = o;
  maxiAudio.output[0] = o;
  maxiAudio.output[1] = o;
};

//helper

function togglePlay() {
  playing = !playing;
}
