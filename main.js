//define canvas variables (below this thingy)
var interval = null;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); //So far so good, JS IS ALWAYS a problem in jams :(
var width = ctx.canvas.width;      // ← ADDED: width was missing!
var height = ctx.canvas.height;
var amplitude = 40;
var counter = 0;
let x = 0;                         // I DIDN'T READ THE JAM PROPERLY LOL, IT WAS MY FAULT
let y = 0;

function drawWave() {
    ctx.clearRect(0, 0, width, height);  
    x = 0;
    y = height/2;
    ctx.moveTo(x, y);  
    ctx.beginPath(); 

    counter = 0;
    interval = setInterval(line, 20);
}

function line() {
    y = height/2 + (amplitude * Math.sin(x * 2 * Math.PI * freq));
    ctx.lineTo(x, y);
    ctx.stroke();
    x = x + 1;
    counter++;
    if(counter > 50){
        clearInterval(interval);
    }
}

//audio stuff -- that stupid phobia where I keep checking if my old code works after adding new shtuff (is it just me?)
const input = document.getElementById('input');
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

notenames = new Map();
notenames.set("C", 216.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2 );
notenames.set("G", 392.0);
notenames.set("A", 440.0 );
notenames.set("B", 493.9);

// create Oscillator node

gainNode.gain.value = 0;

gainNode.connect(audioCtx.destination);

gainNode.gain.setValueAtTime(100, audioCtx.currentTime); // ← NOTE: still high, but keeping as-is per your request

gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);

//INSTRUCTIONS WERE A BIT CONFUSING IN THE JAM, IT INITIALLY DIDN'T WORK BUT I REFERRED MDN DOCS AND REALIZED THAT I HAD OT PUT THIS IN THE FUNCTION :(
function frequency(pitch, oscillator){
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    freq = pitch / 10000; //"that" function lol
}

function handle(){
    audioCtx.resume();

    const oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillator.connect(gainNode);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);

    gainNode.gain.value = 1;

    const inputVal = input.value.trim().toUpperCase(); //WASN'T IN THE JAM, BUT THANKS TO MY COMPUTER APPLICATIONS TEACHER FOR HELPING ME WITH THE LOGIC!!!
    const mappedFreq = notenames.get(inputVal);
    const finalFreq = mappedFreq || parseFloat(inputVal);

    if (!isNaN(finalFreq)) {
        frequency(finalFreq, oscillator);  // sets pitch and freq
        drawWave();                        // uses freq to draw (help from my prof again :())
    }
}