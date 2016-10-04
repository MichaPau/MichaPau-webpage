---
sitemap: exclude
---

var map = function(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};
//utils
//init random nois value
var noiseV = Math.round(map(Math.random(), 0, 1, 0, 2000));
noise.seed(noiseV);

//Harmonograh variables - they actually create the sounds
var f1 = 1; //x-axis
var f2 = 1; //y-axis

var f3 = 1;
var f4 = 1;
//visually it changes the perspective - but what does it realy?
var p1 = 1;
var p2 = 1;
var p3 = 1;
var p4 = 1;

//amplitude - this one is clear
var a1 = 100;
var a2 = 100;
var a3 = 100;
var a4 = 100;

//dumping - this one as well
var d1 = 0;
var d2 = 0;
var d3 = 0;
var d4 = 0;

var counter = 0;
//maxiLib
var maxiAudio = new maximJs.maxiAudio();

var clock = new maximJs.maxiClock();
var maxiSample = new maximJs.maxiSample();
var maxiSample2 = new maximJs.maxiSample();

var osc1 = new maximJs.maxiOsc();
var osc2 = new maximJs.maxiOsc();
var osc3 = new maximJs.maxiOsc();
var osc4 = new maximJs.maxiOsc();

var osc5 = new maximJs.maxiOsc();

//clocks do rock
var clockTicks = 6;
clock.setTicksPerBeat(clockTicks);
clock.setTempo(30);

maxiAudio.init();
maxiAudio.setBufferSize(1024);
maxiAudio.loadSample("{{site.baseurl}}/assets/sounds/snare_01.wav", maxiSample);
maxiAudio.loadSample("{{site.baseurl}}/assets/sounds/snare_02.wav", maxiSample2);
maxiAudio.outputIsArray(true, 2);

//maxiLib variables
var output = 0;
var out1 = 0;
var out2 = 0;
var out3 = 0;
var out4 = 0;
var sOut = 0;
var sOut2 = 0;
var clockPlayhead = 0;
var f3Ratio = 1;
var voidFlag = false;
var sawManip = 30;

maxiAudio.play = function () {

  if (maxiSample.isReady && maxiSample2.isReady) {
    clock.ticker();

    if(clock.tick) {
      //rhythm trigger
      if(clockPlayhead%clockTicks === 0) {
        maxiSample.trigger();
        //come out from nothingness
        if(voidFlag)
          voidFlag = false;

      }
      if(clockPlayhead%clockTicks === 3 && Math.random() > 0.6) {
        //sometimes nothing more longer
        if(Math.random() > 0.9) {
          voidFlag = true;
        }
        maxiSample2.trigger();

      }
      //marching snare
      if(clockPlayhead%clockTicks === 4 && Math.random() > 0.6) {
        maxiSample2.trigger();

      }
      //sometimes nothing for a short period
      if(clockPlayhead%clockTicks === 5 && Math.random() > 0.6) {
        voidFlag = true;
        //nothing changes the saw wave freq
        if(Math.random() > 0.5) {
          sawManip = map(Math.random(), 0, 1, 1, 50);
        }

      }
      //sometimes the f3 frea ratio changes - see draw function
      if(clockPlayhead%clockTicks === 3) {
        f3Ratio = Math.round(map(Math.random(), 0, 1, -2, 2));
        //console.log(f3Ratio);
      }
      clockPlayhead++;
    }

    //the samples
    sOut = maxiSample.playOnce(1)*5;
    sOut2 = maxiSample2.playOnce()*2;

    //the sounds
    out1 = osc1.sinewave(f1*100);
    out2 = osc2.sawn((f2*100)*osc5.sinewave(sawManip));
    out3 = osc3.sinewave(f3*100);
    out4 = osc4.sinewave(f4*100);

    output = (out1 + out2*0.3 + out3 + out4 + sOut + sOut2)*0.25;

    maxiAudio.output[0] = output;
    maxiAudio.output[1] = output;
  }
}
//canvas stuff
var c = document.getElementById("canvas");
var ctx = c.getContext('2d');

var cWidth = c.width;
var cHeight = c.height;
ctx.translate(cWidth/2, cHeight/2);
ctx.strokeStyle = "#FFFFFF";

//button click handler
function resetNoiseSeed() {
  console.log(noiseV);
  noiseV = Math.round(map(Math.random(), 0, 1, 0, 2000));
  noise.seed(noiseV);
  console.log(noiseV);
}

//the draw fuction
function draw() {

  //noising around the f1 value
  var value = map(noise.simplex2(noiseV, 0), 0, 1, 0.5, 4);
  noiseV += 0.0001;

  //if nothing than nothing
  if(!voidFlag) {
    f1 = value+sOut;
    f2 = value*0.5;
    //f1 = f2 = counter/10;
    f3 = value*f3Ratio+sOut2;
    f4 = map(noise.simplex2(noiseV, 0), 0, 1, 0.1, 2);
  } else {
    f1 = f2 = f3 = f4 = 0;
  }

  //dancing a bit the perspectiv
  p1 = p2 = counter;
  p3 = p4 = counter*-1;
  ctx.clear(true);

  //general sound output sets the stroke color
  var cValue = Math.abs(Math.round(map(output, -1, 1, -255, 255)));
  var cStr = "rgb("+cValue+","+cValue+","+cValue+")";

  ctx.strokeStyle = cStr;
  ctx.beginPath();
  for(var t=1; t < 170; t+=0.01) {

    //https://en.wikipedia.org/wiki/Harmonograph
    var x = a1*(Math.pow(Math.E, (d1*t*-1))*Math.sin(t*f1+p1)) + a2*(Math.pow(Math.E, (d2*t*-1))*Math.sin(t*f2+p2));
    var y = a3*(Math.pow(Math.E, (d3*t*-1))*Math.cos(t*f3+p3)) + a4*(Math.pow(Math.E, (d4*t*-1))*Math.cos(t*f4+p4));

    //move paper - is this right?
    //x += a1*(Math.pow(Math.E, (d1*t*-1))*Math.cos(t*f1+p1)) + a2*(Math.pow(Math.E, (d2*t*-1))*Math.cos(t*f2+p2));
    //y += a1*(Math.pow(Math.E, (d1*t*-1))*Math.cos(t*f1+p1)) + a2*(Math.pow(Math.E, (d2*t*-1))*Math.cos(t*f2+p2));
    //x *= 100;
    //y *= 100;
    if(t == 1) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  //ctx.closePath();

  ctx.stroke();

  ctx.strokeStyle = 'rgb(250, 250, 250)';
  ctx.strokeText(f1.toFixed(3)+":"+f2.toFixed(3)+":"+f3.toFixed(3)+":"+f4.toFixed(3), -cWidth/2 + 10, cHeight/2 - 30);
  ctx.strokeText(sawManip.toFixed(3), cWidth/2 - 50, cHeight/2 - 30);

  counter += 0.005;

  //please give me the next frame
  window.requestAnimationFrame(draw);
}

//helper to preserve transform
//http://stackoverflow.com/a/9722502/1456318
CanvasRenderingContext2D.prototype.clear =
CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
  if (preserveTransform) {
    this.save();
    this.setTransform(1, 0, 0, 1, 0, 0);
  }

  this.clearRect(0, 0, this.canvas.width, this.canvas.height);

  if (preserveTransform) {
    this.restore();
  }
};


window.requestAnimationFrame(draw);
