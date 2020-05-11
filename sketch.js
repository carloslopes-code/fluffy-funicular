let mySound;
let myEnvelope;
let grainSize;

let sizeSlider;

let lastGrain = 0;
let grainInterval = 50;

function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('assets/amen_break');
}

function setup() {
  // const c vai permitir-me adicionar a capacide drop ao meu canvas
  const c = createCanvas(800, 400);
  // gotFile é o nome da função que eu vou chamar
  c.drop(gotFile);
  // mimics the autoplay policy
  getAudioContext().suspend();
  
  let t1 = 0.0001; // attack time in seconds
  let l1 = 1.0; // attack level 0.0 to 1.0
  let t2 = grainSize; // decay time in seconds
  let l2 = 0.0; // decay level  0.0 to 1.0
  myEnvelope = new p5.Envelope(t1, l1, t2, l2);
  
  sizeSlider = createSlider(0.01, 1, 0.5, 0.01);
  sizeSlider.position(100, 350);
  sizeSlider.style('width', '500px');
}

function draw() {
  background(220);
  if(mySound.isLoaded()) {
    let peaks = mySound.getPeaks(width);
    translate(0, height * 0.5);
    stroke(10);
    for(let i = 0; i < peaks.length; i++) {
      line(i, peaks[i] * height * 0.5, i, peaks[i] * height * -0.5);
    }
  }
  
   if(mouseIsPressed) {
  translate(0, 0 - height*0.5);
  noStroke();
  fill(255,0,0);
  ellipse(mouseX, mouseY, 10, 10);
  } else {
  translate(0, 0 - height*0.5);
  noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 10, 10);
  }
  
  stroke(0);
  fill(100);
  rect(0, 350, width, height);
  noStroke();
  fill(255);
  text('Grain Size', sizeSlider.x, 380);
}

function mousePressed() {
  userStartAudio();
}

function mouseDragged() {
  const grainSize = sizeSlider.value();
  if(millis() > lastGrain + grainInterval) {
    let midiNote = 69 + (((mouseY - (height * 0.5)) / (height * 0.5)) * -12);
    let rate = midiToFreq(midiNote) / 440.;
    mySound.play(0, rate, 0.0, (mouseX / width) * mySound.duration(), grainSize);
    myEnvelope.play(mySound);
    lastGrain = millis();
  }
}

function gotFile(file) {
  if (file.type === 'audio') {
    mySound = loadSound(file);
    console.log('got new audio file');
  } else {
    console.log('Not an audio file!');
  }
}
