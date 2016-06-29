//custom
var playing = true;

//maxiLib
var maximJs;

var maxiAudio = new maximJs.maxiAudio();

var osc1 = new maximJs.maxiOsc();
var osc2 = new maximJs.maxiOsc();
var osc3 = new maximJs.maxiOsc();
var osc4 = new maximJs.maxiOsc();
var osc5 = new maximJs.maxiOsc();

var phasor1 = new maximJs.maxiOsc();
var phasor2 = new maximJs.maxiOsc();
var phasor3 = new maximJs.maxiOsc();

var freq1 = 110;
var freq2 = 107;

//funny name it's just a tone
var chorusFlag = false;

initVisual(document.querySelector("#drawCanvas"), 400, 200, 2048);
/*window.onload = function () {

}*/

maxiAudio.init();
maxiAudio.setBufferSize(2048);
maxiAudio.outputIsArray(true, 2);

var t = performance.now();
maxiAudio.play = function () {
  if (playing) {

    //the base frequency
    var f1 = osc1.sinewave(freq1);
    //alter the amplitude of the slighly deeper frequency to get the slow beat changing
    var f2 = osc2.sinewave(freq2)*phasor1.phasor(0.1, 0.01, 1);

    //add another frequency altering the amplitude 10x faster
    var f3 = osc4.sinewave(220)*phasor2.phasor(1, 0.01, 1);

    var f4 = 0;
    if (chorusFlag) {
      f4 = osc5.sinewave(880)*phasor3.phasor(0.09, 0.005, 0.1);
    }

    //add them together
    var output = f1 + f2 + f3 + f4;

    output = map(output, -2.0, 2.0, -1.0, 1.0);
    //add a hight tone every other 10 seconds
    if (performance.now() - t > 10000) {
      t = performance.now();
      chorusFlag = !chorusFlag;
      if (chorusFlag) {
        phasor3 = new maximJs.maxiOsc();
      }
    }

    setDrawOutput(output);

  } else {
    var output = 0.0;
  }
  maxiAudio.output[0] = output;
  maxiAudio.output[1] = output;
};

var map = function(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};
function togglePlay() {
  playing = !playing;
}
