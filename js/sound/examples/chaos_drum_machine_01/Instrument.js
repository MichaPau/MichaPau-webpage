
function Instrument(attack, decay, sustain, release, harmonic1, harmonic2) {

  this.env = new maximJs.maxiEnv();
  this.env.setAttack(attack);
  this.env.setDecay(decay);
  this.env.setSustain(sustain);
  this.env.setRelease(release);
  this.osc1 = new maximJs.maxiOsc();
  //my computer freakes out with too much oscilators so use harmonics only for the root element
  if(harmonic1 !== undefined)
    this.osc2 = new maximJs.maxiOsc();
  if(harmonic2 !== undefined)
    this.osc3 = new maximJs.maxiOsc();
  this.oscVol1 = 1;
  this.oscVol2 = 1;
  this.oscVol3 = 1;
  this.attack = attack;
  this.decay = decay;
  this.sustain = sustain;
  this.release = release;
  this.harmonic1 = harmonic1;
  this.harmonic2 = harmonic2;
  this.oscType1 = "sinewave";
  this.oscType2 = "sinewave";
  this.oscType3 = "sinewave";

  this.play = function (freq1) {
    //var out = this.osc1.sinewave(freq1)*this.osc1Vol*this.env.adsr(1, this.env.trigger);
    var out = this.osc1[this.oscType1](freq1)*this.env.adsr(1, this.env.trigger)*this.oscVol1;
    if(this.harmonic1 !== undefined) {
      var f = freq1 * (Math.pow(Math.pow(2, 1/12),this.harmonic1));
      out += this.osc2[this.oscType2](f)*this.oscVol2*this.env.adsr(1, this.env.trigger);
    }
    if(this.harmonic2 !== undefined) {
      var f = freq1 * (Math.pow(Math.pow(2, 1/12),this.harmonic2));
      out += this.osc3[this.oscType3](f)*this.oscVol3*this.env.adsr(1, this.env.trigger);
    }

    return out*this.oscVol1;
  };

}
